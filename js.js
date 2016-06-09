$(document).ready(function () {

	var $retire = $('#retire');
	var $expenses = $('#expenses');
	var $income = $('#income');
	var $worth = $('#worth');
	var $reqIncome = $('#req-income');
	var $maxExpenses = $('#max-expenses');
	var $timeToRetire = $('#time-to-retire');
	var $married = $('#married');
	var date = new Date();
	var year = date.getFullYear();

	var error = function (number) {
		if (isNaN(number)) {
			output("Check that all inputs have been entered correctly.");
			$('#output').css("color", "red");
			$('#calculate')
				.parent()
				.parent()
				.effect("shake", {
					direction: 'up',
					times    : 3,
					distance : 5
				}, 300);
			return true;
		}
	};

	var getValue = function (x) {
		return Math.abs(parseInt(x.val()));
	};

	var disable = function (x) {
		x.val('');
		x.prop('disabled', true);
	};

	var selected = function (x) {
		return x.hasClass('selected');
	};

	var output = function (finalMessage) {
		$('#output').text(finalMessage);
	};

	var $calcButton = $('#calc-type button');

	$calcButton.on('click', function () {

		/**
		 * Look at the jQuery toggleClass method for additional and potentially more optimal ways of handling
		 * the the removal and addition of classes for the buttons below.
		 */

		$calcButton.removeClass('selected');
		$(this).addClass("selected");
		$('#calculator input').prop('disabled', false);
		if (selected($timeToRetire)) {
			disable($retire);
		}
		if (selected($maxExpenses)) {
			disable($expenses);
		}
		if (selected($reqIncome)) {
			disable($income);
		}
	});

	$('#calculate').on('click', function () {
		$('#output').css("color", "black");
		var tax = 0;
		var income = getValue($income);
		var expenses = getValue($expenses);
		var retirement = getValue($retire);
		if ($married.is(':checked')) {
			if (income > 466951) {
				tax = (0.4 * (income - 466951) + 130828);
			} else if (income > 411500) {
				tax = (0.35 * (income - 411500) + 111324);
			} else if (income > 230450) {
				tax = (0.33 * (income - 230450) + 51577);
			} else if (income > 151201) {
				tax = (0.28 * (income - 151201) + 29387);
			} else if (income > 74900) {
				tax = (0.25 * (income - 74900) + 10312);
			} else if (income > 18451) {
				tax = (0.15 * (income - 18451) + 1845);
			} else {
				tax = (.1 * income);
			}
		} else {
			if (income > 413201) {
				tax = (0.4 * (income - 413201) + 119996);
			} else if (income > 411500) {
				tax = (0.35 * (income - 411500) + 119401);
			} else if (income > 189300) {
				tax = (0.33 * (income - 189300) + 46075);
			} else if (income > 90750) {
				tax = (0.28 * (income - 90750) + 18481);
			} else if (income > 37450) {
				tax = (0.25 * (income - 37450) + 5156);
			} else if (income > 9226) {
				tax = (0.15 * (income - 9226) + 922);
			} else {
				tax = (0.1 * income);
			}
		}
		var taxedIncome = 0.93 * (income - tax);
		var savings = taxedIncome - expenses;
		var worth = $('#positive').is(':checked') ? getValue($worth) : ((getValue($worth)) * -1);
		var initial = worth;
		if ($timeToRetire.hasClass('selected')) {
			var maxOut = 0;
			if (!error(expenses + worth + income)) {
				var targetWorth = expenses / 0.04;
				while (initial < targetWorth && maxOut < 100) {
					initial = ((initial * 1.045) + savings);
					maxOut++;
				}
				if (maxOut === 100) {
					output("In your current financial situation, retirement may be difficult. See below for possible solutions.");
				} else {
					$retire.val(maxOut);
					output("With an annual income of $" + taxedIncome.toFixed(0) + " after tax, and $" + expenses + " in expenses, you will be able to retire in " + (maxOut) + " years, in " + (year + maxOut) + ".");
				}
			}
		}
		if (selected($maxExpenses)) {
			var maxExpense = 0;
			if (!error(worth + income + retirement)) {
				for (var i = 1000000; initial < (i / 0.04); i -= 200) {
					initial = worth;
					for (var j = 0; j < retirement; j++) {
						initial = ((initial * 1.045) + (taxedIncome - i));
					}
					maxExpense = Math.max(0, i - 200);
				}
				$expenses.val(maxExpense);
				output("With an annual income of $" + taxedIncome.toFixed(0) + " after tax, and a desired retirement in " + retirement + ' years, in ' + (year + retirement) + ', your maximum annual expenses must be $' + maxExpense + '.');
			}
		}
		if (selected($('#retirement-worth'))) {
			if (!error(income + retirement + expenses + worth)) {
				for (var i = 0; i < retirement; i++) {
					worth = (worth * 1.045) + (savings);
				}
				output("Your net worth at retirement, in " + (year + retirement) + ", will be $" + worth.toFixed(0) + '.');
			}
		}
		if (selected($reqIncome)) {
			var minIncome = 0;
			var retirementWorth = worth;
			if (!error(worth + retirement + expenses)) {
				for (var i = 0; retirementWorth < (expenses / 0.04); i += 200) {
					retirementWorth = worth;
					for (var j = 0; j < retirement; j++) {
						retirementWorth = ((retirementWorth * 1.045) + (i - expenses));
					}
					if ($married.is(':checked')) {
						minIncome = 1.3 * i;
					} else {
						minIncome = 1.4 * i;
					}
				}
				$income.val(minIncome);
				output("With annual expenses of " + expenses + " and a desired retirement in " + retirement + ' years, in ' + (year + retirement) + ', your minimum annual income must be $' + minIncome + '.');
			}
		}
		output(getValue('#income'));
	});
});