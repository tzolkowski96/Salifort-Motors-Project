document.addEventListener('DOMContentLoaded', () => {

    // --- Collapsible Sections --- //
    const collapsibles = document.querySelectorAll(".collapsible");
    collapsibles.forEach(coll => {
        coll.addEventListener("click", function() {
            this.classList.toggle("active");
            const content = this.nextElementSibling;
            const isExpanded = this.classList.contains("active");
            this.setAttribute('aria-expanded', isExpanded);

            if (isExpanded) {
                // Expand: Set max-height to scrollHeight for animation
                content.style.display = "block"; // Need display block to measure scrollHeight
                content.style.maxHeight = content.scrollHeight + "px";
                content.style.opacity = 1;
            } else {
                // Collapse: Set max-height to 0
                content.style.maxHeight = "0px";
                content.style.opacity = 0;
                // Optional: Hide after transition completes
                content.addEventListener('transitionend', () => {
                    if (!this.classList.contains("active")) {
                        content.style.display = "none";
                    }
                }, { once: true });
            }
        });

        // Set initial state for non-active collapsibles
        const content = coll.nextElementSibling;
        if (!coll.classList.contains("active")) {
            content.style.maxHeight = "0px";
            content.style.opacity = 0;
            content.style.display = "none"; // Start hidden
        }
    });

    // --- Image Fullscreen Overlay --- //
    const images = document.querySelectorAll('.image-container img');
    const overlay = document.getElementById('fullscreen-overlay');
    const fullscreenImg = document.getElementById('fullscreen-img');
    const fullscreenCaption = document.getElementById('fullscreen-caption');
    const zoomInButton = document.getElementById('zoom-in');
    const zoomOutButton = document.getElementById('zoom-out');
    const closeButton = overlay.querySelector('button[aria-label="Close full screen image view"]');
    let currentScale = 1;
    let lastFocusedElement = null; // To return focus

    images.forEach(image => {
        image.addEventListener('click', function() {
            lastFocusedElement = document.activeElement; // Store focus
            fullscreenImg.src = this.src;
            fullscreenCaption.textContent = this.nextElementSibling.textContent;
            overlay.setAttribute('aria-label', this.alt || 'Full-screen image view');
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scroll
            resetZoom();
            // Focus trapping setup
            overlay.focus(); // Focus the overlay first
            setupFocusTrap();
        });
    });

    function closeOverlay() {
        overlay.style.display = 'none';
        fullscreenImg.src = "";
        document.body.style.overflow = ''; // Restore background scroll
        if (lastFocusedElement) {
            lastFocusedElement.focus(); // Return focus
        }
    }

    function resetZoom() {
        currentScale = 1;
        fullscreenImg.style.transform = 'scale(1)';
        updateButtonVisibility();
    }

    function updateButtonVisibility() {
        zoomOutButton.disabled = (currentScale <= 1);
        zoomInButton.disabled = (currentScale >= 5);
    }

    function zoom(delta) {
        currentScale = Math.max(1, Math.min(5, currentScale + delta));
        fullscreenImg.style.transform = `scale(${currentScale})`;
        updateButtonVisibility();
    }

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeOverlay();
        }
    });

    closeButton.addEventListener('click', closeOverlay);

    overlay.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeOverlay();
        }
    });

    zoomInButton.addEventListener('click', (event) => {
        event.stopPropagation();
        zoom(0.2);
    });

    zoomOutButton.addEventListener('click', (event) => {
        event.stopPropagation();
        zoom(-0.2);
    });

    fullscreenImg.addEventListener('wheel', (event) => {
        event.preventDefault();
        event.stopPropagation();
        zoom(event.deltaY < 0 ? 0.2 : -0.2);
    });

    // Prevent clicks on image/caption/buttons closing overlay
    [fullscreenImg, fullscreenCaption, zoomInButton, zoomOutButton].forEach(el => {
        el.addEventListener('click', event => event.stopPropagation());
    });

    // Basic Focus Trapping
    let focusableElements = [];
    function setupFocusTrap() {
        focusableElements = Array.from(overlay.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )).filter(el => el.offsetParent !== null); // Only visible elements
        if (focusableElements.length > 0) {
            focusableElements[0].focus(); // Focus the first element (usually close button)
        }
        overlay.addEventListener('keydown', handleFocusTrap);
    }

    function handleFocusTrap(event) {
        if (event.key === 'Tab') {
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    event.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    event.preventDefault();
                }
            }
        }
    }

    // --- Navbar Active Link Highlighting on Scroll --- //
    const sections = document.querySelectorAll('.container[id]'); // Select containers with IDs
    const navLinks = document.querySelectorAll('.navbar a');

    function changeNav() {
        let index = sections.length;

        while(--index && window.scrollY + 100 < sections[index].offsetTop) {}

        navLinks.forEach((link) => link.classList.remove('active'));
        // Ensure the link exists before trying to add class
        const activeLink = document.querySelector(`.navbar a[href*=\"${sections[index].id}\"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Initial call
    changeNav();
    // Add listener
    window.addEventListener('scroll', changeNav);

    // --- Smooth Scrolling for Navbar Links --- //
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Staggered Animation for Containers --- //
    const animatedContainers = document.querySelectorAll('.container');
    animatedContainers.forEach((container, index) => {
        container.style.setProperty('--order', index);
    });

});
