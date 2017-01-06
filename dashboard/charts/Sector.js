require("../../stylesheets/styles.css");
var React = require('react');
var d3 = require('d3');
var Sector = React.createClass({
  getInitialState: function() {
    return {text: '', className:'arc'};
  },
  render: function() {
    var outerRadius = this.props.height/2;
    var innerRadius = this.props.width/8;
    var arc = d3.arc()
        .outerRadius(outerRadius)
        .innerRadius(0);
    var data = this.props.data;
    var centroid = arc.centroid(data);
    centroid[0]*= 1.5;
    centroid[1]*= 1.5;
    var center = "translate(" + centroid + ")";
    var percentCenter = "translate(0,3)";
    var color = this.props.colors;
    var position =  "translate(" + this.props.width/1.5 + ","+ ((this.props.ikey*20)+((this.props.height/-2)-10)) + ")";
    return (
		      <g onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} onClick={this.onClick}>
		         <path className={this.state.className} stroke={'white'} strokeWidth={'0.5'} fill={this.props.fill} d={arc(this.props.data)} cursor='pointer'></path>
		        <text fill="white" transform={center} textAnchor="middle" fontSize="15px">{data.value}</text>
		        <g transform={position}>
		        <rect className={this.state.opacity} width="10" height="10" fill={this.props.fill} x={arc.x} cursor='pointer'></rect>
		        <text x="22" y="5" dy=".35em" ref = 'txt' className={this.state.textclass} fontSize="12px" cursor='pointer'>{this.props.name}</text>
		        </g>
		      </g>
    );
  },

  onMouseOver: function(event) {
    var percent = (this.props.data.value/this.props.total)*100;
    percent = percent.toFixed(1);
    this.refs.txt.style.fontWeight='bold';
    this.refs.txt.style.fontSize='15px';
    d3.event = event;
    var mouseCoordinates = d3.mouse(event.currentTarget);
    var toolTipData = {};
    toolTipData.text = this.props.name;
    toolTipData.value = percent + " %";
    toolTipData.left = Math.max(0, mouseCoordinates[0]);
    toolTipData.top = mouseCoordinates[1];
    this.setState({text: percent + " %", className:'arc-hover'});
    this.props.showTooltip(toolTipData);
  },
  onMouseOut: function() {
	this.refs.txt.style.fontWeight='normal';
	this.refs.txt.style.fontSize='12px';
    this.setState({text: '', className:'arc'});
    this.props.hideTooltip();
  },
  onClick: function() {
	var selectedItem = this.props.sectorData;
	this.props.onClick(selectedItem);
  }
});
module.exports = Sector;