// Wow, look at all this computer vision!

// Todo: this, lol
/* Returns: Array of fields - each field has the following shape
 * { 
 *  'label': str
 *  'constraint': lol, max length maybe
 *  'type': string for now (can be radio, options, t/f)
 *  'id': hmm.
 * }
 */
// Extension: fill in the blank (have placeholder in text attr) -> right now assumes end.
// No sense of margins - const rightWall
const path = require('path');
const Tesseract = require('tesseract.js');
const sizeOf = require('image-size');

const CONFIDENCE_MIN_THRESHOLD = 75;
const tesseract = Tesseract.create();
const CHAR_SPACE_THRESHOLD = 5; // 5 characters worth of space accoutn for a blank // (naive hack) 
const NEW_LINE_CHAR_THRESH = 1.5; // vert space in terms of char
const HEADING_THRESH = 1.2;

const extractInfo = async (srcFn) => {
    const src = `../../public/uploaded/${srcFn}`;
    const filePath = path.join(__dirname, src);
    const dimensions = sizeOf(filePath);
    const output = new Promise((resolve) => {
        tesseract.recognize(filePath, 'eng')
        .then(result => {
            try {
                resolve(parseTesseractPayload(result, dimensions));
            } catch (err) {
                console.log(`Could not parse form! ${err}`);
                resolve({"error": "Parse Failure"});
            }
        })
        .catch(error => {
            console.log("Tesseract error")
        });
    });
    return await output;
};

const parseTesseractPayload = (result, dim) => {
    const { text, confidence, blocks, paragraphs, lines, words } = result;
    
    if (confidence < CONFIDENCE_MIN_THRESHOLD) {
        throw new Error("Failed confidence test");
    }
    const rightWall = dim.width * .83; // assume .125 margin (8.5 x 11) and some human comfort -> extend by detecting vertical lines
    let fields = []; 
    let wordAccum = []; // keep appending words until trigger condition
    let headingAccum = [];
    let startx = 0;
    let starty = 0; // top left origin
    const cornerBBox = {x0: 0, x1: 0, y0: 0, y1: 0};
    let lastBBox = cornerBBox;
    const midSlice = Math.floor(words.length / 2);
    const reps = words.slice(midSlice, midSlice + 4);
    let horAcc = 0;
    let vertAcc = 0;
    let lengthAcc = 0;
    const bonusHeightOffset =.28;
    reps.forEach(repWord => {
        const { text: repText, bbox: repBBox } = repWord;
        lengthAcc += repText.trim().length;
        horAcc += repBBox.x1 - repBBox.x0;
        vertAcc += (repBBox.y1 - repBBox.y0) * (1 + bonusHeightOffset * heightBonus(repText));
    });
    const fontSize = Math.round( horAcc / lengthAcc );
    const fontHeight = Math.round( vertAcc / reps.length );
    // TODO: sanitation, consistent line heights, etc. TODO: ransac.
    const horThresh = fontSize * CHAR_SPACE_THRESHOLD;
    const vertThresh = fontHeight * NEW_LINE_CHAR_THRESH; // small font kindness
    const headingThresh = fontHeight * HEADING_THRESH + 3;
    // TODO: add incredible bonus for having adjacent line. 
    // Naive heading detection with font size
    const clearCache = (inputType = 'text') => {
        if (wordAccum.length > 0)
            fields.push({
                label: wordAccum.join(" ").replace(/^[^A-Z0-9\?\.:]+|[^A-Z0-9\?\.:]+$/ig, ''), // trim nonsense
                inputType,
                x: startx,
                y: starty
            });
        wordAccum = [];
    }
    const clearHeading = () => {
        if (headingAccum.length > 0)
            fields.push({
                label: headingAccum.join(" ").replace(/^[^A-Z0-9\?\.:]+|[^A-Z0-9\?\.:]+$/ig, ''), // trim nonsense
                inputType: 'heading'
            });
        headingAccum = [];
        viewingHeading = false;
    };
    const logNewStart = (bbox) => {
        startx = bbox.x0;
        starty = bbox.y0; // heads up: TODO KIMBERLY - need to find where the fields actually are
    };
    console.log(horThresh, vertThresh, headingThresh);
    let viewingHeading = false; // current attention
    // console.log(rightWall);
    words.forEach(word => {
        const { bbox, text } = word;
        // Abnormal font check check
        const trueHeight = Math.round((bbox.y1 - bbox.y0) / (1 + bonusHeightOffset * heightBonus(text)));
        console.log(bbox, text, trueHeight, bbox.y1 - lastBBox.y1, bbox.x0 - lastBBox.x1);
        // override heading check - if baseline is the same, then we're almost definitely continuing trend.
        // should override ->
        if (trueHeight + (viewingHeading ? 3 : 0) > headingThresh) {
            clearCache();
            if (bbox.y1 - lastBBox.y1 > vertThresh)
                clearHeading();
            if (headingAccum.length == 0) logNewStart(bbox);
            headingAccum.push(text.trim());
            viewingHeading = true;
            lastBBox = bbox;
            console.log('heading logged'); 
            // did we start new heading? Verify different line
            return;
        } else if (headingAccum.length > 0) { // did we finish a heading?
            clearHeading();
            logNewStart(bbox);
            lastBBox = bbox;
            wordAccum.push(text.trim());
            return;
        }
        let didRestart = true;
        if (bbox.y1 - lastBBox.y1 > vertThresh) { // logic for "whether two words are continuous" - distance check
            // we have a new line - was the last line complete?
            if (lastBBox.x1 + horThresh > rightWall) {
                // complete line - is there an empty line now?
                const lineGap = bbox.y1 - lastBBox.y1;
                if (lineGap > 3 * vertThresh) { // this gap is huge - info paragraph (extension: detect line)
                    clearCache('info');
                    console.log('info paragraph');
                } else if (lineGap > 2 * vertThresh) { // gap under line - it's a form
                    clearCache();
                    console.log('vert input');
                } // else no gap, continued label
            } else { // gap at end of line
                clearCache();
                console.log('eol input');
            }
        } else { // same line. check gap.
            if (lastBBox.x1 + horThresh < bbox.x0) { // horizontal gap
                clearCache();
                console.log('horizontal gap');
            } else {
                didRestart = false;
            }
        }
        if (didRestart)
            logNewStart(bbox);
        lastBBox = bbox;
        wordAccum.push(text.trim());
    });
    clearHeading();
    clearCache();
    return fields; 
};

// util
const low = 'qypgj';
const high = 'tidfhjklb';
// expensive! but that's ok
const isTall = s => s.split('').some(c => high.includes(c) || c === c.toUpperCase());
const isLow = s => s.split('').some(c => low.includes(c));
const heightBonus = s => {
    let bonus = -1; 
    if (isTall(s)) bonus += 1;
    if (isLow(s)) bonus += 1;
    return bonus;
};

module.exports.extractInfo = extractInfo;