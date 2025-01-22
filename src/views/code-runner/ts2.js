"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Foo = /** @class */ (function () {
    function Foo(_name) {
        this.$name = _name;
    }
    Object.defineProperty(Foo.prototype, "name", {
        get: function () {
            this.bar();
            return this.$name;
        },
        enumerable: false,
        configurable: true
    });
    Foo.prototype.bar = function () { };
    return Foo;
}());
var a = new Foo('a');
a.bar();
exports.default = {};
