import { defineStore } from "pinia";
import { CategoryService } from "~/services/CategoryService";

export const useCategoryStore = defineStore("category", {
  state: () => ({
    categories: [],
  }),
  getters: {
    // Example 3: Count of categories
    categoryList(state) {
      return state.categories;
    },
  },
  actions: {
    async fetchCategories() {
      try {
        const response = await CategoryService.getAll("");

        console.log(response.data, "response");
        this.categories = response.data || [];
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        this.loading = false;
      }
    },
  },
});
