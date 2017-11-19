<?php
/**
 * Update info of Teacher, Grader, and Student account
 * @author: Tu Nguyen
 * @version: 1.2
 */
    //require "../pdoconfig.php";
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    require_once "../util/input_validate.php";
    
    $requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $requesterSessionId = $_POST["requester_session_id"];
    $allowedType = array("Admin", "Teacher");

    $request = $_POST["request"];

    //Sanitize the input
    $request = sanitize_input($request);

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);


    /*
    Client must specify what they want to change in $request parameter
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
        default: http_response_code(400);
                echo "Unrecognized request string.";          
    }


    

    function updateType()
    {
        $id = $_POST["id"];
        $type = $_POST["type"];

        $requesterType = $_POST["requester_type"];

        //Sanitize the input
        $id = sanitize_input($id);
        $type = sanitize_input($type);
        
        //Ensure input is well-formed
        validate_numbers_letters($id);

        //Validate only admin can change admin account
        if(strcmp($requesterType, 'Admin') != 0 && strcmp($type, 'Admin') == 0)
        {
            http_response_code(400);
            $conn = null;
            die("Unauthorized access. You must be an admin to chanage an admin account.");
        }

        //Delete all records that matching with the account id in account table
        //=> Delete all roles and add those from the request

        $sqlDeleteAllRoles = "DELETE FROM faculty WHERE faculty_id LIKE :id";
        sqlExecute($sqlDeleteAllRoles, array(':id'=>$id), False);
        

        foreach ($type as $theType)
        {

            $sqlAddAccount = "INSERT INTO faculty(faculty_id, type)
                            VALUES (:id, :type)";

            sqlExecute($sqlAddAccount, array(':id'=>$id, ':type'=>$theType), False);

        }
        
    }

    function updateInfo()
    {
        $id = $_POST["id"];
        $fname = $_POST["f_name"];
        $lname = $_POST["l_name"];
        $email = $_POST["email"];

        //Sanitize the input
        $id = sanitize_input($id);
        $fname = sanitize_input($fname);
        $lname = sanitize_input($lname);
        $email = sanitize_input($email);
        
        //Ensure input is well-formed
        validate_numbers_letters($id);
        validate_email($email);
        validate_numbers_letters($fname);
        validate_numbers_letters($lname);

        $sqlUpdateUser = "UPDATE user
                        SET f_name = :fname, l_name = :lname, email = :email
                        WHERE user_id LIKE :id";
        
        sqlExecute($sqlUpdateUser, array(':fname'=>$fname, ':lname'=>$lname, ':email'=>$email, ':id'=>$id), False);
    }

    function updateState()
    {
        $id = $_POST["id"];
        $state = $_POST["state"];
        $comment = $_POST["comment"];
        $editedBy = $_POST["edited_by"];

        //Sanitize the input
        $id = sanitize_input($id);
        $state = sanitize_input($state);
        $comment = sanitize_input($comment);
        $editedBy = sanitize_input($editedBy);
        
        //Ensure input is well-formed
        validate_numbers_letters($id);
        validate_numbers_letters($editedBy);


        $sqlUpdateStudent = "UPDATE student
                            SET state = :state, comment = :comment, edited_by = :edited_by
                            WHERE student_id LIKE :id";

        sqlExecute($sqlUpdateStudent, array(':state'=>$state, ':id'=>$id, ':comment'=>$comment, ':edited_by'=>$editedBy), False);
    }
?>