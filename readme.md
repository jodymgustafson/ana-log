# AnaLog
## Delightful modern logging for JavaScript

AnaLog is a new kind of logging library for JavaScript.
It's designed to be easy to use with minimal configuration, yet allow more complicated setup when necessary.

- No configuration necessary for simple logging to console
- Supports standard logging levels from debug to fatal
- Not necessary to check log level before logging
- Can define your own appenders to write messages anywhere you want
- Pass in multiple debug messages like console.log()
- Batteries included -- everything you need to get started is in this package
- No external dependencies

## Requirements
Requires ES6

## Quick Start
Install using npm
- npm install --save @worldtreesoftware/ana-log

For simple logging you can get started without doing any configuration.
Simply call the getLogger() function to get a root logger and set its level.

    const anaLog = require("ana-log");
    const logger = anaLog.getLogger(anaLog.LogLevel.Debug);
    logger.debug("Hello World!");

If you want a logger with a different name and level just ask for it.

    const fooLogger = anaLog.getLogger("foo", anaLog.LogLevel.Info);

## Logging Levels
Log levels are defined by the enumeration LogLevel.

- All: Logs all messages
- Debug: Logs all messages at debug level and above
- Info: Logs all messages at info level and above (debug will not be logged)
- Warn: Logs all messages at warn level and above (debug and info will not be logged)
- Error: Logs all messages at error level and above (debug, info and warn will not be logged)
- Fatal: Logs all messages at fatal level and above (debug, info, warn and error will not be logged)
- None: No messages will be logged

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

To add one or more appenders to a logger use its addAppender() method.

    logger.addAppender(new ConsoleAppender(), new MemoryAppender());

You can write your own appender to write messages to anywhere.
For example, you may want to write to a file or a REST api or database.
Creating an object with the following method.

    write(level: LogLevel, ...data: any[]) {...}

## Formatters
Formatters are used to format the message that is logged. Each appender has a formatter.
If you don't define a formatter it will use DefaultFormatter.
To define a formatter pass it into the Appender's constructor.

    const appender = new ConsoleAppender(new DefaultFormatter())

You can write your own formatter by creating an object with the following method.

    format(level: LogLevel, ...data: any[]): string {...}

## Best Practices
You always want to check the log level before logging a message, especially if the message is being created dynamically.

You can either do this yourself:

    if (logger.isDebugEnabled) {
        logger.debug("Hello " + name);
    }

Or let the logger check it for you by passing in a function that returns a string. This is equivalent to the above:

    logger.debug(() => "Hello " + name);

The function will not get called unless the the log level is enabled.
No more ugly if statements all over your code to check logging levels!

You can pass in multiple messages as well, just like console.log().

    logger.error("Error:", error);

The formatter will determine how objects are logged. Usually they should be converted to a JSON string.

## Configuration
You don't need to configure AnaLog to get started but you will probably want to for more complex applications.
To do this call the configure() function passing in a list of appenders and a list of loggers.

    anaLog.configure({
        appenders: [
            {
                name: "default",
                appender: new MemoryAppender()
            },
            {
                name: "init",
                appender: new MemoryAppender()
            }
        ],
        loggers: [
            {
                name: "",
                level: anaLog.LogLevel.Debug,
                appenders: [ "default" ]
            },
            {
                name: "startup",
                level: anaLog.LogLevel.Info,
                appenders: [ "init" ]
            }
        ]
    });

This example adds two appenders. Then it adds two loggers that use the two appenders.
If the logger name is empty string ("") it will define the default logger.
The default logger is a special logger that defines the default logging level and 