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
