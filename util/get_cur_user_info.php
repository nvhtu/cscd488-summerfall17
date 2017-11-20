<?php

    if(isset($_GET["is_client"]))
    {
        $isClient = $_GET["is_client"];
        getCurUserInfo($isClient);
    }
    
    

    function getCurUserInfo($isClient)
    {

        $isDev = true;
        $userInfo = array();

        if($isDev)
        {
            $userInfo = array('userId' => '2223', 
                            'userType' => array("Admin", "Teacher", "Grader"), 
                            'userSession' => '111111',
                            'userFname' => 'Tom',
                            'userLname' => 'Capaul',
                            'userEmail' => 'abc@xyz.com' );

            /*$userInfo = array('userId' => 'y', 
                            'userType' => array("Admin", "Teacher", "Grader"), 
                            'userSession' => '111111',
                            'userFname' => 'Stu',
                            'userLname' => 'Steiner',
                            'userEmail' => 'ssteiner@ewu.edu' );
            $userInfo = array('userId' => 'x', 
                            'userType' => array("Admin", "Teacher", "Grader"), 
                            'userSession' => '111111',
                            'userFname' => 'Tom',
                            'userLname' => 'Capaul',
                            'userEmail' => 'tcapaul@ewu.edu' );
            /*$userInfo = array('userId' => '3333', 
                            'userType' => array('Student'), 
                            'userSession' => '111111',
                            'userFname' => 'A333AAA',
                            'userLname' => 'B333',
                            'userEmail' => '1233Abc@xyz.c' );/
            $userInfo = array('userId' => '2223', 
                            'userType' => array('Grader'), 
                            'userSession' => '111111',
                            'userFname' => 'A3AAA',
                            'userLname' => 'B3BBB',
                            'userEmail' => '12Abc@xyz.c' );*/
        }
        else 
        {
            if (session_status() == PHP_SESSION_NONE) {
                session_start();
                }

            if(isset($_SESSION['ewuid']))
            {
                $userInfo = array('userId' => $_SESSION['ewuid'], 
                'userType' => $_SESSION["phpCAS"]["attributes"]["UserType"], 
                'userSession' => session_id(),
                'userFname' => $_SESSION["phpCAS"]["attributes"]["FirstName"],
                'userLname' => $_SESSION["phpCAS"]["attributes"]["LastName"],
                'userEmail' => $_SESSION["phpCAS"]["attributes"]["Email"] );
            }

        }

        //user_auth($userInfo['userId'], $userInfo['userType'], array("Admin", "Teacher", "Student", "System"));
    
        
        if($isClient)
        {
            echo json_encode($userInfo);
        }
        else {
            return $userInfo;
        }
        
    }




?>