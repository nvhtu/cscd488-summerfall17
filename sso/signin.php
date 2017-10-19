<?php
/**
 * Sign in with EWU SSO
 * @author Team APE 2013-2014, Tu Nguyen 2017
 * @version 1.0
 */

require_once "CAS/CAS.php";
require_once "../util/check_id.php";

$cas_server_ca_cert_path = 'comodo_combo.pem';
$cas_real_hosts = array('it-adfs01.eastern.ewu.edu',
                        'it-casauth01.eastern.ewu.edu');

phpCAS::client(SAML_VERSION_1_1,'login.ewu.edu',443,'/cas',false);
phpCAS::setCasServerCACert($cas_server_ca_cert_path);
phpCAS::handleLogoutRequests(true, $cas_real_hosts);
phpCAS::forceAuthentication();

$_SESSION['loggedIn'] = true;
//get all attributes from returned object.
//Array includes: "UserType", "Email", "FirstName", "Ewuid", "LastName"
$userAttr = phpCAS::getAttributes();
$_SESSION['ewuid'] = $userAttr["Ewuid"];
//echo $_SESSION['ewuid'];
//echo $_SESSION["phpCAS"]["attributes"]["UserType"];

if(strcmp($_SESSION["phpCAS"]["attributes"]["UserType"], "Student") == 0)
{
    if(checkStudentExists($_SESSION['ewuid']))
    {
        header('Location: ../view/');
    }
    else 
    {
        echo "student doesn't exists. Go to create new student account";
        header('Location: create_student.html');
    }
}
else 
{
    $_SESSION["phpCAS"]["attributes"]["UserType"] = checkFacultyTypes();
    header('Location: ../view/');
}

function checkFacultyTypes()
{
    $userId = $_SESSION['ewuid'];
    $userTypes = Array();

    $sqlCheckFaculty = "SELECT type 
                        FROM faculty
                        WHERE faculty_id LIKE :faculty_id";
    
    $sqlResult = sqlExecute($sqlCheckFaculty, array('faculty_id'=>$userId), True);
    if(count($sqlResult) == 0)
    {
        
    }
    else 
    {
        foreach($sqlResult as $theType)
        {
            array_push($userTypes, $theType["type"]);
        }
    }

    return $userTypes;
}

?>