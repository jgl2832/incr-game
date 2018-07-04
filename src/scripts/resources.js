// Target frames to process per second
var fps = 15;

// Currently selected multiplier for buying resources
var buyMult = 1;

// Types
function Button(clickFn) {
	this.clickFn = clickFn;
}
function BasicResource() {
	this.count = 0;
}
function Resource(startCost, scaleFactor, costForCount, incomePerFrame) {
	this.count = 0;
	this.boughtCount = 0;
	this.startCost = startCost;
	this.scaleFactor = scaleFactor;
	this.costForCount = costForCount;
	this.incomePerFrame = incomePerFrame;
	this.cost = function() {
		return this.costForCount(this.boughCount);
	}
}

// Resource definitions
var resources = {
	potential: new BasicResource(),
	autodigger: new Resource(
		10, // startCost
		1.1, // scaleFactor
		function(count) { // costForCount
			return Math.ceil(this.startCost * Math.pow(this.scaleFactor, count));
		},
		function() { // incomePerFrame
			// 1 potential per autodigger per second
			var potentialPerSecond = 1 * this.count;
			var potentialPerFrame = potentialPerSecond / fps;
			return { potential: potentialPerFrame }
		}
	),
	factory: new Resource(
		1000, // startCost
		1.2, // scaleFactor
		function(count) { // costForCount
			return Math.ceil(this.startCost * Math.pow(this.scaleFactor, count));
		},
		function() { // incomePerFrame
			// 1 autodigger per factory per second
			var autodiggerPerSecond = 1 * this.count;
			var autodiggerPerFrame = autodiggerPerSecond / fps;
			return { autodigger: autodiggerPerFrame }
		}
	),
}
// Button definitions
var buttons = {
	dig: new Button(function() {
		resources.potential.count += 1;
	}),
	buyAutodigger: new Button(function() {
		buyHelper(resources.autodigger, resources.potential);
	}),
	buyFactory: new Button(function() {
		buyHelper(resources.factory, resources.potential);
	})
}

// Helper functions
var buyHelper = function(resource, costResource) {
	var cost = multCost(buyMult, resource)
	if (costResource.count >= cost) {
		costResource.count -= cost;
		resource.count += buyMult;
		resource.boughtCount += buyMult;
	}
}
var multCost = function(mult, resource) {
	var acc = 0;
	var forCount = resource.count;
	var toCount = resource.count + mult;
	while (forCount < toCount) {
		acc += resource.costForCount(forCount);
		forCount += 1;
	}
	return acc;
}
