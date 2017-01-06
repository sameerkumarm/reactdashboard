require("../../stylesheets/styles.css");
var React = require('react');
var Tooltip = React.createClass({
  getDefaultProps: function() {
    return {
      translate: "scale(0.9)"
    }
  },     
  componentWillUpdate: function(nextProps, nextState){
	  //this.setState({});
	  this.refs.tt.style.opacity = nextProps.opacity;
	  this.refs.tt.style.zIndex = 1040;
  },
  render: function() {
	 /*The rectangle and text are positioned 
      to the right and above the <g> element's
      0,0 point, purely to help with all the 
      overlapping tooltips!*/
      return (
    		  <g transform={this.props.translate}>
    	        <g ref ='tt' className="tooltip">
    	          <rect width="10em" height="3em"  
    	                  x="-7em" y="-2.5em"/>
    	          <text x="-2.5em" y="-2.5em" textAnchor="middle" fontStyle="bold">
    	            <tspan dy="1em">{this.props.text}</tspan>
    	            <tspan x="-3.5em" dy="1em">{this.props.value}</tspan>
    	          </text>
    	        </g>
    	    </g>
      );
    }     
});

module.exports = Tooltip;