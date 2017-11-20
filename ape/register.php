<?php
/**
 * Register a student for an APE
 * @author: Andrew Robinson
 * @version: 1.0
 */
	require_once "../util/sql_exe.php";
	require_once "../auth/user_auth.php";
	require_once "../util/send_mail.php";
	require_once "../util/input_validate.php";
	
	$requesterId = $_POST["requester_id"];
	$requesterType = $_POST["requester_type"];
	$requesterSessionId = $_POST["requester_session_id"];
    $allowedType = array("Admin", "Teacher", "Student");
	
	//TODO: validate id is set/valid
	$student_id = $_POST["student_id"];
	$exam_id = $_POST["exam_id"];

	//Sanitize the input
    $exam_id = sanitize_input($exam_id);
    $student_id = sanitize_input($student_id);

    //Ensure input is well-formed
	validate_numbers_letters($student_id);
    validate_only_numbers($exam_id);
	
	//User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);
	
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

		$sqlGetStudentInfo = "SELECT f_name, l_name, email
								FROM user
								WHERE user_id LIKE :user_id";
		$theStudentInfo = sqlExecute($sqlGetStudentInfo, array(":user_id"=>$student_id), true);
		
		$sqlGetExamInfo = "SELECT exam.name, DATE_FORMAT(date, '%m/%d/%Y') AS date, TIME_FORMAT(start_time, '%h:%i %p') AS start_time, location.name AS location_name
							FROM exam JOIN location ON (location = loc_id)
							WHERE exam.exam_id = :exam_id";
		$theExamInfo = sqlExecute($sqlGetExamInfo, array(":exam_id"=>$exam_id), true);
		
		$mailSubject = "EWU APE Registration Confirmed";
		$mailMsg = "You are now registered for the following exam:" .
					"<br><br>" .
					$theExamInfo[0]["name"] . " on " . $theExamInfo[0]["date"] . " at " . $theExamInfo[0]["start_time"] . " in " . $theExamInfo[0]["location_name"] .
					"<br><br>" .
					"Check https://ape.compsci.ewu.edu/ for more information.";
		
		sendMail($theStudentInfo[0], $mailSubject, $mailMsg);

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