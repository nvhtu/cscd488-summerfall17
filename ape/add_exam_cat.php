<?php
/**
 * Add a category to an exam
 * @author: Andrew Robinson
 * @version: 1.0
 */
    require_once "../util/sql_exe.php";
    require_once "../auth/user_auth.php";
    require_once "../util/input_validate.php";
    
    if(empty($_POST["requester_id"]) || empty($_POST["requester_type"]) || empty($_POST["exam_id"])
        || empty($_POST["cat_id"]) || empty($_POST["possible_grade"])){
		http_response_code(400);
        die("Incomplete input.");
	}
    $requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher");

    $examId = $_POST["exam_id"];
    $catId = $_POST["cat_id"];
    $possibleGrade = $_POST["possible_grade"];

    //Sanitize the input
	$requesterId = sanitize_input($requesterId);
	$requesterType = sanitize_input($requesterType);
    $examId = sanitize_input($examId);
    $catId = sanitize_input($catId);
    $possibleGrade = sanitize_input($possibleGrade);

    //Ensure input is well-formed
    validate_numbers_letters($requesterId);
    validate_only_numbers($examId);
    validate_only_numbers($catId);
    validate_only_numbers($possibleGrade);

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    //Add record to exam_category table
    $sql = "INSERT INTO exam_category(cat_id, exam_id, possible_grade)
                        VALUES (:cat_id, :exam_id, :possible_grade)";
    
    $lastInsertId = sqlExecute($sql, array(':cat_id'=>$catId, ':exam_id'=>$examId, ':possible_grade'=>$possibleGrade), False);
    
    echo $lastInsertId;
?>    