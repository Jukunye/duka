import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProuductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async getProducts(query: any): Promise<Product[]> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'asc',
      ...filters
    } = query;
    const sortOrder = order === 'asc' ? 1 : -1;
    const skip = (page - 1) * limit;
    return this.productModel
      .find(filters)
      .sort({ [sort]: sortOrder })
      .skip(skip)
      .limit(Number(limit))
      .exec();
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProuductDto
  ): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }
}
