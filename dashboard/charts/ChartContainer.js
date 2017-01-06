var React = require('react');
var ChartContainer = React.createClass({
  propTypes: {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    children: React.PropTypes.node,
    type: React.PropTypes.string
  },
  render: function() {
    return (
      <svg id={'dbChartSvg'+this.props.type} width={this.props.width} height={this.props.height} style={{'padding':'10 10 10 10', 'position': 'relative'}}>        
      {this.props.children}</svg>
    );
  }
  
});

module.exports = ChartContainer;