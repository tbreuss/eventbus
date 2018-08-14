class EventBus {

    constructor() {
        this.events = {};
    }

    on(type, callback, scope, ...args) {
        if (typeof this.events[type] == "undefined") {
            this.events[type] = [];
        }
        this.events[type].push({scope: scope, callback: callback, args: args});
    }

    off(type, callback, scope) {
        if (typeof this.events[type] == "undefined") {
            return;
        }
        let numOfCallbacks = this.events[type].length;
        let newArray = [];
        for (let i = 0; i < numOfCallbacks; i++) {
            let event = this.events[type][i];
            if (event.scope == scope && event.callback == callback) {

            } else {
                newArray.push(event);
            }
        }
        this.events[type] = newArray;
    }

    has(type, callback, scope) {
        if (typeof this.events[type] == "undefined") {
            return false;
        }
        let numOfCallbacks = this.events[type].length;
        if (callback === undefined && scope === undefined) {
            return numOfCallbacks > 0;
        }
        for (let i = 0; i < numOfCallbacks; i++) {
            let event = this.events[type][i];
            if ((scope ? event.scope == scope : true) && event.callback == callback) {
                return true;
            }
        }
        return false;
    }

    emit(type, target, ...args) {
        if (typeof this.events[type] == "undefined") {
            return;
        }
        let bag = {
            type: type,
            target: target
        };
        args = [bag].concat(args);
        let events = this.events[type].slice();
        let numOfCallbacks = events.length;
        for (let i = 0; i < numOfCallbacks; i++) {
            let event = events[i];
            if (event && event.callback) {
                let concatArgs = args.concat(event.args);
                event.callback.apply(event.scope, concatArgs);
            }
        }
    }

    debug() {
        let str = "";
        for (let type in this.events) {
            let numOfCallbacks = this.events[type].length;
            for (let i = 0; i < numOfCallbacks; i++) {
                let event = this.events[type][i];
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

};

export default new EventBus();
