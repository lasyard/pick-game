var Pick = (function(D) {
	var N = 9; // Number of columns
	var H = 12; // Max number of coins in a column
	var COLOR = '#00AA00';
	var blink = new Blink(200, 6);
	blink.setColor('#AA0000', COLOR);

	function Pick(boardId, totalId, endFun, signFun) {
		var i;
		this.board = D.getElementById(boardId);
		var html = '';
		html += '<table>';
		html += '<colgroup>';
		for (i = 0; i < N; i++) html += '<col style="width:'+100/N+'%" />';
		html += '</colgroup>';
		html += '<tr class="chessman-row">';
		for (i = 0; i < N; i++) html += '<td></td>';
		html += '</tr>';
		html += '<tr class="number-row">';
		for (i = 0; i < N; i++) html += '<th>0</th>';
		html += '</tr>';
		html += '</table>';
		this.board.innerHTML = html;
		this.columns = this.board.getElementsByTagName('td'); // Nodes to contain coins
		this.numLabels = this.board.getElementsByTagName('th'); // Nodes to show num of each column
		this.totalLabel = D.getElementById(totalId); // Node to show the total number
		this.endFun = endFun;
		this.signFun = signFun;
		this.num = []; // Numbers of coins in each column
		this.total; // Total number of coins
	}

	Pick.prototype.updateNum = function(x) {
		this.numLabels[x].innerHTML = this.num[x];
	};

	Pick.prototype.updateTotal = function() {
		this.totalLabel.innerHTML = this.total;
	};

	Pick.prototype.removeOne = function(x) {
		this.columns[x].removeChild(this.columns[x].childNodes[0]);
	};

	Pick.prototype.clear = function() {
		for (var x = 0; x < this.columns.length; x++) {
			while (this.columns[x].hasChildNodes()) this.removeOne(x);
			this.num[x] = 0;
			this.updateNum(x);
		}
		this.total = 0;
		this.updateTotal();
	};

	Pick.prototype.pick = function(x, n) {
		var divs = this.columns[x].getElementsByTagName('div');
		var nodes = [ ];
		for (var i = 0; i < n; i++) nodes.push(divs[i]);
		var self = this;
		blink.start(nodes, function() {
			for (i = 0; i < n; i++) self.removeOne(x);
			self.num[x] -= n;
			self.total -= n;
			self.updateNum(x);
			self.updateTotal();
			if (self.total == 0) {
				if (typeof(self.endFun) == 'function') self.endFun(false);
			}
			if (typeof(self.signFun) == 'function') self.signFun(0);
		});
	};

	Pick.prototype.put = function(x, n) {
		var self = this;
		for (var i = 0; i < n; i++) {
			var node = D.createElement('div');
			node.style.backgroundColor = COLOR;
			node.style.height = 90/H+'%';
			node.style.width = '95%';
			node.onclick = function(e) {
				r = self.onClick(e);
				e.stopPropagation();
				return r;
			};
			this.columns[x].appendChild(node);
		}
		this.num[x] += n;
		this.total += n;
		this.updateNum(x);
		this.updateTotal();
	};

	Pick.prototype.newGame = function() {
		blink.kill();
		this.clear();
		for (var x = 0; x < this.columns.length; x++) {
			this.put(x, 1+Math.rand(H));
		}
	};

	Pick.prototype.play = function() {
		if (this.total == 0) {
			if (typeof(this.endFun) == 'function') this.endFun(true);
		} else {
			var r, i;
			for (r = 0, i = 0; i < N; i++) r ^= this.num[i];
			if (r == 0) {
				if (typeof(this.signFun) == 'function') this.signFun(-1);
				while (this.num[i = Math.rand(N)] == 0);
				this.pick(i, 1+Math.rand(this.num[i]));
			} else {
				if (typeof(this.signFun) == 'function') this.signFun(1);
				i = 0;
				while ((s = this.num[i]-(this.num[i] ^ r)) <= 0) i++;
				this.pick(i, s);
			}
		}
	};

	Pick.prototype.onClick = function(e) {
		if (blink.isRunning()) return;
		var e = e || window.event;
		var target = e.target || e.srcElement;
		if (target.nodeName != 'div' && target.nodeName != 'DIV') return;
		for (var x = 0; x < this.columns.length; x++) {
			if (target.parentNode === this.columns[x]) break;
		}
		while (target.previousSibling) {
			target.parentNode.removeChild(target.previousSibling);
			this.num[x]--;
			this.total--;
		}
		target.parentNode.removeChild(target);
		this.num[x]--;
		this.total--;
		this.updateNum(x);
		this.updateTotal();
		this.play();
		return true;
	};

	return Pick;
}(document));
