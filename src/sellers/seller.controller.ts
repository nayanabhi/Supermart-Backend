import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SellerService } from './seller.service';
import { Sellers } from 'src/dto/seller.dto';
import { Seller } from 'src/schema/seller.entity';
import { ProductSellerMappings } from 'src/dto/productSellerMapping.dto';
import { ProductSellerMapping } from 'src/schema/productSellerMapping.entity';


@Controller("sellers")
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get(":id")
  async getSellerById(@Param('id') id: string): Promise<Seller> {
    return this.sellerService.getSellerById(+id);
  }

  @Post("createSeller")
  async createSeller(@Body() seller: Sellers): Promise<Seller> {
    return this.sellerService.createSeller(seller);
  }

  @Put("updateSeller/:id")
  async updateSeller(@Param('id') id: string, @Body() seller: Sellers): Promise<Seller> {
    return this.sellerService.updateSeller(+id, seller);
  }

  @Delete("deleteSeller/:id")
  async deleteSeller(@Param('id') id: string): Promise<void> {
    return this.sellerService.deleteSeller(+id);
  }

  @Post("addProduct") 
  async addProduct(@Body() productSellerDetails: ProductSellerMappings) : Promise<ProductSellerMapping> {
    return this.sellerService.addProduct(productSellerDetails);
  }

  @Put("updateProductStatus") 
  async updateproductStatus(@Body() productSellerDetails: ProductSellerMappings) : Promise<ProductSellerMapping> {
    return this.sellerService.updateProductStatus(productSellerDetails);
  }

  @Get("getAllProducts/:id") 
  async getAllProducts(@Param ('id') id: number) {
    const result = await this.sellerService.getAllProducts(id);
    return result;
  }


}
