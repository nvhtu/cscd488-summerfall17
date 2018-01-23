<?php
/**
 * Get an exam roster
 * If grades are required, this file processes all grades operations before return the roster with grades,
 * Grades operations peformed including calculating avg grade, add avg grade to table student_cat_grade if in diff range,
 * add overall grade to table exam_grade if all cat grades have been graded.
 * @author: Tu Nguyen
 * @version: 1.3
 */
    require_once "../auth/user_auth.php";
    require_once "../util/sql_exe.php";
    require_once "../util/input_validate.php";
    require_once "../util/check_id.php";

    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
    $requesterSessionId = $_GET["requester_session_id"];
    
    $allowedType = array("Admin", "Teacher");

    $systemId = "999999";
    
    //User authentication
    user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId);

    if(strcmp($requesterType,"System") != 0)
    {
        $examId = $_GET["exam_id"];
        $getGrade = $_GET["get_grade"];

        if($getGrade == 0)
        {
            $sqlGetRoster = "SELECT student_id, f_name, l_name, seat_num
            FROM exam_roster JOIN user ON exam_roster.student_id LIKE user.user_id
            WHERE exam_id = :exam_id";
        
            $sqlResult = sqlExecute($sqlGetRoster, array(":exam_id"=>$examId), true);
            echo json_encode($sqlResult);
        }
        else 
        {
            $_POST["requester_id"] = "999999";
            $_POST["requester_type"] = "System";
            $_POST["requester_session_id"] = "000";
            require_once "../grade/add_final_cat_grade.php";
            require_once "../grade/add_exam_grade.php";

            $sqlGetRosterStudents = "SELECT student_id, f_name, l_name, seat_num, email, possible_grade, passing_grade, exam.state
            FROM exam_roster JOIN user ON exam_roster.student_id LIKE user.user_id
            JOIN exam ON exam_roster.exam_id = exam.exam_id
            WHERE exam_roster.exam_id = :exam_id";
        
            $sqlStudentsResult = sqlExecute($sqlGetRosterStudents, array(":exam_id"=>$examId), true);
            $isGradingFinished = true;
            
            for ($i=0; $i<count($sqlStudentsResult); $i++)
            {
                $studentId = $sqlStudentsResult[$i]["student_id"];


                    $sqlResultStudentAllCats = getStudentAllCats($studentId, $examId);
                    $sqlResultCatGrades = getStudentCatGrades($studentId, $examId);

                    
                    //add categories array for each student
                    $sqlStudentsResult[$i]["cats"] = array();

                    $catHasGradeCounter = 0;
                    $isGradingFinished = true;
                    $isFinalGradeGenerated = true;

                    for ($theCat=0; $theCat<count($sqlResultStudentAllCats); $theCat++)
                    {

                        if($sqlResultStudentAllCats[$theCat]["avg_grade"] != null)
                            $catHasGradeCounter++;

                        //add an array for each individual category within the cats array
                        $sqlStudentsResult[$i]["cats"][$theCat] = array();

                        //add data to the new array
                        $sqlStudentsResult[$i]["cats"][$theCat]["exam_cat_id"] = $sqlResultStudentAllCats[$theCat]["exam_cat_id"];
                        $sqlStudentsResult[$i]["cats"][$theCat]["name"] = $sqlResultStudentAllCats[$theCat]["name"];          
                        $sqlStudentsResult[$i]["cats"][$theCat]["possible_grade"] = $sqlResultStudentAllCats[$theCat]["possible_grade"];
                        //add an array for the graders of the individual category
                        $sqlStudentsResult[$i]["cats"][$theCat]["graders_grades"] = array();

                        $gradeArr = array();
                        for ($theGraderCat=0; $theGraderCat<count($sqlResultCatGrades); $theGraderCat++)
                        {
                            if ($sqlResultCatGrades[$theGraderCat]["exam_cat_id"] == $sqlResultStudentAllCats[$theCat]["exam_cat_id"])
                            {
                                //Fill the grader array with key = grader's name and value = grade given
                                $sqlStudentsResult[$i]["cats"][$theCat]["graders_grades"][$sqlResultCatGrades[$theGraderCat]["grader_name"]] = $sqlResultCatGrades[$theGraderCat]["grade"];
                                array_push($gradeArr, $sqlResultCatGrades[$theGraderCat]["grade"]);
                            }
                            
                        }


                        if(checkStudentCatGradeExists($studentId, $sqlResultStudentAllCats[$theCat]["exam_cat_id"]))
                        {
                            //grade has been manually changed by admin
                            if(checkCommentExists($studentId, $sqlResultStudentAllCats[$theCat]["exam_cat_id"]))
                            {
                                $_GET["requester_id"] = "999999";
                                $_GET["requester_type"] = "System";
                                require_once "../grade/get_final_cat_grade.php";

                                $sqlResultFinalGrade = getStudentFinalCatGrade($studentId, $sqlResultStudentAllCats[$theCat]["exam_cat_id"]);
                                $sqlStudentsResult[$i]["cats"][$theCat]["final_grade"] = $sqlResultFinalGrade[0]["final_grade"];
                                $sqlStudentsResult[$i]["cats"][$theCat]["comment"] = $sqlResultFinalGrade[0]["comment"];
                                $sqlStudentsResult[$i]["cats"][$theCat]["edited_by"] = $sqlResultFinalGrade[0]["edited_by"];
                            }
                            else 
                            {
                                if(strcmp($sqlStudentsResult[$i]["state"],"Archived") != 0)
                                {
                                    //if a final category grade is able to be automatically generated
                                    if(updateFinalCatGrade($studentId, $sqlResultStudentAllCats[$theCat]["exam_cat_id"], $gradeArr, $sqlResultStudentAllCats[$theCat]["avg_grade"], $systemId))
                                    {
                                        //add the final grade for the category
                                        $sqlStudentsResult[$i]["cats"][$theCat]["final_grade"] = $sqlResultStudentAllCats[$theCat]["avg_grade"];
                                    }
                                    else
                                    {
                                        $sqlStudentsResult[$i]["cats"][$theCat]["final_grade"] = false;
                                        $isFinalGradeGenerated = false;
                                    } 
                                    $sqlStudentsResult[$i]["cats"][$theCat]["comment"] = "";
                                    $sqlStudentsResult[$i]["cats"][$theCat]["edited_by"] = "";
                                }
                                //archived exam, no grade generation
                                else
                                {
                                    $sqlStudentsResult[$i]["cats"][$theCat]["final_grade"] = $sqlResultStudentAllCats[$theCat]["avg_grade"];
                                    $sqlStudentsResult[$i]["cats"][$theCat]["comment"] = "";
                                    $sqlStudentsResult[$i]["cats"][$theCat]["edited_by"] = "";
                                }

                               
                            }
                        }
                        else
                        {   if(strcmp($sqlStudentsResult[$i]["state"],"Archived") != 0)
                            {
                                //if a final category grade is able to be automatically generated
                                if(updateFinalCatGrade($studentId, $sqlResultStudentAllCats[$theCat]["exam_cat_id"], $gradeArr, $sqlResultStudentAllCats[$theCat]["avg_grade"], $systemId))
                                {
                                    //add the final grade for the category
                                    $sqlStudentsResult[$i]["cats"][$theCat]["final_grade"] = $sqlResultStudentAllCats[$theCat]["avg_grade"];
                                }
                                else
                                {
                                    $sqlStudentsResult[$i]["cats"][$theCat]["final_grade"] = false;
                                    $isFinalGradeGenerated = false;
                                }  
                                $sqlStudentsResult[$i]["cats"][$theCat]["comment"] = "";
                                $sqlStudentsResult[$i]["cats"][$theCat]["edited_by"] = "";
                            }
                            //archived exam, no grade generation
                            else
                            {
                                $sqlStudentsResult[$i]["cats"][$theCat]["final_grade"] = $sqlResultStudentAllCats[$theCat]["avg_grade"];
                                $sqlStudentsResult[$i]["cats"][$theCat]["comment"] = "";
                                $sqlStudentsResult[$i]["cats"][$theCat]["edited_by"] = "";
                            }
                        }

                        
                        
                    }

                    if($catHasGradeCounter != count($sqlResultStudentAllCats) || $isFinalGradeGenerated == false)
                    {
                        $isGradingFinished = false;
                    }
                
                    /*
                    *Get total grade from graded cat in student_cat_grade to update
                    *the overall grade in exam_grade
                    */
                    $totalGrade = calculateExamTotalGrade($examId, $studentId);

                    if($totalGrade != -1 && $totalGrade !=null && $isGradingFinished)
                    {
                        $isPassed = isExamGradePassed($examId, $totalGrade);
                        addExamGrade($examId, $studentId, $totalGrade, $isPassed);
                    }

                    $sqlSelectExams = "SELECT grade, passing_grade, passed, exam.exam_id
                    FROM exam JOIN exam_grade ON exam.exam_id = exam_grade.exam_id
                    WHERE exam_grade.student_id LIKE :student_id AND exam_grade.exam_id = :exam_id";
    
                    $data = array(':student_id' => $studentId, ':exam_id' => $examId);
                    $sqlResultExams = sqlExecute($sqlSelectExams, $data, true);

                    //add overall exam grade info to the student data
                    if(count($sqlResultExams) != 0)
                    {
                        foreach ($sqlResultExams[0] as $attrName => $attrVal)
                        {
                            $sqlStudentsResult[$i][$attrName] = $attrVal;
                        }
                    }
                    

                

            }

            echo json_encode($sqlStudentsResult);

        }
    } 
    
    function getExamAllCats($examId)
    {
        $sqlSelectAllCats = "SELECT exam_cat_id, name, possible_grade 
                            FROM exam_category ec JOIN category c ON (ec.cat_id = c.cat_id) 
                            WHERE exam_id = :exam_id";
        return sqlExecute($sqlSelectAllCats, array(":exam_id"=>$examId), true);
    }

    /*
    *Get a student all cats in an exam, including graded and ungraded cats.
    *All cats contains element avg_grade. Ungraded cats have avg_grade set to null.
    */
    function getStudentAllCats($studentId, $examId)
    {
        $sqlSelectAvgCatGrade = "SELECT exam_cat_id, name, ROUND(AVG(grade),0) as avg_grade, possible_grade
                            FROM category_grade CG JOIN assigned_grader AG USING (grader_exam_cat_id)
                            JOIN exam_category EC USING (exam_cat_id)
                            JOIN category C USING (cat_id)
                            WHERE student_id LIKE :student_id AND EC.exam_cat_id IN (SELECT exam_cat_id
                                                                                    FROM exam_category
                                                                                    WHERE exam_id = :exam_id)
                            GROUP BY exam_cat_id";

        $data = array(':student_id' => $studentId, ':exam_id' => $examId);
        $sqlResultGradedCats = sqlExecute($sqlSelectAvgCatGrade, $data, true);

        $sqlResultAllCats = getExamAllCats($examId);

        if(count($sqlResultGradedCats) == 0)
        {
            //set avg_grade of all cats to null and push them to $sqlResultGradedCats
            for($i=0; $i<count($sqlResultAllCats); $i++)
            {

                $sqlResultAllCats[$i]["avg_grade"] = null;
                array_push($sqlResultGradedCats, $sqlResultAllCats[$i]);
            }
        }
        else
        {
            $tempGradedCats;
            $tempAllCats;

            //Prepare $tempAllCats and $tempGradedCats array for array_diff
            //E.g. $tempAllCats("0"=>3, "1"=>4);
            for($i=0; $i<count($sqlResultAllCats); $i++)
            {
                $tempAllCats[$i] = $sqlResultAllCats[$i]["exam_cat_id"];
                if($i<count($sqlResultGradedCats))
                    $tempGradedCats[$i] = $sqlResultGradedCats[$i]["exam_cat_id"];
            }

            //Find ungraded exam_cat_id
            $diffCats = array_values(array_diff($tempAllCats, $tempGradedCats));

            //Set ungraded cat's avg_grade to null and push it to $sqlResultGradedCats
            for($i=0; $i<count($diffCats); $i++)
            {
                for($k=0; $k<count($sqlResultAllCats); $k++)
                {
                    if($sqlResultAllCats[$k]["exam_cat_id"] == $diffCats[$i])
                    {
                        $sqlResultAllCats[$k]["avg_grade"] = null;
                        array_push($sqlResultGradedCats, $sqlResultAllCats[$k]);
                    }
                }
            }
        }

        return $sqlResultGradedCats;
        
    }
    
    function getStudentCatGrades($studentId, $examId)
    {
        $sqlSelectCats = "SELECT cat.name as cat, grade, e.exam_id, ec.possible_grade, CONCAT(u.f_name,' ',u.l_name) AS grader_name, ag.exam_cat_id, cg.grader_exam_cat_id
        FROM category_grade AS cg JOIN assigned_grader AS ag ON cg.grader_exam_cat_id = ag.grader_exam_cat_id 
        JOIN exam_category AS ec ON ag.exam_cat_id = ec.exam_cat_id
        JOIN category AS cat ON ec.cat_id = cat.cat_id
        JOIN exam AS e ON e.exam_id = ec.exam_id
        JOIN user AS u ON ag.user_id = u.user_id
        WHERE student_id LIKE :student_id AND e.exam_id  = :exam_id";

        $data = array(':student_id' => $studentId, ':exam_id' => $examId);
        return sqlExecute($sqlSelectCats, $data, true);
    }

    function checkGradeDiff($gradeArr)
    {
        require_once "../settings/init_settings.php";
        if(!isset($GLOBALS["settings"]))
        initializeSettings();

        for($i=0; $i<count($gradeArr); $i++)
        {
            if($i < count($gradeArr)-1)
            {
                if(abs($gradeArr[$i] - $gradeArr[$i+1]) > $GLOBALS["settings"]["pointDiffRange"])
                {
                    return false;
                }
            }
        }

        return true;
    }

    /*
    *Comment exists means the grade was changed by an admin
    *
    */
    function checkCommentExists($studentId, $examCatId)
    {
        $sqlSelectComment = "SELECT comment
                            FROM student_cat_grade
                            WHERE student_id LIKE :student_id AND exam_cat_id = :exam_cat_id";
        $data = array(':student_id' => $studentId, ':exam_cat_id' => $examCatId);
        $sqlResultComment = sqlExecute($sqlSelectComment, $data, true);

        if(strcmp($sqlResultComment[0]["comment"], "") == 0)
        {
            return false;
        }
        else {
            return true;
        }
    }

    function updateFinalCatGrade($studentId, $examCatId, $gradeArr, $avgGrade, $editedBy)
    {
        if(checkGradeDiff($gradeArr) && $avgGrade != null)
        {
            updateStudentFinalCatGrade($studentId, $examCatId, $avgGrade, NULL, $editedBy);
            return true;
        }
        else 
        {
            return false;
        }
    }

    
?>