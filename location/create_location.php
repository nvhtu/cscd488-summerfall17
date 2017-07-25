<?php
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
	
	$requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher");
	
	//TODO: validate name and seats are set/valid
	$name = $_POST["name"];
	$seats = $_POST["seats"];
	
	//User authentication
    user_auth($requesterId, $requesterType, $allowedType);
	
	sqlExecute("INSERT INTO location (name, seats) VALUES (:name, :seats)",
				array(':name' => $name, ':seats' => $seats),
				false);
?>
