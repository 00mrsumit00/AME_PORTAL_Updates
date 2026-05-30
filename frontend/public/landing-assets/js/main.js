// Mobile Menu Toggle
document.getElementById('mobileMenuBtn').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
    
    // Change icon
    const icon = this.querySelector('i');
    if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 10) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            document.querySelector('.nav-links').classList.remove('active');
            const menuIcon = document.querySelector('#mobileMenuBtn i');
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
        }
    });
});

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
        const item = this.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close all open FAQ items
        document.querySelectorAll('.faq-item').forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open the clicked item if it wasn't already open
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Testimonial Slider
const testimonialSlides = document.querySelector('.testimonial-slides');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
let currentSlide = 0;

function showSlide(index) {
    testimonialSlides.style.transform = `translateX(-${index * 100}%)`;
    
    // Update active dot
    testimonialDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    currentSlide = index;
}

// Add click events to dots
testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Auto slide change
function autoSlide() {
    const nextSlide = (currentSlide + 1) % testimonialDots.length;
    showSlide(nextSlide);
}

// Set interval for auto slide
const slideInterval = setInterval(autoSlide, 5000);

// Pause interval on hover
document.querySelector('.testimonials-slider').addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

document.querySelector('.testimonials-slider').addEventListener('mouseleave', () => {
    clearInterval(slideInterval);
    setInterval(autoSlide, 5000);
});

// Animation for counting numbers
function animateCount(el, start, end, duration) {
    let startTime = null;
    
    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        el.textContent = value;
        
        if (progress < 1) {
            window.requestAnimationFrame(animate);
        } else {
            el.textContent = end;
        }
    }
    
    window.requestAnimationFrame(animate);
}

// Form validation
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const formElements = this.querySelectorAll('input, textarea, select');
        
        formElements.forEach(element => {
            if (element.hasAttribute('required') && !element.value.trim()) {
                isValid = false;
                element.classList.add('error');
            } else {
                element.classList.remove('error');
            }
            
            // Email validation
            if (element.type === 'email' && element.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(element.value)) {
                    isValid = false;
                    element.classList.add('error');
                }
            }
        });
        
        if (isValid) {
            // Simulate form submission success
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            // Simulate API call
            setTimeout(() => {
                this.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                }, 2000);
            }, 1500);
        }
    });
});

// Back to top button
window.addEventListener('scroll', function() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('active');
    } else {
        backToTopBtn.classList.remove('active');
    }
});

// Add back to top button to the DOM
const backToTopBtn = document.createElement('a');
backToTopBtn.href = '#';
backToTopBtn.className = 'back-to-top';
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';

backToTopBtn.addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

document.body.appendChild(backToTopBtn);

// Add some custom CSS for the back to top button
const backToTopStyle = document.createElement('style');
backToTopStyle.textContent = `
    .back-to-top {
        position: fixed;
        bottom: 25px;
        right: 25px;
        width: 40px;
        height: 40px;
        background-color: var(--primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        z-index: 999;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .back-to-top.active {
        opacity: 1;
        visibility: visible;
    }
    
    .back-to-top:hover {
        background-color: var(--secondary);
        transform: translateY(-3px);
    }
    
    .error {
        border-color: var(--danger) !important;
        box-shadow: 0 0 0 2px rgba(248, 113, 113, 0.2) !important;
    }
`;

document.head.appendChild(backToTopStyle);

// Initialize slide show for first testimonial
showSlide(0);

// Add some stats counters to the page
const statsSection = document.createElement('section');
statsSection.className = 'stats';
statsSection.innerHTML = `
    <div class="container">
        <div class="stats-grid">
            <div class="stat-item" data-aos="fade-up">
                <div class="stat-icon"><i class="fas fa-user-graduate"></i></div>
                <div class="stat-number"><span class="count-animation" data-count="5000">0</span>+</div>
                <div class="stat-title">Students Helped</div>
            </div>
            <div class="stat-item" data-aos="fade-up" data-aos-delay="100">
                <div class="stat-icon"><i class="fas fa-university"></i></div>
                <div class="stat-number"><span class="count-animation" data-count="350">0</span>+</div>
                <div class="stat-title">Partner Schools</div>
            </div>
            <div class="stat-item" data-aos="fade-up" data-aos-delay="200">
                <div class="stat-icon"><i class="fas fa-award"></i></div>
                <div class="stat-number"><span class="count-animation" data-count="98">0</span>%</div>
                <div class="stat-title">Success Rate</div>
            </div>
            <div class="stat-item" data-aos="fade-up" data-aos-delay="300">
                <div class="stat-icon"><i class="fas fa-globe-americas"></i></div>
                <div class="stat-number"><span class="count-animation" data-count="25">0</span>+</div>
                <div class="stat-title">Countries Served</div>
            </div>
        </div>
    </div>
`;

// Add stats section before FAQ section
const faqSection = document.getElementById('faq');
faqSection.parentNode.insertBefore(statsSection, faqSection);

// Add stats section styles
const statsStyle = document.createElement('style');
statsStyle.textContent = `
    .stats {
        background-color: var(--primary);
        padding: 60px 0;
        color: white;
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 30px;
        text-align: center;
    }
    
    .stat-item {
        padding: 20px;
    }
    
    .stat-icon {
        font-size: 40px;
        margin-bottom: 15px;
        color: var(--accent);
    }
    
    .stat-number {
        font-size: 36px;
        font-weight: 700;
        margin-bottom: 10px;
    }
    
    .stat-title {
        font-size: 18px;
        font-weight: 500;
    }
    
    @media (max-width: 768px) {
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    
    @media (max-width: 576px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }
    }
`;

document.head.appendChild(statsStyle);

// Initialize count animations when elements come into view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const countElements = entry.target.querySelectorAll('.count-animation');
            countElements.forEach(element => {
                const target = parseInt(element.getAttribute('data-count'));
                animateCount(element, 0, target, 2000);
            });
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelector('.stats-grid').querySelectorAll('.stat-item').forEach(item => {
    observer.observe(item);
});
</script>
</body>
</html>