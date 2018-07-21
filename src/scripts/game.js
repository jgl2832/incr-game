//TODO Add an element of pancake selling
//TODO add things like syrup and berries to make pancakes sell for more $$

var readyFunction = function() {
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

		// Button visibility
		for (var button of buttons) {
			var buttonHtml = $("#"+button.id);
			if (buttonHtml.is(":hidden") && button.showWhen()) {
				buttonHtml.show();
			}
		}

		// Upgrade visibility
		for (var upgrade of upgrades) {
			if (!upgrade.bought) {
				var upgradeHtml = $("#"+upgrade.id);
				if (upgradeHtml.is(":hidden") && upgrade.showWhen()) {
					if ($("#upgrades-wrapper").is(":hidden")) {
						$("#upgrades-wrapper").show();
					}
					upgradeHtml.show();
				}
			}
		}

		// Update HTML elements
		for (var resource of resources.list) {
			// Update income
			var perSec = resource.name in incomePerSec ? incomePerSec[resource.name] : 0
			var perFrame = perSec / fps;
			resource.count += perFrame;
			if ( perSec > 0 ) {
				var incomeIdContainer = $("#"+resource.incomeIdContainer);
				if (incomeIdContainer.is(":hidden")) {
					incomeIdContainer.show();
				}
				$("#"+resource.incomeId).text(Math.floor(perSec) + "/sec");
			} else {
				$("#"+resource.incomeIdContainer).hide();
			}
			
			// Update Resource Amounts
			if (resource.count > 0 && $("#"+resource.nameId).is(":hidden")) {
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
}

$( document ).ready( function() {
	$.getScript("src/scripts/classes.js").done(function () {
		$.getScript("src/scripts/resources.js").done(readyFunction)
	});
});
