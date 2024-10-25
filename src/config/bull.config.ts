import { BullRootModuleOptions } from '@nestjs/bullmq';
import { registerAs } from '@nestjs/config';
export default registerAs(
  'bullConfig.development',
  (): BullRootModuleOptions => ({
    connection: {
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    },
  }),
);
