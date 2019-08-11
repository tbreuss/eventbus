# :bus: Simple ES6-ready class for managing events in JavaScript

## Installation

### In a browser

Download this repo and copy `src/eventbus.js` into your project's JavaScript asset folder.
Import the class instance using ES6 module import.

```js
import { global as EventBus } from '/your_js_assets_folder/eventbus.js';
```

You're ready to go.

## API

### EventBus.`on`

```js
// @type - string
// @callback - function
// @scope - the scope where the @callback is defined
// @args - pass additional arguments as you like
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

For debugging purpose only, it returns the added events as a string.

```js
console.log(EventBus.debug());
```

## Usage

```js
function myHandler(event) {
  console.log("myHandler type=" + event.type);
}
EventBus.on("my_event", myHandler);
EventBus.emit("my_event");
```

## Keeping the scope

```js
class TestClass1 {
    constructor() {
        this.className = "TestClass1";
        EventBus.on("callback_event", this.callback, this);
    }
    callback(event) {
        console.log(this.className + " / type: " + event.type + " / dispatcher: " + event.target.className);
    }
}

class TestClass2 {
    constructor() {
        this.className = "TestClass2";
    }
    dispatch() {
        EventBus.emit("callback_event", this);
    }
}

let t1 = new TestClass1();
let t2 = new TestClass2();
t2.dispatch();
```

## Passing additional parameters

```js
class TestClass1 {
    constructor() {
        this.className = "TestClass1";
        EventBus.on("custom_event", this.doSomething, this);
    }
    doSomething(event, param1, param2) {
        console.log(this.className + ".doSomething");
        console.log("type=" + event.type);
        console.log("params=" + param1 + param2);
        console.log("coming from=" + event.target.className);
    }
}

class TestClass2 {
    constructor() {
        this.className = "TestClass2";
    }
    ready() {
        EventBus.emit("custom_event", this, "javascript events", " are really useful");
    }
}

let t1 = new TestClass1();
let t2 = new TestClass2();

t2.ready();
```

## Using EventBus.off

To remove an event handler you have to pass the same callback instance.

This is wrong and won't work because callback functions are different functions.

```js
EventBus.on('EXAMPLE_EVENT', function() {
    console.log('example callback');
});
EventBus.off('EXAMPLE_EVENT', function() {
    console.log('example callback');
});
```

This is correct. Our callback function is the same function.

```js
var handler = function() {
    console.log('example callback');
};
EventBus.on('EXAMPLE_EVENT', handler);
EventBus.emit('EXAMPLE_EVENT');
EventBus.off('EXAMPLE_EVENT', handler);
// Not emitted since event was removed
EventBus.emit('EXAMPLE_EVENT');
```

## Examples

To run the examples you have to start a webserver at the root of this repository.

For example the built in PHP server:

    $ cd eventbus
    $ php -S localhost:9999
    
Now, open <http://localhost:9999/examples/> in your browser.

In the Console of Chrome DevTools you should see a few log entries.
