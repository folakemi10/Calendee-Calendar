<?php
require 'connectdatabase.php';

ini_set("session.cookie_httponly", 1);
session_start();

header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

//Variables can be accessed as such:
$username = $_SESSION["username"];
$token = $json_obj['token'];
$new_theme = $json_obj['theme'];

if (!hash_equals($_SESSION['token'], $token)) {
  echo json_encode(array(
    "success" => false,
    "message" => "CSRF did not pass"
  ));
  exit;
}

if ($new_theme != null){
    //update theme if changed
    $stmt = $mysqli->prepare("UPDATE users SET theme=? WHERE username=?");

    if (!$stmt) {
        echo json_encode(array(
            "success" => false,
            "message" => "Query Prep1 Failed"
        ));
        exit;
    }

    $stmt->bind_param('ss', $new_theme, $username);
    $stmt->execute();
    $stmt->close();
}

//get theme in database
$stmt2 = $mysqli->prepare("SELECT COUNT(*), theme FROM users WHERE username=?");
if (!$stmt) {
    echo json_encode(array(
        "success" => false,
        "message" => "Query Prep2 Failed"
    ));
    exit;
}

$stmt2->bind_param('s', $username);
$stmt2->execute();

$stmt2->bind_result($cnt, $theme);
$stmt2->fetch();
$stmt2->close();


echo json_encode(array(
    "success" => true,
    "theme" => $theme
));
exit;
?>