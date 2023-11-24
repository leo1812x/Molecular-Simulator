import './styles/index.css'
import './styles/simulator.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import periodic_table from './periodic_table/periodic_table';

//!Set up
const SIMULATOR = document.getElementById('simulator');
let AllElements: ThreeElement[] = [];

//!THREE.JS  set up
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
const gridHelper = new THREE.GridHelper(50, 20);
scene.add( gridHelper );
camera.position.z = 5;

//*set the renderer on the DOM
renderer.setSize( SIMULATOR.getBoundingClientRect().width, SIMULATOR.getBoundingClientRect().height );
renderer.setPixelRatio(window.devicePixelRatio)
SIMULATOR.appendChild(renderer.domElement)

//* HOOKE'S LAW CONSTANTS
const K = 1;        //sprig constant
const D = 1.25;        //default distance

//! Functions

//*get distance between two elements
function getdistance(thisElement:ThreeElement, otherElement:ThreeElement):number{
    //*get circles coordenates
    let {x, y, z} = thisElement.ball.position;
    let {x: otherX, y: otherY, z: otherZ} = otherElement.ball.position;

    //*get differences on each axis
    let differenceOnXs = Math.abs(x - otherX);
    let differenceOnYs = Math.abs(y - otherY);
    let differenceOnZs = Math.abs(z - otherZ);    

    //* distance formula (3d pythagoras theorem)
    let distance = Math.sqrt(Math.pow(differenceOnXs, 2) + Math.pow(differenceOnYs, 2) + Math.pow(differenceOnZs, 2));
    return distance;
}

//*get angle using cosine law
function getAngle(a:ThreeElement, b:ThreeElement, c:ThreeElement):number{
    //*get distances
    let ac = getdistance(a, c);
    let ab = getdistance(a, b);
    let bc = getdistance(b, c);

    //*cosine law
    //in radians
    let angle = Math.acos((Math.pow(ac, 2) + Math.pow(ab, 2) - Math.pow(bc, 2)) / (2 * ac * ab));
    
    return angle;
}

function radiansToDegrees(radians:number):number{
    return radians * (180 / Math.PI);
}

function degreesToRadians(degrees:number):number{
    return degrees * (Math.PI / 180);
}


//! hookes law: POTENTIAL ENERGY

//*elastic potential energy: distance
function getDistanceEnergy(first:ThreeElement, second:ThreeElement):number{
    let answer = 0.5 * K * Math.pow(getdistance(first, second) - D, 2);    
    return answer;
}

//*elastic potential energy: angle
function getAnglesEnergy(first:ThreeElement, second:ThreeElement, third:ThreeElement):number{
    let answer = 0.5 * K * Math.pow(getAngle(first, second, third), 2);    
    return answer;

}












//! Clases
class ThreeObject {
    static idCounter:number = 0;
    id:number
    ball:THREE.Mesh

    constructor(){
        ThreeObject.idCounter++;  
        this.id = ThreeObject.idCounter;

    }


    //*Chemistry 
    //? is there a better way to do this?
    bond(other:ThreeObject):void{

        //*element with element
        if (other instanceof ThreeElement && this instanceof ThreeElement){
            //don't bond if stable
            if (this.isStable() || other.isStable()){return;}

            //check for Ion bond
            if (Math.abs(this.element.electronegativity - other.element.electronegativity) > 1.7){
                this.ionBond(other);
            }

            //check for covalent bond
            else if (Math.abs(this.element.electronegativity - other.element.electronegativity) < 1.7){
                this.covalentBond(other);
            }

            this.bonded = true;
            this.updateStability();
            other.updateStability();
        }

        //?element with compound
        else if (this instanceof ThreeElement && other instanceof THREECompound){}

        //?compound with compound
        else if (this instanceof THREECompound && other instanceof THREECompound){}
    }
}
















class ThreeElement extends ThreeObject{
    element;
    //*for bonds
    level:number;
    letter:string;
    valenceNumber:number;
    max:number;
    bonded:boolean;
    electrons: number;


    constructor(element) {
        super();

        //not sure if structuredClone() is necessary
        this.element = structuredClone(element);
        this.electrons = 0;
        AllElements.push(this);

        //*set three.js atributes
        this.ball = new THREE.Mesh((new THREE.SphereGeometry(0.5)),new THREE.MeshBasicMaterial({color: 0xffffff}))
        this.ball.position.y += 1;
        scene.add(this.ball);
        
        //*letter in ball

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
        AllElements.forEach((other, index) =>{
            //*avoiding current element
            if (this.id != other.id){                
                //* crash
                if (getdistance(this, other) < 1){  
                    this.bond(other);                    
                    return other;
                }
            }
        })
    }
}


















class THREEBond{
    elements:ThreeElement[];
    color:string;
    lenght:number;

    constructor(first:ThreeElement, second:ThreeElement){
        
    }
}












class THREECompound extends ThreeObject{
    elements: ThreeElement[];
    group: THREE.Group;
    

    constructor(...newElements){
        
        super();
        this.group = new THREE.Group;
        this.elements = [];
        const fixedLenght = newElements.length;        

        for (let i = 0; i < fixedLenght; i++){            
            let newElement = new ThreeElement(newElements[i]);
            this.group.add(newElement.ball);
            this.elements.push(newElement);
            newElements.push(newElement);
        }
        scene.add(this.group);
    }

    getMolecularGeometry():void{
        let vsepr:string;
        let centralElement = this.elements[0];

        VSEPRtheory()

    }
}

function VSEPRtheory(lonePairs?,...elements:ThreeElement[]){
    //*atoms bonded to central atom
    let bondedAtoms = elements.length - 1;

    lonePairs = lonePairs || 0;
    
    let angle;
    let str = `${bondedAtoms}${lonePairs}${bondedAtoms + lonePairs}`;


    

        //*Kepert model for transition metals
        //https://en.wikipedia.org/wiki/VSEPR_theory#Transition_metals_(Kepert_model)
        if (elements[0].element.groupBlock === "transition metal"){
            console.log('transition metal');
            //? will do some day
        }

        else{

            switch (lonePairs) {  
                         
                case 0:
                    switch (elements.length - 1){
                        case 2: 
                            angle = 180;
                            angle = degreesToRadians(angle);

                            //*move the second element to the right position
                            elements[1].ball.position.x = Math.cos(angle) * D + elements[0].ball.position.x;
                            elements[1].ball.position.y = Math.sin(angle) * D + elements[0].ball.position.y;

                            //*move the third element to the right position
                            elements[2].ball.position.x = Math.cos(angle * 2) * D + elements[0].ball.position.x;
                            elements[2].ball.position.y = Math.sin(angle * 2) * D + elements[0].ball.position.y;
                        break;

                        case 3:
                            angle = 120;
                            angle = degreesToRadians(angle);

                            //*move the second element to the right position
                            elements[1].ball.position.x = Math.cos(angle) * D + elements[0].ball.position.x;
                            elements[1].ball.position.y = Math.sin(angle) * D + elements[0].ball.position.y;

                            //*move the third element to the right position
                            elements[2].ball.position.x = Math.cos(angle * 2) * D + elements[0].ball.position.x;
                            elements[2].ball.position.y = Math.sin(angle * 2) * D + elements[0].ball.position.y;

                            //*move the fourth element to the right position
                            elements[3].ball.position.x = Math.cos(angle * 3) * D + elements[0].ball.position.x;
                            elements[3].ball.position.y = Math.sin(angle * 3) * D + elements[0].ball.position.y;
                        break;

                        case 4:
                            angle = 109.5;
                            angle = degreesToRadians(angle);

                            //*move the second element to the right position
                            elements[1].ball.position.x = Math.cos(angle) * D + elements[0].ball.position.x;
                            elements[1].ball.position.y = Math.sin(angle) * D + elements[0].ball.position.y;

                            //*move the third element to the right position
                            elements[2].ball.position.x = Math.cos(angle * 2) * D + elements[0].ball.position.x;
                            elements[2].ball.position.y = Math.sin(angle * 2) * D + elements[0].ball.position.y;

                            //*move the fourth element to the right position
                            elements[3].ball.position.y = Math.cos(angle) * D + elements[0].ball.position.y;
                            elements[3].ball.position.z = Math.cos(angle) * D + elements[0].ball.position.z;

                    }
                break;
    
                case 1:
                    //*get angle in radians
                    angle = 104.45;
                    angle = degreesToRadians(angle);
    
                    //*
                    //*move the second element to the right position
                    elements[2].ball.position.x = Math.cos(angle) * D + elements[0].ball.position.x;
                    elements[2].ball.position.y = Math.sin(angle) * D + elements[0].ball.position.y;
    
                    //*get angle in radians
                    let angle2 = 0;
                    angle2 = degreesToRadians(angle2);
    
                    //*move the third element to the right position
                    elements[1].ball.position.x = Math.cos(angle2) * D + elements[0].ball.position.x;
                    elements[1].ball.position.y = Math.sin(angle2) * D + elements[0].ball.position.y;
    
    
                break;
    
                case 2:
                    
                    switch (elements.length - 1){
                        case 2:
                            //*get angle in radians
                            let angle = 104.45;
                            angle = degreesToRadians(angle);

                            //*move the second element to the right position
                            elements[2].ball.position.x = Math.cos(angle) * D + elements[0].ball.position.x;
                            elements[2].ball.position.y = Math.sin(angle) * D + elements[0].ball.position.y;

                            //*get angle in radians
                            let angle2 = 0;
                            angle2 = degreesToRadians(angle2);

                            //*move the third element to the right position
                            elements[1].ball.position.x = Math.cos(angle2) * D + elements[0].ball.position.x;
                            elements[1].ball.position.y = Math.sin(angle2) * D + elements[0].ball.position.y;
                        break;
                    }
                break;
    
                case 3:
                break;
    
                default:
                    console.error('No molecular geometry found');
                break;
                }
            }
    }







//!TESTING:
//*crate
let h2o = new THREECompound(periodic_table.number(6),periodic_table.number(1), periodic_table.symbol('H'));    
let co2 = new THREECompound(periodic_table.symbol('C'),periodic_table.number(6), periodic_table.symbol('O'));
let bf3 = new THREECompound(periodic_table.symbol('B'),periodic_table.symbol('F'), periodic_table.symbol('F'),periodic_table.symbol('F'));
let ch4 = new THREECompound(periodic_table.symbol('C'),periodic_table.symbol('H'), periodic_table.symbol('H'),periodic_table.symbol('H'),periodic_table.symbol('H'));


//*color
h2o.elements[0].ball.material = new THREE.MeshBasicMaterial({color: 0x00ff00});
co2.elements[0].ball.material = new THREE.MeshBasicMaterial({color: 0x00ff00});
bf3.elements[0].ball.material = new THREE.MeshBasicMaterial({color: 0x00ff00});
ch4.elements[0].ball.material = new THREE.MeshBasicMaterial({color: 0x00ff00});

//*position
co2.group.position.x = 5;
bf3.group.position.x = 10;
ch4.group.position.x = 15;


//*VSEPR theory
VSEPRtheory(0, co2.elements[0], co2.elements[1], co2.elements[2]);
VSEPRtheory(2, h2o.elements[0], h2o.elements[1], h2o.elements[2]);
VSEPRtheory(0, bf3.elements[0], bf3.elements[1], bf3.elements[2], bf3.elements[3]);
VSEPRtheory(0, ch4.elements[0], ch4.elements[1], ch4.elements[2], ch4.elements[3], ch4.elements[4]);




//*animation loop
function animate() {
	requestAnimationFrame( animate );
    //!TEST ANIMATIONS HERE:







    //!
	renderer.render( scene, camera );
} animate();

