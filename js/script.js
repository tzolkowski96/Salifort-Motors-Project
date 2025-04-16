document.addEventListener('DOMContentLoaded', () => {

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
            this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');
            const content = document.getElementById(this.getAttribute('aria-controls'));
            if (content.style.maxHeight) {
                content.style.padding = '0 18px'; // Collapse padding first
                content.style.maxHeight = null;
            } else {
                content.style.padding = '1rem 18px'; // Expand padding
                content.style.maxHeight = content.scrollHeight + "px";
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
    };

    // Close overlay by clicking outside the image (on the overlay itself)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) { // Ensure click is on the overlay, not the image/buttons
            closeOverlay();
        }
    });

    // Close with Escape key (handled in CSS/HTML via button, but good practice)
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

    // --- Simple Scroll Animations for Containers ---
    const containers = document.querySelectorAll('.container');
    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animation to save resources
                // observer.unobserve(entry.target);
            }
            // Optional: remove class if scrolling back up
            // else {
            //     entry.target.classList.remove('visible');
            // }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    containers.forEach(container => {
        observer.observe(container);
    });

});

// Make closeOverlay globally accessible if called directly from HTML onclick
function closeOverlay() {
    const overlay = document.getElementById('fullscreen-overlay');
    const fullscreenImg = document.getElementById('fullscreen-img');
    const fullscreenCaption = document.getElementById('fullscreen-caption');
    if (overlay) {
        overlay.style.display = 'none';
        if (fullscreenImg) fullscreenImg.src = '';
        if (fullscreenCaption) fullscreenCaption.textContent = '';
        document.body.style.overflow = '';
    }
}
