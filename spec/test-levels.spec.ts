import * as anaLog from "../index";

let memoryAppdr = new anaLog.MemoryAppender();

anaLog.reset();
anaLog.configure({
    appenders: [{
        name: "memory",
        appender: memoryAppdr
    }],
    loggers: [
        {
            name: "",
            level: anaLog.LogLevel.All,
            appenders: [ "memory" ]
        },
        {
            name: "debug",
            level: anaLog.LogLevel.Debug
        },
        {
            name: "info",
            level: anaLog.LogLevel.Info
        },
        {
            name: "warn",
            level: anaLog.LogLevel.Warn
        },
        {
            name: "error",
            level: anaLog.LogLevel.Error
        },
        {
            name: "fatal",
            level: anaLog.LogLevel.Fatal
        },
        {
            name: "none",
            level: anaLog.LogLevel.None
        }
    ]
});

describe("Test Levels:", () =>{
    describe("When set up", () => {
        const root = anaLog.getLogger();
        it("should get root logger", () => expect(root.name).toBe(""));
        it("should get all logger", () => expect(root.level).toBe(anaLog.LogLevel.All));
        const debug = anaLog.getLogger("debug");
        it("should get debug logger", () => expect(debug.level).toBe(anaLog.LogLevel.Debug));
        const info = anaLog.getLogger("info");
        it("should get info logger", () => expect(info.level).toBe(anaLog.LogLevel.Info));
        const warn = anaLog.getLogger("warn");
        it("should get warn logger", () => expect(warn.level).toBe(anaLog.LogLevel.Warn));
        const error = anaLog.getLogger("error");
        it("should get error logger", () => expect(error.level).toBe(anaLog.LogLevel.Error));
        const fatal = anaLog.getLogger("fatal");
        it("should get fatal logger", () => expect(fatal.level).toBe(anaLog.LogLevel.Fatal));
        it("should get the appender", () => {
            const appender = root.appenders[0];
            expect(appender).toBe(memoryAppdr)
        });
    });

    describe("When log level set to ALL", () =>{
        // get default logger
        const logger = anaLog.getLogger();
        beforeAll(() => logAllLevels(logger));
        checkAllLevels(logger, true, true, true, true, true);
        it("should have 5 entries", () => expect(memoryAppdr.buffer.length).toBe(5));
        it("should log debug", () =>  expect(memoryAppdr.buffer[0].endsWith("Z] [Debug] all debug")).toBeTruthy());
        it("should log info", () => expect(memoryAppdr.buffer[1].endsWith("Z] [Info] all info")).toBeTruthy());
        it("should log warn", () => expect(memoryAppdr.buffer[2].endsWith("Z] [Warn] all warn")).toBeTruthy());
        it("should log error", () => expect(memoryAppdr.buffer[3].endsWith("Z] [Error] all error")).toBeTruthy());
        it("should log fatal", () => expect(memoryAppdr.buffer[4].endsWith("Z] [Fatal] all fatal")).toBeTruthy());
    });

    describe("When log level set to DEBUG", () => {
        let logger = anaLog.getLogger("debug");
        beforeAll(() => logAllLevels(logger));
        checkAllLevels(logger, true, true, true, true, true);
        it("should have 5 entries", () => expect(memoryAppdr.buffer.length).toBe(5));
        it("should log debug", () =>  expect(memoryAppdr.buffer[0].endsWith("Z] [Debug] [debug] debug debug")).toBeTruthy());
        it("should log info", () => expect(memoryAppdr.buffer[1].endsWith("Z] [Info] [debug] debug info")).toBeTruthy());
        it("should log warn", () => expect(memoryAppdr.buffer[2].endsWith("Z] [Warn] [debug] debug warn")).toBeTruthy());
        it("should log error", () => expect(memoryAppdr.buffer[3].endsWith("Z] [Error] [debug] debug error")).toBeTruthy());
        it("should log fatal", () => expect(memoryAppdr.buffer[4].endsWith("Z] [Fatal] [debug] debug fatal")).toBeTruthy());
    });

    describe("When log level set to INFO", () => {
        const logger = anaLog.getLogger("info");
        beforeAll(() => logAllLevels(logger));
        checkAllLevels(logger, false, true, true, true, true);
        it("should have 4 entries", () => expect(memoryAppdr.buffer.length).toBe(4));
        it("should log info", () => expect(memoryAppdr.buffer[0].endsWith("Z] [Info] [info] info info")).toBeTruthy());
        it("should log warn", () => expect(memoryAppdr.buffer[1].endsWith("Z] [Warn] [info] info warn")).toBeTruthy());
        it("should log error", () => expect(memoryAppdr.buffer[2].endsWith("Z] [Error] [info] info error")).toBeTruthy());
        it("should log fatal", () => expect(memoryAppdr.buffer[3].endsWith("Z] [Fatal] [info] info fatal")).toBeTruthy());
    });

    describe("When log level set to WARN", () => {
        const logger = anaLog.getLogger("warn");
        beforeAll(() => logAllLevels(logger));
        checkAllLevels(logger, false, false, true, true, true);
        it("should have 3 entries", () => expect(memoryAppdr.buffer.length).toBe(3));
        it("should log warn", () => expect(memoryAppdr.buffer[0].endsWith("Z] [Warn] [warn] warn warn")).toBeTruthy());
        it("should log error", () => expect(memoryAppdr.buffer[1].endsWith("Z] [Error] [warn] warn error")).toBeTruthy());
        it("should log fatal", () => expect(memoryAppdr.buffer[2].endsWith("Z] [Fatal] [warn] warn fatal")).toBeTruthy());
    });

    describe("When log level set to ERROR", () => {
        const logger = anaLog.getLogger("error");
        beforeAll(() => logAllLevels(logger));
        checkAllLevels(logger, false, false, false, true, true);
        it("should have 2 entries", () => expect(memoryAppdr.buffer.length).toBe(2));
        it("should log error", () => expect(memoryAppdr.buffer[0].endsWith("Z] [Error] [error] error error")).toBeTruthy());
        it("should log fatal", () => expect(memoryAppdr.buffer[1].endsWith("Z] [Fatal] [error] error fatal")).toBeTruthy());
    });

    describe("When log level set to FATAL", () => {
        const logger = anaLog.getLogger("fatal");
        beforeAll(() => logAllLevels(logger));
        checkAllLevels(logger, false, false, false, false, true);
        it("should have 1 entries", () => expect(memoryAppdr.buffer.length).toBe(1));
        it("should log fatal", () => expect(memoryAppdr.buffer[0].endsWith("Z] [Fatal] [fatal] fatal fatal")).toBeTruthy());
    });

    describe("When log level set to NONE", () => {
        const logger = anaLog.getLogger("none");
        beforeAll(() => logAllLevels(logger));
        checkAllLevels(logger, false, false, false, false, false);
        it("should have 0 entries", () => expect(memoryAppdr.buffer.length).toBe(0));
    });
});

function logAllLevels(logger: anaLog.Logger): void {
    (logger.appenders[0] as anaLog.MemoryAppender).reset();
    const level = anaLog.LogLevel[logger.level].toLocaleLowerCase();
    logger.debug(level + " debug");
    logger.info(level + " info");
    logger.warn(level + " warn");
    logger.error(level + " error");
    logger.fatal(level + " fatal");
}

function checkAllLevels(logger: anaLog.Logger, debug: boolean, info: boolean, warn: boolean, error: boolean, fatal: boolean): void {
    it("should have debug " + debug, () => expect(logger.isDebugEnabled).toBe(debug));
    it("should have info " + info, () => expect(logger.isInfoEnabled).toBe(info));
    it("should have warn " + warn, () => expect(logger.isWarnEnabled).toBe(warn));
    it("should have error " + error, () => expect(logger.isErrorEnabled).toBe(error));
    it("should have fatal " + fatal, () => expect(logger.isFatalEnabled).toBe(fatal));
}
