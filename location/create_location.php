<?php
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
	require_once "../util/input_validate.php";
	
	if(empty($_POST["requester_id"]) || empty($_POST["requester_type"]) || empty($_POST["name"]) || empty($_POST["seats"])){
		var_dump(http_response_code(400));
        die("Incomplete input.");
	}

	$requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher");
	
	$name = $_POST["name"];
	$seats = $_POST["seats"];

	//Sanitize the input
	$requesterId = sanitize_input($requesterId);
	$requesterType = sanitize_input($requesterType);
	$name = sanitize_input($name);
	$seats = sanitize_input($seats);

	//Ensure input is well-formed
	validate_only_numbers($seats);
	validate_only_numbers($requesterId);
	
	//User authentication
    user_auth($requesterId, $requesterType, $allowedType);
	
	sqlExecute("INSERT INTO location (name, seats) VALUES (:name, :seats)",
				array(':name' => $name, ':seats' => $seats),
				false);
?>
