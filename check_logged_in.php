<?php
//php to ensure user is still logged in after refresh
ini_set("session.cookie_httponly", 1);
session_start();

if (isset($_SESSION['username'])) {
    //logged in
    echo json_encode(array(
		"success" => true,
        "username" => $_SESSION['username']
	));
	exit;
}
else {
    //not logged in
    echo json_encode(array(
		"success" => false,
        "username" => ''
	));
	exit;
}
?>