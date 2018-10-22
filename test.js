import test from 'ava';
import { EventBus } from './dist/eventbus.cjs';



test.beforeEach(t => {
    t.context = {bus: new EventBus()};
});

test('works with a basic use-case', t => {
	let result = 'nope';
	t.context.bus.on('my-event', () => result = 'yep');
	t.context.bus.emit('my-event');
	t.is(result, 'yep');
});

test('can remove event handlers', t => {
  let result = 0;
  let handler = function() {
    result++;
  };
  t.context.bus.on('EXAMPLE_EVENT', handler);
  t.context.bus.emit('EXAMPLE_EVENT');
  t.context.bus.off('EXAMPLE_EVENT', handler);
	// Not emitted since event was removed
  t.context.bus.emit('EXAMPLE_EVENT');
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
  t.context.bus.on('EXAMPLE_EVENT1', handler1);
  t.context.bus.on('EXAMPLE_EVENT2', handler2);

  t.context.bus.off('EXAMPLE_EVENT1', handler1);

  t.context.bus.emit('EXAMPLE_EVENT2');
  t.is(result, 2);
});


test('can check if handler exists', t => {
	let handler = () => console.log(1);
  t.context.bus.on('EXAMPLE_EVENT', handler);
  t.true(t.context.bus.has('EXAMPLE_EVENT', handler));
  t.false(t.context.bus.has('doesnt_exist', handler));
  t.false(t.context.bus.has('EXAMPLE_EVENT', () => console.log(1)));
  t.false(t.context.bus.has('doesnt_exist', () => console.log(1)));
});

test('can check if any handlers exists', t => {
	let handler = () => console.log(1);
  t.context.bus.on('EXAMPLE_EVENT', handler);
  t.true(t.context.bus.has('EXAMPLE_EVENT'));
  t.false(t.context.bus.has('doesnt_exist'));
});

test('can emit a debug string', t => {
  t.context.bus.on('EXAMPLE_EVENT', () => console.log(1));
  t.context.bus.on('EXAMPLE_EVENT', () => console.log(1), new class Foo {});
  t.is(t.context.bus.debug(), `Anonymous listening for "EXAMPLE_EVENT"\nFoo listening for "EXAMPLE_EVENT"\n`);
});
