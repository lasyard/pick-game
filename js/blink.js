var Blink = (function() {
	'use strict';

	function Blink(time, times) {
		this.time = time;
		this.times = times;
	}

	Blink.prototype.setColor = function(c1, c2) {
		this.color1 = c1;
		this.color2 = c2;
		return this;
	};

	Blink.prototype.start = function(nodes, callback) {
		this.blinkTimes = this.times;
		this.nodes = nodes;
		this.callback = callback;
		var self = this;
		this.timer = setTimeout(function() { self.onTimer(); }, this.time);
	};

	Blink.prototype.isRunning = function() {
		return this.timer != null;
	};

	Blink.prototype.kill = function() {
		if (this.timer) clearTimeout(this.timer);
		this.timer = null;
	};

	Blink.prototype.onTimer = function() {
		if (this.blinkTimes == 0) return;
		this.blinkTimes--;
		for (var i = 0; i < this.nodes.length; i++) {
			if (this.blinkTimes%2) {
				this.nodes[i].style.backgroundColor = this.color1;
			} else {
				this.nodes[i].style.backgroundColor = this.color2;
			}
		}
		if (this.blinkTimes > 0) {
			var self = this;
			this.timer = setTimeout(function() { self.onTimer(); }, this.time);
		} else {
			this.finish();
		}
	};

	Blink.prototype.finish = function() {
		this.timer = null;
		if (typeof(this.callback) == 'function') this.callback(this.nodes);
	};

	return Blink;
}());
