// import './styles/index.css';
import './index.css'

import * as lammps from  './lammps_converter';




import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { THREE_LJ, ThreeObject } from './classes';


//!Set up
export const SIMULATOR = document.getElementById('simulator');
export let AllElements: THREE_LJ[] = [];
export let AllElementTypes: String[] = [];

//!THREE.JS  set up
export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1.0, 100 );
export const renderer = new THREE.WebGLRenderer();


//*helpers
const gridHelper = new THREE.GridHelper(25, 10);
const controls = new OrbitControls(camera, renderer.domElement);

//*set the renderer on the DOM
renderer.setSize( SIMULATOR.getBoundingClientRect().width, SIMULATOR.getBoundingClientRect().height );
renderer.setPixelRatio(window.devicePixelRatio)
SIMULATOR.appendChild(renderer.domElement)
camera.position.z = 20;
camera.position.y = 10;
camera.position.x = 4;
camera.rotateX(-0.5);

scene.add( gridHelper ); //boxhelper was here too




lammps.lammpsRead(lammps.cleanInput(lammps.input));








