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
					var incomePerFrame = resourceAttrs.incomePerFrame;
					if (incomePerFrame) {
						for (var incomeType in incomePerFrame) {
							resources[incomeType].count += incomePerFrame[incomeType];
						}
					}

					// Update Resource Amounts
					$("#"+resource).html(Math.floor(resourceAttrs.count));

					// Update Costs
					var cost = resourceAttrs.cost;
					if (cost) {
						$("#"+resource+"-cost").html(cost);
					}
				}
			}
		};
		setInterval(update, 1000 / fps);
	});
});
