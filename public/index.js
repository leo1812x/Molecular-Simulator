"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//! Imports
var pt = require('periodic-table');
let { elements, symbols, numbers } = pt;
//! Set up
const SIMULATOR = document.getElementById('simulator');
let objects = [];
//! Classes
class DOMElemento {
    static id = 0;
    hold;
    html;
    element;
    //*for bonds
    level;
    letter;
    electronInlevel;
    max;
    bonded = [];
    //* electrons
    electrons = {
        1: undefined,
        2: undefined,
        4: undefined,
        5: undefined,
        6: undefined,
        7: undefined,
        8: undefined,
    };
    constructor(element) {
        this.element = window.structuredClone(element);
        //* create html
        this.html = document.createElement('div');
        this.html.innerHTML = `${element.name}`;
        //* set attributes
        this.html.setAttribute('id', DOMElemento.id.toString());
        DOMElemento.id++;
        this.html.setAttribute('class', 'element');
        //* Event listeners
        this.html.onpointerdown = () => {
            this.hold = true;
            this.html.style.left = '0%';
            this.html.style.top = '0%;';
        };
        this.html.onmousemove = (e) => {
            e.preventDefault();
            if (this.hold) {
                this.move(e);
                this.collisionCheck();
            }
        };
        this.html.onpointerup = () => {
            this.hold = false;
        };
        this.html.onmouseout = (e) => {
            if (this.hold) {
                this.move(e);
                this.collisionCheck();
            }
        };
        //* append to simulator and array
        this.initialStability();
        SIMULATOR.append(this.html);
        objects.push(this);
        //*add electrons
        this.lewisInit();
    }
    //! Lewis structure
    lewisInit() {
        console.log(this.electronInlevel);
        for (let i = 0; i < this.electronInlevel; i++) {
            //* create html element and atributes    
            let dot = document.createElement('div');
            dot.setAttribute('class', 'electron');
            dot.setAttribute('id', 'e' + (i + 1));
            // dot.innerHTML = 'e-';
            dot.style.fontSize = '12px';
            dot.classList.add();
            //* append to its element and organize them in electrons[]
            this.html.append(dot);
            this.electrons[i] = dot;
        }
    }
    //! class functions
    move(e) {
        //*this peace of code gives the coordenates of the click relative to the SIMULATOR
        let rect = SIMULATOR.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        //*make move
        this.html.style.left = x - 50 + 'px';
        this.html.style.top = y - 50 + 'px';
        //* keep inside box
        if (x <= 62)
            this.html.style.left = '12px';
        if (y <= 62)
            this.html.style.top = '13px';
        if (x >= rect.right - 74)
            this.html.style.left = (rect.right - 126) + 'px';
        if (y >= rect.bottom - 135)
            this.html.style.top = (rect.bottom - 185) + 'px';
    }
    collisionCheck() {
        //*get circle coordenates
        let current = this.html.getBoundingClientRect();
        //*check each element avoiding current
        objects.forEach((other, index) => {
            if (other.html !== this.html) {
                //* check other circle coordenates
                let otherx = other.html.getBoundingClientRect().x;
                let othery = other.html.getBoundingClientRect().y;
                //* distance formula => collision
                let distance = Math.sqrt(Math.pow(otherx - current.x, 2) + Math.pow(othery - current.y, 2));
                // console.log(distance);
                //* crash
                if (distance < 100) {
                    // console.log(`crashed with ${other.element.name}`);
                    this.Bond(other);
                }
            }
        });
    }
    //! CHIMESTRY MATH
    initialStability() {
        let { electronicConfiguration } = this.element;
        //*getters
        this.level = electronicConfiguration[electronicConfiguration.length - 3];
        this.letter = electronicConfiguration[electronicConfiguration.length - 2];
        this.electronInlevel = +electronicConfiguration[electronicConfiguration.length - 1];
        //*fix elenctronInlevels
        if (this.letter === 'p') {
            this.electronInlevel += 2;
        }
        if (this.letter === 'd') {
            this.electronInlevel += 8;
        }
        if (this.letter === 'f') {
            this.electronInlevel += 19;
        }
        // console.log(electronicConfiguration);
        // console.log(`level = ${this.level}`);
        // console.log(`letter = ${this.letter}`);
        // console.log(`electron in level = ${this.electronInlevel}`);
        this.isStable();
    }
    isStable() {
        //* get max num in last ring
        //? Change this for something better?
        if (this.level == 1) {
            this.max = 2;
        }
        if (this.level == 2) {
            if (this.letter == 's') {
                this.max = 2;
            }
            else if (this.letter == 'p') {
                this.max = 8;
            }
        }
        if (this.level == 3) {
            if (this.letter == 's') {
                this.max = 2;
            }
            else if (this.letter == 'p') {
                this.max = 8;
            }
            else if (this.letter == 'd') {
                this.max = 18;
            }
        }
        if (this.level == 4) {
            if (this.letter == 's') {
                this.max = 2;
            }
            else if (this.letter == 'p') {
                this.max = 8;
            }
            else if (this.letter == 'd') {
                this.max = 18;
            }
            else if (this.letter == 'f') {
                this.max = 32;
            }
        }
        if (this.level == 5) {
            if (this.letter == 's') {
                this.max = 2;
            }
            else if (this.letter == 'p') {
                this.max = 8;
            }
            else if (this.letter == 'd') {
                this.max = 18;
            }
            else if (this.letter == 'f') {
                this.max = 32;
            }
        }
        if (this.level == 6) {
            if (this.letter == 's') {
                this.max = 2;
            }
            else if (this.letter == 'p') {
                this.max = 8;
            }
            else if (this.letter == 'd') {
                this.max = 18;
            }
            else if (this.letter == 'f') {
                this.max = 32;
            }
        }
        if (this.level == 7) {
            if (this.letter == 's') {
                this.max = 2;
            }
            else if (this.letter == 'p') {
                this.max = 8;
            }
            else if (this.letter == 'd') {
                this.max = 18;
            }
        }
        //*turn green if stable
        if (this.electronInlevel === 0 ||
            this.electronInlevel === this.max) {
            this.html.style.backgroundColor = 'green';
        }
        //*turn red if inestable
        else {
            this.html.style.backgroundColor = 'red';
        }
        console.log(`level:${this.level}---max:${this.max}---current:${this.electronInlevel}`);
    }
    Bond(other) {
        //! Ion bond
        //* check electronegativity
        if (Math.abs(this.element.electronegativity - other.element.electronegativity) > 1.7) {
            let moreNegative = (this.element.electronegativity > other.element.electronegativity) ? this : other;
            let lessNegative = (this.element.electronegativity < other.element.electronegativity) ? this : other;
            console.log('Ionic bond!');
            moreNegative.electronInlevel += 1;
            lessNegative.electronInlevel -= 1;
        }
        //! covalent bond
        else if (Math.abs(this.element.electronegativity - other.element.electronegativity) < 1.7) {
            console.log('covalent bond!');
            // console.log(other);
            this.bonded.push(other);
        }
        this.isStable();
    }
}
//! Testing
// let circle = new DOMElemento(elements.Helium);
let circle3 = new DOMElemento(numbers[2]);
// let circle4 = new DOMElemento(numbers[3]);
// let circle5 = new DOMElemento(symbols.O);
// let circle2 = new DOMElemento(symbols.N);
// let circle3 = new DOMElemento(symbols.Mg);
let circle6 = new DOMElemento(numbers[1]);
let circle7 = new DOMElemento(numbers[7]);
circle6.html.style.left = '200px';
//# sourceMappingURL=index.js.map