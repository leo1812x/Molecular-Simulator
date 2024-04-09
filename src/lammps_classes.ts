import * as THREE from 'three';
import * as setUp from './setup';

export let boxForHelper: THREE.BoxGeometry;


//*classes for the LAMMPS commands




//*This class is a wraper for the THREE box that will be used to represent the region
//*this is created on the LAMMPS region command
export class Region {
    private id: string;
    private style: string;
    private x: number;
    private y: number;
    private z: number;

    

    //*this deals with the input logic for the style parameter
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
    //*getters
    public getId(): string {return this.id;}
    public getStyle(): string {return this.style;}

    //*create the THREE box 
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

//*This class is for the lattice which is the arrangement of the atoms in the simulation
//? THIS IS CURRENTLY NOT USED (not implemented as it should be)
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


















