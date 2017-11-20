<?php
/**
 * Create new exam
 * @author: Aaron Griffis
 * @version: 1.1
 */
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    require_once "../util/input_validate.php";

    $requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $requesterSessionId = $_POST["requester_session_id"];
    $allowedType = array("Admin", "Teacher");

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);

    $name = $_POST["name"];
    $quarter = $_POST["quarter"];
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

    $sqlInsertExam = "INSERT INTO exam (name, quarter, date, location, state, possible_grade, passing_grade, duration, start_time, cutoff)
                                   VALUES (:name, :quarter, :exam_date, :location, :state, :possible_grade, :passing_grade, :duration, STR_TO_DATE(:start_time, '%h:%i %p'), :cutoff)";
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
        ':cutoff' => $cutoff
    );

    $lastInsertId = sqlExecute($sqlInsertExam, $data, false);

    /*
    //get ID of exam that was just inserted
    $sqlInsertExam = "SELECT exam_id from exam ORDER BY exam_id DESC LIMIT 1";
    $data = null;
    $exam_id = sqlExecute($sqlInsertExam, $data, true)[0]["exam_id"];*/

    //Add exam to in_class_exam if account is teacher
    if(strcmp($requesterType, "Teacher") == 0) //Teacher account
    {
        $sqlInsertInClass = "INSERT INTO in_class_exam (exam_id, teacher_id)
                             VALUES (:exam_id, :teacher_id)";
        $data = array(':exam_id' => $lastInsertId, ':teacher_id' => $requesterId);
        $exam = sqlExecute($sqlInsertInClass, $data, false);
    }

    echo $lastInsertId;
?>