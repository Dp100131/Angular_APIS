import { Component, OnInit } from '@angular/core';

import { CreateProductDTO, Product, UpdateProductDTO } from '../../models/product.model';

import { StoreService } from '../../services/store.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  products: Product[] = [];
  showProductDetail = false;
  productChoosen: Product = {
    id: '',
    price: 0,
    images: [],
    title: '',
    category: {
      id:'',
      name:'',
    },
    description: ''
  };
  limit = 10;
  offset = 0;
  statusDetail: 'loading' | 'succes' | 'error' | 'init' = 'init';

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getAllProducts(this.limit, this.offset)
    .subscribe(data => {
      this.products = data;
    });
  }

  onAddToShoppingCart(product: Product) {
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail(){
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string){
    this.statusDetail = 'loading';
    this.productsService.getProduct(id).subscribe(data => {
      this.productChoosen = data;
      this.toggleProductDetail();
      this.statusDetail = 'succes';
    }, response => {
      this.statusDetail = 'error';
      this.toggleProductDetail();
    });
  }

  createNewProduct(){
    const product: CreateProductDTO = {
      title: 'Nuevo Producto',
      description:'bla bla bla',
      images: [''],
      price: 1000,
      categoryId: 1
    }
    this.productsService.create(product).subscribe(data => {
      this.products.unshift(data);
    });
  }

  updateProduct(){

    const changes: UpdateProductDTO = {
      title: 'Change tittle'
    }

    this.productsService.update(this.productChoosen.id, changes).subscribe(data => {
      const productIndex = this.products.findIndex(item => item.id === this.productChoosen.id);
      this.products[productIndex] = data;
      this.productChoosen = data;
    });

  }

  deleteProduct(){
    const id = this.productChoosen.id
    this.productsService.delete(id).subscribe(data => {
      console.log(data);
      const productIndex = this.products.findIndex(item => item.id === id);
      this.products.splice(productIndex, 1);
      this.showProductDetail = false;
    });
  }

  loadMore(){
    this.offset += this.limit;
    this.productsService.getAllProducts(this.limit, this.offset)
    .subscribe(data => {
      this.products = this.products.concat(data);
    });
  }

}
