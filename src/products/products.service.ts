import { Prisma } from '@prisma/client';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      return await this.prismaService.product.create({
        data: createProductDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 es el tipico error de registro repetido
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Product with name ${createProductDto.name} already exist.`,
          );
        }
      }
    }
  }

  findAll() {
    return this.prismaService.product.findMany();
  }

  async findOne(id: number) {
    const productFound = await this.prismaService.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!productFound) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return productFound;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const productUpdated = await this.prismaService.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });

    if (!productUpdated) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return productUpdated;
  }

  async remove(id: number) {
    const deletedProduct = await this.prismaService.product.delete({
      where: {
        id,
      },
    });

    if (!deletedProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return deletedProduct;
  }
}
