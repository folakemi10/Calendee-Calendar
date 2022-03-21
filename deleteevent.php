<?php
require 'connectdatabase.php';
ini_set("session.cookie_httponly", 1);

session_start();

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Accessing Variables
$user_id = $_SESSION['user_id'];
$event_id = $json_obj['event_id'];
$title = $json_obj['title'];
$start_date = $json_obj['startdate'];
$end_date = $json_obj['enddate'];
$start_time = $json_obj['starttime'];
$end_time = $json_obj['endtime'];
$tag = $json_obj['tag'];
$token = $json_obj['token'];

if (!hash_equals($_SESSION['token'], $token)) {
  echo json_encode(array(
    "success" => false,
    "message" => "CSRF did not pass"
  ));
  die("Request forgery detected");
}


$stmt = $mysqli->prepare("DELETE FROM events () values () WHERE event_id=?");

if (!$stmt) {
  echo json_encode(array(
    "success" => false
  ));
  exit;
}

$stmt->bind_param('i', $event_id);
$stmt->execute();
$stmt->close();
