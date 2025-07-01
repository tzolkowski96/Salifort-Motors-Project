document.addEventListener('DOMContentLoaded', () => {

    // --- Scroll Progress Indicator ---
    const createScrollIndicator = () => {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        document.body.prepend(indicator);
        
        const updateScrollProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            indicator.style.width = Math.min(scrollPercent, 100) + '%';
        };
        
        window.addEventListener('scroll', updateScrollProgress);
        updateScrollProgress(); // Initial call
    };
    
    createScrollIndicator();

    // --- Navbar Active State on Scroll ---
    const sections = document.querySelectorAll('.container[id]'); // Select containers with IDs
    const navLinks = document.querySelectorAll('.navbar a');

    const activateNavLink = () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Adjust offset as needed
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // If scrolled to the top or bottom, handle edge cases
        if (window.scrollY < sections[0].offsetTop - 100) {
            currentSectionId = sections[0].getAttribute('id');
        } else if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
            // Check if near the bottom, activate the last section's link
            currentSectionId = sections[sections.length - 1].getAttribute('id');
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', activateNavLink);
    activateNavLink(); // Initial check on load

    // --- Smooth Scrolling --- (Optional, browser support is good now, but can be added)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70; // Adjust for sticky navbar height
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Collapsible Sections ---
    const collapsibles = document.querySelectorAll('.collapsible');
    collapsibles.forEach(button => {
        button.addEventListener('click', function() {
            const content = document.getElementById(this.getAttribute('aria-controls'));
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Toggle aria-expanded attribute
            this.setAttribute('aria-expanded', !isExpanded);

            if (!isExpanded) {
                // Expand: Set padding first, then max-height to trigger transition
                content.style.padding = '1rem 18px';
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                // Collapse: Set max-height to null first, then padding
                // Setting max-height to null allows the CSS rule (max-height: 0) to take effect
                content.style.maxHeight = null;
                // We might need a slight delay for padding if the transition looks abrupt,
                // but let's try setting it directly first.
                content.style.padding = '0 18px';
            }
        });
    });

    // --- Image Fullscreen Overlay & Zoom/Pan ---
    const overlay = document.getElementById('fullscreen-overlay');
    const fullscreenImg = document.getElementById('fullscreen-img');
    const fullscreenCaption = document.getElementById('fullscreen-caption');
    const imageContainers = document.querySelectorAll('.image-container');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const closeBtn = document.getElementById('close-fullscreen-btn'); // Get the close button

    let currentZoom = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;

    imageContainers.forEach(container => {
        const img = container.querySelector('img');
        const caption = container.querySelector('.caption');
        if (img) {
            img.addEventListener('click', () => {
                fullscreenImg.src = img.src;
                fullscreenCaption.textContent = caption ? caption.textContent : '';
                overlay.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
                resetZoomAndPan();
            });
        }
    });

    const closeOverlay = () => {
        overlay.style.display = 'none';
        fullscreenImg.src = ''; // Clear image source
        fullscreenCaption.textContent = '';
        document.body.style.overflow = ''; // Restore scrolling
        resetZoomAndPan(); // Reset zoom/pan state when closing
    };

    // Attach listener to the close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeOverlay);
    }

    // Close overlay by clicking outside the image (on the overlay itself)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) { // Ensure click is on the overlay, not the image/buttons
            closeOverlay();
        }
    });

    // Close with Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.style.display === 'flex') {
            closeOverlay();
        }
    });

    // --- Zoom Functionality ---
    const applyTransform = () => {
        fullscreenImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
    };

    const resetZoomAndPan = () => {
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        applyTransform();
        fullscreenImg.style.cursor = 'grab';
        fullscreenImg.classList.remove('grabbing'); // Ensure grabbing class is removed
    };

    zoomInBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent overlay click
        currentZoom = Math.min(currentZoom * 1.3, 5); // Limit max zoom
        applyTransform();
    });

    zoomOutBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent overlay click
        currentZoom = Math.max(currentZoom / 1.3, 0.5); // Limit min zoom
        applyTransform();
    });

    // --- Pan Functionality ---
    fullscreenImg.addEventListener('mousedown', (e) => {
        if (currentZoom <= 1) return; // Only allow panning when zoomed
        e.preventDefault(); // Prevent default image dragging
        isDragging = true;
        startX = e.pageX - translateX;
        startY = e.pageY - translateY;
        fullscreenImg.style.cursor = 'grabbing';
        fullscreenImg.classList.add('grabbing'); // Add class for potential styling
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        translateX = e.pageX - startX;
        translateY = e.pageY - startY;
        applyTransform();
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            fullscreenImg.style.cursor = 'grab';
            fullscreenImg.classList.remove('grabbing');
        }
    });

    // Prevent dragging state sticking if mouse leaves window
    document.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            fullscreenImg.style.cursor = 'grab';
            fullscreenImg.classList.remove('grabbing');
        }
    });

    // Handle wheel zoom (optional)
    fullscreenImg.addEventListener('wheel', (e) => {
        if (overlay.style.display !== 'flex') return;
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY > 0 ? -0.1 : 0.1; // Zoom direction
        const zoomFactor = 1 + delta;
        const newZoom = Math.max(0.5, Math.min(currentZoom * zoomFactor, 5)); // Apply limits

        // Adjust translate to zoom towards mouse pointer
        const rect = fullscreenImg.getBoundingClientRect();
        const offsetX = (e.clientX - rect.left) / currentZoom; // Mouse position relative to image, scaled
        const offsetY = (e.clientY - rect.top) / currentZoom;

        translateX -= offsetX * (newZoom - currentZoom);
        translateY -= offsetY * (newZoom - currentZoom);

        currentZoom = newZoom;
        applyTransform();
    }, { passive: false });

    // --- Copy Code Functionality ---
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const codeContainer = this.closest('.code-container');
            const codeElement = codeContainer.querySelector('pre code');
            const codeText = codeElement.textContent;
            
            try {
                await navigator.clipboard.writeText(codeText);
                
                // Provide feedback
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.style.backgroundColor = '#10b981';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.backgroundColor = '#171717';
                }, 2000);
                
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = codeText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                // Provide feedback
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.style.backgroundColor = '#10b981';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.backgroundColor = '#171717';
                }, 2000);
            }
        });
    });

    // --- Basic Syntax Highlighting ---
    const highlightCode = () => {
        const codeBlocks = document.querySelectorAll('pre code');
        
        codeBlocks.forEach(block => {
            let html = block.innerHTML;
            
            // Python keywords
            const keywords = ['import', 'from', 'def', 'class', 'if', 'else', 'elif', 'for', 'while', 'try', 'except', 'finally', 'with', 'as', 'return', 'yield', 'pass', 'break', 'continue', 'and', 'or', 'not', 'in', 'is', 'True', 'False', 'None', 'print'];
            keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'g');
                html = html.replace(regex, `<span class="keyword">${keyword}</span>`);
            });
            
            // Strings
            html = html.replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="string">$1$2$1</span>');
            
            // Comments
            html = html.replace(/(#.*$)/gm, '<span class="comment">$1</span>');
            
            // Numbers
            html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');
            
            // Functions
            html = html.replace(/(\w+)(?=\()/g, '<span class="function">$1</span>');
            
            block.innerHTML = html;
        });
    };
    
    // Apply syntax highlighting after DOM is loaded
    highlightCode();

});
