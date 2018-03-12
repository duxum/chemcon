import React from 'react'
import Atom from './Atom'


//Representation of bond between two Atoms.
//It has a source and destination and number of bonds present
export class Bond{
    nbonds:number;
    from:Atom;
    to:Atom;
    constructor(from:Atom, to:Atom, n:number ){
        this.nbonds = n;
        this.from = from;
        this.to = to;
    }

    //same returns if a two bonds are between two same atoms
    static same(a:Bond, b:Bond){
        return ((a.from.ID === b.from.ID && a.to.ID === b.to.ID) || (a.from.ID === b.to.ID && a.to.ID === b.from.ID))
    }

}


//BondDrawing is representation of a bond, which can be a single bond or multiple bonds. Note it is the bond in playground not one managed by d3
//It has bond it represent in data
export default class BondDrawing extends React.Component{
    angle: number;
    data: Bond;
    static lineCount = 1000;
    constructor(props){
        super(props)
        this.from = props.from
        this.to = props.to
        this.nbonds = props.nbonds
        this.data = new Bond(props.from, props.to, props.nbonds)
       
        this.state = {data: new Bond(props.from, props.to, props.nbonds)}
        this.angle =  Math.atan2(this.to.center.y - this.from.center.y, this.to.center.x - this.from.center.x) //Angle made by the bond with x-axis
    }


    //Return array of JSX elements of arrays, corresponding to magnitudes
    //[0] magnitide is for a single bond
    //[-3, 3] Double bond which are shifted by those factor from 0
    //[-3, 0, 3] Triple bond
    getBondsProjectedBy(magnitudes:number[]){
        let result = []

        //The part to remove from the center of origin and destination atoms
        let cutX = Math.cos(this.angle) * 20
        let cutY = Math.sin(this.angle) * 20

        for (let magnitude of magnitudes){

            //Note the second and third bond must be shifted from where thre are supposed to be
            let shiftX = Math.cos(this.angle+Math.PI/2) * magnitude
            let shiftY =  Math.sin(this.angle+Math.PI/2) * magnitude


            let x1 = this.data.from.center.x+cutX+shiftX
            let x2 = this.data.to.center.x-cutX+shiftX
            let y1 = this.data.from.center.y+cutY+shiftY
            let y2 =this.data.to.center.y-cutY+shiftY
            result.push(<line key = {BondDrawing.lineCount++} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="2" stroke="black" onClick = {()=>this.props.bondClicked(this.data)} />)
        }

        return result
    }


    //Get returns coordinates for curent bond
    getBondCoordinates(){
        let magnitudes;
        switch(this.data.nbonds){
            case 1: 
            magnitudes = [0]
            break;
            case 2:
            magnitudes =[3, -3]
            break;
            case 3:
            magnitudes = [3,0, -3]
            break;
            default:
            break;
        }
        return this.getBondsProjectedBy(magnitudes)
    }


    render(){
        return (
            this.getBondCoordinates()
        )
    }
}