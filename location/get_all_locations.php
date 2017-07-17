<?php
	require "../pdoconfig.php";
	
	$conn = openDB($server, $database, $user, $pass, $conn);
	$sql = $conn->prepare("SELECT * 
							FROM location");
	
	try
	{
		$sql->execute();
	}
	catch (PDOException $e)
	{
		var_dump(http_response_code(400));
	}
	
	$sqlResult = $sql->fetchall(PDO::FETCH_ASSOC);
	echo json_encode($sqlResult);
	$conn = null;
?>