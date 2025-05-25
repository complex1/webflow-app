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
          class="btn btn-primary fw mt-m p-m"
          :class="isSubmitting ? 'opacity-70 cursor-not-allowed' : ''"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? "Logging in..." : "Login" }}
        </button>

        <div class="google-auth-section">
          <!-- <div class="google-auth-toggle">
            <span>Enable Google Login</span>
            <toggle-switch
              v-model="enableGoogleAuth"
              @update:modelValue="toggleGoogleAuth"
            />
          </div> -->

          <div v-if="enableGoogleAuth">
            <div class="separator my-m">
              <span>OR</span>
            </div>

            <button
              type="button"
              class="btn btn-google fw mb-m p-m"
              @click="handleGoogleLogin"
              :disabled="isSubmitting || isGoogleLoading"
            >
              <svg
                width="20"
                height="20"
                viewBox="-3 0 262 262"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid"
                fill="#000000"
                class="mx-m"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                    fill="#EB4335"
                  ></path>
                </g>
              </svg>
              {{ isGoogleLoading ? "Loading..." : "Login with Google" }}
            </button>
          </div>
        </div>

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
import { defineComponent, reactive, ref, onMounted } from 'vue';
import authLayout from '../components/common/authLayout.vue';
import { UserService } from '../services/user.service';
import wfaInput from '../components/common/wfa-input.vue';
import toggleSwitch from '../components/common/toggle-switch.vue';
import { googleAuthUtil, GoogleCredentialResponse } from '../utils/google-auth';
import { verifyGoogleSetup, checkGSIScript } from '../utils/google-auth-verify';
import { AUTH_CONFIG } from '../config/auth.config';

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
  components: { authLayout, wfaInput, toggleSwitch },
  name: 'LoginPage',
  setup() {

    const user = reactive<User>({
      email: '',
      password: '',
    });

    const errors = reactive<FormErrors>({
      email: '',
      password: '',
      form: '',
    });

    const isSubmitting = ref<boolean>(false);
    const isGoogleScriptLoaded = ref<boolean>(false);
    const isGoogleLoading = ref<boolean>(false);
    const enableGoogleAuth = ref<boolean>(AUTH_CONFIG.enableGoogleAuth);

    const validateForm = (): boolean => {
      let isValid = true;
      errors.email = '';
      errors.password = '';
      errors.form = '';

      // Validate email
      if (!user.email.trim()) {
        errors.email = 'Email is required';
        isValid = false;
      }

      // Validate password
      if (!user.password) {
        errors.password = 'Password is required';
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
        const response = (await userService.login(
          user.email,
          user.password
        )) as { token: string };
        // Handle successful login
        console.log('Login successful:', response);
        // Store token in localStorage
        localStorage.setItem('token', response.token);
        // Redirect to dashboard after successful login
        window.location.href = '/dashboard';
      } catch (error: any) {
        console.error('Login error:', error);
        errors.form =
          error.response?.data?.message || 'Invalid email or password';
      } finally {
        isSubmitting.value = false;
      }
    };

    // Load Google Sign-In API
    const loadGoogleSignIn = async (): Promise<void> => {
      try {
        await googleAuthUtil.loadScript();
        isGoogleScriptLoaded.value = true;
        initGoogleAuth();
      } catch (error) {
        console.error('Error loading Google Sign-In script:', error);
        errors.form = 'Failed to load Google Sign-In. Please try again later.';
      }
    };

    // Initialize Google Auth
    const initGoogleAuth = (): void => {
      if (!isGoogleScriptLoaded.value) return;

      const initialized = googleAuthUtil.initialize(handleCredentialResponse);
      if (!initialized) {
        console.error('Failed to initialize Google Sign-In');
      }
    };

    // Handle Google credential response
    const handleCredentialResponse = async (
      response: GoogleCredentialResponse
    ): Promise<void> => {
      try {
        isSubmitting.value = true;
        const tokenId = response.credential;
        const userService = new UserService();

        const authResponse = (await userService.googleLogin(tokenId)) as {
          token: string;
        };

        // Store token and redirect
        localStorage.setItem('token', authResponse.token);
        window.location.href = '/dashboard';
      } catch (error: any) {
        console.error('Google login error:', error);
        errors.form =
          error.response?.data?.message || 'Error logging in with Google';
      } finally {
        isSubmitting.value = false;
      }
    };

    // Render Google Sign-In button manually
    const handleGoogleLogin = (): void => {
      if (!isGoogleScriptLoaded.value) {
        errors.form =
          'Google Sign-In is still loading. Please try again in a moment.';
        return;
      }

      isGoogleLoading.value = true;

      const success = googleAuthUtil.prompt();
      if (!success) {
        errors.form = 'Failed to initialize Google Sign-In. Please try again.';
      }

      setTimeout(() => {
        isGoogleLoading.value = false;
      }, 1000);
    };

    /**
     * Toggle Google authentication
     */
    const toggleGoogleAuth = (value: boolean): void => {
      enableGoogleAuth.value = value;

      if (value && !isGoogleScriptLoaded.value) {
        // Load Google Sign-In if enabled
        loadGoogleSignIn().catch((err) => {
          console.error('Failed to load Google Sign-In:', err);
          errors.form =
            'Failed to initialize Google authentication. Please try again later.';
        });

        // Check if GSI script loaded after 2 seconds
        setTimeout(() => {
          checkGSIScript();
        }, 2000);
      }

      // Store the preference in localStorage
      localStorage.setItem('enableGoogleAuth', value ? 'true' : 'false');
    };

    // Load Google Sign-In when component mounts
    onMounted(() => {
      // Get stored preference (default to config value if not stored)
      const storedPref = localStorage.getItem('enableGoogleAuth');
      if (storedPref !== null) {
        enableGoogleAuth.value = storedPref === 'true';
      }

      if (enableGoogleAuth.value) {
        // Run Google authentication verification
        console.log('Running Google authentication verification...');
        verifyGoogleSetup();

        // Load Google Sign-In
        loadGoogleSignIn().catch((err) => {
          console.error('Failed to load Google Sign-In:', err);
          errors.form =
            'Failed to initialize Google authentication. Please try again later.';
        });

        // Check if GSI script loaded after 2 seconds
        setTimeout(() => {
          checkGSIScript();
        }, 2000);
      }
    });

    return {
      user,
      errors,
      isSubmitting,
      isGoogleLoading,
      enableGoogleAuth,
      loginUser,
      handleGoogleLogin,
      toggleGoogleAuth,
    };
  },
});
</script>

<style scoped>
.btn-google {
  background-color: #fff;
  color: #757575;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
}

.btn-google:hover {
  background-color: #f5f5f5;
}

.google-icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
}

.separator::before,
.separator::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.separator span {
  padding: 0 10px;
  color: #757575;
  font-size: 14px;
}

.my-m {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.google-auth-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  margin-top: 1rem;
  border-top: 1px solid #eee;
}

.google-auth-section {
  margin-top: 1.5rem;
}
</style>
