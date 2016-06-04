/**
 * Created by CBeckwith411 on 5/29/16.
 */
var $retire = $('#retire'),
    $expenses = $('#expenses'),
    $income = $('#income'),
    $worth = $('#worth'),
    $reqIncome = $('#req-income'),
    $maxExpenses = $('#max-expenses'),
    $timeToRetire = $('#time-to-retire'),
    $married = $('#married'),
    date = new Date(),
    year = date.getFullYear();

var error = function(number){
    if (isNaN(number)) {
        output("Check that all inputs have been entered correctly.");
        $('#output').css("color", "red");
        $('#calculate').parent().parent().effect("shake", {direction: 'up', times: 3, distance: 5}, 300);
        return true;
    }
};

var getValue = function(x) {
    return Math.abs(parseInt(x.val()));
};

var disable = function(x) {
    x.val('');
    x.prop('disabled', true);
};

var selected = function(x) {
    return x.hasClass('selected');
};

var output = function(x) {
    $('#output').text(x);
};

$(document).ready(function() {
   $('#calc-type button').on('click', function(){
        $('#calc-type button').removeClass('selected');
        $(this).addClass("selected");
        $('#calculator input').prop('disabled', false);
        selected($timeToRetire)?disable($retire):selected($maxExpenses)?disable($expenses):selected($reqIncome)? disable($income) : false;
    });

    $('#calculate').on('click', function(){
        $('#output').css("color", "black");
        var tax=0;
        var income = getValue($income);
        var expenses = getValue($expenses);
        var retirement = getValue($retire);
        if ($married.is(':checked')) {
            tax = income>466951?(.4 *(income-466951)+130828):income>411500?(.35*(income-411500)+111324):income>230450?(.33*(income-230450)+51577):income>151201?(.28*(income-151201)+29387):income>74900?(.25*(income-74900)+10312):income>18451?(.15*(income-18451)+1845):(.1*income);
        } else {
            tax = income>413201?(.4*(income-413201)+119996):income>411500?(.35*(income-411500)+119401):income>189300?(.33*(income-189300)+46075):income>90750?(.28*(income-90750)+18481):income>37450?(.25*(income-37450)+5156):income>9226?(.15*(income-9226)+922):(.1*income);
        }
        var taxedIncome = .93*(income - tax);
        var savings = taxedIncome - expenses;
        var worth = $('#positive').is(':checked')?getValue($worth):((getValue($worth))*-1);
        var initial = worth;
        if ($timeToRetire.hasClass('selected')) {
            var B = 0;
            if (!error(expenses+worth+income)) {
                var target = expenses/.04;
                while (initial<target && B < 100) {
                    initial = ((initial * 1.045) + savings);
                    B++;
                }
                if (B === 100) {
                    output("In your current financial situation, retirement may be difficult. See below for possible solutions.")
                } else {
                    $retire.val(B);
                    output("With an annual income of $" + taxedIncome.toFixed(0) + " after tax, and $" + expenses + " in expenses, you will be able to retire in " + (B) + " years, in " + (year + B) + ".");
                }
            }
        }
        if (selected($maxExpenses)) {
            var maxExpense = 0;
            if (!error(worth+income+retirement)) {
                for (i=1000000; initial<(i/.04); i-=200) {
                    initial = worth;
                    for (j=0; j<retirement; j++) {
                        initial = ((initial * 1.045) + (taxedIncome-i));
                    }
                    maxExpense = Math.max(0, i-200);
                }
                $expenses.val(maxExpense);
                output("With an annual income of $" + taxedIncome.toFixed(0) + " after tax, and a desired retirement in "+retirement+' years, in '+(year+retirement)+', your maximum annual expenses must be $' + maxExpense + '.');
            }
        }
        if (selected($('#retirement-worth'))) {
            if (!error(income+retirement+expenses+worth)) {
                for (i=0; i<retirement; i++) {
                    worth = (worth*1.045)+(savings);
                }
                output("Your net worth at retirement, in "+(year+retirement)+", will be $"+worth.toFixed(0)+'.')
            }
        }
        if (selected($reqIncome)) {
            var minIncome = 0;
            var retirementWorth = worth;
            if (!error(worth+retirement+expenses)) {
                for (i=0; retirementWorth<(expenses/.04); i+=200) {
                    retirementWorth = worth;
                    for (j=0; j<retirement; j++) {
                        retirementWorth = ((retirementWorth*1.045) + (i-expenses))
                    }
                    if ($married.is(':checked')) {
                        minIncome = 1.3 * i;
                    } else {
                        minIncome = 1.4 * i;
                    }
                }
                $income.val(minIncome);
                output("With annual expenses of "+expenses+" and a desired retirement in "+retirement+' years, in '+(year+retirement)+', your minimum annual income must be $'+minIncome+'.')
            }
        }
        output(getValue('#income'));
    });
});