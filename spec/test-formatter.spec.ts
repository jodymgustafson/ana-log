import * as anaLog from "../index";

class TestFormatter implements anaLog.IFormatter
{
    format(logger: anaLog.Logger, level: anaLog.LogLevel, ...data: any[]): string {
        return `Test-${logger.level}-${level}-${JSON.stringify(data)}`; 
    }
}

// Make the default logger not log to console to keep it clean
anaLog.reset();
anaLog.configure({
    loggers: [ { name: "", level: anaLog.LogLevel.All, appenders: [new anaLog.ConsoleAppender(anaLog.LogLevel.None)] }]
});

describe("Test Formatters:", () => {
    describe("When use test formatter", () => {
        const logger = anaLog.getLogger("test1");
        const appender = new anaLog.MemoryAppender(new TestFormatter());
        logger.addAppender(appender);
        logger.debug("test1");
        it("should log in test format", () => {
            expect(appender.buffer[0]).toBe(`Test-0-1-["test1"]`);
        });
    });
    describe("When use test formatter and level", () => {
        const logger = anaLog.getLogger("test2", anaLog.LogLevel.Info);
        const appender = new anaLog.MemoryAppender(anaLog.LogLevel.Error, new TestFormatter());
        logger.addAppender(appender);
        logger.error("test2");
        it("should log in test format", () => {
            expect(appender.buffer[0]).toBe(`Test-2-4-["test2"]`);
        });
    });
});
