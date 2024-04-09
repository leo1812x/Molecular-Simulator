import './styles/index.css';
import './styles/simulator.css';


import { THREE_LJ, ThreeElement } from './classes';
import * as setUp from './setup';
import * as functions from './functions';
import periodic_table from './periodic_table/periodic_table';
import * as lammps from  './LAMMPS/lammps_converter';
import * as THREE from 'three';
import { set } from './LAMMPS/lammps_commands';


// !lammps TEST

//* element control
let lj = new THREE_LJ();
lj.ball.position.x += 12;

///*read lammps input
lammps.lammpsRead(lammps.cleanInput(lammps.input));

let main = setUp.AllElements[8];
let second = setUp.AllElements[11];
let third = setUp.AllElements[31];

main.ball.material = new THREE.MeshBasicMaterial({color: 0xffffff});
second.ball.material = new THREE.MeshBasicMaterial({color: 0xffffff});
third.ball.material = new THREE.MeshBasicMaterial({color: 0xffffff});

let ts = 0.00001;

//*animation loop
function animate() {
	requestAnimationFrame( animate );
    //!TEST ANIMATIONS HERE:

    setUp.AllElements.forEach( element => {
        main.stormerVerlet(ts, second);
        main.stormerVerlet(ts, third);
        second.stormerVerlet(ts, main);
        second.stormerVerlet(ts, third);
        third.stormerVerlet(ts, main);
        third.stormerVerlet(ts, second);
    });



    //!
	setUp.renderer.render( setUp.scene, setUp.camera );
} animate();






