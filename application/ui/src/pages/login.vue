<template>
 <auth-layout>
    <div
      class="bg-white round-2 shadow-3 p-xl"
      style="max-width: 450px; width: 100%"
    >
      <h1 class="text-xl text-center mb-l">Login</h1>
      <form @submit.prevent="loginUser">
        <wfa-input
          id="email"
          label="Email"
          type="email"
          v-model="user.email"
          placeholder="Enter your email"
          required
          :error="errors.email"
        />

        <wfa-input
          id="password"
          label="Password"
          type="password"
          v-model="user.password"
          placeholder="Enter your password"
          required
          :error="errors.password"
        />

        <div v-if="errors.form" class="text-danger text-s mb-m">
          {{ errors.form }}
        </div>

        <button
          type="submit"
          class="btn btn-primary fw mt-m mb-m p-m"
          :class="isSubmitting ? 'opacity-70 cursor-not-allowed' : ''"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? "Logging in..." : "Login" }}
        </button>

        <div class="text-center text-m mt-m">
          Don't have an account?
          <router-link to="/register" class="text-primary-bg"
            >Register</router-link
          >
        </div>
      </form>
    </div>
  </auth-layout>
</template>

<script>
import authLayout from '../components/common/authLayout.vue';
import { UserService } from "../services/user.service.ts";
import wfaInput from "../components/common/wfa-input.vue";

export default {
  components: { authLayout, wfaInput },
  name: "LoginPage",
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      errors: {
        email: "",
        password: "",
        form: "",
      },
      isSubmitting: false,
    };
  },
  methods: {
    validateForm() {
      let isValid = true;
      this.errors = {
        email: "",
        password: "",
        form: "",
      };

      // Validate email
      if (!this.user.email.trim()) {
        this.errors.email = "Email is required";
        isValid = false;
      }

      // Validate password
      if (!this.user.password) {
        this.errors.password = "Password is required";
        isValid = false;
      }

      return isValid;
    },

    async loginUser() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;

      const userService = new UserService();

      userService
        .login(this.user.email, this.user.password)
        .then((response) => {
          // Handle successful login
          console.log("Login successful:", response);
          // Store token in localStorage
          localStorage.setItem("token", response.token);
          // Redirect to home page after successful login
          this.$router.push("/");
        })
        .catch((error) => {
          console.error("Login error:", error);
          this.errors.form =
            error.response.data.message || "Invalid email or password";
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
  },
};
</script>
