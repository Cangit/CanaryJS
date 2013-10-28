/*!
 * Canary.js debug functions for your backbone.js powered applications
 * Based on RFC 5424 and Seldaek/monolog
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
        this.set('debugCollection', new CanaryDebugCollection());
    },
    
    addEntry: function(msg, obj, type, level) {
        if (this.get('level') <= level ) {
            if (obj == 'undefined') {
                this.get('debugCollection').add([{id: this.get('numberOfEntries'), type: type, msg: msg}]);
                obj = '';
            } else {
                this.get('debugCollection').add([{id: this.get('numberOfEntries'), type: type, msg: msg, obj: obj}]);
            }
            if (this.get('console') == true) {
                this.get('debugCollection').writeToConsole({id: this.get('numberOfEntries'), stamp: this.get('name'), type: type, msg: msg, obj: obj}, false);
            }
            this.set('numberOfEntries', this.get('numberOfEntries') + 1);
        }
    },

    debug: function(msg, obj) {
        if (typeof obj === 'undefined') {
            this.addEntry(msg, 'undefined', 'debug', 100);
        } else {
            this.addEntry(msg, obj, 'debug', 100);
        }
    },
    info: function(msg, obj) {
        if (typeof obj === 'undefined') {
            this.addEntry(msg, 'undefined', 'info', 200);
        } else {
            this.addEntry(msg, obj, 'info', 200);
        }
    },
    notice: function(msg, obj) {
        if (typeof obj === 'undefined') {
            this.addEntry(msg, 'undefined', 'notice', 250);
        } else {
            this.addEntry(msg, obj, 'notice', 250);
        }
    },
    warning: function(msg, obj) {
        if (typeof obj === 'undefined') {
            this.addEntry(msg, 'undefined', 'warning', 300);
        } else {
            this.addEntry(msg, obj, 'warning', 300);
        }
    },
    error: function(msg, obj) {
        if (typeof obj === 'undefined') {
            this.addEntry(msg, 'undefined', 'error', 400);
        } else {
            this.addEntry(msg, obj, 'error', 400);
        }
    },
    critical: function(msg, obj) {
        if (typeof obj === 'undefined') {
            this.addEntry(msg, 'undefined', 'critical', 500);
        } else {
            this.addEntry(msg, obj, 'critical', 500);
        }
    },
    
    getEntry: function(id) {
        var entry = this.get('debugCollection').get(id);
        return {id: entry.get('id'), type: entry.get('type'), msg: entry.get('msg'), obj: entry.get('obj')};
    },

    dump: function( msg ) {
        if (typeof msg === 'undefined') {
            console.group(this.get('name'));
        } else {
            console.group(msg);
        }
        
        this.get('debugCollection').walk( false );
        console.groupEnd();
        return '/dump';
    },

    flush: function( msg ) {
        if (typeof msg === 'undefined') {
            console.group(this.get('name'));
        } else {
            console.group(msg);
        }
        this.get('debugCollection').walk( true );
        console.groupEnd();
        this.set('numberOfEntries', 0);
        return '/flush';
    },

    reset: function() {
        this.set('numberOfEntries', 0);
        this.get('debugCollection').reset();
        return true;
    }
});

var CanaryDebug = Backbone.Model.extend({
    defaults: {
        id: 0,
        type: 'unknown',
        msg: '',
        obj: ''
    }
});

var CanaryDebugCollection = Backbone.Collection.extend({
    
    model: CanaryDebug,

    walk: function( flush ) {
        var delEntry = [];
        var scope = this;
        this.map(function(CanaryDebug) {
            var id = CanaryDebug.get('id');
            var type = CanaryDebug.get('type');
            var msg = CanaryDebug.get('msg');
            var obj = CanaryDebug.get('obj');
            scope.writeToConsole({id: id, type: type, msg: msg, obj: obj}, true);
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
                console.debug(meta + params.msg, params.obj);
            break;
            case 'info':
            case 'notice':
                console.info(meta + params.msg, params.obj);
            break;
            case 'warning':
                console.warn(meta + params.msg, params.obj);
            break;
            case 'error':
            case 'critical':
                console.error(meta + params.msg, params.obj);
            break;
        }
    }
});
