var TimeoutMixin = {
  componentWillMount: function() {
    this.timeoutIds = [];
  },

  componentWillUnmount: function() {
    this.timeoutIds.forEach((timeoutId) => this.clearTimeout(timeoutId));
  },

  setTimeout: function(func, delay, ...params) {
    if (!this.isMounted()) {
      return;
    }

    var timeoutId = window.setTimeout(func, delay, ...params);
    this.timeoutIds.push(timeoutId);
    return timeoutId;
  },

  clearTimeout: function(timeoutId) {
    if (!this.isMounted()) {
      return;
    }

    window.clearTimeout(timeoutId);
  }
};

module.exports = TimeoutMixin;