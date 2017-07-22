<?php
    require_once "../util/sql_exe.php";  
     
     
    function checkExamExists($examId)
    {
        $sqlCheckExists = "SELECT COUNT(*) as count
                                FROM exam
                                WHERE exam_id LIKE :exam_id";
        $sqlResult = sqlExecute($sqlCheckExists, array('exam_id'=>$examId), TRUE);

        if($sqlResult[0]["count"] == 0)
        {
            var_dump(http_response_code(400));
            die("Exam ID does not exist.");
        }
    }
    
    function checkStudentExists($studentId)
    {
        $sqlCheckExists = "SELECT COUNT(*) as count
                                FROM student
                                WHERE student_id = :student_id";
        $sqlResult = sqlExecute($sqlCheckExists, array('student_id'=>$studentId), TRUE);

        if($sqlResult[0]["count"] == 0)
        {
            var_dump(http_response_code(400));
            die("Student ID does not exist.");
        }
    }
?>