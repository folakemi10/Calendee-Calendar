<?php
require 'connectdatabase.php';
ini_set("session.cookie_httponly", 1);

session_start();

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

//Get event info from JSON
$group_share_id = $json_obj['share_user']; //user the event is to be shared with
$event_id = $json_obj['event_id']; //id of event to be shared
$token = $json_obj['token']; //csrf token

//check csrf
if (!hash_equals($_SESSION['token'], $token)) {
  echo json_encode(array(
    "success" => false,
    "message" => "CSRF did not pass"
  ));
  die("Request forgery detected");
}

//check if user is the one who created the event
if ($group_share_id == $_SESSION["username"]) {
  echo json_encode(array(
    "success" => false,
    "message" => "Cannot share with yourself"
  ));
  exit;
}

//get event to be shared
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

//change group share id to be the id of the event being shared
$event_group_share_id = $event_id;

//insert event under other user's username
$stmt2 = $mysqli->prepare("INSERT INTO events (eventdate, username, title, starttime, endtime, tag, groupshareid) values (?, ?, ?, ?, ?, ?, ?)");
if (!$stmt2) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    echo json_encode(array(
        "success" => false,
        "message" => "Query Prep Failed"
    ));
exit;
}

$stmt2->bind_param('ssssssi', $event_date, $group_share_id, $event_title, $event_starttime, $event_endtime, $event_tag, $event_group_share_id);
$stmt2->execute();
$stmt2->close();


echo json_encode(array(
  "success" => true,
  "message" => "Event Shared"
));
exit;
?>