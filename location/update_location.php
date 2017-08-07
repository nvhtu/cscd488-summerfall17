<?php
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
	require_once "../util/input_validate.php";
	
	if(empty($_POST["requester_id"]) || empty($_POST["requester_type"]) || 
	empty($_POST["id"]) || empty($_POST["name"]) || empty($_POST["seats"])){
		var_dump(http_response_code(400));
        die("Incomplete input.");
	}

	$requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher");
	
	$id = $_POST["id"];
	$name = $_POST["name"];
	$seats = $_POST["seats"];

	//Sanitize the input
	$requesterId = sanitize_input($requesterId);
	$requesterType = sanitize_input($requesterType);
	$id = sanitize_input($id);
	$name = sanitize_input($name);
	$seats = sanitize_input($seats);

	//Ensure input is well-formed
	validate_only_numbers($seats);
	validate_only_numbers($id);
	validate_only_numbers($requesterId);
	
	//User authentication
    user_auth($requesterId, $requesterType, $allowedType);
	
	sqlExecute("UPDATE location SET name = :name, seats = :seats WHERE loc_id = :id",
				array(':name' => $name, ':seats' => $seats, ':id' => $id),
				false);
?>
