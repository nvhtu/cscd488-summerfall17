<div class="modal fade" id="detail-modal" tabindex="-1" role="dialog" aria-hidden="true">
   
<!-- Modal Size -->
<?php if ( isset($modalSize) && strstr($modalSize, "large") ): ?>
   <div class="modal-dialog modal-lg">
<?php elseif ( isset($modalSize) && strstr($modalSize, "small") ): ?>
   <div class="modal-dialog modal-sm">
<?php else: ?>
   <div class="modal-dialog">
<?php endif; ?>

      <div class="modal-content">

      <!-- No tabs -->
      <?php if ( count($modalsArr) == 1 ): ?>
         <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
            <h4 class="modal-title"><?php echo $modalTitles[$i]; ?></h4>
         </div>

      <?php require_once $modalsArr[0] . "_modal.html"; ?>
         
      <!-- Tabs -->
      <?php else: ?>
         <div class="modal-header with-nav-tabs clearfix">
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
            <h4 class="modal-title pull-left">Title</h4>
            <ul class="nav nav-tabs pull-right" role="tablist">

            <?php 
               $size = count($modalsArr);
               for ($i = 0; $i < $size; $i++) {
                  ?><li role="presentation" <?php if ($i == 0) {echo 'class="active"';} ?> ><a href="#<?php echo $modalTitles[$i] . "_tab"; ?>" data-toggle="tab"><?php echo $modalTitles[$i]; ?></a></li><?php 
               }
            ?>

            </ul>
         </div>

         <div class="tab-content">
         <?php 
            $size = count($modalsArr);
            for ($i = 0; $i < $size; $i++) {
               ?><div role="tabpanel" class="tab-pane<?php if ($i == 0) {echo " active";} ?>" id="<?php echo $modalTitles[$i] . "_tab"; ?>"><?php 
                  require_once $modalsArr[$i] . "_modal.html";
               ?></div><?php 
            }
         ?>
         
            <div role="tabpanel" class="tab-pane" id="profile">...</div>
            <div role="tabpanel" class="tab-pane" id="messages">...</div>
            <div role="tabpanel" class="tab-pane" id="settings">...</div>
         </div>

      <?php 
         foreach ($modalsArr as $theModal) {
            require_once $theModal . "_modal.html";
         }
      ?>
      <?php endif; ?>

         <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" id="submit-button" data-action="create">Create</button>
         </div>
      </div>
   </div>
</div>