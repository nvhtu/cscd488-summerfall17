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

    function checkUserExists($accountId)
    {
        $sqlCheckExists = "SELECT COUNT(*) as count
                                FROM user
                                WHERE user_id = :user_id";
        $sqlResult = sqlExecute($sqlCheckExists, array('user_id'=>$accountId), TRUE);

        if($sqlResult[0]["count"] == 0)
        {
            var_dump(http_response_code(400));
            die("User ID does not exist.");
        }
    }

    function checkNotStudentExists($accountId)
    {
        $sqlCheckExists = "SELECT COUNT(*) as count
                                FROM account
                                WHERE account_id = :account_id";
        $sqlResult = sqlExecute($sqlCheckExists, array('account_id'=>$accountId), TRUE);

        if($sqlResult[0]["count"] == 0)
        {
            var_dump(http_response_code(400));
            die("Admin/Teacher/Grader Account ID does not exist.");
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
            var_dump(http_response_code(400));
            die("Assigned Grader on exame category ID does not exist.");
        }
    }
?>