document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('show');
        });
    }
    
    // Dropdown Menu (Mobile)
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        
        if (window.innerWidth < 768) {
            dropdownToggle.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            });
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-links') && !e.target.closest('.hamburger') && navLinks && navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
            hamburger.classList.remove('active');
        }
    });
    
    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    
    function showSlide(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    if (testimonials.length > 0 && dots.length > 0) {
        // Initialize slider
        showSlide(currentSlide);
        
        // Add click event to dots
        dots.forEach((dot, i) => {
            dot.addEventListener('click', function() {
                currentSlide = i;
                showSlide(currentSlide);
            });
        });
        
        // Auto slide
        setInterval(function() {
            currentSlide = (currentSlide + 1) % testimonials.length;
            showSlide(currentSlide);
        }, 5000);
    }
    
    // Animate Count Up for Statistics
    function animateCountUp(el) {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000; // ms
        const start = Date.now();
        const startValue = 0;
        
        function updateCount() {
            const now = Date.now();
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smoother animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(startValue + (target - startValue) * easeOutQuart);
            
            el.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                el.textContent = target.toLocaleString();
            }
        }
        
        updateCount();
    }
    
    // Stats count animation
    const statsSection = document.querySelector('.impact');
    const statElements = document.querySelectorAll('.stat-number');
    
    if (statsSection && statElements.length > 0) {
        // Set data targets
        document.getElementById('institutes-count').setAttribute('data-target', '120');
        document.getElementById('donors-count').setAttribute('data-target', '5840');
        document.getElementById('suppliers-count').setAttribute('data-target', '350');
        document.getElementById('donations-count').setAttribute('data-target', '12750');
        
        // Animate when stats are in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statElements.forEach(stat => {
                        animateCountUp(stat);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
    
    // Modal Functions
    const modals = document.querySelectorAll('.modal');
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modalCloseButtons = document.querySelectorAll('.modal-close, .modal-cancel');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            
            if (modal) {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Close modal when clicking outside content
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Form Validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    const formGroup = field.closest('.form-group');
                    
                    if (formGroup) {
                        // Add error class and message if not already added
                        if (!formGroup.querySelector('.error-message')) {
                            field.classList.add('error');
                            const errorMessage = document.createElement('div');
                            errorMessage.className = 'error-message';
                            errorMessage.textContent = 'This field is required';
                            errorMessage.style.color = 'red';
                            errorMessage.style.fontSize = '0.85rem';
                            errorMessage.style.marginTop = '5px';
                            formGroup.appendChild(errorMessage);
                        }
                    }
                } else {
                    // Remove error if field is filled
                    const formGroup = field.closest('.form-group');
                    field.classList.remove('error');
                    
                    if (formGroup) {
                        const errorMessage = formGroup.querySelector('.error-message');
                        if (errorMessage) {
                            formGroup.removeChild(errorMessage);
                        }
                    }
                    
                    // Email validation
                    if (field.type === 'email') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(field.value.trim())) {
                            isValid = false;
                            const formGroup = field.closest('.form-group');
                            
                            if (formGroup && !formGroup.querySelector('.error-message')) {
                                field.classList.add('error');
                                const errorMessage = document.createElement('div');
                                errorMessage.className = 'error-message';
                                errorMessage.textContent = 'Please enter a valid email address';
                                errorMessage.style.color = 'red';
                                errorMessage.style.fontSize = '0.85rem';
                                errorMessage.style.marginTop = '5px';
                                formGroup.appendChild(errorMessage);
                            }
                        }
                    }
                    
                    // Password validation
                    if (field.type === 'password' && field.minLength) {
                        if (field.value.length < field.minLength) {
                            isValid = false;
                            const formGroup = field.closest('.form-group');
                            
                            if (formGroup && !formGroup.querySelector('.error-message')) {
                                field.classList.add('error');
                                const errorMessage = document.createElement('div');
                                errorMessage.className = 'error-message';
                                errorMessage.textContent = `Password must be at least ${field.minLength} characters`;
                                errorMessage.style.color = 'red';
                                errorMessage.style.fontSize = '0.85rem';
                                errorMessage.style.marginTop = '5px';
                                formGroup.appendChild(errorMessage);
                            }
                        }
                    }
                }
            });
            
            // Check password confirmation if exists
            const password = form.querySelector('input[name="password"]');
            const confirmPassword = form.querySelector('input[name="confirmPassword"]');
            
            if (password && confirmPassword) {
                if (password.value !== confirmPassword.value) {
                    isValid = false;
                    const formGroup = confirmPassword.closest('.form-group');
                    
                    if (formGroup && !formGroup.querySelector('.error-message')) {
                        confirmPassword.classList.add('error');
                        const errorMessage = document.createElement('div');
                        errorMessage.className = 'error-message';
                        errorMessage.textContent = 'Passwords do not match';
                        errorMessage.style.color = 'red';
                        errorMessage.style.fontSize = '0.85rem';
                        errorMessage.style.marginTop = '5px';
                        formGroup.appendChild(errorMessage);
                    }
                }
            }
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
    
    // Clear form errors on input
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('form-control')) {
            e.target.classList.remove('error');
            const formGroup = e.target.closest('.form-group');
            
            if (formGroup) {
                const errorMessage = formGroup.querySelector('.error-message');
                if (errorMessage) {
                    formGroup.removeChild(errorMessage);
                }
            }
        }
    });
    
    // Scroll to sections smoothly
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('show')) {
                    navLinks.classList.remove('show');
                    hamburger.classList.remove('active');
                }
                
                // Scroll smoothly
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        // Scroll to top when clicked
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});