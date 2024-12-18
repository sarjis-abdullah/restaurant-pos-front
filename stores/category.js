import { defineStore } from "pinia";
import { CategoryService } from "~/services/CategoryService";

export const useCategoryStore = defineStore("category", {
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
        const response = await CategoryService.getAll("");

        console.log(response.data, "response");
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
