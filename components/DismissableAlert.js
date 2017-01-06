var Alert = require('react-bootstrap').Alert;
var Button = require('react-bootstrap').Button;
var forEach = require('lodash/forEach');
var forOwn = require('lodash/forEach');
var groupBy = require('lodash/groupBy');

const DismissableAlert = React.createClass({
  getInitialState() {
    return {
      alertVisible: true
    };
  },

  componentDidMount: function(){
	this.refreshAlerts(this.props);
  },

  componentWillReceiveProps: function(nextProps) {
    //do not refresh data if no change
	//if(nextProps.showAlerts) {
		this.refreshAlerts(nextProps);
	/*}
	else {
		this.setState({alertVisible: false});
	}*/
  },

  refreshAlerts: function(props) {
	    //alert("ajax");
	  var prepareUrl = this.prepareUrl;
	  var prepareParamsForPost = this.prepareParamsForPost;
	  var getMessagesFromData = this.getMessagesFromData;
	  var alertMessages = [];
	  props.alerts.map(function(alert) {
		  if(alert.ajax == "get"){
			  
		      var url = prepareUrl(alert.params, props.alertsUrl);
		      $.get(url, function(result) {
		    	  
		    	  getMessagesFromData(result.data[0], alert.chartParam);
		    	  
		      }.bind(this), "json" );

		    } else if(alert.ajax == "post"){

		      var url = prepareUrl(alert.params, props.alertsUrl);
		      var params = prepareParamsForPost(alert.params);
		      $.post(url, params, function(result) {
		    	  
		    	  getMessagesFromData(result.widgetData[0], alert.chartParam);
		    	  
		      }.bind(this), "json" );

		    }else{
		      //framework do nothing, get data in your widget
		    }
	  });
  },
  
  prepareUrl: function prepareUrl(params, widgetDataUrl) {
  	return widgetDataUrl;
  },
  
  prepareParamsForPost: function prepareParamsForPost(widgetParams) {
  	var keys = Object.keys(widgetParams);
  	var obj = "{";
  	for(var i=0;i<keys.length;i++){
  		if((i+1) == keys.length ){
  			obj = obj+'"'+keys[i]+'":"'+widgetParams[keys[i]]+'"';
  		}else{
  			obj = obj+'"'+keys[i]+'":"'+widgetParams[keys[i]]+'",';
  		}
  	}
  	obj = obj+"}";
		var params = {'requestVO':obj,'appId':appIdFromServer};
  	return params;
  },
  
  getMessagesFromData: function(data, chParam) {
	  var chartParam = chParam;
  	  chartParam = chartParam.replace("{","").replace("}","").split(",");
	  var itemsList = [];
	  var groupedList = {};
	  var alertData = [];
	  if(data) {
		  for(var i=0;i<data.length;i++) {
			  var dataTable = data[i];
			  var rowData = [];
			  var alertRow = "";
			  for(var j=0;j<chartParam.length;j++){
				  var value = null;
				  if(dataTable.hasOwnProperty(chartParam[j])){
					  if(chartParam[j]=='alertType'){
						  continue ;
					  }
					  value = dataTable[chartParam[j]];
				  }
				  if(value){
					  alertRow = alertRow+value+" ";
				  }
			  }
			  if(dataTable.hasOwnProperty('alertType') && dataTable.alertType) {
				  alertData.push({id:i,content:alertRow, alertType:dataTable['alertType'], type:'data'});
			  }
			  else {
				  alertData.push({id:i,content:alertRow, type:'data'});
			  }
		  }
		  var list = forEach(alertData, function(row) {
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
		  var alertCount = alertData.length;
		  if(itemsList.length == 0){
			  forOwn(groupedList, function(value, key){
				  itemsList.push({content:key, type:'header'});
				  Array.prototype.push.apply(itemsList, value);
			  });
		  }
	  }
		if(itemsList && itemsList.length > 0) {
			this.setState({alertVisible: true, alertMessages:itemsList, alertCount:alertCount});
			this.props.alertFunction({showAlerts:true, alertCount:alertCount, alertVisibilityHandler:this.hideOrShowAlert});
		}
		else {
			this.setState({alertVisible: false});
			this.props.alertFunction({alertShown:false});
		}
  },
  
  handleAlertDismiss: function() {
	this.setState({alertVisible: false});
  },

  handleAlertShow: function() {
    this.setState({alertVisible: true});
  },
  
  hideOrShowAlert: function() {
	    this.setState({alertVisible: !this.state.alertVisible});
  },
  
  render() {
    if (this.state.alertVisible && this.state.alertMessages) {
    	var messages = this.state.alertMessages.map(function(message, index){
    		if(message.type == 'header'){
    			return (
	    			<h4 key={index}>{message.content}</h4>
	    		);
    		}
    		else{
    			return (
	    			<p key={index}>{message.content}</p>
    			);
    		}
    	});
      return (
        <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss} closeLabel="Close" dismissAfter={15000}>
        	{messages}
	        <p>
			  <Button bsStyle="danger" onClick={this.handleAlertDismiss}>Close</Button>
			</p>
        </Alert>
      );
    }

    return (
      <div></div>
    );
  },

});

module.exports = DismissableAlert;