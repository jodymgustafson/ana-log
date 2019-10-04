import * as anaLog from "../index";

describe("When default settings", () => {
    beforeAll(() => {
        anaLog.reset();
    });
    it("should get the default appender", () => expect(anaLog.getAppender("")).toBeTruthy());
    it("should get default logger", () => expect(anaLog.getLogger().name).toBe(""));
    it("default logger level should be ALL", () => expect(anaLog.getLogger().level).toBe(anaLog.LogLevel.All));
    it("should get logger by name", () => expect(anaLog.getLogger("test").name).toBe("test"));
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
