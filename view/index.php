<!DOCTYPE html>
<html lang="en">

<head>
   <meta charset="utf-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1">

   <title>EWU Advancement Programming Exam</title>

   <link rel="icon" href="./img/cropped-cropped-Eagle_512x512-32x32.png">
   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
      crossorigin="anonymous">
   <link rel="stylesheet" href="./css/custom.css">
</head>

<body>
   <?php include ('navbar.html'); ?>
   
   <div class="container">
      <div class="row">
         <div class="col-sm-3 col-md-2 sidebar">
            <ul class="nav nav-sidebar">
               <?php include ('sidebar.php'); ?>
            </ul>
         </div>

         <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
            <?php include ('home.html'); ?>
         </div>
      </div>
   </div>

   <?php include ('footer.html'); ?>

   <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
   <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
   <script src="./js/script.js"></script>
</body>

</html>