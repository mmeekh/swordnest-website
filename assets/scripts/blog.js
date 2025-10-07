// Blog Page Scripts - Sword Nest AI Blog
document.addEventListener('DOMContentLoaded', () => {
    initBlogPage();
});

// Global function for page transitions
window.initBlogPage = function() {
    // Wait for DOM to be ready
    setTimeout(() => {
        // Initialize Locomotive Scroll
        if (typeof window.locomotive === 'function') {
            const locoScroll = window.locomotive();
        }
        
        // Initialize blog page components
        initBlogAnimations();
        initScrollAnimations();
        initNewsletterForm();
        initCategoryFiltering();
        initReadingProgress();
        initBlogSearch();
    }, 100);
};

// Blog Animations
function initBlogAnimations() {
    // Check if hero elements exist
    const heroTitle = document.querySelector('#blog-hero h1');
    const heroParagraph = document.querySelector('#blog-hero p');
    
    if (heroTitle) {
        gsap.fromTo('#blog-hero h1', 
            {
                opacity: 0,
                y: 50,
                scale: 0.9
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                ease: 'power2.out'
            }
        );
    }
    
    if (heroParagraph) {
        gsap.fromTo('#blog-hero p', 
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                delay: 0.3,
                ease: 'power2.out'
            }
        );
    }
}

// Scroll Animations
function initScrollAnimations() {
    // Animate blog posts on scroll
    const blogPosts = document.querySelectorAll('.blog-post');
    
    if (blogPosts.length === 0) {
        console.log('No blog posts found for animations');
        return;
    }
    
    blogPosts.forEach((post, index) => {
        gsap.fromTo(post,
            {
                opacity: 0,
                y: 50,
                scale: 0.95
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                delay: index * 0.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: post,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                    scroller: '#main'
                }
            }
        );
        
        // Hover effects
        post.addEventListener('mouseenter', () => {
            gsap.to(post, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        post.addEventListener('mouseleave', () => {
            gsap.to(post, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    const emailInput = document.querySelector('.newsletter-form input[type="email"]');
    const submitButton = document.querySelector('.newsletter-form button');
    
    if (!newsletterForm || !emailInput || !submitButton) {
        console.log('Newsletter form elements not found');
        return;
    }
    
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email || !isValidEmail(email)) {
            showNotification('Lütfen geçerli bir e-posta adresi girin', 'error');
            return;
        }
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
        
        try {
            await simulateNewsletterSubscription(email);
            showNotification('Bültenimize başarıyla abone oldunuz! 🎉', 'success');
            emailInput.value = '';
        } catch (error) {
            showNotification('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Abone Ol';
        }
    });
}

async function simulateNewsletterSubscription(email) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true };
}

function initCategoryFiltering() {
    const categoryLinks = document.querySelectorAll('.category-list a');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    // Check if category elements exist
    if (categoryLinks.length === 0) {
        console.log('Category links not found, skipping category filtering');
        return;
    }
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const category = link.getAttribute('href').replace('#', '');
            
            // Update active state
            categoryLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Filter posts with enhanced animation
            blogPosts.forEach((post, index) => {
                const postCategory = post.dataset.category;
                
                if (category === 'all' || postCategory === category) {
                    gsap.to(post, {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 0.4,
                        delay: index * 0.1,
                        ease: 'power2.out'
                    });
                } else {
                    gsap.to(post, {
                        opacity: 0.2,
                        scale: 0.9,
                        y: 20,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
            
            // Show notification
            const categoryName = link.textContent;
            showNotification(`${categoryName} kategorisi filtrelendi`, 'success');
        });
    });
}

// Reading Progress Bar
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00FF88, #00D4FF);
        z-index: 10000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Share post function
function sharePost(post, platform) {
    const title = post.querySelector('h2, h3')?.textContent || 'Sword Nest AI Blog';
    const url = window.location.href;
    
    let shareUrl = '';
    
    switch (platform) {
        case 'Twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
            break;
        case 'LinkedIn':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
        case 'Facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'Kopyala':
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Link kopyalandı! 📋', 'success');
            });
            return;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
        showNotification('Paylaşım penceresi açıldı', 'success');
    }
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00FF88, #00D4FF)' : 'linear-gradient(135deg, #FF6B35, #FF4757)'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10001;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
}

function updateReadingTimes() {
    const blogPosts = document.querySelectorAll('.blog-post');
    
    blogPosts.forEach(post => {
        const content = post.querySelector('.post-content');
        const readTimeElement = post.querySelector('.read-time');
        
        if (content && readTimeElement) {
            const readingTime = calculateReadingTime(content.textContent);
            readTimeElement.textContent = `${readingTime} dk okuma`;
        }
    });
}

// Enhanced interactions
function initEnhancedInteractions() {
    // Add hover effects to CTA button
    const ctaButton = document.querySelector('#blog-cta .cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('mouseenter', () => {
            gsap.to(ctaButton, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        ctaButton.addEventListener('mouseleave', () => {
            gsap.to(ctaButton, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    }
    
    // Add scroll-triggered animations for CTA section
    const ctaSection = document.querySelector('#blog-cta');
    if (ctaSection) {
        gsap.fromTo(ctaSection,
            {
                opacity: 0,
                y: 50
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: ctaSection,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }
}

function initBlogSearch() {
    const searchInput = document.getElementById('blog-search');
    const searchButton = document.querySelector('.search-button');
    const searchResults = document.getElementById('search-results');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    // Check if search elements exist before proceeding
    if (!searchInput || !searchButton || !searchResults) {
        console.log('Search elements not found, skipping search initialization');
        return;
    }
    
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (!query) {
            // Show all posts if search is empty
            blogPosts.forEach(post => {
                gsap.to(post, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            searchResults.textContent = '';
            return;
        }
        
        let foundCount = 0;
        
        blogPosts.forEach(post => {
            const title = post.querySelector('h2, h3')?.textContent.toLowerCase() || '';
            const content = post.querySelector('.post-content')?.textContent.toLowerCase() || '';
            const excerpt = post.querySelector('.post-excerpt')?.textContent.toLowerCase() || '';
            
            const isMatch = title.includes(query) || content.includes(query) || excerpt.includes(query);
            
            if (isMatch) {
                foundCount++;
                gsap.to(post, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                
                // Highlight matching text
                highlightText(post, query);
            } else {
                gsap.to(post, {
                    opacity: 0.3,
                    scale: 0.95,
                    y: 20,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
        
        // Show results count
        if (foundCount > 0) {
            searchResults.textContent = `${foundCount} sonuç bulundu`;
            showNotification(`${foundCount} blog yazısı bulundu`, 'success');
        } else {
            searchResults.textContent = 'Sonuç bulunamadı';
            showNotification('Arama kriterlerinize uygun yazı bulunamadı', 'error');
        }
    }
    
    function highlightText(element, query) {
        const title = element.querySelector('h2, h3');
        if (title && title.textContent.toLowerCase().includes(query)) {
            const originalText = title.textContent;
            const regex = new RegExp(`(${query})`, 'gi');
            title.innerHTML = originalText.replace(regex, '<mark style="background: rgba(0, 255, 136, 0.3); color: #00FF88; padding: 2px 4px; border-radius: 3px;">$1</mark>');
        }
    }
    
    // Search on input
    searchInput.addEventListener('input', debounce(performSearch, 300));
    
    // Search on button click
    searchButton.addEventListener('click', performSearch);
    
    // Search on Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize enhanced interactions
setTimeout(initEnhancedInteractions, 1000); 