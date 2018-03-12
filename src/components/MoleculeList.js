import * as React from "react"



export default class MoleculeList extends React.Component{
    // constructor(props){
    //     super(props)
    // }
    render(){
        let cKey = 0
        let listElements = this.props.molecules.map((molecule) =>
            <li className = {molecule.done?'correct':'not-correct'} key = {cKey++} >{molecule.name}</li>
        );
        return(
            <ul>
                {listElements}
            </ul>
        )
    }
}