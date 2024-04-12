"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.THREE_LJ = exports.ThreeObject = void 0;
var THREE = require("three");
var setUp = require("./setup");
var ThreeObject = /** @class */ (function () {
    function ThreeObject() {
        ThreeObject.idCounter++;
        this.id = ThreeObject.idCounter;
        //*add the element type to the list
        if (!setUp.AllElementTypes.includes(this.constructor.name)) {
            setUp.AllElementTypes.push(this.constructor.name);
        }
    }
    ThreeObject.prototype.stormerVerlet = function (dt, other) {
        //*old position and get parameters
        var rOld = this.ball.position.clone();
        var vel = this.velocity.clone();
        var acc = this.getAcceleration(other);
        //*update position
        // New position r = r_old + v*dt + 0.5*a*dt^2
        var newPosition = rOld.add(vel.clone().multiplyScalar(dt)).add(acc.multiplyScalar(0.5 * dt * dt));
        this.ball.position.copy(newPosition);
        //* Calculate new acceleration based on new position
        var newAcc = this.getAcceleration(other); // Recalculate acceleration with the new position
        //*update velocity with the second half of the velocity Verlet
        // New velocity v = v_old + 0.5*(a_old + a_new)*dt
        this.velocity.add(acc.multiplyScalar(0.5 * dt)); // Add the initial acceleration
        this.velocity.add(newAcc.multiplyScalar(0.5 * dt)); // Add the new acceleration
    };
    ThreeObject.prototype.lennardJonesForce = function (other) {
        //* get the distance between the two particles as vector
        var rVec = other.ball.position.clone().sub(this.ball.position);
        //*get the variables for the function 
        var r = rVec.length();
        var e = this.energy;
        var o = this.distance;
        //*calculate the force
        var force = 4 * e * (Math.pow((o / r), 12) - Math.pow((o / r), 6)) / (r * r);
        //* Normalize rVec to get direction and multiply by force magnitude
        //? i don't know the math behind this
        var forceVector = rVec.normalize().multiplyScalar(force);
        return forceVector;
    };
    ThreeObject.prototype.getAcceleration = function (other) {
        //*get the force vector of this element acting on the other element
        var forceVector = this.lennardJonesForce(other);
        //*get the acceleration vector
        //? i don't know the math behind this
        var acceleration = forceVector.divideScalar(this.mass);
        return acceleration;
    };
    ThreeObject.idCounter = 0;
    return ThreeObject;
}());
exports.ThreeObject = ThreeObject;
var THREE_LJ = /** @class */ (function (_super) {
    __extends(THREE_LJ, _super);
    function THREE_LJ() {
        var _this = _super.call(this) || this;
        //* set three.js atributes
        setUp.AllElements.push(_this);
        _this.ball = new THREE.Mesh((new THREE.SphereGeometry(0.1, 32, 32)), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
        setUp.scene.add(_this.ball);
        _this.velocity = new THREE.Vector3(0, 0, 0);
        return _this;
    }
    return THREE_LJ;
}(ThreeObject));
exports.THREE_LJ = THREE_LJ;
