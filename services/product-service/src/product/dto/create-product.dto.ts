export class CreateProductDto {
  readonly name: string;
  readonly description?: string;
  readonly price: number;
  readonly category: string; //category ID
  readonly stock: number;
}
