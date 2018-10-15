import test from 'ava';
import EventBus from './dist/eventbus.cjs';


test.beforeEach(() => EventBus.events = {});

test('works with a basic use-case', t => {
	let result = 'nope';
	EventBus.on('my-event', () => result = 'yep');
	EventBus.emit('my-event');
	t.is(result, 'yep');
});

test('can remove event handlers', t => {
  let result = 0;
  let handler = function() {
    result++;
  };
  EventBus.on('EXAMPLE_EVENT', handler);
  EventBus.emit('EXAMPLE_EVENT');
  EventBus.off('EXAMPLE_EVENT', handler);
	// Not emitted since event was removed
  EventBus.emit('EXAMPLE_EVENT');
  t.is(result, 1);
});

test('can keep other handlers while removing', t => {
  let result = 0;
  let handler1 = function() {
    result = 1;
  };
  let handler2 = function() {
    result = 2;
  };
  EventBus.on('EXAMPLE_EVENT1', handler1);
  EventBus.on('EXAMPLE_EVENT2', handler2);

  EventBus.off('EXAMPLE_EVENT1', handler1);

  EventBus.emit('EXAMPLE_EVENT2');
  t.is(result, 2);
});


test('can check if handler exists', t => {
	let handler = () => console.log(1);
  EventBus.on('EXAMPLE_EVENT', handler);
  t.true(EventBus.has('EXAMPLE_EVENT', handler));
  t.false(EventBus.has('doesnt_exist', handler));
  t.false(EventBus.has('EXAMPLE_EVENT', () => console.log(1)));
  t.false(EventBus.has('doesnt_exist', () => console.log(1)));
});

test('can check if any handlers exists', t => {
	let handler = () => console.log(1);
  EventBus.on('EXAMPLE_EVENT', handler);
  t.true(EventBus.has('EXAMPLE_EVENT'));
  t.false(EventBus.has('doesnt_exist'));
});

test('can emit a debug string', t => {
  EventBus.on('EXAMPLE_EVENT', () => console.log(1));
  EventBus.on('EXAMPLE_EVENT', () => console.log(1), new class Foo {});
  t.is(EventBus.debug(), `Anonymous listening for "EXAMPLE_EVENT"\nFoo listening for "EXAMPLE_EVENT"\n`);
});