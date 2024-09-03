import { Module } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
})
export class ProductsModule {}
