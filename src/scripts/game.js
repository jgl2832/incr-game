$( document ).ready( function() {
	$.when(
		$.getScript("src/scripts/resources.js")
	).done(function() {
		for (var button in buttons) {
			var buttonAttrs = buttons[button];
			$("#"+button).click(buttonAttrs.clickFn);
		}

		var update = function() {
			for (var resource in resources) {
				var resourceAttrs = resources[resource];
				if (resourceAttrs) {

					// Add income
					if (resourceAttrs.incomePerFrame) {
						incomeDict = resourceAttrs.incomePerFrame();
						for (var incomeType in incomeDict) {
							resources[incomeType].count += incomeDict[incomeType];
						}
					}

					// Update Resource Amounts
					$("#"+resource).html(Math.floor(resourceAttrs.count));

					// Update Costs
					if (resourceAttrs.cost) {
						$("#"+resource+"-cost").html(multCost(buyMult, resourceAttrs));
					}
				}
			}
		};
		setInterval(update, 1000 / fps);
	});
});
