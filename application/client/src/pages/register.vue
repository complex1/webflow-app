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

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import authLayout from '../components/common/authLayout.vue';
import { UserService } from '../services/user.service';
import wfaInput from '../components/common/wfa-input.vue';
import { error } from '../lib/toast';

interface User {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormErrors {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default defineComponent({
  components: { authLayout, wfaInput },
  name: 'RegisterPage',
  setup() {
    const router = useRouter();
    
    const user = reactive<User>({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    
    const errors = reactive<RegisterFormErrors>({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    
    const isSubmitting = ref<boolean>(false);
    
    const validateForm = (): boolean => {
      let isValid = true;
      
      // Reset errors
      errors.name = '';
      errors.email = '';
      errors.password = '';
      errors.confirmPassword = '';

      // Validate name
      if (!user.name.trim()) {
        errors.name = 'Name is required';
        isValid = false;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!user.email.trim()) {
        errors.email = 'Email is required';
        isValid = false;
      } else if (!emailRegex.test(user.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
      }

      // Validate password
      if (!user.password) {
        errors.password = 'Password is required';
        isValid = false;
      } else if (user.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
        isValid = false;
      }

      // Validate confirm password
      if (user.password !== user.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }

      return isValid;
    };

    const registerUser = async (): Promise<void> => {
      if (!validateForm()) {
        return;
      }

      isSubmitting.value = true;

      const userService = new UserService();

      try {
        await userService.register(user.name, user.email, user.password, '');
        // On successful registration
        router.push('/login');
      } catch (e: any) {
        error(e.message || 'Registration failed. Please try again.');
      } finally {
        isSubmitting.value = false;
      }
    };
    
    return {
      user,
      errors,
      isSubmitting,
      registerUser
    };
  },
});
</script>

<style scoped lang="scss">

</style>
