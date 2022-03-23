<?php
require 'connectdatabase.php';
ini_set("session.cookie_httponly", 1);

session_start();

header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json

session_destroy();

echo json_encode(array(
    "success" => true,
    "message" => "Logout succesful and theme updated"
));
exit;
