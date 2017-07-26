export const loading = () => {
  return {
    type: 'LOADING'
  }
}

export function load() {
  return dispatch => {
    dispatch(loading())
    // return ApiService.createNewChat(name)
    //   .then(json => { return json.resp })
    //   .then(resp => dispatch(newChatCreated(resp.chat, resp.participant)))
    //   .catch(error => dispatch(errorCreatingChat('Ups!!! Server is busy now, try again later.')))
  }
}