//TODO Add an element of pancake selling
//TODO add things like syrup and berries to make pancakes sell for more $$

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
				if ( perSec > 0 ) {
					$("#"+resource.incomeIdContainer).show();
					$("#"+resource.incomeId).text(Math.floor(perSec) + "/sec");
				} else {
					$("#"+resource.incomeIdContainer).hide();
				}
				
				// Update Resource Amounts
				if (resource.count > 0) {
					$("#"+resource.nameId).show();
					$("#"+resource.countId).show();
				}
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
