<?php
/**
 * Create new Teacher, Grader, and Student account
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
    $allowedType = array("Admin", "Teacher", "System");

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);

    /*
    //Validate only admin can create admin account
    if(strcmp($authType, 'Admin') != 0 && strcmp($type, 'Admin') == 0)
    {
        http_response_code(400);
        $conn = null;
        die("Unauthorized access. You must be an admin to create an admin account.");
    }
    */
    
    if(strcmp($requesterType,"System") != 0)
    {
        $id = $_POST["id"];
        $fname = $_POST["f_name"];
        $lname = $_POST["l_name"];
        $email = $_POST["email"];
        $type = $_POST["type"];

        createAccount($id, $fname, $lname, $email);

        if(in_array("Student", $type)) //Student account
        {
            $state = $_POST["state"];
            createStudentAccount($id, $state);
            $isInclass = $_POST["is_inclass"];
            $teacherId = $_POST["teacher_id"];
            if($isInclass == "true")
            {
                createInClassStudent($id, $teacherId);
            }
        }
        else //Teacher, Grader account
        {
            foreach ($type as $theType)
            {
                createFacultyAccount($id, $theType);
            }
        }
    
        echo $id;
    }
    
    


    function createAccount($id, $fname, $lname, $email)
    {
        $sqlInsertUser = "INSERT INTO user (user_id, f_name, l_name, email) 
        VALUES (:id, :fname, :lname, :email)";  
        sqlExecute($sqlInsertUser, array(':id'=>$id, ':fname'=>$fname, ':lname'=>$lname, ':email'=>$email), False);
    }

    function createStudentAccount($id, $state)
    {
        $sqlInsertStudent = "INSERT INTO student (student_id, state)
        VALUES (:id, :state)";
        sqlExecute($sqlInsertStudent, array(':id'=>$id, ':state'=>$state), False);
    }

    function createFacultyAccount($id, $type)
    {
        $sqlAddAccount = "INSERT INTO faculty(faculty_id, type)
        VALUES (:id, :type)";
        sqlExecute($sqlAddAccount, array(':id'=>$id, ':type'=>$type), False);
    }

    function createInClassStudent($studentId, $teacherId)
	{
        require_once "../settings/init_settings.php";

        if(!isset($GLOBALS["settings"]))
        initializeSettings();

		$sqlInsertInClassStudent = "INSERT INTO in_class_student (student_id, teacher_id, start_date, end_date) 
									VALUES (:student_id, :teacher_id, :start_date, :end_date)";  
		sqlExecute($sqlInsertInClassStudent, array(':student_id'=>$studentId, ':teacher_id'=>$teacherId, ':start_date'=>$GLOBALS["settings"]["curQuarterStart"], ':end_date'=>$GLOBALS["settings"]["curQuarterEnd"]), False);
	}
?>    