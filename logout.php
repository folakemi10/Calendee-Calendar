<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logout</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <?php
    ini_set("session.cookie_httponly", 1);

    session_start();
    session_destroy();
    
    echo json_encode(array(
        "success" => false
    ));
    exit;
    ?>
</body>

</html>