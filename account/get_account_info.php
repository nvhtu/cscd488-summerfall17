<?php
/**
 * Get account info (Teacher, Grader, and Student account)
 * @author: Tu Nguyen
 * @version: 1.0
 */
    //require "../pdoconfig.php";
    require "../auth/user_auth.php";
    require "../util/sql_exe.php";
    require "../settings/init_settings.php";
    
    $requesterId = $_GET["requester_id"];
    $requesterType = $_GET["requester_type"];
    $allowedType = array("Admin", "Teacher", "Student");

    $request = $_GET["request"];

    //User authentication
    user_auth($requesterId, $requesterType, $allowedType);

    //Validate strings not empty

    //Validate strings


    $sqlResult = array();

    switch ($request)
    {
        case ("get_own"): $sqlResult = getOwnAccount($requesterId, $requesterType);
                         break;
        case ("get_by_id"): //Student and Grader can't request account info other than their own
                            if(strcmp($requesterType, "Student") == 0 || strcmp($requesterType, "Grader") == 0) 
                            {
                                http_response_code(400);
                                die("Unauthorized access. Your account type can't use this function.");
                            }
                            else 
                            {
                                $sqlResult = getAccountById();
                            }
                            break;
        case ("get_by_type"): $sqlResult = getAllByType();
                            break;
        default: http_response_code(400);
                echo "Unrecognized request string.";
    }

    echo json_encode($sqlResult);

    
    /**
    * Gets acount info the requester
    * @param: $requesterId requester ID
    * @param: $requesterType requester acount type
    * @return: void
    */
    function getOwnAccount($requesterId, $requesterType)
    {

        $sqlResult;

        if(strcmp($requesterType, "Student") == 0)
        {
            $sqlResult = getStudentInfo($requesterId);
        }
        else 
        {
            $sqlResult = getNonStudentInfo($requesterId);
        }
        
        return $sqlResult;
        
    }

    /**
    * Gets acount info using an account id
    * @return: void
    */
    function getAccountById()
    {
        $id = $_GET["id"];


        $sqlCountStudent = "SELECT COUNT(student_id) as count
                                    FROM student
                                    WHERE student_id LIKE :id";

        $sqlResult = sqlExecute($sqlCountStudent, array(':id'=>$id), True);

        if($sqlResult[0]["count"] == 0)
        {
            return getNonStudentInfo($id);
        }
        else 
        {
            return getStudentInfo($id);   
        }
    }

    /**
    * Gets all account by type
    * @return: void
    */
    function getAllByType()
    {
        $type = $_GET["type"];
        $sqlResult;

        if(strcmp($type, "Student") == 0)
        {
            $requesterType = $_GET["requester_type"];
            
            //If requester is a Teacher, only get students belong to them. They are who uploaded
            //by that Teacher. A Teacher is prevented from getting students from previous quarters.
            if(strcmp($requesterType, "Teacher") == 0)
            {
                if(!isset($GLOBALS["settings"]))
                initializeSettings();

                //---Get current quarter start and end dates
                $today = date("Y-m-d");
                $curQuarterStart = "";
                $curQuarterEnd = "";
                $quarterStartName = "";
                $quarterStartCount = 0;

                $sortedQuarterDatesArr = array(0=>$GLOBALS["settings"]["fallStart"],
                                               1=>$GLOBALS["settings"]["fallEnd"],
                                               2=>$GLOBALS["settings"]["winterStart"],
                                               3=>$GLOBALS["settings"]["winterEnd"],
                                               4=>$GLOBALS["settings"]["springStart"],
                                               5=>$GLOBALS["settings"]["springEnd"],
                                               6=>$GLOBALS["settings"]["summerStart"],
                                               7=>$GLOBALS["settings"]["summerEnd"],);

                for($i=0; $i < count($sortedQuarterDatesArr); $i++)
                {
                    if($today >= $sortedQuarterDatesArr[$i] && $i%2 == 0)
                    {
                        $curQuarterStart = $sortedQuarterDatesArr[$i];
                        $quarterStartName = key($sortedQuarterDatesArr);
                        $quarterStartCount = $i;
                    }
                    else
                    if(strcmp($curQuarterStart,"") != 0)
                    {
                        $curQuarterEnd = $sortedQuarterDatesArr[$quarterStartCount+1];
                    }
                    
                }


                $sqlGetStudents = "SELECT U.user_id, U.f_name, U.l_name, U.email, S.state
                FROM in_class_student ICS JOIN user U ON (ICS.student_id = U.user_id)
                JOIN student S ON (ICS.student_id = S.student_id)
                WHERE ICS.teacher_id LIKE :teacher_id AND ICS.start_date = :start_date AND ICS.end_date = :end_date";

                $data = array(":teacher_id"=>$_GET["requester_id"], ":start_date"=>$curQuarterStart, ":end_date"=>$curQuarterEnd);

                $sqlResult = sqlExecute($sqlGetStudents, $data, True);
                
                if (count($sqlResult)==0)
                {
                    //http_response_code(400);
                    die("You currently don't have any students in your class. You're restricted from viewing previous quarters students.");
                }
            }
            else
            {
                $sqlGetAllStudents = "SELECT user_id, f_name, l_name, email, state FROM student JOIN user ON student_id LIKE user_id";
                $sqlResult = sqlExecute($sqlGetAllStudents, null, True);
            }
            

        }
        else 
        {
            $sqlGetAllNonStudents = "SELECT user_id, f_name, l_name, email
                                    FROM faculty JOIN user ON faculty_id LIKE user_id
                                    WHERE faculty.type LIKE :type";
            $sqlResult = sqlExecute($sqlGetAllNonStudents, array('type'=>$type), True);
        }

        return $sqlResult;
    }

    /**
    * Gets student account info and state
    * @return: string json
    */
    function getStudentInfo($id)
    {
        $sqlGetAccount = "SELECT user_id, f_name, l_name, email, state
                        FROM student JOIN user ON student_id LIKE user_id
                        WHERE user_id LIKE :id";

        $sqlResult = sqlExecute($sqlGetAccount, array('id'=>$id), True);

        if(strcmp($sqlResult[0]["state"], "Registered") == 0)
        {
            $sqlGetRegisteredExam = "SELECT exam_id
                                    FROM exam_roster
                                    WHERE student_id LIKE :id";
            $sqlResultRegisteredExam = sqlExecute($sqlGetRegisteredExam, array('id'=>$id), True);

            $sqlResult[0]["registered_exam"] = array();
            
            for ($i=0; $i<count($sqlResultRegisteredExam); $i++)
            {
                array_push($sqlResult[0]["registered_exam"], $sqlResultRegisteredExam[$i]["exam_id"]);
            }   

        }
        $sqlResult[0]["type"] = array("Student");
        
        return $sqlResult;
    }

    /**
    * Gets admin or teacher or grader account info and type
    * @return: string json
    */
    function getNonStudentInfo($id)
    {
        $sqlGetAccount = "SELECT *
                         FROM user
                         WHERE user_id LIKE :id";

        $sqlResult = sqlExecute($sqlGetAccount, array('id'=>$id), True);

        if(count($sqlResult) == 0)
            return "NULL";

        $sqlResult[0]["type"] = array();
           
        //get account type
        $sqlGetType = "SELECT type
                        FROM faculty
                        WHERE faculty_id LIKE :id";
        $sqlResultType = sqlExecute($sqlGetType, array('id'=>$id), True);

        //type is stored as an array
        for ($i=0; $i<count($sqlResultType); $i++)
        {
            array_push($sqlResult[0]["type"], $sqlResultType[$i]["type"]);
        }       

        return $sqlResult;
    }

?>    