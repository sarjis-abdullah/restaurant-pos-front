import { defineStore } from "pinia";
import { DiscountService } from "~/services/DiscountService";

export const useCategoryStore = defineStore("discount", {
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
        const response = await DiscountService.getAll("");

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
