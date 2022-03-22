<?php
require 'connectdatabase.php';

ini_set("session.cookie_httponly", 1);
session_start();

header("Content-Type: application/json");

$json_str = file_get_contents("php://input");
$json_obj = json_decode($json_str, true);

$username = $_SESSION['username'];
$token = $json_obj['token'];
//arrays for storing all the events associated with that user
$eventid_arr = [];
$eventdate_arr = [];
$title_arr = [];
$starttime_arr = [];
$endtime_arr = [];
$tag_arr = [];
$group_share_id_arr = [];

//check csrf token
if (!hash_equals($_SESSION['token'], $token)) {
  echo json_encode(array(
      "success" => false,
      "message" => "CSRF did not pass"
  ));
  exit;
}

//get all events associated with current username
$stmt = $mysqli->prepare("SELECT eventid, eventdate, title, starttime, endtime, tag, groupshareid FROM events WHERE username = ?");
if (!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    echo json_encode(array(
        "success" => false,
        "message" => "Query Prep Failed"
    ));
    exit;
}

$stmt->bind_param('s', $username);
$stmt->execute();

$stmt->bind_result($eventid, $eventdate, $title, $starttime, $endtime, $tag, $group_share_id);

while ($stmt->fetch()) {
  array_push($eventid_arr, htmlentities($eventid));
  array_push($eventdate_arr, htmlentities($eventdate));
  array_push($title_arr, htmlentities($title));
  array_push($starttime_arr, htmlentities($starttime));
  array_push($endtime_arr, htmlentities($endtime));
  array_push($tag_arr, htmlentities($tag));
  array_push($group_share_id_arr, htmlentities($group_share_id));
}
$stmt->close();

echo json_encode(array(
    "success" => true,
    "message" => "Events fetched",
    "eventid_arr" => $eventid_arr,
    "eventdate_arr" => $eventdate_arr,
    "title_arr"=> $title_arr,
    "starttime_arr"=> $starttime_arr,
    "endtime_arr"=> $endtime_arr,
    "tag_arr"=> $tag_arr,
    "group_share_arr" => $group_share_id_arr
));
exit;

?>