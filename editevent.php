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
$event_id =  htmlentities($json_obj['event_id']);
$title =  htmlentities($json_obj['edit_title']);
$start_time = htmlentities($json_obj['edit_starttime']);
$end_time = htmlentities($json_obj['edit_endtime']);
$tag = htmlentities($json_obj['edit_tag']);
$token = htmlentities($json_obj['token']);

if (!hash_equals($_SESSION['token'], $token)) {
  echo json_encode(array(
    "success" => false,
    "message" => "CSRF did not pass"
  ));
  die("Request forgery detected");
}

//edit event
$stmt = $mysqli->prepare("UPDATE events SET title=?, starttime=?, endtime=?, tag=? WHERE eventid=?");

if (!$stmt) {
  printf("Query Prep Failed: %s\n", $mysqli->error);
  echo json_encode(array(
      "success" => false,
      "message" => "Query Prep Failed"
  ));
  exit;
}

$stmt->bind_param('ssssi', $title, $start_time, $end_time, $tag, $event_id);
$stmt->execute();
$stmt->close();

echo json_encode(array(
  "success" => true,
  "message" => "Event Edited"
));
exit;
