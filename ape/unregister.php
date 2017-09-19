<?php
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
	
	$requesterId = $_POST["requester_id"];
    $requesterType = $_POST["requester_type"];
    $allowedType = array("Admin", "Teacher", "Student");
	
	//TODO: validate id is set/valid
	$student_id = $_POST["student_id"];
	$exam_id = $_POST["exam_id"];
	
	//User authentication
    user_auth($requesterId, $requesterType, $allowedType);
	
	//Authenticate student being registered
	$allowedType = array("Student");
	user_auth($student_id, "Student", $allowedType);
	
	sqlExecute("DELETE FROM exam_roster WHERE exam_id = :exam AND student_id = :student",
				array(':exam' => $exam_id, ':student' => $student_id),
				false);

	//change student state to "Ready"
	sqlExecute("UPDATE student SET state = :state", array(':state' => "Ready"), false);
?>