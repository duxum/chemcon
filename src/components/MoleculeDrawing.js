import React from "react";
import * as d3 from "d3"

import CloneDeep from 'lodash.clonedeep'

export default class MoleculeDrawing extends React.Component{
    constructor(props){
        super(props)
        this.initialMount = false;
    }

    //DrawMolecules the main function which draw direcly to the provided selector in a svg.
    DrawMolecules(selector, nodes, links, width, height){

        //radius calculate actual radius for an atom
        let radius = d3.scaleSqrt()
                       .range([0, 6]);
    

        let svg = d3.select(selector);
        
        //Clear the current MoleculeDrawing
        svg.selectAll(".node").remove()
        svg.selectAll(".link").remove()
        

        //color provides a color for a particular atom group
        let color = d3.scaleOrdinal(d3.schemeCategory20);
    
        let simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(function(d) { return radius(d.source.size) + radius(d.target.size) + 20; }).strength(1))
            .force("charge", d3.forceManyBody().strength(-300))
            .force("center", d3.forceCenter(width / 2, height / 2));
    
    
      let link = svg.selectAll(".link")
        .data(links)
        .enter().append("g")
          .attr("class", "link");
    
      link.append("line")
          .style("stroke-width", function(d) { return (d.bond * 2 - 1) * 2 + "px"; });
      
      link.filter(function(d) { return d.bond === 2; }).append("line")
      .attr("class", "separator2");
      link.filter(function(d) { return d.bond === 3; }).append("line")
          .attr("class", "separator");
      link.filter(function(d) { return d.bond === 3; }).append("line")
          .attr("stroke-width", function(d){return 2+"px"; });

          
    
      let node = svg.selectAll(".nodes")
        .data(nodes)
        .enter().append("g")
          .attr("class", "node")
      
      node.exit().remove();
      node.append("circle")
          .attr("r", function(d) { return radius(d.size); })
          .attr("fill", function(d) { return color(d.group); });
    
    
        node.append("text")
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function(d) { return d.atom; });

    simulation.velocityDecay(0.7)
      simulation
          .nodes(nodes)
          .on("tick", ticked);
    
      simulation.force("link")
          .links(links);
        
    
      function ticked() {
        link.selectAll("line")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    
        node
            .attr("cx", function(d) { return d.x+10; })
            .attr("cy", function(d) { return d.y; })
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
      }
      
    }

    

    componentDidMount(){
        let svg = document.getElementById("d3-representation");
        let rect = svg.getBoundingClientRect(); //Boundaries of current MoleculeDrawing window
        this.DrawMolecules("#d3-representation", this.props.nodes, this.props.links, rect.width, rect.height)
        this.initialMount = true;
    }

    render(){
        if (this.initialMount){
            let svg = document.getElementById("d3-representation");
            let rect = svg.getBoundingClientRect();
            this.DrawMolecules("#d3-representation", CloneDeep(this.props.nodes), CloneDeep(this.props.links), rect.width, rect.height)
        }
        
        return(
            <svg  id="d3-representation" xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%">
            </svg>
        )
    }
}