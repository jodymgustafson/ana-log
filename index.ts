export enum LogLevel {
    All,
    Trace,
    Debug,
    Info,
    Warn,
    Error,
    Fatal,
    None
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
export class DefaultFormatter implements IFormatter {
    format(logger: Logger, level: LogLevel, ...data: any[]): string {
        const ts = new Date();
        const name = logger.name ? ` [${logger.name}]` : "";
        return `[${ts.toISOString()}] [${LogLevel[level]}]${name}${this.getMessage(...data)}`;
    }

    protected getMessage(...data: any[]): string {
        return data.reduce((prev: string, cur: any) => {
            return prev + " " + (
                (typeof cur === "string") ? cur : JSON.stringify(cur));
        }, "");
    }
}

const DEFAULT_FORMATTER = new DefaultFormatter();

/**
 * Abstract base class for implementing IAppender
 */
export abstract class BaseAppender implements IAppender {
    private _formatter: IFormatter;
    public get formatter() {
        return this._formatter;
    }

    private _level = LogLevel.All;
    public get level() {
        return this._level;
    }

    constructor();
    constructor(formatter: IFormatter);
    constructor(logLevel: LogLevel);
    constructor(logLevel: LogLevel, formatter: IFormatter);
    constructor(logLevel?: LogLevel, formatter?: IFormatter);
    constructor(param1?: IFormatter | LogLevel, param2?: IFormatter) {
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

    write(logger: Logger, level: LogLevel, ...data: any[]): void {
        if (this.level <= level) {
            this.writeMessage(this.formatter.format(logger, level, ...data))
        }
    }

    protected abstract writeMessage(message: string): void;
}

/**
 * An appender that writes log messages to the console
 */
export class ConsoleAppender extends BaseAppender {
    protected writeMessage(message: string): void {
        console.log(message);
    }
}

/**
 * An appender that writes log messages to an array
 */
export class MemoryAppender extends BaseAppender {
    private _buffer: string[] = [];
    get buffer(): string[] { return this._buffer; }

    /** Clears the buffer */
    reset(): void {
        this._buffer = [];
    }

    protected writeMessage(message: string): void {
        this._buffer.push(message);
    }
}

export class Logger {
    private _name: string;
    private _level: LogLevel;
    private _appenders: IAppender[];

    /**
     * Creates a new Logger instance. Don't create one directly, use getLogger() instead.
     * @param name Name of the logger
     * @param level Optional level, if not defined will use default logger's level
     * @param appender Optional list of appenders, if not defined will use default logger's appenders
     */
    constructor(name: string, level = getLogger().level, ...appender: IAppender[]) {
        this._name = name;
        this._level = level;
        this._appenders = appender;
        if (this._appenders.length === 0) {
            this._appenders.push(globalAppenders.get(""));
        }
    }

    addAppender(...appender: IAppender[]): void {
        this._appenders.push(...appender);
    }

    get name(): string {
        return this._name;
    }
    get level(): LogLevel {
        return this._level;
    }
    get appenders(): IAppender[] {
        // return a copy
        return this._appenders;//.slice();
    }
    /** Checks whether the logger is enabled for the trace level */
    get isTraceEnabled(): boolean {
        return (this.level <= LogLevel.Trace);
    }
    /** Checks whether the logger is enabled for the debug level */
    get isDebugEnabled(): boolean {
        return (this.level <= LogLevel.Debug);
    }
    /** Checks whether the logger is enabled for the info level */
    get isInfoEnabled(): boolean {
        return (this.level <= LogLevel.Info);
    }
    /** Checks whether the logger is enabled for the warn level */
    get isWarnEnabled(): boolean {
        return (this.level <= LogLevel.Warn);
    }
    /** Checks whether the logger is enabled for the error level */
    get isErrorEnabled(): boolean {
        return (this.level <= LogLevel.Error);
    }
    /** Checks whether the logger is enabled for the fatal level */
    get isFatalEnabled(): boolean {
        return (this.level <= LogLevel.Fatal);
    }
    /** Checks whether the logger is enabled for all levels */
    get isAllEnabled(): boolean {
        return (this.level <= LogLevel.All);
    }
    /** Checks whether the logger is turned off (level set to None) */
    get isOff(): boolean {
        return (this.level >= LogLevel.None);
    }

    /** Checks whether the logger is enabled for the specified level */
    isEnabled(level: LogLevel): boolean {
        return this.level <= level;
    }

    /** Logs a message at the trace level */
    trace(...data: any[]): void {
        this.log(LogLevel.Trace, ...data);
    }

    /** Logs a message at the debug level */
    debug(...data: any[]): void {
        this.log(LogLevel.Debug, ...data);
    }

    /** Logs a message at the info level */
    info(...data: any[]): void {
        this.log(LogLevel.Info, ...data);
    }

    /** Logs a message at the warn level */
    warn(...data: any[]): void {
        this.log(LogLevel.Warn, ...data);
    }

    /** Logs a message at the error level */
    error(...data: any[]): void {
        this.log(LogLevel.Error, ...data);
    }

    /** Logs a message at the fatal level */
    fatal(...data: any[]): void {
        this.log(LogLevel.Fatal, ...data);
    }

    /** Logs a message at the specified level */
    log(level: LogLevel, ...data: any[]): void {
        if (this.level <= level) {
            this.writeToAppenders(level, ...data);
        }
    }

    protected writeToAppenders(level: LogLevel, ...data: any[]): void {
        this._appenders.forEach(a => a.write(this, level, ...this.processData(...data)));
    }

    private processData(...data: any[]): any[] {
        return data.map(value => (typeof value === "function") ? value() : value);
    }
}

const globalLoggers = new Map<string, Logger>();
const globalAppenders = new Map<string, IAppender>();
let defaultLogger: Logger;
let defaultAppender = new ConsoleAppender();

function addLogger(name: string, level: LogLevel, ...appender: IAppender[]): Logger {
    const logger = new Logger(name, level, ...appender);
    globalLoggers.set(name, logger);
    if (name === "") {
        defaultLogger = logger;
    }
    return logger;
}

/**
 * Gets the default logger
 */
export function getLogger(): Logger;
/**
 * Gets the default logger with the specified level
 * @param level 
 */
export function getLogger(level: LogLevel): Logger;
/**
 * Gets the logger with the specified name. Level will be set to the default level.
 * @param name 
 */
export function getLogger(name: string): Logger;
/**
 * Gets the logger with the specified name and level
 * @param name 
 * @param level 
 */
export function getLogger(name: string, level: LogLevel): Logger;
export function getLogger(param1?: string | LogLevel, level?: LogLevel): Logger {
    const param1IsName = typeof param1 === "string";
    const name = param1IsName ? param1 as string : "";
    let logger = globalLoggers.get(name);
    if (!logger) {
        // If it doesn't exist add it
        if (!defaultLogger) {
            // Add the default logger if not exists
            addLogger("", LogLevel.All);
        }

        if (!param1IsName && typeof param1 === "number") {
            level = param1 as LogLevel;
        }
        else if (!Number.isFinite(level)) {
            // If level not defined set to default level
            level = defaultLogger.level;
        }
        logger = addLogger(name, level, ...defaultLogger.appenders);
    }
    return logger;
}

/**
 * Configures AnaLog defaults at startup
 */
export function configure(config: IAnaLogConfiguration): void {
    if (config.appenders) {
        config.appenders.forEach(appenderCfg => {
            addAppender(appenderCfg.name, appenderCfg.appender);
        });
    }

    config.loggers.forEach(logCfg => {
        let appenders: IAppender[];
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

/**
 * Gets a global appender by name
 */
export function getAppender(name: string): IAppender {
    return globalAppenders.get(name);
}

/**
 * Adds a global appender
 */
export function addAppender(name: string, appender: IAppender): void {
    globalAppenders.set(name, appender);
}

/**
 * Resets the AnaLog system back to nothing
 */
export function reset() {
    globalLoggers.clear();
    globalAppenders.clear();
    globalAppenders.set("", defaultAppender);
    defaultLogger = undefined;
}

reset();