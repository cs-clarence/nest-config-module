import { ConfigModule, ConfigService } from "$config.module";
import { Test } from "@nestjs/testing";
import { describe } from "vitest";

describe("ConfigModule", () => {
  describe("registerAsync", () => {
    it("should return a dynamic module that injects a ConfigService", async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          await ConfigModule.registerAsync({
            configProviders: [],
            configServiceFactory: (csb) => {
              return csb.build();
            },
          }),
        ],
      }).compile();

      const configService = moduleRef.get(ConfigService);

      expect(configService).toBeInstanceOf(ConfigService);
    });

    it("should return a dynamic module that injects a ConfigService", async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [
          await ConfigModule.registerAsync({
            configProviders: [],
            configServiceFactory: (csb) => {
              return csb.build();
            },
          }),
        ],
      }).compile();

      const configService = moduleRef.get(ConfigService);

      expect(configService).toBeInstanceOf(ConfigService);
    });

    it("should return a dynamic module that injects config providers", async () => {
      class TestConfigClass {
        constructor(public test: string) {}
      }

      const testConfigSymbol = Symbol("testConfigSymbol");
      const TEST_CONFIG_STRING = "TEST_CONFIG_STRING";

      const moduleRef = await Test.createTestingModule({
        imports: [
          await ConfigModule.registerAsync({
            configProviders: [
              { key: "class", provide: TestConfigClass },
              { key: "symbol", provide: testConfigSymbol },
              { key: "string", provide: TEST_CONFIG_STRING },
            ],
            configServiceFactory: (csb) => {
              csb.addObject({ test: "test" }, { namespace: "class" });
              csb.addObject({ test: "test" }, { namespace: "symbol" });
              csb.addObject({ test: "test" }, { namespace: "string" });
              return csb.build();
            },
          }),
        ],
      }).compile();

      const configFromClass = moduleRef.get(TestConfigClass);
      const configFromSymbol = moduleRef.get(TestConfigClass);
      const configFromString = moduleRef.get(TestConfigClass);

      expect(configFromClass).toBeInstanceOf(TestConfigClass);
      expect(configFromClass).toMatchObject({ test: "test" });
      expect(configFromSymbol).toMatchObject({ test: "test" });
      expect(configFromString).toMatchObject({ test: "test" });
    });
  });
});
