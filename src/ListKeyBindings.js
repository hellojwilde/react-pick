const KEY_ARROW_DOWN = 40;
const KEY_ARROW_UP = 38;
const KEY_RETURN = 13;
const KEY_ESC = 27;

function ensureCompletionPossible(fun) {
  return function(props) {
    if (props.optionsLength > 0) {
      return fun(props);
    }
  }
}

/**
 * We use ListKeyBindings to represent the keyDown event behavior for
 * components related to the <List> component in `react-pick`.
 *
 * There's a few key properties that we expect to find in `props`:
 *
 *    - `onChange`
 *    - `onComplete`
 *    - `onCancel`
 *    - `optionIndex`
 *    - `optionsLength`
 */
const ListKeyBindings = {
  getKeyBindings: function(props) {
    return {
      [KEY_ARROW_DOWN]: this.changeToNext,
      [KEY_ARROW_UP]: this.changeToPrevious,
      [KEY_RETURN]: this.complete,
      [KEY_ESC]: props.onCancel
    };
  },

  complete: ensureCompletionPossible(function(props) {
    props.onComplete(props.optionIndex)
  }),

  changeToNext: ensureCompletionPossible(function(props) {
    props.onChange(
      (props.optionIndex === null) 
        ? 0 
        : Math.min(props.optionIndex + 1, props.optionsLength - 1)
    );
  }),

  changeToPrevious: ensureCompletionPossible(function(props) {
    props.onChange(
      (props.optionIndex === null) 
        ? props.optionsLength - 1
        : Math.max(0, props.optionIndex - 1)
    );
  }),

  handleKeyDown: function(props, event) {
    const binding = this.getKeyBindings(props)[event.keyCode];

    if (binding) {
      event.preventDefault();
      binding(props);
    }
  }
};

module.exports = ListKeyBindings;