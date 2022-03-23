/**** Login, Register, Logout Ajax ***/

let csrf_token = "";
//need to fetch csrf token with php to prevent it from being lost upon refresh
fetch("csrf.php", {
  method: "POST",
  headers: { "content-type": "application/json" },
})
  .then((response) => response.json())
  .then((data) => setToken(data.token))
  .catch((error) => console.error("Error:", error));

function setToken(token) {
  csrf_token = token;
}

//login ajax request
document
  .getElementById("login_btn")
  .addEventListener("click", loginAjax, false); // Bind the AJAX call to button click
function loginAjax(event) {
  const username = document.getElementById("username").value; // Get the username from the form
  const password = document.getElementById("password").value; // Get the password from the form

  // Make a URL-encoded string for passing POST data:
  const data = { username: username, password: password };

  fetch("login.php", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "content-type": "application/json" },
  })
    .then((response) => response.json())
    .then(function (data) {
      if (data.success) {
        csrf_token = data.token;
        //hide login & register panel
        document.getElementById("login").style.display = "none";
        document.getElementById("register").style.display = "none";
        //display logout button
        document.getElementById("logout_btn").style.display = "block";

        //clear any login and register error displays
        document.getElementById("login_alerts").innerHTML = "";
        document.getElementById("register_alerts").innerHTML = "";

        //add user's name to top of calendar
        document.getElementById("calendar_user").innerHTML =
          data.username + "'s Calendar";
        updateCalendar();
        showTheme(data.theme);
      } else {
        //display the login error in html
        document.getElementById("login_alerts").innerHTML = data.message;
      }
    })
    .catch((err) => console.error(err));

  //clear input fields
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
}

//register ajax request
document
  .getElementById("register_btn")
  .addEventListener("click", registerAjax, false); // Bind the AJAX call to button click
function registerAjax(event) {
  const new_username = document.getElementById("new_username").value; // Get the username from the form
  const new_password = document.getElementById("new_password").value; // Get the password from the form
  const confirm_password = document.getElementById("confirm_password").value; // Get the password confirmation from the form

  // Make a URL-encoded string for passing POST data:
  const data = {
    new_username: new_username,
    new_password: new_password,
    confirm_password: confirm_password,
  };

  fetch("register.php", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "content-type": "application/json" },
  })
    .then((response) => response.json())
    .then(function (data) {
      if (data.success) {
        //hide register panel
        document.getElementById("register").style.display = "none";
        document.getElementById("register_alerts").innerHTML =
          "Successful Register! Please log in.";
      } else {
        document.getElementById("register_alerts").innerHTML = data.message;
      }
    })
    .catch((err) => console.error(err));

  //clear input fields
  document.getElementById("new_username").value = "";
  document.getElementById("new_password").value = "";
  document.getElementById("confirm_password").value = "";
  document.getElementById("register_alerts").innerHTML = "";
}

//logout ajax request
document
  .getElementById("logout_btn")
  .addEventListener("click", logoutAjax, false);

function logoutAjax(event) {
  const theme = document.getElementById("theme").value;
  const data = { theme: theme };

  fetch("logout.php", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "content-type": "application/json" },
  })
    .then((response) => response.json())
    .then(function (data) {
      if (data.success) {
        console.log("You've been logged out!");

        //display login and register panel
        document.getElementById("login").style.display = "block";
        document.getElementById("register").style.display = "block";
        //hide logout button
        document.getElementById("logout_btn").style.display = "none";
        document.getElementById("dark_theme_btn").style.display = "none";
        document.getElementById("default_theme_btn").style.display = "none";

        //remove user's name from top of calendar
        document.getElementById("calendar_user").innerHTML = "";

        //hide dialog
        document.getElementById("add_event_dialog").style.display = "none";
        //delete all events from calendar
        const event_boxes = document.querySelectorAll(".event_box");
        event_boxes.forEach((event_box) => {
          console.log("deleting events from login.js");
          event_box.remove();
        });
      } else {
        console.log(data.message);
      }
    })
    .catch((error) => console.error("Error:", error));
  updateCalendar();
}
