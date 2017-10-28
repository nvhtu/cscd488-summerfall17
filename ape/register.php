<?php
/**
 * Register a student for an APE
 * @author: Andrew Robinson
 * @version: 1.0
 */
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
	
	//Find number of seats in exam location
	$numSeats = getMaxSeats($exam_id);
	//Find number of students currently registered
	$numRegistered = getNumRegistered($exam_id);
	
	if($numSeats > $numRegistered){//Still room in exam
		do{
			//Pick random seat number
			$seatNum = rand(1, $numSeats);
			//Re-pick if seat is taken
		}while(!isSeatOpen($seatNum, $exam_id));
		//random, valid seat has been chosen, insert into database
		sqlExecute("INSERT INTO exam_roster (exam_id, student_id, seat_num) VALUES (:exam, :student, :seat)",
				array(':exam' => $exam_id, ':student' => $student_id, ':seat' => $seatNum),
				false);
		//change student state to "Registered"
		sqlExecute("UPDATE student SET state = :state WHERE student_id LIKE :id", array(":state" => "Registered", ":id" => $student_id), false);

		echo json_encode($seatNum);
	}

	else{//No room in exam
		http_response_code(400);
		die("Exam is full");
	}	

	//Checks if seat # $seatNum in exam $exam_id is open	
	function isSeatOpen($seatNum, $exam_id){
		$sqlResult = sqlExecute("SELECT COUNT(student_id) as count FROM exam_roster WHERE exam_id = :exam AND seat_num = :seat",
					 array(':exam' => $exam_id, ':seat' => $seatNum),
					 true);
		
		return ($sqlResult[0]["count"] == 0);
	}
	
	//Gets the number of seats in the location of exam $exam_id
	function getMaxSeats($exam_id){
		$sqlResult = sqlExecute("SELECT seats FROM exam JOIN location ON (exam.location = location.loc_id) WHERE exam_id = :exam",
					 array(':exam' => $exam_id),
					 true);
		return $sqlResult[0]["seats"];
	}

	//Gets the number of students registered for exam $exam_id
	function getNumRegistered($exam_id){
		$sqlResult = sqlExecute("SELECT COUNT(student_id) as count FROM exam_roster WHERE exam_id = :exam",
					 array(':exam' => $exam_id),
					 true);
		return $sqlResult[0]["count"];
	}
?>