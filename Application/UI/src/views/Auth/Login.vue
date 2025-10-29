<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Left Information Section -->
      <div class="info-section">
        <h1 class="info-title">WELCOME BACK</h1>
        <div class="info-content">
          <p>
            Welcome back to our platform! Sign in to access your account and continue 
            your journey with us. We're excited to have you back.
          </p>
          <p>
            If you're new here, don't worry! You can create a new account in just a few 
            simple steps and start exploring all the amazing features we have to offer.
          </p>
        </div>
        <UiButton 
          variant="secondary" 
          size="lg" 
          class="info-button"
          @click="navigateToRegister"
        >
          Create Account
        </UiButton>
      </div>

      <!-- Right Form Section -->
      <div class="form-section">
        <h1 class="form-title">LOGIN FORM</h1>
        
        <form @submit.prevent="handleSubmit" class="login-form">
          <UiInput
            v-model="formData.email"
            type="email"
            label="Your Email"
            placeholder="Enter your email"
            required
            :error="errors.email"
            left-icon="envelope"
          />

          <div class="password-field">
            <UiInput
              v-model="formData.password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              required
              :error="errors.password"
              left-icon="lock"
            />
          </div>

          <div class="form-options">
            <label class="remember-checkbox">
              <input 
                v-model="formData.rememberMe"
                type="checkbox"
              />
              <span class="checkmark"></span>
              <span class="remember-text">Remember me</span>
            </label>
            
            <a href="#" class="forgot-link" @click.prevent="handleForgotPassword">
              Forgot Password?
            </a>
          </div>

          <UiButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="isSubmitting"
            full-width
            class="submit-button"
          >
            Sign In
          </UiButton>

          <div class="divider">
            <span class="divider-text">or</span>
          </div>

          <UiButton
            variant="secondary"
            size="lg"
            full-width
            class="social-button"
            @click="handleSocialLogin"
          >
            <i class="fab fa-google"></i>
            Continue with Google
          </UiButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { UiInput, UiButton } from '@/components/base'
import { userService, type LoginRequest } from '@/services'
import { toast } from '@/utils'
import { useUserStore } from '@/stores/user'
import router from '@/router'

interface FormData {
  email: string
  password: string
  rememberMe: boolean
}

interface FormErrors {
  email?: string
  password?: string
}

const formData = reactive<FormData>({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive<FormErrors>({})
const isSubmitting = ref(false)
const userStore = useUserStore()

// Form validation
const validateForm = (): boolean => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    delete errors[key as keyof FormErrors]
  })

  let isValid = true

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Password validation
  if (!formData.password) {
    errors.password = 'Password is required'
    isValid = false
  }

  return isValid
}

// Form submission
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const loginData = {
      email: formData.email,
      password: formData.password
    } as LoginRequest

    const response = await userService.login(loginData)
    
    if (response.message && response.token && response.user) {
      // Use the user store to handle login
      userStore.login(response.user, response.token)
      
      toast.success(response.message)
      
      // Navigate to dashboard or home page
      router.push('/webflow')
    } else {
      toast.error('Login failed. Please try again.')
    }
    
  } catch (error: any) {
    toast.error(error?.response?.data?.error || 'Login failed. Please check your credentials.')
  } finally {
    isSubmitting.value = false
  }
}

const navigateToRegister = () => {
  router.push('/register')
}

const handleForgotPassword = () => {
  toast.info('Forgot password functionality will be implemented soon.')
}

const handleSocialLogin = () => {
  toast.info('Social login functionality will be implemented soon.')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.login-container {
  display: flex;
  background: var(--color-background);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  max-width: 900px;
  width: 100%;
  min-height: 600px;
}

/* Left Information Section */
.info-section {
  background: var(--color-primary-dark);
  color: var(--color-text-inverse);
  padding: var(--spacing-3xl) var(--spacing-xl);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 0 0 40%;
  min-height: 600px;
}

.info-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-xl) 0;
  letter-spacing: 2px;
}

.info-content {
  flex: 1;
  margin-bottom: var(--spacing-xl);
}

.info-content p {
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-lg);
  opacity: 0.9;
  color: var(--color-text-inverse);
}

.info-button {
  background: var(--color-background) !important;
  color: var(--color-primary-dark) !important;
  border: none !important;
  font-weight: var(--font-weight-semibold);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.info-button:hover {
  background: var(--color-background-secondary) !important;
  /* transform: translateY(-1px); */
}

/* Right Form Section */
.form-section {
  padding: var(--spacing-3xl) var(--spacing-xl);
  flex: 0 0 60%;
  display: flex;
  flex-direction: column;
}

.form-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-dark);
  margin: 0 0 var(--spacing-xl) 0;
  letter-spacing: 2px;
}

.login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.password-field {
  position: relative;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: var(--spacing-sm) 0;
}

.remember-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.remember-checkbox input[type="checkbox"] {
  display: none;
}

.remember-checkbox .checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-border-focus);
  border-radius: var(--radius-sm);
  margin-right: var(--spacing-sm);
  position: relative;
  transition: all var(--transition-fast);
}

.remember-checkbox input[type="checkbox"]:checked + .checkmark {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.remember-checkbox input[type="checkbox"]:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid var(--color-text-inverse);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.forgot-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
}

.forgot-link:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

.submit-button {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.divider {
  position: relative;
  text-align: center;
  margin: var(--spacing-lg) 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--color-border);
}

.divider-text {
  background: var(--color-background);
  padding: 0 var(--spacing-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  position: relative;
  z-index: 1;
}

.social-button {
  background: var(--color-background-secondary) !important;
  color: var(--color-text-primary) !important;
  border: 1px solid var(--color-border) !important;
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
}

.social-button:hover {
  background: var(--color-gray-100) !important;
  border-color: var(--color-gray-300) !important;
}

.social-button i {
  margin-right: var(--spacing-sm);
  color: #db4437;
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    max-width: 100%;
  }
  
  .info-section,
  .form-section {
    flex: none;
  }
  
  .info-section {
    min-height: auto;
    padding: var(--spacing-xl) var(--spacing-lg);
  }
  
  .form-section {
    padding: var(--spacing-xl) var(--spacing-lg);
  }
  
  .info-title,
  .form-title {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: var(--spacing-md);
  }
  
  .info-section,
  .form-section {
    padding: var(--spacing-lg) var(--spacing-md);
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
}
</style>
