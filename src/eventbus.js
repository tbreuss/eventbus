class EventBus {

    constructor() {
        this.events = {};
    }

    on(type, callback, scope, ...args) {
        if (typeof this.events[type] === "undefined") {
            this.events[type] = [];
        }
        this.events[type].push({scope, callback, args});
    }

    off(type, callback, scope) {
        if (typeof this.events[type] === "undefined") {
            return;
        }

        let newArray = [];
        for (const event of this.events[type]) {
            const isSame = event.scope == scope && event.callback == callback;
            if (!isSame) {
                newArray.push(event);
            }
        }

        this.events[type] = newArray;
    }

    has(type, callback, scope) {
        if (typeof this.events[type] === "undefined") {
            return false;
        }

        let numOfCallbacks = this.events[type].length;
        if (callback === undefined && scope === undefined) {
            return numOfCallbacks > 0;
        }

        for (const event of this.events[type]) {
            const scopeIsSame = scope ? event.scope == scope : true;
            const callbackIsSame = event.callback == callback;
            return scopeIsSame && callbackIsSame;
        }

        return false;
    }

    emit(type, target, ...args) {
        if (typeof this.events[type] === "undefined") {
            return;
        }

        let bag = {
            type: type,
            target: target
        };
        
        args = [bag].concat(args);
        const events = this.events[type].slice();

        for (const event of events) {
            if (event && event.callback) {
                const concatArgs = args.concat(event.args);
                event.callback.apply(event.scope, concatArgs);
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

};

export default new EventBus();
