
<?php
require 'connectdatabase.php';

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);
$theme = "default";
$new_username =  htmlentities($json_obj['new_username']);
$new_password =  htmlentities($json_obj['new_password']);
$confirm_password = htmlentities($json_obj['confirm_password']);

//get new username
if (empty(trim($new_username))) {
    $username_err = "Please input a valid username.";
} else if (!preg_match('/^[\w_\.\-]+$/', $new_username)) {
    $username_err = "Invalid username. Please only use letters, numbers, and underscores.";
} else {
    //check for duplicate username
    //referenced from https://stackoverflow.com/questions/5378427/php-mysql-check-for-duplicate-entry
    $duplicate_select = $mysqli->query("SELECT * FROM users WHERE username = '$new_username'");
    $num_rows = mysqli_num_rows($duplicate_select);
    if ($num_rows) {
        $username_err = "This username is already taken.";
    }
}

//get new password
if (empty(trim($new_password))) {
    $password_err = "Please input a password.";
}

//ask to confirm new password
if (empty(trim($confirm_password))) {
    $confirm_password_err = "Please confirm your password.";
} else {
    if ($new_password != $confirm_password) {
        $confirm_password_err = "Password did not match.";
    }
}

//confirm there are no signup errors before entering into database
if (!empty($username_err)) {
    echo json_encode(array(
        "success" => false,
        "message" => $username_err
    ));
    exit;
} else if (!empty($password_err)) {
    echo json_encode(array(
        "success" => false,
        "message" => $password_err
    ));
    exit;
} else if (!empty($confirm_password_err)) {
    echo json_encode(array(
        "success" => false,
        "message" => $confirm_password_err
    ));
    exit;
} else {
    //no errors, insert into database

    //hash password
    $password_hash = password_hash($new_password, PASSWORD_DEFAULT);

    //empty string for shared_with
    $shared_with = "";

    $stmt = $mysqli->prepare("INSERT INTO users (username, password, shared_with, theme) VALUES (?, ?, ?, ?)");
    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }

    $stmt->bind_param('ssss', $new_username, $password_hash, $shared_with, $theme);

    $stmt->execute();

    $stmt->close();

    echo json_encode(array(
        "success" => true,
    ));
    exit;
}
?>
