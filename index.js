"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["All"] = 0] = "All";
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Warn"] = 3] = "Warn";
    LogLevel[LogLevel["Error"] = 4] = "Error";
    LogLevel[LogLevel["Fatal"] = 5] = "Fatal";
    LogLevel[LogLevel["None"] = 6] = "None";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
/**
 * Default IFormatter implementation. Writes a timestamp, the log level and user defined messages
 */
class DefaultFormatter {
    format(logger, level, ...data) {
        const ts = new Date();
        const name = logger.name ? ` [${logger.name}]` : "";
        return `[${ts.toISOString()}] [${LogLevel[level]}]${name}${this.getMessage(...data)}`;
    }
    getMessage(...data) {
        return data.reduce((prev, cur) => {
            return prev + " " + ((typeof cur === "string") ? cur : JSON.stringify(cur));
        }, "");
    }
}
exports.DefaultFormatter = DefaultFormatter;
const DEFAULT_FORMATTER = new DefaultFormatter();
/**
 * Abstract base class for implementing IAppender
 */
class BaseAppender {
    constructor(param1, param2) {
        this._level = LogLevel.All;
        if (typeof param1 === "undefined") {
            this._formatter = DEFAULT_FORMATTER;
        }
        else if (typeof param1 === "number") {
            this._level = param1;
            this._formatter = param2 || DEFAULT_FORMATTER;
        }
        else {
            this._formatter = param1 || DEFAULT_FORMATTER;
        }
    }
    get formatter() {
        return this._formatter;
    }
    get level() {
        return this._level;
    }
    write(logger, level, ...data) {
        if (this.level <= level) {
            this.writeMessage(this.formatter.format(logger, level, ...data));
        }
    }
}
exports.BaseAppender = BaseAppender;
/**
 * An appender that writes log messages to the console
 */
class ConsoleAppender extends BaseAppender {
    writeMessage(message) {
        console.log(message);
    }
}
exports.ConsoleAppender = ConsoleAppender;
/**
 * An appender that writes log messages to an array
 */
class MemoryAppender extends BaseAppender {
    constructor() {
        super(...arguments);
        this._buffer = [];
    }
    get buffer() { return this._buffer; }
    /** Clears the buffer */
    reset() {
        this._buffer = [];
    }
    writeMessage(message) {
        this._buffer.push(message);
    }
}
exports.MemoryAppender = MemoryAppender;
class Logger {
    /**
     * Creates a new Logger instance. Don't create one directly, use getLogger() instead.
     * @param name Name of the logger
     * @param level Optional level, if not defined will use default logger's level
     * @param appender Optional list of appenders, if not defined will use default logger's appenders
     */
    constructor(name, level = getLogger().level, ...appender) {
        this._name = name;
        this._level = level;
        this._appenders = appender;
        if (this._appenders.length === 0) {
            this._appenders.push(globalAppenders.get(""));
        }
    }
    addAppender(...appender) {
        this._appenders.push(...appender);
    }
    get name() {
        return this._name;
    }
    get level() {
        return this._level;
    }
    get appenders() {
        // return a copy
        return this._appenders; //.slice();
    }
    get isDebugEnabled() {
        return (this.level <= LogLevel.Debug);
    }
    get isInfoEnabled() {
        return (this.level <= LogLevel.Info);
    }
    get isWarnEnabled() {
        return (this.level <= LogLevel.Warn);
    }
    get isErrorEnabled() {
        return (this.level <= LogLevel.Error);
    }
    get isFatalEnabled() {
        return (this.level <= LogLevel.Fatal);
    }
    get isAllEnabled() {
        return (this.level <= LogLevel.All);
    }
    debug(...data) {
        this.log(LogLevel.Debug, ...data);
    }
    info(...data) {
        this.log(LogLevel.Info, ...data);
    }
    warn(...data) {
        this.log(LogLevel.Warn, ...data);
    }
    error(...data) {
        this.log(LogLevel.Error, ...data);
    }
    fatal(...data) {
        this.log(LogLevel.Fatal, ...data);
    }
    log(level, ...data) {
        if (this.level <= level) {
            this.writeToAppenders(level, ...data);
        }
    }
    writeToAppenders(level, ...data) {
        this._appenders.forEach(a => a.write(this, level, ...this.processData(...data)));
    }
    processData(...data) {
        return data.map(value => (typeof value === "function") ? value() : value);
    }
}
exports.Logger = Logger;
const globalLoggers = new Map();
const globalAppenders = new Map();
let defaultLogger;
let defaultAppender = new ConsoleAppender();
function addLogger(name, level, ...appender) {
    const logger = new Logger(name, level, ...appender);
    globalLoggers.set(name, logger);
    if (name === "") {
        defaultLogger = logger;
    }
    return logger;
}
function getLogger(param1, level) {
    const param1IsName = typeof param1 === "string";
    const name = param1IsName ? param1 : "";
    let logger = globalLoggers.get(name);
    if (!logger) {
        // If it doesn't exist add it
        if (!defaultLogger) {
            // Add the default logger if not exists
            addLogger("", LogLevel.All);
        }
        if (!param1IsName && typeof param1 === "number") {
            level = param1;
        }
        else if (!Number.isFinite(level)) {
            // If level not defined set to default level
            level = defaultLogger.level;
        }
        logger = addLogger(name, level, ...defaultLogger.appenders);
    }
    return logger;
}
exports.getLogger = getLogger;
/**
 * Configures AnaLog defaults at startup
 */
function configure(config) {
    if (config.appenders) {
        config.appenders.forEach(appenderCfg => {
            addAppender(appenderCfg.name, appenderCfg.appender);
        });
    }
    config.loggers.forEach(logCfg => {
        let appenders;
        if (logCfg.appenders && logCfg.appenders.length) {
            appenders = logCfg.appenders.map(appdr => typeof appdr === "string" ? globalAppenders.get(appdr) : appdr);
        }
        else if (defaultLogger) {
            appenders = defaultLogger.appenders;
        }
        else {
            appenders = [defaultAppender];
        }
        addLogger(logCfg.name, logCfg.level, ...appenders);
    });
}
exports.configure = configure;
/**
 * Gets a global appender by name
 */
function getAppender(name) {
    return globalAppenders.get(name);
}
exports.getAppender = getAppender;
/**
 * Adds a global appender
 */
function addAppender(name, appender) {
    globalAppenders.set(name, appender);
}
exports.addAppender = addAppender;
/**
 * Resets the AnaLog system back to nothing
 */
function reset() {
    globalLoggers.clear();
    globalAppenders.clear();
    globalAppenders.set("", defaultAppender);
    defaultLogger = undefined;
}
exports.reset = reset;
reset();
//# sourceMappingURL=index.js.map