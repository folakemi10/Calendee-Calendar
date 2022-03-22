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
$event_id = $json_obj['event_id'];
$token = $json_obj['token'];

echo $token;
echo $_SESSION['token'];

if (!hash_equals($_SESSION['token'], $token)) {
  echo json_encode(array(
    "success" => false,
    "message" => "CSRF did not pass"
  ));
  die("Request forgery detected");
}


$stmt = $mysqli->prepare("DELETE FROM events WHERE eventid=?");
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
$stmt->close();

echo json_encode(array(
  "success" => true,
  "message" => "Event Deleted"
));
exit;
?>
