<?php
/**
 * Remove all exam categories with passed in exam_id.
 * Delete will cascade to remove entries in assigned_grader table.
 * @author: Andrew Robinson
 * @version: 1.0
 */
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
	require_once "../util/input_validate.php";
	
	if(empty($_POST["requester_id"]) || empty($_POST["requester_type"]) || empty($_POST["exam_id"])){
		http_response_code(400);
        die("Incomplete input.");
	}

	$requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher");
	
	$id = $_POST["exam_id"];
	
	//Sanitize the input
	$requesterId = sanitize_input($requesterId);
	$requesterType = sanitize_input($requesterType);
	$id = sanitize_input($id);

	//Ensure input is well-formed
	validate_only_numbers($id);
	validate_numbers_letters($requesterId);

	//User authentication
    user_auth($requesterId, $requesterType, $allowedType);
	
	sqlExecute("DELETE FROM exam_category WHERE exam_id = :id",
				array(':id' => $id),
				false);
?>