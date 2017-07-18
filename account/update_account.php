<?php
    require "../pdoconfig.php";
    require "../auth/acc_auth.php";

    
    $authId = $_POST["auth_id"];
    $authType = $_POST["auth_type"];

    $request = $_POST["request"];

     //Validate admin auth
    admin_auth($authId, $authType, $server, $database, $user, $pass, $conn);
    

    $conn = openDB($server, $database, $user, $pass, $conn);
    

    /*
    Client must specify what they want to change in $request parameter
    if request ==
    "update_type": requires "id" and "type"
    "update_type_info": requires "id", "type", "f_name", "l_name", "email"
    "update_info": requires "id", "f_name", "l_name", "email"
    "update_state": requires "id" and "state"
    "update_state_info": requires "id", "state", "f_name", "l_name", "email"
    */

    //Validate strings not empty

    //Validate strings


    switch ($request)
    {
        case "update_type": updateType($conn);
                            break;
        case "update_type_info":
                            updateType($conn);
                            updateInfo($conn);
                            break;
        case "update_info":
                            updateInfo($conn);
                            break;
        case "update_state":
                            updateState($conn);
                            break; 
        case "update_state_info":
                            updateState($conn);
                            updateInfo($conn);
                            break;                  
    }


    

    function updateType($conn)
    {
        $id = $_POST["id"];
        $type = $_POST["type"];

        $authType = $_POST["auth_type"];

        //Validate only admin can change admin account
        if(strcmp($authType, 'Admin') != 0 && strcmp($type, 'Admin') == 0)
        {
            var_dump(http_response_code(400));
            $conn = null;
            die("Unauthorized access. You must be an admin to chanage an admin account.");
        }

        $sql = $conn->prepare("UPDATE account
                                SET type = '$type'
                                WHERE id = $id");

        try
        {
            $sql->execute();
        }
        catch (PDOException $e)
        {
            var_dump(http_response_code(400));
        }
    }

    function updateInfo($conn)
    {
        $id = $_POST["id"];
        $fname = $_POST["f_name"];
        $lname = $_POST["l_name"];
        $email = $_POST["email"];

        $sql = $conn->prepare("UPDATE user
                                SET f_name = '$fname', l_name = '$lname', email = '$email'
                                WHERE id = $id");

        try
        {
            $sql->execute();
        }
        catch (PDOException $e)
        {
            var_dump(http_response_code(400));
        }
    }

    function updateState($conn)
    {
        $id = $_POST["id"];
        $state = $_POST["state"];
        $sql = $conn->prepare("UPDATE student
                                SET state = '$state'
                                WHERE id = $id");

        try
        {
            $sql->execute();
        }
        catch (PDOException $e)
        {
            var_dump(http_response_code(400));
        }
    }
?>