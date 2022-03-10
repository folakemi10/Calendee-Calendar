<?php
require("connnect database.php");
header("Content-Type: application/json");



//get all events associated with current username
$stmt = $mysqli->prepare("SELECT title, startTime, endTime FROM events WHERE username = ?");
if(!$stmt){
  printf("Query Prep Failed: %s\n", $mysqli->error);
  exit;
}

$stmt->bind_param('i', $username);
$stmt->execute();
$stmt->bind_result($username, $title, $startTime, $endTime);

$stmt->close();

?>