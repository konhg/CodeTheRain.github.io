var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var MainUI;
(function (MainUI) {
    function r(from, to) {
        return ~~(Math.random() * (to - from + 1) + from);
    }
    MainUI.r = r;
    function pick(q, w, e) {
        return arguments[r(0, arguments.length - 1)];
    }
    MainUI.pick = pick;
    function getChar() {
        return String.fromCharCode(pick(r(0x3041, 0x30ff), r(0x2000, 0x206f), r(0x0020, 0x003f)));
    }
    MainUI.getChar = getChar;
    var Char = (function () {
        function Char() {
            this.element = new egret.TextField();
            this.mutate();
        }
        Char.prototype.mutate = function () {
            this.element.text = getChar();
        };
        return Char;
    }());
    MainUI.Char = Char;
    __reflect(Char.prototype, "MainUI.Char");
    var Trail = (function () {
        function Trail(list, options) {
            if (list === void 0) { list = []; }
            this.list = list;
            this.options = options;
            this.list = list;
            this.options = Object.assign({ size: 10, offset: 0 }, options);
            this.body = [];
            this.move();
        }
        Trail.prototype.clear = function () {
            this.body = [];
            this.list = [];
        };
        Trail.prototype.traverse = function (fn) {
            var _this = this;
            this.body.forEach(function (n, i) {
                var last = (i == _this.body.length - 1);
                if (n)
                    fn(n, i, last);
            });
        };
        Trail.prototype.move = function () {
            this.body = [];
            var _a = this.options, offset = _a.offset, size = _a.size;
            for (var i = 0; i < size; ++i) {
                var item = this.list[offset + i - size + 1];
                this.body.push(item);
            }
            this.options.offset =
                (offset + 1) % (this.list.length + size - 1);
        };
        return Trail;
    }());
    MainUI.Trail = Trail;
    __reflect(Trail.prototype, "MainUI.Trail");
    var Rain = (function () {
        function Rain(_a) {
            var target = _a.target, row = _a.row, i = _a.i;
            this.element = new eui.Group();
            // this.element.name = i;
            this.build(row);
            if (target) {
                target.addChild(this.element);
                this.element.x = 33 * i;
            }
            this.drop();
        }
        Rain.prototype.clear = function () {
            this.element.removeChildren();
            this.element.parent.removeChild(this.element);
            this.element = null;
            this.trail.clear();
            this.trail = null;
        };
        Rain.prototype.build = function (row) {
            if (row === void 0) { row = 20; }
            var root = new eui.Group();
            var chars = [];
            var _loop_1 = function (i) {
                var c = new Char();
                // c.element.name = i + '';
                root.addChild(c.element);
                c.element.y = c.element.height * (i - 1);
                chars.push(c);
                if (Math.random() < .5) {
                    loop(function () { return c.mutate(); }, r(1e3, 5e3));
                }
            };
            for (var i = 0; i < row; ++i) {
                _loop_1(i);
            }
            this.trail = new Trail(chars, {
                size: r(10, 30), offset: r(0, 100)
            });
            this.element.addChild(root);
        };
        Rain.prototype.drop = function () {
            var trail = this.trail;
            var len = trail.body.length;
            var delay = r(10, 80);
            loop(function () {
                trail.move();
                trail.traverse(function (c, i, last) {
                    var color = Number(convertColor("136,100%," + 85 / len * (i + 1) + "%").replace('#', '0x'));
                    // console.log(convertColor(`136,100%,${85 / len * (i + 1)}%`).replace('#', '0x'))
                    c.element.textColor = color;
                    if (last) {
                        c.mutate();
                        c.element.textColor = 0xb3ffc7;
                        c.element.strokeColor = 0xffffff;
                    }
                });
            }, delay);
        };
        return Rain;
    }());
    MainUI.Rain = Rain;
    __reflect(Rain.prototype, "MainUI.Rain");
    function loop(fn, delay) {
        var stamp = Date.now();
        function _loop() {
            if (Date.now() - stamp >= delay) {
                fn();
                stamp = Date.now();
            }
            requestAnimationFrame(_loop);
        }
        requestAnimationFrame(_loop);
    }
    MainUI.loop = loop;
})(MainUI || (MainUI = {}));
//# sourceMappingURL=MainUI.js.map