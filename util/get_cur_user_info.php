<?php

    $isClient = $_GET["is_client"];
    getCurUserInfo($isClient);

    function getCurUserInfo($isClient)
    {

        $isDev = True;
        $userInfo = array();

        if($isDev)
        {
            $userInfo = array('userId' => '222', 
            'userType' => 'Teacher', 
            'userSession' => '111111',
            'userFname' => 'Tu',
            'userLname' => 'Nguyen',
            'userEmail' => 'abc@xyz.com' );
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