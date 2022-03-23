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
    $theme = $json_obj['theme'];
    $username = $_SESSION['username'];

    //update theme upon logout
    $stmt = $mysqli->prepare("UPDATE users SET theme=? WHERE username=?");

    if (!$stmt) {
        printf("Query Prep Failed: %s\n", $mysqli->error);
        echo json_encode(array(
            "success" => false,
            "message" => "Query Prep Failed"
        ));
        exit;
    }

    $stmt->bind_param('ss', $theme, $username);
    $stmt->execute();
    $stmt->close();

    session_destroy();

    echo json_encode(array(
        "success" => true,
        "message" => "Logout succesful and theme updated"
    ));
    exit;
    ?>