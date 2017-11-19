<?php
/**
 * Update a location
 * @author: Andrew Robinson
 * @version: 1.0
 */
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
	require_once "../util/input_validate.php";
	
	if(empty($_POST["requester_id"]) || empty($_POST["requester_type"]) || 
	empty($_POST["loc_id"]) || empty($_POST["name"]) || empty($_POST["seats"])){
		http_response_code(400);
        die("Incomplete input.");
	}

	$requesterId = $_POST["requester_id"];
	$requesterType = $_POST["requester_type"];
	$requesterSessionId = $_POST["requester_session_id"];
    $allowedType = array("Admin", "Teacher");
	
	$id = $_POST["loc_id"];
	$name = $_POST["name"];
	$seats = $_POST["seats"];

	//Sanitize the input
	$id = sanitize_input($id);
	$name = sanitize_input($name);
	$seats = sanitize_input($seats);

	//Ensure input is well-formed
	validate_only_numbers($seats);
	validate_only_numbers($id);
	
	//User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);
	
	sqlExecute("UPDATE location SET name = :name, seats = :seats WHERE loc_id = :id",
				array(':name' => $name, ':seats' => $seats, ':id' => $id),
				false);
?>
