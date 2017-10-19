<?php
    require_once "sql_exe.php";  
     
     
    function checkExamExists($examId)
    {
        $sqlCheckExists = "SELECT COUNT(*) as count
                                FROM exam
                                WHERE exam_id LIKE :exam_id";
        $sqlResult = sqlExecute($sqlCheckExists, array('exam_id'=>$examId), TRUE);

        if($sqlResult[0]["count"] == 0)
        {
            http_response_code(400);
            return False;
        }
        else {
            return True;
        }
    }
    
    function checkStudentExists($studentId)
    {
        $sqlCheckExists = "SELECT COUNT(*) as count
                                FROM student
                                WHERE student_id LIKE :student_id";
        $sqlResult = sqlExecute($sqlCheckExists, array('student_id'=>$studentId), TRUE);

        if($sqlResult[0]["count"] == 0)
        {
            http_response_code(400);
            return False;
        }
        else {
            return True;
        }
    }

    function checkUserExists($accountId)
    {
        $sqlCheckExists = "SELECT COUNT(*) as count
                                FROM user
                                WHERE user_id LIKE :user_id";
        $sqlResult = sqlExecute($sqlCheckExists, array('user_id'=>$accountId), TRUE);

        if($sqlResult[0]["count"] == 0)
        {
            http_response_code(400);
            return False;
        }
        else {
            return True;
        }
    }

    function checkNotStudentExists($accountId)
    {
        $sqlCheckExists = "SELECT COUNT(*) as count
                                FROM faculty
                                WHERE faculty_id LIKE :faculty_id";
        $sqlResult = sqlExecute($sqlCheckExists, array('faculty_id'=>$accountId), TRUE);

        if($sqlResult[0]["count"] == 0)
        {
            http_response_code(400);
            return False;
        }
        else {
            return True;
        }
    }

    function checkGraderExamCatExists($examCatId)
    {
        $sqlCheckExists = "SELECT COUNT(*) as count
                                FROM assigned_grader
                                WHERE grader_exam_cat_id = :grader_exam_cat_id";
        $sqlResult = sqlExecute($sqlCheckExists, array('grader_exam_cat_id'=>$examCatId), TRUE);

        if($sqlResult[0]["count"] == 0)
        {
            http_response_code(400);
            return False;
        }
        else {
            return True;
        }
    }
?>