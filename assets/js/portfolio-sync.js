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

  normalizeTechKey(tech) {
    return String(tech || '')
      .trim()
      .toLowerCase()
      .replace(/\./g, '')
      .replace(/\+/g, 'plus')
      .replace(/\s+/g, ' ');
  }

  getTechIconPath(tech) {
    const key = this.normalizeTechKey(tech);
    const iconMap = {
      'python': 'assets/images/tech-logos/python.svg',
      'php': 'assets/images/tech-logos/php.svg',
      'css': 'assets/images/tech-logos/css3.svg',
      'css3': 'assets/images/tech-logos/css3.svg',
      'tailwind css': 'assets/images/tech-logos/css3.svg',
      'html': 'assets/images/tech-logos/html5.svg',
      'html5': 'assets/images/tech-logos/html5.svg',
      'javascript': 'assets/images/tech-logos/javascript.svg',
      'js': 'assets/images/tech-logos/javascript.svg',
      'ecmascript': 'assets/images/tech-logos/javascript.svg',
      'react': 'assets/images/tech-logos/react.svg',
      'reactjs': 'assets/images/tech-logos/react.svg',
      'figma': 'assets/images/tech-logos/figma.svg',
      'git': 'assets/images/tech-logos/git.svg',
      'github': 'assets/images/tech-logos/github.svg',
      'vs code': 'assets/images/tech-logos/vscode.svg',
      'vscode': 'assets/images/tech-logos/vscode.svg'
    };

    return iconMap[key] || '';
  }

  getTechCdnIconUrl(tech) {
    const key = this.normalizeTechKey(tech);
    const slugOverrides = {
      'c plus plus': 'cplusplus',
      'cplusplus': 'cplusplus',
      'c sharp': 'csharp',
      'csharp': 'csharp',
      'f sharp': 'fsharp',
      'fsharp': 'fsharp',
      'net': 'dotnet',
      'aspnet': 'dotnet',
      'node': 'nodedotjs',
      'node js': 'nodedotjs',
      'nodejs': 'nodedotjs',
      'next': 'nextdotjs',
      'next js': 'nextdotjs',
      'nextjs': 'nextdotjs',
      'nuxt': 'nuxtdotjs',
      'vue': 'vuedotjs',
      'vue js': 'vuedotjs',
      'vuejs': 'vuedotjs',
      'tailwind': 'tailwindcss',
      'tailwind css': 'tailwindcss',
      'express': 'express',
      'react native': 'react',
      'angular': 'angular',
      'typescript': 'typescript',
      'mongodb': 'mongodb',
      'postgres': 'postgresql',
      'postgresql': 'postgresql',
      'mysql': 'mysql',
      'firebase': 'firebase',
      'supabase': 'supabase',
      'docker': 'docker',
      'kubernetes': 'kubernetes',
      'aws': 'amazonwebservices',
      'azure': 'microsoftazure',
      'gcp': 'googlecloud',
      'google cloud': 'googlecloud',
      'adobe xd': 'adobexd'
    };

    const slug = slugOverrides[key] || key.replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '');
    if (!slug) {
      return '';
    }

    return `https://cdn.simpleicons.org/${slug}`;
  }

  renderTechStackChip(tech) {
    const label = this.escapeHtml(tech);
    const iconPath = this.getTechIconPath(tech);
    const cdnIconPath = this.getTechCdnIconUrl(tech);

    if (iconPath || cdnIconPath) {
      const primaryIcon = iconPath || cdnIconPath;
      const fallbackAttr = iconPath && cdnIconPath ? ` data-fallback-src="${cdnIconPath}"` : '';
      return `
        <span class="software-tech-chip">
          <img src="${primaryIcon}" alt="${label} icon" class="software-tech-chip-icon" loading="lazy" decoding="async"${fallbackAttr} onerror="if(this.dataset.fallbackSrc){this.src=this.dataset.fallbackSrc;this.removeAttribute('data-fallback-src');}else{this.closest('.software-tech-chip')&&this.closest('.software-tech-chip').classList.add('icon-missing');this.remove();}" />
          <span>${label}</span>
        </span>
      `;
    }

    const initial = this.escapeHtml(String(tech || '?').trim().charAt(0).toUpperCase() || '?');
    return `
      <span class="software-tech-chip">
        <span class="software-tech-chip-fallback">${initial}</span>
        <span>${label}</span>
      </span>
    `;
  }

  /**
   * Always keep core software projects available in portfolio data.
   */
  ensureSoftwareProjects(projects) {
    const safeProjects = Array.isArray(projects) ? [...projects] : [];
    const fallbackSoftwareProjects = [
      {
        id: 1031,
        title: 'Callenda',
        description: 'Productivity platform with telephony-based voice reminders, analytics dashboards, and gamified task tracking.',
        category: 'Software Development',
        organization: 'Nigerian University of Technology and Management',
        location: 'Lagos, Nigeria',
        period: '2025',
        engagement: 'Academic Project',
        projectLink: 'https://bit.ly/4sA8P4K',
        techStack: ['Python', 'Flask', 'CSS'],
        tags: ['Python', 'Productivity'],
        projectType: 'single',
        coverImage: 'assets/ui-ux/ui1.png',
        images: [],
        galleryType: 'single',
        galleryImages: []
      },
      {
        id: 1032,
        title: 'My Portfolio Website',
        description: 'Dynamic portfolio website with intuitive navigation, optimized layout, and integrated social channels.',
        category: 'Software Development',
        organization: 'Personal Project',
        location: 'Remote',
        period: 'September 2025 - January 2026',
        engagement: 'Live Project',
        projectLink: 'https://my-portfolio-ecc0.vercel.app/',
        techStack: ['HTML', 'CSS', 'JavaScript'],
        tags: ['HTML', 'CSS'],
        projectType: 'single',
        coverImage: 'assets/mypic.jpg',
        images: [],
        galleryType: 'single',
        galleryImages: []
      },
      {
        id: 1033,
        title: 'Beebling Chatbot Agent',
        description: 'Designed and implemented a comprehensive chatbot agent for Beebly via Engati, enhancing customer engagement and streamlining automated support services.',
        category: 'Software Development',
        organization: 'Nigerian University of Technology and Management',
        location: 'Lagos, Nigeria',
        period: 'April 2025 - June 2025',
        engagement: 'Engati Chatbot Build',
        projectLink: 'https://bit.ly/3Pr3aiO',
        techStack: ['Python', 'PHP', 'CSS'],
        tags: ['Chatbot', 'Automation'],
        projectType: 'single',
        coverImage: 'assets/ui-ux/ui2.jpg',
        images: [],
        galleryType: 'single',
        galleryImages: []
      }
    ];

    const idSet = new Set(safeProjects.map(p => String(p.id || '')));
    const titleSet = new Set(safeProjects.map(p => String(p.title || '').toLowerCase()));
    let maxOrder = safeProjects.reduce((max, p) => {
      const order = Number(p.order);
      return Number.isFinite(order) ? Math.max(max, order) : max;
    }, 0);

    fallbackSoftwareProjects.forEach(project => {
      const projectId = String(project.id);
      const projectTitle = project.title.toLowerCase();
      if (!idSet.has(projectId) && !titleSet.has(projectTitle)) {
        maxOrder += 1;
        safeProjects.push({ ...project, order: maxOrder });
      }
    });

    return safeProjects;
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
            this.projects = this.ensureSoftwareProjects(serverProjects);
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
        const storageProjects = await window.storageManager.loadProjects();
        this.projects = this.ensureSoftwareProjects(storageProjects);
        console.log(`✅ PortfolioSync: Loaded ${this.projects.length} projects from IndexedDB`);
        return this.projects;
      } else {
        console.warn('⚠️ Storage manager not available, using localStorage');
        const stored = localStorage.getItem('portfolio_projects');
        const localProjects = stored ? JSON.parse(stored) : [];
        this.projects = this.ensureSoftwareProjects(localProjects);
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
    const techStack = Array.isArray(project.techStack) ? project.techStack : [];
    const images = project.images || [];
    const organization = project.organization || '';
    const location = project.location || '';
    const period = project.period || '';
    const engagement = project.engagement || '';
    const projectLink = project.projectLink || '';

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

    const isSoftwareLayout = filterCategory === 'frontend';
    const detailsLine = [organization, location].filter(Boolean).join(' - ');
    const timelineLine = period && engagement
      ? `${period} (${engagement})`
      : (period || engagement);

    if (isSoftwareLayout) {
      const displayLink = projectLink
        ? projectLink.replace(/^https?:\/\//, '').replace(/\/$/, '')
        : '';
      const metadataCards = [];
      const organizationValue = organization || detailsLine;
      const timelineValue = period || timelineLine;

      if (organizationValue) {
        metadataCards.push(`
          <span class="software-meta-pill">
            <span class="software-meta-label">Organization</span>
            <span class="software-meta-value">${this.escapeHtml(organizationValue)}</span>
          </span>
        `);
      }

      if (timelineValue) {
        metadataCards.push(`
          <span class="software-meta-pill">
            <span class="software-meta-label">Timeline</span>
            <span class="software-meta-value">${this.escapeHtml(timelineValue)}</span>
          </span>
        `);
      }

      if (displayLink && projectLink) {
        metadataCards.push(`
          <a href="${projectLink}" class="software-meta-pill software-meta-link" target="_blank" rel="noopener noreferrer">
            <span class="software-meta-label">Project Link</span>
            <span class="software-meta-value">${this.escapeHtml(displayLink)}</span>
          </a>
        `);
      }

      const metadataLine = metadataCards.join('');
      const stackItems = techStack.length > 0 ? techStack : tags;
      const techStackChips = (stackItems && stackItems.length > 0)
        ? stackItems.map(tech => this.renderTechStackChip(tech)).join('')
        : `<span class="software-tech-chip is-muted">General Development</span>`;

      return `
      <div class="project-card software-project-card" data-category="${filterCategory}">
        <div class="project-content software-project-content">
          <div class="software-project-layout">
            <div class="software-project-main">
              <h3>${this.escapeHtml(title)}</h3>
              <p class="software-project-summary">${this.escapeHtml(description)}</p>
              ${metadataLine ? `<div class="software-project-meta-line">${metadataLine}</div>` : ''}
            </div>
            <aside class="software-tech-stack-panel" aria-label="Tech Stack">
              <p class="software-tech-stack-title">Tech Stack</p>
              <div class="software-tech-stack-list">
                ${techStackChips}
              </div>
            </aside>
          </div>
        </div>
      </div>
    `;
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
    return String(text).replace(/[&<>"']/g, m => map[m]);
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

          // Keep the currently selected filter active after reinitialization.
          const activeFilterButton = document.querySelector('.filter-btn.active');
          const activeFilter = activeFilterButton ? activeFilterButton.getAttribute('data-filter') : 'all';
          if (newInstance && typeof newInstance.filterProjects === 'function') {
            newInstance.filterProjects(activeFilter || 'all');
          }

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
