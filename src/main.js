import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import ToastService from "primevue/toastservice";
import Aura from "@primevue/themes/aura";
import Lara from "@primevue/themes/lara";
import Material from "@primevue/themes/material";
import "./assets/main.css";
import "primeicons/primeicons.css";

const app = createApp(App);
// You can use other PrimeVue themes by importing them and setting the `preset` property.
// Some popular themes include:
// - Lara (default): import Lara from "@primevue/themes/lara";
// - Saga: import Saga from "@primevue/themes/saga";
// - Vela: import Vela from "@primevue/themes/vela";
// - Arya: import Arya from "@primevue/themes/arya";
// - Nova: import Nova from "@primevue/themes/nova";
// - Fluent: import Fluent from "@primevue/themes/fluent";
// - Bootstrap4: import Bootstrap4 from "@primevue/themes/bootstrap4";

// Example usage with Lara theme:
app.use(PrimeVue, {
  theme: {
    preset: Material,
    options: { prefix: "p", darkModeSelector: ".my-app-dark" },
  },
});
app.use(ToastService);
app.mount("#app");
