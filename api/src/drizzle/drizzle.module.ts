import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { PG_CONNECTION } from './constants';
import * as schema from './schema';

@Module({
  providers: [
    {
      provide: PG_CONNECTION,
      inject: [ConfigService],
      useFactory: async function (configService: ConfigService) {
        const connectionString = configService.get<string>('database.url');
        const pool = new Pool({ connectionString, ssl: false });
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [PG_CONNECTION],
})
export class DrizzleModule {}
