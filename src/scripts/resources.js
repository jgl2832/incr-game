// Target frames to process per second
var fps = 15;

// Currently selected multiplier for buying resources
var buyMult = 1;

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

// Types
class Button {
	constructor(name, text, clickFn) {
		this.clickFn = clickFn;
	}
}
class Upgrade {
	constructor(resource, costResource, mult, cost) {
		var sup = this;
		this.bought = false;
		this.cost = cost;
		this.buy = function() {
			if (!this.bought && costResource.count >= cost) {
				costResource.count -= cost;
				resource.incomeMult *= mult;
				this.bought = true;
				return true;
			}
			return false;
		}
		this.html = $("<div />", {
			id: "upgrade",
			"class": "clickable noselect",
			text: resource.name + " x" + mult + " (" + cost + " " + costResource.name + ")",
			click: function() { 
				if (sup.buy()) {
					$(this).hide();
				}
			}
		});
	}
}
class Resources {
	constructor(list) {
		this.list = list;
		this.map = new Map(list.map(i => [i.name, i]));
		this.html = $("<table />", {
			"class": "resource-table",
			html: [
				$("<tr />", {
					html: list.map(r => $("<th />", { text: capitalize(r.name) }))
				}),
				$("<tr />", {
					html: list.map(r => $("<td />", { id: r.name, text: r.count }))
				})
			]
		});
	}
}
class Resource {
	constructor(name) {
		this.name = name;
		this.count = 0;
	}
}
class GeneratorResource extends Resource {
	constructor(name, startCost, scaleFactor, costForCount, baseIncomePerFrame) {
		super(name);
		this.boughtCount = 0;
		this.incomeMult = 1;
		this.startCost = startCost;
		this.scaleFactor = scaleFactor;
		this.costForCount = costForCount;
		this.baseIncomePerFrame = baseIncomePerFrame;
		this.incomePerFrame = function() {
			var base = this.baseIncomePerFrame();
			for (var inc in base) {
				base[inc] = base[inc] * this.incomeMult;
			}
			return base;
		};
		this.cost = () => this.costForCount(this.boughtCount);
	}
}

// Resource definitions
var resources = new Resources([
	new Resource("potential"),
	new GeneratorResource("autodigger",
		10, // startCost
		1.1, // scaleFactor
		function(ct) { // costForCount
			return Math.ceil(this.startCost * Math.pow(this.scaleFactor, ct));
		},
		function() { // baseIncomePerFrame
			// 1 potential per autodigger per second
			var potentialPerSecond = 1 * this.count;
			var potentialPerFrame = potentialPerSecond / fps;
			return { potential: potentialPerFrame }
		}
	),
	new GeneratorResource("factory",
		1000, // startCost
		1.2, // scaleFactor
		function(ct) { // costForCount
			return Math.ceil(this.startCost * Math.pow(this.scaleFactor, ct));
		},
		function() { // baseIncomePerFrame
			// 1 autodigger per factory per second
			var autodiggerPerSecond = 1 * this.count;
			var autodiggerPerFrame = autodiggerPerSecond / fps;
			return { autodigger: autodiggerPerFrame }
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
