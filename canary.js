/*!
 * Canary.js logging and debug functions for your backbone.js powered applications
 * Based on RFC 5424 and Seldaek/monolog
 * v0.2.0
 *
 */

var CanaryJS = Backbone.Model.extend({
    defaults: {
        name: 'CanaryJS',
        level: 0,
        console: false,
        numberOfEntries: 0
    },
    
    initialize: function () {
        this.set('logCollection', new CanaryLogCollection());
    },
    
    addEntry: function(msg, context, type, level) {
        if (this.get('level') <= level ) {
            if (context == 'undefined') {
                this.get('logCollection').add([{id: this.get('numberOfEntries'), type: type, msg: msg}]);
                context = '';
            } else {
                this.get('logCollection').add([{id: this.get('numberOfEntries'), type: type, msg: msg, context: context}]);
            }
            if (this.get('console') == true) {
                this.get('logCollection').writeToConsole({id: this.get('numberOfEntries'), stamp: this.get('name'), type: type, msg: msg, context: context}, false);
            }
            this.set('numberOfEntries', this.get('numberOfEntries') + 1);
        }
    },

    debug: function(msg, context) {
        if (typeof context === 'undefined') {
            this.addEntry(msg, 'undefined', 'debug', 100);
        } else {
            this.addEntry(msg, context, 'debug', 100);
        }
    },
    info: function(msg, context) {
        if (typeof context === 'undefined') {
            this.addEntry(msg, 'undefined', 'info', 200);
        } else {
            this.addEntry(msg, context, 'info', 200);
        }
    },
    notice: function(msg, context) {
        if (typeof context === 'undefined') {
            this.addEntry(msg, 'undefined', 'notice', 250);
        } else {
            this.addEntry(msg, context, 'notice', 250);
        }
    },
    warning: function(msg, context) {
        if (typeof context === 'undefined') {
            this.addEntry(msg, 'undefined', 'warning', 300);
        } else {
            this.addEntry(msg, context, 'warning', 300);
        }
    },
    error: function(msg, context) {
        if (typeof context === 'undefined') {
            this.addEntry(msg, 'undefined', 'error', 400);
        } else {
            this.addEntry(msg, context, 'error', 400);
        }
    },
    critical: function(msg, context) {
        if (typeof context === 'undefined') {
            this.addEntry(msg, 'undefined', 'critical', 500);
        } else {
            this.addEntry(msg, context, 'critical', 500);
        }
    },

    export: function() {
        return JSON.stringify(this.get('logCollection'));
    },
    
    getEntry: function(id) {
        var entry = this.get('logCollection').get(id);
        if (typeof entry === 'undefined'){
            return entry;
        }
        return {id: entry.get('id'), type: entry.get('type'), msg: entry.get('msg'), context: entry.get('context')};
    },

    getLastEntry: function() {
        var entry = this.get('logCollection').get(this.get('numberOfEntries') - 1);
        if (typeof entry === 'undefined'){
            return entry;
        }
        return {id: entry.get('id'), type: entry.get('type'), msg: entry.get('msg'), context: entry.get('context')};
    },

    dump: function( msg ) {
        if (typeof msg === 'undefined') {
            console.group(this.get('name'));
        } else {
            console.group(msg);
        }
        
        this.get('logCollection').walk( false );
        console.groupEnd();
        return '/dump';
    },

    flush: function( msg ) {
        if (typeof msg === 'undefined') {
            console.group(this.get('name'));
        } else {
            console.group(msg);
        }
        this.get('logCollection').walk( true );
        console.groupEnd();
        this.set('numberOfEntries', 0);
        return '/flush';
    },

    reset: function() {
        this.set('numberOfEntries', 0);
        this.get('logCollection').reset();
        return true;
    }
});

var CanaryFactoryCollection = Backbone.Collection.extend({
    model: CanaryJS,
    
    create: function(params) {
        this.add([params]);
    },
    output: function(flush) {
        this.map(function(CanaryJS) {
            var logCollection = CanaryJS.get('logCollection');
            console.group(CanaryJS.get('name'));
            logCollection.walk(flush);
            console.groupEnd();
        });
    }
});

var CanaryFactory = Backbone.Model.extend({
    defaults: {
        id: 1,
        collection: new CanaryFactoryCollection(),
        producedModels: 0
    },

    create: function(mixed) {
        var modelNumber = this.get('producedModels') + 1;
        this.set('producedModels', modelNumber);

        switch (typeof mixed) {
            case 'string':
                this.get('collection').create({id: modelNumber, name: mixed});
            break;
            case 'object':
                mixed['id'] = modelNumber;
                this.get('collection').create(mixed);
            break;
            case 'undefined':
                this.get('collection').create({id: modelNumber});
            break;
        }

        return this.get('collection').get(modelNumber);
    },
    dump: function() {
        this.get('collection').output(false);
        return '/dump';
    },
    flush: function() {
        this.get('collection').output(true);
        return '/flush';
    },
    export: function() {
        return JSON.stringify(this.get('collection'));
    }
});

var CanaryLogEntry = Backbone.Model.extend({
    defaults: {
        id: 0,
        type: 'unknown',
        msg: '',
        context: ''
    }
});

var CanaryLogCollection = Backbone.Collection.extend({
    
    model: CanaryLogEntry,

    walk: function( flush ) {
        var delEntry = [];
        var scope = this;
        this.map(function(CanaryLogEntry) {
            var id = CanaryLogEntry.get('id');
            var type = CanaryLogEntry.get('type');
            var msg = CanaryLogEntry.get('msg');
            var context = CanaryLogEntry.get('context');
            scope.writeToConsole({id: id, type: type, msg: msg, context: context}, true);
            delEntry.push(id);
        });

        if ( flush == true) {
            for (var i = 0; i < delEntry.length; i++) {
                this.remove(delEntry[i]);
            }
        }
    },

    writeToConsole: function(params, raw) {

        if (raw == true) {
            var meta = '';
        } else {
            var meta = params.stamp +'['+params.id+'] ';
        }

        switch (params.type) {
            case 'debug':
                console.debug(meta + params.msg, params.context);
            break;
            case 'info':
            case 'notice':
                console.info(meta + params.msg, params.context);
            break;
            case 'warning':
                console.warn(meta + params.msg, params.context);
            break;
            case 'error':
            case 'critical':
                console.error(meta + params.msg, params.context);
            break;
        }
    }
});

window.CanaryFactory = new CanaryFactory();
