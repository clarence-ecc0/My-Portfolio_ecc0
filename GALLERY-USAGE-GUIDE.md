# Multi-Image Gallery Usage Guide

## ✨ Overview
Your lightbox now supports **multi-image galleries** perfect for brochures, PDFs, and multi-page designs!

## 🎯 How It Works

### Single Image (Original Behavior)
For single images, use the regular structure:
```html
<div class="project-card" data-category="graphic">
  <div class="project-image">
    <img src="assets/graphic_design/poster.png" alt="Poster Design" />
  </div>
  <div class="project-overlay">
    <a href="assets/graphic_design/poster.png" class="project-link view-full-size">View Full Size</a>
  </div>
  <div class="project-content">
    <h3>Event Poster</h3>
    <p>Single poster design</p>
  </div>
</div>
```

### Multi-Image Gallery (New!)
For brochures or multi-page projects:
```html
<div class="project-card" data-category="graphic">
  <div class="project-image">
    <!-- Only show the BLINK (cover/display image) here -->
    <img src="assets/graphic_design/brochure-cover.png" alt="Brochure Cover" />
  </div>
  <div class="project-overlay">
    <a 
      href="#" 
      class="project-link gallery-trigger" 
      data-gallery="assets/graphic_design/brochure-cover.png, assets/graphic_design/brochure-page2.png, assets/graphic_design/brochure-page3.png, assets/graphic_design/brochure-page4.png"
    >View Gallery (4 images)</a>
  </div>
  <div class="project-content">
    <h3>Product Brochure</h3>
    <p>Multi-page brochure design</p>
    <div class="project-tags">
      <span class="tag">Brochure</span>
      <span class="tag">Multi-page</span>
    </div>
  </div>
</div>
```

## 🔑 Key Points

### For Multi-Image Galleries:
1. **`class="gallery-trigger"`** - Add this class to the link
2. **`data-gallery="image1.png, image2.png, image3.png"`** - List ALL images separated by commas
3. **`href="#"`** - Can be # since we're using data-gallery
4. **Only the first/cover image** shows in the portfolio grid
5. **Text like "View Gallery (4 images)"** tells users there are multiple images

### Features:
- ✅ **Previous/Next arrows** for navigation
- ✅ **Image counter** shows "2 / 5" at the bottom
- ✅ **Keyboard support**: Left/Right arrows, Escape to close
- ✅ **Smooth animations** between images
- ✅ **Mobile-friendly** touch swipe ready

## 📝 Workflow for Adding Brochures

1. **Convert PDF to Images**
   - Export each page as JPG/PNG (1200-1500px width recommended)
   - Name them logically: `project-name-page1.png`, `project-name-page2.png`, etc.

2. **Upload to folder**
   - Place in `assets/graphic_design/`

3. **Create project card**
   - Use the cover image for the `<img>` tag
   - List all pages in `data-gallery` attribute
   - Update the link text to show count: "View Gallery (X images)"

4. **Test**
   - Click the project card
   - Navigate with arrows or keyboard
   - Verify all images load correctly

## 🎨 Example Use Cases

- **Brochures**: Show cover, navigate through all pages
- **Magazines**: Display spreads sequentially
- **Multi-panel designs**: Show all variations
- **Before/After series**: Navigate through progression
- **Brand identity packages**: Show multiple deliverables

## 💡 Tips

- Keep image file sizes optimized (under 500KB each)
- Use consistent naming conventions
- Consider adding page numbers to filenames
- Update the counter text to match actual image count
- Cover images should be your most compelling visual

---

**Need Help?** The lightbox automatically handles everything - just set up the HTML correctly!
