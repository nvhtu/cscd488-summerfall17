<?php

    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    require_once "../util/input_validate.php";
    require_once "../util/send_mail.php";
    date_default_timezone_set('America/Los_Angeles');

    checkExamState();

    function checkExamState()
    {
        $today = new DateTime(date("Y-m-d"));
        $curHour = strtotime(date("H:i:s"));

        //check Open Exams, change to In_Progress
        $sqlOpenExams = "SELECT exam_id, name, date, start_time
        FROM exam
        WHERE state LIKE 'Open'";
        $openExamsArr = sqlExecute($sqlOpenExams, array(), true);

        foreach ($openExamsArr as $theExam)
        {
            $examDate = new DateTime($theExam["date"]);
            $examStart = strtotime($theExam["start_time"]);

            if(date_diff($today, $examDate)->days == 0)
            {
                if($curHour >= $examStart)
                {
                    changeState($theExam["exam_id"], "In_Progress");
                }
            } 
        }
        

        //check In_Progress Exams, change to Grading
        $sqlInProgressExams = "SELECT exam_id, name, date, start_time, duration
        FROM exam
        WHERE state LIKE 'In_Progress'";
        $InProgressExamsArr = sqlExecute($sqlInProgressExams, array(), true);

        foreach ($InProgressExamsArr as $theExam)
        {
            //$examDate = new DateTime($theExam["date"]);
            $examEnd = strtotime($theExam["start_time"]) + 60*60*$theExam["duration"];

            if($curHour >= $examEnd)
            {
                changeState($theExam["exam_id"], "Grading");
            }
        }

        
    }

    function changeState($examId, $stateTo)
    {
        $sqlUpdateState = "UPDATE exam
        SET state = :state
        WHERE exam_id = :exam_id";

        sqlExecute($sqlUpdateState, array(':state' => $stateTo,':exam_id' => $examId), false);
    }
?>