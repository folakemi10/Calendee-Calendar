<?php
require 'connectdatabase.php';

ini_set("session.cookie_httponly", 1);
session_start();

header("Content-Type: application/json");

$json_str = file_get_contents("php://input");
$json_obj = json_decode($json_str, true);

//Variables:
$username = $_SESSION['username'];
$new_event_date = $json_obj['add_event_date'];
$new_title = $json_obj['add_title'];
$new_starttime = $json_obj['add_starttime'];
$new_endtime = $json_obj['add_endtime'];
$new_tag = $json_obj['add_tag'];
$token = $json_obj['token'];

$new_group_share = "";


//check csrf token
if (!hash_equals($_SESSION['token'], $token)) {
    echo json_encode(array(
        "success" => false,
        "message" => "CSRF did not pass"
    ));
    die("Request forgery detected");
}

$stmt = $mysqli->prepare("INSERT INTO events (eventdate, username, title, starttime, endtime, tag, group_share) values (?, ?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    echo json_encode(array(
        "success" => false,
        "message" => "Query Prep Failed"
    ));
    exit;
}

$stmt->bind_param('sssssss', $new_event_date, $username, $new_title, $new_starttime, $new_endtime, $new_tag, $new_group_share);
$stmt->execute();

$stmt->close();

echo json_encode(array(
    "success" => true,
    "message" => "Event Added"
));
exit;
?>
