// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

// Create different observers for different animation types
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const slideLeftObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            slideLeftObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const slideRightObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            slideRightObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const scaleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            scaleObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Parallax effect for hero section
const parallaxElements = document.querySelectorAll('.parallax');
window.addEventListener('scroll', () => {
    parallaxElements.forEach(elem => {
        const speed = elem.dataset.speed || 0.5;
        const yPos = -(window.pageYOffset * speed);
        elem.style.transform = `translateY(${yPos}px)`;
    });
});

// Animate on scroll initialization
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll progress bar
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = `${scrolled}%`;
        });
    }

    // Fade animations
    document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
    
    // Slide animations    // Initialize animations
    document.querySelectorAll('.slide-in-left').forEach(el => slideLeftObserver.observe(el));
    document.querySelectorAll('.slide-in-right').forEach(el => slideRightObserver.observe(el));
    document.querySelectorAll('.scale-in').forEach(el => scaleObserver.observe(el));
    
    // Initialize stagger animations
    document.querySelectorAll('.stagger-animation').forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            child.style.setProperty('--index', index);
        });
    });
    
    // Initialize custom cursor
    initCustomCursor();
});

// Custom cursor
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
            cursorDot.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
            cursorDot.classList.remove('cursor-hover');
        });
    });
}

// Smooth scroll with dynamic speed
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = Math.min(Math.max(Math.abs(distance), 500), 1000); // Dynamic duration based on distance
            
            smoothScrollTo(targetPosition, duration);
        }
    });
});

function smoothScrollTo(targetPosition, duration) {
    const start = window.pageYOffset;
    const distance = targetPosition - start;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        window.scrollTo(0, start + distance * easeInOutCubic(progress));

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    requestAnimationFrame(animation);
}

// Page transition effects
window.addEventListener('beforeunload', () => {
    document.body.classList.add('page-transition');
});

// Theme toggle with smooth transition
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.toggle('light-theme');
        }, 50);
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 500);
    });
}
