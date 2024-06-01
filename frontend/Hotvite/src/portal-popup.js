function openLogin() {
  const loginContainer = document.getElementById('portal-popup');
  loginContainer.style.display = "block";
  loginContainer.contentWindow.document.addEventListener('click', function(event) {
    if (event.target === loginContainer.contentWindow.document.body) {
      closeLoginPopup();
    }
  });
}

function closeLoginPopup() {
  const loginContainer = document.getElementById('portal-popup');
  loginContainer.style.display = "none";
}

