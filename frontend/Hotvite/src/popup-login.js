function openLogin() {
  const loginContainer = document.getElementById('login-container');

  fetch('login.html')
    .then(response => response.text())
    .then(data => {
      loginContainer.innerHTML = data;
      loginContainer.style.display = "flex";

      // Close when clicking outside
      window.onclick = function(event) {
        if (event.target === loginContainer) {
          closeLoginPopup();
        }
      }
    })
    .catch(error => console.error('Error fetching the modal content:', error));
}

document.getElementById('login-button').addEventListener('click', openLogin);

function closeLoginPopup() {
  const loginContainer = document.getElementById('login-container');
  loginContainer.style.display = "none";
}
