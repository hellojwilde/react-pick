import React from 'react';
var {Combobox, List} = require('../../src');

require('../../src/styles.css');

var debounce = require('es6-promise-debounce')(Promise);

const FLICKR_URL = 
  'http://www.flickr.com/services/feeds/photos_public.gne?jsoncallback=?';

var FlickrInputListOption = React.createClass({

  propTypes: {
    option: React.PropTypes.object
  },

  render: function() {
    var {option, ...otherProps} = this.props;

    return (
      <li {...otherProps}>
        <img src={option.media.m} height="50" />
      </li>
    );
  }

});

var FlickrInputList = React.createClass({

  render: function() {

    return (
      <List 
        {...this.props} 
        optionComponent={FlickrInputListOption}
      />
    );
  }

});

var FlickrInput = React.createClass({

  getOptionsForInputValue: debounce(function(inputValue) {
    return new Promise(function(resolve, reject) {
      $.getJSON(
        FLICKR_URL, 
        {tags: inputValue, format: 'json'},
        (results) => resolve(results.items)
      );
    });
  }, 500),

  render: function() {
    return (
      <Combobox
        {...this.props}
        autocomplete="menu"
        getOptionsForInputValue={this.getOptionsForInputValue}
        getLabelForOption={() => ''}
        listComponent={FlickrInputList}
      />
    );
  }

});

module.exports = FlickrInput;