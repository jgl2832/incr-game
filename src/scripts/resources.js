// Target frames to process per second
var fps = 15;

// Currently selected multiplier for buying resources
var buyMult = 1;

// Types
class Button {
	constructor(clickFn) {
		this.clickFn = clickFn;
	}
}
class Upgrade {
	constructor(resource, costResource, mult, cost) {
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
	}
}
class Resource {
	constructor() {
		this.count = 0;
	}
}
class GeneratorResource extends Resource {
	constructor(startCost, scaleFactor, costForCount, baseIncomePerFrame) {
		super();
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
var resources = {
	potential: new Resource(),
	autodigger: new GeneratorResource(
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
	factory: new GeneratorResource(
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
	),
}
// Button definitions
var buttons = {
	dig: new Button(() => resources.potential.count += 1),
	buyAutodigger: new Button(() => buyHelper(resources.autodigger, resources.potential)),
	buyFactory: new Button(() => buyHelper(resources.factory, resources.potential))
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
