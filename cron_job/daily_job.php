<?php

    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    require_once "../util/input_validate.php";
    require_once "../util/send_mail.php";
    date_default_timezone_set('America/Los_Angeles');

    sendExamReminder();
    function sendExamReminder()
    {
        $sqlOpenExams = "SELECT exam.exam_id, exam.name, exam.date, TIME_FORMAT(start_time, '%h:%i %p') AS start_time, location.name AS location_name
							FROM exam JOIN location ON (location = loc_id)
							WHERE exam.state LIKE 'Open'";
        $openExamsArr = sqlExecute($sqlOpenExams, array(), true);
        
        $today = new DateTime(date("Y-m-d"));

        foreach ($openExamsArr as $theExam)
        {
            $examDate = new DateTime($theExam["date"]);
            if(date_diff($today, $examDate)->days == 7)
            {
                sendMailAllStudents($theExam);
            }
        }


    }

    function sendMailAllStudents($theExam)
    {
        $sqlGetExamRoster = "SELECT f_name, l_name, email
        FROM exam_roster JOIN user ON (student_id = user_id)
        WHERE exam_id = :exam_id";
        $sqlResultExamRoster = sqlExecute($sqlGetExamRoster, array(":exam_id"=>$theExam["exam_id"]), true);

        $mailSubject = "Your EWU APE is coming up next week";
		

        foreach ($sqlResultExamRoster as $theStudent)
        {
            $mailMsg = "This is a reminder that your exam is comming up next week:" .
            "<br><br>" .
            $theExam["name"] . " on " . $theExam["date"] . " at " . $theExam["start_time"] . " in " . $theExam["location_name"] .
            "<br><br>" .
            "Check https://ape.compsci.ewu.edu/ for more information.";

            sendMail($theStudent, $mailSubject, $mailMsg);
        }
    }
?>