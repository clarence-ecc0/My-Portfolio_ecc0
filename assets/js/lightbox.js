// Enhanced Lightbox with Gallery Support
document.addEventListener('DOMContentLoaded', () => {
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
    
    // Get all lightbox trigger elements
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger, .gallery-trigger, .view-full-size');
    
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
    
    // Add click event to all trigger elements
    lightboxTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Check if it's a gallery trigger (multiple images)
            const galleryData = trigger.getAttribute('data-gallery');
            if (galleryData) {
                const images = galleryData.split(',').map(img => img.trim());
                openLightbox(images, 0);
            } else {
                const imageSrc = trigger.getAttribute('href');
                openLightbox([imageSrc], 0);
            }
        });
    });
    
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
});
