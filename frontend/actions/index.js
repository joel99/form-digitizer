// Action creators here
import fetch from 'isomorphic-fetch';
import * as types from './types';
import { REQUEST_STATUS } from '../constants'; 
import history from './history';

// Upload Form Image - called from home, user input image upload
// TODO: Verify json shape (THIS IS THE BOUNDARY!)
// TODO: remove hash mark on react router
const photo_route = "process_photo";
const get_form_route = "get_form";
export function uploadFormImage(formInfo) {
    return (dispatch, getState) => {
        dispatch(updateFetchStatus(REQUEST_STATUS.REQUESTING));
        let packagedData = new FormData();
        packagedData.append("form_image", formInfo.file);
        fetch(`/api/${photo_route}`, {
            method: 'POST',
            body: packagedData
        })
        .then(response => response.json())
        .then(json => {
            if (json.formData) {
                const { _id:id, ...formData } = json.formData; 
                dispatch(loadFormInfo(formData));
                dispatch(updateFetchStatus(REQUEST_STATUS.SUCCESS));
                history.push(`/forms/${id}`)
            } else {
                dispatch(updateFetchStatus(REQUEST_STATUS.ERROR));
            }
        });
    }
}

export function getFormImage(formId) {
    return (dispatch, getState) => {
        dispatch(updateFetchStatus(REQUEST_STATUS.REQUESTING));
        fetch(`/api/${get_form_route}/${formId}`, {
            method: 'POST',
            body: { id: formId }
        })
        .then(response => response.json())
        .then(json => {
            console.log("ello");
            console.log(json.formData);
            if (json.formData) {
                const { _id:id, ...formData } = json.formData; 
                dispatch(loadFormInfo(formData));
                dispatch(updateFetchStatus(REQUEST_STATUS.SUCCESS));
            } else {
                dispatch(updateFetchStatus(REQUEST_STATUS.ERROR));
            }
        });
    }
}

// Helpers
// startFetching - submitted to server, or fresh load of form view page
export const updateFetchStatus = (status) => ({
    type: types.UPDATE_FORM_FETCH,
    status
});

export const loadFormInfo = (formData) => ({
    type: types.LOAD_FORM_INFO,
    formData
});