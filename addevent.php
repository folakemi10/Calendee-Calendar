<?php
require 'connectdatabase.php';
ini_set("session.cookie_httponly", 1);

header("Content-Type: application/json");
session_start();

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

//Variables:
$username = $_SESSION['username'];
$new_event_date = $json_obj['add_event_date'];
$new_title = $json_obj['add_title'];
$new_starttime = $json_obj['add_starttime'];
$new_endtime = $json_obj['add_endtime'];
$new_tag = $json_obj['add_tag'];
$token = $json_obj['token'];

//if tags were cleared (none checked)
if($new_tag == null){
    $new_tag = "None";
  }

//sharing info is empty when event is added
$new_group_share_id = null;

//echo "session token: " + $_SESSION['token'];
//check csrf token
if (!hash_equals($_SESSION['token'], $token)) {
    echo json_encode(array(
        "success" => false,
        "message" => "CSRF did not pass"
    ));
    die("Request forgery detected");
  }

$stmt = $mysqli->prepare("INSERT INTO events (eventdate, username, title, starttime, endtime, tag, groupshareid) values (?, ?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    echo json_encode(array(
        "success" => false,
        "message" => "Query Prep Failed"
    ));
exit;
}

$stmt->bind_param('ssssssi', $new_event_date, $username, $new_title, $new_starttime, $new_endtime, $new_tag, $new_group_share_id);
$stmt->execute();
$stmt->close();

echo json_encode(array(
    "success" => true,
    "message" => "Event Added"
));
exit;
?>

