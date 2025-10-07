function loaderEffect() {
    const loader = document.querySelector("#loader");
    const mainContent = document.querySelector("#main");

    window.addEventListener('load', () => {
        if (loader) {
            loader.classList.add('hidden');
        }
        
        if (mainContent) {
            mainContent.classList.add('loaded');
        }
    });
}
loaderEffect();

function locomotive() {
    gsap.registerPlugin(ScrollTrigger);

    const locoScroll = new LocomotiveScroll({
        el: document.querySelector("#main"),
        smooth: true,
    });
    
    locoScroll.on("scroll", ScrollTrigger.update);
    
    ScrollTrigger.scrollerProxy("#main", {
        scrollTop(value) {
            return arguments.length
                ? locoScroll.scrollTo(value, 0, 0)
                : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
            };
        },
        pinType: document.querySelector("#main").style.transform
            ? "transform"
            : "fixed",
    });
    
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();
    
    return locoScroll;
}

window.locomotive = locomotive;

// KILIÇ ANİMASYONU - ESKİ ÇALIŞAN VERSİYONA GÖRE DÜZELTİLDİ
let canvas, nav, page, nestText, context;
let frameCount = 40; // 0001, 0004, 0007, ..., 0118 = 40 frame
let images = [];
let imageSeq = { frame: 1 };

function initSwordAnimation() {
    canvas = document.querySelector("canvas");
    nav = document.querySelector("#nav");
    page = document.querySelector("#page");
    
    if (!canvas || !nav || !page) {
        console.error('❌ Required elements not found for sword animation');
        return;
    }



    context = canvas.getContext("2d");

    function setCanvasSize() {
        if (window.innerWidth > 768) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        } else {
            canvas.width = 60;
            canvas.height = 60;
        }
    }

    setCanvasSize();

    window.addEventListener("resize", function () {
        setCanvasSize();
        render();
    });

    function files(index) {
    return `images/sword-sequence/${String(index).padStart(4, '0')}.webp`;
}

    // Load images
    for (let i = 0; i < frameCount; i++) {
        const frameIndex = 1 + (i * 3);
        const img = new Image();
        img.src = files(frameIndex);
        images.push(img);
    }

    gsap.to(imageSeq, {
        frame: frameCount,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            scrub: 0.15,
            trigger: "#page",
            start: "top top",
            end: "400% top",
            scroller: "#main",
        },
        onUpdate: render,
    });

    if (images.length > 0) {
        images[0].onload = render;
    }

    function render() {
        const currentImage = images[imageSeq.frame - 1];
        if (currentImage) {
            scaleImage(currentImage, context);
        }
    }

    function scaleImage(img, ctx) {
        var canvas = ctx.canvas;
        var hRatio = canvas.width / img.width;
        var vRatio = canvas.height / img.height;
        var ratio = Math.max(hRatio, vRatio);

        if (window.innerWidth > 768) {
            ratio *= 0.85;
        }

        var centerShift_x = (canvas.width - img.width * ratio) / 2;
        var centerShift_y = (canvas.height - img.height * ratio) / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            centerShift_x,
            centerShift_y,
            img.width * ratio,
            img.height * ratio
        );
    }

    ScrollTrigger.create({
        trigger: "#page>canvas",
        pin: true,
        scroller: "#main",
        start: "top top",
        end: "600% top",
    });
    

}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize locomotive scroll
    const locoScroll = locomotive();
    
    // Initialize sword animation
    initSwordAnimation();
    
    // Initialize animations with delay to prioritize image loading
    setTimeout(() => {
        initGSAPAnimations();
    }, 500);
});

function initGSAPAnimations() {
    // Stagger animations to reduce initial load
    gsap.from("#loop h1", {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        delay: 0.5
    });
    
    // Video containers with reduced motion for performance
    gsap.utils.toArray('.video-glow').forEach((video, index) => {
        gsap.fromTo(video, 
            {
                opacity: 0,
                scale: 0.9
            },
            {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: video,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    scroller: '#main',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
    
    // Text animations with performance optimization
    gsap.utils.toArray('#page h3, #page h4').forEach((text, index) => {
        gsap.fromTo(text,
            {
                opacity: 0,
                x: -50
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: text,
                    start: 'top 85%',
                    scroller: '#main',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
    
    // Optimized text animations for other sections
    gsap.utils.toArray('#left-text, #text1, #text2, #text3').forEach((text, index) => {
        const direction = text.id.includes('left') || text.id === 'text1' ? -50 : 50;
        
        gsap.fromTo(text,
            {
                opacity: 0,
                x: direction
            },
            {
                opacity: 1,
                x: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: text,
                    start: 'top 75%',
                    scroller: '#main',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
    
    // SADELEŞTİRİLMİŞ FOOTER ANİMASYONU - Sadece opacity
    const footer = document.querySelector('#footer');
    if (footer) {
        gsap.fromTo(footer,
            { opacity: 0 },
            { opacity: 1, duration: 1, ease: "power2.out" }
        );
    }
}



// Optimized resize handler
window.addEventListener('resize', () => {
        // Refresh ScrollTrigger
        ScrollTrigger.refresh();
        
        // Update canvas size
    setCanvasSize();
    render();
        
        // Ensure footer stays visible
        const footer = document.querySelector('#footer');
        if (footer) {
            gsap.set(footer, { 
                clearProps: "transform",
                opacity: 1 
            });
        }
});

// Error handling with detailed logging
window.addEventListener('error', (e) => {
    console.error('🚨 JavaScript Error:', {
        message: e.error?.message || e.message,
        filename: e.filename,
        line: e.lineno,
        column: e.colno,
        stack: e.error?.stack
    });
});

