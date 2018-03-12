import * as React from "react"
import AtomDrawing,{ Atom, Point } from "./Atom"
import BondDrawing, {Bond} from './Bond'


export class Grid extends React.Component{
    static spacing:number = 40;
    static atomKeys = 0   //Counts for the keys for atom. Each atom maintains its key.
    static bondKeys = 100 //Counts for the keys for bonds. Each Bond render render with completely differnt keys relative to previous render
    static dimensions;
    bonds:Bond[] = [];

    static width = Grid.spacing*2*3/4;              //Width of each atom hex
    static height =Math.sqrt(3)/2*Grid.spacing*2;   //Width of each atom hex
   
    clicked = {state:false, from:{}}                   //IS there any atom clicked
    constructor(props){
        super(props);
        this.state = {bonds:[], clicked:{state:false, from:{}}};
        this.atomClicked = this.atomClicked.bind(this)
        this.bondClicked = this.bondClicked.bind(this)
        Grid.dimensions = new Point(props.rows, props.columns);
    };

    renderAtoms(){
        let allElements = []
        let width = Grid.spacing*2*3/4;
        let height =Math.sqrt(3)/2*Grid.spacing*2;


        //Adding Atom elements
        Grid.atomKeys = 0;
        for (let i = 0; i<Grid.dimensions.x;i++){
            for (let j = 0; j<Grid.dimensions.y;j++){
                let b = height*(i+0.7);
                let offsetY = j%2===0?height/2:0;
                let a = width*(j+0.7);
                allElements.push(<AtomDrawing key={Grid.atomKeys} ID = {Grid.atomKeys} {...{x:a, y:b+offsetY}} atomClicked= {this.atomClicked} color = {Grid.atomKeys === this.state.clicked.from.ID?"red":"purple" } name = {this.props.atoms[Grid.atomKeys]}/>) //{(e) =>this.AtomClicked(e, {x:a, y:b+offsetY})}
                Grid.atomKeys++;
            }
        }

        //Adding Bonds
        //Bonds key keep on changing from 100+, they are update everytime for ease of management
        for (let bond of this.state.bonds){
            allElements.push(<BondDrawing key = {Grid.bondKeys++} from= {bond.from} to= {bond.to} nbonds = {bond.nbonds} color = "black" bondClicked = {this.bondClicked} />)
        }

        if (Grid.bondKeys > 900){
            Grid.bondKeys = 0
        }
        return allElements
    }

    //Are two atoms hex neigbor
    //A bond can be formed only between neigboting atoms hex
    neighbor(a:Atom, b:Atom){
        let distanceAB = Math.sqrt((a.center.x - b.center.x)**2+ (a.center.y - b.center.y)**2)
        if (Math.abs(Math.sqrt((Grid.height/2)**2 +(Grid.width)**2) - distanceAB )>0.00001){
            return false
        }
        return true

    }

    //Handles bond clicking
    bondClicked(bond:Bond){
        for (let i = 0;i < this.state.bonds.length;i++){
            let currentBond = this.state.bonds[i];
            
            if(Bond.same(currentBond, bond)){
                this.state.bonds[i].nbonds-=1
                if (this.state.bonds[i].nbonds <=0){
                    this.state.bonds.splice(i, 1)
                } 
            }
        }

        this.props.updateGame(this.state.bonds) //Updating the whole game about clicking
        this.forceUpdate()
    }

    //Hanldes atom clicking
    atomClicked(newAtom:Atom){

        if (this.state.clicked.state === false){
            this.setState({clicked:{state:true, from:newAtom}})
            
            return
        }else{
            if (!this.neighbor(newAtom, this.state.clicked.from)){
                this.setState({clicked:{state:false, from:{}}})
            
                return 
            } 
            for (let i = 0;i < this.state.bonds.length;i++){
                let currentBond = this.state.bonds[i];
                if((currentBond.from.ID === newAtom.ID && currentBond.to.ID === this.state.clicked.from.ID) || (currentBond.from.ID === this.state.clicked.from.ID && currentBond.to.ID === newAtom.ID) ){
                    //This is bond being added is present and the numbrt of bonds may be being increased
                    if (currentBond.nbonds<3){
                        this.state.bonds[i].nbonds+=1
                    }

                    this.setState({clicked: {state:false, from:{}}})

                    this.props.updateGame(this.state.bonds)

                    return 

                }
            }
        }
        
        this.state.bonds.push(new Bond(this.state.clicked.from, newAtom, 1))
        this.setState({clicked: {state:false, from:{}}})
        // this.state.clicked = 
        this.props.updateGame(this.state.bonds)

    }

    render(){
        return (<svg id="color-fill" xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%">
                    {this.renderAtoms()} 
                </svg>)
    }
}

