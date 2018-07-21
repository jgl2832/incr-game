var state = {
	// Target frames to process per second
	fps: 15,

	// Currently selected multiplier for buying resources
	buyMult: 1,

	// How many bucks a pancake goes fer
	pancakeSellValue: 1,

	// How many pancakes are created with one action
	pancakeCreateMult: 1,

	// Is griddle unlocked
	griddleUnlocked: false,

	// Is Salesperson unlocked
	salespersonUnlocked: false,

	// Is Syrup unlocked
	syrupUnlocked: false
};

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
			var pancakePerSecond = 1 * state.pancakeCreateMult * this.count;
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
			var bucksPerSecond = state.pancakeSellValue * this.count;
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
		() => state.pancakeSellValue *= 2
	),
	new Upgrade("second", "Create pancakes twice as fast", 200, resources.map.get("bucks"),
		() => resources.map.get("bucks").count >= 45,
		() => state.pancakeCreateMult *= 2
	),
	new Upgrade("griddle", "Unlock Griddle", 400, resources.map.get("bucks"),
		() => resources.map.get("bucks").count >= 150,
		() => state.griddleUnlocked = true
	),
	new Upgrade("fourth", "Create pancakes twice as fast", 500, resources.map.get("bucks"),
		() => resources.map.get("bucks").count >= 350,
		() => state.pancakeCreateMult *= 2
	),
	new Upgrade("salesperson", "Unlock Pancake Salesperson", 1000, resources.map.get("bucks"),
		() => resources.map.get("bucks").count >= 450,
		() => state.salespersonUnlocked = true
	),
	new Upgrade("sixth", "Pancakes sell for twice as much", 1500, resources.map.get("bucks"),
		() => resources.map.get("bucks").count >= 900,
		() => state.pancakeSellValue *= 2
	),
	new Upgrade("syrup", "Unlock ~Syrup~", 2500, resources.map.get("bucks"),
		() => resources.map.get("bucks").count >= 1400,
		() => state.syrupUnlocked = true
	)
]
// Button definitions
var buttons = [
	new Button(
		"makePancake", "Make Pancake", resources.map.get("pancake"),
		() => true,
		() => resources.map.get("pancake").count += state.pancakeCreateMult
	),
	new Button(
		"sellPancake", "Sell Pancake", resources.map.get("pancake"),
		() => resources.map.get("pancake").count >= 10,
		() => {
			if (resources.map.get("pancake").count >= 1) {
				resources.map.get("pancake").count -= 1;
				resources.map.get("bucks").count += state.pancakeSellValue;
			}
		}
	),
	new Button(
		"buyGriddle", "Buy Griddle", resources.map.get("griddle"),
		() => state.griddleUnlocked,
		() => buyHelper(resources.map.get("griddle"), resources.map.get("bucks"))
	),
	new Button(
		"buySalesperson", "Hire Pancake Salesperson", resources.map.get("salesperson"),
		() => state.salespersonUnlocked,
		() => buyHelper(resources.map.get("salesperson"), resources.map.get("bucks"))
	)
];

// Helper functions
var buyHelper = (resource, costResource) => {
	var cost = multCost(state.buyMult, resource)
	if (costResource.count >= cost) {
		costResource.count -= cost;
		resource.count += state.buyMult;
		resource.boughtCount += state.buyMult;
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
