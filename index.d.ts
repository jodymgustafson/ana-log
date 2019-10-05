export declare enum LogLevel {
    All = 0,
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4,
    Fatal = 5,
    None = 6
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
    appenders?: string[];
}
export interface IAnaLogConfiguration {
    appenders: IAppenderConfig[];
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
    protected formatter: IFormatter;
    constructor(formatter?: IFormatter);
    abstract write(logger: Logger, ...data: any[]): void;
}
/**
 * An appender that writes log messages to the console
 */
export declare class ConsoleAppender extends BaseAppender {
    constructor(formatter?: IFormatter);
    write(logger: Logger, level: LogLevel, ...data: any[]): void;
    private writeToConsole;
}
/**
 * An appender that writes log messages to an array
 */
export declare class MemoryAppender extends BaseAppender {
    private _buffer;
    readonly buffer: string[];
    constructor(formatter?: IFormatter);
    write(logger: Logger, level: LogLevel, ...data: any[]): void;
    reset(): void;
    private writeToBuffer;
}
export declare class Logger {
    private _name;
    private _level;
    private _appenders;
    /**
     * Creates a new Logger instance
     * @param _name Name of the logger
     * @param _level Optional level, if not defined will use default logger's level
     * @param appender Optional list of appenders, if not defined will use default logger's appenders
     */
    constructor(name: string, level?: LogLevel, ...appender: IAppender[]);
    addAppender(...appender: IAppender[]): void;
    readonly name: string;
    readonly level: LogLevel;
    readonly appenders: IAppender[];
    readonly isDebugEnabled: boolean;
    readonly isInfoEnabled: boolean;
    readonly isWarnEnabled: boolean;
    readonly isErrorEnabled: boolean;
    readonly isFatalEnabled: boolean;
    readonly isAllEnabled: boolean;
    debug(...data: any[]): void;
    info(...data: any[]): void;
    warn(...data: any[]): void;
    error(...data: any[]): void;
    fatal(...data: any[]): void;
    log(level: LogLevel, ...data: any[]): void;
    protected writeToAppenders(level: LogLevel, ...data: any[]): void;
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
