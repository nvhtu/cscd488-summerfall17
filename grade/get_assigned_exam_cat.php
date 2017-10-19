<?php
/**
 * Gets relevant info about a grader's assigned exam_cats 
 * @author: Andrew Robinson
 * @version: 1.0
 */
    require "../auth/user_auth.php";
    require "../util/sql_exe.php";
    require_once "../util/input_validate.php";

    if(empty($_GET["requester_id"]) || empty($_GET["requester_type"])){
		http_response_code(400);
        die("Incomplete input.");
	}
    
    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
    $allowedType = array("Grader");

    //Sanitize the input
	$requesterId = sanitize_input($requesterId);
	$requesterType = sanitize_input($requesterType);

	//Ensure input is well-formed
    validate_numbers_letters($requesterId);
    
    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    
    $sql = "SELECT exam.name AS exam_name, category.name AS cat_name, exam_id, exam_category.possible_grade, grader_exam_cat_id
            FROM assigned_grader NATURAL JOIN exam_category JOIN exam USING (exam_id) JOIN category USING (cat_id)
            WHERE user_id LIKE :id AND exam.state = 'grading'";
    
    $sqlResult = sqlExecute($sql, array(':id' => $requesterId), true);

    echo json_encode($sqlResult);
?>    