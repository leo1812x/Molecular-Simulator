import './styles/index.css';
import './styles/simulator.css';

import { THREECompound, ThreeElement } from './classes';
import * as THREE from 'three';
import * as setUp from './setup';
import * as functions from './functions';
import periodic_table from './periodic_table/periodic_table';



//!TESTING:
// //*crate
// let h2o = new THREECompound(periodic_table.number(6),periodic_table.number(1), periodic_table.symbol('H'));    
// let co2 = new THREECompound(periodic_table.symbol('C'),periodic_table.number(6), periodic_table.symbol('O'));
// let bf3 = new THREECompound(periodic_table.symbol('B'),periodic_table.symbol('F'), periodic_table.symbol('F'),periodic_table.symbol('F'));
// let ch4 = new THREECompound(periodic_table.symbol('C'),periodic_table.symbol('H'), periodic_table.symbol('H'),periodic_table.symbol('H'),periodic_table.symbol('H'));

// //*color
// h2o.elements[0].ball.material = new THREE.MeshBasicMaterial({color: 0x00ff00});
// co2.elements[0].ball.material = new THREE.MeshBasicMaterial({color: 0x00ff00});
// bf3.elements[0].ball.material = new THREE.MeshBasicMaterial({color: 0x00ff00});
// ch4.elements[0].ball.material = new THREE.MeshBasicMaterial({color: 0x00ff00});

// //*position
// co2.group.position.x = 5;
// bf3.group.position.x = 10;
// ch4.group.position.x = 15;

// //*VSEPR theory
// functions.VSEPRtheory(0, co2.elements[0], co2.elements[1], co2.elements[2]);
// functions.VSEPRtheory(2, h2o.elements[0], h2o.elements[1], h2o.elements[2]);
// functions.VSEPRtheory(0, bf3.elements[0], bf3.elements[1], bf3.elements[2], bf3.elements[3]);
// functions.VSEPRtheory(0, ch4.elements[0], ch4.elements[1], ch4.elements[2], ch4.elements[3], ch4.elements[4]);


let h = new ThreeElement(periodic_table.symbol('H'));
let o = new ThreeElement(periodic_table.symbol('O'));
let he = new ThreeElement(periodic_table.symbol('He'));

o.ball.position.x += 5;
he.ball.position.x += 10;






//*animation loop
function animate() {
	requestAnimationFrame( animate );
    //!TEST ANIMATIONS HERE:

    setUp.AllElements.forEach(element => {
        functions.updatePosition(element);
        functions.keepInBounds(element);
        
    });



    //!
	setUp.renderer.render( setUp.scene, setUp.camera );
} animate();





