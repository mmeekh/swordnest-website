class Navigation {
    constructor() {
        this.nav = document.getElementById('nav');
        this.mobileToggle = document.querySelector('.nav-mobile-toggle');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        
        this.init();
    }
    
    init() {
        if (this.mobileToggle) {
            if (window.eventManager) {
                window.eventManager.addClickListener(this.mobileToggle, () => this.toggleMobileMenu(), 'mobile-toggle');
            } else {
                this.mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
            }
        }
        
        this.mobileNavLinks.forEach(link => {
            if (window.eventManager) {
                window.eventManager.addClickListener(link, () => this.closeMobileMenu(), 'mobile-nav-link');
            } else {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            }
        });
        
        this.initNavCanvas();
        
        this.setActivePage();
        
        this.initPageTransitions();
        
        // Use Event Manager for resize handling
        if (window.eventManager) {
            window.eventManager.addResizeListener(() => {
                if (window.innerWidth > 768) {
                    this.closeMobileMenu();
                }
            }, 'navigation-resize');
        } else {
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    this.closeMobileMenu();
                }
            });
        }
    }
    
    toggleMobileMenu() {
        this.mobileToggle.classList.toggle('active');
        this.mobileMenu.classList.toggle('active');
        
        if (this.mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    closeMobileMenu() {
        this.mobileToggle.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    setActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            }
        });
        
        this.mobileNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            }
        });
    }
    
    initNavCanvas() {
        const navCanvas = document.getElementById('nav-canvas');
        if (!navCanvas) return;
        
        const navSwordAnim = new SwordAnimation({
            canvas: navCanvas,
            scrollBehavior: 'rotate',
            frameCount: 40,
            basePath: './images/sword-sequence/',
            autoplay: true,
            size: 'small'
        });
        navSwordAnim.init();
    }
    
    initPageTransitions() {
        // Sayfa geçiş efekti iptal edildi - normal link davranışı kullanılıyor
        console.log('🗡️ Page transitions disabled - using normal navigation');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new Navigation();
});