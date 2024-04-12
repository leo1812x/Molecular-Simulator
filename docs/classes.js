"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.THREE_LJ = exports.ThreeObject = void 0;
const THREE = require("three");
const setUp = require("./setup");
class ThreeObject {
    constructor() {
        ThreeObject.idCounter++;
        this.id = ThreeObject.idCounter;
        //*add the element type to the list
        if (!setUp.AllElementTypes.includes(this.constructor.name)) {
            setUp.AllElementTypes.push(this.constructor.name);
        }
    }
    stormerVerlet(dt, other) {
        //*old position and get parameters
        const rOld = this.ball.position.clone();
        const vel = this.velocity.clone();
        const acc = this.getAcceleration(other);
        //*update position
        // New position r = r_old + v*dt + 0.5*a*dt^2
        const newPosition = rOld.add(vel.clone().multiplyScalar(dt)).add(acc.multiplyScalar(0.5 * dt * dt));
        this.ball.position.copy(newPosition);
        //* Calculate new acceleration based on new position
        const newAcc = this.getAcceleration(other); // Recalculate acceleration with the new position
        //*update velocity with the second half of the velocity Verlet
        // New velocity v = v_old + 0.5*(a_old + a_new)*dt
        this.velocity.add(acc.multiplyScalar(0.5 * dt)); // Add the initial acceleration
        this.velocity.add(newAcc.multiplyScalar(0.5 * dt)); // Add the new acceleration
    }
    lennardJonesForce(other) {
        //* get the distance between the two particles as vector
        let rVec = other.ball.position.clone().sub(this.ball.position);
        //*get the variables for the function 
        let r = rVec.length();
        let e = this.energy;
        let o = this.distance;
        //*calculate the force
        let force = 4 * e * (Math.pow((o / r), 12) - Math.pow((o / r), 6)) / (r * r);
        //* Normalize rVec to get direction and multiply by force magnitude
        //? i don't know the math behind this
        let forceVector = rVec.normalize().multiplyScalar(force);
        return forceVector;
    }
    getAcceleration(other) {
        //*get the force vector of this element acting on the other element
        const forceVector = this.lennardJonesForce(other);
        //*get the acceleration vector
        //? i don't know the math behind this
        const acceleration = forceVector.divideScalar(this.mass);
        return acceleration;
    }
}
exports.ThreeObject = ThreeObject;
ThreeObject.idCounter = 0;
class THREE_LJ extends ThreeObject {
    constructor() {
        super();
        //* set three.js atributes
        setUp.AllElements.push(this);
        this.ball = new THREE.Mesh((new THREE.SphereGeometry(0.1, 32, 32)), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
        setUp.scene.add(this.ball);
        this.velocity = new THREE.Vector3(0, 0, 0);
    }
}
exports.THREE_LJ = THREE_LJ;
