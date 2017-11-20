<?php
/**
 * Update exam info
 * @author: Aaron Griffis
 * @version: 1.1
 */
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    require_once "../util/input_validate.php";
    
    $requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $requesterSessionId = $_POST["requester_session_id"];
    $request = $_POST["request"];
    $allowedType = array("Admin", "Teacher");
    
    //Sanitize the input
    $request = sanitize_input($request);

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);

    switch($request)
    {
        case "update_all": updateAll();
                            break;

        case "update_state": updateState();
                            break;

    }

    function updateAll()
    {
        $name = $_POST["name"];
        $exam_id = $_POST["exam_id"];
        $quarter = $_POST["quarter"];   //Shouldn't come from the user! Use date to determine quarter
        $date = $_POST["date"];
        $location = $_POST["location"];
        $state = $_POST["state"];
        $possible_grade = $_POST["possible_grade"];
        $passing_grade = $_POST["passing_grade"];
        $duration = $_POST["duration"];
        $start_time = $_POST["start_time"];
        $cutoff = $_POST["cutoff"];

        //Sanitize the input
        $name = sanitize_input($name);
        $quarter = sanitize_input($quarter);
        $name = sanitize_input($name);
        $date = sanitize_input($date);
        $location = sanitize_input($location);
        $state = sanitize_input($state);
        $possible_grade = sanitize_input($possible_grade);
        $passing_grade = sanitize_input($passing_grade);
        $duration = sanitize_input($duration);
        $start_time = sanitize_input($start_time);
        $cutoff = sanitize_input($cutoff);

        //Ensure input is well-formed
        validate_date($date);
        validate_only_numbers($location);
        validate_exam_state($state);
        validate_only_numbers($possible_grade);
        validate_only_numbers($passing_grade);
        validate_only_numbers($duration);
        //validate_time($start_time);
        validate_only_numbers($cutoff);
    
        //If teacher, exam must be their own
        if(strcmp($requesterType, 'Teacher') == 0)
        {
            checkTeacherExam();
        }
    
        $sqlUpdateExam = "UPDATE exam
                            SET name = :name,
                                quarter = :quarter,
                                date = :exam_date,
                                location = :location,
                                state = :state,
                                possible_grade = :possible_grade,
                                passing_grade = :passing_grade,
                                duration = :duration,
                                start_time = STR_TO_DATE(:start_time, '%h:%i %p'),
                                cutoff = :cutoff
                            WHERE exam_id = :exam_id";
        $data = array(
                ':name' => $name,  
                ':quarter' => $quarter,
                ':exam_date' => $date,
                ':location' => $location,
                ':state' => $state,
                ':possible_grade' => $possible_grade,
                ':passing_grade' => $passing_grade,
                ':duration' => $duration,
                ':start_time' => $start_time,
                ':cutoff' => $cutoff,
                ':exam_id' => $exam_id
            );
        sqlExecute($sqlUpdateExam, $data, false);
    }

    function updateState()
    {
        $exam_id = $_POST["exam_id"];
        $state = $_POST["state"];

        $exam_id = sanitize_input($exam_id);
        $state = sanitize_input($state);

        validate_only_numbers($exam_id);
        validate_exam_state($state);

        $sqlUpdateState = "UPDATE exam
                            SET state = :state
                            WHERE exam_id = :exam_id";
        
        $data = array(
            ':state' => $state,
            ':exam_id' => $exam_id
        );

        sqlExecute($sqlUpdateState, $data, false);
    }

    function checkTeacherExam()
    {
        $requesterId = $_POST["requester_id"];
        $exam_id = $_POST["exam_id"];

        $exam_id = sanitize_input($exam_id);
        $requesterId = sanitize_input($requesterId);

        validate_only_numbers($exam_id);
        validate_numbers_letters($requesterId);

        $sqlSelectId = "SELECT teacher_id
        FROM in_class_exam
        WHERE exam_id = :exam_id";
        $data = array(':exam_id' => $exam_id);
        $teacher_id = sqlExecute($sqlSelectId, $data, true);

        if( strcmp($teacher_id[0]["teacher_id"], $requesterId) != 0 ) 
        {
            http_response_code(400);
            die("Unauthorized access. Only the teacher that created this exam may edit it.");
        }

        return true;
    }  
?>