<?php 

  $projectDirName = "cscd488-summerfall17";
  require_once "../../util/get_cur_user_info.php";
  $userInfo = getCurUserInfo(false);

   if ( !isset($page) ) {
      $page = "home";
   }
   if ( !isset($title) ) {
      $title = "EWU Advancement Programming Exam";
   }


   
   $absPath = $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . $projectDirName . DIRECTORY_SEPARATOR . "view";
   $path = $absPath . DIRECTORY_SEPARATOR . $page . DIRECTORY_SEPARATOR . $page;
   //$modalPath = $path . "_modal.html";
   $tablePath = $absPath . DIRECTORY_SEPARATOR . "table.php";
   $tabbedTablePath = $absPath . DIRECTORY_SEPARATOR . "tabbedTable.php";
   //$bodyPath = $path . "_table.html";



   if (strstr($page, 'home'))
   {
      $path = $absPath . DIRECTORY_SEPARATOR . "home" . DIRECTORY_SEPARATOR;
   }

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
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.4.1/css/bootstrap-datepicker3.css"/>
   
</head>

<body>
   <?php 
      if (isset($modalTabsArr))
      {
         require_once $absPath . '/includes/tabbedModal.php';
      }

      if (isset($modalsArr))
      {
        foreach($modalsArr as $theModal)
        {
          require_once $theModal . "_modal.html";
        }  
      }

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

          <div class="msg-box alert fade in">
            <a href="#" class="close" id="msg-close" data-dismiss="alert">&times;</a>
            <p id="msg-box-text"></p>
          </div>

            <?php 
               if (strstr($page, 'home')) 
               {
                 if(isset($isError) && $isError)
                 {
                   ?><div class="error-page-msg"><?php echo $errorMsg?></div><?php
                 }
                 else 
                 {
                    /*if(isset($_GET["page"]))
                    {
                      $page = $_GET["page"];
                    }*/
                    require_once $path . $page . ".html";
                 }
                  
               } 
               else 
               {
                  if (isset($tableTabs)) 
                  {
                     require_once $tabbedTablePath;
                  } 
                  else 
                  {
                     require_once $tablePath;
                  }
               }
             ?>
         </div>
      </div>
   </div>

   <?php require_once $absPath . '/includes/footer.html'; ?>

   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
   <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
   <script src="js/script.js"></script>
   <script src="js/build_table.js"></script>
   <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.4.1/js/bootstrap-datepicker.min.js"></script>
   
   
   <?php 
   if (isset($jsArr))
   {
        if (strstr($page, 'home'))
        {
          ?> <script src="<?php echo "home/" . $page . "_script.js";?>"></script> 
        <?php
        }
        foreach($jsArr as $theScript)
        {
          ?> <script src="<?php echo $page . "/" . $theScript . "_script.js";?>"></script>
        <?php
        }
    }  
   ?>
</body>

</html>