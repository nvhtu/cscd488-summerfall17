<?php
/**
 * Update info of Teacher, Grader, and Student account
 * @author: Tu Nguyen
 * @version: 1.2
 */
    //require "../pdoconfig.php";
    require "../auth/user_auth.php";
    require "../util/sql_exe.php";
    
    $requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher");

    $request = $_POST["request"];

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);


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
        case "update_type": updateType();
                            break;
        case "update_type_info":
                            updateType();
                            updateInfo();
                            break;
        case "update_info":
                            updateInfo();
                            break;
        case "update_state":
                            updateState();
                            break; 
        case "update_state_info":
                            updateState();
                            updateInfo();
                            break;    
        default: var_dump(http_response_code(400));          
    }


    

    function updateType()
    {
        $id = $_POST["id"];
        $type = $_POST["type"];

        $requesterType = $_POST["requester_type"];

        //Validate only admin can change admin account
        if(strcmp($requesterType, 'Admin') != 0 && strcmp($type, 'Admin') == 0)
        {
            var_dump(http_response_code(400));
            $conn = null;
            die("Unauthorized access. You must be an admin to chanage an admin account.");
        }

        $sqlUpdateAccount = "UPDATE account
                            SET type = :type
                            WHERE account_id = :id";

        sqlExecute($sqlUpdateAccount, array(':type'=>$type, ':id'=>$id), False);
    }

    function updateInfo()
    {
        $id = $_POST["id"];
        $fname = $_POST["f_name"];
        $lname = $_POST["l_name"];
        $email = $_POST["email"];

        $sqlUpdateUser = "UPDATE user
                        SET f_name = :fname, l_name = :lname, email = :email
                        WHERE user_id = :id";
        
        sqlExecute($sqlUpdateUser, array(':fname'=>$fname, ':lname'=>$lname, ':email'=>$email, ':id'=>$id), False);
    }

    function updateState()
    {
        $id = $_POST["id"];
        $state = $_POST["state"];

        $sqlUpdateStudent = "UPDATE student
                            SET state = :state
                            WHERE student_id = :id";

        sqlExecute($sqlUpdateStudent, array(':state'=>$state, ':id'=>$id), False);
    }
?>