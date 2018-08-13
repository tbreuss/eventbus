# Simple ES6-ready class for managing events in JavaScript

## Installation

### In a browser

Download this repo and copy `src/eventbus.js` into your project's JavaScript asset folder.
Import the instance using ES6 module import.

```js
import eventBus from '/your_js_assets_folder/eventbus.js';
```

Your're ready to go.

## API

### EventBus.`on`

```js
// @type - string
// @callback - function
// @scope - the scope where the @callback is defined
// @...args - additiona arguments
EventBus.on(type, callback, scope, ...args)
```

### EventBus.`off`

```js
// @type - string
// @callback - function
// @scope - the scope where the @callback is defined
EventBus.off(type, callback, scope)
```

### EventBus.`has`

```js
// @type - string
// @callback - function
// @scope - the scope where the @callback is defined
EventBus.has(type, callback, scope)
```

### EventBus.`emit`

```js
// @type - string
// @target - the caller
// @args - pass as many arguments as you want
EventBus.emit(type, target, ...args)
```

### EventBus.`debug`

For debugging purpose, it returns the added listeners.

```js
EventBus.debug()
```

## Usage

```js
function myFunction(event) {
  console.log("myFunction type=" + event.type);
}
EventBus.on("my_event", myFunction);
EventBus.emit("my_event");
```

## Keeping the scope

```js
var TestClass1 = function() {
  this.className = "TestClass1";
  this.callback = function(event) {
    console.log(this.className + " = type:" + event.type + " / dispatcher:" + event.target.className);
  }
};
var TestClass2 = function() {
  this.className = "TestClass2";
  this.dispatch = function() {
    EventBus.emit("callback_event", this);
  }
};
var t1 = new TestClass1();
var t2 = new TestClass2();
EventBus.on("callback_event", t1.callback, t1);
t2.dispatch();
```

## Passing additional parameters

```js
var TestClass1 = function() {
  this.className = "TestClass1";
  this.doSomething = function(event, param1, param2) {
    console.log(this.className + ".doSomething");
    console.log("type=" + event.type);
    console.log("params=" + param1 + param2);
    console.log("coming from=" + event.target.className);
  }
};
var TestClass2 = function() {
  this.className = "TestClass2";
  this.ready = function() {
    EventBus.emit("custom_event", this, "javascript events", " are really useful");
  }
};

var t1 = new TestClass1();
var t2 = new TestClass2();

EventBus.on("custom_event", t1.doSomething, t1);
t2.ready();
```

## Example of usage EventBus.off

To remove EventListener you have to pass the same callback instance

```js
/* Wrong - callback functions are different instances */
EventBus.on('EXAMPLE_EVENT', function() {
    console.log('example callback');
});
EventBus.off('EXAMPLE_EVENT', function() {
    console.log('example callback');
});

/* Correct - callback function is the same instance */
var handler = function() {
    console.log('example callback');
};
EventBus.on('EXAMPLE_EVENT', handler);
EventBus.off('EXAMPLE_EVENT', handler);
```
