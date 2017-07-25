export const loading = () => {
    return {
        type: 'HOME_LOADING'
    }
}

export const loadingDone = (songs) => {
    return {
        type: 'HOME_LOADING_DONE',
        payload: {
            songs
        }
    }
}

export const loadingError = (message) => {
    return {
        type: 'HOME_LOADING_ERROR',
        payload: {
            message
        }
    }
}

export function load() {
    return dispatch => {
        dispatch(loading())
        setTimeout(() => {
            dispatch(loadingDone([]))
        }, 2000);
    }
}