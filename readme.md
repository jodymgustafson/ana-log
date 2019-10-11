# AnaLog
## Delightful modern logging for JavaScript

AnaLog is a new kind of logging library for JavaScript.
It's designed to be easy to use with minimal configuration, yet allow more complicated setup when necessary.

- No configuration necessary for simple logging to console
- Supports standard logging levels from debug to fatal
- Not necessary to check log level before logging
- Can define your own appenders to write messages anywhere you want
- Pass in multiple messages like console.log()
- Batteries included -- everything you need to get started is in this package
- No external dependencies
- TypeScript type definition file built in

## Why?
Why create my own logging library when there are so many others available?
1. Because I couldn't find one with all of the features I wanted (see above)
2. Because I like to write code ;)

## Requirements
Requires ES6

## Quick Start
Install using npm
- npm install --save analogging

For simple logging you can get started without doing any configuration.
Simply call the `getLogger()` function to get a root logger and set its level.

    const anaLog = require("analogging");
    const logger = anaLog.getLogger(anaLog.LogLevel.Debug);
    logger.debug("Hello World!");

If you want a logger with a different name and level just ask for it.

    const fooLogger = anaLog.getLogger("foo", anaLog.LogLevel.Info);

You can log at any one of the 5 levels (debug, info, warn, error, fatal).
You can check if logging is enabled for any level or above using one of the following
- `logger.isDebugEnabled`
- `logger.isInfoEnabled`
- `logger.isWarnEnabled`
- `logger.isErrorEnabled`
- `logger.isFatalEnabled`

There are three ways to log at any level.

#### Passing in a string
    if (logger.isInfoEnabled)
        logger.info("Hello " + name);

Note: If you are constructing a string as above you should check the logging level first so you don't create strings for no reason.

#### Passing in an object
    logger.error(myObject);

Note: The object will be formatted to a json string

#### Using a function
    logger.info(() => "Hello " + name);

The function takes no parameters and returns a string.
The benefit of using this approach is that you don't need to check the logging level.
It will only execute the function if the logging level is satisfied.

#### Passing in any number of strings, objects or functions
    logger.info("Hello", name);

This is the best of all worlds.
It will log out each parameter with a space between them.
This approach also has the benefit of automatically checking the logging level.

## Logging Levels
Log levels are defined by the enumeration `LogLevel`.

- `LogLevel.All`: Logs all messages
- `LogLevel.Debug`: Logs all messages at debug level and above
- `LogLevel.Info`: Logs all messages at info level and above (debug will not be logged)
- `LogLevel.Warn`: Logs all messages at warn level and above (debug and info will not be logged)
- `LogLevel.Error`: Logs all messages at error level and above (debug, info and warn will not be logged)
- `LogLevel.Fatal`: Logs all messages at fatal level and above (debug, info, warn and error will not be logged)
- `LogLevel.None`: No messages will be logged

## Loggers
You call the getLogger() function to get and/or initialize a logger.
You can use as many different loggers as you like.
If the logger you're attempting to retrieve doesn't exist it will be created.

getLogger() has a number of overloads.

- getLogger()
    - Gets the default logger
- getLogger(level: LogLevel)
    - Gets the default logger with the specified level
- getLogger(name: string)
    - Gets the logger with the specified name
- getLogger(name: string, level: LogLevel)
    - Gets the logger with the specified name and level

Note: Once you initialize a logger with a level you can't change it.

### The Default Logger
The default logger is a special logger that defines the default level and appender.
Any time you get a new logger without specifying a level it will be set to the default logger's level.
So you will probably always want to call getLogger(level: LogLevel) at the beginning of your application, unless you are using a configuration (see below).

## Appenders
Appenders are added to loggers to tell it where to write messages to.
There are two built in appenders.

- ConsoleAppender: Writes messages to the console
- MemoryAppender: Writes messages to an array

To add one or more appenders to a logger use its `addAppender()` method.

    logger.addAppender(new ConsoleAppender(), new MemoryAppender());

You can write your own appender to write messages to anywhere.
For example, you may want to write to a file or a REST api or a database.
The easiest way to do this is to extend the BaseAppender class and implement the `writeMessage(message: string)` method:

    class MyAppender extends anaLog.BaseAppender {
        constructor(formatter) {
            super(formatter);
        }
        writeMessage(message) {
            // write the message to somewhere
        }
    }

## Formatters
Formatters are used to format the message that is logged. Each appender has a formatter.
If you don't define a formatter it will use anaLog's `DefaultFormatter`.
To set the formatter pass it into the Appender's constructor.

    const appender = new ConsoleAppender(new MyFormatter());

You can write your own formatter by creating a class with the following method.

    format(logger: Logger, level: LogLevel, ...data: any[]): string

## Configuration
You don't need to configure AnaLog to get started but you will probably want to for more complex applications.
To do this call the configure() function passing in a list of appenders and a list of loggers.

    anaLog.configure({
        appenders: [
            {
                name: "memory",
                appender: new MemoryAppender()
            },
            {
                name: "myAppender",
                appender: new MyAppender()
            }
        ],
        loggers: [
            {
                name: "",
                level: anaLog.LogLevel.Error,
                appenders: [ "", "memory" ]
            },
            {
                name: "startup",
                level: anaLog.LogLevel.Info,
                appenders: [ "myAppender" ]
            }
        ]
    });

If the logger name is empty string ("") it will define the default logger.
There is also a default appender whose name is empty string.
The default logger is a special logger that defines the default logging level and formatter for all other loggers.

In the example above it defines two appenders. Then it adds two loggers that use the two appenders. It sets the default logger to Error level and adds the default and memory appenders. It sets the "startup" logger to Info level and adds myAppender.

