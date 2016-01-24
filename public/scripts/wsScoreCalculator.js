(function($) {
    function getPercentage(val, percentage) {
        var attributeSize = 5;
        // var attributeSize = 6;
        return val * attributeSize * 4 * (percentage / 100)
    }

    // Appearance 16%
    // Louche 16%
    // Aroma 18%
    // Flavor 20%
    // Finish 10%
    // Overall Impression 20% ADD
    // Total 100%
    $.fn.extend({
        calculateWsScore: function() {
            var fields = $(this).formParams()

            // console.table(fields.ratings)
            var totalScore = 0;
            for (var i in fields.ratings) {

                if (fields.ratings[i].score) {
                    switch (fields.ratings[i].attribute.toLowerCase()) {
                        case 'appearance':

                            console.table(fields.ratings[i].attribute + " = " +
                                getPercentage(fields.ratings[i].score, 16)
                            )
                            totalScore += getPercentage(fields.ratings[i].score, 16)
                            break;

                        case 'louche':
                            console.table(fields.ratings[i].attribute + " = " +
                                getPercentage(fields.ratings[i].score, 16))
                            totalScore += getPercentage(fields.ratings[i].score, 16)
                            break;

                        case 'aroma':
                            console.table(fields.ratings[i].attribute + " = " +
                                getPercentage(fields.ratings[i].score, 18))
                            totalScore += getPercentage(fields.ratings[i].score, 18)
                            break;

                        case 'flavor':
                            console.table(fields.ratings[i].attribute + " = " +
                                getPercentage(fields.ratings[i].score, 20))
                            totalScore += getPercentage(fields.ratings[i].score, 20)
                            break;

                        case 'finish':
                            console.table(fields.ratings[i].attribute + " = " +
                                getPercentage(fields.ratings[i].score, 10))
                            totalScore += getPercentage(fields.ratings[i].score, 10)
                            break;

                        case 'overall':
                            console.table(fields.ratings[i].attribute + " = " +
                                getPercentage(fields.ratings[i].score, 20))
                            totalScore += getPercentage(fields.ratings[i].score, 20)
                            break;

                        default:
                            break;
                    }
                }
            }
            console.log("TOTAL: " + totalScore)
            return totalScore.toFixed(1);
        }
    });

})(jQuery);