require("../stylesheets/styles.css");
var React = require('react');
var PropTypes = require('react').PropTypes;
var ScrollableList =  React.createClass({
  propTypes: {
    listItems: PropTypes.array.isRequired,
    heightOfItem: PropTypes.number,
    maxItemsToRender: PropTypes.number
  },
  getInitialState() {
    return {
      scrollPosition: 0
    };
  },
  componentDidMount() {
    this.refs.list.addEventListener('scroll', this.updateScrollPosition);
  },
  componentWillUnmount() {
    this.refs.list.removeEventListener('scroll', this.updateScrollPosition);
  },
  updateScrollPosition() {
    const newScrollPosition = this.refs.list.scrollTop / this.props.heightOfItem;
    const difference = Math.abs(this.state.scrollPosition - newScrollPosition);

    if (difference >= this.props.maxItemsToRender / 5) {
      this.setState({ scrollPosition: newScrollPosition });
    }
  },
  getListItems(startPosition, endPosition) {
	  var listItems = this.props.listItems.slice(startPosition, endPosition).map( function(item, index) {
				  if(item.type == 'header'){
					 return <div key={index} className='react-scrollable-list-item-header' style={{'fontWeight': 'bold'}}>{item.content}</div>;
				  }
				  else {
					  var className = 'react-scrollable-list-item';
					  if(index % 2 == 0){
					        className='react-scrollable-list-item-alt';
					  }
					return <div key={index} className={className}>{item.content}</div>
				  }
	  		});
	  return listItems;     
  },
  render() {
    const startPosition =
      this.state.scrollPosition - this.props.maxItemsToRender > 0
      ? this.state.scrollPosition - this.props.maxItemsToRender
      : 0;

    const endPosition =
      this.state.scrollPosition + this.props.maxItemsToRender >= this.props.listItems.length
      ? this.props.listItems.length
      : this.state.scrollPosition + this.props.maxItemsToRender;
    var listItems = this.getListItems(startPosition, endPosition);
    return (
    		<div className='react-scrollable-list' ref='list'>
      <div style={{
        height: startPosition * this.props.heightOfItem
      }}></div>
      {listItems}
      <div style={{
        height: this.props.listItems.length * this.props.heightOfItem -
          endPosition * this.props.heightOfItem
      }}></div>
    </div>
    );
  }
});

ScrollableList.defaultProps = {
    listItems: [],
    heightOfItem: 30,
    maxItemsToRender: 50
 };

module.exports = ScrollableList;