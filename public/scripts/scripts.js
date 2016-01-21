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

    /**
     * I am the Check All Checkbox Events.
     */
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

    /**
     * I am the List Of Checkboxes Events.
     */
    $(cssSelector + ' tbody .ui.checkbox').checkbox({
        // Fire on load to set parent value.
        fireOnInit : true,

        onChecked: function() {
            $(this).prop("checked", true).closest('tr').addClass('active')
        },
        onUnchecked: function() {
            $(this).prop("checked", false).closest('tr').removeClass('active')
        },

        // Change parent state on each child checkbox change.
        onChange: function() {
            var $listGroup = $(this).closest('tbody')
            var $parentCheckbox = $listGroup.siblings('thead').find('.checkbox')
            var $checkboxes = $listGroup.find('.checkbox')
            var allChecked = true
            var allUnchecked = true

            // Check to see if all other siblings are checked or unchecked.
             $checkboxes.each(function() {
                if( $(this).checkbox('is checked') ) {
                  allUnchecked = false;
                }
                else {
                  allChecked = false;
                }
              });

            // Set master checkbox, but dont trigger its onChange callback.
            if (allChecked) {
                $parentCheckbox.checkbox('set checked')
                $('#deleteAll').removeClass('disabled')
            } else if (allUnchecked) {
                $parentCheckbox.checkbox('set unchecked')
                $('#deleteAll').addClass('disabled')
            } else {
                $parentCheckbox.checkbox('set indeterminate')
                $('#deleteAll').removeClass('disabled')
            }
        }
    });
}
