<?php
session_start();

//get session token
$csrf =  htmlentities($_SESSION['token']);
echo json_encode(array(
    "token" => $csrf
));
exit;
