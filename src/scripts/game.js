$( document ).ready( function() {
	$.when(
		$.getScript("src/scripts/resources.js")
	).done(function() {
		var update = function() {
			for (var resource in resources) {
				var resourceAttrs = resources[resource];
				if (resourceAttrs) {

					// Add income
					var incomePerFrame = resourceAttrs.incomePerFrame;
					if (incomePerFrame) {
						resources.potential.count += incomePerFrame;
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


		// TODO add these types of functions to resources file somehow
		$("#dig").click(function() {
			resources.potential.count += 1;
		});
		$("#buy-autodigger").click(function() {
			var cost = resources.autodigger.cost
			if (resources.potential.count >= cost) {
				resources.potential.count -= cost;
				resources.autodigger.count += 1;
			}
		});
		$("#buy-factory").click(function() {
			var cost = resources.factory.cost
			if (resources.potential.count >= cost) {
				resources.potential.count -= cost;
				resources.factory.count += 1;
			}
		});

	});
});
