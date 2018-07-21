// Target frames to process per second
var fps = 15;

// Currently selected multiplier for buying resources
var buyMult = 1;

// How many bucks a pancake goes fer
var pancakeSellValue = 1;
var pancakeCreateMult = 1;

var griddleUnlocked = false;


function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

// Resource definitions
var resources = new Resources([
	new Resource("bucks", "$"),
	new Resource("pancake", "Pancakes"),
	new GeneratorResource("griddle", "Griddles",
		function(ct) { // costForCount
			return Math.ceil(10 * Math.pow(1.2, ct));
		},
		function() { // baseIncomePerSecond
			// 1 pancake per griddle per second
			var pancakePerSecond = 1 * pancakeCreateMult * this.count;
			return { pancake: pancakePerSecond }
		}
	),
	new GeneratorResource("salesperson", "Pancake Salesperson",
		function(ct) { // costForCount
			return Math.ceil(40 * Math.pow(1.3, ct));
		},
		function() { // baseIncomePerSecond
			// sells one pancake per griddle per second
			var pancakePerSecond = -1 * this.count;
			var bucksPerSecond = pancakeSellValue * this.count;
			return {
				pancake: pancakePerSecond,
				bucks: bucksPerSecond
			};
		}
		)
]);
// Upgrade definitions
var upgrades = [
	new Upgrade("first", "Pancakes sell for twice as much", 50, resources.map.get("bucks"),
		() => resources.map.get("bucks").count >= 10,
		() => pancakeSellValue *= 2
	),
	new Upgrade("second", "Create pancakes twice as fast", 200, resources.map.get("bucks"),
		() => resources.map.get("bucks").count >= 45,
		() => pancakeCreateMult *= 2
	),
	new Upgrade("griddle", "Unlock Griddle", 400, resources.map.get("bucks"),
		() => resources.map.get("bucks").count >= 150,
		() => griddleUnlocked = true
	)
]
// Button definitions
var buttons = [
	new Button(
		"makePancake", "Make Pancake", resources.map.get("pancake"),
		() => true,
		() => resources.map.get("pancake").count += pancakeCreateMult
	),
	new Button(
		"sellPancake", "Sell Pancake", resources.map.get("pancake"),
		() => resources.map.get("pancake").count >= 10,
		() => {
			if (resources.map.get("pancake").count >= 1) {
				resources.map.get("pancake").count -= 1;
				resources.map.get("bucks").count += pancakeSellValue;
			}
		}
	),
	new Button(
		"buyGriddle", "Buy Griddle", resources.map.get("griddle"),
		() => griddleUnlocked,
		() => buyHelper(resources.map.get("griddle"), resources.map.get("bucks"))
	),
	new Button(
		"buySalesperson", "Hire Pancake Salesperson", resources.map.get("salesperson"),
		() => false,
		() => buyHelper(resources.map.get("salesperson"), resources.map.get("bucks"))
	)
];

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
