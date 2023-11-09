import './styles/index.css'
import './styles/simulator.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import periodic_table from './periodic_table/periodic_table';

let pt = periodic_table.number(1);

// let pt = require('periodic-table')

//! Set up
const SIMULATOR = document.getElementById('simulator');
let objects: DOMObject[] = [];

//!THREE.JS 
//*basic set up
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
const gridHelper = new THREE.GridHelper(50, 20);

//*set the renderer on its place
renderer.setSize( SIMULATOR.getBoundingClientRect().width, SIMULATOR.getBoundingClientRect().height );
renderer.setPixelRatio(window.devicePixelRatio)
document.getElementById('simulator').appendChild(renderer.domElement)

//*testing cube
// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// cube.position.x += 2;

scene.add( gridHelper ); //add cube here

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );

	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;

	renderer.render( scene, camera );
}

animate();



//! Clases
class DOMObject {
    //*for DOM
    static id:number = 0;
    html:HTMLElement;
    hold:boolean;

    constructor(element){
        //* create HTML div
        this.html = document.createElement('div');
        this.html.setAttribute('id', DOMElemento.id.toString());
        DOMObject.id++;
        
        //*event listeners
        this.html.onpointerdown = () =>{
            this.hold = true;
            this.html.style.left = '0%';
            this.html.style.top = '0%;';
        }

        this.html.onpointerup = () => {
            this.hold = false;
        }

        //TODO this needs to be fixed so the borders fuction correcly
        this.html.onmouseout = (e) =>{
            if (this.hold){
                this.move(e);
                this.collisionCheck();
            }
        }

        //* append to simulator and array of object in the simulator
        SIMULATOR.append(this.html);
        objects.push(this);
    }

    //*Movement
    //?TODO
    move(e):void {}

    //?TODO i think i need a different implementation for DOMElement and DOMCompound
    collisionCheck(){}

    //*Chemistry 
    //? is there a better way to do this?
    bond(other:DOMObject):void{

        //*element with element
        if (other instanceof DOMElemento && this instanceof DOMElemento){
            //*don't bond if stable
            if (this.isStable() || other.isStable()){return;}

            //*check for Ion bond
            if (Math.abs(this.element.electronegativity - other.element.electronegativity) > 1.7){
                this.ionBond(other);
            }

            //*check for covalent bond
            else if (Math.abs(this.element.electronegativity - other.element.electronegativity) < 1.7){
                this.covalentBond(other);
            }

            this.bonded = true;
            this.updateStability();
            other.updateStability();
        }

        //*element with compound
        else if (this instanceof DOMElemento && other instanceof DOMCompound){}

        //*compound with compound
        else if (this instanceof DOMCompound && other instanceof DOMCompound){}

    }
}

class Electron {
    ElectronBall:THREE.Mesh

    constructor() {
        this.ElectronBall = new THREE.Mesh((new THREE.SphereGeometry(0.2)),new THREE.MeshBasicMaterial({color: 0x00ff00}));
        scene.add(this.ElectronBall);        
    }
}

class DOMElemento extends DOMObject{
    element;

    //*for bonds
    level:number;
    letter:string;
    valenceNumber:number;
    max:number;
    bonded:boolean;
    ball:THREE.Mesh
    electrons: Electron[]


    constructor(element) { //!HTML
        super(element);

        //not sure if structuredClone() is necessary
        this.element = structuredClone(element);
        this.electrons = [];

        //*set three.js atributes
        this.ball = new THREE.Mesh((new THREE.SphereGeometry(0.5)),new THREE.MeshBasicMaterial({color: 0x00ff00}))
        scene.add(this.ball);
        this.ball.position.y += 1;
        
        //*find valenceNumber and add them to three.js
        this.initialStability();        
        this.lewisInit();
        
        console.log(this.electrons);
        
    }

        //*adds the valence electrons to the element in the DOM
    lewisInit():void{
        for (let i = 0; i < this.valenceNumber; i++){
            this.electrons.push(new Electron());
            this.electrons[i].ElectronBall.position.x = 2;

        } 
    }

    // lewisRemove():void{
    //     //*deletes the previus valence electrons in the DOMelemento
    //     let children = Array.from(this.html.children);
    //     children.forEach((children) => {
    //         this.html.removeChild(children);
    //     })
    // }

    // move(e):void {
    //     //*this peace of code gives the coordenates of the click relative to the SIMULATOR
    //     let rect = SIMULATOR.getBoundingClientRect();
    //     let x = e.clientX - rect.left; 
    //     let y = e.clientY - rect.top;  

    //     //*make move
    //     this.html.style.left = x - 50 + 'px';
    //     this.html.style.top = y - 50 + 'px'; 

    //     //*keep inside box
    //     if (x <= 62) this.html.style.left = '12px'; 
    //     if (y <=62) this.html.style.top = '13px'; 
    //     if (x >= rect.right - 74) this.html.style.left = (rect.right - 126) + 'px'; 
    //     if (y >= rect.bottom - 135) this.html.style.top = (rect.bottom - 185) + 'px'; 
    // }

    // collisionCheck():DOMObject{
    //     if (this.bonded) return;

    //     //*get circle coordenates
    //     let current = this.html.getBoundingClientRect();
        
    //     //*check each element avoiding current
    //     objects.forEach((other, index) =>{

    //         if (other.html !== this.html){
    //             //* check other circle coordenates
    //             let otherx = other.html.getBoundingClientRect().x;
    //             let othery = other.html.getBoundingClientRect().y;

    //             //* distance formula => collision
    //             let distance = Math.sqrt(Math.pow(otherx - current.x, 2) + Math.pow(othery - current.y, 2))
    //             // console.log(distance);
                
    //             //* crash
    //             if (distance < 100){                    
    //                 this.bond(other);
    //                 return other;
    //             }
    //         }
    //     })
    // }

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

    initialStability():void{
        this.getInitialLevel();
        this.getInitialLetter();
        this.getInitialValenceNumber();
        this.getMaxNumberInLevel();
        this.isStable();
    }

    updateStability():void{
        // this.lewisRemove();
        this.isStable();
        // this.lewisInit();
    }

    isStable():boolean{
        //*turn green if stable
        if (this.valenceNumber === 0 || this.valenceNumber === this.max){
            this.html.style.backgroundColor = 'green';
            return true;
            }
            
        //*turn red if inestable
        else {this.html.style.backgroundColor = 'red';
              return false;}
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

    findMoreNegative(other):DOMElemento{
        return (this.element.electronegativity > other.element.electronegativity) ? this : other;
    }

    findLessNegative(other):DOMElemento{
        return (this.element.electronegativity < other.element.electronegativity) ? this : other;
    }
}

class DOMCompound extends DOMObject{
    constructor(...element:DOMElemento[] | DOMCompound[]){
        super(element);
        // elements
    }
}

let example = new DOMElemento(periodic_table.number(1));
