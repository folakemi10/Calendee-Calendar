<?php
require 'connectdatabase.php';

ini_set("session.cookie_httponly", 1);
session_start();

header("Content-Type: application/json");

$json_str = file_get_contents("php://input");
$json_obj = json_decode($json_str, true);

$username = htmlentities($_SESSION['username']);
$event_id = htmlentities($json_obj['event_id']);
$token = htmlentities($json_obj['token']);



//check csrf token
if (!hash_equals($_SESSION['token'], $token)) {
  echo json_encode(array(
      "success" => false,
      "message" => "CSRF did not pass"
  ));
}

//get event that was clicked
$stmt = $mysqli->prepare("SELECT eventdate, title, starttime, endtime, tag, groupshareid FROM events WHERE eventid = ?");
if (!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    echo json_encode(array(
        "success" => false,
        "message" => "Query Prep Failed"
    ));
    exit;
}

$stmt->bind_param('i', $event_id);
$stmt->execute();

$stmt->bind_result($event_date, $event_title, $event_starttime, $event_endtime, $event_tag, $event_group_share_id);
$stmt->fetch();
$stmt->close();  

echo json_encode(array(
    "success" => true,
    "message" => "Event fetched",
    "eventdate" => $event_date,
    "title"=> $event_title,
    "starttime"=> $event_starttime,
    "endtime"=> $event_endtime,
    "tag"=> $event_tag,
    "group_share" => $event_group_share_id
));
exit;
