/**
 * Portfolio Sync System
 * Synchronizes admin panel projects with the main portfolio website
 * The admin panel is the source of truth for all portfolio projects
 */

class PortfolioSync {
  constructor() {
    this.projects = [];
    this.initializePortfolio();
  }

  /**
   * Load projects from localStorage (admin panel data)
   */
  loadProjects() {
    try {
      const stored = localStorage.getItem('portfolio_projects');
      if (!stored) {
        console.log('ℹ️ No projects in localStorage yet. Migration may not have run.');
        this.projects = [];
        return [];
      }
      this.projects = JSON.parse(stored);
      console.log(`✅ Loaded ${this.projects.length} projects from admin panel`);
      return this.projects;
    } catch (error) {
      console.error('❌ Error loading projects:', error);
      return [];
    }
  }

  /**
   * Convert admin project to portfolio card format
   */
  convertProjectToCard(project) {
    const id = project.id || `project-${Date.now()}`;
    const coverImage = project.coverImage || 'assets/placeholder.png';
    const title = project.title || 'Untitled Project';
    const description = project.description || 'No description available';
    const category = (project.category || 'graphic').toLowerCase();
    const tags = project.tags || [];
    const images = project.images || [];

    // Create gallery data
    let viewLink = '';

    if (project.projectType === 'multi' && images.length > 0) {
      // Multi-image gallery - use images array as-is (should include all images in correct order)
      const imageUrls = [];
      images.forEach(img => {
        const imageUrl = typeof img === 'string' ? img : (img.url || '');
        if (imageUrl) imageUrls.push(imageUrl);
      });
      const imageDataList = imageUrls.join(', ');
      viewLink = `<a href="#" class="project-link gallery-trigger" data-gallery="${imageDataList}">View Gallery (${imageUrls.length} images)</a>`;
    } else {
      // Single image
      viewLink = `<a href="${coverImage}" class="project-link view-full-size">View Full Size</a>`;
    }

    // Map category for filtering
    let filterCategory = 'graphic'; // default
    if (category.includes('ui') || category.includes('ux')) {
      filterCategory = 'ui-ux';
    } else if (category.includes('front') || category.includes('web') || category.includes('development')) {
      filterCategory = 'frontend';
    }

    // Build project card HTML
    const card = `
      <div class="project-card" data-category="${filterCategory}">
        <div class="project-image">
          <img src="${coverImage}" alt="${title}" loading="lazy" decoding="async" />
        </div>
        <div class="project-overlay">
          ${viewLink}
        </div>
        <div class="project-content">
          <h3>${this.escapeHtml(title)}</h3>
          <p>${this.escapeHtml(description)}</p>
          <div class="project-tags">
            ${tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
          </div>
        </div>
      </div>
    `;

    return card;
  }

  /**
   * Escape HTML to prevent injection
   */
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  /**
   * Render projects in the portfolio grid
   */
  renderProjects() {
    const projects = this.loadProjects();
    
    if (projects.length === 0) {
      console.log('ℹ️ No admin projects found - using default portfolio');
      return;
    }

    const slidesWrapper = document.querySelector('.portfolio-slides-wrapper');
    if (!slidesWrapper) {
      console.warn('⚠️ Portfolio slides wrapper not found');
      return;
    }

    // Remove existing project cards only (keep navigation)
    const existingCards = slidesWrapper.querySelectorAll('.project-card');
    existingCards.forEach(card => card.remove());

    // Generate and insert project cards
    const projectsHtml = projects.map(project => this.convertProjectToCard(project)).join('');
    
    if (projectsHtml) {
      // Insert after navigation buttons
      const navNext = slidesWrapper.querySelector('.slideshow-nav.next');
      if (navNext && navNext.parentNode === slidesWrapper) {
        navNext.insertAdjacentHTML('afterend', projectsHtml);
      } else {
        slidesWrapper.insertAdjacentHTML('beforeend', projectsHtml);
      }

      // Update total slide count
      const totalSlidesSpan = slidesWrapper.querySelector('.total-slides');
      if (totalSlidesSpan) {
        totalSlidesSpan.textContent = projects.length;
      }

      console.log(`✅ Rendered ${projects.length} projects from admin panel`);
      
      // Reinitialize slideshow and gallery features
      this.reinitializePortfolioFeatures();
    }
  }

  /**
   * Reinitialize portfolio features after rendering new projects
   */
  reinitializePortfolioFeatures() {
    // Wait a moment for DOM updates
    setTimeout(() => {
      // Reinitialize the slideshow
      if (typeof initializeSlideshow === 'function') {
        try {
          initializeSlideshow();
          console.log('✅ Slideshow reinitialized');
        } catch (err) {
          console.warn('⚠️ Slideshow initialization:', err);
        }
      }

      // Reinitialize gallery triggers
      if (typeof setupGalleryTriggers === 'function') {
        try {
          setupGalleryTriggers();
          console.log('✅ Gallery triggers reinitialized');
        } catch (err) {
          console.warn('⚠️ Gallery trigger initialization:', err);
        }
      }

      // Reinitialize filter buttons
      if (typeof setupFilterButtons === 'function') {
        try {
          setupFilterButtons();
          console.log('✅ Filter buttons reinitialized');
        } catch (err) {
          console.warn('⚠️ Filter button initialization:', err);
        }
      }
    }, 100);
  }

  /**
   * Initialize portfolio on page load
   */
  initializePortfolio() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.renderProjects();
      });
    } else {
      this.renderProjects();
    }

    // Listen for changes in localStorage (from admin panel)
    window.addEventListener('storage', (event) => {
      if (event.key === 'portfolio_projects') {
        console.log('📦 Projects updated in admin panel, refreshing portfolio...');
        this.renderProjects();
      }
    });

    // Also watch for same-tab changes (polling method)
    let lastProjects = JSON.stringify(this.loadProjects());
    setInterval(() => {
      try {
        const currentProjects = JSON.stringify(this.loadProjects());
        if (currentProjects !== lastProjects) {
          console.log('📦 Projects changed in admin panel, refreshing...');
          lastProjects = currentProjects;
          this.renderProjects();
        }
      } catch (err) {
        console.warn('⚠️ Error checking for updates:', err);
      }
    }, 5000); // Check every 5 seconds
  }

  /**
   * Get statistics about projects
   */
  getStatistics() {
    const projects = this.loadProjects();
    const stats = {
      total: projects.length,
      byCategory: {},
      byType: {}
    };

    projects.forEach(project => {
      // Count by category
      const category = project.category || 'graphic';
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;

      // Count by type
      const type = project.projectType || 'single';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    console.log('📊 Portfolio Statistics:', stats);
    return stats;
  }
}

// Initialize on page load
const portfolioSync = new PortfolioSync();

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioSync;
}
