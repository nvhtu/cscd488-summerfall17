<?php
/**
 * This is the last line of defense of the API. 
 * It checks if a passed-in account id and type is existed AND is allowed in caller function.
 * Script execution is stopped immediately if either of mentioned conditions is false.
 * @author: Tu Nguyen
 * @version: 1.0
 */

    require_once "../pdoconfig.php";
    require_once "../util/get_cur_user_info.php";
    require_once "../util/input_validate.php";

    /**
     * Checks account is existed and type is allowed
     * @param string $requesterId requester id
     * @param string $requesterType requester type
     * @param array $allowedType type(s) that allowed to use the caller function
     * @return boolean
     */
    function user_auth($requesterId, $requesterType, $allowedType, $requesterSessionId)
    {
            //Sanitize the input
            $requesterId = sanitize_input($requesterId);
            $requesterType = sanitize_input($requesterType);
            $requesterSessionId = sanitize_input($requesterSessionId);

            //Ensure input is well-formed
            validate_numbers_letters($requesterId);
            
            $conn = openDB();
            $isAuth = False;

            //Check session id exists and matched. Don't check this with System account
            if(strcmp($requesterType, "System") != 0 && strcmp($requesterType, "000") != 0)
            {
                $userInfo = getCurUserInfo(False);
                if(strcmp($requesterSessionId, $userInfo["userSession"]) != 0)
                {
                    http_response_code(401);
                    $conn = null;
                    die("Unauthorized access. Account is not signed in.");
                }
            }

            //Check disabled account
            $sqlDisableAccount = "SELECT disabled
                                FROM user
                                WHERE user_id LIKE :user_id";
            $sqlResultDisabledAccount = sqlExecute($sqlDisableAccount, array(':user_id'=>$requesterId), True);
            if($sqlResultDisabledAccount[0]["disabled"] == 1)
            {
                http_response_code(401);
                $conn = null;
                die("Unauthorized access. Your account is disabled.");
            }

            if(strcmp($requesterType, "Student") == 0) //Student account
            {
                $sqlCountStudent = "SELECT COUNT(student_id) as count
                                    FROM student
                                    WHERE student_id LIKE :requester_id";

                $sqlResult = sqlExecute($sqlCountStudent, array(':requester_id'=>$requesterId), True);

                if($sqlResult[0]["count"] == 0)
                {
                    http_response_code(401);
                    $conn = null;
                    die("Unauthorized access. Account does not exist.");
                }
            }
            else //Admin, Grader, Teacher account
            {
                $sqlSelectAccount = "SELECT type
                                    FROM faculty
                                    WHERE faculty_id LIKE :requester_id";

                $sqlResult = sqlExecute($sqlSelectAccount, array(':requester_id'=>$requesterId), True);

                //echo json_encode($sqlResult);
                //echo count ($sqlResult);    

                //Checks if passed-in type matches type in database.
                for($i=0; $i<count($sqlResult); $i++)
                {
                    if(strcmp($requesterType, $sqlResult[$i]["type"]) == 0)
                        $isAuth = True;
                }

                if(!$isAuth)
                {
                    //echo "False";
                    http_response_code(401);
                    $conn = null;
                    die("Unauthorized access. Account does not exist.");
                    
                }
            }

            //Check if passed-in type is allowed to use the caller function
            for($i=0; $i<count($allowedType); $i++)
            {
                if(strcmp($requesterType, $allowedType[$i]) == 0)
                {
                    $isAuth = True;
                    break;
                }
                else 
                {
                    $isAuth = False;
                }
            }

            if(!$isAuth)
            {
                //echo "False";
                http_response_code(401);
                $conn = null;
                die("Unauthorized access. Your account type can't use this function.");
                
            }
            else
            {
                return True;
            }      
    }
?>