import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';
import { User } from 'src/entities/user.entity';
import { registerAs } from '@nestjs/config';
import { Essay } from 'src/entities/essay.entity';
export default registerAs(
  'dbConfig.development',
  (): PostgresConnectionOptions => ({
    type: 'postgres',
    host: process.env.host,
    port: +process.env.port,
    username: process.env.username,
    password: process.env.password,
    database: process.env.database,
    entities: [User, Essay],
    synchronize: true,
  }),
);
