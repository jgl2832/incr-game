$( document ).ready( function() {
	$.when(
		$.getScript("src/scripts/resources.js")
	).done(function() {
		for (var button in buttons) {
			var buttonAttrs = buttons[button];
			$("#"+button).click(buttonAttrs.clickFn);
		}
		for (var upgrade of upgrades) {
			$("#upgrades").append(upgrade.html);
		}
		var update = function() {
			for (var resource of resources) {
				// Add income
				if (resource.incomePerFrame) {
					incomeDict = resource.incomePerFrame();
					for (var incomeType in incomeDict) {
						resourceMap.get(incomeType).count += incomeDict[incomeType];
					}
				}

				// Update Resource Amounts
				$("#"+resource.name).html(Math.floor(resource.count));

				// Update Costs
				if (resource.cost) {
					$("#"+resource.name+"-cost").html(multCost(buyMult, resource));
				}
			}
		};
		setInterval(update, 1000 / fps);
	});
});
