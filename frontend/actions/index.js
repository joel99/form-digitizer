// Action creators here
import fetch from 'isomorphic-fetch';
import * as types from './types';
import { REQUEST_STATUS } from '../constants'; 

// Upload Form Image - called from home, user input image upload
// TODO: Verify json shape (THIS IS THE BOUNDARY!)
const photo_route = "process_photo";
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
                dispatch(updateFetchStatus(REQUEST_STATUS.NOT_REQUESTING));
                dispatch(loadFormInfo(json.formData));
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