require("../../stylesheets/styles.css");
var React = require('react');
var ChartContainer = require('./ChartContainer');
var DataSeries = require('./DataSeries');
var DashboardChart = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    title: React.PropTypes.string,
    data: React.PropTypes.array.isRequired,
    colors: React.PropTypes.array,
    chartParam: React.PropTypes.array.isRequired,
    onClick: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
	    return {toolTipText: '', toolTipClassName:'hidden', toolTipValue:'', isRefreshed:true};
  },
  getDefaultProps: function() {
    return {
      width: 100,
      height: 200,
      title: '',
      colors :[],
      chartParam: [],
      onClick: function(){}
    };
  },
  
  componentWillReceiveProps: function(nextProps) {
	  this.setState({isRefreshed: nextProps.isRefreshed});
  },

  showTooltip: function(data) {
	this.setState({toolTipClassName:'show', toolTipText: data.text, toolTipValue: data.value, isRefreshed:false}); 
	this.refs.dbTooltip.style.left = data.left + 350 +'px';
	this.refs.dbTooltip.style.top = data.top + 150 +'px';
  },
  
  hideTooltip: function() {
	  this.setState({toolTipClassName:'hidden', toolTipText: '', toolTipValue: '', isRefreshed:false});
	  this.refs.dbTooltip.style.left = '';
	  this.refs.dbTooltip.style.top = '';
  },
  
  getRandomColor: function () {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  },
  render: function() {
    var colors = [];
    var chartParam = this.props.chartParam;
    for(var i=0; i < this.props.data.length; i++) {
    	colors.push(this.getRandomColor());
    }	  
    var margin = {top: 15, right: 80, bottom: 10, left: 120};
	var height = this.props.height - margin.top-margin.bottom;
	var width = this.props.width - margin.left-margin.right;
	var horizontalChartPadding = 10;
	var verticalChartPadding = 30;
    return (
      <div>
      <ChartContainer width={width} height={height} type={this.props.chartSeries}>
	      <DataSeries data={this.props.data} colors={colors} width=
	        {width-horizontalChartPadding} height={height-verticalChartPadding} chartSeries={this.props.chartSeries} chartParam={this.props.chartParam} onClick={this.props.onClick}
	       showTooltip={this.showTooltip} hideTooltip={this.hideTooltip} showAxes={this.props.showAxes} chartStyle={this.props.chartStyle} isRefreshed={this.state.isRefreshed}/>
	  </ChartContainer>
	  <div id="dbTooltip" ref = "dbTooltip" className={this.state.toolTipClassName}>
	        <p><strong>{this.state.toolTipText}</strong></p>
	        <p><span></span>{this.state.toolTipValue}</p>
	  </div>
      </div>
    );
  }
});
DashboardChart.d3 = require('d3');
module.exports = DashboardChart;