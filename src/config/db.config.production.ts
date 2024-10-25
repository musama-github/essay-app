import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';
import { User } from 'src/entities/user.entity';
import { registerAs } from '@nestjs/config';
export default registerAs(
  'dbConfig.production',
  (): PostgresConnectionOptions => ({
    type: 'postgres',
    host: process.env.host,
    port: +process.env.port,
    username: process.env.username,
    password: process.env.password,
    database: process.env.database,
    entities: [User],
    synchronize: false,
  }),
);
