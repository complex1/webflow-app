<template>
  <auth-layout>
      <div
        class="bg-white round-2 shadow-3 p-xl"
        style="max-width: 450px; width: 100%"
      >
        <h1 class="text-xl text-center mb-l">Register</h1>
        <form @submit.prevent="registerUser">
          <wfa-input
            id="name"
            label="Name"
            type="text"
            v-model="user.name"
            placeholder="Enter your name"
            required
            :error="errors.name"
          />

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

          <wfa-input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            v-model="user.confirmPassword"
            placeholder="Confirm your password"
            required
            :error="errors.confirmPassword"
          />

          <button
            type="submit"
            class="btn btn-primary fw mt-m mb-m p-m"
            :class="isSubmitting ? 'opacity-70 cursor-not-allowed' : ''"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? "Registering..." : "Register" }}
          </button>

          <div class="text-center text-m mt-m">
            Already have an account?
            <router-link to="/login" class="text-primary-bg">Login</router-link>
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
  name: "RegisterPage",
  data() {
    return {
      user: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      errors: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      isSubmitting: false,
    };
  },
  methods: {
    validateForm() {
      let isValid = true;
      this.errors = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      };

      // Validate name
      if (!this.user.name.trim()) {
        this.errors.name = "Name is required";
        isValid = false;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.user.email.trim()) {
        this.errors.email = "Email is required";
        isValid = false;
      } else if (!emailRegex.test(this.user.email)) {
        this.errors.email = "Please enter a valid email address";
        isValid = false;
      }

      // Validate password
      if (!this.user.password) {
        this.errors.password = "Password is required";
        isValid = false;
      } else if (this.user.password.length < 6) {
        this.errors.password = "Password must be at least 6 characters";
        isValid = false;
      }

      // Validate confirm password
      if (this.user.password !== this.user.confirmPassword) {
        this.errors.confirmPassword = "Passwords do not match";
        isValid = false;
      }

      return isValid;
    },

    async registerUser() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;

      const userService = new UserService();

      userService
        .register(this.user.name, this.user.email, this.user.password)
        .then(() => {
          // On successful registration
          this.$router.push("/login");
        })
        .catch((error) => {
          alert(error.message || "Registration failed. Please try again.");
        })
        .finally(() => {
          this.isSubmitting = false;
        });
    },
  },
};
</script>

<style scoped lang="scss">

</style>
