/**
 * Portfolio Migration Script
 * Converts hardcoded portfolio projects into admin panel format
 * Run this ONCE to migrate existing projects to admin system
 */

function migratePortfolioProjects() {
  console.log('🔄 Starting portfolio migration...');
  
  // All existing hardcoded projects from index.html
  const projectsToMigrate = [
    {
      id: 1001,
      title: "Brand mockup for 9Stack Limited",
      description: "Multi-page brochure with interactive gallery",
      category: "Graphic Design",
      tags: ["Mockup", "Multi-page"],
      projectType: "multi",
      coverImage: "assets/graphic_design/9stack_mockup/4.png",
      images: [
        "assets/graphic_design/9stack_mockup/1.png",
        "assets/graphic_design/9stack_mockup/2.png",
        "assets/graphic_design/9stack_mockup/3.png"
      ]
    },
    {
      id: 1002,
      title: "Brochure Design for 9Stack Limited",
      description: "Multi-page brochure with interactive gallery",
      category: "Graphic Design",
      tags: ["Brochure", "Multi-page"],
      projectType: "multi",
      coverImage: "assets/graphic_design/9stack brochure/1.png",
      images: [
        "assets/graphic_design/9stack brochure/2.png",
        "assets/graphic_design/9stack brochure/3.png",
        "assets/graphic_design/9stack brochure/4.png",
        "assets/graphic_design/9stack brochure/5.png",
        "assets/graphic_design/9stack brochure/6.png",
        "assets/graphic_design/9stack brochure/7.png",
        "assets/graphic_design/9stack brochure/8.png",
        "assets/graphic_design/9stack brochure/9.png",
        "assets/graphic_design/9stack brochure/10.png",
        "assets/graphic_design/9stack brochure/11.png"
      ]
    },
    {
      id: 1003,
      title: "Numie Projects Ltd. design",
      description: "Design for architectural agency",
      category: "Graphic Design",
      tags: ["Graphic Design", "Welcome"],
      projectType: "single",
      coverImage: "assets/graphic_design/Numie_0.5.jpg",
      images: []
    },
    {
      id: 1004,
      title: "New year celebration",
      description: "Celebration flyer for 2026",
      category: "Graphic Design",
      tags: ["Graphic Design", "Welcome"],
      projectType: "single",
      coverImage: "assets/graphic_design/2026_design_with texture@2x.jpg",
      images: []
    },
    {
      id: 1005,
      title: "Logo Design",
      description: "Logo design for DMACHINE Visuals",
      category: "Graphic Design",
      tags: ["Logo Design", "Welcome"],
      projectType: "single",
      coverImage: "assets/graphic_design/David's logo_mockup_small.png",
      images: []
    },
    {
      id: 1006,
      title: "Youth celebration program",
      description: "Multi-paged interactive gallery",
      category: "Graphic Design",
      tags: ["Graphic", "Multi-page"],
      projectType: "multi",
      coverImage: "assets/graphic_design/Berachah2025/1.png",
      images: [
        "assets/graphic_design/Berachah2025/2.png",
        "assets/graphic_design/Berachah2025/3.png",
        "assets/graphic_design/Berachah2025/4.png",
        "assets/graphic_design/Berachah2025/5.png"
      ]
    },
    {
      id: 1007,
      title: "Traditional celebration",
      description: "Celebration flyer for a traditional conferment",
      category: "Graphic Design",
      tags: ["Church Design", "Welcome"],
      projectType: "single",
      coverImage: "assets/graphic_design/Unc_Chambers_collage.jpeg",
      images: []
    },
    {
      id: 1008,
      title: "Team introduction",
      description: "Meet-our-team design for EduConnect",
      category: "Graphic Design",
      tags: ["Church Design", "Welcome"],
      projectType: "single",
      coverImage: "assets/graphic_design/EduConnect.jpeg",
      images: []
    },
    {
      id: 1009,
      title: "Design for a retail business",
      description: "Multi-paged interactive gallery",
      category: "Graphic Design",
      tags: ["Graphic", "Multi-page"],
      projectType: "multi",
      coverImage: "assets/graphic_design/fish_farm/1.png",
      images: [
        "assets/graphic_design/fish_farm/2.png",
        "assets/graphic_design/fish_farm/3.png"
      ]
    },
    {
      id: 1010,
      title: "Product design",
      description: "Shoe on an elevated platform",
      category: "Graphic Design",
      tags: ["Church Design", "Welcome"],
      projectType: "single",
      coverImage: "assets/graphic_design/platform_1.jpeg",
      images: []
    },
    {
      id: 1011,
      title: "New Month celebration",
      description: "Celebration flyer for new month",
      category: "Graphic Design",
      tags: ["Church Design", "Welcome"],
      projectType: "single",
      coverImage: "assets/graphic_design/dynasty_december.jpeg",
      images: []
    },
    {
      id: 1012,
      title: "Pitch deck for 9Stack Limited",
      description: "Multi-paged interactive gallery",
      category: "Graphic Design",
      tags: ["Pitch deck", "Multi-page"],
      projectType: "multi",
      coverImage: "assets/graphic_design/9stack_pitch_deck/1.png",
      images: [
        "assets/graphic_design/9stack_pitch_deck/2.png",
        "assets/graphic_design/9stack_pitch_deck/3.png",
        "assets/graphic_design/9stack_pitch_deck/4.png",
        "assets/graphic_design/9stack_pitch_deck/5.png",
        "assets/graphic_design/9stack_pitch_deck/6.png",
        "assets/graphic_design/9stack_pitch_deck/7.png",
        "assets/graphic_design/9stack_pitch_deck/8.png",
        "assets/graphic_design/9stack_pitch_deck/9.png",
        "assets/graphic_design/9stack_pitch_deck/10.png",
        "assets/graphic_design/9stack_pitch_deck/11.png",
        "assets/graphic_design/9stack_pitch_deck/12.png",
        "assets/graphic_design/9stack_pitch_deck/13.png"
      ]
    },
    {
      id: 1013,
      title: "Independence celebration",
      description: "Design for Nigeria's 65th year of independence",
      category: "Graphic Design",
      tags: ["Graphic design"],
      projectType: "single",
      coverImage: "assets/graphic_design/Nigeria@65_compressed.jpg",
      images: []
    },
    {
      id: 1014,
      title: "Personal design",
      description: "Personal advertisment flyer",
      category: "Graphic Design",
      tags: ["Graphic design"],
      projectType: "single",
      coverImage: "assets/graphic_design/my_advert@1.25x.jpg",
      images: []
    },
    {
      id: 1015,
      title: "WU Thumbnail",
      description: "WU UI/UX course thumbnail",
      category: "Graphic Design",
      tags: ["Graphic design"],
      projectType: "single",
      coverImage: "assets/graphic_design/Module 2.jpg",
      images: []
    },
    {
      id: 1016,
      title: "Advertisment flyer",
      description: "Advertisment flyer for Kano tech meetup",
      category: "Graphic Design",
      tags: ["Church Design", "Welcome"],
      projectType: "single",
      coverImage: "assets/graphic_design/kano-tech-conference_Mr. Lucky WU.png",
      images: []
    },
    {
      id: 1017,
      title: "Followers celebration",
      description: "Celebration flyer for WU social media followers",
      category: "Graphic Design",
      tags: ["Church Design", "Welcome"],
      projectType: "single",
      coverImage: "assets/graphic_design/WU_2k followers-LinkedIn.png",
      images: []
    },
    {
      id: 1018,
      title: "Anticipation flyer",
      description: "Anticipation flyer for Wale University",
      category: "Graphic Design",
      tags: ["Church Design", "Welcome"],
      projectType: "single",
      coverImage: "assets/graphic_design/WU_RUI1-anticipation.png",
      images: []
    },
    {
      id: 1019,
      title: "CSY Thumbnail Design",
      description: "Thumbnail design for CSY audio tape",
      category: "Graphic Design",
      tags: ["Graphic Design", "Thumbnail"],
      projectType: "single",
      coverImage: "assets/graphic_design/CSY_thumbnail1.1.png",
      images: []
    },
    {
      id: 1020,
      title: "Restaurant social media graphic",
      description: "Design for Side Dish social media handles",
      category: "Graphic Design",
      tags: ["Graphic Design", "Event"],
      projectType: "single",
      coverImage: "assets/graphic_design/khadijah's work - side dish 1.3.png",
      images: []
    },
    {
      id: 1021,
      title: "WU Testimonial design",
      description: "Testimonial layout for Wale University",
      category: "Graphic Design",
      tags: ["Corporate", "Testimonial"],
      projectType: "single",
      coverImage: "assets/graphic_design/testimonial-redone_WU1.2.png",
      images: []
    },
    {
      id: 1022,
      title: "Mentorship flyer",
      description: "Call for Mentorship graphic",
      category: "Graphic Design",
      tags: ["Event", "Poster"],
      projectType: "single",
      coverImage: "assets/graphic_design/WU_mentor flyer-redone1.1.png",
      images: []
    },
    {
      id: 1023,
      title: "Wale University graphic",
      description: "Poster design for Wale University",
      category: "Graphic Design",
      tags: ["Corporate", "Article"],
      projectType: "single",
      coverImage: "assets/graphic_design/WU_Article-Violet.png",
      images: []
    },
    {
      id: 1024,
      title: "Wale University report graphic",
      description: "Corporate report design for Wale University",
      category: "Graphic Design",
      tags: ["Corporate", "Report"],
      projectType: "single",
      coverImage: "assets/graphic_design/WU_Report4.png",
      images: []
    },
    {
      id: 1025,
      title: "Modern UI/UX Design for an ecommerce website",
      description: "Modern ecommerce UI/UX design",
      category: "UI/UX Design",
      tags: ["UI/UX", "Design System"],
      projectType: "single",
      coverImage: "assets/ui-ux/Surface Pro 8 - 1.png",
      images: []
    },
    {
      id: 1026,
      title: "Modern Logo Design",
      description: "Brand identity design with modern aesthetics",
      category: "UI/UX Design",
      tags: ["UI/UX", "Branding"],
      projectType: "single",
      coverImage: "assets/ui-ux/logo_new.png",
      images: []
    },
    {
      id: 1027,
      title: "WALE University graphic",
      description: "Design for WALE University's social media handles",
      category: "Graphic Design",
      tags: ["Graphic Design", "Event"],
      projectType: "single",
      coverImage: "assets/graphic_design/WALE_wk1.1.jpg",
      images: []
    },
    {
      id: 1028,
      title: "Report thumbnail Design",
      description: "Thumbnail design for a Wale University Report",
      category: "Graphic Design",
      tags: ["Branding", "Product Design"],
      projectType: "single",
      coverImage: "assets/graphic_design/WU_Report2.png",
      images: []
    },
    {
      id: 1029,
      title: "Report thumbnail Design",
      description: "Thumbnail design for a Wale University Report",
      category: "Graphic Design",
      tags: ["Campaign", "Health"],
      projectType: "single",
      coverImage: "assets/graphic_design/WU_Report1_redone.png",
      images: []
    },
    {
      id: 1030,
      title: "NUTMDL Logo Design",
      description: "Logo design for a sports competition",
      category: "Graphic Design",
      tags: ["Graphic Design", "Logo", "Branding"],
      projectType: "single",
      coverImage: "assets/graphic_design/NUTML_logo.png",
      images: []
    }
  ];

  // Check if projects already exist
  const existing = localStorage.getItem('portfolio_projects');
  if (existing) {
    try {
      const existingProjects = JSON.parse(existing);
      if (existingProjects.length >= 30) {
        console.log('✅ Projects already migrated. Skipping.');
        return true;
      }
    } catch (err) {
      console.warn('⚠️ Existing data corrupted, re-migrating...', err);
    }
  }

  // Convert images to a format that works with the admin panel
  // For hardcoded projects, we'll store them with file paths
  // (The admin panel can load them, and they'll display via portfolio-sync.js)
  const projectsToStore = projectsToMigrate.map(project => ({
    ...project,
    galleryType: project.projectType, // For backward compatibility
    galleryImages: project.images // For backward compatibility
  }));

  // Save to localStorage
  try {
    localStorage.setItem('portfolio_projects', JSON.stringify(projectsToStore));
    console.log(`✅ Successfully migrated ${projectsToStore.length} projects!`);
    console.log('📊 Projects:', projectsToStore.length);
    return true;
  } catch (err) {
    console.error('❌ Migration failed:', err);
    return false;
  }
}

// Auto-run migration immediately (no waiting)
(function() {
  console.log('🚀 Portfolio Migration Script Loaded');
  
  const migrationRun = localStorage.getItem('portfolio_migration_complete');
  const existingProjects = localStorage.getItem('portfolio_projects');
  
  // Only skip if we have both the flag AND actual project data
  if (migrationRun === 'true' && existingProjects) {
    const projects = JSON.parse(existingProjects);
    if (projects.length >= 30) {
      console.log(`✅ Migration already complete. ${projects.length} projects loaded.`);
      return;
    }
  }
  
  // Run migration
  console.log('⏳ Starting automatic migration...');
  try {
    const success = migratePortfolioProjects();
    if (success) {
      localStorage.setItem('portfolio_migration_complete', 'true');
      console.log('🎉 Migration complete! Your projects are now in the admin panel.');
      console.log('📊 Refresh admin.html to see all projects.');
    } else {
      console.error('❌ Migration failed. Check console for errors.');
    }
  } catch (error) {
    console.error('❌ Migration error:', error);
  }
})();
