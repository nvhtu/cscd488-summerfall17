<?php
/**
 * Finds student_id based on exam_id and seat_num, then
 * adds grade using add_cat_grade.php
 * @author: Andrew Robinson
 * @version: 1.0
 */
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    require_once "../util/input_validate.php";
    
    $requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher", "Grader");

    $seatNum = $_POST["seat_num"];
    $examId = $_POST["exam_id"];

    //Sanitize the input
	$requesterId = sanitize_input($requesterId);
    $requesterType = sanitize_input($requesterType);
    $seatNum = sanitize_input($seatNum);
    $examId = sanitize_input($examId);

	//Ensure input is well-formed
    validate_numbers_letters($requesterId);
    validate_only_numbers($seatNum);
    validate_only_numbers($examId);
    
    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    
    $sql = "SELECT student_id
            FROM exam_roster
            WHERE exam_id = :exam_id AND seat_num = :seat_num";
    
    $sqlResult = sqlExecute($sql, array(':exam_id' => $examId, ':seat_num' => $seatNum), true);

    $_POST["student_id"] = $sqlResult[0]["student_id"];

    require "./add_cat_grade.php";
?>    