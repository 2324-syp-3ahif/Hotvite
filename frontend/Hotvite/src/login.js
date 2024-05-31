document.getElementById("login-form").addEventListener("submit", function (event) {
  event.preventDefault();

  var email = document.getElementById("email-input").value;
  var password = document.getElementById("password-input").value;

  var user = {
    email: email,
    password: password
  };

  fetch("http://localhost:3000/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      window.location.href = "/dashboard.html";
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Login failed. Please try again.");
    });
});
