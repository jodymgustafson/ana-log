export declare enum LogLevel {
    All = 0,
    Trace = 1,
    Debug = 2,
    Info = 3,
    Warn = 4,
    Error = 5,
    Fatal = 6,
    None = 7
}
export interface IAppender {
    write(logger: Logger, level: LogLevel, ...data: any[]): void;
}
export interface IFormatter {
    format(logger: Logger, level: LogLevel, ...data: any[]): string;
}
export interface IAppenderConfig {
    name: string;
    appender: IAppender;
}
export interface ILoggerConfig {
    name: string;
    level: LogLevel;
    appenders?: (string | IAppender)[];
}
export interface IAnaLogConfiguration {
    appenders?: IAppenderConfig[];
    loggers: ILoggerConfig[];
}
/**
 * Default IFormatter implementation. Writes a timestamp, the log level and user defined messages
 */
export declare class DefaultFormatter implements IFormatter {
    format(logger: Logger, level: LogLevel, ...data: any[]): string;
    protected getMessage(...data: any[]): string;
}
/**
 * Abstract base class for implementing IAppender
 */
export declare abstract class BaseAppender implements IAppender {
    private _formatter;
    get formatter(): IFormatter;
    private _level;
    get level(): LogLevel;
    constructor();
    constructor(formatter: IFormatter);
    constructor(logLevel: LogLevel);
    constructor(logLevel: LogLevel, formatter: IFormatter);
    constructor(logLevel?: LogLevel, formatter?: IFormatter);
    write(logger: Logger, level: LogLevel, ...data: any[]): void;
    protected abstract writeMessage(message: string): void;
}
/**
 * An appender that writes log messages to the console
 */
export declare class ConsoleAppender extends BaseAppender {
    protected writeMessage(message: string): void;
}
/**
 * An appender that writes log messages to an array
 */
export declare class MemoryAppender extends BaseAppender {
    private _buffer;
    get buffer(): string[];
    /** Clears the buffer */
    reset(): void;
    protected writeMessage(message: string): void;
}
export declare class Logger {
    private _name;
    private _level;
    private _appenders;
    /**
     * Creates a new Logger instance. Don't create one directly, use getLogger() instead.
     * @param name Name of the logger
     * @param level Optional level, if not defined will use default logger's level
     * @param appender Optional list of appenders, if not defined will use default logger's appenders
     */
    constructor(name: string, level?: LogLevel, ...appender: IAppender[]);
    addAppender(...appender: IAppender[]): void;
    get name(): string;
    get level(): LogLevel;
    get appenders(): IAppender[];
    /** Checks whether the logger is enabled for the trace level */
    get isTraceEnabled(): boolean;
    /** Checks whether the logger is enabled for the debug level */
    get isDebugEnabled(): boolean;
    /** Checks whether the logger is enabled for the info level */
    get isInfoEnabled(): boolean;
    /** Checks whether the logger is enabled for the warn level */
    get isWarnEnabled(): boolean;
    /** Checks whether the logger is enabled for the error level */
    get isErrorEnabled(): boolean;
    /** Checks whether the logger is enabled for the fatal level */
    get isFatalEnabled(): boolean;
    /** Checks whether the logger is enabled for all levels */
    get isAllEnabled(): boolean;
    /** Checks whether the logger is turned off (level set to None) */
    get isOff(): boolean;
    /** Checks whether the logger is enabled for the specified level */
    isEnabled(level: LogLevel): boolean;
    /** Logs a message at the trace level */
    trace(...data: any[]): void;
    /** Logs a message at the debug level */
    debug(...data: any[]): void;
    /** Logs a message at the info level */
    info(...data: any[]): void;
    /** Logs a message at the warn level */
    warn(...data: any[]): void;
    /** Logs a message at the error level */
    error(...data: any[]): void;
    /** Logs a message at the fatal level */
    fatal(...data: any[]): void;
    /** Logs a message at the specified level */
    log(level: LogLevel, ...data: any[]): void;
    protected writeToAppenders(level: LogLevel, ...data: any[]): void;
    private processData;
}
/**
 * Gets the default logger
 */
export declare function getLogger(): Logger;
/**
 * Gets the default logger with the specified level
 * @param level
 */
export declare function getLogger(level: LogLevel): Logger;
/**
 * Gets the logger with the specified name. Level will be set to the default level.
 * @param name
 */
export declare function getLogger(name: string): Logger;
/**
 * Gets the logger with the specified name and level
 * @param name
 * @param level
 */
export declare function getLogger(name: string, level: LogLevel): Logger;
/**
 * Configures AnaLog defaults at startup
 */
export declare function configure(config: IAnaLogConfiguration): void;
/**
 * Gets a global appender by name
 */
export declare function getAppender(name: string): IAppender;
/**
 * Adds a global appender
 */
export declare function addAppender(name: string, appender: IAppender): void;
/**
 * Resets the AnaLog system back to nothing
 */
export declare function reset(): void;
