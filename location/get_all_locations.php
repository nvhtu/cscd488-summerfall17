<?php
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
	
	$requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher");
	
	//User authentication
    user_auth($requesterId, $requesterType, $allowedType);
	
	$sqlResult = sqlExecute("SELECT * FROM location",
				 array(),
				 true);

	echo json_encode($sqlResult);
?>
