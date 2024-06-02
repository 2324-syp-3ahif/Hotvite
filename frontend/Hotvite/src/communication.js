const url = "http://localhost:3000/api";

function sendRequest(route, method="GET", body=null, token=false, showLoginPrompt=true) {
  const reqest = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? 'Bearer ' + localStorage.getItem('token') : ''
    }
  };
  if (body) {
    reqest.body = JSON.stringify(body);
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
