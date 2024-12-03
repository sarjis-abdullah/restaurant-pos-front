import { defineStore } from "pinia";
import { MenuService } from "~/services/MenuService";

export const useMenuStore = defineStore("menu", {
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
        const response = await MenuService.getAll("");

        console.log(response.data, "response");
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
