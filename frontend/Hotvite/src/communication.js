const url = "http://localhost:3000";

function requestJSON(route){
    return fetch(`${url}${route}`)
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}
