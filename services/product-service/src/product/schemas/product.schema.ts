import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  category: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Pre-save middleware to update the timestamps
ProductSchema.pre('save', function (next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});
