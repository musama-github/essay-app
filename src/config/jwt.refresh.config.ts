import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';

export default registerAs(
  'jwtRefresh',
  (): JwtSignOptions => ({
    secret: process.env.REFRESH_JWT_SECRET_KEY,
    expiresIn: process.env.REFRESH_JWT_EXPIRES_IN,
  }),
);
