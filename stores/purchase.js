import { defineStore } from "pinia";
import { ProductService } from "~/services/ProductService";
import { SupplierService } from "~/services/SupplierService";

export const usePurchaseStore = defineStore("purchase", {
  state: () => ({
    cartProducts: [],
    selectedItem: null,
  }),
  getters: {
    // Example 3: Count of categories
    // itemList(state) {
    //   return state.cartProducts;
    // },
  },
  actions: {
    async getProductsBy(query='') {
      try {
        const response = await ProductService.getAll(query);

        console.log(response.data, "ProductService");
        this.cartProducts = response.data || [];
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        this.loading = false;
      }
    },
    addToCart(item) {
      const found = this.cartProducts.find((product) => product.id === item.id);
      if (!found ) {
        this.cartProducts.push(item);
      }
    },
    removeCartItem(id) {
      this.cartProducts = this.cartProducts.filter((product) => product.id != id);
    },
    updateItem(index, key, value) {
      console.log(index, key, value);
      this.cartProducts[index][key] = value; // Update specific field of the item
    },
    decreaseCartItem(item) {
      this.cartProducts.map((product) => {
        product.id === item.id ? product.quantity -= 1 : product;
        return product;
      });
    },
  },
});
