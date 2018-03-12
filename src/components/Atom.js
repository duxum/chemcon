import React from "react";

export class Point{
    x: number;
    y :number;
    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
    }

    //Returns if points are the same
    static same(a:Point, b:Point){
        return a.x === b.x && a.y === b.y
    }
}


export class Atom{
    center :Point;
    name :string;
    ID:number;
    constructor(center:Point, ID,name){
        this.center = center;
        this.name = name;
        this.ID = ID;
    }
}


export default class AtomDrawing extends React.Component{
    static gridCenter = new Point(0,0);
    data:Atom;
    static size = new Point(38, 38);   //Describes the length of the Atom without the padding
    static startAngle = 0;             //Angle from x axis where Atom corners are calculated from
    
    constructor (props) {
        super(props)
        this.data = new Atom(new Point(props.x, props.y), props.ID,"H")
    }

    getCorners(center:Point):string{
        let res = ""
        for (let i = 0; i < 6; i++){
            let angle = 2.0 * Math.PI * (AtomDrawing.startAngle - i) / 6;
            res+= (center.x +AtomDrawing.size.x*Math.cos(angle) )+" "+(+center.y+AtomDrawing.size.y* Math.sin(angle) )+" " ;
        }
        return res;
    }
    
    render(){
        return(<g onClick = {(e)=>this.props.atomClicked(this.data, e)}>
            <polygon stroke="blue" fill={this.props.color} fillOpacity="0.5"key = "1" className="hex" points={this.getCorners(this.data.center)}  ></polygon>
            <text x ={this.data.center.x-7.5} y ={this.data.center.y+7.5} fontSize="20">{this.props.name}</text> </g>
        )
    }

}
