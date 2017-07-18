<?php
    require "../pdoconfig.php";
    require "../auth/acc_auth.php";

    
    $authId = $_POST["auth_id"];
    $authType = $_POST["auth_type"];

    $id = $_POST["id"];
    $fname = $_POST["f_name"];
    $lname = $_POST["l_name"];
    $email = $_POST["email"];
    $type = $_POST["type"];

    //Validate admin auth
    admin_auth($authId, $authType, $server, $database, $user, $pass, $conn);
    
    //Validate only admin can create admin account
    if(strcmp($authType, 'Admin') != 0 && strcmp($type, 'Admin') == 0)
    {
        var_dump(http_response_code(400));
        $conn = null;
        die("Unauthorized access. You must be an admin to create an admin account.");
    }

    //Validate strings not empty

    //Validate strings

    
    $conn = openDB($server, $database, $user, $pass, $conn);

    $sql = $conn->prepare("INSERT INTO user (id, f_name, l_name, email) 
                            VALUES (:id, :fname, :lname, :email)");   

    //Student account
    if(strcmp($type, "Student") == 0)
    {
        $state = $_POST["state"];
        $sql2 = $conn->prepare("INSERT INTO student (id, state)
                            VALUES (:id, :state)");

        try
        {
            $sql2->execute(array(':id'=>$id, ':state'=>$state));
        }
        catch (PDOException $e)
        {
            echo $e->getMessage();
            var_dump(http_response_code(400));
        }
    }
    else 
    {
        $sql2 = $conn->prepare("INSERT INTO account (id, type)
                            VALUES (:id, :type)");
        
        try
        {
            $sql2->execute(array(':id'=>$id, ':type'=>$type));
        }
        catch (PDOException $e)
        {
            echo $e->getMessage();
            var_dump(http_response_code(400));
        }
    }

    try
    {
        $sql->execute(array(':id'=>$id, ':fname'=>$fname, ':lname'=>$lname, ':email'=>$email));
    }
    catch (PDOException $e)
    {
        echo $e->getMessage();
        var_dump(http_response_code(400));
    }
    
    $conn = null;


?>    