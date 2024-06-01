function closeWelcomePopup() {
  document.getElementById("welcome-popup").style.display = "none";
  localStorage.setItem('welcomePopupShown', 'true');
}
function checkPopup() {
  if (!localStorage.getItem('welcomePopupShown')) {
    document.getElementById("welcome-popup").style.display = "block";
  } else {
    document.getElementById("welcome-popup").style.display = "none";
  }
}
window.onload = checkPopup;
