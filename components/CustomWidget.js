var React = require('react');
var isArray = require('lodash/fp/isArray');
var isEmpty = require('lodash/fp/isEmpty');
var forEach = require('lodash/forEach');
var forOwn = require('lodash/forEach');
var groupBy = require('lodash/groupBy');
var ScrollableList = require('./ScrollableList');
var update = require('react-addons-update');
var CustomWidget = React.createClass({
	  displayName: "CustomWidget",
	  getInitialState: function() {
	    return {loading: true};
	  },

	  componentDidMount: function () {},

	  componentDidUpdate: function () {},
	  
	  componentWillReceiveProps: function(nextProps) {
		  if(nextProps.data.widgetData && nextProps.data.widgetData.length > 0){
			  this.setState({loading: false});
		  }
	  },
		  	
	  onClick: function (selected, data) {
	    if (selected /*&& (selected.row || selected.row == 0)*/) {
	    	var selectedItem = {};
	    	var chartParam = this.props.widget.chartParam;
		  	chartParam = chartParam.replace("{","").replace("}","").split(",");
		  	var finalSelectedRow = selected;
		  	var requestObj = {};
	    	if(finalSelectedRow){
	    		var requestParam = this.props.widget.requestParam;
	    		requestParam = requestParam.replace("{","").replace("}","").split(",");
	    		for(var req=0; req<requestParam.length; req++){
	    			requestObj[requestParam[req]] = finalSelectedRow[requestParam[req]];
	    		}
	    		var params = Object.keys(this.props.widget.params);
	    		for(var p=0;p<params.length;p++){
	    			requestObj[params[p]]= this.props.widget.params[params[p]];
	    		}
	    	}
	    	requestObj['additionalFilterParams'] = requestParam.join(",");
	    	this.props.onClick(requestObj);
	    }
	  },

	  render: function () {

		if(!this.props.data.widgetData || this.props.data.widgetData.length==0){
			if(this.state.loading) {
				return React.createElement(
				        'div',
				        null,
				        'Loading...'
				      );
			}
			 return React.createElement(
				        'div',
				        null,
				        'Sorry, failed to fetch data from server'
				      );
		}
	    return this.getComponent(this.props.widget.component);
	  },
	  
	  getComponent: function (name) {
		  //var colors = ['#FD9827', '#DA3B21', '#3669C9', '#1D9524', '#971497'];
		  var component = null;
		  if(!this.state.loading && (!this.props.data.widgetData[0] || this.props.data.widgetData[0].length ==0) ){
			  return React.createElement(
				        'div',
				        null,
				        'No data found'
				      );
		  }
		  var componentProps = this.prepareDataForChart(this.props.data.widgetData[0], name);
		  var gc_data = componentProps.data;
		  var gc_options = componentProps.options;
		  switch(name) {
		  	case 'PieChart': 
		  	case 'BarChart':
		  		/*return (
		  		<div>
		        <GoogleChart data={gc_data} options={gc_options} chartFunction={name} onClick={this.onClick} loading={this.state.loading} ></GoogleChart>
		        </div>
		        );*/
		  		return (
	  				<div>
	  					<DashboardChart data={gc_data} options={gc_options} height={this.props.height} width ={this.props.width} chartSeries={name} onClick={this.onClick} 
	  						loading={this.state.loading} chartParam={componentProps.chartParam} showAxis={true} chartStyle={'horizontal'} isRefreshed={this.props.isRefreshed}>
	  					</DashboardChart>
			        </div>	
		  		);
		  	case 'BuddyChart':
		  		var itemsList = [];
		  		var groupedList = {};
		  		var list = forEach(gc_data, function(row) {
		  			if(!row.alertType) {
		  				itemsList.push(row);
		  			}
		  			else {
		  				if(!groupedList.hasOwnProperty(row.alertType)){
		  					groupedList[row.alertType]=[];
		  				}
		  				groupedList[row.alertType].push(row);
		  			}
		  		});
		  		
		  		if(itemsList.length == 0){
		  			forOwn(groupedList, function(value, key){
		  			   itemsList.push({content:key, type:'header'});
		  			   Array.prototype.push.apply(itemsList, value);
		  			});
		  		}
		  		
		  		return (
		  				<ScrollableList listItems={itemsList} heightOfItem={40} maxItemsToRender={20} />
		  		);
		  	default :
		  		return ( 
		  				<div>Sorry there is no Widget Configured for this type</div>	
		  		);
		  }
		  return component;
	  },
	  
	  prepareDataForChart :function( data, component ) {
		  var chartParam = this.props.widget.chartParam;
	  	  chartParam = chartParam.replace("{","").replace("}","").split(",");
	  	  var gc_data = [];//new google.visualization.DataTable();
		  switch(component) {
			  case 'PieChart': 
				var tempData = [];
				tempData = update(tempData,{$push:data});
				var mgr = this.props.widget.name.indexOf('MANAGER');
				if(mgr<0){
					//To be read from chartParam
					//gc_data.push(["Days Till SLA", "Request Count"]);
					for(var i=0; i<tempData.length; i++){
						var dataTable = tempData[i];
						var rowData = [];
						for(var j=0;j<chartParam.length;j++){
							var value = null;
							if(dataTable.hasOwnProperty(chartParam[j])){
								value = dataTable[chartParam[j]];
							}
							if( value){
								if(isNaN(value) ||(!isNaN(value)&& value/1>=0)){
									rowData.push(value);
								}
							}
						}
						//gc_data.push(rowData);
						gc_data.push(dataTable);
					}
				}else{
					//To be read from chartParam
					//gc_data.push(["Analyst", "Request Count"]);
					for(var i=0;i<tempData.length;i++)
					{
						var dataTable = tempData[i];
						var rowData = [];
						for(var j=0;j<chartParam.length;j++){
							var value = null;
							if(dataTable.hasOwnProperty(chartParam[j])){
								value = dataTable[chartParam[j]];
							}
							if( value){
								rowData.push(value);
							}
						}
						//gc_data.addRow(rowData);
					}
					//gc_data.push(rowData);
					gc_data.push(dataTable);
				}
			    var gc_options = {
			            "chartArea": {
				              "left": "10%",
				              "top": "10%",
				              "height": "100%",
				              "width": "90%"
				            }
				    };
			    return {data :gc_data,options:gc_options , chartParam: chartParam}
			  case 'BarChart':
				var tempData = [];
				tempData = update(tempData,{$push:data});
			  	//gc_data.push(["Last Event", "Request Count"]);
				for(var i=0;i<tempData.length;i++)
				{
					var dataTable = tempData[i];
					var rowData = [];
					for(var j=0;j<chartParam.length;j++){
						var value = null;
						if(dataTable.hasOwnProperty(chartParam[j])){
							value = dataTable[chartParam[j]];
						}
						if( value){
							rowData.push(value);
						}
					}
					//gc_data.push(rowData);
					gc_data.push(dataTable);
				}
			    
			    var gc_options ={
			      "colors": ["#9575cd", "#33ac71"],
			      "hAxis": {
			        "title": "Request Count"
			      },
			      legend: { position: 'none' },
			      "animation": {
			        "duration": 1000,
			        "easing": "out",
			        "startup": true
			      }
			    };
			    return {data :gc_data,options:gc_options, chartParam: chartParam};
			  case 'BuddyChart':
		  		var buddyContentData = [];
		  		var tempData = [];
				tempData = update(tempData,{$push:data});
				for(var i=0;i<tempData.length;i++){
					var dataTable = tempData[i];
					var rowData = [];
					var buddyContentRow = "";
					for(var j=0;j<chartParam.length;j++){
						var value = null;
						if(dataTable.hasOwnProperty(chartParam[j])){
							if(chartParam[j]=='alertType'){
								continue ;
							}
							value = dataTable[chartParam[j]];
						}
						if(value){
							buddyContentRow = buddyContentRow+value+" ";
						}
					}
					if(dataTable.hasOwnProperty('alertType') && dataTable.alertType) {
						buddyContentData.push({id:i,content:buddyContentRow, alertType:dataTable['alertType'], type:'data'});
					}
					else {
						buddyContentData.push({id:i,content:buddyContentRow, type:'data'});
					}
				 }
				return {data :buddyContentData,options:null}
		  }
	  }

	});

	CustomWidget.defaultProps = {
	  data: { data: [], options: {} },
	  onClick: undefined
	};
	
	module.exports = CustomWidget;