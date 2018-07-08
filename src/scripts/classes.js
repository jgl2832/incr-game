// Types
class Button {
	constructor(name, text, resource, clickFn) {
		this.clickFn = clickFn;
		this.html = $("<div />", {
			id: name,
			"class": "clickable noselect",
			html: (resource.cost) ? [
				text + " (",
				$("<span />", {
					id: resource.costId, 
					text: "",
				}),
				" $)"
			] : text,
			click: clickFn
		});
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
			text: capitalize(resource.name) + " x" + mult + " (" + cost + " " + costResource.name + ")",
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
		this.totalIncomePerSecond = function() {
			var ret = {}
			for (var resource of this.list) {
				// Add income
				if (resource.incomePerSecond) {
					var incomeDict = resource.incomePerSecond();
					for (var incomeType in incomeDict) {
						if (!(incomeType in ret)) {
							ret[incomeType] = 0;
						}
						ret[incomeType] += incomeDict[incomeType]
					}
				}
			}
			return ret;
		}
		this.perSecondHtml = function() {
			var perSec = totalIncomePerSecond()
			return this.list.map(r => $("<td />", { text: perSec[r] + "/sec" }));
		}
		this.html = $("<table />", {
			"class": "resource-table",
			html: [
				$("<tr />", {
					html: list.map(r => $("<th />", { 
						style: "display: none",
						id: r.nameId,
						html: [ r.displayName, $("<span />", {
							id: r.incomeIdContainer,
							html: [ " (", $("<span />", { id: r.incomeId, text: ""}), ")" ]
						})]
					}))
				}),
				$("<tr />", {
					html: list.map(r => $("<td />", { style: "display: none", id: r.countId, text: r.count }))
				})
			]
		});
	}
}
class Resource {
	constructor(name, displayName) {
		this.name = name;
		this.displayName = displayName;
		this.count = 0;
		this.nameId = name + "-name";
		this.countId = name + "-count";
		this.incomeId = name + "-income";
		this.incomeIdContainer = name + "-income-container";
		this.costId = name + "-cost";
	}
}
class GeneratorResource extends Resource {
	constructor(name, displayName, costForCount, baseIncomePerSecond) {
		super(name, displayName);
		this.boughtCount = 0;
		this.incomeMult = 1;
		this.costForCount = costForCount;
		this.baseIncomePerSecond = baseIncomePerSecond;
		this.incomePerSecond = function() {
			var base = this.baseIncomePerSecond();
			for (var inc in base) {
				base[inc] *= this.incomeMult;
			}
			return base;
		};
		this.incomePerFrame = function() {
			var base = this.incomePerSecond();
			for (var inc in base) {
				base[inc] /= fps;
			}
			return base;
		}
		this.cost = () => this.costForCount(this.boughtCount);
	}
}
