document.getElementById('register-form').addEventListener('submit', async function (event) {
  event.preventDefault();

  const url = 'http://localhost:3000/api/user/signup';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImVtYWlsIjoidGVzdDEyQGdtYWlsLmNvbSJ9LCJleHAiOjE3MTYxNDI5MjAuMDA4LCJpYXQiOjE3MTYxNDExMjB9.Rqj2bdC2J0zCoEjoRb3FASRIvp0bnxtohhNBUcFQTrA';

  const username = document.getElementById('username-input').value;
  const email = document.getElementById('email-input').value;
  const password = document.getElementById('password-input').value;
  //const aboutMe = document.getElementById('about-me-input').value;

  const user = {
    username: username,
    email: email,
    password: password,
    //about_me: aboutMe
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(user)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const result = await response.json();
    alert('Registration successful: ' + JSON.stringify(result));
  } catch (error) {
    alert('There was a problem with the registration: ' + error.message);
  }
});
