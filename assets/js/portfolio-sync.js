/**
 * Portfolio Sync System
 * Synchronizes admin panel projects with the main portfolio website
 * The admin panel is the source of truth for all portfolio projects
 */

class PortfolioSync {
  constructor() {
    this.projects = [];
    console.log('🔵 PortfolioSync constructor called');
    // DON'T call initializePortfolio here - wait for storage manager first
  }

  async initialize() {
    console.log('🔵 PortfolioSync.initialize() called - waiting for storage manager');
    // Wait for storage manager to be fully ready
    if (typeof waitForStorageManager !== 'undefined') {
      await waitForStorageManager();
    }
    console.log('🟢 Storage manager ready, initializing portfolio');
    await this.initializePortfolio();
  }

  /**
   * Load projects from IndexedDB via storage manager
   */
  async loadProjects() {
    try {
      // Prefer server-backed projects when available (but only if non-empty)
      try {
        const response = await fetch('/api/projects', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          const serverProjects = Array.isArray(data) ? data : data.projects;
          if (Array.isArray(serverProjects) && serverProjects.length > 0) {
            this.projects = serverProjects;
            console.log(`✅ PortfolioSync: Loaded ${this.projects.length} projects from server`);
            return this.projects;
          }
        }
      } catch (err) {
        // Ignore and fall back to storage
      }

      // Wait for storage manager to be ready
      if (typeof waitForStorageManager !== 'undefined') {
        await waitForStorageManager();
      }
      
      if (window.storageManager && window.storageManager.db) {
        this.projects = await window.storageManager.loadProjects();
        console.log(`✅ PortfolioSync: Loaded ${this.projects.length} projects from IndexedDB`);
        return this.projects;
      } else {
        console.warn('⚠️ Storage manager not available, using localStorage');
        const stored = localStorage.getItem('portfolio_projects');
        this.projects = stored ? JSON.parse(stored) : [];
        console.log(`✅ PortfolioSync: Loaded ${this.projects.length} projects from localStorage`);
        return this.projects;
      }
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
      
      // Debug logging
      if (imageUrls.length === 0) {
        console.warn(`⚠️ Project "${title}" has images array but no valid URLs:`, images);
      } else {
        console.log(`✅ Project "${title}" gallery: ${imageUrls.length} images`, {
          projectType: project.projectType,
          imageCount: imageUrls.length,
          firstImageType: imageUrls[0] ? (imageUrls[0].startsWith('data:') ? 'base64' : 'url') : 'none'
        });
      }
      
      // Join with ||| separator (safe for base64 data URLs which may contain commas)
      const imageDataList = imageUrls.join('|||');
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
  async renderProjects() {
    const projects = await this.loadProjects();
    console.log(`📋 renderProjects: Got ${projects.length} projects to render`);
    
    if (projects.length === 0) {
      console.log('ℹ️ No admin projects found - using default portfolio');
      return;
    }

    const slidesWrapper = document.querySelector('.portfolio-slides-wrapper');
    if (!slidesWrapper) {
      console.warn('⚠️ Portfolio slides wrapper not found');
      return;
    }

    // Remove ALL existing project cards (hardcoded + admin)
    const existingCards = slidesWrapper.querySelectorAll('.project-card');
    console.log(`🗑️ Removing ${existingCards.length} existing cards`);
    existingCards.forEach(card => card.remove());

    // Generate and insert ALL project cards from admin panel
    const projectsHtml = projects.map(project => this.convertProjectToCard(project)).join('');
    
    if (projectsHtml) {
      // Insert directly into slides wrapper
      slidesWrapper.insertAdjacentHTML('beforeend', projectsHtml);

      console.log(`✅ Rendered ${projects.length} projects from admin panel`);
      
      // CRITICAL: Completely reinitialize slideshow
      this.reinitializeSlideshow();
    }
  }

  /**
   * Completely reinitialize the slideshow with new slides
   */
  reinitializeSlideshow() {
    console.log('🔄 Reinitializing slideshow with new projects...');
    
    // Wait for DOM to update
    setTimeout(() => {
      // Reinitialize slideshow completely
      if (typeof window.initializeSlideshow === 'function') {
        try {
          // Call the global slideshow initialization function
          const newInstance = window.initializeSlideshow();
          window.slideshowInstance = newInstance;
          console.log('✅ Slideshow reinitialized with', document.querySelectorAll('.project-card').length, 'slides');
        } catch (err) {
          console.error('❌ Slideshow initialization error:', err);
        }
      } else {
        console.warn('⚠️ initializeSlideshow function not found');
      }
      
      // Reinitialize lightbox/gallery triggers
      if (typeof window.setupGalleryTriggers === 'function') {
        try {
          window.setupGalleryTriggers();
          console.log('✅ Gallery triggers reinitialized');
        } catch (err) {
          console.error('❌ Gallery trigger initialization error:', err);
        }
      } else if (typeof window.initializeLightbox === 'function') {
        try {
          window.initializeLightbox();
          console.log('✅ Lightbox reinitialized');
        } catch (err) {
          console.error('❌ Lightbox initialization error:', err);
        }
      }
    }, 300); // Increased delay for DOM stability
  }

  /**
   * Initialize portfolio on page load
   */
  async initializePortfolio() {
    console.log('🔵 initializePortfolio() called');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', async () => {
        await this.renderProjects();
      });
    } else {
      await this.renderProjects();
    }

    // Listen for changes in localStorage (from admin panel)
    window.addEventListener('storage', async (event) => {
      if (event.key === 'portfolio_projects') {
        console.log('📦 Projects updated in admin panel, refreshing portfolio...');
        await this.renderProjects();
      }
    });

    // Also watch for same-tab changes (polling method)
    this.startPolling();
  }

  async startPolling() {
    let lastProjects = JSON.stringify(await this.loadProjects());
    setInterval(async () => {
      try {
        const currentProjects = JSON.stringify(await this.loadProjects());
        if (currentProjects !== lastProjects) {
          console.log('📦 Projects changed, refreshing portfolio...');
          lastProjects = currentProjects;
          await this.renderProjects();
          this.reinitializeSlideshow();
        }
      } catch (err) {
        console.warn('⚠️ Error checking for updates:', err);
      }
    }, 2000); // Check every 2 seconds (reduced from 500ms to avoid spam)
  }

  /**
   * Get statistics about projects
   */
  async getStatistics() {
    const projects = await this.loadProjects();
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

// Initialize on page load - but WAIT for storage manager first
const portfolioSync = new PortfolioSync();

// Call initialize after storage manager is ready
(async function() {
  console.log('🔵 Waiting for storage manager before initializing portfolio...');
  if (typeof waitForStorageManager !== 'undefined') {
    await waitForStorageManager();
  }
  console.log('🟢 Storage manager ready, calling portfolioSync.initialize()');
  await portfolioSync.initialize();
})();

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioSync;
}
