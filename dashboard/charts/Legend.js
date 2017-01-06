var React = require('react');
var Legend = React.createClass({

  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    colors: React.PropTypes.array.isRequired,
    data: React.PropTypes.array.isRequired,
  },

  render: function() {
	var props = this.props;
    var color = props.colors;
    var data = props.data;
    var displayProperty = props.displayProperty;
    var elements = data.map(function(item, i){
      return (
        <LegendElement color={color} xpos={props.width/3} ypos={i*20} data={item[displayProperty]} key={i} ikey={i} />
      )
    })

    return(
        <svg className="legend" width={props.width} height={props.height}>
	        {elements}
        </svg>
    );
  }
});



var LegendElement = React.createClass({
  render: function() {
    var position =  "translate(" + this.props.xpos + "," + this.props.ypos + ")";
    return (
      <g transform={position}>
        <rect width="10" height="10" fill={this.props.color[this.props.ikey]}></rect>
        <text x="22" y="9" dy=".35em">{this.props.data}</text>
      </g>
    );
  }
});
module.exports = Legend;