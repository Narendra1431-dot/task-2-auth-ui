/* ============================================
   MODERN AUTHENTICATION UI - VALIDATION LOGIC
   Client-Side Form Validation & Interactions
   ============================================ */

// ==================== GLOBAL VARIABLES ====================
const VALIDATION_RULES = {
    minPasswordLength: 8,
    emailRegex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    nameMinLength: 2
};

// Simulated existing emails database (for demo purposes)
const existingEmails = [
    'test@example.com',
    'demo@example.com',
    'admin@company.com',
    'user@test.com'
];

// ==================== UTILITY FUNCTIONS ====================

/**
 * Display alert message with animation
 * @param {string} elementId - Alert container ID
 * @param {string} messageId - Message span ID
 * @param {string} message - Message to display
 * @param {string} type - Alert type (success, danger, info)
 */
function showAlert(elementId, messageId, message, type) {
    const alertElement = document.getElementById(elementId);
    const messageElement = document.getElementById(messageId);
    
    if (alertElement && messageElement) {
        messageElement.textContent = message;
        alertElement.className = `alert alert-${type} alert-dismissible fade show`;
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            alertElement.classList.remove('show');
        }, 5000);
    }
}

/**
 * Toggle button loading state
 * @param {HTMLButtonElement} button - Button element
 * @param {boolean} isLoading - Loading state
 */
function toggleButtonLoading(button, isLoading) {
    const btnText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.spinner-border');
    
    if (isLoading) {
        button.disabled = true;
        if (btnText) btnText.style.opacity = '0.6';
        if (spinner) spinner.classList.remove('d-none');
    } else {
        button.disabled = false;
        if (btnText) btnText.style.opacity = '1';
        if (spinner) spinner.classList.add('d-none');
    }
}

/**
 * Add shake animation to element
 * @param {HTMLElement} element - Element to shake
 */
function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => {
        element.classList.remove('shake');
    }, 500);
}

// ==================== VALIDATION FUNCTIONS ====================

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} - Validation result
 */
function validateEmail(email) {
    return VALIDATION_RULES.emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password string
 * @returns {object} - Strength details {isValid, strength, score}
 */
function validatePassword(password) {
    const length = password.length;
    let score = 0;
    let strength = 'Weak';
    
    // Length check
    if (length >= 8) score += 25;
    if (length >= 12) score += 25;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 10; // lowercase
    if (/[A-Z]/.test(password)) score += 15; // uppercase
    if (/[0-9]/.test(password)) score += 15; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score += 10; // special chars
    
    // Determine strength
    if (score >= 70) strength = 'Strong';
    else if (score >= 50) strength = 'Medium';
    
    return {
        isValid: length >= VALIDATION_RULES.minPasswordLength,
        strength: strength,
        score: score
    };
}

/**
 * Check if passwords match
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {boolean} - Match result
 */
function passwordsMatch(password, confirmPassword) {
    return password === confirmPassword && password.length > 0;
}

/**
 * Simulate AJAX email availability check
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} - Availability status
 */
function checkEmailAvailability(email) {
    return new Promise((resolve) => {
        // Simulate network delay (500-1000ms)
        const delay = Math.random() * 500 + 500;
        
        setTimeout(() => {
            // Check if email exists in our simulated database
            const isAvailable = !existingEmails.includes(email.toLowerCase());
            resolve(isAvailable);
        }, delay);
    });
}

// ==================== PASSWORD VISIBILITY TOGGLE ====================

/**
 * Initialize password visibility toggle functionality
 */
function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (passwordInput) {
                // Toggle password visibility
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.classList.remove('bi-eye');
                    icon.classList.add('bi-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    icon.classList.remove('bi-eye-slash');
                    icon.classList.add('bi-eye');
                }
            }
        });
    });
}

// ==================== LOGIN PAGE FUNCTIONALITY ====================

/**
 * Initialize login form validation
 */
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form inputs
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        const submitButton = this.querySelector('button[type="submit"]');
        
        // Reset validation states
        loginForm.classList.remove('was-validated');
        emailInput.classList.remove('is-invalid', 'is-valid');
        passwordInput.classList.remove('is-invalid', 'is-valid');
        
        let isValid = true;
        
        // Validate email/username
        if (emailInput.value.trim() === '') {
            emailInput.classList.add('is-invalid');
            isValid = false;
        } else {
            emailInput.classList.add('is-valid');
        }
        
        // Validate password
        if (passwordInput.value.length < 
            VALIDATION_RULES.minPasswordLength) {
            passwordInput.classList.add('is-invalid');
            isValid = false;
        } else {
            passwordInput.classList.add('is-valid');
        }
        
        // If validation fails, shake the form
        if (!isValid) {
            shakeElement(loginForm.closest('.auth-card'));
            return;
        }
        
        // Show loading state
        toggleButtonLoading(submitButton, true);
        
        // Simulate login process (replace with actual API call)
        setTimeout(() => {
            toggleButtonLoading(submitButton, false);
            
            // Simulate successful login
            showAlert(
                'loginAlert',
                'loginAlertMessage',
                'Login successful! Redirecting to dashboard...',
                'success'
            );
            
            // Simulate redirect after 2 seconds
            setTimeout(()=>{
                window.location.href = 'dashboard.html';
            }, 2000);
        }, 1500);
    });
    
    // Real-time validation feedback
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            if (this.value.length < 6) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    }
}

// ==================== REGISTRATION PAGE FUNCTIONALITY ====================

/**
 * Initialize registration form validation
 */
function initRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    
    if (!registerForm) return;
    
    // Get form inputs
    const nameInput = document.getElementById('registerName');
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('registerConfirmPassword');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    
    // ========== PASSWORD STRENGTH INDICATOR ==========
    if (passwordInput) {
        const strengthContainer = document.getElementById('passwordStrength');
        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');
        
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            
            if (password.length > 0) {
                strengthContainer.style.display = 'block';
                
                const validation = validatePassword(password);
                
                // Update progress bar
                strengthBar.style.width = validation.score + '%';
                strengthText.textContent = validation.strength;
                
                // Update colors
                strengthBar.className = 'progress-bar';
                if (validation.strength === 'Weak') {
                    strengthBar.classList.add('strength-weak');
                } else if (validation.strength === 'Medium') {
                    strengthBar.classList.add('strength-medium');
                } else {
                    strengthBar.classList.add('strength-strong');
                }
            } else {
                strengthContainer.style.display = 'none';
            }
        });
    }
    
    // ========== REAL-TIME EMAIL VALIDATION ==========
    let emailCheckTimeout;
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const email = this.value.trim();
            const checkingText = document.getElementById('emailCheckingText');
            const emailFeedback = document.getElementById('emailFeedback');
            
            // Clear previous timeout
            clearTimeout(emailCheckTimeout);
            
            // Reset states
            this.classList.remove('is-invalid', 'is-valid');
            if (checkingText) checkingText.style.display = 'none';
            
            if (email.length > 0 && validateEmail(email)) {
                // Show checking indicator
                if (checkingText) checkingText.style.display = 'block';
                
                // Debounce email check
                emailCheckTimeout = setTimeout(async () => {
                    const isAvailable = await checkEmailAvailability(email);
                    
                    if (checkingText) checkingText.style.display = 'none';
                    
                    if (isAvailable) {
                        emailInput.classList.add('is-valid');
                        emailInput.classList.remove('is-invalid');
                    } else {
                        emailInput.classList.add('is-invalid');
                        emailInput.classList.remove('is-valid');
                        emailFeedback.textContent = 'This email is already registered. Please use a different email.';
                    }
                }, 800);
            } else if (email.length > 0) {
                this.classList.add('is-invalid');
                emailFeedback.textContent = 'Please enter a valid email address.';
            }
        });
    }
    
    // ========== REAL-TIME PASSWORD MATCH VALIDATION ==========
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const password = passwordInput.value;
            const confirmPassword = this.value;
            
            if (confirmPassword.length > 0) {
                if (passwordsMatch(password, confirmPassword)) {
                    this.classList.add('is-valid');
                    this.classList.remove('is-invalid');
                } else {
                    this.classList.add('is-invalid');
                    this.classList.remove('is-valid');
                }
            } else {
                this.classList.remove('is-invalid', 'is-valid');
            }
        });
        
        // Also check when password changes
        if (passwordInput) {
            passwordInput.addEventListener('input', function() {
                if (confirmPasswordInput.value.length > 0) {
                    if (passwordsMatch(this.value, confirmPasswordInput.value)) {
                        confirmPasswordInput.classList.add('is-valid');
                        confirmPasswordInput.classList.remove('is-invalid');
                    } else {
                        confirmPasswordInput.classList.add('is-invalid');
                        confirmPasswordInput.classList.remove('is-valid');
                    }
                }
            });
        }
    }
    
    // ========== FORM SUBMISSION ==========
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        
        // Reset validation
        registerForm.classList.remove('was-validated');
        
        let isValid = true;
        let errorMessages = [];
        
        // Validate name
        if (nameInput.value.trim().length < VALIDATION_RULES.nameMinLength) {
            nameInput.classList.add('is-invalid');
            nameInput.classList.remove('is-valid');
            isValid = false;
            errorMessages.push('Please enter your full name.');
        } else {
            nameInput.classList.add('is-valid');
            nameInput.classList.remove('is-invalid');
        }
        
        // Validate email
        if (!validateEmail(emailInput.value.trim())) {
            emailInput.classList.add('is-invalid');
            emailInput.classList.remove('is-valid');
            isValid = false;
            errorMessages.push('Please enter a valid email address.');
        } else {
            // Check if email is available
            const isAvailable = await checkEmailAvailability(emailInput.value.trim());
            if (!isAvailable) {
                emailInput.classList.add('is-invalid');
                emailInput.classList.remove('is-valid');
                isValid = false;
                errorMessages.push('This email is already registered.');
            }
        }
        
        // Validate password
        const passwordValidation = validatePassword(passwordInput.value);
        if (!passwordValidation.isValid) {
            passwordInput.classList.add('is-invalid');
            passwordInput.classList.remove('is-valid');
            isValid = false;
            errorMessages.push('Password must be at least 8 characters long.');
        } else {
            passwordInput.classList.add('is-valid');
            passwordInput.classList.remove('is-invalid');
        }
        
        // Validate password match
        if (!passwordsMatch(passwordInput.value, confirmPasswordInput.value)) {
            confirmPasswordInput.classList.add('is-invalid');
            confirmPasswordInput.classList.remove('is-valid');
            isValid = false;
            errorMessages.push('Passwords do not match.');
        } else {
            confirmPasswordInput.classList.add('is-valid');
            confirmPasswordInput.classList.remove('is-invalid');
        }
        
        // Validate terms agreement
        if (!agreeTermsCheckbox.checked) {
            agreeTermsCheckbox.classList.add('is-invalid');
            isValid = false;
            errorMessages.push('You must agree to the terms and conditions.');
        } else {
            agreeTermsCheckbox.classList.remove('is-invalid');
        }
        
        // If validation fails
        if (!isValid) {
            shakeElement(registerForm.closest('.auth-card'));
            showAlert(
                'registerAlert',
                'registerAlertMessage',
                'Please fix the errors in the form.',
                'danger'
            );
            return;
        }
        
        // Show loading state
        toggleButtonLoading(submitButton, true);
        
        // Simulate registration process
        setTimeout(() => {
            toggleButtonLoading(submitButton, false);
            
            // Show success message
            showAlert(
                'registerAlert',
                'registerAlertMessage',
                'Registration successful! Redirecting to login...',
                'success'
            );
            
            // Clear form
            registerForm.reset();
            document.querySelectorAll('.form-control').forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
            document.getElementById('passwordStrength').style.display = 'none';
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        }, 1500);
    });
    
    // ========== REAL-TIME NAME VALIDATION ==========
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            if (this.value.trim().length < VALIDATION_RULES.nameMinLength) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    }
}

// ==================== INITIALIZATION ====================

/**
 * Initialize all functionality when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Authentication UI Initialized');
    
    // Initialize password toggle
    initPasswordToggle();
    
    // Initialize login form (if on login page)
    initLoginForm();
    
    // Initialize registration form (if on registration page)
    initRegisterForm();
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Close alerts on dismiss
    document.querySelectorAll('.alert .btn-close').forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.alert').classList.remove('show');
        });
    });
});

// ==================== EXPORT FOR TESTING ====================
// Uncomment if using ES6 modules
/*
export {
    validateEmail,
    validatePassword,
    passwordsMatch,
    checkEmailAvailability
};
*/

