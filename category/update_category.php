<?php
/**
 * Update a category
 * @author: Andrew Robinson
 * @version: 1.0
 */
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
	require_once "../util/input_validate.php";
	
	if(empty($_POST["requester_id"]) || empty($_POST["requester_type"]) || empty($_POST["name"]) || empty($_POST["cat_id"])){
		http_response_code(400);
        die("Incomplete input.");
	}

	$requesterId = $_POST["requester_id"];
	$requesterType = $_POST["requester_type"];
	$requesterSessionId = $_POST["requester_session_id"];
    $allowedType = array("Admin", "Teacher");

	$id = $_POST["cat_id"];
	$name = $_POST["name"];
	
	//Sanitize the input
	$name = sanitize_input($name);
	$id = sanitize_input($id);

	//Ensure input is well-formed
	validate_only_numbers($id);

	//User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);

	sqlExecute("UPDATE category SET name = :name WHERE cat_id = :id",
				array(':name' => $name, ':id' => $id),
				False);
?>
