<?php

    $isClient = $_GET["is_client"];
    getCurUserInfo($isClient);

    function getCurUserInfo($isClient)
    {

        $isDev = True;
        $userInfo = array();

        if($isDev)
        {
            $userInfo = array('userId' => '111', 
            'userType' => 'Admin', 
            'userSession' => '111111',
            'userFname' => 'Tu',
            'userLname' => 'Nguyen',
            'userEmail' => 'abc@xyz.com' );/*
            $userInfo = array('userId' => '3333', 
            'userType' => 'Student', 
            'userSession' => '111111',
            'userFname' => 'A333AAA',
            'userLname' => 'B333',
            'userEmail' => '1233Abc@xyz.c' );/
            $userInfo = array('userId' => '2223', 
            'userType' => 'Grader', 
            'userSession' => '111111',
            'userFname' => 'A3AAA',
            'userLname' => 'B3BBB',
            'userEmail' => '12Abc@xyz.c' );*/
        }
        else 
        {
            session_start();
            $userInfo = array('userId' => $_SESSION['ewuid'], 
                              'userType' => $_SESSION["phpCAS"]["attributes"]["UserType"], 
                              'userSession' => session_id(),
                              'userFname' => $_SESSION["phpCAS"]["attributes"]["FirstName"],
                              'userLname' => $_SESSION["phpCAS"]["attributes"]["LastName"],
                              'userEmail' => $_SESSION["phpCAS"]["attributes"]["Email"] );
        }
    
        
        if($isClient)
        {
            echo json_encode($userInfo);
        }
        else {
            return $userInfo;
        }
        
    }


?>