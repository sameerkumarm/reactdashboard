var React = require('react');
var styles = require("../../stylesheets/styles.css");
var d3 = require('d3');
var AxisGrid = React.createClass({
  componentDidMount: function() {
    this.renderGrid();
  },

  componentDidUpdate: function() {
    this.renderGrid();
  },

  renderGrid: function() {
	  var gridNode  = this.refs.grid;
	  var axis = null;//d3.svg.axis().scale(this.props.scale);
	  if(this.props.orient){
		  if('bottom'===this.props.orient){
			  axis = d3.axisBottom(this.props.scale);
			  axis.tickSize(-this.props.height,0,0).tickFormat("");
		  }
		  if('left'===this.props.orient){
			  axis = d3.axisLeft(this.props.scale);
			  axis.tickSize(-this.props.width,0,0).tickFormat("");
		  }
	  }
	  if(this.props.ticks){
		  axis.tickArguments([this.props.ticks]);
	  }
	  if(this.props.tickSize){
		  axis.tickSize(this.props.tickSize);
	  }
	  if(this.props.tickFormat){
		  axis.tickFormat(this.props.tickFormat);
	  }
	  /*if(this.props.tickValues){
		  axis.tickValues(this.props.tickValues);
	  }*/
	  /*axis.tickSize(-this.props.height,0,0)
	  
	  axis.innerTickSize(-this.props.height)
	    .outerTickSize(0)
	    .tickPadding(10);*/
	  d3.select(gridNode).call(axis);
  },
  
  render: function() {
	  return( 
		  <g className={"grid"} ref="grid" transform={this.props.translate}>
		  </g>
	  );
  }
});
module.exports = AxisGrid;