document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('show');
    });
    
    // Close mobile menu when clicking on a link
    const mobileMenuItems = mobileMenu.querySelectorAll('.mobile-menu-item');
    mobileMenuItems.forEach(item => {
      item.addEventListener('click', function() {
        mobileMenu.classList.remove('show');
      });
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Initialize intersection observer for animations
  const animateOnScroll = function() {
    const sections = ['hero', 'features'];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, {
      threshold: 0.1
    });
    
    // Observe all feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
      observer.observe(card);
    });
    
    // Observe sections
    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) {
        observer.observe(section);
      }
    });
  };
  
  // Hero animation on page load
  const animateHeroOnLoad = function() {
    setTimeout(() => {
      const heroElements = document.querySelectorAll('.hero-content > *');
      heroElements.forEach((el, index) => {
        setTimeout(() => {
          el.classList.add('animated');
        }, index * 200);
      });
      
      const heroImage = document.querySelector('.hero-image');
      if (heroImage) {
        heroImage.classList.add('animated');
      }
    }, 300);
  };
  
  // Initialize animations
  animateOnScroll();
  animateHeroOnLoad();
});
