// ============================================
// ADMIN PANEL CONTROLLER
// Portfolio In-Game Editor
// ============================================

const ADMIN_PIN = '1234'; // Default PIN - change this!
const STORAGE_KEY = 'portfolio_projects';
const PIN_KEY = 'admin_pin';
const THEME_KEY = 'admin_theme';

// State Management
let projects = [];
let currentEditingProject = null;
let isAuthenticated = false;

// Theme handling
function updateThemeToggleButtons(theme) {
  const buttons = [document.getElementById('themeToggleBtn'), document.getElementById('themeToggleAuth')];
  const isDark = theme === 'dark';
  buttons.forEach(btn => {
    if (!btn) return;
    btn.textContent = isDark ? '☀️' : '🌙';
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  });
}

function setTheme(theme = 'dark') {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  updateThemeToggleButtons(theme);
}

function toggleTheme() {
  const current = document.body.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  setTheme(saved);
}

// Toast notification system
function showNotification(message, type = 'success', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.setAttribute('role', 'status');
  notification.setAttribute('aria-live', 'polite');
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('show'), 100);
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, duration);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initializeAdmin();
  loadProjects();
  setupEventListeners();
  updateProjectCount();
  setupFormValidation();
});

// ============================================
// AUTHENTICATION
// ============================================

function authenticateAdmin(e) {
  e.preventDefault();
  const pin = document.getElementById('adminPin').value;
  const savedPin = localStorage.getItem(PIN_KEY) || ADMIN_PIN;
  const authError = document.getElementById('authError');
  
  if (!pin || pin.length !== 4) {
    authError.textContent = '❌ PIN must be 4 digits';
    return;
  }
  
  if (pin === savedPin) {
    isAuthenticated = true;
    document.getElementById('authScreen').classList.remove('active');
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('adminScreen').style.display = 'grid';
    document.getElementById('adminPin').value = '';
    document.querySelector('.auth-header-controls').classList.add('hidden');
    showNotification('✅ Authentication successful!', 'success');
    
    // Load and display projects after authentication
    renderProjectsList();
    renderPreviewContainer();
    
    document.querySelector('[data-view="add-project"]').focus();
  } else {
    authError.textContent = '❌ Incorrect PIN. Try again.';
    document.getElementById('adminPin').value = '';
    document.getElementById('adminPin').focus();
  }
}

function logout() {
  if (!confirm('Are you sure you want to logout?')) return;
  
  isAuthenticated = false;
  document.getElementById('authScreen').classList.add('active');
  document.getElementById('authScreen').style.display = 'flex';
  document.getElementById('adminScreen').style.display = 'none';
  document.getElementById('adminPin').value = '';
  document.querySelector('.auth-header-controls').classList.remove('hidden');
  document.getElementById('adminPin').focus();
  showNotification('You have logged out', 'info');
}

// ============================================
// FORM VALIDATION
// ============================================

function setupFormValidation() {
  const form = document.getElementById('projectForm');
  const inputs = form.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    input.addEventListener('invalid', (e) => {
      e.preventDefault();
      input.setAttribute('aria-invalid', 'true');
    });
    
    input.addEventListener('input change', () => {
      if (input.validity.valid) {
        input.setAttribute('aria-invalid', 'false');
      }
    });
  });
}

function validateForm() {
  const title = document.getElementById('projectTitle').value.trim();
  const description = document.getElementById('projectDescription').value.trim();
  const category = document.getElementById('projectCategory').value;
  const type = document.getElementById('galleryType').value;
  const coverInput = document.getElementById('coverImage');
  
  if (!title) {
    showNotification('❌ Project title is required', 'error');
    return false;
  }
  
  if (title.length < 3) {
    showNotification('❌ Project title must be at least 3 characters', 'error');
    return false;
  }
  
  if (!description) {
    showNotification('❌ Project description is required', 'error');
    return false;
  }
  
  if (!category) {
    showNotification('❌ Please select a category', 'error');
    return false;
  }
  
  if (!type) {
    showNotification('❌ Please select a project type', 'error');
    return false;
  }
  
  if (!coverInput.files[0]) {
    showNotification('❌ Please select a cover image', 'error');
    return false;
  }
  
  // Validate image size (5MB max)
  if (coverInput.files[0].size > 5 * 1024 * 1024) {
    showNotification('❌ Cover image must be less than 5MB', 'error');
    return false;
  }
  
  if (type === 'multi' && document.getElementById('galleryImages').files.length === 0) {
    showNotification('❌ Please select gallery images for multi-image projects', 'error');
    return false;
  }
  
  return true;
}

// ============================================
// INITIALIZATION & EVENT LISTENERS
// ============================================

function initializeAdmin() {
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = e.currentTarget.getAttribute('data-view');
      
      if (!view) {
        console.error('Nav item missing data-view attribute');
        return;
      }
      
      // Update active state
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      // Switch to view
      switchView(view);
    });
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // Gallery type toggle
  document.getElementById('galleryType').addEventListener('change', updateGalleryUI);

  // Form submission
  document.getElementById('projectForm').addEventListener('submit', saveProject);

  // Reset form
  document.getElementById('resetFormBtn').addEventListener('click', resetProjectForm);

  // Settings
  document.getElementById('exportBtn').addEventListener('click', exportData);
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', importData);
  document.getElementById('clearAllBtn').addEventListener('click', clearAllData);
  document.getElementById('changePinBtn').addEventListener('click', openPinModal);

  // Image uploads with preview
  setupImageUpload('coverImage', 'coverPreview');
  setupMultiImageUpload('galleryImages', 'galleryPreview');

  // Live preview updates
  document.getElementById('projectForm').addEventListener('input', updateLivePreview);
  document.getElementById('projectForm').addEventListener('change', updateLivePreview);

  // Theme toggles (auth + header)
  [document.getElementById('themeToggleBtn'), document.getElementById('themeToggleAuth')].forEach(btn => {
    if (btn) btn.addEventListener('click', toggleTheme);
  });
}

function setupEventListeners() {
  // File drag and drop
  ['coverImage', 'galleryImages'].forEach(id => {
    const input = document.getElementById(id);
    const uploadArea = input.nextElementSibling;
    
    uploadArea.addEventListener('click', () => input.click());
    uploadArea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        input.click();
      }
    });
    
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      uploadArea.classList.remove('drag-over');
      
      const files = e.dataTransfer.files;
      if (files.length === 0) {
        showNotification('❌ No files dropped', 'error');
        return;
      }
      
      // Validate file types
      const validFiles = Array.from(files).filter(file => {
        if (!file.type.startsWith('image/')) {
          showNotification(`❌ ${file.name} is not an image`, 'error');
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          showNotification(`❌ ${file.name} exceeds 5MB limit`, 'error');
          return false;
        }
        return true;
      });
      
      if (validFiles.length === 0) return;
      
      // Create new FileList-like object
      const dt = new DataTransfer();
      validFiles.forEach(file => dt.items.add(file));
      input.files = dt.files;
      
      if (id === 'coverImage') {
        previewImage('coverImage', 'coverPreview');
      } else {
        previewMultipleImages('galleryImages', 'galleryPreview');
      }
      updateLivePreview();
      showNotification('✅ Image(s) uploaded', 'success');
    });
  });
}

// ============================================
// VIEW MANAGEMENT
// ============================================

function switchView(viewName) {
  // Hide all views
  document.querySelectorAll('.admin-view').forEach(view => {
    view.classList.remove('active');
  });
  
  // Map view names to IDs
  const viewMap = {
    'add-project': 'addProjectView',
    'manage-projects': 'manageProjectsView',
    'preview': 'previewView',
    'settings': 'settingsView'
  };
  
  const viewId = viewMap[viewName];
  const view = document.getElementById(viewId);
  
  if (view) {
    view.classList.add('active');
  } else {
    console.warn(`View not found: ${viewName} (${viewId})`);
  }
  
  // Special handling for certain views
  if (viewName === 'manage-projects') {
    renderProjectsList();
  } else if (viewName === 'preview') {
    renderPreviewContainer();
  }
}

// ============================================
// PROJECT FORM HANDLING
// ============================================

function updateGalleryUI() {
  const galleryType = document.getElementById('galleryType').value;
  const gallerySection = document.getElementById('gallerySection');
  
  if (galleryType === 'multi') {
    gallerySection.classList.remove('hidden');
    document.getElementById('galleryImages').required = true;
  } else {
    gallerySection.classList.add('hidden');
    document.getElementById('galleryImages').required = false;
    document.getElementById('galleryImages').value = '';
    document.getElementById('galleryPreview').innerHTML = '';
  }
}

function setupImageUpload(inputId, previewId) {
  const input = document.getElementById(inputId);
  input.addEventListener('change', () => previewImage(inputId, previewId));
}

function setupMultiImageUpload(inputId, previewId) {
  const input = document.getElementById(inputId);
  input.addEventListener('change', () => previewMultipleImages(inputId, previewId));
}

function previewImage(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.innerHTML = `
        <div class="preview-thumb">
          <img src="${e.target.result}" alt="Preview" />
          <button type="button" class="preview-thumb-remove" onclick="removePreview('${previewId}')">×</button>
        </div>
      `;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function previewMultipleImages(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  
  preview.innerHTML = '';
  
  if (input.files) {
    Array.from(input.files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const thumb = document.createElement('div');
        thumb.className = 'preview-thumb';
        thumb.innerHTML = `
          <img src="${e.target.result}" alt="Preview ${index + 1}" />
          <button type="button" class="preview-thumb-remove" onclick="removeGalleryImage(${index})">×</button>
        `;
        preview.appendChild(thumb);
      };
      reader.readAsDataURL(file);
    });
  }
}

function removePreview(previewId) {
  document.getElementById(previewId).innerHTML = '';
  document.getElementById('coverImage').value = '';
  updateLivePreview();
}

function removeGalleryImage(index) {
  const input = document.getElementById('galleryImages');
  const dt = new DataTransfer();
  Array.from(input.files).forEach((file, i) => {
    if (i !== index) dt.items.add(file);
  });
  input.files = dt.files;
  previewMultipleImages('galleryImages', 'galleryPreview');
  updateLivePreview();
}

function resetProjectForm() {
  document.getElementById('projectForm').reset();
  document.getElementById('coverPreview').innerHTML = '';
  document.getElementById('galleryPreview').innerHTML = '';
  document.getElementById('gallerySection').classList.add('hidden');
  document.getElementById('livePreview').innerHTML = '<p class="preview-empty">Fill in project details to see preview</p>';
  currentEditingProject = null;
}

function updateLivePreview() {
  const title = document.getElementById('projectTitle').value;
  const description = document.getElementById('projectDescription').value;
  const coverInput = document.getElementById('coverImage');
  const tags = [document.getElementById('projectTag1').value, document.getElementById('projectTag2').value].filter(t => t);
  
  let preview = '<div class="preview-content">';
  
  if (coverInput.files && coverInput.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('livePreview').innerHTML = `
        <div class="preview-content">
          <img src="${e.target.result}" alt="Preview" class="preview-content-image" />
          <div class="preview-content-title">${title || 'Project Title'}</div>
          <div class="preview-content-desc">${description || 'Project description'}</div>
          <div class="preview-tags">
            ${tags.map(tag => `<span class="preview-tag">${tag}</span>`).join('')}
          </div>
        </div>
      `;
    };
    reader.readAsDataURL(coverInput.files[0]);
  } else {
    document.getElementById('livePreview').innerHTML = `
      <div class="preview-content">
        <div style="width: 100%; aspect-ratio: 16/9; background: var(--color-glass-medium); border-radius: var(--radius-md); margin-bottom: 1rem; display: flex; align-items: center; justify-content: center; color: var(--color-text-secondary);">No image</div>
        <div class="preview-content-title">${title || 'Project Title'}</div>
        <div class="preview-content-desc">${description || 'Project description'}</div>
        <div class="preview-tags">
          ${tags.map(tag => `<span class="preview-tag">${tag}</span>`).join('')}
        </div>
      </div>
    `;
  }
}

function saveProject(e) {
  e.preventDefault();
  
  // Validate form first
  if (!validateForm()) {
    return;
  }
  
  const coverInput = document.getElementById('coverImage');
  const galleryInput = document.getElementById('galleryImages');
  const submitBtn = e.target.querySelector('button[type="submit"]');
  
  // Show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = '⏳ Saving...';
  
  try {
    const coverReader = new FileReader();
    coverReader.onload = (e) => {
      const coverImage = e.target.result;
      
      const project = {
        id: currentEditingProject?.id || Date.now(),
        title: document.getElementById('projectTitle').value.trim(),
        description: document.getElementById('projectDescription').value.trim(),
        category: document.getElementById('projectCategory').value,
        coverImage: coverImage,
        galleryType: document.getElementById('galleryType').value,
        galleryImages: [],
        tags: [
          document.getElementById('projectTag1').value.trim(),
          document.getElementById('projectTag2').value.trim()
        ].filter(t => t)
      };
      
      // Handle gallery images
      if (project.galleryType === 'multi' && galleryInput.files.length > 0) {
        let imagesProcessed = 0;
        Array.from(galleryInput.files).forEach((file, index) => {
          if (file.size > 5 * 1024 * 1024) {
            showNotification(`❌ Gallery image ${index + 1} exceeds 5MB limit`, 'error');
            return;
          }
          
          const reader = new FileReader();
          reader.onload = (e) => {
            project.galleryImages.push(e.target.result);
            imagesProcessed++;
            
            if (imagesProcessed === galleryInput.files.length) {
              saveProjectToStorage(project, submitBtn);
            }
          };
          reader.onerror = () => {
            showNotification(`❌ Error reading gallery image ${index + 1}`, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = '💾 Save Project';
          };
          reader.readAsDataURL(file);
        });
      } else {
        saveProjectToStorage(project, submitBtn);
      }
    };
    
    coverReader.onerror = () => {
      showNotification('❌ Error reading cover image', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = '💾 Save Project';
    };
    
    coverReader.readAsDataURL(coverInput.files[0]);
  } catch (err) {
    showNotification(`❌ Error: ${err.message}`, 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = '💾 Save Project';
  }
}

function saveProjectToStorage(project, submitBtn = null) {
  try {
    // Normalize project data for portfolio sync
    // Ensure compatibility with portfolio-sync.js
    const normalizedProject = {
      ...project,
      // Support both naming conventions
      projectType: project.galleryType, // 'single' or 'multi'
      images: project.galleryImages || [], // Array of gallery images
      // Keep original fields for backward compatibility
      galleryType: project.galleryType,
      galleryImages: project.galleryImages || []
    };

    if (currentEditingProject) {
      // Update existing
      const index = projects.findIndex(p => p.id === currentEditingProject.id);
      if (index !== -1) {
        projects[index] = normalizedProject;
        showNotification('✅ Project updated successfully!', 'success');
      }
    } else {
      // Add new
      projects.push(normalizedProject);
      showNotification('✅ Project added successfully!', 'success');
    }
    
    // Persist and sync
    persistProjects('save');
    
    // Reset form
    resetProjectForm();
    updateProjectCount();
    
    // Refresh views
    renderProjectsList();
    renderPreviewContainer();
    
    // Reset button state
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = '💾 Save Project';
    }
    
    // Notify portfolio to refresh (if it's open in another tab)
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'portfolio_projects',
      newValue: JSON.stringify(projects),
      url: window.location.href
    }));
  } catch (err) {
    showNotification(`❌ Storage error: ${err.message}`, 'error');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = '💾 Save Project';
    }
  }
}

// ============================================
// MANAGE PROJECTS VIEW
// ============================================

function renderProjectsList() {
  const list = document.getElementById('projectsList');
  
  if (projects.length === 0) {
    list.innerHTML = '<p class="empty-state">No projects yet. Create one to get started!</p>';
    return;
  }
  
  list.innerHTML = projects.map(project => `
    <div class="project-card">
      <img src="${project.coverImage}" alt="${project.title}" class="project-card-image" />
      <div class="project-card-content">
        <div class="project-card-title">${project.title}</div>
        <div class="project-card-meta">
          <span class="project-card-category">${project.category}</span>
          ${project.galleryType === 'multi' ? `<span class="project-card-category">📸 ${project.galleryImages.length} images</span>` : ''}
        </div>
        <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-bottom: 1rem;">${project.description.substring(0, 60)}...</p>
        <div class="project-card-actions">
          <button class="btn btn-secondary" onclick="editProject('${project.id}')">✏️ Edit</button>
          <button class="btn btn-secondary" onclick="deleteProject('${project.id}')">🗑️ Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

function editProject(id) {
  const project = projects.find(p => p.id === parseInt(id) || p.id === id);
  if (!project) return;
  
  currentEditingProject = project;
  
  // Populate form
  document.getElementById('projectTitle').value = project.title;
  document.getElementById('projectDescription').value = project.description;
  document.getElementById('projectCategory').value = project.category;
  document.getElementById('galleryType').value = project.galleryType;
  document.getElementById('projectTag1').value = project.tags[0] || '';
  document.getElementById('projectTag2').value = project.tags[1] || '';
  
  // Show cover preview
  document.getElementById('coverPreview').innerHTML = `
    <div class="preview-thumb">
      <img src="${project.coverImage}" alt="Cover" />
      <button type="button" class="preview-thumb-remove" onclick="removePreview('coverPreview')">×</button>
    </div>
  `;
  
  // Update gallery UI
  updateGalleryUI();
  if (project.galleryType === 'multi' && project.galleryImages.length > 0) {
    document.getElementById('galleryPreview').innerHTML = project.galleryImages.map((img, idx) => `
      <div class="preview-thumb">
        <img src="${img}" alt="Gallery ${idx + 1}" />
        <button type="button" class="preview-thumb-remove" onclick="removeGalleryImage(${idx})">×</button>
      </div>
    `).join('');
  }
  
  // Switch to add project view
  switchView('add-project');
  document.querySelector('[data-view="add-project"]').click();
  
  // Scroll to form
  document.querySelector('.project-form').scrollIntoView({ behavior: 'smooth' });
  
  updateLivePreview();
}

function deleteProject(id) {
  const project = projects.find(p => p.id === parseInt(id) || p.id === id);
  if (!project) return;
  
  if (confirm(`Delete "${project.title}"? This cannot be undone.`)) {
    try {
      projects = projects.filter(p => p.id !== parseInt(id) && p.id !== id);
      persistProjects('delete');
      showNotification('✅ Project deleted', 'success');
    } catch (err) {
      showNotification(`❌ Error deleting project: ${err.message}`, 'error');
    }
  }
}

// ============================================
// PREVIEW VIEW
// ============================================

function renderPreviewContainer() {
  const container = document.getElementById('previewContainer');
  
  if (projects.length === 0) {
    container.innerHTML = '<p class="empty-state">No projects yet. Create one to get started!</p>';
    return;
  }
  
  container.innerHTML = projects.map(project => `
    <div class="project-card" data-id="${project.id}">
      <div class="drag-handle" aria-label="Drag to reorder" title="Drag to reorder">⇅ Drag</div>
      <img src="${project.coverImage}" alt="${project.title}" class="project-card-image" />
      <div class="project-card-content">
        <div class="project-card-title">${project.title}</div>
        <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-bottom: 1rem;">${project.description}</p>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${project.tags.map(tag => `<span class="project-card-category">${tag}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');

  enablePreviewDrag();
}

function enablePreviewDrag() {
  const container = document.getElementById('previewContainer');
  if (!container) return;
  const cards = Array.from(container.querySelectorAll('.project-card'));
  let dragSrcIndex = null;

  cards.forEach((card, index) => {
    card.setAttribute('draggable', 'true');
    card.dataset.index = index;

    card.addEventListener('dragstart', (e) => {
      dragSrcIndex = index;
      card.classList.add('dragging');
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', 'drag');
      }
    });

    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      card.classList.add('drag-over');
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move';
      }
    });

    card.addEventListener('dragleave', () => {
      card.classList.remove('drag-over');
    });

    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('drag-over');

      if (dragSrcIndex === null) return;
      const dropIndex = parseInt(card.dataset.index, 10);
      if (isNaN(dropIndex)) return;

      const [moved] = projects.splice(dragSrcIndex, 1);
      projects.splice(dropIndex, 0, moved);
      persistProjects('reorder');
      renderProjectsList();
      renderPreviewContainer();
      showNotification('✅ Order updated', 'success');
    });

    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      card.classList.remove('drag-over');
      dragSrcIndex = null;
    });
  });
}

// ============================================
// SETTINGS
// ============================================

function updateProjectCount() {
  document.getElementById('totalProjects').textContent = projects.length;
}

function exportData() {
  try {
    if (projects.length === 0) {
      showNotification('⚠️ No projects to export', 'warning');
      return;
    }
    
    const dataStr = JSON.stringify(projects, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-projects-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('✅ Data exported successfully', 'success');
  } catch (err) {
    showNotification(`❌ Export error: ${err.message}`, 'error');
  }
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  try {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        
        if (!Array.isArray(imported)) {
          showNotification('❌ Invalid data format - must be an array', 'error');
          return;
        }
        
        // Validate each project
        const valid = imported.every(p => 
          p.id && p.title && p.description && p.category && p.coverImage
        );
        
        if (!valid) {
          showNotification('❌ Some projects are missing required fields', 'error');
          return;
        }
        
        projects = imported;
        persistProjects('import');
        updateProjectCount();
        renderProjectsList();
        renderPreviewContainer();
        showNotification(`✅ Imported ${projects.length} project(s)!`, 'success');
      } catch (err) {
        showNotification(`❌ Error parsing JSON: ${err.message}`, 'error');
      }
    };
    reader.onerror = () => {
      showNotification('❌ Error reading file', 'error');
    };
    reader.readAsText(file);
  } catch (err) {
    showNotification(`❌ Error: ${err.message}`, 'error');
  }
  
  // Reset file input
  e.target.value = '';
}

function clearAllData() {
  if (!confirm('⚠️ This will delete ALL projects. Are you absolutely sure?')) return;
  if (!confirm('Type "DELETE" if you really want to clear everything (just kidding, but are you sure?)')) return;
  
  try {
    projects = [];
    persistProjects('clear');
    updateProjectCount();
    renderProjectsList();
    renderPreviewContainer();
    showNotification('✅ All data cleared', 'success');
  } catch (err) {
    showNotification(`❌ Error clearing data: ${err.message}`, 'error');
  }
}

function openPinModal() {
  document.getElementById('pinModal').classList.add('active');
  document.getElementById('currentPin').focus();
}

function closePinModal() {
  document.getElementById('pinModal').classList.remove('active');
  document.getElementById('changePinForm').reset();
  document.getElementById('pinError').textContent = '';
}

function closeModal() {
  document.getElementById('projectModal').classList.remove('active');
  document.getElementById('editProjectForm').reset();
}

function changePin(e) {
  e.preventDefault();
  
  const currentPin = document.getElementById('currentPin').value;
  const newPin = document.getElementById('newPin').value;
  const confirmPin = document.getElementById('confirmPin').value;
  const savedPin = localStorage.getItem(PIN_KEY) || ADMIN_PIN;
  const pinError = document.getElementById('pinError');
  
  // Validate current PIN
  if (currentPin !== savedPin) {
    pinError.textContent = '❌ Current PIN is incorrect';
    return;
  }
  
  // Validate new PIN format
  if (newPin.length !== 4 || !/^[0-9]{4}$/.test(newPin)) {
    pinError.textContent = '❌ PIN must be exactly 4 digits';
    return;
  }
  
  // Check if PINs match
  if (newPin !== confirmPin) {
    pinError.textContent = '❌ New PINs do not match';
    return;
  }
  
  // Check if same as current
  if (newPin === currentPin) {
    pinError.textContent = '❌ New PIN must be different from current';
    return;
  }
  
  try {
    localStorage.setItem(PIN_KEY, newPin);
    pinError.textContent = '';
    showNotification('✅ PIN updated successfully!', 'success');
    closePinModal();
  } catch (err) {
    pinError.textContent = `❌ Error: ${err.message}`;
  }
}

// ============================================
// DATA PERSISTENCE
// ============================================

function loadProjects() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    projects = stored ? JSON.parse(stored) : [];
    
    // Validate data integrity
    if (!Array.isArray(projects)) {
      console.warn('Invalid projects data, resetting');
      projects = [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    }
  } catch (err) {
    console.error('Error loading projects:', err);
    projects = [];
    showNotification('⚠️ Error loading projects, starting fresh', 'warning');
  }
}

function persistProjects(reason = 'update') {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));

    // Notify any open portfolio tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'portfolio_projects',
      newValue: JSON.stringify(projects),
      url: window.location.href
    }));
  } catch (err) {
    console.error(`Error persisting projects (${reason}):`, err);
  }
}
