CanaryJS
=====

Basic logging tools.

Usage
-----

```js
window.canary = new CanaryJS();

canary.debug('Your debug message.');
canary.notice('Your debug message.');

// loglevel( string, obj ) Pass in context.
canary.debug('The message', {context: this, value: '...'});
```


### Functions for accessing the logs

```js
// getEntry( int ) Fetch entry based on id
canary.debug('Message #1');
canary.info('Message #2');
canary.warning('Message #3');
canary.getEntry(2); // Will return Object {id: 2, type: "warning", msg: "Message #3"}

// dump(optional: string) dump all entries to the console in a ordered list.
canary.dump();

// flush(optional: string) dump all entries to the console and reset the log.
canary.flush(); // similiar to calling dump() and then reset()

// reset() removes all entries from the log
canary.reset();
```

### Access to model properties

```js
canary.get('numberOfEntries'); // Returns number of entries made.
canary.get('name'); // Returns name of collection.
canary.get('console'); // Returns true/false based on current setting.
canary.get('level'); // Returns current logging level (int).
```

### Default values

- **name** ('CanaryJS'), Will be attached to log entries when dumping/flushing.

- **level** (0), Raise this to exclude logging entries with a lower level. (See the log levels at the bottom of this readme.)

- **console** (false), If true, CanaryJS will write a copy of the entry to the console immediately when a new entry is added.


You can pass on default values when you create/initiate a log collection, or change them with the set() method later.

```js
window.datatablelog = new CanaryJS({name: 'Data table', level: 200, console: true});

datatablelog.set('level', 400);
```

Log Levels
----------

- **DEBUG** (100)

- **INFO** (200)

- **NOTICE** (250)

- **WARNING** (300)

- **ERROR** (400)

- **CRITICAL** (500)


License
----------
[This work is licensed under a Creative Commons Attribution 3.0 Unported License.](http://creativecommons.org/licenses/by/3.0/deed.en_US)