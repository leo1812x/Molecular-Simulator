// import './styles/index.css';
import './index.css'
import * as THREE from 'three';
import { THREE_LJ, ThreeObject } from './classes';
import * as converter from  './lammps_converter';

//!Set up
export const SIMULATOR = document.getElementById('simulator');
export let AllElements: THREE_LJ[] = [];
export let AllElementTypes: String[] = [];

//*THREE.JS  set up
export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1.0, 100 );
export const renderer = new THREE.WebGLRenderer();


//*helpers
const gridHelper = new THREE.GridHelper(25, 10);

//*set the renderer on the DOM
renderer.setSize( SIMULATOR.getBoundingClientRect().width, SIMULATOR.getBoundingClientRect().height);
renderer.setPixelRatio(window.devicePixelRatio);
SIMULATOR.appendChild(renderer.domElement);

//*set the camera
camera.position.z = 20;
camera.position.y = 10;
camera.position.x = 4;

//*single render to get THREE.JS to work
scene.add( gridHelper ); //boxhelper was here too
renderer.render( scene, camera );

converter.lammpsRead(converter.cleanInput(converter.getInput()));





