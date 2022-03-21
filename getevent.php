<?php
require 'connectdatabase.php';

ini_set("session.cookie_httponly", 1);
session_start();

header("Content-Type: application/json");

$json_str = file_get_contents("php://input");
$json_obj = json_decode($json_str, true);

$username = $_SESSION['username'];
$eventid = $json_obj['event_id'];
$token = $json_obj['token'];

//variables for storing all the info associated with that event
$eventdate;
$title;
$starttime;
$endtime;
$tag;
$group_share;

//check csrf token
if (!hash_equals($_SESSION['token'], $token)) {
  echo json_encode(array(
      "success" => false,
      "message" => "CSRF did not pass"
  ));
  die("Request forgery detected");
}

//get all events associated with current username
$stmt = $mysqli->prepare("SELECT eventdate, title, starttime, endtime, tag, group_share FROM events WHERE event_id = ? AND username = ?");
if (!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    echo json_encode(array(
        "success" => false,
        "message" => "Query Prep Failed"
    ));
    exit;
}

$stmt->bind_param('is', $event_id, $username);
$stmt->execute();

$stmt->bind_result($eventdate, $title, $starttime, $endtime, $tag, $group_share);
$stmt->close();

echo json_encode(array(
    "success" => true,
    "message" => "Event fetched",
    "eventdate" => $eventdate,
    "title"=> $title,
    "starttime"=> $starttime,
    "endtime"=> $endtime,
    "tag"=> $tag,
    "group_share" => $group_share
));
exit;

?>