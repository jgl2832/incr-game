var fps = 15;
var resources = {
	potential: {
		count: 1000
	},
	autodigger: {
		count: 0,
		boughtCount: 0,
		startCost: 10,
		scaleFactor: 1.1,
		get cost () {
			return Math.ceil(this.startCost * Math.pow(this.scaleFactor, this.boughtCount));
		},
		get incomePerFrame () {
			// 1 potential per autodigger per second
			var potentialPerSecond = 1 * this.count;
			var potentialPerFrame = potentialPerSecond / fps;
			return { potential: potentialPerFrame }
		}
	},
	factory: {
		count: 0,
		boughtCount: 0,
		startCost: 1000,
		scaleFactor: 1.2,
		get cost () {
			return Math.ceil(this.startCost * Math.pow(this.scaleFactor, this.boughtCount));
		},
		get incomePerFrame () {
			// TODO make this create autodiggers
			// 1 autodigger per factory per second
			var autodiggerPerSecond = 1 * this.count;
			var autodiggerPerFrame = autodiggerPerSecond / fps;
			return { autodigger: autodiggerPerFrame }
		}
	}
}
var buttons = {
	dig: {
		clickFn: function() {
			resources.potential.count += 1;
		}
	},
	buyAutodigger: {
		clickFn: function() {
			var cost = resources.autodigger.cost
			if (resources.potential.count >= cost) {
				resources.potential.count -= cost;
				resources.autodigger.count += 1;
				resources.autodigger.boughtCount += 1;
			}
		}
	},
	buyFactory: {
		clickFn: function() {
			var cost = resources.factory.cost
			if (resources.potential.count >= cost) {
				resources.potential.count -= cost;
				resources.factory.count += 1;
				resources.factory.boughtCount += 1;
			}
		}
	}
}
