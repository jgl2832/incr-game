//TODO make it breakfast themed

$( document ).ready( function() {
	$.when(
		$.getScript("src/scripts/classes.js"),
		$.getScript("src/scripts/resources.js")
	).done(function() {
		for (var upgrade of upgrades) {
			$("#upgrades").append(upgrade.html);
		}
		for (var button of buttons) {
			$("#buttons").append(button.html);
		}
		$("#resources").append(resources.html);
		var update = function() {
			// get current income persecond
			var incomePerSec = resources.totalIncomePerSecond();

			// Update HTML elements
			for (var resource of resources.list) {
				// Update income
				var perSec = resource.name in incomePerSec ? incomePerSec[resource.name] : 0
				var perFrame = perSec / fps;
				resource.count += perFrame;
				$("#"+resource.incomeId).text(Math.floor(perSec) + "/sec");
				
				// Update Resource Amounts
				$("#"+resource.countId).html(Math.floor(resource.count));

				// Update Costs
				if (resource.cost) {
					$("#"+resource.costId).html(multCost(buyMult, resource));
				}
			}
		};
		setInterval(update, 1000 / fps);
	});
});
