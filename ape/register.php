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
    /*user_auth($requesterId, $requesterType, $allowedType);
	
	//Authenticate student being registered
	$allowedType = array("Student");
	user_auth($student_id, "Student", $allowedType);*/
	
	//Find open seat/check if there are any open seats
	$numSeats = getMaxSeats($exam_id);
	
	for($seatNum = 1; !isSeatOpen($seatNum, $exam_id) && $seatNum <= $numSeats; $seatNum++);

	if($seatNum > $numSeats){
		var_dump(http_response_code(400));
		die("Exam is full");
	}
	
	sqlExecute("INSERT INTO exam_roster (exam_id, student_id, seat_num) VALUES (:exam, :student, :seat)",
				array(':exam' => $exam_id, ':student' => $student_id, ':seat' => $seatNum),
				false);
				
	function isSeatOpen($seatNum, $exam_id){
		$sqlResult = sqlExecute("SELECT COUNT(student_id) as count FROM exam_roster WHERE exam_id = :exam AND seat_num = :seat",
					 array(':exam' => $exam_id, ':seat' => $seatNum),
					 true);
		
		return ($sqlResult[0]["count"] == 0);
	}
	
	function getMaxSeats($exam_id){
		$sqlResult = sqlExecute("SELECT seats FROM exam JOIN location ON (exam.location = location.loc_id) WHERE exam_id = :exam",
					 array(':exam' => $exam_id),
					 true);
		return $sqlResult[0]["seats"];
	}
?>