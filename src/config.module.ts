import { DynamicModule, Module, Provider } from "@nestjs/common";
import {
  ConfigService,
  ConfigServiceBuilder,
} from "@rencedm112/config-service";
export {
  ConfigService,
  ConfigServiceBuilder,
} from "@rencedm112/config-service";

export type ConfigServiceFactory =
  | (() => ConfigService)
  | (() => Promise<ConfigService>)
  | ((csb: ConfigServiceBuilder) => ConfigService)
  | ((csb: ConfigServiceBuilder) => Promise<ConfigService>);

type Class = {
  new (...args: any[]): any;
};

export type ConfigProvider = {
  /**
   * The token to use to inject the config service
   */
  provide: string | Class | symbol;

  /**
   * The key to use to lookup the config service
   */
  key: string;

  /**
   * The class to be used to transform the config object
   * If not specified and if the provide property's value is a constructor,
   * it will be used as the class property instead.
   */
  class?: Class;
};

type RegisterArgs = {
  configServiceFactory: ConfigServiceFactory;
  configProviders: ConfigProvider[];
};

@Module({})
export class ConfigModule {
  static async registerAsync(args: RegisterArgs): Promise<DynamicModule> {
    const builder = new ConfigServiceBuilder();
    const configService = await args.configServiceFactory(builder);

    const providers: Provider<unknown>[] = [];

    for (const provider of args.configProviders) {
      let cls = provider.class;

      if (!provider.class && typeof provider.provide === "function") {
        cls = provider.provide;
      }

      const config = await configService.get(provider.key, cls);

      if (typeof config === "undefined") {
        throw new Error(
          `Config for key ${provider.key} and class ${cls?.name} not found`,
        );
      }

      providers.push({ provide: provider.provide, useValue: config });
    }

    return {
      module: ConfigModule,
      providers: [
        { provide: ConfigService, useValue: configService },
        ...providers,
      ],
    };
  }
}
