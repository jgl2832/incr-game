//TODO make it breakfast themed

$( document ).ready( function() {
	$.when(
		$.getScript("src/scripts/classes.js"),
		$.getScript("src/scripts/resources.js")
	).done(function() {
		for (var button in buttons) {
			var buttonAttrs = buttons[button];
			$("#"+button).click(buttonAttrs.clickFn);
		}
		for (var upgrade of upgrades) {
			$("#upgrades").append(upgrade.html);
		}
		$("#resources").append(resources.html);
		var update = function() {
			// Add income
			var incomePerSec = resources.totalIncomePerSecond();
			for (var incomeType in incomePerSec) {
				var perSec = incomePerSec[incomeType];
				var perFrame = perSec / fps;
				resources.map.get(incomeType).count += perFrame;
			}

			// Update HTML elements
			for (var resource of resources.list) {
				// Update Resource Amounts
				$("#"+resource.countId).html(Math.floor(resource.count));

				// Update Costs
				if (resource.cost) {
					$("#"+resource.costId).html(multCost(buyMult, resource));
				}

				// Update income
				var perSec = resource.name in incomePerSec ? incomePerSec[resource.name] : 0
				$("#"+resource.incomeId).text(Math.floor(perSec) + "/sec");
			}
		};
		setInterval(update, 1000 / fps);
	});
});
