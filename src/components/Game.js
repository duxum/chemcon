import * as React from "react"
import {Grid} from "./Grid"
import {Bond} from "./Bond"
import {Atom, Point} from "./Atom"
import MoleculeList from "./MoleculeList"
import MoleculeDrawing from "./MoleculeDrawing"
import {Grid as SGrid, Message}  from "semantic-ui-react"
import {get} from "axios"


//Game Representation. It is involved mainly in controlling the number of bonds in the playground
export default class Game extends React.Component{
    state;
    constructor(){
        super();
        this.state = {data: {atoms:[], molecules:[]}} 
        this.bonds = []
        this.updateGame = this.updateGame.bind(this)

    }


    //Get all the molecules name and whether they are done
    getMoleculesNames():{name:string, done:bool}[]{
        let result =[]
        for (let molecule of this.state.data.molecules){
            result.push({name: molecule.name, done: molecule.done})
        }
        return result
    }


    //Get atoms' id in bonds
    getIDsInBonds(bonds:Bond[]):number[]{
        let resultSet = new Set();
        for (let bond of bonds){
            resultSet.add(bond.from.ID)
            resultSet.add(bond.to.ID)
        }
        return Array.from(resultSet);
    }

    //Return if a bond is resent in bonds
    bondPresent(bond, bonds){
        for (let currentBond of bonds){
            if (Bond.same(currentBond, bond)){
                return true
            }
        }
        return false
    }

    //Are moleculeBonds present in the bonds
    moleculePresent(moleculeBonds:Bond[], bonds:Bond[]){
        let count = 0

        for (let mb of moleculeBonds){
            for (let b of bonds){
                if (Bond.same(mb, b) && mb.nbonds === b.nbonds){
                    count++;
                }
            }
        }
        
        return count === moleculeBonds.length
    }



    //updateGame is called whenever bonds changes, it is process all currently present bonds and set if respective molecules have been selected.
    //It also make sure that atoms in the solution are not bonded to other molecules
    updateGame(bonds:Bond[]){
        this.bonds = bonds;
        let notInSolution = bonds;
        
        let i= 0;
        
        for(let molecule of this.state.data.molecules){
            if (this.moleculePresent(molecule.bonds, bonds)){
               
                notInSolution = notInSolution.filter((bond) =>{ return !this.bondPresent(bond, molecule.bonds)})
                let IDsForCorrectMolecule = this.getIDsInBonds(molecule.bonds)
              
                let notInSolutionAtoms = this.getIDsInBonds(notInSolution)
                if (IDsForCorrectMolecule.some((atomID) => notInSolutionAtoms.includes(atomID))){
                    molecule.done = false
                }else{
                    molecule.done = true
                }
            }else{
                molecule.done = false
            }
            i+=1;
        }
        this.forceUpdate()    
    }


    //Get links to be passed to d3
    getLinks(){
        let links = []
        for (let bond of this.bonds){
            links.push({"source": bond.from.ID , "target": bond.to.ID, bond: bond.nbonds})
        }
        return links
    }


    //Get nodes to be passed to d3
    getNodes(){
        let nodes = []
        let IDs = this.getIDsInBonds(this.bonds)
        for(let ID of IDs){
            let currentAtom  = this.state.data.atoms[ID]
            nodes.push({id: ID, atom:currentAtom, size:AtomSizes[currentAtom], group:1})
        }
        return nodes
    }

    AssignState(data){
        for (let i = 0;i<data.molecules.length; i++){
            data.molecules[i].done = false
            data.molecules[i].bonds = []
            for (let link of data.molecules[i].mustLink){
                data.molecules[i].bonds.push(new Bond(new Atom(new Point(0, 0), link.from-1, data.atoms[link.from-1]), new Atom(new Point(0, 0), link.to-1, data.atoms[link.to-1]), link.bond))
            }
        }

        this.setState({set:true, data: data})

    }

    // componentWillMount(){
    componentDidMount(){
        get("samples/1.json")
        .then((response)=> {
            this.AssignState(response.data)
        })
    }

    render(){
        return (
            <div>
        
                        <Message color = "green" header='How to play' size = "mini" positive>
                            <h3>Feedback is also Welcome to duxumdux@gmail.com&emsp;&emsp;&emsp;&emsp;For the best experience, a computer is recommended 100% with Chrome/Safari. </h3>
                            Simply Play. The rules are:
                            <ul>
                                <li> An atom can be activated by clicking on it. It can be bonded by clicking on one of its neighbors</li>
                                <li>A bond Can be removed by clicking on it</li>
                                <li>As in real life Chemistry only less that 4 bonds are allowed between any two particular atoms</li>
                            </ul>
                        </Message>
               
         
            <SGrid celled id="main">
                
                <SGrid.Row>
                    <SGrid.Column width={8}>
                        <Grid rows="9" columns = "9"  atoms={this.state.data.atoms} updateGame = {this.updateGame}/>
                    </SGrid.Column>
                    <SGrid.Column width={8}>
                        <MoleculeList molecules ={this.getMoleculesNames()} />
                        <MoleculeDrawing links = {this.getLinks()} nodes = {this.getNodes()}  />
                    </SGrid.Column>
               
                </SGrid.Row>
            </SGrid>
            </div>
        )
    }
}



const AtomSizes = {
    "C":12,
    "N":14,
    "H":1,
    "O":16,
    "S":32,
    "Ca":40
}