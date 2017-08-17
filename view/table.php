<div class="panel panel-default">
   <div class="panel-heading">
      <h4 class="panel-title"><strong><?php echo $tableTitle; ?></strong></h4>
   </div>

   <div>
      <div class="container-fluid table-toolbar">
         <form class="form-inline">
            <button type="button" class="btn btn-primary pull-left" data-toggle="modal" data-target="#detail-modal" id="create-button">Create <?php echo ucfirst($page); ?></button>
            <div class="form-group pull-right">
               <div class="input-group">
                  <input type="text" class="form-control" id="search" placeholder="Search" name="search">
                  <span class="input-group-btn">
                     <button type="button" class="btn btn-default" id="btn-search" aria-label="Search"><span class="glyphicon glyphicon-search"></span></button>
                  </span>
               </div>
            </div>
         </form>
      </div>

      <div class="table-responsive"></div>
   </div>

   <div class="panel-footer clearfix">
      <ul class="pagination pull-right">
         <li>
            <a href="#" aria-label="Previous">
               <span aria-hidden="true">&laquo;</span>
            </a>
         </li>
         <li><a href="#">1</a></li>
         <li><a href="#">2</a></li>
         <li><a href="#">3</a></li>
         <li><a href="#">4</a></li>
         <li><a href="#">5</a></li>
         <li>
            <a href="#" aria-label="Next">
               <span aria-hidden="true">&raquo;</span>
            </a>
         </li>
      </ul>
   </div>
</div>