require("../stylesheets/styles.css");
var React = require('react');
var CustomWidget = require('./CustomWidget');
var Modal = require('react-bootstrap').Modal;

var DashboardWidget = React.createClass({
	  displayName: "DashboardWidget",
	  statics: {
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
			}
	  },
	  
	  showModalWindow(data){
		  var drilldownValue = data.drilldownValue;
		  var modalHeader = "Requests";
		  var modalPropsObj = {showModal:true, modalData:data.data, loading: true, componentList:data.componentList };
		  if(drilldownValue.drilldownProps){
			  var modalWindowProps = drilldownValue.drilldownProps;
			  modalWindowProps = modalWindowProps.replace("{","").replace("}","").split(",");
			  modalWindowProps.map(function(row){
				  var key = row.split('::')[0];
				  var value = row.split('::')[1];
				  if(value.indexOf('$')!=-1){
					  var d = value.split(''), propArray = [];
					  for(var ch=0; ch < d.length; ch++) {
						  if(d[ch] == '['){
							  var prop='', l=ch+2;
							  for(; l< d.length; l++){
								  if(d[l]==']') break;
								  prop+=d[l];
							  }
							  if(prop!=='' && drilldownValue.hasOwnProperty(prop)){
								  var replace = value.substr(ch, l+1-ch);
								  propArray.push({prop:replace,replaceStr:drilldownValue[prop]});
							  }
							  else {
								  
							  }
						  }
					  }
					  for(var p=0; p < propArray.length; p++) {
						  value = value.replace(propArray[p].prop, propArray[p].replaceStr);
					  }
				  }
				  modalPropsObj[key] = value;
			  });
		  }
		  this.setState(modalPropsObj); 
	  },
	  
	  popupComponentClick(requestObj) {
		  this.setState({showModal:false});
		  this.props.onClick(requestObj);
	  },
	  
	  closeModal:function(){
		  this.setState({showModal:false});
	  },
	  getInitialState: function(){
		    return {showModal:false};
	  },
	  
	  componentDidMount: function () {
	  },

	  componentDidUpdate: function () {},
	  
	  componentWillReceiveProps: function(nextProps) {
		  
	  },
		  	
	  onClick: function (requestObj) {
	    this.props.onClick(requestObj, this.showModalWindow);
	  },

	  render: function () {

		  var data = null;
          var loading = null;
          var body = null;
          if(this.state.showModal){
        	  data = this.state.modalData;
        	  loading = this.state.loading;
        	  var popupCompClick = this.popupComponentClick;
        	  body = this.state.componentList.map( function(comp, index){
        		  return (<CustomWidget key={index} widget={comp} data={data} loading = {loading} onClick={popupCompClick} height={window.innerHeight/4} width={window.innerWidth/3}></CustomWidget>);
        	  });
          }
          if(this.props.widget.drilldown){
        	 return (
     			   <div>
	   			      <CustomWidget widget={this.props.widget} onClick={this.onClick} loading = {this.state.loading} widgetDataUrl = {this.props.widgetDataUrl}
	   	                height = {this.props.height} width={this.props.width} data = {this.props.data} isRefreshed={this.props.isRefreshed}> </CustomWidget>
	
	   			      <Modal show={this.state.showModal} onHide={this.closeModal} backdrop={"static"} enforceFocus={true} autoFocus={true}>
	   			        <Modal.Header closeButton>
	   			          <Modal.Title>{this.state.title}</Modal.Title>
	   			        </Modal.Header>
	   			        <Modal.Body>
	   			          <div style={{position: "relative",height:window.innerHeight/4}}>
	   			           {body}
	   			          </div>
	   			        </Modal.Body>
	   			        <Modal.Footer>
	   			          <button className="btn btn-default" onClick={this.closeModal}>Close</button>
	   			        </Modal.Footer>
	   			      </Modal>
   			      </div>
   			  );
          }
		  return (
			      <CustomWidget ref = 'dbCustWidget' widget={this.props.widget} onClick={this.onClick} loading = {this.state.loading} widgetDataUrl = {this.props.widgetDataUrl}
	                height = {this.props.height} width={this.props.width} data = {this.props.data} isRefreshed={this.props.isRefreshed}> </CustomWidget>
			  );
	  },
	  
	});

	DashboardWidget.defaultProps = {
	  data: { data: [], options: {} },
	  onClick: undefined
	};
	
	module.exports = DashboardWidget;