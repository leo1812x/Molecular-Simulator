"use strict";
//!classes for the LAMMPS commands
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lattice = exports.Region = void 0;
//*This class is a wraper for the THREE box that will be used to represent the region
//*this is created on the LAMMPS region command
var Region = /** @class */ (function () {
    //*this deals with the input logic for the style parameter
    function Region(id, style) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        this.id = id;
        this.style = "delete" || "block" || "cylinder" || "sphere" ||
            "plane" || "surface" || "prism" || "cone" ||
            "union" || "intersect" || "subtract" || "group" ?
            style : 'block';
        if (style == 'block') {
            //*get the dimensions of the block
            this.x = Math.abs(Number.parseInt(args[0])) + Math.abs(Number.parseInt(args[1]));
            this.y = Math.abs(Number.parseInt(args[2]) + Math.abs(Number.parseInt(args[3])));
            this.z = Math.abs(Number.parseInt(args[4])) + Math.abs(Number.parseInt(args[5]));
        }
    }
    return Region;
}());
exports.Region = Region;
//*This class is for the lattice which is the arrangement of the atoms in the simulation
var Lattice = /** @class */ (function () {
    function Lattice(style, scale) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        this.scale = 1.0;
        this.style = "none" || "sc" || "bcc" || "fcc" || "hcp" ||
            "diamond" || "sq" || "sq2" || "hex" || "custom" ?
            style : 'none';
        this.scale = scale;
    }
    Lattice.prototype.getStyle = function () { return this.style; };
    Lattice.prototype.getScale = function () { return this.scale; };
    return Lattice;
}());
exports.Lattice = Lattice;
