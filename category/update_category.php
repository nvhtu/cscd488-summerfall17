<?php
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
	
	$requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher");
	
	//TODO: validate name and id are set/valid
	$id = $_POST["id"];
	$name = $_POST["name"];
	
	//User authentication
    user_auth($requesterId, $requesterType, $allowedType);
	//echo "after auth";
	sqlExecute("UPDATE category SET name = :name WHERE cat_id = :id",
				array(':name' => $name, ':id' => $id),
				False);
?>
