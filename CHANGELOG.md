### v0.5.0 (2015-04-04)

There's no longer use of `cloneWithProps`, which makes the library more predictable in certain use cases.

#### CHANGES

- `ListPopup` and `ListPopupOption` are now `List` and `ListOption`
- `InputPopupWrapper` has been replaced with the much cleaner `InputWithPopup` which does not use `cloneWithProps`
- `ListKeyBindings` no longer uses `cloneWithProps`

#### BUGFIXES

- `Combobox` should be much more resilient to external changes of `value`.

### v0.4.0 (2015-04-04)

- [`c5c619c`](https://github.com/hellojwilde/react-pick/commit/c5c619c) Switch the format of the `value` to something like with a normal `<input>`. Change `onSelect` to `onComplete` to make things more consistent and avoid naming conflicts.

### v0.3.2 (2015-04-03)

#### FEATURES

- [`b5b17e2`](https://github.com/hellojwilde/react-pick/commit/b5b17e2) Make sure that we can swap out the component for the input.

### v0.3.1 (2015-04-03)

We're adding a proper changelog now.

#### BUGFIXES

- [`1c7b164`](https://github.com/hellojwilde/react-pick/commit/1c7b1649a66d92482262abc016309f1e0a401a98) Ensure that properties like placeholder are propagated all the way to the `<input>`

### v0.3.0 (2015-04-03)
 
#### REFACTOR OF AWESOME, ROUND 2

This is a second massive refactoring, with three primary aims: 

- make it easy to reuse the ARIA-compliant popup functionality for other components (this has been pulled into `<InputPopupWrapper>`),  
- make it easy to swap out all of the popup widget functionality (in `<Combobox>`, `renderOption` has been replaced with a `popupComponent` property), and
- generally make `<Combobox>` as simple of a component as possible (in particular, typeahead functionality has been pulled into `<TypeaheadInput>`).

To make it less likely that stuff will break, there's also a very simple test suite based on [Karma](http://karma-runner.github.io/0.12/index.html), and run automatically on [Travis CI](https://travis-ci.org/hellojwilde/react-pick). We'll be expanding the test suite over time.

#### TRANSITION GUIDE

The big points are as follows:

- If you have a `renderOption` property that does anything other than displaying the label of the option, you'll need to create a component to pass as the `<Combobox>`'s' `popupComponent` property. To do this:
    + Create a React component for how you want to render your option; this component must return some sort of element (like a `<div>`) and transfer its own props to that element.
    + Create a React component that wraps `<ListPopup>` passes the option rendering component as `optionComponent` to `<ListPopup>`.
    + Pass the React component wrapping `<ListPopup>` as `popupComponent` to `<Combobox>`
- Change your `getOptionsForInputValue` method to return a promise that resolves with the array of options, instead of calling a callback.

See the [examples]() for a more in-depth idea of how to customize `<Combobox>`.

