// Portfolio Filter with Animation
const mainFilter = document.querySelector('.main-filter');
const subFilter = document.getElementById('graphicDesignFilter');
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
        
        if (mainCategory === 'all') {
            showCard(card);
            return;
        }

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

        if (category === mainCategory) {
            showCard(card);
        } else {
            hideCard(card);
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
