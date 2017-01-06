require("../../stylesheets/styles.css");
var Bar = require('./Bar');
var Sector = require('./Sector');
var Sector = require('./Sector');
var Bar = require('./Bar');
var Axis = require('./Axis');
var ChartUtils = require('./ChartUtils');
var ChartFactory = function() {
	this.getChartSeriesForChartType = function (props) {
		var renderedChartData = {};
		switch(props.chartSeries) {
		    case ChartUtils.Constants.PieChart:
		    	var position = "translate(" + (props.width/2) + "," + (props.height/2) + ")";
		    	renderedChartData.position = position;
		    	renderedChartData.series = getSectorsForPieChart(props);
		    	break;
		    case ChartUtils.Constants.BarChart:
		    	var position = "translate(" + 120 + ",0)";
		    	renderedChartData.position = position;
		    	props.barColor = ChartUtils.randomColor();
		    	renderedChartData.series = getBarsForBarchart(props.chartStyle, props);
		    	if(props.showAxes) {
					var axes = renderAxes(props);
					renderedChartData.axes = axes;
				}
		    	break;
	  }
	  return renderedChartData;
	}
};
var getBarsForBarchart = function (chartStyle, props) {
	  var bars = null;
	  if('vertical' === chartStyle) {
		  bars = props.data.map(function(point, i) {
			  return (
					  <Bar height ={props.yScale(point[props.dataY])} width={props.xScale.bandwidth()/2} name={props.labels[i]} 
					  x={props.xScale(point[props.dataX])} y={props.height - props.yScale(point[props.dataY])} textX={props.xScale(point[props.dataX]) + props.xScale.bandwidth() / 2} 
					  textY={props.height - props.yScale(point[props.dataY]) + 14} key={i} text={point[props.dataY]}/>
			  )
		  });
	  }
	  else {
		  bars = props.data.map(function(point, i) {
			  return (
					  <Bar height ={props.yScale.bandwidth()/1.5} width={props.xScale(point[props.dataY])} name={props.labels[i]} x={props.height - props.yScale(point[props.dataX])} y={props.xScale(point[props.dataY])} 
					  key={i} translate={"translate(0," + props.yScale(point[props.dataX]) + ")"} textX={props.xScale(point[props.dataY]) - 20} textY={props.yScale.bandwidth()/1.7}
					  text={point[props.dataY]} translate={"translate(0," + props.yScale(point[props.dataX]) + ")"} fillColor = {props.barColor} barData={point} onClick={props.onClick}
					  showTooltip={props.showTooltip} hideTooltip={props.hideTooltip} name={point[props.dataX]} ></Bar>
			  )
		  });
	  }
	  
	  return bars;
};

var getSectorsForPieChart = function (props) {
	
	var sectors = null;
	if(props.seriesData) {
		sectors = props.seriesData.map(function(point, i) {
			var sectorColor =  ChartUtils.randomColor();
			return (
					<Sector data={point} ikey={i} key={i} name={props.labels[i]} fill={sectorColor} total= {props.sum} width={props.width/2} height={props.height} onClick={props.onClick} 
					sectorData={props.data[i]} showTooltip={props.showTooltip} hideTooltip={props.hideTooltip}>
					</Sector>
			);
		});
	}
	
	return sectors;
	
};

var renderAxes = function (props) {
	var dataFunction = props.data.map( function(row) {
  		return row[props.dataY];
  	});
	 return( 
			 <g>
				 <Axis orient={'left'} scale={props.yScale} translate={"translate(0,0)"} tickFormat={tickFormat} height={props.height} width={props.width} ticks={props.data.length}/>
				 <Axis orient={'bottom'} scale={props.xScale} ticks={getNumTicks(props.width, props.data.length)} translate={"translate(0," + props.height + ")"} height={props.height} 
				 		width={props.width} ticks={props.data.length} tickFormat={tickFormat} tickValues={dataFunction}/>
			 </g>
	  );
};

var tickFormat= function(text) {
	  var ret = text;
	  if(isNaN(text) && text.indexOf(" ")){
		  var words = text.split(" ");
		  ret = words.join(" \n");
	   }
	   else if(!isNaN(text)){
		  ret = text.toFixed();
	   }
		return ret;
};

var getNumTicks = function (width){
	  if (width <= 400) {
		 return 4;
	  }
	  else{
		 return 10;
	  }
};

module.exports = ChartFactory;
	
		
		
