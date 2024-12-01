import { defineStore } from "pinia";
import { BranchService } from "~/services/BranchService";

export const useBranchStore = defineStore("branch", {
  state: () => ({
    branches: [],
    selectedBranch: null,
  }),
  getters: {
    // Example 3: Count of categories
    branchList(state) {
      return state.branches;
    },
  },
  actions: {
    async fetchList() {
      try {
        const response = await BranchService.getAll("");
        this.branches = response.data || [];
      } catch (error) {
        throw error
      }
    },
    setSelectedBranch(branchId) {
      this.selectedBranch = branchId;
    },
  },
});
