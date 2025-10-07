/**
 * Event Manager - Merkezi Event Yönetimi
 * Tüm event listener'ları tek bir yerden yönetir ve çakışmaları önler
 */
class EventManager {
    constructor() {
        this.listeners = new Map();
        this.resizeCallbacks = [];
        this.scrollCallbacks = [];
        this.clickCallbacks = new Map();
        this.isInitialized = false;
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        // Throttled resize listener
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 100);
        });
        
        // Throttled scroll listener
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
            }, 16); // ~60fps
        });
        
        this.isInitialized = true;
        console.log('🎯 Event Manager initialized');
    }
    
    // Resize event yönetimi
    addResizeListener(callback, id = null) {
        const listenerId = id || `resize_${Date.now()}_${Math.random()}`;
        this.resizeCallbacks.push({ id: listenerId, callback });
        console.log(`📏 Resize listener added: ${listenerId}`);
        return listenerId;
    }
    
    removeResizeListener(id) {
        const index = this.resizeCallbacks.findIndex(item => item.id === id);
        if (index > -1) {
            this.resizeCallbacks.splice(index, 1);
            console.log(`📏 Resize listener removed: ${id}`);
        }
    }
    
    handleResize() {
        this.resizeCallbacks.forEach(({ callback, id }) => {
            try {
                callback();
            } catch (error) {
                console.error(`❌ Resize callback error (${id}):`, error);
            }
        });
    }
    
    // Scroll event yönetimi
    addScrollListener(callback, id = null) {
        const listenerId = id || `scroll_${Date.now()}_${Math.random()}`;
        this.scrollCallbacks.push({ id: listenerId, callback });
        console.log(`📜 Scroll listener added: ${listenerId}`);
        return listenerId;
    }
    
    removeScrollListener(id) {
        const index = this.scrollCallbacks.findIndex(item => item.id === id);
        if (index > -1) {
            this.scrollCallbacks.splice(index, 1);
            console.log(`📜 Scroll listener removed: ${id}`);
        }
    }
    
    handleScroll() {
        this.scrollCallbacks.forEach(({ callback, id }) => {
            try {
                callback();
            } catch (error) {
                console.error(`❌ Scroll callback error (${id}):`, error);
            }
        });
    }
    
    // Click event yönetimi
    addClickListener(element, callback, id = null) {
        const listenerId = id || `click_${Date.now()}_${Math.random()}`;
        
        if (!this.clickCallbacks.has(element)) {
            this.clickCallbacks.set(element, []);
        }
        
        this.clickCallbacks.get(element).push({ id: listenerId, callback });
        element.addEventListener('click', callback);
        
        console.log(`🖱️ Click listener added: ${listenerId}`);
        return listenerId;
    }
    
    removeClickListener(element, id) {
        const callbacks = this.clickCallbacks.get(element);
        if (callbacks) {
            const index = callbacks.findIndex(item => item.id === id);
            if (index > -1) {
                const { callback } = callbacks[index];
                element.removeEventListener('click', callback);
                callbacks.splice(index, 1);
                console.log(`🖱️ Click listener removed: ${id}`);
            }
        }
    }
    
    // Genel cleanup
    cleanup() {
        this.resizeCallbacks = [];
        this.scrollCallbacks = [];
        this.clickCallbacks.clear();
        console.log('🧹 Event Manager cleaned up');
    }
    
    // Debug fonksiyonları
    getStats() {
        return {
            resizeListeners: this.resizeCallbacks.length,
            scrollListeners: this.scrollCallbacks.length,
            clickListeners: Array.from(this.clickCallbacks.values()).reduce((sum, callbacks) => sum + callbacks.length, 0)
        };
    }
    
    debug() {
        console.log('🎯 Event Manager Stats:', this.getStats());
        console.log('📏 Resize listeners:', this.resizeCallbacks.map(item => item.id));
        console.log('📜 Scroll listeners:', this.scrollCallbacks.map(item => item.id));
        console.log('🖱️ Click listeners:', Array.from(this.clickCallbacks.entries()).map(([element, callbacks]) => ({
            element: element.tagName,
            callbacks: callbacks.map(item => item.id)
        })));
    }
}

// Global instance
window.eventManager = new EventManager();

// Debug fonksiyonu
window.debugEvents = () => {
    if (window.eventManager) {
        window.eventManager.debug();
    } else {
        console.log('❌ Event Manager not found');
    }
}; 