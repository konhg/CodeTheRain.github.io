namespace MainUI {
	export function r(from, to) {
		return ~~(Math.random() * (to - from + 1) + from);
	}
	export function pick(q, w, e) {
		return arguments[r(0, arguments.length - 1)];
	}
	export function getChar() {
		return String.fromCharCode(pick(
			r(0x3041, 0x30ff),
			r(0x2000, 0x206f),
			r(0x0020, 0x003f)
		));
	}
	export class Char {
		public element: egret.TextField;
		constructor() {
			this.element = new egret.TextField();
			this.mutate();
		}
		mutate() {
			this.element.text = getChar();
		}
	}
	export class Trail {
		public body;
		constructor(public list = [], public options) {
			this.list = list;
			this.options = (<any>Object).assign(
				{ size: 10, offset: 0 }, options
			);
			this.body = [];
			this.move();
		}
		clear() {
			this.body = [];
			this.list = [];
		}
		traverse(fn) {
			this.body.forEach((n, i) => {
				let last = (i == this.body.length - 1);
				if (n) fn(n, i, last);
			});
		}
		move() {
			this.body = [];
			let { offset, size } = this.options;
			for (let i = 0; i < size; ++i) {
				let item = this.list[offset + i - size + 1];
				this.body.push(item);
			}
			this.options.offset =
				(offset + 1) % (this.list.length + size - 1);
		}
	}
	export class Rain {
		public element: eui.Group;
		public trail: Trail;
		constructor({ target, row, i}) {
			this.element = new eui.Group();
			// this.element.name = i;
			this.build(row);
			if (target) {
				target.addChild(this.element);
				this.element.x = 33 * i;
			}
			this.drop();
		}
		clear() {
			this.element.removeChildren();
			this.element.parent.removeChild(this.element);
			this.element = null;
			this.trail.clear();
			this.trail = null;

		}
		build(row = 20) {
			let root = new eui.Group();
			let chars = [];
			for (let i = 0; i < row; ++i) {
				let c = new Char();
				// c.element.name = i + '';
				root.addChild(c.element);
				c.element.y = c.element.height * (i - 1);
				chars.push(c);
				if (Math.random() < .5) {
					loop(() => c.mutate(), r(1e3, 5e3));
				}
			}
			this.trail = new Trail(chars, {
				size: r(10, 30), offset: r(0, 100)
			});
			this.element.addChild(root);
		}
		drop() {
			let trail = this.trail;
			let len = trail.body.length;
			let delay = r(10, 80);
			loop(() => {
				trail.move();
				trail.traverse((c: Char, i, last) => {
					let color: number = Number(convertColor(`136,100%,${85 / len * (i + 1)}%`).replace('#', '0x'));
					// console.log(convertColor(`136,100%,${85 / len * (i + 1)}%`).replace('#', '0x'))
					c.element.textColor = color;
					if (last) {
						c.mutate();
						c.element.textColor = 0xb3ffc7;
						c.element.strokeColor = 0xffffff;
					}
				});
			}, delay);
		}
	}
	export function loop(fn, delay) {
		let stamp = Date.now();
		function _loop() {
			if (Date.now() - stamp >= delay) {
				fn(); stamp = Date.now();
			}
			requestAnimationFrame(_loop);
		}
		requestAnimationFrame(_loop);
	}
}