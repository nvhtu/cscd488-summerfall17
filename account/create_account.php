<?php
    require "../pdoconfig.php";
    require "../auth/admin_auth.php";


    
    $authId = $_POST["auth_id"];
    $authType = $_POST["auth_type"];
    
    $id = $_POST["id"];
    $fname = $_POST["f_name"];
    $lname = $_POST["l_name"];
    $email = $_POST["email"];
    $type = $_POST["type"];

    //Validate auth
    admin_auth($authId, $authType, $server, $database, $user, $pass, $conn);

    //Validate strings not empty

    //Validate strings
    
    $conn = openDB($server, $database, $user, $pass, $conn);

    $sql = $conn->prepare("INSERT INTO user (id, f_name, l_name, email) 
                            VALUES ($id, '$fname', '$lname', '$email')");   

    //Student account
    if(strcmp($type, "Student") == 0)
    {
        $state = $_POST["state"];
        $sql2 = $conn->prepare("INSERT INTO student (id, state)
                            VALUES ($id, '$state')");
    }
    else 
    {
        $sql2 = $conn->prepare("INSERT INTO account (id, type)
                            VALUES ($id, '$type')");
    }

    try
    {
        $sql->execute();
        $sql2->execute();
    }
    catch (PDOException $e)
    {
        echo $e->getMessage();
        var_dump(http_response_code(400));
    }
    
    $conn = null;


?>    