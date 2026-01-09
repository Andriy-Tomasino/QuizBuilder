import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const filePath = databaseUrl.replace('file:', '');
    const adapter = new PrismaBetterSqlite3({ url: filePath });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}

