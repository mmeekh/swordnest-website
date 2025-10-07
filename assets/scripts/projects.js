
function lazyLoadVideos() {
    const videos = document.querySelectorAll('.project-thumbnail iframe');
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                const src = iframe.dataset.src;
                if (src && !iframe.src) {
                    iframe.src = src;
                }
            }
        });
    });
    
    videos.forEach(video => {
        video.dataset.src = video.src;
        video.src = '';
        videoObserver.observe(video);
    });
}

window.initProjectsPage = function() {
    setTimeout(() => {
        if (typeof window.locomotive === 'function') {
            const locoScroll = window.locomotive();
        }
        initProjectCards();
        // initProjectModal(); // Kaldırıldı
        initStatsCounter();
        initSwordDecoration();
    }, 100);
};

function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        // KARTLARIN EKRANA GELİRKEN ANİMASYONLU BİR ŞEKİLDE GÖRÜNMESİNİ SAĞLAYAN KOD (BU KALSIN)
        gsap.fromTo(card,
            {
                opacity: 0,
                y: 50,
                scale: 0.95,
                rotationY: -180
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                rotationY: 360,
                duration: 1.2,
                delay: index * 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                    scroller: '#main'
                },
                onComplete: () => {
                    // Bu kısım boşaltıldı, çünkü animasyon burada başlıyordu.
                    gsap.set(card, { rotationY: 0 }); 
                }
            }
        );

        // KARTIN ÜZERİNE GELİNCE METRİKLERİN BÜYÜMESİNİ SAĞLAYAN EFEKT (BU KALSIN)
        const metrics = card.querySelectorAll('.metric');
        metrics.forEach(metric => {
            card.addEventListener('mouseenter', () => {
                gsap.to(metric, {
                    scale: 1.05,
                    duration: 0.3,
                    stagger: 0.05
                });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(metric, {
                    scale: 1,
                    duration: 0.3,
                    stagger: 0.05
                });
            });
        });
    });
}

function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.count);
        
        const counter = {
            value: 0
        };
        
        gsap.to(counter, {
            value: target,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: stat,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
                scroller: '#main'
            },
            onUpdate: () => {
                stat.textContent = Math.round(counter.value);
            }
        });
    });
}

function initSwordDecoration() {
    const swordDecoration = document.querySelector('.sword-decoration');
    if (!swordDecoration) return;
    
    gsap.to(swordDecoration, {
        x: '+=20',
        y: '-=10',
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });
    
    gsap.to(swordDecoration, {
        opacity: 0.5,
        boxShadow: '0 0 40px rgba(56, 189, 248, 0.8)',
        scrollTrigger: {
            trigger: '#projects-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            scroller: '#main'
        }
    });
}

const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    let hoverAnimation;
    
    ctaButton.addEventListener('mouseenter', () => {
        hoverAnimation = gsap.to(ctaButton, {
            scale: 1.05,
            boxShadow: '0 15px 40px rgba(249, 115, 22, 0.4)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    ctaButton.addEventListener('mouseleave', () => {
        if (hoverAnimation) hoverAnimation.kill();
        gsap.to(ctaButton, {
            scale: 1,
            boxShadow: '0 10px 30px rgba(249, 115, 22, 0.3)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
}