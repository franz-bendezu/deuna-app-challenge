import { InjectionToken } from '@nestjs/common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export type DBClient = Pick<PrismaClient, 'product'>;

export const DB_CLIENT: InjectionToken<PrismaClient> =
  Symbol('PRISMA_DATABASE');

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
