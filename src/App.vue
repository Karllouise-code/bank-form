<template>
  <div class="app-container">
    <div v-if="!isAuthenticated" class="auth-container">
      <h2>Enter Secret Code</h2>
      <InputText
        v-model="secretCode"
        type="password"
        placeholder="Enter code"
        class="secret-input"
        @keyup.enter="checkCode"
      />
      <Button
        label="Submit"
        @click="checkCode"
        class="submit-button"
        :disabled="!secretCode"
      />
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
    <BankForm v-else />
  </div>
</template>

<script>
import BankForm from "./components/BankForm.vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

export default {
  components: { BankForm, InputText, Button },
  data() {
    return {
      secretCode: "",
      isAuthenticated: false,
      errorMessage: "",
    };
  },
  methods: {
    checkCode() {
      if (this.secretCode === "SECRET123") {
        // Replace with your secret code
        this.isAuthenticated = true;
        this.errorMessage = "";
      } else {
        this.errorMessage = "Incorrect code. Try again.";
      }
    },
  },
};
</script>

<style scoped>
h2 {
  color: #4caf50;
}

.auth-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.secret-input {
  margin: 1rem 0;
  width: 200px;
}

.submit-button {
  margin-top: 1rem;
  background-color: #4caf50;
  color: white;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}
</style>
