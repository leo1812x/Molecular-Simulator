//! Imports
var pt = require('periodic-table');
let {elements, symbols, numbers} = pt;


//! Set up
const SIMULATOR = document.getElementById('simulator');
let objects: DOMObject[] = [];

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
    //? should i do something better with this?
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
                this.covalentBond(other)
            }

            this.bonded = true;
            this.updateStability();
            other.updateStability();
        }

        //*element with compound
        else if (this instanceof DOMElemento && other instanceof DOMCompound){};
    }

}


//! Classes
class DOMElemento extends DOMObject{
    element;

    //*for bonds
    level:number;
    letter:string;
    valenceNumber:number;
    max:number;
    bonded:boolean;

    constructor(element) { //!HTML
        super(element);

        //not sure if structuredClone() is necessary
        this.element = structuredClone(element);

        //* set HTML attributes
        this.html.innerHTML = `${element.name}`;
        this.html.setAttribute('class', 'element');
        
        //apparently this can't be on the super-class or it lags really bad on onmousemove()
        this.html.onmousemove = (e) => {
            e.preventDefault();                                                
            if(this.hold){
                this.move(e);
                this.collisionCheck();
            }
        }
        //*exclusive to DOMElemento
        this.initialStability();        
        this.lewisInit();
    }

        //*adds the valence electrons to the element in the DOM
    lewisInit():void{
        for (let i = 0; i < this.valenceNumber; i++){
            //* create html element and atributes    
            let dot = document.createElement('div');
            dot.setAttribute('class', 'electron');
            dot.setAttribute('id', 'e' +(i + 1));
            dot.style.fontSize = '12px';

            //* append to its element and organize them in electrons[]
            this.html.append(dot);
        } 
    }

    lewisRemove():void{
        //*deletes the previus valence electrons in the DOMelemento
        let children = Array.from(this.html.children);
        children.forEach((children) => {
            this.html.removeChild(children);
        })
    }

    move(e):void {

        //*this peace of code gives the coordenates of the click relative to the SIMULATOR
        let rect = SIMULATOR.getBoundingClientRect();
        let x = e.clientX - rect.left; 
        let y = e.clientY - rect.top;  

        //*make move
        this.html.style.left = x - 50 + 'px';
        this.html.style.top = y - 50 + 'px'; 

        //*keep inside box
        if (x <= 62) this.html.style.left = '12px'; 
        if (y <=62) this.html.style.top = '13px'; 
        if (x >= rect.right - 74) this.html.style.left = (rect.right - 126) + 'px'; 
        if (y >= rect.bottom - 135) this.html.style.top = (rect.bottom - 185) + 'px'; 
    }

    collisionCheck():DOMObject{
        if (this.bonded) return;

        //*get circle coordenates
        let current = this.html.getBoundingClientRect();
        
        //*check each element avoiding current
        objects.forEach((other, index) =>{

            if (other.html !== this.html){
                //* check other circle coordenates
                let otherx = other.html.getBoundingClientRect().x;
                let othery = other.html.getBoundingClientRect().y;

                //* distance formula => collision
                let distance = Math.sqrt(Math.pow(otherx - current.x, 2) + Math.pow(othery - current.y, 2))
                // console.log(distance);
                
                //* crash
                if (distance < 100){                    
                    this.bond(other);
                    return other;
                }
            }
        })
    }

    getInitialLevel():number{
        let {electronicConfiguration} = this.element;

        //*get level of element from Periodic table 
        this.level = electronicConfiguration[electronicConfiguration.length - 3];
        // console.log(`level = ${this.level}`);
        return this.level;
    }

    getInitialLetter():string{
        let {electronicConfiguration} = this.element;

        //*get letter of element from Periodic table 
        this.letter = electronicConfiguration[electronicConfiguration.length - 2];
        // console.log(`letter = ${this.letter}`);
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

    getMaxNumberInLevel():number{
            switch (this.letter) {
                case "s": this.max = 2;
                    break;
                case "p": this.max = 8;
                    break;
                case "d": this.max = 2;
                    break;
                case "f": this.max = 2;
                    break;
                default:
                   throw new Error("check this lol");
            }
        return this.max;
    }

    initialStability():void{
        this.getInitialLevel();
        this.getInitialLetter();
        this.getInitialValenceNumber();
        this.getMaxNumberInLevel();
        this.isStable();
    }

    updateStability():void{
        this.lewisRemove();
        this.isStable();
        this.lewisInit();
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
        //* find most and least electronegative
        let moreNegative = (this.element.electronegativity > other.element.electronegativity) ? this : other;
        let lessNegative = (this.element.electronegativity < other.element.electronegativity) ? this : other;
        console.log('Ionic bond!');
        
        moreNegative.valenceNumber += 1;
        lessNegative.valenceNumber -= 1;
    }

    covalentBond(other){
        console.log('covalent bond!');
    }
}

class DOMCompound{
    constructor(...element:DOMElemento[] | DOMCompound[]){
        elements
        
    }
}

//! Testing
// let circle = new DOMElemento(elements.Helium);
let circle1 = new DOMElemento(numbers[2]);
// let circle4 = new DOMElemento(numbers[3]);
// let circle5 = new DOMElemento(symbols.O);
let circle2 = new DOMElemento(symbols.Na);
let circle3 = new DOMElemento(symbols.Cl);

// let circle6 = new DOMElemento(numbers[1]);
// let circle7 = new DOMElemento(numbers[85]);

circle3.html.style.left = '200px';
circle1.html.style.left = '300px';
