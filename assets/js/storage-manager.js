// ============================================
// STORAGE MANAGER - IndexedDB for Large Data
// Handles portfolio projects with Base64 images
// ============================================

const DB_NAME = 'PortfolioDatabase';
const DB_VERSION = 1;
const STORE_NAME = 'projects';

class StorageManager {
  constructor() {
    this.db = null;
    this.fallbackToLocalStorage = false;
  }

  // Initialize IndexedDB
  async init() {
    return new Promise((resolve, reject) => {
      console.log('💛 init() called - opening IndexedDB...');
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('❌ IndexedDB open error:', request.error);
        this.fallbackToLocalStorage = true;
        this.db = null;
        console.warn('⚠️ Falling back to localStorage');
        resolve();
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB opened successfully, db object created');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        console.log('💛 onupgradeneeded fired');
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          objectStore.createIndex('title', 'title', { unique: false });
          objectStore.createIndex('category', 'category', { unique: false });
          console.log('📦 IndexedDB object store created');
        }
      };
    });
  }

  // Save all projects
  async saveProjects(projects) {
    console.log(`💾 SAVING: ${projects.length} projects to storage`);
    projects.forEach(p => {
      console.log(`   - "${p.title}" (ID: ${p.id})`);
    });

    // Persist explicit order to preserve drag-and-drop sorting
    projects.forEach((project, index) => {
      project.order = index;
    });
    
    if (this.fallbackToLocalStorage || !this.db) {
      // Fallback to localStorage (will still hit quota issues)
      try {
        localStorage.setItem('portfolio_projects', JSON.stringify(projects));
        console.log('✅ Saved to localStorage');
        return true;
      } catch (err) {
        console.error('localStorage quota exceeded:', err);
        return false;
      }
    }

    // Use IndexedDB
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);

      // Clear existing data
      objectStore.clear();

      // Add all projects
      projects.forEach(project => {
        objectStore.add(project);
      });

      transaction.oncomplete = () => {
        console.log(`✅ Saved ${projects.length} projects to IndexedDB`);
        // Also save to localStorage for migration script compatibility
        this.saveProjectsListToLocalStorage(projects);
        resolve(true);
      };

      transaction.onerror = () => {
        console.error('IndexedDB transaction error:', transaction.error);
        reject(false);
      };
    });
  }

  // Save lightweight project list to localStorage (without images)
  saveProjectsListToLocalStorage(projects) {
    try {
      const lightweightProjects = projects.map(p => {
        // Helper to get image count
        const getImageCount = (data) => {
          if (!data) return 0;
          if (Array.isArray(data)) return data.length;
          if (typeof data === 'string') return data.split('|||').length;
          return 0;
        };

        return {
          id: p.id,
          title: p.title,
          description: p.description,
          category: p.category,
          tags: p.tags,
          projectType: p.projectType,
          galleryType: p.galleryType,
          // Store only image count, not actual Base64 data
          coverImage: p.coverImage ? '[BASE64]' : '',
          images: p.images ? `[${getImageCount(p.images)} images]` : '',
          galleryImages: p.galleryImages ? `[${getImageCount(p.galleryImages)} images]` : ''
        };
      });
      
      localStorage.setItem('portfolio_projects_list', JSON.stringify(lightweightProjects));
      console.log('💾 Saved lightweight project list to localStorage');
    } catch (err) {
      console.warn('Could not save to localStorage:', err);
    }
  }

  // Load all projects
  async loadProjects() {
    console.log('💛 StorageManager.loadProjects() called');
    
    // ALWAYS wait for storage manager to be ready first
    await waitForStorageManager();
    console.log('💛 Storage manager confirmed ready');
    
    if (this.fallbackToLocalStorage || !this.db) {
      console.log('💛 Using localStorage fallback');
      try {
        const stored = localStorage.getItem('portfolio_projects');
        let projects = stored ? JSON.parse(stored) : [];
        console.log(`📂 LOADING: ${projects.length} projects from localStorage`);
        if (projects.some(p => typeof p.order === 'number')) {
          projects = projects.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        }
        return projects;
      } catch (err) {
        console.error('Error loading from localStorage:', err);
        return [];
      }
    }
    
    console.log('💛 Using IndexedDB');

    // Use IndexedDB
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.getAll();

      request.onsuccess = async () => {
        let projects = request.result || [];
        console.log(`💛 IndexedDB returned ${projects.length} projects`);
        
        // If IndexedDB is empty, check localStorage for existing data
        if (projects.length === 0) {
          console.log('💛 IndexedDB empty, checking localStorage for migration...');
          try {
            const stored = localStorage.getItem('portfolio_projects');
            if (stored) {
              const localProjects = JSON.parse(stored);
              console.log(`💛 Found ${localProjects.length} projects in localStorage`);
              if (localProjects.length > 0) {
                console.log(`🔄 Migrating ${localProjects.length} projects from localStorage to IndexedDB...`);
                await this.saveProjects(localProjects);
                projects = localProjects;
                console.log('✅ Migration complete!');
              }
            }
          } catch (err) {
            console.warn('Could not migrate from localStorage:', err);
          }
        }
        
        if (projects.some(p => typeof p.order === 'number')) {
          projects = projects.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        }

        console.log(`📂 LOADING: ${projects.length} projects from IndexedDB`);
        projects.forEach(p => {
          console.log(`   - "${p.title}" (ID: ${p.id})`);
        });
        resolve(projects);
      };

      request.onerror = () => {
        console.error('Error loading projects:', request.error);
        resolve([]);
      };
    });
  }

  // Get single project by ID
  async getProject(id) {
    if (this.fallbackToLocalStorage || !this.db) {
      const projects = await this.loadProjects();
      return projects.find(p => p.id === id);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  }

  // Delete project
  async deleteProject(id) {
    if (this.fallbackToLocalStorage || !this.db) {
      const projects = await this.loadProjects();
      const filtered = projects.filter(p => p.id !== id);
      return this.saveProjects(filtered);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.delete(id);

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => resolve(false);
    });
  }

  // Check storage usage
  async getStorageEstimate() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const percentUsed = (estimate.usage / estimate.quota) * 100;
      console.log(`💾 Storage: ${(estimate.usage / 1024 / 1024).toFixed(2)}MB / ${(estimate.quota / 1024 / 1024).toFixed(2)}MB (${percentUsed.toFixed(1)}%)`);
      return estimate;
    }
    return null;
  }
}

// Global instance
const storageManager = new StorageManager();

// IMPORTANT: Make it accessible from other scripts
window.storageManager = storageManager;

// Auto-initialize and set global flag when ready
let storageManagerReady = false;
(async function() {
  console.log('💛 Storage manager IIFE starting...');
  console.log('💛 Calling storageManager.init()...');
  await storageManager.init();
  
  console.log(`💛 After init(): storageManager.db = ${storageManager.db ? 'EXISTS' : 'NULL'}`);
  console.log(`💛 fallbackToLocalStorage = ${storageManager.fallbackToLocalStorage}`);
  
  // CRITICAL: Verify db is actually ready
  if (!storageManager.db && !storageManager.fallbackToLocalStorage) {
    console.error('❌ Storage manager init failed - db is null and fallback is off!');
    // Force fallback
    storageManager.fallbackToLocalStorage = true;
  }
  
  storageManagerReady = true;
  console.log('✅ Storage Manager initialization complete');
  
  if (storageManager.db) {
    console.log('✅ Using IndexedDB');
    await storageManager.getStorageEstimate();
  } else if (storageManager.fallbackToLocalStorage) {
    console.log('⚠️ Using localStorage fallback');
  }
})();

// Helper to wait for storage manager
async function waitForStorageManager() {
  if (storageManagerReady) {
    console.log(`💛 Storage manager ready. db=${storageManager.db ? 'YES' : 'NO'}, fallback=${storageManager.fallbackToLocalStorage}`);
    return;
  }
  
  console.log('💛 Waiting for storage manager initialization...');
  
  return new Promise(resolve => {
    const check = setInterval(() => {
      if (storageManagerReady) {
        clearInterval(check);
        console.log('💛 Storage manager is now ready');
        resolve();
      }
    }, 50);
    
    setTimeout(() => {
      clearInterval(check);
      console.warn('⚠️ Storage manager init timeout after 5 seconds');
      resolve();
    }, 5000);
  });
}
