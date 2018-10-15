class EventBus {

    constructor() {
        this.events = {};
    }

    /**
     * Adds listener to EventBus
     * @param {string} type The name of the event to listen for
     * @param {function} callback Callback to call when event was triggered
     * @param {object} scope The scope in which the callback shall be executed
     * @param  {...any} args Any number of args to be passed to the callback
     */
    on(type, callback, scope, ...args) {
        if (typeof this.events[type] === "undefined") { // Check if there is already event of this type registered
            this.events[type] = []; // If not, create array for it
        }
        this.events[type].push({scope, callback, args}); // Finally push new event to events array
    }

    /**
     * Removes listener from EventBus
     * @param {string} type The name of the event to remove
     * @param {function} callback Callback of the event to remove
     * @param {object} scope The scope of the to be removed event
     */
    off(type, callback, scope) {
        if (typeof this.events[type] === "undefined") { // Check if event of this type exists
            return; // If not just return
        }

        let newArray = []; // Array that will contain all events except the one removed
        for (const event of this.events[type]) { // Iterate all events of the specified type
            // Check if the event of the current iteration and the passed one are equal
            const isSame = event.scope == scope && event.callback == callback;
            if (!isSame) { // If they are not the same...
                newArray.push(event); // ...push the current event to the newArray
            }
        }

        this.events[type] = newArray; // Reset the events array with all events except the removed one
    }

    /**
     * Checks if the passed event is registered in the EventBus
     * @param {string} type Type of the to be checked event
     * @param {callback} callback Callback of the to be checked event
     * @param {object} scope Scope of the to be checked event
     */
    has(type, callback, scope) {
        if (typeof this.events[type] === "undefined") { // Check if the passed type even exists
            return false; // If not, quit method
        }

        // If callback and scope are undefined then every registered event is match, thus any event of the type matches
        let numOfCallbacks = this.events[type].length;
        if (callback === undefined && scope === undefined) { // If scope and callback are not defined
            return numOfCallbacks > 0; // If there are any callbacks we can be sure it matches the passed one
        }

        for (const event of this.events[type]) { // Iterate all events of the passed type
            const scopeIsSame = scope ? event.scope == scope : true; // Check if scope is equal to the one passed
            const callbackIsSame = event.callback == callback; // Check if callback is equal to the one passed
            if (scopeIsSame && callbackIsSame) { // Check if current event and passed event are equal
                return true; // If so, break loop and return true
            }
        }

        return false; // If there aren't any events it cannot match
    }

    /**
     * Emits an event on the EventBus
     * @param {string} type Type of event to emit
     * @param {object} target The caller 
     * @param {...any} args Any number of args to be passed to the callback
     */
    emit(type, target, ...args) {
        if (typeof this.events[type] === "undefined") { // Check if any event of the passed type exists
            return; // If not, quit method
        }

        let bag = {
            type: type,
            target: target
        };
        
        args = [bag].concat(args); // Merge arrays
        const events = this.events[type].slice(); // Little hack to clone array

        for (const event of events) { // Iterate all events
            if (event && event.callback) { // Check if callback of event is set 
                const concatArgs = args.concat(event.args); // Add args that were passed
                event.callback.apply(event.scope, concatArgs); // Call callback
            }
        }
    }

    debug() {
        let str = "";
        for (const type in this.events) {
            for (const event of this.events[type]) {
                let className = "Anonymous";
                if (event.scope) {
                    if (event.scope.constructor.name) {
                        className = event.scope.constructor.name;
                    }
                }
                str += `${className} listening for "${type}"\n`;
            }
        }
        return str;
    }

}
var eventbus = new EventBus();

export default eventbus;
