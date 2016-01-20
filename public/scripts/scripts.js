function isEmptyObject(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}
$(function() {
    $('.ui.dropdown').dropdown();
    $('.message .close').on('click', function(){
        $(this).closest('.message').transition('fade');
    });
});

function selectableCheckboxes(cssSelector) {
    $(cssSelector + ' thead .ui.checkbox').checkbox({
        onChecked: function() {
            var $childCheckbox  = $(this).closest('table.selectable').find('tbody .checkbox');
            $childCheckbox.checkbox('check');
        },
        onUnchecked: function() {
            var $childCheckbox  = $(this).closest('table.selectable').find('tbody .checkbox');
            $childCheckbox.checkbox('uncheck');
        }
    });
    var
        allChecked      = true,
        allUnchecked    = true;
    $(cssSelector + ' tbody .ui.checkbox').checkbox({

        // Fire on load to set parent value
        fireOnInit : true,
        onChecked: function() {
            $(this).prop("checked", true).closest('tr').addClass('active');
        },
        onUnchecked: function() {
            $(this).prop("checked", false).closest('tr').removeClass('active');
            if (!allUnchecked) {
             $('#deleteAll').removeClass('disabled');
            }
        },
        // Change parent state on each child checkbox change
        onChange : function() {
            var
                $listGroup      = $(this).closest('tbody'),
                $parentCheckbox = $listGroup.siblings('thead').find('.checkbox'),
                $checkbox       = $listGroup.find('.checkbox');
          // check to see if all other siblings are checked or unchecked
          $checkbox.each(function() {
            if ( $(this).checkbox('is checked') ) {
              allUnchecked = false;
            } else {
              allChecked = false;
            }
          });
            // set parent checkbox state, but dont trigger its onChange callback
            if (allChecked) {
                $parentCheckbox.checkbox('set checked');
            } else if(allUnchecked) {
                $parentCheckbox.checkbox('set unchecked');
            } else {
                $parentCheckbox.checkbox('set indeterminate');
            }
    }
    });
}