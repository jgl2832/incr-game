// Target frames to process per second
var fps = 15;

// Currently selected multiplier for buying resources
var buyMult = 1;

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

// Resource definitions
var resources = new Resources([
	new Resource("potential"),
	new GeneratorResource("autodigger",
		function(ct) { // costForCount
			return Math.ceil(10 * Math.pow(1.1, ct));
		},
		function() { // baseIncomePerSecond
			// 1 potential per autodigger per second
			var potentialPerSecond = 1 * this.count;
			return { potential: potentialPerSecond }
		}
	),
	new GeneratorResource("factory",
		function(ct) { // costForCount
			return Math.ceil(1000 * Math.pow(1.2, ct));
		},
		function() { // baseIncomePerSecond
			// 1 autodigger per factory per second
			var autodiggerPerSecond = 1 * this.count;
			return { autodigger: autodiggerPerSecond }
		}
	)
]);
// Upgrade definitions
var upgrades = [
	new Upgrade(resources.map.get("autodigger"), resources.map.get("potential"), 2, 100),
	new Upgrade(resources.map.get("autodigger"), resources.map.get("potential"), 2, 1000)
]
// Button definitions
var buttons = {
	dig: new Button("dig", "Dig", () => resources.map.get("potential").count += 1),
	buyAutodigger: new Button("buyAutodigger", "Buy Autodigger", () => buyHelper(resources.map.get("autodigger"), resources.map.get("potential"))),
	buyFactory: new Button("buyFactory", "Buy Factory", () => buyHelper(resources.map.get("factory"), resources.map.get("potential")))
}

// Helper functions
var buyHelper = (resource, costResource) => {
	var cost = multCost(buyMult, resource)
	if (costResource.count >= cost) {
		costResource.count -= cost;
		resource.count += buyMult;
		resource.boughtCount += buyMult;
	}
}
var multCost = (mult, resource) => {
	var acc = 0;
	var forCount = resource.boughtCount;
	var toCount = resource.boughtCount + mult;
	while (forCount < toCount) {
		acc += resource.costForCount(forCount);
		forCount += 1;
	}
	return acc;
}
