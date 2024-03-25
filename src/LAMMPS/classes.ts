import * as THREE from 'three';
import * as setUp from '../setup';

export let boxForHelper: THREE.BoxGeometry;


export class LennardJonesUnits {
    // Characteristic constants of the system
    private mass: number; // The mass m*
    private distance: number; // The characteristic distance σ
    private energy: number; // The depth of the potential well ε

    // Constructor to set the characteristic constants
    constructor(mass: number, distance: number, energy: number) {
        this.mass = mass;
        this.distance = distance;
        this.energy = energy;

        setUp.AllElements.push(this);
    }

    // Method to calculate the reduced time τ* based on mass, distance, and energy
    public calculateReducedTime(): number {
        // τ* = sqrt(mass * distance^2 / energy)
        return Math.sqrt(this.mass * Math.pow(this.distance, 2) / this.energy);
    }

    // Method to calculate the reduced temperature T* based on the energy parameter ε
    public calculateReducedTemperature(kB: number, temperature: number): number {
        // T* = k_B * temperature / ε
        return kB * temperature / this.energy;
    }

    // Add more methods to calculate other reduced properties as necessary

    // Method to convert reduced units to real-world units (example for temperature)
    public convertReducedToRealTemperature(reducedTemperature: number, kB: number): number {
        // temperature = T* * ε / k_B
        return reducedTemperature * this.energy / kB;
    }

    // Add conversion methods for other properties as necessary
}












export class Region {
    private id: string;
    private style: string;
    private x: number;
    private y: number;
    private z: number;


    constructor(id: string, style: string, ...args: string[]) {
        this.id = id;
        this.style = "delete" || "block"    || "cylinder" || "sphere" ||
                        "plane" || "surface"  || "prism"    || "cone"   ||
                        "union" || "intersect"|| "subtract" || "group" ?
                        style : 'block';
    
        if ( style == 'block'){

            

            //*get the dimensions of the block
            this.x = Math.abs(Number.parseInt(args[1])) + Math.abs(Number.parseInt( args[0]));
            this.y = Math.abs(Number.parseInt(args[3]) + Math.abs(Number.parseInt(args[2])));
            this.z = Math.abs(Number.parseInt(args[5])) + Math.abs(Number.parseInt(args[4]));        
        }
    
    }

    public getId(): string {return this.id;}
    public getStyle(): string {return this.style;}

    public createBox(){
        if ( this.getStyle() == 'block'){

            
            //*create a box helper with the dimensions of the block
            boxForHelper = new THREE.BoxGeometry(this.x, this.y, this.z);
            const object = new THREE.Mesh( boxForHelper, new THREE.MeshBasicMaterial() );
            const BoxHelper = new THREE.BoxHelper( object, 0xffff00 );
    
            //*add the box helper to the scene
            setUp.scene.add( BoxHelper );

            
    
        }
    }

}


export class Lattice {
    private style: string;
    private scale = 1.0;

    constructor(style: string, scale: number, ...args: string[]) {
        this.style = "none" || "sc" || "bcc" || "fcc" || "hcp" ||
        "diamond" || "sq" || "sq2" || "hex" || "custom" ?
        style : 'none';

        this.scale = scale;
    }

    public getStyle(): string {return this.style;}
    public getScale(): number {return this.scale;}
}


















