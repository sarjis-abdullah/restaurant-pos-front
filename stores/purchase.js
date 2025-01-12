import { defineStore } from "pinia";
import { usePurchaseAbleProduct } from "~/hooks/usePurchaseAbleProduct";
import { ProductService } from "~/services/ProductService";
import { SupplierService } from "~/services/SupplierService";

export const usePurchaseStore = defineStore("purchase", {
  state: () => ({
    cartProducts: [],
    selectedItem: null,
    allocatedShippingCost: 0,
  }),
  getters: {
    purchaseDetails: (state) => () => {
      let totalPurchasePriceAll = 0
      let totalTaxAll = 0
      let totalDiscountAll = 0
      let purchaseSubtotalAll = 0
      let totalQuantityAll = 0
      const totalCardProducts = state.cartProducts?.length
      for (let i = 0; i < totalCardProducts; i++) {
        const el = state.cartProducts[i];
        el.allocatedShippingCost = state.allocatedShippingCost;

        const {
          totalPurchasePrice, 
          totalTax,
          totalDiscount,
          purchaseSubtotal
        } = usePurchaseAbleProduct(el);

        totalPurchasePriceAll += totalPurchasePrice.value;
        totalTaxAll += totalTax.value;
        totalDiscountAll += totalDiscount.value;
        purchaseSubtotalAll += purchaseSubtotal.value;
        totalQuantityAll += parseFloat(el.quantity || 0);
      }
      return {
        totalCardProducts,
        totalPurchasePriceAll,
        totalTaxAll,
        totalDiscountAll,
        purchaseSubtotalAll,
        totalQuantityAll,
      }
    },
    purchaseProducts: (state) => () => {
      return state.cartProducts?.map((el)=> {
        const {
          costPerUnit,
        } = usePurchaseAbleProduct(el);
        return {
          quantity: el.quantity,
          purchase_price: el.purchasePrice,
          selling_price: el.sellingPrice,
          cost_per_unit: costPerUnit.value,
          tax: el.tax,
          tax_type: el.taxType,
          discount: el.discount,
          discount_type: el.discountType,
        }
      })
    },
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
    setAllocatedShippingCost(cost) {
      this.allocatedShippingCost = cost;
    },
  },
});
