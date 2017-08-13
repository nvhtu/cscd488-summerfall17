<?php 
   if ( !isset($page) ) {
      $page = "home";
   }
   if ( !isset($title) ) {
      $title = "EWU Advancement Programming Exam";
   }
   if ( !isset($hasModal) ) {
      $hasModal = false;
   }

   $absPath = $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . "cscd488-summerfall17" . DIRECTORY_SEPARATOR . "view";
   $path = $absPath . DIRECTORY_SEPARATOR . $page . DIRECTORY_SEPARATOR . $page;
   $modalPath = $path . "_modal.html";
   $bodyPath = $path . "_table.html";
   //$scriptPath = $path . "_script.js";
   $scriptPath = "$page/" . $page . "_script.js";
?>
<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="utf-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1">

   <title><?php echo $title; ?></title>

   <base href="http://localhost/cscd488-summerfall17/view/">
   <link rel="icon" href="img/cropped-cropped-Eagle_512x512-32x32.png">
   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
      crossorigin="anonymous">
   <link rel="stylesheet" href="css/custom.css">
</head>

<body>
   <?php 
      if ($hasModal) {require_once $modalPath;}
      require_once $absPath . '/includes/navbar.html';
   ?>
   
   <div class="container">
      <div class="row">
         <div class="col-sm-3 col-md-2 sidebar">
            <ul class="nav nav-sidebar">
               <?php require_once $absPath . '/includes/sidebar.php'; ?>
            </ul>
         </div>

         <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
            <?php require_once $bodyPath; ?>
         </div>
      </div>
   </div>

   <?php require_once $absPath . '/includes/footer.html'; ?>

   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
   <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
   <script src="js/script.js"></script>
   <script src="js/build_table.js"></script>
   <script src="<?php echo $scriptPath; ?>"></script>
</body>

</html>