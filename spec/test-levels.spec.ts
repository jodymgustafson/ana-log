import * as anaLog from "../index";

const memoryAppdr = new anaLog.MemoryAppender();

function setUp() {
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
                level: anaLog.LogLevel.Debug,
                appenders: [ "memory" ]
            },
            {
                name: "info",
                level: anaLog.LogLevel.Info,
                appenders: [ "memory" ]
            },
            {
                name: "warn",
                level: anaLog.LogLevel.Warn,
                appenders: [ "memory" ]
            },
            {
                name: "error",
                level: anaLog.LogLevel.Error,
                appenders: [ "memory" ]
            },
            {
                name: "fatal",
                level: anaLog.LogLevel.Fatal,
                appenders: [ "memory" ]
            },
            {
                name: "none",
                level: anaLog.LogLevel.None,
                appenders: [ "memory" ]
            }
        ]
    });
}
setUp();

describe("When set up", () => {
    it("should get root logger", () => expect(anaLog.getLogger().name).toBe(""));
    it("should get debug logger", () => expect(anaLog.getLogger("debug").name).toBe("debug"));
    it("should get info logger", () => expect(anaLog.getLogger("info").name).toBe("info"));
    it("should get the appender", () => expect(anaLog.getAppender("memory")).toBe(memoryAppdr));
});

describe("When log level set to ALL", () =>{
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

function logAllLevels(logger: anaLog.Logger): void {
    memoryAppdr.reset();
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