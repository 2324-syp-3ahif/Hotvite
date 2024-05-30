document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const user = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };
  await login(user);
});

async function login(user) {
  try {
    const response = await fetchRestEndpoint("http://localhost:3000/api/user/login", "GET", user);
    console.log('Login successful:', response);
  } catch (error) {
    console.error('Login failed:', error);
  }
}

async function fetchRestEndpoint(route, method: "GET" | "POST" | "PUT" | "DELETE", data?) {
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
