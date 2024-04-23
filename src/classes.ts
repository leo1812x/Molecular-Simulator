import * as THREE from 'three';
import * as main from './main';
import { currentRegion } from './lammps_commands';


export class ThreeObject {
    static idCounter:number = 0;
    id:number
    ball:THREE.Mesh

    //? THESE ARE ONLY FOR LJ PARTICLES AS OF RIGHT NOW
    distance    :number;    //sigmas
    time        :number;    //reduced LJ tau
    mass        :number;    //ratio to unitless 1.0
    temperature :number;    //reduced LJ temp
    pressure    :number;    //reduced LJ pressure
    energy      :number;    //Kcal/mole
    velocity    :THREE.Vector3;    //Angstroms/femtosecond
    force       :number;    // grams/mole * Angstroms/femtosecond^2
    charge      :number;    //+/- 1.0 is proton/electron
    Boltzmann   :number;    

    constructor(){
        //*set the id
        ThreeObject.idCounter++;  
        this.id = ThreeObject.idCounter;

        //*add the element type to the list
        if (!main.AllElementTypes.includes(this.constructor.name)){
            main.AllElementTypes.push(this.constructor.name);
        }
    }

    runMotion(dt:number, other:ThreeObject):void{
        this.stormerVerlet(dt, other);
    
        const damping = 1.0;  // Reduce velocity by 20% upon collision
        // Check boundaries for x, y, z and apply damping
        if (Math.abs(this.ball.position.x) > currentRegion.x/2){
            this.velocity.x *= -damping;            
        }
    
        if (Math.abs(this.ball.position.y) > currentRegion.y/2){
            this.velocity.y *= -damping;            
        }
    
        if (Math.abs(this.ball.position.z) > currentRegion.z/2){
            this.velocity.z *= -damping;            
        }
    }
    

    stormerVerlet(dt: number, other: ThreeObject): void {
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
        this.velocity.add(acc.multiplyScalar(0.5 * dt));  // Add the initial acceleration
        this.velocity.add(newAcc.multiplyScalar(0.5 * dt)); // Add the new acceleration
    }
            

    lennardJonesForce(other: ThreeObject): THREE.Vector3 {
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

    getAcceleration(other:ThreeObject):THREE.Vector3{

        //*get the force vector of this element acting on the other element
        const forceVector = this.lennardJonesForce(other);
    
        //*get the acceleration vector
        //? i don't know the math behind this
        const acceleration = forceVector.divideScalar(this.mass);
    
        return acceleration;
    }
    

}




export class THREE_LJ extends ThreeObject{

    ball       :THREE.Mesh;
    
    constructor(){
        super();
        
        //* set three.js atributes
        main.AllElements.push(this);
        this.ball = new THREE.Mesh((new THREE.SphereGeometry(0.1, 32, 32)),new THREE.MeshBasicMaterial({color: 0xffff00}))
        main.scene.add(this.ball);
        this.velocity = new THREE.Vector3(0,0,0);


    }
}




































































































































































