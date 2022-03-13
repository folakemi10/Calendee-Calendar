<?php
session_start();

//get session token
$csrf = $_SESSION['token'];
echo json_encode(array(
    "token" => $csrf
));
exit;

?>
