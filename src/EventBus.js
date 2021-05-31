export class EventBus {
    constructor (description = "") {
        this.description = description;

        this.eventHandler = new Map();
    }

    on (eventName, callback, scope) {
        if (!this.has(eventName, callback, scope)) {
            const key = {
                eventName,
                callback,
                scope,
            };

            const value = {
                once: false,
                eventName,
            };

            this.eventHandler.set(key, value);
        }
    }

    _getKey (searchKey) {
        return Array.from(this.eventHandler.keys()).find((key) => {
            return searchKey.eventName === key.eventName
            && searchKey.callback === key.callback
            && searchKey.scope === key.scope;
        });
    }

    once (eventName, callback, scope) {
        if (!this.has(eventName, callback, scope)) {
            const key = {
                eventName,
                callback,
                scope,
            };

            const value = {
                once: true,
                eventName,
            };

            this.eventHandler.set(key, value);
        }
    }

    has (eventName, callback, scope) {
        const key = {
            eventName,
            callback,
            scope,
        };
        return !!this._getKey(key);
    }

    off (eventName, callback, scope) {
        const searchKey = {
            eventName,
            callback,
            scope,
        };

        const key = this._getKey(searchKey);
        this.eventHandler.delete(key);
    }

    emit (eventName, ...args) {
        this.eventHandler.forEach((value, key, map) => {
            if (value.eventName !== eventName) {
                return;
            }

            const boundHandler = key.scope ? key.callback.bind(key.scope) : key.callback;

            if (value.once) {
                map.delete(key);
            }

            try {
                boundHandler(...args);
            } catch (err) {
                console.error(err);
            }
        });
    }
}
