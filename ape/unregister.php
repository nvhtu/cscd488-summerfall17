<?php
/**
 * Unregister a student for an APE
 * @author: Andrew Robinson
 * @version: 1.0
 */
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
	require_once "../util/send_mail.php";
	
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
	
	sqlExecute("DELETE FROM exam_roster WHERE exam_id = :exam AND student_id LIKE :student",
				array(':exam' => $exam_id, ':student' => $student_id),
				false);

	//change student state to "Ready"
	sqlExecute("UPDATE student SET state = :state WHERE student_id LIKE :id", array(":state" => "Ready", ":id" => $student_id), false);

	$sqlGetStudentInfo = "SELECT f_name, l_name, email
	FROM user
	WHERE user_id LIKE :user_id";
	$theStudentInfo = sqlExecute($sqlGetStudentInfo, array(":user_id"=>$student_id), true);

	$sqlGetExamInfo = "SELECT exam.name, DATE_FORMAT(date, '%m/%d/%Y') AS date, TIME_FORMAT(start_time, '%h:%i %p') AS start_time, location.name AS location_name
	FROM exam JOIN location ON (location = loc_id)
	WHERE exam.exam_id = :exam_id";
	$theExamInfo = sqlExecute($sqlGetExamInfo, array(":exam_id"=>$exam_id), true);

	$mailSubject = "EWU APE Registration Confirmed";
	$mailMsg = "You are now unregistered for the following exam:" .
	"<br><br>" .
	$theExamInfo[0]["name"] . " on " . $theExamInfo[0]["date"] . " at " . $theExamInfo[0]["start_time"] . " in " . $theExamInfo[0]["location_name"] .
	"<br><br>" .
	"Check https://ape.compsci.ewu.edu/ for more information.";

	sendMail($theStudentInfo[0], $mailSubject, $mailMsg);

?>