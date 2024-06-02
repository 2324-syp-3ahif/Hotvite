const url = "http://localhost:3000/api";

function requestJSON(route){
    return fetch(`${url}${route}`)
        .then(response => {
            if (!response) {
                return {};
            }
            return response.json()
        }).catch(error => console.error('Response-Error:', error));
}

function sendRequest(route, method="GET", body=null, token=false, showLoginPrompt=true) {
  const reqest = {
    method: method,
    headers: {
      'Authorization': token ? 'Bearer ' + localStorage.getItem('token') : ''
    }
  };
  if (body) {
    reqest.body = body;
  }
  return fetch(`${url}${route}`, reqest).then(response => {
    if (response.ok) return response.json();
    else throw response;
  }).catch(response => {
    if (response.status === 401 && showLoginPrompt) {
      openPortal();
    } else {
      console.error('Response-Error:', response);
    }
  });
}
