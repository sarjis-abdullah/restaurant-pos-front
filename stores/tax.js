import { defineStore } from "pinia";
import { TaxService } from "~/services/TaxService";

export const useTaxStore = defineStore("tax", {
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
        const response = await TaxService.getAll("");

        console.log(response.data, "response tax");
        this.items = response.data || [];
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        this.loading = false;
      }
    },
    setSelectedItem(id) {
      this.selectedItem = id;
    },
  },
});
