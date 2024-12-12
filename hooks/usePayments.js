// usePayments.js
import { computed } from 'vue';

export function usePayments(payments = []) {
  // Computed property to filter completed payments and sum the amounts
  const hasPayments = computed(()=> !!payments?.length)
  const successfullyPaid = computed(() => {
    if (!hasPayments.value) {
        return 0
    }
    return payments
      .filter(payment => payment.status === 'completed') // Only completed payments
      .reduce((total, payment) => total + payment.amount, 0); // Sum amounts
  });

  // Computed property to filter pending payments
  const pendingPayments = computed(() => {
    return payments.filter(payment => payment.status === 'pending');
  });

  // Computed property to calculate total paid (including all completed payments)
  const totalPaid = computed(() => {
    if (!hasPayments.value) {
        return 0
    }
    return payments
      .filter(payment => payment.status === 'completed')
      .reduce((total, payment) => total + payment.amount, 0);
  });

  return {
    successfullyPaid,
    pendingPayments,
    totalPaid,
  };
}
