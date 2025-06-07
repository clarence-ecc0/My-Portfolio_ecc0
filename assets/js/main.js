// Email handling function
function sendEmail(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const projectType = document.getElementById('project_type').value;
  const message = document.getElementById('message').value;
    const mailtoLink = `mailto:clarence135.official@gmail.com?subject=${encodeURIComponent('Request from portfolio website')}&body=${encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nProject Type: ${projectType}\n\nMessage:\n${message}`
  )}`;
  
  window.location.href = mailtoLink;
}

// Portfolio Filter with Animation
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

function showCard(card) {
    card.style.display = 'block';
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    }, 10);
}

function hideCard(card) {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.8)';
    setTimeout(() => {
        card.style.display = 'none';
    }, 300);
}

function filterProjects(mainCategory, subCategory = null) {
    projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const subcategory = card.getAttribute('data-subcategory');

        // For main filter "All"
        if (mainCategory === 'all') {
            showCard(card);
            return;
        }

        // For Graphic Design section
        if (mainCategory === 'graphic') {
            if (category === 'graphic') {
                if (subCategory === 'all-graphic' || !subCategory) {
                    showCard(card);
                } else if (subcategory === subCategory) {
                    showCard(card);
                } else {
                    hideCard(card);
                }
            } else {
                hideCard(card);
            }
            return;
        }

        // For other main categories (UI/UX, Frontend)
        if (mainCategory === category) {
            showCard(card);
        } else {
            // Special case: Graphic Design items should appear in "All"
            if (mainCategory === 'all' && category === 'graphic') {
                showCard(card);
            } else {
                hideCard(card);
            }
        }
    });
}

// Main category filter click handler
mainFilter.addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-btn')) return;
    
    // Update active states
    mainFilter.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    const category = e.target.getAttribute('data-filter');
    
    // Show/hide sub-filter for graphic design
    if (category === 'graphic') {
        subFilter.style.display = 'flex';
        setTimeout(() => {
            subFilter.classList.add('visible');
        }, 10);
        // Reset sub-filter to "All Graphics"
        subFilter.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        subFilter.querySelector('[data-filter="all-graphic"]').classList.add('active');
    } else {
        subFilter.classList.remove('visible');
        setTimeout(() => {
            subFilter.style.display = 'none';
        }, 300);
    }
    
    filterProjects(category);
});

// Sub-category filter click handler
subFilter.addEventListener('click', (e) => {
    if (!e.target.classList.contains('filter-btn')) return;
    
    // Update active state
    subFilter.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    const subCategory = e.target.getAttribute('data-filter');
    filterProjects('graphic', subCategory);
});

// Main JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll progress bar
    initScrollProgress();

    // Initialize tooltips
    initTooltips();

    // Initialize active section highlighting
    updateActiveSection();
});

// Scroll Progress Bar
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Tooltips
function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', e => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.dataset.tooltip;
            document.body.appendChild(tooltip);

            const rect = element.getBoundingClientRect();
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            tooltip.style.left = rect.left + (rect.width - tooltip.offsetWidth) / 2 + 'px';
            tooltip.style.opacity = '1';
        });

        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
                setTimeout(() => tooltip.remove(), 200);
            }
        });
    });
}

// Scroll Spy for Navigation
function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100; // Offset for navbar
        const sectionId = section.getAttribute('id');
        
        const navLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);
        if (!navLink) return;

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
            navLink.classList.add('active');
        }
    });
}

// Update active section on scroll
window.addEventListener('scroll', updateActiveSection);