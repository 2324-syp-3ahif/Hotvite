function openPortal() {
  const popup = document.getElementById('portal-popup');
  popup.style.display = "block";
}

function closePortal() {
  const popup = document.getElementById('portal-popup');
  popup.style.display = "none";
}

function addCloseListenerToParentWindow(){
  const popup = window.parent.document.getElementById('portal-popup');
  popup.contentWindow.document.addEventListener('click', function (event) {
    if (event.target === popup.contentWindow.document.body) {
      window.parent.closePortal();
    }
  });
}

function closeMe() {
  window.location.href = "login.html";
  window.parent.closePortal();
}

function sendLoginRequest(formElement) {
  const email = formElement.querySelector('#email-input').value;
  const password = formElement.querySelector('#password-input').value;
  const loginError = document.getElementById('login-error');

  const user = {
    email: email,
    password: password
  };

  sendRequest('/user/login', 'POST', user).then((data) => {
    localStorage.setItem("token", data.token);
    closeMe();
  }).catch(async (error) => {
    loginError.innerText = await error.text();
    loginError.style.display = 'block';
  });
}

function sendRegisterRequest(formElement) {
  const username = formElement.querySelector('#username-input').value;
  const email = formElement.querySelector('#email-input').value;
  const password = formElement.querySelector('#password-input').value;
  const registerError = document.getElementById('register-error');

  const user = {
    username: username,
    email: email,
    password: password
  };

  sendRequest('/user/signup', 'POST', user).then((data) => {
    localStorage.setItem("token", data.token);
    closeMe();
  }).catch(async (error) => {
    registerError.innerText = await error.text();
    registerError.style.display = 'block';
  });
}
