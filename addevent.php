<?php
require 'connectdatabase.php';
ini_set("session.cookie_httponly", 1);

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

//Accessing Variables
$username = $_SESSION['username'];
$title = $json_obj['title'];
$start_date = $json_obj['startdate'];
$end_date = $json_obj['enddate'];
$tag = $json_obj['tag'];


$stmt = $mysqli->prepare("INSERT into events () values ()");

if(!$stmt){
  echo json_encode(array(
    "success" => false
  ));
  exit;
}

$to_insert->bind_param('', );
$to_insert->execute();
$to_insert->close();
