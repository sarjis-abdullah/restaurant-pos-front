import { computed } from "vue";

export function usePurchaseAbleProduct(product = {}) {
  const purchasePrice = computed(() => {
    return parseFloat(product.purchasePrice || 0);
  });
  const totalPurchasePrice = computed(() => {
    return parseFloat(product.quantity || 0) * purchasePrice.value;
  });

  const discountPerUnit = computed(() => {
    const discount = parseFloat(product.discount || 0)
    if (product.discountType === "percentage") {
      return (purchasePrice.value * discount) / 100;
    }

    const qty = parseFloat(product.quantity || 0);
    if (qty <= 0) {
      return discount;
    }
    return discount / qty;
  });
  const totalDiscount = computed(() => {
    return discountPerUnit.value * parseFloat(product.quantity || 0);
  });
  const taxType = computed(() => {
    return product.taxType;
  });
  const discountType = computed(() => {
    return product.discountType;
  });

  const taxPerUnit = computed(() => {
    const taxableAmount = purchasePrice.value - discountPerUnit.value;
    if (product.taxType === "percentage") {
      return (taxableAmount * parseFloat(product.tax || 0)) / 100;
    }
    return parseFloat(product.tax || 0);
  });

  const totalTax = computed(() => {
    return taxPerUnit.value * parseFloat(product.quantity || 0);
  });
  const shippingCostPerUnit = computed(() => {
    if (product.quantity <= 0 || product.allocatedShippingCost <= 0) {
      return 0; 
    }
    return parseFloat(product.allocatedShippingCost) / parseFloat(product.quantity);
  });
  const costPerUnit = computed(() => {
    return purchasePrice.value - discountPerUnit.value + taxPerUnit.value + shippingCostPerUnit.value;
  });
  const purchaseSubtotal = computed(() => {
    return totalPurchasePrice.value - totalDiscount.value + totalTax.value + parseFloat(product.allocatedShippingCost || 0);
  });

  const profitPerItem = computed(() => {
    const purchasePriceWithTax = costPerUnit.value;
    return parseFloat(product.sellingPrice || 0) - purchasePriceWithTax;
  });

  const profitPercentage = computed(() => {
    const costPerUnitWithTax = costPerUnit.value; // Cost per unit including tax and discount
    const sellingPrice = parseFloat(product.sellingPrice || 0);

    if (costPerUnitWithTax === 0) return 0; // Avoid division by zero
    return Number(((sellingPrice - costPerUnitWithTax) / costPerUnitWithTax) * 100).toFixed(2);
  });

  const totalProfit = computed(() => {
    return profitPerItem.value * parseFloat(product.quantity || 0);
  });

  return {
    purchasePrice,
    totalPurchasePrice,
    discountPerUnit,
    totalDiscount,
    taxPerUnit,
    totalTax,
    costPerUnit,
    purchaseSubtotal,
    profitPerItem,
    totalProfit,
    profitPercentage,
    taxType,
    discountType,
    shippingCostPerUnit,
    };
}
