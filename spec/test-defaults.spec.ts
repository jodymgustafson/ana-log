import * as anaLog from "../index";

describe("Test Defaults:", () =>{
    describe("When default settings", () => {
        beforeAll(() => {
            anaLog.reset();
        });
        it("should get the default appender", () => expect(anaLog.getAppender("")).toBeTruthy());
        it("should get default logger", () => expect(anaLog.getLogger().name).toBe(""));
        it("default logger level should be ALL", () => expect(anaLog.getLogger().level).toBe(anaLog.LogLevel.All));
        it("should get logger by name", () => expect(anaLog.getLogger("test").name).toBe("test"));
    });

    describe("When get logger before default created", () => {
        beforeAll(() => {
            anaLog.reset();
        });
        it("default logger level should be ALL", () => expect(anaLog.getLogger("test").level).toBe(anaLog.LogLevel.All));
    });

    describe("When set default logger to Warn", () => {
        beforeAll(() => {
            anaLog.reset();
            anaLog.getLogger(anaLog.LogLevel.Warn);
        });
        it("default logger should be warn", () => expect(anaLog.getLogger().level).toBe(anaLog.LogLevel.Warn));
        it("new logger should should be warn", () => expect(anaLog.getLogger("warn").level).toBe(anaLog.LogLevel.Warn));
        it("new logger with level should should not be warn", () => expect(anaLog.getLogger("debug", anaLog.LogLevel.Debug).level).toBe(anaLog.LogLevel.Debug));
    });

    describe("When set default logger appenders", () => {
        beforeAll(() => {
            anaLog.reset();
            const logger = anaLog.getLogger(anaLog.LogLevel.Debug);
            logger.addAppender(new anaLog.MemoryAppender());
        });
        it("new logger should get same appenders as default", () => expect(anaLog.getLogger("test").appenders).toEqual(anaLog.getLogger().appenders));
    });
});