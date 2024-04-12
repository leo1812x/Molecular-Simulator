"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderer = exports.camera = exports.scene = exports.AllElementTypes = exports.AllElements = exports.SIMULATOR = void 0;
// import './styles/index.css';
require("./index.css");
var lammps = require("./lammps_converter");
var THREE = require("three");
var Addons_js_1 = require("three/examples/jsm/Addons.js");
//!Set up
exports.SIMULATOR = document.getElementById('simulator');
exports.AllElements = [];
exports.AllElementTypes = [];
//!THREE.JS  set up
exports.scene = new THREE.Scene();
exports.camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 1.0, 100);
exports.renderer = new THREE.WebGLRenderer();
//*helpers
var gridHelper = new THREE.GridHelper(25, 10);
var controls = new Addons_js_1.OrbitControls(exports.camera, exports.renderer.domElement);
//*set the renderer on the DOM
exports.renderer.setSize(exports.SIMULATOR.getBoundingClientRect().width, exports.SIMULATOR.getBoundingClientRect().height);
exports.renderer.setPixelRatio(window.devicePixelRatio);
exports.SIMULATOR.appendChild(exports.renderer.domElement);
exports.camera.position.z = 20;
exports.camera.position.y = 10;
exports.camera.position.x = 4;
exports.camera.rotateX(-0.5);
exports.scene.add(gridHelper); //boxhelper was here too
lammps.lammpsRead(lammps.cleanInput(lammps.input));
