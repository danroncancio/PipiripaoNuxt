import { defineStore } from "pinia";

export interface Product {
  sku: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
}

interface ProductState {
  products: Product[] | undefined[];
}

export const useCart = defineStore("cart", {
  state: (): ProductState => ({
    products: [],
  }),
  getters: {
    getBySKU: (state: ProductState) => (sku: string) => {
      return state.products.find((product) => product.sku === sku);
    },
  },
  actions: {
    add(product: Product) {
      this.products.push(product);
      console.log(this.products, this.products.length);
    },
    remove(sku: string, color: string) {
      console.log(sku, color);
      this.products = this.products.filter(
        (product) => product.sku !== sku || product.color !== color
      );
    },
    reset() {
      this.products = [];
    },
  },
});
