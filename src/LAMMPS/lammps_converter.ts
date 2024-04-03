import * as commands from  './lammps_commands';

//* This function will convert the input string from LAMMPS output and 
//* convert it into a sequence of outputs that can be used by my program
    export let input =`

                # initialization
                    units           lj&
                    dimension       2
                    atom_style      atomic  #test
                # Atom definition
                    
                    lattice         sq  0.1
                    region  simbox   block 0 5 0 5 0 5
                    create_box      1   simbox      
                    create_atoms    1   box
                    
                # Settings
                    pair_style      lj/cut 2.5
                    pair_coeff      *   *   1   1
                    
                    mass            *   1.0
                    velocity        all create  1.0 23494
                    
                # Run
                    fix             1   all nve
                    dump            1 all custom 10 output.txt id xs ys zs
                    
                    run             1000

                `

    
export function cleanInput (input: string){
    //*make each line into an array
    let inputAsArray = input.split((/\r?\n|\r|\n/g));
    
    for (let i = 0;  i < inputAsArray.length; i++){
        //*delete extra spaces
        inputAsArray[i] = inputAsArray[i].replace(/ +/g, ' ');

        //* rule 1, & means line after current line is part of current line
        if (inputAsArray[i].endsWith("&")){
            inputAsArray[i] = inputAsArray[i].replace("&", " ");
            inputAsArray[i] =  inputAsArray[i] + inputAsArray[i + 1];
            inputAsArray.splice(i + 1,1);
            i--;
        }

        //* rule 2, delete # comments
        if (inputAsArray[i].includes("#") && !inputAsArray[i].includes(`"#"`)){
            inputAsArray[i] = inputAsArray[i].replace(/#.*/,"");
        }

        //* rule 3, delete $ and use variables
        if (inputAsArray[i].includes("$") && !inputAsArray[i].includes(`"$"`)){
            let matches = []
            if (inputAsArray[i].includes("${")){                
                matches.push(...Array.from(inputAsArray[i].matchAll(/\$\{(.*?)\}/g)));
            }
            
            if (inputAsArray[i].includes('$')) {                
                matches.push(...Array.from(inputAsArray[i].matchAll(/\$([^{])/g)));
            }            console.log(matches);
        
            matches.forEach( (match) => {
                if (match[1]) {
                    inputAsArray[i] = inputAsArray[i].replace(match[0], match[1]);
                }
            })
        }
        //*trim the line
        inputAsArray[i] = inputAsArray[i].trim();

    }

    //* delete empty lines
    inputAsArray = inputAsArray.filter(string => string !== '')

    return inputAsArray;

}


export function lammpsRead(instructions: string[]) {
    //*for each line, get the first instruction
    instructions.forEach(instruction => {
        let splittedInstruction = instruction.split(" ");
        let command = splittedInstruction[0];

        switch (command) {
            //!BY CATEGORY
            //*Initialization
            case 'newton':
                break;

            case 'package':
                break;
        
            case 'processors':
                
                break;
            case 'suffix':
                
                break;
            case 'units':
                commands.units(splittedInstruction[1]);
                break;


            //*Setup simulation box
            case 'boundary':
                break;

            case 'change_box':
                break;
        
            case 'create_box':
                commands.create_box(splittedInstruction[1], splittedInstruction[2], ...splittedInstruction.slice(3));
                break;

            case 'dimension':
                commands.dimension1(Number.parseInt(splittedInstruction[1]));  
                break;

            case 'lattice':
                commands.lattice(splittedInstruction[1], Number.parseFloat(splittedInstruction[2]));
                break;

            case 'region':
                commands.region(splittedInstruction[1], splittedInstruction[2], ...splittedInstruction.slice(3));
                break;
    
            //*setup atoms
            case 'atom_modify':
                break;

            case 'atom_style':
                commands.atom_styles(splittedInstruction[1]);
                break;
        
            case 'balance':
                break;

            case 'create_atoms':
                commands.create_atoms(splittedInstruction[1], splittedInstruction[2]);

                break;
            case 'create_bonds':

                break;

            case 'delete_atoms':
                break;

            case 'delete_bonds':
                break;

            case 'displace_atoms':
                break;

            case 'group':
                break;

            case 'mass':
                commands.mass(splittedInstruction[1], Number.parseFloat(splittedInstruction[2]));
                break;

            case 'molecule':
                break;
            
            case 'read_data':
                break;

            case 'read_dump':
                break;

            case 'read_restart':
                break;

            case 'replicate':
                break;

            case 'set':
                break;

            case 'velocity':
                commands.velocity(splittedInstruction[1], splittedInstruction[2], ...splittedInstruction.slice(3));
                break;

            
    
        //*force fiels

            case 'angle_coeff':
                break;

            case 'angle_style':
                break;

            case 'bond_coeff':
                break;

            case 'bond_style':
                break;

            case 'band_write':
                break;

            case 'dialectic':
                break;

            case 'dihedral_coeff':
                break;

            case 'diheral_style':
                break;

            case 'improper_coeff':
                break;

            case 'impproper_style':
                break;

            case 'kspace_style':
                break;

            case 'pair_coeff':
                // commands.pair_style(splittedInstruction[1], ...splittedInstruction.slice(2));
                commands.pair_coeff(splittedInstruction[1], splittedInstruction[2], splittedInstruction[3], splittedInstruction[4]);
                break;

            case 'pair_modify':
                break;

            case 'pair_style':
                commands.pair_style(splittedInstruction[1], ...splittedInstruction.slice(2));
                break;

            case 'pair_write':
                break;

            case 'special_bonds':
                break;


            //*settings


            //*Operations within timestepping
            case 'compute':
                break;

            case 'compute_modify':
                break;

            case 'fix':
                commands.fix(Number.parseInt(splittedInstruction[1]), splittedInstruction[2], splittedInstruction[3]);
                break;

            case 'fix_modify':
                break;

            case 'uncompute':
                break;
            
            case 'unfix':
                break;


            //*output

            //*Actions

            case 'run':
                commands.run(Number.parseInt(splittedInstruction[1]), splittedInstruction[2]);
                break;

            //* Input control

        }
        
        

    });
}

