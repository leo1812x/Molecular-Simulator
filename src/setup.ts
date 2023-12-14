import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { ThreeElement, THREECompound } from './classes';


//!Set up
export const SIMULATOR = document.getElementById('simulator');
export let AllElements: ThreeElement[] = [];
export let allCompounds: THREECompound[] = [];

//!THREE.JS  set up
export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
export const renderer = new THREE.WebGLRenderer();

//*helpers
const gridHelper = new THREE.GridHelper(25, 10);
const controls = new OrbitControls(camera, renderer.domElement);
export const boxForHelper = new THREE.BoxGeometry( 25, 25, 25 );
const object = new THREE.Mesh( boxForHelper, new THREE.MeshBasicMaterial() );
const BoxHelper = new THREE.BoxHelper( object, 0xffff00 );

//*set the renderer on the DOM
renderer.setSize( SIMULATOR.getBoundingClientRect().width, SIMULATOR.getBoundingClientRect().height );
renderer.setPixelRatio(window.devicePixelRatio)
SIMULATOR.appendChild(renderer.domElement)
camera.position.z = 50;

scene.add( gridHelper, BoxHelper );


