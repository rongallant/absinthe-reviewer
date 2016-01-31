function jqAutoCompleteMake(selector, searchURL)
{
    $(selector).autocomplete({
        source: function(request, response) {
            $.ajax({
                beforeSend: function(request) {
                    request.setRequestHeader("Accept", "application/json;odata=verbose;charset=utf-8");
                },
                url: searchURL + request.term,
                dataType: "json",
                success: function(data) {
                    response($.map(data, function(item) {
                        var names = []
                        for (var i in data) {
                            console.table(data[i])
                            names.push(data[i])
                        }
                        console.table(names)
                        return {
                            label: names
                        }
                    }));
                },
                error: function(data) {
                    console.error('search error', data);
                }
            })
        }
    })
}

function jqAutoCompleteCountries(selector)
{
    $(selector).autocomplete({
        minLength: 3,
        source: function(request, response) {
            $.ajax({
                beforeSend: function(request) {
                    request.setRequestHeader("Accept", "application/json;odata=verbose;charset=utf-8");
                },
                url: "https://restcountries.eu/rest/v1/name/" + request.term,
                dataType: "json",
                success: function(data) {
                    response($.map(data, function(item) {
                        var names = []
                        for (var i in data) {
                            names.push(data[i].name)
                        }
                        return {
                            label: names
                        }
                    }));
                },
                error: function(data) {
                    console.error('search error', data);
                }
            })
        }
    })
}

$.fn.extend({
    absintheStyleSelect: function(currentVal) {
        var select = $(this)
        $.getJSON("/autocomplete/absintheTypes", function(data) {
            $.each(data, function(){
                select.append("<option value='" + this._id + "'>" + this.name +"</option>")
            })
            select.val(currentVal)
            select.material_select()
        })
        return select;
    }
})
$.fn.extend({
    absintheSelect: function(currentVal) {
        var select = $(this)
        $.getJSON("/autocomplete/absinthes", function(data) {
            $.each(data, function(){
                select.append("<option value='" + this._id + "'>" + this.name +"</option>")
            })
            select.val(currentVal)
            select.material_select()
        })
        return select;
    }
})