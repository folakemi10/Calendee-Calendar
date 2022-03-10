<?php
require 'connectdatabase.php';

header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$username = $json_obj['username'];
$password = $json_obj['password'];

$stmt = $mysqli->prepare("SELECT COUNT(*), username, password FROM users WHERE username=?");
if (!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

$stmt->bind_param('s', $username);
$stmt->execute();

$stmt->bind_result($cnt, $username, $pwd_hash);
$stmt->fetch();

if ($cnt == 1 && password_verify($password, $pwd_hash)) {

    ini_set("session.cookie_httponly", 1);
    session_start();
    $_SESSION['username'] = $username;
    $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));

    echo json_encode(array(
        "success" => true,
        "token" =>  $_SESSION['token'],
        "username"  => $username
    ));
    exit;
} else {
    echo json_encode(array(
        "success" => false,
        "message" => "Incorrect Username or Password"
    ));

    echo "login failed";
    exit;
}
?>F