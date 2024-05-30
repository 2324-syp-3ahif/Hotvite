document.getElementById('registerForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const user = {

    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    username: document.getElementById('username').value
  };
  await signup(user);
});

async function signup(user) {
  /*let user = {
    username: "testname",
    email: "test@gmail.com",
    password: "123pw",
    aboutme: "about me blabla"
  }*/

  try {
    const response = await fetchRestEndpoint("http://localhost:3000/api/user/signup", "POST", user);
    console.log('Signup successful:', response);
  } catch (error) {
    console.error('Signup failed:', error);
  }
}

async function fetchRestEndpoint(route: string, method: "GET" | "POST" | "PUT" | "DELETE", data?: object) {
  let options = {method};
  if (data) {
    options.headers = {"Content-Type": "application/json"};
    options.body = JSON.stringify(data);
  }
  const res = await fetch(route, options);
  if (!res.ok) {
    const error = new Error(`${method} ${res.url} ${res.status} (${res.statusText})`);
    throw error;
  }
  if (res.status !== 204) {
    return await res.json();
  }
}

