import { defineStore } from "pinia";
import { SupplierService } from "~/services/SupplierService";

export const useSupplierStore = defineStore("supplier", {
  state: () => ({
    items: [],
    selectedItem: null,
  }),
  getters: {
    // Example 3: Count of categories
    itemList(state) {
      return state.items;
    },
  },
  actions: {
    async fetchList() {
      try {
        const response = await SupplierService.getAll("");

        console.log(response.data, "SupplierService");
        this.items = response.data || [];
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        this.loading = false;
      }
    },
    setSelectedItem(id) {
      this.selectedItem = id;
    },
  },
});
