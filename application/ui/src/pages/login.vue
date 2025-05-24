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
          <div class="google-auth-toggle">
            <span>Enable Google Login</span>
            <toggle-switch v-model="enableGoogleAuth" @update:modelValue="toggleGoogleAuth" />
          </div>
          
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
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google Logo" class="google-icon" />
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
import { useRouter } from 'vue-router';
import authLayout from '../components/common/authLayout.vue';
import { UserService } from "../services/user.service";
import wfaInput from "../components/common/wfa-input.vue";
import toggleSwitch from "../components/common/toggle-switch.vue";
import { googleAuthUtil, GoogleCredentialResponse } from "../utils/google-auth";
import { verifyGoogleSetup, checkGSIScript } from "../utils/google-auth-verify";
import { AUTH_CONFIG } from "../config/auth.config";

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
    const isGoogleScriptLoaded = ref<boolean>(false);
    const isGoogleLoading = ref<boolean>(false);
    const googleAuth = ref<any>(null);
    const enableGoogleAuth = ref<boolean>(AUTH_CONFIG.enableGoogleAuth);
    
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
    
    // Load Google Sign-In API
    const loadGoogleSignIn = async (): Promise<void> => {
      try {
        await googleAuthUtil.loadScript();
        isGoogleScriptLoaded.value = true;
        initGoogleAuth();
      } catch (error) {
        console.error('Error loading Google Sign-In script:', error);
        errors.form = "Failed to load Google Sign-In. Please try again later.";
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
    const handleCredentialResponse = async (response: GoogleCredentialResponse): Promise<void> => {
      try {
        isSubmitting.value = true;
        const tokenId = response.credential;
        const userService = new UserService();
        
        const authResponse = await userService.googleLogin(tokenId) as { token: string };
        
        // Store token and redirect
        localStorage.setItem("token", authResponse.token);
        router.push("/dashboard");
      } catch (error: any) {
        console.error('Google login error:', error);
        errors.form = error.response?.data?.message || "Error logging in with Google";
      } finally {
        isSubmitting.value = false;
      }
    };
    
    // Render Google Sign-In button manually
    const handleGoogleLogin = (): void => {
      if (!isGoogleScriptLoaded.value) {
        errors.form = "Google Sign-In is still loading. Please try again in a moment.";
        return;
      }
      
      isGoogleLoading.value = true;
      
      const success = googleAuthUtil.prompt();
      if (!success) {
        errors.form = "Failed to initialize Google Sign-In. Please try again.";
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
        loadGoogleSignIn().catch(err => {
          console.error('Failed to load Google Sign-In:', err);
          errors.form = "Failed to initialize Google authentication. Please try again later.";
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
        loadGoogleSignIn().catch(err => {
          console.error('Failed to load Google Sign-In:', err);
          errors.form = "Failed to initialize Google authentication. Please try again later.";
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
      toggleGoogleAuth
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
  content: '';
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
