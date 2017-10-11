<?php
/**
 * Gets the number of students registered for
 * each exam_cat assigned to requesting grader
 * @author: Andrew Robinson
 * @version: 1.0
 */
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    require_once "../util/input_validate.php";
    
    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
    $allowedType = array("Grader");

    //Sanitize the input
	$requesterId = sanitize_input($requesterId);
    $requesterType = sanitize_input($requesterType);

	//Ensure input is well-formed
    validate_only_numbers($requesterId);
    
    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    
    $sql = "SELECT grader_exam_cat_id, exam_id, cat_id, (SELECT COUNT(student_id)
                                                 FROM exam_roster ER
                                                 WHERE ER.exam_id = E.exam_id) num_student
            FROM assigned_grader NATURAL JOIN exam_category NATURAL JOIN exam E
            WHERE user_id = :requester_id AND E.state = 'grading'";
    
    $sqlResult = sqlExecute($sql, array(':requester_id' => $requesterId), true);

    echo json_encode($sqlResult);
?>    