function openPortal() {
  const popup = document.getElementById('portal-popup');
  popup.style.display = "block";
  popup.contentWindow.document.addEventListener('click', function (event) {
    if (event.target === popup.contentWindow.document.body) {
      closePortal();
    }
  });
}

function closePortal() {
  const popup = document.getElementById('portal-popup');
  popup.style.display = "none";
}

function closeMe() {
  window.parent.closePortal();
}

function sendLoginRequest(formElement) {
  const email = formElement.querySelector('#email-input').value;
  const password = formElement.querySelector('#password-input').value;

  const user = {
    email: email,
    password: password
  };

  fetch('http://localhost:3000/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
    .then(response => response.json())
    .then(data => {
      localStorage.setItem("token", data.token);
      closeMe();
    })
    .catch(error => {
      console.error('Error:', error);
      // Now do something with the error
    });
}

function sendRegisterRequest(formElement) {
  const username = formElement.querySelector('#username-input').value;
  const email = formElement.querySelector('#email-input').value;
  const password = formElement.querySelector('#password-input').value;

  const user = {
    username: username,
    email: email,
    password: password
  };

  fetch('http://localhost:3000/api/user/register', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
    .then(response => response.json())
    .then(data => {
      console.log('Registration successful:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
