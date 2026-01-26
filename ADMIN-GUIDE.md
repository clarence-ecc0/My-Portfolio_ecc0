# 🎮 Portfolio Admin Panel - In-Game Editor Guide

Welcome to your portfolio's in-game editor! This admin panel lets you manage your portfolio projects without touching any code.

## 🚀 Quick Start

### Access the Admin Panel

1. Go to: `https://your-portfolio-url/admin.html`
2. Enter your 4-digit admin PIN
3. **Default PIN:** `1234` (⚠️ Change this ASAP!)

### Add Your First Project

1. Click **➕ Add New Project**
2. Fill in:
   - **Project Title** - Name of your project
   - **Category** - Graphic Design / UI/UX Design / Frontend
   - **Description** - Project details
   - **Cover Image** - Drag & drop or click to upload
   - **Project Type** - Single Image or Multi-Image Gallery
   - **Tags** - Up to 2 tags for categorization
3. Click **💾 Save Project**
4. Your project appears immediately on your portfolio!

---

## 📋 Features Overview

### ✨ Views/Sections

#### **1. Add New Project** ➕
- Create or edit projects
- Live preview pane shows how it will look
- Support for single and multi-image galleries
- Drag & drop image upload
- Image preview before saving

#### **2. Manage Projects** 📋
- View all your projects
- Edit existing projects
- Delete projects
- Quick action buttons
- Project cards show metadata

#### **3. Live Preview** 👁️
- See how all projects look on the portfolio
- Real-time updates as you add/edit projects
- Mobile-responsive preview

#### **4. Settings** ⚙️
- **Data Management:**
  - Export projects as JSON (backup)
  - Import projects from JSON (restore)
  - Total project count
- **Reset:**
  - Clear all data (with confirmation)
- **Security:**
  - Change your admin PIN
  - 4-digit PIN required

---

## 🖼️ Project Types

### Single Image
- **Use when:** One image fully represents the project
- **Example:** A logo design, poster, or single graphic
- Link: Click opens full-size image viewer

### Multi-Image Gallery
- **Use when:** Multiple images (brochure pages, pitch deck, portfolio series)
- **Example:** 11-page brochure, 13-slide pitch deck
- Link: Click opens gallery with navigation arrows
- Counter shows "3 / 11" (current / total)
- Previous/Next buttons navigate pages
- Escape key closes gallery

---

## 📸 Image Best Practices

### Cover Image
- **Size:** 1200-1500px wide recommended
- **Format:** JPG or PNG
- **Aspect Ratio:** 16:9 works best
- **Quality:** Optimized (< 500KB)

### Gallery Images
- **Size:** 1200-1500px wide recommended
- **Format:** JPG or PNG
- **Aspect Ratio:** Consistent across images
- **Order:** Upload in sequence (page 1, page 2, etc.)
- **Quality:** Optimized (< 500KB each)

### Upload Tips
- Drag & drop is faster than clicking
- Drag from file explorer into the upload area
- Preview loads automatically
- Remove images with the × button

---

## 🔐 Security

### Default PIN
- Default PIN: `1234`
- **⚠️ CHANGE THIS IMMEDIATELY**
- Only you should know it

### Changing Your PIN
1. Go to **⚙️ Settings**
2. Click **🔑 Change PIN**
3. Enter current PIN, new PIN (4 digits), confirm
4. Click **Update PIN**
5. Your old PIN no longer works

### PIN Requirements
- Must be exactly 4 digits
- Numbers only
- Change whenever you feel it's been compromised

---

## 💾 Data Management

### Export Your Data
1. Go to **⚙️ Settings**
2. Click **📥 Export Data (JSON)**
3. File downloads: `portfolio-projects-YYYY-MM-DD.json`
4. Save in a safe place (backup)

### Import Projects
1. Go to **⚙️ Settings**
2. Click **📤 Import Data (JSON)**
3. Select your JSON file
4. Projects are restored
5. **Note:** Overwrites current projects

### Backup Strategy
- Export your data monthly
- Store backups in multiple places
- Before major changes, export first

---

## 🎯 Category Guide

### Graphic Design
- Logos, brochures, posters
- Social media graphics
- Marketing materials
- Print designs
- Event graphics

### UI/UX Design
- Website mockups
- App interfaces
- Design systems
- Wireframes
- Interactive prototypes

### Frontend Development
- Code projects
- Websites you've built
- Interactive tools
- Web applications

---

## 🔄 Workflow Examples

### Adding a Brochure

1. **Export PDF to Images**
   - Open PDF in your design tool
   - Export each page as PNG/JPG
   - Name them: `project-page1.png`, `project-page2.png`, etc.

2. **Go to Admin Panel**
   - Click ➕ Add New Project
   - Fill in project details

3. **Upload Images**
   - Select first page as Cover Image
   - Select **Multi-Image Gallery**
   - Upload all pages in **Gallery Images**

4. **Save & Done**
   - Click 💾 Save Project
   - Appears on portfolio immediately

### Updating a Project

1. Go to 📋 Manage Projects
2. Find the project
3. Click ✏️ Edit
4. Change details/images
5. Click 💾 Save Project
6. Changes appear immediately

### Deleting a Project

1. Go to 📋 Manage Projects
2. Find the project
3. Click 🗑️ Delete
4. Confirm deletion
5. Project removed from portfolio

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Submit Form | `Enter` (in form) |
| Close Modal | `Escape` |
| Navigate Gallery | `← / →` Arrow Keys |
| Close Lightbox | `Escape` |

---

## 🐛 Troubleshooting

### Projects Not Showing
- **Issue:** Added a project but it doesn't appear
- **Solution:** 
  - Refresh your portfolio page (`Ctrl+F5`)
  - Check browser console for errors
  - Verify category matches filter selected

### Images Not Loading
- **Issue:** Uploaded image but preview doesn't show
- **Solution:**
  - File size > 5MB? Compress it first
  - Try different format (JPG instead of PNG)
  - Check file wasn't corrupted during upload

### Can't Access Admin Panel
- **Issue:** PIN not working
- **Solution:**
  - Clear browser cache
  - Try default PIN: `1234`
  - Check for typos (case-sensitive)
  - Try in private/incognito window

### Data Lost
- **Issue:** Projects disappeared
- **Solution:**
  - Check if localStorage was cleared
  - Import from your backup JSON
  - Check in different browser

### Gallery Not Working
- **Issue:** Multi-image gallery doesn't show
- **Solution:**
  - Selected **Multi-Image Gallery** type?
  - Uploaded gallery images?
  - Check image format (JPG/PNG)
  - Reload portfolio page

---

## 💡 Tips & Tricks

### Fast Project Management
- Use keyboard `Tab` to navigate form fields
- Drag multiple images at once
- Copy cover image path for sharing

### Better Organization
- Use consistent naming: `ProjectName-page1.png`
- Use meaningful tags: "Brochure", "Logo", "Website", etc.
- Order projects by importance

### Performance
- Compress images before upload
- Aim for ~200KB per cover image
- ~100KB per gallery image
- Reduces load time

### Gallery Optimization
- Start with cover image that's most impressive
- Maximum 20 images per gallery recommended
- Consistent dimensions across gallery
- Test on mobile before publishing

---

## 🚨 Important Notes

1. **Data Storage**
   - Projects stored in browser's localStorage
   - Clearing browser data = lost projects
   - Always keep backups!

2. **PIN Security**
   - PIN stored in localStorage (not encrypted)
   - Change PIN if browser shared
   - This is NOT for sensitive data

3. **Image Storage**
   - Images converted to base64 (embedded in JSON)
   - Makes export file large (5-10MB per 10 projects)
   - Normal for this approach

4. **Browsers**
   - Each browser has separate storage
   - Projects on Chrome ≠ Projects on Firefox
   - Best to use same browser always

---

## 📞 Support

If something doesn't work:

1. **Check the console:** Press `F12` → Console tab
2. **Verify your PIN:** Default is `1234`
3. **Try incognito/private mode:** Rules out extensions
4. **Export your data:** Backup before troubleshooting
5. **Clear cache:** `Ctrl+Shift+Del` or Settings

---

## 🎉 You're All Set!

Your portfolio editor is ready. Start adding projects, and watch your portfolio grow in real-time!

**Remember:** 
- ✅ Export data regularly
- ✅ Change your PIN
- ✅ Use high-quality images
- ✅ Keep backups safe

Happy editing! 🚀
