var React = require('react');
var {Combobox} = require('../../src');

require('../../src/styles.css');

var throttle = require('./throttle');

const FLICKR_URL = 
  'http://www.flickr.com/services/feeds/photos_public.gne?jsoncallback=?';

var FlickrInput = React.createClass({

  getOptionsForInput: throttle(500, function(inputValue, callback) {
    $.getJSON(
      FLICKR_URL, 
      {tags: inputValue, format: 'json'},
      (results) => callback(results.items)
    );
  }),

  getLabelForOption: function(option) {
    return '';
  },

  renderOption: function(option) {
    return <img src={option.media.m} height="50" />;
  },

  render: function() {
    return (
      <Combobox
        {...this.props}
        autocomplete="list"
        getOptionsForInput={this.getOptionsForInput}
        getLabelForOption={this.getLabelForOption}
        renderOption={this.renderOption}
      />
    );
  }

});

module.exports = FlickrInput;