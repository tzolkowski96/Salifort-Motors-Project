document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggle Logic ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const htmlElement = document.documentElement;

    // Check for saved user preference, if any, on load of the website
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

    if (currentTheme) {
        htmlElement.setAttribute('data-theme', currentTheme);

        if (currentTheme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    themeToggleBtn.addEventListener('click', function() {
        if (htmlElement.getAttribute('data-theme') === 'dark') {
            htmlElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });

    // --- Mobile Menu Logic ---
    const hamburgerBtn = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    if (hamburgerBtn && navLinksContainer) {
        hamburgerBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            const icon = hamburgerBtn.querySelector('i');
            if (navLinksContainer.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        const links = navLinksContainer.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                const icon = hamburgerBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinksContainer.contains(e.target) && !hamburgerBtn.contains(e.target) && navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                const icon = hamburgerBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- Scroll Handling (Progress & Active State) ---
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    document.body.prepend(indicator);

    const sections = document.querySelectorAll('.container[id]');
    const navLinks = document.querySelectorAll('.navbar a');

    const handleScroll = () => {
        // Update Progress
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        indicator.style.width = Math.min(scrollPercent, 100) + '%';

        // Update Active Nav Link
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (sections.length > 0) {
            if (window.scrollY < sections[0].offsetTop - 100) {
                currentSectionId = sections[0].getAttribute('id');
            } else if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
                currentSectionId = sections[sections.length - 1].getAttribute('id');
            }
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    // Optimized Scroll Listener using requestAnimationFrame
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    handleScroll(); // Initial call

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

    // --- Chart.js Implementation ---
    const ctx = document.getElementById('modelComparisonChart');
    
    if (ctx) {
        // Function to get colors based on theme
        const getChartColors = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            return {
                text: isDark ? '#f1f5f9' : '#1e293b',
                grid: isDark ? '#334155' : '#e2e8f0'
            };
        };

        let chartColors = getChartColors();

        const modelChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Logistic Regression', 'Random Forest', 'XGBoost'],
                datasets: [{
                    label: 'Accuracy',
                    data: [83, 97.83, 97.96],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.7)', // Blue
                        'rgba(16, 185, 129, 0.7)', // Green
                        'rgba(249, 115, 22, 0.7)'  // Orange
                    ],
                    borderColor: [
                        'rgb(59, 130, 246)',
                        'rgb(16, 185, 129)',
                        'rgb(249, 115, 22)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Model Accuracy Comparison (%)',
                        color: chartColors.text,
                        font: {
                            size: 16,
                            family: "'Outfit', sans-serif",
                            weight: 600
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.parsed.y + '%';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: chartColors.grid
                        },
                        ticks: {
                            color: chartColors.text
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: chartColors.text,
                            font: {
                                family: "'Inter', sans-serif"
                            }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });

        // Update chart on theme toggle
        themeToggleBtn.addEventListener('click', function() {
            // Small timeout to allow attribute to update
            setTimeout(() => {
                const newColors = getChartColors();
                modelChart.options.plugins.title.color = newColors.text;
                modelChart.options.scales.y.grid.color = newColors.grid;
                modelChart.options.scales.y.ticks.color = newColors.text;
                modelChart.options.scales.x.ticks.color = newColors.text;
                modelChart.update();
            }, 50);
        });
    }

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

    // Code blocks are now handled by Prism.js - no custom highlighting needed

});
