<template>
 <auth-layout>
    <div
      class="bg-white round-2 shadow-3 p-xl"
      style="max-width: 450px; width: 100%"
    >
      <h1 class="text-xl text-center mb-l">Login</h1>
      <form @submit.prevent="loginUser">
        <div class="mb-m wfa-input">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="user.email"
            placeholder="Enter your email"
            required
          />
          <span class="text-danger text-s" v-if="errors.email">{{
            errors.email
          }}</span>
        </div>

        <div class="mb-m wfa-input">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="user.password"
            placeholder="Enter your password"
            required
          />
          <span class="text-danger text-s" v-if="errors.password">{{
            errors.password
          }}</span>
        </div>

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
export default {
  components: { authLayout },
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
