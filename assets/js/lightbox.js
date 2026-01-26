// Enhanced Lightbox with Gallery Support
let lightboxInstance = null;

function initializeLightbox() {
    // Only create lightbox elements once
    if (!lightboxInstance) {
        // Create lightbox elements
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        
        const lightboxContent = document.createElement('div');
        lightboxContent.className = 'lightbox-content';
        
        const lightboxViewer = document.createElement('div');
        lightboxViewer.className = 'lightbox-viewer';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'lightbox-close';
        closeButton.innerHTML = '×';
        
        // Navigation buttons
        const prevButton = document.createElement('button');
        prevButton.className = 'lightbox-nav lightbox-prev';
        prevButton.innerHTML = '‹';
        
        const nextButton = document.createElement('button');
        nextButton.className = 'lightbox-nav lightbox-next';
        nextButton.innerHTML = '›';
        
        // Counter display
        const counter = document.createElement('div');
        counter.className = 'lightbox-counter';
        
        lightboxContent.appendChild(lightboxViewer);
        lightboxContent.appendChild(closeButton);
        lightboxContent.appendChild(prevButton);
        lightboxContent.appendChild(nextButton);
        lightboxContent.appendChild(counter);
        lightbox.appendChild(lightboxContent);
        document.body.appendChild(lightbox);
        
        // Gallery state
        let currentImages = [];
        let currentIndex = 0;
        
        // Function to update image
        function updateImage() {
            const img = document.createElement('img');
            img.src = currentImages[currentIndex];
            lightboxViewer.innerHTML = '';
            lightboxViewer.appendChild(img);
            
            // Update counter
            if (currentImages.length > 1) {
                counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
                counter.style.display = 'block';
                prevButton.style.display = 'flex';
                nextButton.style.display = 'flex';
            } else {
                counter.style.display = 'none';
                prevButton.style.display = 'none';
                nextButton.style.display = 'none';
            }
            
            // Update button states
            prevButton.disabled = currentIndex === 0;
            nextButton.disabled = currentIndex === currentImages.length - 1;
        }
        
        // Function to open lightbox
        function openLightbox(images, startIndex = 0) {
            currentImages = Array.isArray(images) ? images : [images];
            currentIndex = startIndex;
            updateImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Function to close lightbox
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                lightboxViewer.innerHTML = '';
                currentImages = [];
                currentIndex = 0;
            }, 300);
        }
        
        // Navigation functions
        function showPrev() {
            if (currentIndex > 0) {
                currentIndex--;
                updateImage();
            }
        }
        
        function showNext() {
            if (currentIndex < currentImages.length - 1) {
                currentIndex++;
                updateImage();
            }
        }
        
        // Event listeners
        closeButton.addEventListener('click', closeLightbox);
        prevButton.addEventListener('click', showPrev);
        nextButton.addEventListener('click', showNext);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPrev();
            } else if (e.key === 'ArrowRight') {
                showNext();
            }
        });
        
        lightboxInstance = { lightbox, openLightbox, closeLightbox };
    }
    
    // Always re-attach event listeners to all triggers (including new ones)
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger, .gallery-trigger, .view-full-size');
    
    console.log(`🔍 Found ${lightboxTriggers.length} lightbox triggers`);
    
    lightboxTriggers.forEach((trigger, index) => {
        // Remove existing listener (if any) and add fresh one
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);
        
        newTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Check if it's a gallery trigger (multiple images)
            const galleryData = newTrigger.getAttribute('data-gallery');
            if (galleryData) {
                console.log(`🖼️ Opening gallery ${index + 1}:`, galleryData.substring(0, 100) + '...');
                // Split by ||| separator (safe for base64 data URLs)
                const images = galleryData.split('|||').map(img => img.trim());
                console.log(`   → ${images.length} images found`);
                lightboxInstance.openLightbox(images, 0);
            } else {
                const imageSrc = newTrigger.getAttribute('href');
                console.log(`🖼️ Opening single image ${index + 1}:`, imageSrc ? imageSrc.substring(0, 50) : 'none');
                lightboxInstance.openLightbox([imageSrc], 0);
            }
        });
    });
    
    console.log(`✅ Lightbox initialized for ${lightboxTriggers.length} triggers`);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeLightbox);

// Make function globally available for reinitializing after dynamic content
window.setupGalleryTriggers = initializeLightbox;
