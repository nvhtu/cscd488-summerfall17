<?php
    require_once "../pdoconfig.php";

    
	/**
	 * receiver array contains: fname, lname, email.
	 */
    function sendMail ($receiver, $subject, $message)
    {
        global $_siteEmail, $_siteEmailPass;

        $headers['To'] = $receiver["f_name"] . ' ' . $receiver["l_name"] . ' <' . $receiver["email"] . '>';	 
		$headers['From'] = 'EWU APE <s-ewuape@ewu.edu>';
		$headers['Date'] = date('r', time());
		$headers['Subject'] = $subject;
		$headers['Content-type'] = 'text/html; charset=iso-8859-1';
		
		$msg = "<html><head></head><body>Hi " . $receiver["f_name"] . 
				",<br><br>" .
				$message .
				"<br><br>" .
				"If you have any questions or concerns, please e-mail or talk to Stu Steiner at ssteiner@ewu.edu<br><br>" .
				"Please DO NOT RESPOND TO THIS EMAIL ACCOUNT, it is unmonitored and messages will be ignored.<br><br>" .
				"Regards,<br><br>" .
				"The APE Team<br></body></html>";
		
		$params['host'] = "exchange.ewu.edu";
		$params['port'] = 25;
		$params['auth'] = true;
		$params['username'] = $_siteEmail;
		$params['password'] = $_siteEmailPass;

		/*require_once 'Mail.php';

		$mail = new Mail();	
		$smtp =& $mail->factory('smtp', $params);
		$sent = $smtp->send($receiver["email"], $headers, $msg);
		
		if (PEAR::isError($sent)) {
			echo('<p>' . $sent->getMessage() . '</p>');
		}*/
    }
?>