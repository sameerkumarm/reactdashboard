require("../../stylesheets/styles.css");
var React = require('react');
var ChartUtils = require('./ChartUtils');
var ChartFactory = require('./ChartFactory');
var d3 = require('d3');
var update = require('react-addons-update');
var DataSeries = React.createClass({
  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    color: React.PropTypes.array,
    data: React.PropTypes.array.isRequired,
    chartSeries: React.PropTypes.string.isRequired,
    chartParam: React.PropTypes.array.isRequired,
    onClick: React.PropTypes.func.isRequired
  },
  
  getDefaultProps: function() {
      return {
        title: '',
        data: [],
        chartParam: [],
        chartStyle: 'horizantal',
        showAxes: true,
        onClick: function(){}
      }
  },
  componentWillMount: function() {
	  var chartSeries = this.props.chartSeries;
	  var props = {};
	  props = update(props,{$merge:this.props});
	  var renderedChartData = this.getChartDataForChartSeries(props);
	  this.setState({renderedChartData:renderedChartData});
  },
  componentWillReceiveProps: function(nextProps) {
	  if(nextProps.isRefreshed) {
		  var chartSeries = this.props.chartSeries;
		  var props = {};
		  props = update(props,{$merge:this.props});
		  var renderedChartData = this.getChartDataForChartSeries(props);
		  this.setState({renderedChartData:renderedChartData});
	  }
  },
  render: function() {
	  var renderedChartData = this.state.renderedChartData;
	  if(this.props.showAxes && renderedChartData.axes){
		  return (
				<g transform={renderedChartData.position}>
	    			 {renderedChartData.axes}
	    			 {renderedChartData.series}
	    		</g>	  
		  );
	  }
	  else {
		  return (
				<g transform={renderedChartData.position}>
	    			 {renderedChartData.series}
	    		</g>  
		  
		  );
	  }
  },
  
  getChartDataForChartSeries: function(props) {
	  var chartParam = props.chartParam;
	  var height = props.height;
	  var width = props.width;
	  var maxLength=0;
      var names = props.data.map(function(item) {
      	if(item[chartParam[0]].hasOwnProperty('length') 
      			&& maxLength<item[chartParam[0]].length){
      		maxLength = item[chartParam[0]].length;
      	}
        return item[chartParam[0]];
      });
      width -= maxLength;
      var chartData = {};
      chartData = update(chartData, {$merge:props});
      var addlProps = { data:props.data, chartSeries:props.chartSeries, width: width, height:height, onClick:props.onClick, 
      					showTooltip:props.showTooltip, hideTooltip:props.hideTooltip, labels:names, 
      					dataX:props.chartParam[0], dataY:props.chartParam[1], showAxes:props.showAxes };
      chartData = update(chartData, {$merge:addlProps});
      
      if(ChartUtils.Constants.PieChart === props.chartSeries) {
    	  var pie = d3.pie().padAngle(0.005);
	        var result = props.data.map(function(item){
	          return item[chartParam[1]];
	        });
	        var sum = result.reduce(function(memo, num){ 
	        	return memo + num; 
	        	}, 0);
	        chartData.sum = sum;
	        chartData.seriesData = pie(result);
      }
      
      else if(ChartUtils.scaledSeries.indexOf(props.chartSeries) > -1) {
    	  var scales = this.getScales(chartData, props.chartStyle);
    	  chartData.xScale = scales.xScale;
    	  chartData.yScale = scales.yScale;
      }
      
      var chartFactory = new ChartFactory();
      var chartSeries = chartFactory.getChartSeriesForChartType(chartData);
      return chartSeries;
  },
  
  getScales: function(props, chartStyle) {
	  var xScale = null, yScale = null;
	  var maxScaleVal = d3.max(props.data, function(d) { return d[props.dataY]; });
	  var domainData = props.data.map(function(d) { 
			return d[props.dataX]; 
		});
	  if('vertical' === chartStyle) {
		  xScale = d3.scaleBand()
	    	.domain(domainData)
	    	.range([0, props.width], 0.05);
		  
		  yScale = d3.scaleLinear()
	    	.domain([0, maxScaleVal])
	    	.range([0, props.height]);
	  }
	  else {
  		  xScale = d3.scaleLinear()
  			.range([0, props.width-120])
  			.domain([0, maxScaleVal ]);
  		
  		  yScale = d3.scaleBand()
  			.domain(domainData)
  			.range([props.height, 0], 0.2);
	  }
	  
	  return {xScale:xScale, yScale:yScale};
  }  
  
  
});
module.exports = DataSeries;