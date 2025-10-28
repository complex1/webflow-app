<template>
  <div class="register-page">
    <div class="register-container">
      <!-- Left Information Section -->
      <div class="info-section">
        <h1 class="info-title">INFORMATION</h1>
        <div class="info-content">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
            exercitation ullamco laboris.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
          </p>
        </div>
        <UiButton 
          variant="secondary" 
          size="lg" 
          class="info-button"
          @click="navigateToLogin"
        >
          Have An Account
        </UiButton>
      </div>

      <!-- Right Form Section -->
      <div class="form-section">
        <h1 class="form-title">REGISTER FORM</h1>
        
        <form @submit.prevent="handleSubmit" class="register-form">
          <div class="form-row">
            <UiInput
              v-model="formData.firstName"
              label="First Name"
              placeholder="Enter your first name"
              required
              :error="errors.firstName"
            />
            <UiInput
              v-model="formData.lastName"
              label="Last Name"
              placeholder="Enter your last name"
              required
              :error="errors.lastName"
            />
          </div>

          <UiInput
            v-model="formData.email"
            type="email"
            label="Your Email"
            placeholder="Enter your email"
            required
            :error="errors.email"
          />

          <div class="password-field">
            <UiInput
              v-model="formData.password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              required
              :error="errors.password"
            />
            <div class="password-strength">
              <div 
                class="strength-indicator"
                :class="passwordStrengthClass"
              ></div>
            </div>
          </div>

          <div class="password-field">
            <UiInput
              v-model="formData.confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              required
              :error="errors.confirmPassword"
            />
            <div class="password-match">
              <i 
                v-if="formData.confirmPassword"
                :class="passwordMatchIcon"
                :style="{ color: passwordMatchColor }"
              ></i>
            </div>
          </div>

          <div class="terms-section">
            <label class="terms-checkbox">
              <input 
                v-model="formData.agreeTerms"
                type="checkbox"
                required
              />
              <span class="checkmark"></span>
              <span class="terms-text">
                I agree to the 
                <a href="#" class="terms-link">Terms and Conditions</a>
              </span>
            </label>
          </div>

          <UiButton
            type="submit"
            variant="primary"
            size="lg"
            :loading="isSubmitting"
            full-width
            class="submit-button"
          >
            Register
          </UiButton>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { UiInput, UiButton } from '@/components/base'
import { userService, type RegisterRequest } from '@/services'
import { alert } from '@/utils'
import router from '@/router'

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const formData = reactive<FormData>({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false
})

const errors = reactive<FormErrors>({})
const isSubmitting = ref(false)

// Password strength calculation
const passwordStrength = computed(() => {
  const password = formData.password
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  
  return strength
})

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength <= 2) return 'weak'
  if (strength <= 3) return 'medium'
  return 'strong'
})

// Password match validation
const passwordMatchIcon = computed(() => {
  if (!formData.confirmPassword) return ''
  return formData.password === formData.confirmPassword 
    ? 'fas fa-check-circle' 
    : 'fas fa-exclamation-triangle'
})

const passwordMatchColor = computed(() => {
  if (!formData.confirmPassword) return ''
  return formData.password === formData.confirmPassword ? '#4CAF50' : '#FF9800'
})

// Form validation
const validateForm = (): boolean => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    delete errors[key as keyof FormErrors]
  })

  let isValid = true

  // First name validation
  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required'
    isValid = false
  }

  // Last name validation
  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required'
    isValid = false
  }

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
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long'
    isValid = false
  }

  // Confirm password validation
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
    isValid = false
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
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
    const registerData = {
      username: formData.firstName + ' ' + formData.lastName,
      email: formData.email,
      password: formData.password
    } as RegisterRequest
    const response = await userService.register(registerData)
    if (response.message) {
      alert.success(response.message)
    } else {
      alert.error('Registration failed. Please try again.')
    }

    // Reset form after successful submission
    Object.assign(formData, {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    })
    
  } catch (error: any) {
    alert.error(error?.response?.data?.error || 'Registration failed. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const navigateToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.register-container {
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
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
  opacity: 0.9;
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

.register-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.password-field {
  position: relative;
}

.password-strength {
  margin-top: var(--spacing-xs);
  width: 12px;
  height: 12px;
  border-radius: var(--radius-full);
}

.strength-indicator {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-full);
  transition: all var(--transition-slow);
}

.strength-indicator.weak {
  background: var(--color-error);
}

.strength-indicator.medium {
  background: var(--color-warning);
}

.strength-indicator.strong {
  background: var(--color-success);
}

.password-match {
  position: absolute;
  right: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--font-size-base);
}

.terms-section {
  margin: var(--spacing-md) 0;
}

.terms-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.terms-checkbox input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-gray-300);
  border-radius: var(--radius-sm);
  margin-right: var(--spacing-md);
  position: relative;
  transition: all var(--transition-fast);
}

.terms-checkbox input[type="checkbox"]:checked + .checkmark {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.terms-checkbox input[type="checkbox"]:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.terms-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
}

.terms-link:hover {
  text-decoration: underline;
}

.submit-button {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

/* Responsive Design */
@media (max-width: 768px) {
  .register-container {
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
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .info-title,
  .form-title {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 480px) {
  .register-page {
    padding: var(--spacing-md);
  }
  
  .info-section,
  .form-section {
    padding: var(--spacing-lg) var(--spacing-md);
  }
}
</style>
