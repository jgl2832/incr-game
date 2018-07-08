// Target frames to process per second
var fps = 15;

// Currently selected multiplier for buying resources
var buyMult = 1;

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

// Resource definitions
var resources = new Resources([
	new Resource("pancake"),
	new GeneratorResource("griddle",
		function(ct) { // costForCount
			return Math.ceil(10 * Math.pow(1.1, ct));
		},
		function() { // baseIncomePerSecond
			// 1 pancake per griddle per second
			var pancakePerSecond = 1 * this.count;
			return { pancake: pancakePerSecond }
		}
	),
	new GeneratorResource("factory",
		function(ct) { // costForCount
			return Math.ceil(1000 * Math.pow(1.2, ct));
		},
		function() { // baseIncomePerSecond
			// 1 griddle per factory per second
			var griddlePerSecond = 1 * this.count;
			return { griddle: griddlePerSecond }
		}
	),
	new GeneratorResource("planet",
		function(ct) { // costForCount
			return Math.ceil(20000 * Math.pow(1.5, ct));
		},
		function() { // baseIncomePerSecond
			// 1 factory per planet per second
			var factoryPerSecond = 1 * this.count;
			return { factory: factoryPerSecond }
		}
	)
]);
// Upgrade definitions
var upgrades = [
	new Upgrade(resources.map.get("griddle"), resources.map.get("pancake"), 2, 100),
	new Upgrade(resources.map.get("griddle"), resources.map.get("pancake"), 2, 1000)
]
// Button definitions
var buttons = [
	new Button(
		"makePancake", "Make Pancake", resources.map.get("pancake"), 
		() => resources.map.get("pancake").count += 1
	),
	new Button(
		"buyGriddle", "Buy Griddle", resources.map.get("griddle"),
		() => buyHelper(resources.map.get("griddle"), resources.map.get("pancake"))
	),
	new Button(
		"buyFactory", "Buy Factory", resources.map.get("factory"),
		() => buyHelper(resources.map.get("factory"), resources.map.get("pancake"))
	),
	new Button(
		"buyPlanet", "Buy Planet", resources.map.get("planet"),
		() => buyHelper(resources.map.get("planet"), resources.map.get("pancake"))
	)
]

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
