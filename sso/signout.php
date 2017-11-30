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


$_SESSION['loggedIn'] = false;
unset($_SESSION['phpCAS']);
unset($_SESSION['ewuid']);

$projectDirName = "cscd488-summerfall17";
$absPath = $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . $projectDirName . DIRECTORY_SEPARATOR . "view" . DIRECTORY_SEPARATOR . "home";

phpCAS::logoutWithRedirectService($absPath);
?>