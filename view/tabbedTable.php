<div class="panel panel-default">
   <div class="panel-heading with-nav-tabs clearfix">
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
         <div class="form-inline">
            <button type="button" class="btn btn-primary pull-left btn-labeled" data-toggle="modal" data-target="#detail-modal" id="create-button">
               <span class="btn-label" aria-hidden="true"><i class="glyphicon glyphicon-plus"></i></span>
               Create <?php echo ucfirst($page); ?>
            </button>
            <div class="form-group has-feedback pull-right">
               <div class="input-group">
                  <input type="text" class="search form-control" placeholder="Search">
                  <span class="clear-search glyphicon glyphicon-remove-circle form-control-feedback"></span>
                  <span class="input-group-btn">
                     <button type="button" class="btn btn-default btn-search" aria-label="Search"><span class="glyphicon glyphicon-search"></span></button>
                  </span>
               </div>
            </div>
         </div>
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
</div>