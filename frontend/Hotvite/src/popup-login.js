function openLogin() {
  const loginContainer = document.getElementById('login-container');

  fetch('login.html')
    .then(response => response.text())
    .then(data => {
      loginContainer.innerHTML = data;
      const login = document.getElementById('login-popup');
      login.style.display = "flex";
      login.style.alignItems = "center";

      // Close when clicking outside
      window.onclick = function(event) {
        if (event.target === login) {
          login.style.display = "none";
        }
      }
    })
    .catch(error => console.error('Error fetching the modal content:', error));
}
document.getElementById('login-button').addEventListener('click', openLogin);
