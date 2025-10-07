// Contact Page Scripts
document.addEventListener('DOMContentLoaded', () => {
    initContactPage();
    wrapEachCharWithSpan('.hero-content h1');
    wrapEachCharWithSpan('.hero-content p');
});

// Global function for page transitions
window.initContactPage = function() {
    // Wait for DOM to be ready
    setTimeout(() => {
        // Initialize Locomotive Scroll
        if (typeof window.locomotive === 'function') {
            const locoScroll = window.locomotive();
        }
        
        // Initialize contact page components
        initContactSword();
        initContactForm();
        initFAQAccordion();
        // initMap();
        initContactParticles();
    }, 100);
};
function getRandomBrightColor() {
        const brightColors = [
            '#00FFFF', // Cyan - parlak
            '#00FF88', // Bright Green - Sword Nest yeşili parlak
            '#88FF00', // Lime
            '#FFFF00', // Yellow
            '#FF8800', // Orange - parlak
            '#FF4400', // Red-Orange
            '#FF0088', // Pink
            '#8800FF', // Purple
            '#0088FF', // Bright Blue
            '#FFFFFF', // White
            '#00FF44', // Neon Green
            '#44FFFF', // Light Cyan
            '#FFAA00', // Gold
            '#FF6600'  // Bright Orange
        ];
        return brightColors[Math.floor(Math.random() * brightColors.length)];
    }
function initContactSword() {
    const canvas = document.getElementById('contact-sword');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let particles = [];
    
    // Mouse tracking
    canvas.parentElement.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        
        // Create multiple particles at mouse position for denser trail
        for (let i = 0; i < 3; i++) {
            particles.push({
                // Yayılım çok düşük seviyede
                x: mouseX + (Math.random() - 0.5) * 1,
                y: mouseY + (Math.random() - 0.5) * 1,
                size: Math.random() * 3 + 1,
                life: 1,
                color: getRandomBrightColor(),
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                glowIntensity: Math.random() * 0.5 + 0.5,
                hue: Math.random() * 360
            });
        }
        
        // Keep particle count under control
        if (particles.length > 150) {
            particles.shift();
        }
    });
    
    function animate() {
        // Trail efektini eski haline döndür
        ctx.fillStyle = 'rgba(26, 32, 44, 0.02)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            
            // Update particle
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.008;
            particle.size *= 0.996;
            particle.hue = (particle.hue + 1) % 360;
            
            // Remove dead particles
            if (particle.life <= 0 || particle.size < 0.5) {
                particles.splice(i, 1);
                continue;
            }
            
            const dynamicColor = `hsl(${particle.hue}, 100%, 70%)`;
            
            // Multiple glow layers...
            ctx.save();
            ctx.shadowBlur = 40; 
            ctx.shadowColor = dynamicColor;
            ctx.globalAlpha = particle.life * 0.15;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = dynamicColor;
            ctx.fill();
            ctx.restore();
            
            ctx.save();
            ctx.shadowBlur = 25;
            ctx.shadowColor = particle.color;
            ctx.globalAlpha = particle.life * 0.4;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            ctx.restore();
            
            ctx.save();
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#FFFFFF';
            ctx.globalAlpha = particle.life * 0.9;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.restore();
            
            ctx.save();
            ctx.shadowBlur = 20;
            ctx.shadowColor = particle.color;
            ctx.globalAlpha = particle.life;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            ctx.restore();
            
            if (Math.random() < 0.1) {
                ctx.save();
                ctx.shadowBlur = 30;
                ctx.shadowColor = '#FFFFFF';
                ctx.globalAlpha = particle.life * 0.8;
                ctx.beginPath();
                ctx.arc(
                    particle.x + (Math.random() - 0.5) * 20, 
                    particle.y + (Math.random() - 0.5) * 20, 
                    2, 0, Math.PI * 2
                );
                ctx.fillStyle = '#FFFFFF';
                ctx.fill(); 
                ctx.restore();
            }
        }
        
        setDynamicHeroTextColor();
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    });
}

// Dinamik zıt renk fonksiyonu
function invertColor(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    // Parse r, g, b
    let r = parseInt(hex.substring(0,2), 16);
    let g = parseInt(hex.substring(2,4), 16);
    let b = parseInt(hex.substring(4,6), 16);
    // Invert each channel
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;
    // Return as hex
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

function wrapEachCharWithSpan(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    const html = el.textContent.split('').map((char, i) => {
        // Her harf ve nokta için ayrı span
        const cls = (char === ' ' ? 'space' : 'char');
        return `<span class="${cls}" data-idx="${i}">${char === ' ' ? '&nbsp;' : char}</span>`;
    }).join('');
    el.innerHTML = html;
}

function setDynamicHeroTextColor() {
    const canvas = document.getElementById('contact-sword');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    let data = ctx.getImageData(w/2, h/2, 1, 1).data;
    let hex = `#${data[0].toString(16).padStart(2,'0')}${data[1].toString(16).padStart(2,'0')}${data[2].toString(16).padStart(2,'0')}`;
    let inverted = invertColor(hex);
    // Her harf için hafif random sapmalı renk
    const h1Spans = document.querySelectorAll('.hero-content h1 .char');
    const pSpans = document.querySelectorAll('.hero-content p .char');
    [...h1Spans, ...pSpans].forEach((span, i) => {
        // Renk sapması: hue shift
        let color = inverted;
        try {
            let rgb = parseInt(color.slice(1), 16);
            let r = (rgb >> 16) & 0xff, g = (rgb >> 8) & 0xff, b = rgb & 0xff;
            // HSV'ye çevir, hue'u kaydır, tekrar rgb'ye çevir
            let h = (Math.atan2(Math.sqrt(3)*(g-b), 2*r-g-b) * 180/Math.PI + 360) % 360;
            h = (h + (i*13)%360) % 360;
            let s = 0.8, v = 0.95;
            let c = v * s, x = c * (1 - Math.abs((h/60)%2-1)), m = v-c;
            let r1=0,g1=0,b1=0;
            if (h<60) {r1=c;g1=x;} else if(h<120){r1=x;g1=c;} else if(h<180){g1=c;b1=x;} else if(h<240){g1=x;b1=c;} else if(h<300){r1=x;b1=c;} else{r1=c;}
            r = Math.round((r1+m)*255); g = Math.round((g1+m)*255); b = Math.round((b1+m)*255);
            color = `rgb(${r},${g},${b})`;
        } catch(e) {}
        span.style.color = color;
    });
}

// Contact Form Handling
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitButton = form.querySelector('.submit-button');
    const successModal = document.getElementById('success-modal');
    const modalCloseBtn = successModal.querySelector('.modal-close-btn');
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Add loading state
        submitButton.classList.add('loading');
        
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate API call (replace with actual API endpoint)
        try {
            await simulateAPICall(data);
            
            // Show success modal
            showSuccessModal();
            
            // Reset form
            form.reset();
            
            // Reset form lines
            const formLines = form.querySelectorAll('.form-line');
            formLines.forEach(line => {
                gsap.set(line, { width: 0 });
            });
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            submitButton.classList.remove('loading');
        }
    });
    
    // Form field animations
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        const line = group.querySelector('.form-line');
        
        if (input && line) {
            input.addEventListener('focus', () => {
                gsap.to(line, {
                    width: '100%',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    gsap.to(line, {
                        width: 0,
                        duration: 0.3,
                        ease: 'power2.in'
                    });
                }
            });
        }
    });
    
    // Modal close
    modalCloseBtn.addEventListener('click', () => {
        hideSuccessModal();
    });
    
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            hideSuccessModal();
        }
    });
}

// Simulate API call
async function simulateAPICall(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form data submitted:', data);
            resolve();
        }, 2000);
    });
}

// Show success modal
function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.add('active');
    
    gsap.fromTo('.success-content',
        {
            scale: 0.8,
            opacity: 0
        },
        {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: 'back.out(1.7)'
        }
    );
    
    // Animate success icon
    gsap.fromTo('.success-icon',
        {
            scale: 0,
            rotation: -180
        },
        {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            delay: 0.2,
            ease: 'back.out(1.7)'
        }
    );
}

// Hide success modal
function hideSuccessModal() {
    const modal = document.getElementById('success-modal');
    
    gsap.to('.success-content', {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
            modal.classList.remove('active');
        }
    });
}

// FAQ Accordion
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                const ans = faq.querySelector('.faq-answer');
                gsap.to(ans, {
                    maxHeight: 0,
                    duration: 0.3,
                    ease: 'power2.inOut'
                });
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                
                // Calculate actual height
                answer.style.maxHeight = 'none';
                const height = answer.offsetHeight;
                answer.style.maxHeight = '0';
                
                gsap.to(answer, {
                    maxHeight: height,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });
    });
}



// Contact Particles Effect
function initContactParticles() {
    const particlesContainer = document.querySelector('.hero-particles');
    if (!particlesContainer) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'contact-particle';
        
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${Math.random() > 0.5 ? '#38BDF8' : '#F97316'};
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            opacity: 0.6;
            filter: blur(0.5px);
            animation: contactFloat ${duration}s ${delay}s infinite ease-in-out;
        `;
        
        particlesContainer.appendChild(particle);
    }
    
    // Add animation styles
    if (!document.querySelector('#contact-particle-styles')) {
        const style = document.createElement('style');
        style.id = 'contact-particle-styles';
        style.textContent = `
            @keyframes contactFloat {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                    opacity: 0.6;
                }
                33% {
                    transform: translate(30px, -30px) scale(1.2);
                    opacity: 0.8;
                }
                66% {
                    transform: translate(-20px, 20px) scale(0.8);
                    opacity: 0.4;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Quick contact button animations
const quickContactBtns = document.querySelectorAll('.quick-contact-btn');
quickContactBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Animate response time on scroll
const responseTime = document.querySelector('.response-time');
if (responseTime) {
    gsap.fromTo(responseTime,
        {
            scale: 0.9,
            opacity: 0
        },
        {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            scrollTrigger: {
                trigger: responseTime,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
                scroller: '#main'
            }
        }
    );
}