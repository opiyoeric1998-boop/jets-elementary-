// Testimonials Slider Class
class TestimonialsSlider {
    constructor() {
        this.currentIndex = 0;
        this.slides = document.querySelectorAll('.testimonial-item');
        this.dots = document.querySelectorAll('.dot');
        this.track = document.querySelector('.testimonials-track');
        this.autoSlideInterval = null;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        if (this.slides.length === 0) {
            console.warn('No testimonial slides found');
            return;
        }
        
        console.log(`Slider initialized with ${this.slides.length} slides`);
        this.startAutoSlide();
        this.addEventListeners();
        this.updateSlider(); // Initialize first slide
    }
    
    startAutoSlide() {
        // Clear any existing interval
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
        }
        
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
    
    nextSlide() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateSlider();
        
        // Reset animation flag after transition completes
        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }
    
    prevSlide() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateSlider();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }
    
    goToSlide(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        this.isAnimating = true;
        this.currentIndex = index;
        this.updateSlider();
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }
    
    updateSlider() {
        // Calculate the translation amount (25% per slide for 4 slides)
        const translateX = -(this.currentIndex * 25);
        
        // Update track position
        if (this.track) {
            this.track.style.transform = `translateX(${translateX}%)`;
        }
        
        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
        
        // Update slides with active class
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentIndex);
        });
        
        console.log(`Slide changed to index: ${this.currentIndex}`);
    }
    
    addEventListeners() {
        // Navigation arrows
        const nextBtn = document.querySelector('.testimonial-next');
        const prevBtn = document.querySelector('.testimonial-prev');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoSlide();
            });
        } else {
            console.warn('Next button not found');
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.resetAutoSlide();
            });
        } else {
            console.warn('Previous button not found');
        }
        
        // Dots navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoSlide();
            });
        });
        
        // Pause on hover
        if (this.track) {
            this.track.addEventListener('mouseenter', () => {
                console.log('Slider paused on hover');
                clearInterval(this.autoSlideInterval);
            });
            
            this.track.addEventListener('mouseleave', () => {
                console.log('Slider resumed');
                this.startAutoSlide();
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
                this.resetAutoSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
                this.resetAutoSlide();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    resetAutoSlide() {
        clearInterval(this.autoSlideInterval);
        this.startAutoSlide();
    }
    
    handleResize() {
        // Recalculate and update slider position on resize
        this.updateSlider();
    }
    
    // Public method to manually go to a specific slide
    goTo(index) {
        if (index >= 0 && index < this.slides.length) {
            this.goToSlide(index);
        }
    }
    
    // Public method to get current slide index
    getCurrentSlide() {
        return this.currentIndex;
    }
    
    // Public method to get total number of slides
    getTotalSlides() {
        return this.slides.length;
    }
}

// Initialize slider when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if testimonials section exists on the page
    const testimonialsSection = document.querySelector('.testimonials-section');
    
    if (testimonialsSection) {
        console.log('Testimonials section found, initializing slider...');
        
        // Small delay to ensure all elements are rendered
        setTimeout(() => {
            const slider = new TestimonialsSlider();
            
            // Make slider globally accessible for debugging
            window.testimonialsSlider = slider;
            
            console.log('Testimonials slider initialized successfully!');
        }, 100);
    } else {
        console.log('No testimonials section found on this page');
    }
});

// Alternative initialization for pages that load content dynamically
function initializeTestimonialsSlider() {
    const testimonialsSection = document.querySelector('.testimonials-section');
    
    if (testimonialsSection && !window.testimonialsSlider) {
        window.testimonialsSlider = new TestimonialsSlider();
        return true;
    }
    return false;
}

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestimonialsSlider;
}

// Compact Photo Slider
class CompactPhotoSlider {
    constructor(container) {
        this.container = container;
        this.slider = container.querySelector('.photo-slider');
        this.mainTrack = container.querySelector('.slider-main-track');
        this.slides = container.querySelectorAll('.slider-main-slide');
        this.dots = container.querySelectorAll('.slider-dot');
        this.prevBtn = container.querySelector('.slider-prev');
        this.nextBtn = container.querySelector('.slider-next');
        this.playPauseBtn = container.querySelector('.play-pause-btn');
        this.fullscreenBtn = container.querySelector('.slider-fullscreen-btn');
        this.zoomBtn = container.querySelector('.slider-zoom-btn');
        this.downloadBtn = document.querySelector('.slider-download-btn');
        this.progressBar = document.querySelector('.progress-bar');
        this.slideCounter = document.querySelector('.slide-counter');
        
        this.currentIndex = 0;
        this.isPlaying = true;
        this.isFullscreen = false;
        this.totalSlides = 4;
        this.autoPlayInterval = null;
        this.progressInterval = null;
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.zoomBtn.addEventListener('click', () => this.toggleZoom());
        this.downloadBtn.addEventListener('click', () => this.downloadCurrentImage());
        
        // Dot clicks
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft': this.prev(); break;
                case 'ArrowRight': this.next(); break;
                case ' ': this.togglePlayPause(); break;
                case 'Escape': if (this.isFullscreen) this.toggleFullscreen(); break;
                case 'f': case 'F': this.toggleFullscreen(); break;
            }
        });
        
        // Touch support
        this.addTouchSupport();
        
        // Start auto-play
        this.startAutoPlay();
        this.updateDisplay();
        this.startProgressBar();
    }
    
    addTouchSupport() {
        let startX = 0;
        
        this.mainTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        this.mainTrack.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                diff > 0 ? this.next() : this.prev();
            }
        }, { passive: true });
    }
    
    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
        this.updateSlider();
    }
    
    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentIndex = index;
            this.updateSlider();
        }
    }
    
    updateSlider() {
        this.mainTrack.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        this.updateActiveStates();
        this.resetProgressBar();
        this.updateCounter();
    }
    
    updateActiveStates() {
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentIndex);
        });
        
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    updateCounter() {
        if (this.slideCounter) {
            this.slideCounter.textContent = `${this.currentIndex + 1} / ${this.totalSlides}`;
        }
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            if (this.isPlaying) this.next();
        }, 4000);
    }
    
    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        this.playPauseBtn.classList.toggle('paused', !this.isPlaying);
        this.playPauseBtn.classList.toggle('active', this.isPlaying);
        
        this.isPlaying ? this.startProgressBar() : this.stopProgressBar();
    }
    
    startProgressBar() {
        this.stopProgressBar();
        let progress = 0;
        
        this.progressInterval = setInterval(() => {
            if (this.isPlaying) {
                progress += (50 / 4000) * 100;
                this.progressBar.style.width = progress + '%';
                if (progress >= 100) progress = 0;
            }
        }, 50);
    }
    
    stopProgressBar() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }
    
    resetProgressBar() {
        this.progressBar.style.width = '0%';
        if (this.isPlaying) {
            setTimeout(() => this.startProgressBar(), 100);
        }
    }
    
    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        this.slider.classList.toggle('fullscreen', this.isFullscreen);
        this.fullscreenBtn.classList.toggle('active', this.isFullscreen);
        
        if (this.isFullscreen) {
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.documentElement.style.overflow = '';
        }
    }
    
    toggleZoom() {
        const currentImage = this.slides[this.currentIndex].querySelector('.slider-image');
        const isZoomed = currentImage.style.transform === 'scale(1.8)';
        
        currentImage.style.transform = isZoomed ? 'scale(1)' : 'scale(1.8)';
        currentImage.style.cursor = isZoomed ? 'default' : 'grab';
        this.zoomBtn.classList.toggle('active', !isZoomed);
    }
    
    downloadCurrentImage() {
        const currentSlide = this.slides[this.currentIndex];
        const image = currentSlide.querySelector('.slider-image');
        
        const link = document.createElement('a');
        link.href = image.src;
        link.download = `jets-elementary-${this.currentIndex + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showDownloadFeedback();
    }
    
    showDownloadFeedback() {
        const feedback = document.createElement('div');
        feedback.className = 'download-feedback';
        feedback.textContent = '✓ Downloaded';
        
        document.body.appendChild(feedback);
        
        setTimeout(() => feedback.classList.add('show'), 100);
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => document.body.removeChild(feedback), 400);
        }, 2000);
    }
    
    updateDisplay() {
        this.updateActiveStates();
        this.updateCounter();
    }
    
    destroy() {
        this.stopProgressBar();
        clearInterval(this.autoPlayInterval);
    }
}

// Initialize slider
document.addEventListener('DOMContentLoaded', () => {
    const photoSlider = document.querySelector('.photo-slider-container');
    if (photoSlider) new CompactPhotoSlider(photoSlider);
});
