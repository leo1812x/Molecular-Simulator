"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dielectric = exports.bond_write = exports.bond_style = exports.bond_coeff = exports.angle_style = exports.angle_coeff = exports.velocity = exports.set = exports.replicate = exports.read_restart = exports.read_dump = exports.read_data = exports.molecule = exports.mass = exports.group = exports.displace_atoms = exports.delete_bonds = exports.delete_atoms = exports.create_bonds = exports.create_atoms = exports.balance = exports.atom_modify = exports.region = exports.lattice = exports.create_box = exports.change_box = exports.boundary = exports.units = exports.suffix = exports.processors = exports.packages = exports.newton = exports.atom_styles = exports.dimension1 = exports.boxForHelper = exports.timesteps = exports.pair_style_style = exports.pairStyle_cutoff = exports.pairStyle_func = exports.currentLattice = exports.currentRegion = exports.createbox_regionid = exports.createbox_n = exports.region_style = exports.region_id = exports.lattice_scale = exports.lattice_tyle = exports.atom_style = exports.dimension = exports.STYLE = void 0;
exports.temper = exports.tad = exports.run = exports.rerun = exports.prd = exports.neb_spin = exports.neb = exports.minimize = exports.write_restartv = exports.write_dump = exports.write_data = exports.write_coeff = exports.undump = exports.thermo_style = exports.thermo_modify = exports.thermo = exports.restart = exports.dump_modify = exports.dump = exports.dump_movie = exports.dump_image = exports.unfix = exports.uncompute = exports.fix_modify = exports.fix = exports.compute_modify = exports.compute = exports.timestep = exports.timer = exports.run_style = exports.reset_timestep = exports.partition = exports.neighbor = exports.neigh_modify = exports.min_style = exports.min_modify = exports.info = exports.comm_style = exports.comm_modify = exports.special_bonds = exports.pair_write = exports.pair_style = exports.pair_modify = exports.pair_coeff = exports.kspace_style = exports.kspace_modify = exports.improper_style = exports.improper_coeff = exports.dihedral_style = exports.dihedral_coeff = void 0;
exports.variable = exports.shell = exports.quit = exports.python = exports.print = exports.next = exports.log = exports.label = exports.jump = exports.info_ = exports.include = exports.if_ = exports.echo = exports.clear = void 0;
var setUp = require("./setup");
var classes = require("./classes");
var lammps_classes_1 = require("./lammps_classes");
var THREE = require("three");
//* Initialization of variables
//? i should organize this
exports.STYLE = 'lj';
exports.dimension = 3;
exports.atom_style = 'atomic';
exports.lattice_tyle = 'none';
exports.lattice_scale = 1.0;
exports.pairStyle_func = '4*e*(((o/r)^12) - ((o/r)^6))';
exports.pairStyle_cutoff = 2.5;
exports.timesteps = 1.0;
//? i should organize this too
//* Initialation
function newton() {
}
exports.newton = newton;
//can't use package as a function name
function packages() {
}
exports.packages = packages;
function processors() {
}
exports.processors = processors;
function suffix() {
}
exports.suffix = suffix;
//* define the type of units to be used
function units(style) {
    var styles = ['lj', 'real', 'metal', 'si', 'cgs', 'electron', 'micro', 'nano'];
    //* check for invalid unit style
    if (!styles.includes(style)) {
        throw new Error('Invalid unit style');
    }
    //? something is wrong here
    style = style;
    //* set the unit variables style to lj variables 
    if (style == 'lj') {
        for (var i = 0; i < setUp.AllElements.length; i++) {
            var element = setUp.AllElements[i];
            element.mass = 1.0;
            element.distance = 1.0;
            element.Boltzmann = 1.0;
        }
    }
}
exports.units = units;
//* Setup simulation box
function boundary() {
}
exports.boundary = boundary;
function change_box() {
}
exports.change_box = change_box;
//*if the region id is correct, create a THREE box
function create_box(id) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (exports.currentRegion.style == 'block') {
        //*create a box helper with the dimensions of the block
        exports.boxForHelper = new THREE.BoxGeometry(exports.currentRegion.x, exports.currentRegion.y, exports.currentRegion.z);
        var object = new THREE.Mesh(exports.boxForHelper, new THREE.MeshBasicMaterial());
        var BoxHelper = new THREE.BoxHelper(object, 0xffff00);
        //*add the box helper to the scene
        setUp.scene.add(BoxHelper);
    }
}
exports.create_box = create_box;
//? this is not doing anything right now
//? only supports 3d right now
function dimension1(dim) {
    exports.dimension = 2 || 3 ? dim : exports.dimension;
}
exports.dimension1 = dimension1;
//  lattice         sq  0.1
function lattice(style, scale) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    exports.lattice_tyle = "none" || "sc" || "bcc" || "fcc" || "hcp" ||
        "diamond" || "sq" || "sq2" || "hex" || "custom" ?
        style : exports.lattice_tyle;
    exports.lattice_scale = scale;
    //? this is not doing anything right now
    exports.currentLattice = new (lammps_classes_1.Lattice.bind.apply(lammps_classes_1.Lattice, __spreadArray([void 0, style, scale], args, false)))();
    //? missing args or "values"    
}
exports.lattice = lattice;
function region(id, style) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    exports.currentRegion = new (lammps_classes_1.Region.bind.apply(lammps_classes_1.Region, __spreadArray([void 0, id, style], args, false)))();
}
exports.region = region;
//* Setup atoms
function atom_modify() {
}
exports.atom_modify = atom_modify;
//? not doing anything right now
//? only supports atomic right now
function atom_styles(style) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    exports.atom_style = "amoeba" || "angle" || "atomic" || "body" ||
        "bond" || "charge" || "dielectric" || "dipole" ||
        "dpd" || "edpd" || "electron" || "ellipsoid" ||
        "full" || "line" || "mdpd" || "molecular" ||
        "oxdna" || "peri" || "smd" || "sph" ||
        "sphere" || "bpm/sphere" || "spin" || "tdpd" ||
        "tri" || "template" || "wavepacket" || "hybrid" ?
        style : exports.atom_style;
}
exports.atom_styles = atom_styles;
function balance() {
}
exports.balance = balance;
//           create_atoms    1   box
function create_atoms(type, style) {
    //*check for exceptions
    if (exports.boxForHelper != undefined && exports.lattice_tyle != null) {
        //* Pre-calculate half of the dimensions to avoid doing it in every iteration
        var halfHeight = exports.boxForHelper.parameters.height / 2;
        var halfWidth = exports.boxForHelper.parameters.width / 2;
        var halfDepth = exports.boxForHelper.parameters.depth / 2;
        //* Define bounds based on half the box dimensions
        var bounds = {
            x: [0, halfWidth],
            y: [0, halfHeight],
            z: [0, halfDepth]
        };
        // Iterate over each dimension
        for (var i = bounds.x[0]; i <= bounds.x[1]; i += exports.lattice_scale) {
            for (var j = bounds.y[0]; j <= bounds.y[1]; j += exports.lattice_scale) {
                for (var k = bounds.z[0]; k <= bounds.z[1]; k += exports.lattice_scale) {
                    //* Calculate positions ensuring not to exceed box dimensions
                    var positions = [];
                    //* Calculate all symmetrical positions
                    for (var _i = 0, _a = (i === 0 ? [0] : [-i, i]); _i < _a.length; _i++) {
                        var dx = _a[_i];
                        for (var _b = 0, _c = (j === 0 ? [0] : [-j, j]); _b < _c.length; _b++) {
                            var dy = _c[_b];
                            for (var _d = 0, _e = (k === 0 ? [0] : [-k, k]); _d < _e.length; _d++) {
                                var dz = _e[_d];
                                // Skip the origin which was already added
                                if (dx === 0 && dy === 0 && dz === 0)
                                    continue;
                                positions.push({ x: dx, y: dy, z: dz });
                            }
                        }
                    }
                    //* Create and add atoms for all calculated positions
                    positions.forEach(function (pos) {
                        var atom = new classes.THREE_LJ();
                        atom.ball.position.set(pos.x, pos.y, pos.z);
                        setUp.scene.add(atom.ball);
                    });
                }
            }
        }
    }
}
exports.create_atoms = create_atoms;
function create_bonds() {
}
exports.create_bonds = create_bonds;
function delete_atoms() {
}
exports.delete_atoms = delete_atoms;
function delete_bonds() {
}
exports.delete_bonds = delete_bonds;
function displace_atoms() {
}
exports.displace_atoms = displace_atoms;
function group() {
}
exports.group = group;
//* Set the mass of the atoms by type
function mass(I, value) {
    for (var i = 0; i < setUp.AllElements.length; i++) {
        var element = setUp.AllElements[i];
        if (element.constructor.name == setUp.AllElementTypes[I] || I == '*') {
            element.mass = value;
        }
    }
}
exports.mass = mass;
function molecule() {
}
exports.molecule = molecule;
function read_data() {
}
exports.read_data = read_data;
function read_dump() {
}
exports.read_dump = read_dump;
function read_restart() {
}
exports.read_restart = read_restart;
function replicate() {
}
exports.replicate = replicate;
function set() {
}
exports.set = set;
//? this is not doing anything right now
function velocity(group, style) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    if (group == 'all') {
        if (style == 'create') {
            for (var i = 0; i < setUp.AllElements.length; i++) {
                var element = setUp.AllElements[i];
                var temp = parseFloat(args[0]);
                var randomSeed = parseFloat(args[1]);
                setUp.AllElements[i].velocity = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
            }
        }
    }
}
exports.velocity = velocity;
//* Force fields
function angle_coeff() {
}
exports.angle_coeff = angle_coeff;
function angle_style() {
}
exports.angle_style = angle_style;
function bond_coeff() {
}
exports.bond_coeff = bond_coeff;
function bond_style() {
}
exports.bond_style = bond_style;
function bond_write() {
}
exports.bond_write = bond_write;
function dielectric() {
}
exports.dielectric = dielectric;
function dihedral_coeff() {
}
exports.dihedral_coeff = dihedral_coeff;
function dihedral_style() {
}
exports.dihedral_style = dihedral_style;
function improper_coeff() {
}
exports.improper_coeff = improper_coeff;
function improper_style() {
}
exports.improper_style = improper_style;
function kspace_modify() {
}
exports.kspace_modify = kspace_modify;
function kspace_style() {
}
exports.kspace_style = kspace_style;
//pair_coeff      *   *   1.0   1.0
function pair_coeff(I, J) {
    //* i need to grab the atom types who's the potential will be computed
    //* i also need to grab the atom's who's proximity is less than the cutoff
    //* i also need to grab the right potential function
    //* then i need to finally calculate the potential of each atom pair
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    for (var i = 0; i < setUp.AllElements.length; i++) {
        var atomA = setUp.AllElements[i];
        atomA.energy = Number.parseInt(args[0]);
        atomA.distance = Number.parseInt(args[1]);
        for (var j = 0; j < setUp.AllElements.length; j++) {
            var atomB = setUp.AllElements[j];
            //* skip if atomA and atomB are the same
            if (atomA == atomB)
                continue;
            //* if atom is I or *
            if (atomA.constructor.name == setUp.AllElementTypes[I] || I == '*') {
                //* if atom is J or *
                if (atomB.constructor.name == setUp.AllElementTypes[J] || J == '*') {
                }
            }
        }
    }
}
exports.pair_coeff = pair_coeff;
function pair_modify() {
}
exports.pair_modify = pair_modify;
//pair_style  lj/cut 2.5
//* set the cutoff distance for the interactions
function pair_style(style) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    exports.pair_style_style = "lj/cut" || "eam/alloy" ||
        "hybrid lj/charmm/coul/long 10.0 eam" ||
        "table linear 1000" || "none" ? style : "none";
    exports.pairStyle_cutoff = Number.parseFloat(args[0]) || 2.5;
}
exports.pair_style = pair_style;
function pair_write() {
}
exports.pair_write = pair_write;
function special_bonds() {
}
exports.special_bonds = special_bonds;
//* Settings
function comm_modify() {
}
exports.comm_modify = comm_modify;
function comm_style() {
}
exports.comm_style = comm_style;
function info() {
}
exports.info = info;
function min_modify() {
}
exports.min_modify = min_modify;
function min_style() {
}
exports.min_style = min_style;
function neigh_modify() {
}
exports.neigh_modify = neigh_modify;
function neighbor() {
}
exports.neighbor = neighbor;
function partition() {
}
exports.partition = partition;
function reset_timestep() {
}
exports.reset_timestep = reset_timestep;
function run_style() {
}
exports.run_style = run_style;
function timer() {
}
exports.timer = timer;
function timestep() {
}
exports.timestep = timestep;
//* Operations within timestepping (fixes) and diagnostics (computes)
function compute() {
}
exports.compute = compute;
function compute_modify() {
}
exports.compute_modify = compute_modify;
//fix             1   all nve
//*working on this yk
function fix(ID, groupID, style) {
}
exports.fix = fix;
function fix_modify() {
}
exports.fix_modify = fix_modify;
function uncompute() {
}
exports.uncompute = uncompute;
function unfix() {
}
exports.unfix = unfix;
//* Output
// called as dump image
function dump_image() {
}
exports.dump_image = dump_image;
//calles as dump movie
function dump_movie() {
}
exports.dump_movie = dump_movie;
function dump() {
}
exports.dump = dump;
function dump_modify() {
}
exports.dump_modify = dump_modify;
function restart() {
}
exports.restart = restart;
function thermo() {
}
exports.thermo = thermo;
function thermo_modify() {
}
exports.thermo_modify = thermo_modify;
function thermo_style() {
}
exports.thermo_style = thermo_style;
function undump() {
}
exports.undump = undump;
function write_coeff() {
}
exports.write_coeff = write_coeff;
function write_data() {
}
exports.write_data = write_data;
function write_dump() {
}
exports.write_dump = write_dump;
function write_restartv() {
}
exports.write_restartv = write_restartv;
//* Actions 
function minimize() {
}
exports.minimize = minimize;
function neb() {
}
exports.neb = neb;
function neb_spin() {
}
exports.neb_spin = neb_spin;
function prd() {
}
exports.prd = prd;
function rerun() {
}
exports.rerun = rerun;
//run             1000
//*working on this yk
function run(N, keyword) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var ts = 0.000005;
    //*animation loop
    function animate() {
        requestAnimationFrame(animate);
        //* run the simulation for N timesteps
        if (N > 0) {
            setUp.AllElements.forEach(function (element) {
                setUp.AllElements.forEach(function (element2) {
                    if (element != element2) {
                        element.stormerVerlet(ts, element2);
                    }
                });
            });
        }
        //!
        setUp.renderer.render(setUp.scene, setUp.camera);
    }
    animate();
}
exports.run = run;
function tad() {
}
exports.tad = tad;
function temper() {
}
exports.temper = temper;
//* Input script control
function clear() {
}
exports.clear = clear;
function echo() {
}
exports.echo = echo;
//called as if
function if_() {
}
exports.if_ = if_;
function include() {
}
exports.include = include;
//there are 2 info, called as info
function info_() {
}
exports.info_ = info_;
function jump() {
}
exports.jump = jump;
function label() {
}
exports.label = label;
function log() {
}
exports.log = log;
function next() {
}
exports.next = next;
function print() {
}
exports.print = print;
function python() {
}
exports.python = python;
function quit() {
}
exports.quit = quit;
function shell() {
}
exports.shell = shell;
function variable() {
}
exports.variable = variable;
