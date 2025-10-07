class SwordAnimation {
    constructor(options = {}) {
        this.canvas = options.canvas;
        this.context = this.canvas ? this.canvas.getContext('2d') : null;
        this.frameCount = options.frameCount || 40;
        this.basePath = options.basePath || 'images/sword-sequence/';
        this.scrollBehavior = options.scrollBehavior || 'scroll';
        this.scrollTrigger = options.scrollTrigger || null;
        this.autoplay = options.autoplay || false;
        this.size = options.size || 'full';
        
        this.images = [];
        this.imageSeq = { frame: 1 };
        this.rotation = 0;
        this.isLoaded = false;
        this.animationId = null;
        this.loadedCount = 0;
        
        this.preloadedImages = new Map();
        this.loadingQueue = [];
        this.maxConcurrentLoads = 6; // Limit concurrent image loads
        this.currentlyLoading = 0;
    }   
    
    init() {
        if (!this.canvas || !this.context) return;
        
        this.setCanvasSize();
        this.optimizedImageLoad(() => {
            this.isLoaded = true;
            this.setupAnimation();
            this.render();
        });
        
        // Handle resize with Event Manager
        if (window.eventManager) {
            this.resizeListenerId = window.eventManager.addResizeListener(() => {
                this.setCanvasSize();
                this.render();
            }, `sword-resize-${this.canvas.id || 'main'}`);
        } else {
            window.addEventListener('resize', () => {
                this.setCanvasSize();
                this.render();
            });
        }
    }
    
    setCanvasSize() {
        if (this.size === 'small') {
            this.canvas.width = 60;
            this.canvas.height = 60;
        } else if (this.size === 'medium') {
            this.canvas.width = 200;
            this.canvas.height = 200;
        } else {
            // Full size
            if (window.innerWidth > 768) {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            } else {
                this.canvas.width = 60;
                this.canvas.height = 60;
            }
        }
    }
    
    files(index) {
        return `${this.basePath}${String(index).padStart(4, '0')}.png`;
    }
    
    optimizedImageLoad(callback) {
        console.log('🗡️ Starting optimized image loading...');
        
        // Create loading queue with priority (load first and last frames first)
        const priorityFrames = [1, Math.floor(this.frameCount / 2), this.frameCount];
        const regularFrames = [];
        
        for (let i = 0; i < this.frameCount; i++) {
            const frameIndex = 1 + (i * 3); // 0001, 0004, 0007, etc.
            if (!priorityFrames.includes(frameIndex)) {
                regularFrames.push(frameIndex);
            }
        }
        
        this.loadingQueue = [...priorityFrames, ...regularFrames];
        this.images = new Array(this.frameCount); // Pre-allocate array
        
        // Start loading with throttling
        this.processLoadingQueue(callback);
    }
    
    processLoadingQueue(callback) {
        while (this.currentlyLoading < this.maxConcurrentLoads && this.loadingQueue.length > 0) {
            const frameIndex = this.loadingQueue.shift();
            this.loadSingleImage(frameIndex, callback);
        }
        
        // If no more images to load and all are loaded, call callback
        if (this.loadingQueue.length === 0 && this.currentlyLoading === 0 && this.loadedCount === this.frameCount) {
            console.log('🗡️ All sword images loaded successfully!');
            callback();
        }
    }
    
    loadSingleImage(frameIndex, callback) {
        this.currentlyLoading++;
        
        const img = new Image();
        
        img.crossOrigin = 'anonymous';
        img.loading = 'eager'; // Force immediate loading for critical images
        
        img.onload = () => {
            const arrayIndex = Math.floor((frameIndex - 1) / 3);
            this.images[arrayIndex] = img;
            this.loadedCount++;
            this.currentlyLoading--;
            
            console.log(`✅ Loaded frame ${frameIndex} (${this.loadedCount}/${this.frameCount})`);
            
            // If this is one of the first few frames, enable basic animation
            if (this.loadedCount >= 3 && !this.isLoaded) {
                this.isLoaded = true;
                this.setupAnimation();
                this.render();
            }
            
            this.processLoadingQueue(callback);
        };
        
        img.onerror = () => {
            console.error(`❌ Failed to load frame: ${frameIndex}`);
            this.currentlyLoading--;
            this.loadedCount++; // Count as loaded to prevent infinite waiting
            
            this.processLoadingQueue(callback);
        };
        
        const cacheBuster = window.location.hostname === 'localhost' ? `?v=${Date.now()}` : '';
        img.src = this.files(frameIndex) + cacheBuster;
    }
    
    setupAnimation() {
        switch (this.scrollBehavior) {
            case 'scroll':
                this.setupScrollAnimation();
                break;
            case 'rotate':
                this.setupRotateAnimation();
                break;
            case 'follow':
                this.setupFollowAnimation();
                break;
            case 'fixed':
                this.imageSeq.frame = Math.floor(this.frameCount / 2);
                break;
        }
    }
    
    setupScrollAnimation() {
        if (!this.scrollTrigger) return;
        
        gsap.to(this.imageSeq, {
            frame: this.frameCount,
            snap: "frame",
            ease: "none",
            scrollTrigger: {
                scrub: 0.15,
                trigger: this.scrollTrigger.trigger,
                start: this.scrollTrigger.start,
                end: this.scrollTrigger.end,
                scroller: this.scrollTrigger.scroller,
            },
            onUpdate: () => this.render(),
        });
        
        // Pin for desktop only
        if (window.innerWidth > 768) {
            ScrollTrigger.create({
                trigger: this.canvas,
                pin: true,
                scroller: this.scrollTrigger.scroller,
                start: this.scrollTrigger.start,
                end: this.scrollTrigger.end,
            });
        }
    }
    
    setupRotateAnimation() {
        if (this.autoplay) {
            this.animate();
        }
    }
    
    setupFollowAnimation() {
        let mouseX = 0;
        let targetFrame = 1;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            targetFrame = Math.floor((mouseX / window.innerWidth) * this.frameCount) + 1;
            targetFrame = Math.max(1, Math.min(targetFrame, this.frameCount));
        });
        
        const smoothFollow = () => {
            this.imageSeq.frame += (targetFrame - this.imageSeq.frame) * 0.1;
            this.render();
            requestAnimationFrame(smoothFollow);
        };
        
        smoothFollow();
    }
    
    animate() {
        this.rotation += 0.5;
        this.imageSeq.frame = Math.floor((this.rotation % 360) / 360 * this.frameCount) + 1;
        this.render();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    // OPTIMIZED RENDER FUNCTION
    render() {
        if (!this.isLoaded || this.loadedCount === 0) return;
        
        // Clamp frame to available range
        const frameIndex = Math.max(0, Math.min(Math.floor(this.imageSeq.frame - 1), this.images.length - 1));
        const currentImage = this.images[frameIndex];
        
        if (currentImage && currentImage.complete && currentImage.naturalWidth > 0) {
            this.scaleImage(currentImage, this.context);
        } else if (this.loadedCount > 0) {
            // Fallback to first loaded image if current frame isn't ready
            for (let i = 0; i < this.images.length; i++) {
                if (this.images[i] && this.images[i].complete) {
                    this.scaleImage(this.images[i], this.context);
                    break;
                }
            }
        }
    }
    
    scaleImage(img, ctx) {
        const canvas = ctx.canvas;
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        let ratio = Math.max(hRatio, vRatio);
        
        if (window.innerWidth > 768 && this.size === 'full') {
            ratio *= 0.90; // %10 smaller for better fit
        }
        
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            img,
            0, 0,
            img.width, img.height,
            centerShift_x, centerShift_y,
            img.width * ratio,
            img.height * ratio
        );
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Remove Event Manager listeners
        if (window.eventManager && this.resizeListenerId) {
            window.eventManager.removeResizeListener(this.resizeListenerId);
        }
        
        // Clear images from memory
        this.images.forEach(img => {
            if (img) {
                img.src = '';
            }
        });
        this.images = [];
        this.preloadedImages.clear();
        
        // Kill ScrollTrigger instances
        if (this.scrollTrigger) {
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.vars.trigger === this.canvas || 
                    trigger.vars.trigger === this.scrollTrigger.trigger) {
                    trigger.kill();
                }
            });
        }
    }
    
    // Debug method
    getLoadingStatus() {
        return {
            loaded: this.loadedCount,
            total: this.frameCount,
            percentage: Math.round((this.loadedCount / this.frameCount) * 100),
            isReady: this.isLoaded,
            queueRemaining: this.loadingQueue.length,
            currentlyLoading: this.currentlyLoading
        };
    }
}

// Export for use in other scripts
window.SwordAnimation = SwordAnimation;

// Add global debug function
window.debugSwordLoading = function() {
    if (window.swordAnimation) {
        console.log('🗡️ Sword Loading Status:', window.swordAnimation.getLoadingStatus());
    } else {
        console.log('❌ No sword animation instance found');
    }
};