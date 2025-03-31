import { InjectionToken } from '@nestjs/common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export type DBClientProduct = Pick<
  PrismaClient['product'],
  'findMany' | 'findUnique' | 'create' | 'update' | 'delete'
>;

export type DBClient = {
  product: DBClientProduct;
};

export const DB_CLIENT: InjectionToken<PrismaClient> =
  Symbol('PRISMA_DATABASE');

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
