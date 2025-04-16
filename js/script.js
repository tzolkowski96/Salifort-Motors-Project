document.addEventListener('DOMContentLoaded', () => {

    // --- Debounce Function ---
    // Limits the rate at which a function can fire.
    function debounce(func, wait = 15, immediate = false) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    // --- Navbar Active State on Scroll ---
    const sections = document.querySelectorAll('.container[id]');
    const navLinks = document.querySelectorAll('.navbar a');
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70; // Get navbar height or default

    const activateNavLink = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            // Adjust offset calculation to be more precise relative to navbar height
            const sectionTop = section.offsetTop - navbarHeight - 10; // Add a small buffer
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Handle edge cases more robustly
        if (!currentSectionId) {
            if (scrollPosition < sections[0].offsetTop - navbarHeight - 10) {
                currentSectionId = sections[0].getAttribute('id');
            } else if (window.innerHeight + scrollPosition >= document.body.offsetHeight - 50) {
                currentSectionId = sections[sections.length - 1].getAttribute('id');
            }
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Ensure link has href and it matches
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    // Use debounced version for scroll event
    window.addEventListener('scroll', debounce(activateNavLink, 50)); // Debounce scroll handler
    activateNavLink(); // Initial check

    // --- Smooth Scrolling ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Check if it's an internal link
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    // Calculate precise offset based on actual navbar height
                    const offsetTop = targetElement.offsetTop - navbarHeight;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    // Optionally close mobile nav if implemented
                }
            }
        });
    });

    // --- Collapsible Sections ---
    const collapsibles = document.querySelectorAll('.collapsible');
    collapsibles.forEach(button => {
        button.addEventListener('click', function() {
            const contentId = this.getAttribute('aria-controls');
            const content = document.getElementById(contentId);
            if (!content) return; // Exit if content element not found

            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            this.setAttribute('aria-expanded', !isExpanded);

            if (!isExpanded) {
                // Expand: Set max-height after a tiny delay to allow CSS to apply initial state if needed
                // Set padding before height for smoother visual transition
                content.style.paddingTop = '1rem';
                content.style.paddingBottom = '1rem';
                content.style.maxHeight = content.scrollHeight + "px";
                // Add overflow visible briefly during expansion if content jumps
                // setTimeout(() => { content.style.overflow = 'visible'; }, 300); // Adjust timing based on CSS transition duration
            } else {
                // Collapse: Set overflow hidden first, then height and padding
                // content.style.overflow = 'hidden';
                content.style.maxHeight = '0';
                // Remove padding after height transition starts
                content.style.paddingTop = '0';
                content.style.paddingBottom = '0';
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
    const closeBtn = document.getElementById('close-fullscreen-btn'); // Get close button

    // Check if essential overlay elements exist
    if (!overlay || !fullscreenImg || !fullscreenCaption || !zoomInBtn || !zoomOutBtn || !closeBtn) {
        console.error("Fullscreen overlay elements not found. Feature disabled.");
        return; // Don't proceed if elements are missing
    }

    let currentZoom = 1;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    const MAX_ZOOM = 5;
    const MIN_ZOOM = 0.5;
    const ZOOM_STEP = 1.3;

    imageContainers.forEach(container => {
        const img = container.querySelector('img');
        const caption = container.querySelector('.caption');
        if (img) {
            img.addEventListener('click', () => {
                fullscreenImg.src = img.src;
                fullscreenCaption.textContent = caption ? caption.textContent : '';
                overlay.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                resetZoomAndPan();
                // Add listener for close button inside the overlay logic
                closeBtn.addEventListener('click', closeOverlay);
            });
        }
    });

    const closeOverlay = () => {
        overlay.style.display = 'none';
        fullscreenImg.src = '';
        fullscreenCaption.textContent = '';
        document.body.style.overflow = '';
        // Remove listener to prevent memory leaks if overlay is opened multiple times
        closeBtn.removeEventListener('click', closeOverlay);
    };

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeOverlay();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.style.display === 'flex') {
            closeOverlay();
        }
    });

    const applyTransform = () => {
        // Clamp translation to prevent panning image completely out of view
        const imgWidth = fullscreenImg.offsetWidth * currentZoom;
        const imgHeight = fullscreenImg.offsetHeight * currentZoom;
        const overlayWidth = overlay.clientWidth;
        const overlayHeight = overlay.clientHeight;

        // Calculate max allowed translation offsets
        // Allow panning until only a small part (e.g., 100px) of the image is visible
        const maxTranslateX = Math.max(0, (imgWidth - overlayWidth) / 2 + overlayWidth * 0.1);
        const minTranslateX = -maxTranslateX;
        const maxTranslateY = Math.max(0, (imgHeight - overlayHeight) / 2 + overlayHeight * 0.1);
        const minTranslateY = -maxTranslateY;

        // Clamp the current translation values
        translateX = Math.max(minTranslateX, Math.min(maxTranslateX, translateX));
        translateY = Math.max(minTranslateY, Math.min(maxTranslateY, translateY));

        fullscreenImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentZoom})`;
    };

    const resetZoomAndPan = () => {
        currentZoom = 1;
        translateX = 0;
        translateY = 0;
        applyTransform();
        fullscreenImg.style.cursor = 'grab';
        fullscreenImg.classList.remove('grabbing');
    };

    zoomInBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentZoom = Math.min(currentZoom * ZOOM_STEP, MAX_ZOOM);
        applyTransform();
    });

    zoomOutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentZoom = Math.max(currentZoom / ZOOM_STEP, MIN_ZOOM);
        // If zoom is close to 1, reset pan
        if (Math.abs(currentZoom - 1) < 0.05) {
             resetZoomAndPan();
        } else {
            applyTransform();
        }
    });

    fullscreenImg.addEventListener('mousedown', (e) => {
        if (currentZoom <= 1) return;
        e.preventDefault();
        isDragging = true;
        // Calculate start relative to the image's current translation
        startX = e.pageX - translateX;
        startY = e.pageY - translateY;
        fullscreenImg.style.cursor = 'grabbing';
        fullscreenImg.classList.add('grabbing');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        // Calculate new translation based on mouse movement
        translateX = e.pageX - startX;
        translateY = e.pageY - startY;
        applyTransform(); // applyTransform will clamp the values
    });

    // Use a shared mouseup/mouseleave handler
    const endDrag = () => {
        if (isDragging) {
            isDragging = false;
            fullscreenImg.style.cursor = 'grab';
            fullscreenImg.classList.remove('grabbing');
        }
    };
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('mouseleave', endDrag); // Handle mouse leaving the window

    fullscreenImg.addEventListener('wheel', (e) => {
        if (overlay.style.display !== 'flex') return;
        e.preventDefault();
        e.stopPropagation();

        const delta = e.deltaY > 0 ? -1 : 1; // Direction (-1 for zoom out, 1 for zoom in)
        const zoomFactor = delta > 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
        const newZoom = Math.max(MIN_ZOOM, Math.min(currentZoom * zoomFactor, MAX_ZOOM));

        // Calculate mouse position relative to the overlay
        const overlayRect = overlay.getBoundingClientRect();
        const mouseX = e.clientX - overlayRect.left;
        const mouseY = e.clientY - overlayRect.top;

        // Calculate the point on the image under the mouse before zoom
        const imgX = (mouseX - translateX) / currentZoom;
        const imgY = (mouseY - translateY) / currentZoom;

        // Calculate the new translation to keep the point under the mouse
        translateX = mouseX - imgX * newZoom;
        translateY = mouseY - imgY * newZoom;

        currentZoom = newZoom;

        // If zoom is very close to 1 after wheel zoom, reset pan
        if (Math.abs(currentZoom - 1) < 0.05) {
             resetZoomAndPan();
        } else {
            applyTransform(); // applyTransform will clamp translation
        }

    }, { passive: false });

});

// Keep global closeOverlay function for HTML onclick, but add checks
function closeOverlay() {
    const overlay = document.getElementById('fullscreen-overlay');
    const fullscreenImg = document.getElementById('fullscreen-img');
    const fullscreenCaption = document.getElementById('fullscreen-caption');
    const closeBtn = document.getElementById('close-fullscreen-btn');

    if (overlay && overlay.style.display !== 'none') {
        overlay.style.display = 'none';
        if (fullscreenImg) { fullscreenImg.src = ''; } // Re-add curly braces
        if (fullscreenCaption) { fullscreenCaption.textContent = ''; } // Re-add curly braces
        document.body.style.overflow = '';
        // Attempt to remove listener if button exists
        if (closeBtn) {
             closeBtn.removeEventListener('click', closeOverlay);
        }
    }
}
