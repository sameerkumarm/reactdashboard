var React = require('react');
var d3 = require('d3');
var Bar = React.createClass({
   getDefaultProps: function() {
        return {
          width: 0,
          height: 0,
          offset: 0,
        }
    },     
    onMouseOver: function(event) {
		var toolTipData = {};
	    toolTipData.text = this.props.name;
	    toolTipData.value = this.props.text;
	    d3.event = event;
	    var mouseCoordinates = d3.mouse(event.currentTarget);
	    toolTipData.left = Math.max(0, mouseCoordinates[0]) - 150;
	    toolTipData.top = mouseCoordinates[1];
	    this.props.showTooltip(toolTipData);
	},
	onMouseOut: function() {
	  this.props.hideTooltip();
	},
	
	onClick: function() {
	  this.props.onClick(this.props.barData);
	},
	
  render: function() {

      return (
    		  <g transform={this.props.translate}>
    		  	<rect onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={this.onClick}
	        	width={this.props.width} height={this.props.height} fill={this.props.fillColor}
	        	transform={"translate(0,4)"} cursor='pointer'>
    		  	</rect>
    		  	<text fill={"white"} x={this.props.textX} y={this.props.textY} cursor='pointer'> {this.props.text} </text>
    		  </g>
      );
    }     
});

module.exports = Bar;