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

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import authLayout from '../components/common/authLayout.vue';
import { UserService } from "../services/user.service";
import wfaInput from "../components/common/wfa-input.vue";

interface User {
  email: string;
  password: string;
}

interface FormErrors {
  email: string;
  password: string;
  form: string;
}

export default defineComponent({
  components: { authLayout, wfaInput },
  name: "LoginPage",
  setup() {
    const router = useRouter();
    
    const user = reactive<User>({
      email: "",
      password: "",
    });
    
    const errors = reactive<FormErrors>({
      email: "",
      password: "",
      form: "",
    });
    
    const isSubmitting = ref<boolean>(false);
    
    const validateForm = (): boolean => {
      let isValid = true;
      errors.email = "";
      errors.password = "";
      errors.form = "";

      // Validate email
      if (!user.email.trim()) {
        errors.email = "Email is required";
        isValid = false;
      }

      // Validate password
      if (!user.password) {
        errors.password = "Password is required";
        isValid = false;
      }

      return isValid;
    };

    const loginUser = async (): Promise<void> => {
      if (!validateForm()) {
        return;
      }

      isSubmitting.value = true;

      const userService = new UserService();

      try {
        // Specify the expected response type
        const response = await userService.login(user.email, user.password) as { token: string };
        // Handle successful login
        console.log("Login successful:", response);
        // Store token in localStorage
        localStorage.setItem("token", response.token);
        // Redirect to home page after successful login
        router.push("/");
      } catch (error: any) {
        console.error("Login error:", error);
        errors.form = error.response?.data?.message || "Invalid email or password";
      } finally {
        isSubmitting.value = false;
      }
    };
    
    return {
      user,
      errors,
      isSubmitting,
      loginUser
    };
  },
});
</script>
