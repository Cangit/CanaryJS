CanaryJS
=====

Logging functions for your application. Dependent on [backbone.js](http://backbonejs.org/). Inspired by [Seldaek/monolog](https://github.com/Seldaek/monolog).

Usage
-----

```js
window.canary = new CanaryFactory.create();

canary.debug('Your debug message.');
canary.notice('Your notice.');

// loglevel( string, object ) Pass in context.
canary.debug('The message', {context: this, value: '...'});
```
Read more about the different log levels availible at the bottom of this readme.


### Functions for accessing the logs
-----
#### getEntry( id )

Get entry based on id.

**Returns:**
 - Entry object

**Example:**
```js
canary.debug('Message #1');
canary.info('Message #2');
canary.warning('Message #3');
canary.getEntry(1); // Will return Object {id: 1, type: "info", msg: "Message #2"}
````

-----

#### getLastEntry()

Get the last entry.

**Returns:**
 - Entry object

**Example:**
```js
canary.debug('Message #1');
canary.info('Message #2');
canary.warning('Message #3');
canary.getEntry(2); // Will return Object {id: 2, type: "warning", msg: "Message #3"}
````

-----

#### export()

Converts all log entries into json text and returns it.

**Returns:**
 - json text

**Example:**
```js
var logexport = canary.export();
````

-----

#### dump( heading )

Dump all entries to the console in a ordered list.

**Example:**
```js
canary.dump();
````

-----

#### flush(__heading__)

Dump all entries to the console and reset the log. Similiar to calling dump() and then reset()

**Example:**
```js
canary.flush();
````

-----

#### reset()

Removes all entries from the log.

**Example:**
```js
canary.reset();
````

-----

### Accessing model properties

#### get( param )

**Example:**
```js
var entriesmade = canary.get('numberOfEntries'); // Returns number of entries made.
var name = canary.get('name'); // Returns name of collection.
var console = canary.get('console'); // Returns true/false based on current setting.
var level = canary.get('level'); // Returns current logging level (__int__).
````

-----

#### set( param, value )

**Example:**
```js
canary.set('name', 'Le Log');
canary.set('console', true); 
canary.set('level', 500);
````

-----


### Default values

- **name** ('CanaryJS'), Will be attached to log entries when dumping/flushing.

- **level** (0), Raise this to exclude log entries with a lower level. (See the log levels at the bottom of this readme.)

- **console** (false), If true, CanaryJS will write a copy of the entry to the console immediately when a new entry is added.

You can pass on default values when you create/initiate a log collection, or change them with the set() method later.

```js
// Creates new collection with default values.
window.menulog = new CanaryFactory.create();

// Creates new collection with custom name.
window.menulog = new CanaryFactory.create('Menu Log');

// Creates new collection with several custom values.
window.menulog = new CanaryFactory.create({name: 'Menu Log', level: 200, console: true});
```

### Factory methods

If you use the CanaryFactory.create() function to create your log collections you can manipulate them all at once using these factory methods.

#### export()

Exports all log entries in all collections to json.

**Returns:**
 - json text

**Example:**
```js
var logexport = CanaryFactory.export();
````

-----

#### dump()

Dump all entries in all collections to the console.

**Example:**
```js
CanaryFactory.dump();
````

-----

#### flush()

Dump all entries in all collections to the console and reset/whipe clean all the log collections.

**Example:**
```js
CanaryFactory.flush();
````

-----


### Extra

If you want to create a log collection that is completely seperated from the other log collections you can do so by interacting directly with the CanaryJs model:
```js
var loneWolfLog = new CanaryJs();
````
Naturally, the CanaryFactory methods will not interact with log collections created this way.

All the backbone.js events works with the CanaryJS models and collections, as this very limited and basic example show below:
```js
window.canary = new CanaryFactory.create();

canary.on("change:name", function(){
    alert('The log collection changed name to: '+this.get('name'));
});

canary.get('logCollection').on("add", function(model){
    alert('A log entry was written and stored. With the message: '+model.get('msg'));
});

// ...

// This will trigger the 'change:name' callback function.
canary.set('name', 'User action log');

// This will trigger the 'add' callback function.
canary.notice('Writing a log entry.');

````

Log Levels
----------

- **DEBUG** (100)

- **INFO** (200)

- **NOTICE** (250)

- **WARNING** (300)

- **ERROR** (400)

- **CRITICAL** (500)

