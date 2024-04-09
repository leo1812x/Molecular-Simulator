import * as THREE from 'three';
import * as functions from './functions';
import * as setUp from './setup';

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
        ThreeObject.idCounter++;  
        this.id = ThreeObject.idCounter;

        //*add the element type to the list
        if (!setUp.AllElementTypes.includes(this.constructor.name)){
            setUp.AllElementTypes.push(this.constructor.name);
        }
    }

    stormerVerlet(dt: number, other: ThreeObject): void {
        //*old position and get parameters
        const rOld = this.ball.position.clone();
        const vel = this.velocity.clone();
        const acc = functions.getAcceleration(this, other);
    
        //*update position
        // New position r = r_old + v*dt + 0.5*a*dt^2
        const newPosition = rOld.clone().add(vel.clone().multiplyScalar(dt)).add(acc.clone().multiplyScalar(0.5 * dt * dt));
        this.ball.position.copy(newPosition);
    
        //* Calculate new acceleration based on new position
        // Typically, you would update the forces here if they depend on position or other properties that could have changed.
        // Since you're passing 'other' which is not updated here, let's assume it's static or this update is managed elsewhere.
        const newAcc = functions.getAcceleration(this, other);  // This might need to be adjusted to reflect new positions.
    
        //*update velocity
        // New velocity v = v_old + 0.5*(a_old + a_new)*dt
        const newVelocity = vel.add(acc.add(newAcc).multiplyScalar(0.5 * dt));
        this.velocity.copy(newVelocity);
    
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

}




export class THREE_LJ extends ThreeObject{

    ball       :THREE.Mesh;
    
    constructor(){
        super();
        
        //* set three.js atributes
        setUp.AllElements.push(this);
        this.ball = new THREE.Mesh((new THREE.SphereGeometry(0.1, 32, 32)),new THREE.MeshBasicMaterial({color: 0xffff00}))
        setUp.scene.add(this.ball);
        this.velocity = new THREE.Vector3(0,0,0);


    }
}



































export class ThreeElement extends ThreeObject{
    element;
    //*for bonds
    level:number;
    letter:string;
    valenceNumber:number;
    max:number;
    bonded:boolean;
    electrons: number;
    velocity: THREE.Vector3;


    constructor(element) {
        super();

        //not sure if structuredClone() is necessary
        this.element = structuredClone(element);
        this.electrons = 0;
        setUp.AllElements.push(this);

        //*set three.js atributes
        this.ball = new THREE.Mesh((new THREE.SphereGeometry(0.5)),new THREE.MeshBasicMaterial({color: 0xffffff}))
        this.ball.position.y += 1;
        setUp.scene.add(this.ball);
        

        //*find the number of valence. then add them as electrons to the scene
        this.initialStability();        
        this.lewisInit();        
    }
    //!methods to find initial info ->
    getInitialLevel():number{
        //*get level of element from Periodic table 
        this.level = this.element.electronicConfiguration[this.element.electronicConfiguration.length - 3];
        return this.level;
    }

    getInitialLetter():string{
        //*get letter of element from Periodic table 
        this.letter = this.element.electronicConfiguration[this.element.electronicConfiguration.length - 2];
        return this.letter;
    }

    getInitialValenceNumber():number{
        let {electronicConfiguration} = this.element;

        //*get electron in last level of element from Periodic table 
        this.valenceNumber = +electronicConfiguration[electronicConfiguration.length - 1];  
        
        //*fix valence number by adding the electron on same level but different letter
        if (this.letter === 'p') {this.valenceNumber += 2;}
        if (this.letter === 'd') {this.valenceNumber += 8;}
        if (this.letter === 'f') {this.valenceNumber += 19;}

        return this.valenceNumber;
    }
    //*get the max # of electron the element needs on its valence shell to be stable
    getMaxNumberInLevel():number{
        let {groupBlock, symbol} = this.element;

        //*handle the hydrogen and Helium exceptions  first
        if (symbol === 'H' || symbol === 'He'){this.max = 2}

        //*this list contains the groups of elements with s or p blocks ('Main group')
        //https://en.wikipedia.org/wiki/Valence_electron#Valence_shell
        else if (['alkali metal',
                'alkaline earth metal',
                'metalloid', 'nonmetal',
                'halogen','noble gas',
                'other metal', 'post-transition metal'].includes(groupBlock)){
                    this.max = 8;
                }

        //*d block
        else if (groupBlock === 'transition metal'){this.max = 18}

        //*f block
        else if (groupBlock === 'lanthanoid' ||
                 groupBlock === 'actinoid'){this.max = 32}

        return this.max
    }


    //!methods to deal with chemistry info ->
    //*add electrons as valence electrons on its outer shell
    lewisInit():void{
        for (let i = 0; i < this.valenceNumber; i++){
            this.electrons += 1;            
        } 
    }

    lewisRemove():void{
        //*deletes the previus valence electrons in the scene
        this.electrons = 0;
    }

    isStable():boolean{
        //*turn green if stable
        
        if (this.valenceNumber === 0 || this.valenceNumber === this.max){
            this.ball.material = new THREE.MeshBasicMaterial({color: 0x00ff00});
            return true;
            }
            
        //*turn red if inestable
        else{
            this.ball.material = new THREE.MeshBasicMaterial({color: 0xff0000});
            return false;
        }
    }

    updateStability():void{
        this.lewisRemove();
        this.isStable();
        this.lewisInit();
    }

    initialStability():void{
        this.getInitialLevel();
        this.getInitialLetter();
        this.getInitialValenceNumber();
        this.getMaxNumberInLevel();
        this.isStable();
    }

    //!methods to deal with bonds
    findMoreNegative(other):ThreeElement{
        return (this.element.electronegativity > other.element.electronegativity) ? this : other;
    }

    findLessNegative(other):ThreeElement{
        return (this.element.electronegativity < other.element.electronegativity) ? this : other;
    }

    ionBond(other){
        //TODO currently works with one electron only
        //* find most and least electronegative
        let moreNegative = this.findMoreNegative(other);
        let lessNegative = this.findLessNegative(other);
        console.log('Ionic bond!');
        
        moreNegative.valenceNumber += 1;
        lessNegative.valenceNumber -= 1;
    }

    covalentBond(other){
        this.valenceNumber += 1;
        other.valenceNumber += 1;
        console.log('covalent bond!'); 
    }

    //!methods to deal with physics
    collisionCheck():ThreeElement{
        if (this.bonded) return;
        
        //*check each element 
        setUp.AllElements.forEach((other, index) =>{
            //*avoiding current element
            if (this.id != other.id){                
                //* crash
                if (functions.getdistance(this, other) < 1){  
                    return other;
                }
            }
        })
    }
}

































































































































