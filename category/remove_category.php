<?php
/**
 * Remove a category
 * @author: Andrew Robinson
 * @version: 1.0
 */
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
	require_once "../util/input_validate.php";
	
	if(empty($_POST["requester_id"]) || empty($_POST["requester_type"]) || empty($_POST["cat_id"])){
		http_response_code(400);
        die("Incomplete input.");
	}

	$requesterId = $_POST["requester_id"];
	$requesterType = $_POST["requester_type"];
	$requesterSessionId = $_POST["requester_session_id"];
    $allowedType = array("Admin");
	
	$id = $_POST["cat_id"];
	
	//Sanitize the input
	$id = sanitize_input($id);

	//Ensure input is well-formed
	validate_only_numbers($id);
	
	//User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);
	
	sqlExecute("DELETE FROM category WHERE cat_id = :id",
				array(':id' => $id),
				false);
?>