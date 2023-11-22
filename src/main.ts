import './styles/index.css'
import './styles/simulator.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import periodic_table from './periodic_table/periodic_table';

//!Set up
const SIMULATOR = document.getElementById('simulator');
let objects: ThreeObject[] = [];

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

//* HOOKE'S LAW
const K = 1;        //sprig constant
const D = 1;        //default distance
















//! Clases
class ThreeObject {
    static idCounter:number = 0;
    id:number
    ball:THREE.Mesh

    constructor(){
        ThreeObject.idCounter++;  
        this.id = ThreeObject.idCounter;

        //push to list with all objects
        objects.push(this);
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

        //*element with compound
        else if (this instanceof ThreeElement && other instanceof THREECompound){}

        //*compound with compound
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

        //*get circle coordenates
        let {x, y, z} = this.ball.position

        
        //*check each element 
        objects.forEach((other, index) =>{





            //*avoiding current element
            if (this.id != other.id){                

                getdistance(this, other);


                //*get differences on each axis
                let differenceOnXs = Math.abs(x - other.ball.position.x);
                let differenceOnYs = Math.abs(y - other.ball.position.y);
                let differenceOnZs = Math.abs(z - other.ball.position.z);

                //* distance formula (3d pythagoras theorem)
                let distance = Math.sqrt(Math.pow(differenceOnXs, 2) + Math.pow(differenceOnYs, 2) + Math.pow(differenceOnZs, 2));
                console.log(distance);
                
                
                //* crash
                if (distance < 1){  
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
    

    constructor(...elements){
        super();
        this.group = new THREE.Group;
        this.elements = [];
        for (let i = 0; i < elements.length; i++){
            let newElement = new ThreeElement(elements[i]);
            this.group.add(newElement.ball);
            this.elements.push(newElement);
            
        }
        scene.add(this.group);
        this.elements[0].ball.position.x += 2;
    }

     getSpringEnergy(x:number):number{
        return 0.5 * K * Math.pow(x - D, 2);
    }

}

function getdistance(thisElement:ThreeObject, otherElement:ThreeObject):number{
        //*get circles coordenates
        let {x, y, z} = thisElement.ball.position;
        let {x: otherX, y: otherY, z: otherZ} = otherElement.ball.position;

        //*get differences on each axis
        let differenceOnXs = Math.abs(x - otherX);
        let differenceOnYs = Math.abs(y - otherY);
        let differenceOnZs = Math.abs(z - otherZ);

        //* distance formula (3d pythagoras theorem)
        let distance = Math.sqrt(Math.pow(differenceOnXs, 2) + Math.pow(differenceOnYs, 2) + Math.pow(differenceOnZs, 2));
        console.log(distance);
        return distance;
}








//!TESTING:

// let example = new ThreeElement(periodic_table.number(1));
// let examplew = new ThreeElement(periodic_table.number(1));
// example.ball.position.x = -1;
// example.ball.position.y = -1;

let compoundExample = new THREECompound(periodic_table.number(1), periodic_table.symbol('H'));    


//*animation loop
function animate() {
	requestAnimationFrame( animate );
    //!TEST ANIMATIONS HERE:
    compoundExample.group.position.y += 0.02;
    getdistance(compoundExample.elements[0], compoundExample.elements[1]);


	renderer.render( scene, camera );
} animate();

