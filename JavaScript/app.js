// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Hide loading overlay
    setTimeout(() => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.classList.add('hide');
    }, 1000);

    // Initialize components
    initTypewriter();
    initSlideshow();
    initNavigation();
    initScrollAnimations();
    initSDGTabs(); // Added SDG tabs initialization
}

// Typewriter effect (unchanged)
function initTypewriter() {
    const typingDuration = 2000;
    setTimeout(() => {
        const cursor = document.getElementById('cursor');
        if (cursor) {
            cursor.classList.add('hide-cursor');
        }
    }, typingDuration);
}

// Slideshow functionality (unchanged)
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentSlide = 0;
    const slideInterval = 3000; // 3 seconds
    let autoSlideInterval;
    let isUserInteracting = false;

    // Function to show specific slide
    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        currentSlide = index;
    }

    // Function to go to next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Function to go to previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Auto-slideshow function
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            if (!isUserInteracting) {
                nextSlide();
            }
        }, slideInterval);
    }

    // Stop auto-slideshow
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Reset auto-slideshow after user interaction
    function resetAutoSlide() {
        stopAutoSlide();
        setTimeout(() => {
            isUserInteracting = false;
            startAutoSlide();
        }, 2000);
    }

    // Event listeners for navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            isUserInteracting = true;
            nextSlide();
            resetAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            isUserInteracting = true;
            prevSlide();
            resetAutoSlide();
        });
    }

    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            isUserInteracting = true;
            showSlide(index);
            resetAutoSlide();
        });
    });

    // Pause slideshow on hover
    const slideshowContainer = document.getElementById('slideshowContainer');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', () => {
            isUserInteracting = true;
            stopAutoSlide();
        });

        slideshowContainer.addEventListener('mouseleave', () => {
            isUserInteracting = false;
            startAutoSlide();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            isUserInteracting = true;
            prevSlide();
            resetAutoSlide();
        } else if (e.key === 'ArrowRight') {
            isUserInteracting = true;
            nextSlide();
            resetAutoSlide();
        }
    });

    // Pause slideshow when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoSlide();
        } else if (!isUserInteracting) {
            startAutoSlide();
        }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    slideshowContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    slideshowContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            isUserInteracting = true;
            if (diff > 0) {
                nextSlide(); // Swipe left - next slide
            } else {
                prevSlide(); // Swipe right - previous slide
            }
            resetAutoSlide();
        }
    }

    // Start the slideshow
    startAutoSlide();
}

function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    // Return early if elements don't exist (for pages without mobile menu)
    if (!menuToggle || !navMenu) return;

    const navLinks = document.querySelectorAll('.nav-menu a');

    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Toggle body overflow when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Navigation link handling
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // For anchor links only
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Close mobile menu
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                
                // Scroll to section
                const targetId = link.getAttribute('href').substring(1);
                document.getElementById(targetId)?.scrollIntoView({ 
                    behavior: 'smooth' 
                });
            }
            // For page links, close menu but allow normal navigation
            else {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}
// Updated Scroll Animations to include SDGs section
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // If it's the SDGs section, animate child elements
                if (entry.target.classList.contains('sdgs-section')) {
                    const tabsNav = entry.target.querySelector('.tabs-nav');
                    const tabsContent = entry.target.querySelector('.tabs-content');
                    
                    setTimeout(() => {
                        tabsNav?.classList.add('animate-in');
                    }, 300);
                    
                    setTimeout(() => {
                        tabsContent?.classList.add('animate-in');
                    }, 600);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.animate-left, .animate-right, .sdgs-section'
    );
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Enhanced SDGs Tabs Functionality with animations
function initSDGTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => {
                p.classList.remove('active');
                p.querySelector('.tab-content-inner')?.classList.remove('animate-in');
            });
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Show corresponding pane
            const tabId = btn.getAttribute('data-tab');
            const activePane = document.getElementById(tabId);
            activePane.classList.add('active');
            
            // Animate the new tab content
            setTimeout(() => {
                activePane.querySelector('.tab-content-inner')?.classList.add('animate-in');
            }, 50);
        });
    });
    
    // Animate the initial active tab
    setTimeout(() => {
        document.querySelector('.tab-pane.active .tab-content-inner')?.classList.add('animate-in');
    }, 1000);
}

// STACKED CARDS FUNCTIONALITY

// Scroll animation trigger
function initScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    const stackSection = document.querySelector('.cards-stack-section');
    if (stackSection) observer.observe(stackSection);
}

// Improved card removal with random exit animations
function initStackedCards() {
    const cards = document.querySelectorAll('.card');
    const viewBtn = document.querySelector('.view-cards-btn');
    const keepBtn = document.querySelector('.keep-cards-btn');
    let currentCard = 1;
    const totalCards = 5;
    const exitAnimations = [
        'card-exit-left',
        'card-exit-right', 
        'card-exit-top',
        'card-exit-bottom'
    ];

    viewBtn.addEventListener('click', () => {
        if (currentCard > totalCards) return;
        
        const activeCard = document.querySelector(`.card[data-card="${currentCard}"]`);
        if (!activeCard) return;
        
        // Select random exit animation
        const randomAnimation = exitAnimations[
            Math.floor(Math.random() * exitAnimations.length)
        ];
        
        // Apply exit animation
        activeCard.classList.add(randomAnimation);
        
        // Remove card after animation completes
        setTimeout(() => {
            activeCard.style.display = 'none';
            activeCard.classList.remove(randomAnimation);
            currentCard++;
            
            if (currentCard > totalCards) {
                viewBtn.style.display = 'none';
                keepBtn.style.display = 'inline-block';
            }
        }, 700); // Match this with CSS transition duration
    });

    keepBtn.addEventListener('click', () => {
        cards.forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = '';
        });
        
        // Reset stacking order
        cards.forEach((card, index) => {
            const zIndex = totalCards - index;
            const offset = index * 10;
            const scale = 1 - (index * 0.02);
            card.style.zIndex = zIndex;
            card.style.transform = `translateY(${offset}px) scale(${scale})`;
        });
        
        currentCard = 1;
        keepBtn.style.display = 'none';
        viewBtn.style.display = 'inline-block';
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimation();
    initStackedCards();
});



// E_LABE PAGE FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    // Timeline entry animations
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 150);
            }
        });
    }, { threshold: 0.1 });

    // Observe all timeline events
    document.querySelectorAll('.timeline__event').forEach(event => {
        timelineObserver.observe(event);
    });

    // Grade counter data
    const gradeData = [
        { current: 1700, total: 1700 },
        { current: 1800, total: 1800 },
        { current: 1900, total: 2000 },
        { current: 2500, total: 2500 },
        { current: 1980, total: 2000 },
        { current: 'Awaiting', total: '' }
    ];

    // Animate grade counters
    const gradeElements = document.querySelectorAll('.timeline__event__grade');
    
    gradeElements.forEach((gradeEl, index) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const data = gradeData[index];
                    const currentEl = gradeEl.querySelector('.grade-current');
                    const totalEl = gradeEl.querySelector('.grade-total');
                    const dividerEl = gradeEl.querySelector('.grade-divider');
                    
                    if (index === 5) {
                        currentEl.textContent = data.current;
                        totalEl.textContent = '';
                        dividerEl.textContent = '';
                        return;
                    }
                    
                    totalEl.textContent = data.total;
                    
                    let start = 0;
                    const end = data.current;
                    const duration = 2000;
                    const increment = end / (duration / 16);
                    
                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= end) {
                            clearInterval(timer);
                            currentEl.textContent = end;
                        } else {
                            currentEl.textContent = Math.floor(start);
                        }
                    }, 16);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(gradeEl);
    });

    // MODAL FUNCTIONALITY
    // Get all modal triggers
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    
    // Add click event to each trigger
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modals when clicking close button
    document.querySelectorAll('[data-modal-close]').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal-close');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close modals when clicking outside content
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });
});