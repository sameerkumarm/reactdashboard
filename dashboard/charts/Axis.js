var React = require('react');
var styles = require("../../stylesheets/styles.css");
var d3 = require('d3');
var Axis = React.createClass({
	propTypes: {
	    width: React.PropTypes.number.isRequired,
	    height: React.PropTypes.number.isRequired,
	    orient: React.PropTypes.string.isRequired,
	    scale: React.PropTypes.func.isRequired,
	    tickFormat:React.PropTypes.func
	  },
	  componentDidMount: function() {
        this.renderAxis();
	  },
  
      getDefaultProps: function() {
        return {
    	  orient: 'bottom',
    	  tickFormat: d3.format('^f')
        }
     },
	
  componentDidUpdate: function() {
    this.renderAxis();
  },

  renderAxis: function() {
	  var node  = this.refs.axis;
	  var axis = null//d3.svg.axis().scale(this.props.scale);
	  if(this.props.orient == 'bottom'){
		  axis = d3.axisBottom(this.props.scale);
		  //axis.orient(this.props.orient)
		  axis.tickSize(-this.props.height,0,0);
	  }
	  else if(this.props.orient == 'left'){
		  axis = d3.axisLeft(this.props.scale);
		  axis.tickSize(-this.props.width,0,0);
	  }
	  if(this.props.ticks){
		  axis.ticks(this.props.ticks)
	  }
	  /*if(this.props.tickSize){
		  axis.tickSize(this.props.tickSize);
	  }*/
	  if(this.props.tickFormat!='none'){
		  axis.tickFormat(this.props.tickFormat);
	  }
	  if(this.props.tickValues){
		  axis.tickValues(this.props.tickValues);
	  }
	  /*axis.tickSize(-this.props.height,0,0)
	  
	  axis.innerTickSize(-this.props.height)
	    .outerTickSize(0)
	    .tickPadding(10);*/
	  d3.select(node).call(axis);
  },

  render: function() {
	  return( 
		  <g className={this.props.className} ref="axis" transform={this.props.translate}>
		  </g>
	  );
  }
});
module.exports = Axis;