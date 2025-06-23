<template>
  <div class="form-container rounded-xl">
    <Card class="bank-card">
      <template #header>
        <div class="card-header">
          <h2 class="form-title">Secure Bank Information</h2>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="submitForm" class="form-content">
          <div class="field-group">
            <FloatLabel variant="on">
              <InputText
                id="name"
                v-model="form.name"
                :class="{ 'p-invalid': errors.name }"
                class="form-input"
              />
              <label for="name">Full Name</label>
            </FloatLabel>
            <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
          </div>

          <div class="field-group">
            <FloatLabel variant="on">
              <InputText
                id="email"
                v-model="form.email"
                :class="{ 'p-invalid': errors.email }"
                class="form-input"
              />
              <label for="email">Email Address</label>
            </FloatLabel>
            <small v-if="errors.email" class="p-error">{{
              errors.email
            }}</small>
          </div>

          <div class="field-group">
            <FloatLabel variant="on">
              <InputText
                id="cardNumber"
                v-model="form.cardNumber"
                maxlength="4"
                :class="{ 'p-invalid': errors.cardNumber }"
                class="form-input"
              />
              <label for="cardNumber">Card Number (Last 4 Digits)</label>
            </FloatLabel>
            <small v-if="errors.cardNumber" class="p-error">{{
              errors.cardNumber
            }}</small>
          </div>

          <div class="field-row">
            <div class="field-group">
              <FloatLabel variant="on">
                <InputText
                  id="cvc"
                  v-model="form.cvc"
                  maxlength="4"
                  :class="{ 'p-invalid': errors.cvc }"
                  class="form-input"
                />
                <label for="cvc">CVC</label>
              </FloatLabel>
              <small v-if="errors.cvc" class="p-error">{{ errors.cvc }}</small>
            </div>

            <div class="field-group">
              <FloatLabel variant="on">
                <InputMask
                  id="expiry"
                  v-model="form.expiry"
                  mask="99/99"
                  :class="{ 'p-invalid': errors.expiry }"
                  class="form-input"
                />
                <label for="expiry">Expiry (MM/YY)</label>
              </FloatLabel>
              <small v-if="errors.expiry" class="p-error">{{
                errors.expiry
              }}</small>
            </div>
          </div>

          <Button
            type="submit"
            label="Submit Information"
            :disabled="isSubmitting"
            :loading="isSubmitting"
            class="submit-button"
            icon="pi pi-lock"
          />
        </form>
      </template>
    </Card>
    <Toast position="top-right" />
  </div>
</template>

<script>
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

export default {
  components: {
    Card,
    InputText,
    InputMask,
    FloatLabel,
    Button,
    Toast,
  },
  data() {
    return {
      form: {
        name: "",
        email: "",
        cardNumber: "",
        cvc: "",
        expiry: "",
      },
      errors: {},
      isSubmitting: false,
    };
  },
  methods: {
    validateForm() {
      this.errors = {};
      if (!this.form.name) this.errors.name = "Name is required";
      if (!this.form.email || !/\S+@\S+\.\S+/.test(this.form.email))
        this.errors.email = "Valid email is required";
      if (!this.form.cardNumber || !/^\d{4}$/.test(this.form.cardNumber))
        this.errors.cardNumber = "Exactly 4 digits required";
      if (!this.form.cvc || !/^\d{3,4}$/.test(this.form.cvc))
        this.errors.cvc = "CVC must be 3 or 4 digits";
      if (!this.form.expiry || !/^\d{2}\/\d{2}$/.test(this.form.expiry))
        this.errors.expiry = "Valid expiry (MM/YY) required";
      else {
        const [month, year] = this.form.expiry.split("/").map(Number);
        const currentDate = new Date();
        const expiryDate = new Date(2000 + year, month - 1);
        if (month < 1 || month > 12) this.errors.expiry = "Invalid month";
        else if (expiryDate < currentDate)
          this.errors.expiry = "Card has expired";
      }
      return Object.keys(this.errors).length === 0;
    },
    async submitForm() {
      const toast = useToast();
      if (!this.validateForm()) {
        toast.add({
          severity: "error",
          summary: "Validation Error",
          detail: "Please fix the errors in the form",
          life: 3000,
        });
        return;
      }

      this.isSubmitting = true;
      try {
        // Simulate API call - replace with your actual submission logic
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.add({
          severity: "success",
          summary: "Success",
          detail: "Information saved successfully",
          life: 3000,
        });

        // Reset form
        this.form = {
          name: "",
          email: "",
          cardNumber: "",
          cvc: "",
          expiry: "",
        };
      } catch (error) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Failed to save information",
          life: 3000,
        });
        console.error("Error saving information:", error);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

.form-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: "Inter", sans-serif;
}

.bank-card {
  width: 100%;
  max-width: 480px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.95);
}

.card-header {
  padding: 2rem 2rem 1rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.form-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.025em;
}

.form-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.field-group {
  position: relative;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: "Inter", sans-serif;
  transition: all 0.3s ease;
  background: #ffffff;
}

.form-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  outline: none;
}

.form-input.p-invalid {
  border-color: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
}

.submit-button {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.p-error {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

/* PrimeVue Component Overrides */
:deep(.p-card) {
  border: none;
  box-shadow: none;
  background: transparent;
}

:deep(.p-card .p-card-body) {
  padding: 0;
}

:deep(.p-card .p-card-content) {
  padding: 0;
}

:deep(.p-card .p-card-header) {
  padding: 0;
  border: none;
  background: transparent;
}

:deep(.p-float-label label) {
  font-weight: 500;
  color: #64748b;
  transition: all 0.3s ease;
}

:deep(.p-float-label .p-focus ~ label),
:deep(.p-float-label .p-filled ~ label) {
  color: #667eea;
  font-weight: 600;
}

:deep(.p-button) {
  font-family: "Inter", sans-serif;
}

:deep(.p-button .p-button-icon) {
  margin-right: 0.5rem;
}

/* Responsive Design */
@media (max-width: 640px) {
  .form-container {
    padding: 1rem;
  }

  .form-content {
    padding: 1.5rem;
  }

  .field-row {
    grid-template-columns: 1fr;
  }

  .form-title {
    font-size: 1.5rem;
  }
}
</style>
