<div class="panel panel-default with-nav-tabs">
   <div class="panel-heading clearfix">
      <h4 class="panel-title pull-left"><strong><?php echo $tableTitle; ?></strong></h4>
      <ul class="nav nav-tabs pull-right">
         <?php for ($i = 0; $i < count($tableTabs); $i++) {
            $str = str_replace(' ', '_', $tableTabs[$i]);
            if ($i == 0) {
               echo "<li class='active'><a href='#$str-panel' role='tab' data-toggle='tab'>$tableTabs[$i]</a></li>";
            } else {
               echo "<li><a href='#$str-panel' role='tab' data-toggle='tab'>$tableTabs[$i]</a></li>";
            }
         } ?>
      </ul>
   </div>

   <div>
      <div class="container-fluid table-toolbar">
         <form class="form-inline">
            <button type="button" class="btn btn-primary pull-left" data-toggle="modal" data-target="#detail-modal" id="create-button">Create <?php echo ucfirst($page); ?></button>
            <div class="form-group pull-right">
               <div class="input-group">
                  <input type="text" class="form-control" id="search" placeholder="Search">
                  <span id="clear-search" class="glyphicon glyphicon-remove-circle form-control-feedback"></span>
                  <span class="input-group-btn">
                     <button type="button" class="btn btn-default" id="btn-search" aria-label="Search"><span class="glyphicon glyphicon-search"></span></button>
                  </span>
               </div>
            </div>
         </form>
      </div>

      <div class="tab-content">
         <?php for ($i = 0; $i < count($tableTabs); $i++):
            $str = str_replace(' ', '_', $tableTabs[$i]);
            if ($i == 0) {
               echo "<div role='tabpanel' class='tab-pane fade in active' id='$str-panel'>";
            } else {
               echo "<div role='tabpanel' class='tab-pane fade in' id='$str-panel'>";
            } ?>
               
               <div class='table-responsive'></div>
            </div>
         <?php endfor; ?>
      </div>
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