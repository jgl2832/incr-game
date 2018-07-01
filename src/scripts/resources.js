var fps = 15;
var resources = {
	potential: {
		count: 0
	},
	autodigger: {
		count: 0,
		startCost: 10,
		scaleFactor: 1.1,
		get cost () {
			return Math.ceil(this.startCost * Math.pow(this.scaleFactor, this.count));
		},
		get incomePerFrame () {
			// 1 potential per autodigger per second
			var potentialPerSecond = 1 * this.count;
			var potentialPerFrame = potentialPerSecond / fps;
			return potentialPerFrame
		}
	},
	factory: {
		count: 0,
		startCost: 1000,
		scaleFactor: 1.2,
		get cost () {
			return Math.ceil(this.startCost * Math.pow(this.scaleFactor, this.count));
		},
		get incomePerFrame () {
			// TODO make this create autodiggers
			// 10 potential per autodigger per second
			var potentialPerSecond = 10 * this.count;
			var potentialPerFrame = potentialPerSecond / fps;
			return potentialPerFrame
		}
	}
}
