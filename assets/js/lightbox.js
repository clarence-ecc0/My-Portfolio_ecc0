// Lightbox functionality
document.addEventListener('DOMContentLoaded', () => {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    
    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';
    
    const lightboxViewer = document.createElement('div');
    lightboxViewer.className = 'lightbox-viewer';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'close-lightbox';
    closeButton.innerHTML = '×';
    
    lightboxContent.appendChild(lightboxViewer);
    lightboxContent.appendChild(closeButton);
    lightbox.appendChild(lightboxContent);
    document.body.appendChild(lightbox);
    
    // Get all lightbox trigger elements
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    
    // Function to open lightbox
    function openLightbox(imageSrc) {
        const img = document.createElement('img');
        img.src = imageSrc;
        lightboxViewer.innerHTML = '';
        lightboxViewer.appendChild(img);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Function to close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxViewer.innerHTML = '';
        }, 300);
    }
    
    // Add click event to all trigger elements
    lightboxTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const imageSrc = trigger.getAttribute('href');
            openLightbox(imageSrc);
        });
    });
    
    // Close lightbox when clicking close button or outside the image
    closeButton.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close lightbox with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
});
