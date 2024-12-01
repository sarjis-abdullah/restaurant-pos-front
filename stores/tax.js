import { defineStore } from "pinia";
import { TaxService } from "~/services/TaxService";

export const useCategoryStore = defineStore("tax", {
  state: () => ({
    items: [],
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

        console.log(response.data, "response");
        this.categories = response.data || [];
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
