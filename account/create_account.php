<?php
    //require "../pdoconfig.php";
    require "../auth/user_auth.php";
    require "../util/sql_exe.php";

    
    $requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher");

    $id = $_POST["id"];
    $fname = $_POST["f_name"];
    $lname = $_POST["l_name"];
    $email = $_POST["email"];
    $type = $_POST["type"];

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    /*
    //Validate only admin can create admin account
    if(strcmp($authType, 'Admin') != 0 && strcmp($type, 'Admin') == 0)
    {
        var_dump(http_response_code(400));
        $conn = null;
        die("Unauthorized access. You must be an admin to create an admin account.");
    }
    */

    //Validate strings not empty

    //Validate strings

    

    $sqlInsertUser = "INSERT INTO user (user_id, f_name, l_name, email) 
            VALUES (:id, :fname, :lname, :email)";  
    sqlExecute($sqlInsertUser, array(':id'=>$id, ':fname'=>$fname, ':lname'=>$lname, ':email'=>$email), False);

    
    if(strcmp($type, "Student") == 0) //Student account
    {
        $state = $_POST["state"];
        $sqlInsertStudent = "INSERT INTO student (student_id, state)
                            VALUES (:id, :state)";

        sqlExecute($sqlInsertStudent, array(':id'=>$id, ':state'=>$state), False);
    }
    else //Admin, Teacher, Grader account
    {
        $sqlInsertAccount= "INSERT INTO account (account_id, type)
                            VALUES (:id, :type)";
        
        sqlExecute($sqlInsertAccount, array(':id'=>$id, ':type'=>$type), False);
    }

    $conn = null;


?>    