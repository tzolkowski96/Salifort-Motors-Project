var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        var isExpanded = this.getAttribute('aria-expanded') === 'true';

        if (content.style.display === "block") {
            content.style.display = "none";
            this.setAttribute('aria-expanded', 'false');
        } else {
            content.style.display = "block";
            this.setAttribute('aria-expanded', 'true');
        }
    });
}

var images = document.querySelectorAll('.image-container img');
var overlay = document.getElementById('fullscreen-overlay');
var fullscreenImg = document.getElementById('fullscreen-img');
var fullscreenCaption = document.getElementById('fullscreen-caption');
var zoomInButton = document.getElementById('zoom-in');
var zoomOutButton = document.getElementById('zoom-out');

images.forEach(function(image) {
    image.addEventListener('click', function() {
        fullscreenImg.src = this.src;
        // Use the image's alt text for the overlay title if caption is simple
        overlay.setAttribute('aria-label', this.alt || 'Full-screen image view');
        fullscreenCaption.textContent = this.nextElementSibling.textContent;
        overlay.style.display = 'flex';
        // Optionally: Trap focus within the overlay here
        zoomInButton.focus(); // Set initial focus
    });
});

overlay.addEventListener('click', function(event) {
    // Close only if clicking the background, not the image or buttons
    if (event.target === overlay) {
        closeOverlay();
    }
});

// Add keyboard support for closing overlay
overlay.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeOverlay();
    }
    // Optionally: Add focus trapping logic here (Tab/Shift+Tab)
});

function closeOverlay() {
    overlay.style.display = 'none';
    fullscreenImg.src = ""; // Clear image src
    fullscreenImg.style.transform = 'scale(1)'; // Reset zoom
    updateButtonVisibility(1);
    // Optionally: Return focus to the element that opened the overlay
}


zoomInButton.addEventListener('click', function(event) {
    event.stopPropagation();
    var currentScale = fullscreenImg.style.transform.match(/scale\(([^)]+)\)/);
    var scale = currentScale ? parseFloat(currentScale[1]) : 1;
    scale = Math.min(scale + 0.2, 5); // Limit max scale to 5
    fullscreenImg.style.transform = `scale(${scale})`;
    updateButtonVisibility(scale);
});

zoomOutButton.addEventListener('click', function(event) {
    event.stopPropagation();
    var currentScale = fullscreenImg.style.transform.match(/scale\(([^)]+)\)/);
    var scale = currentScale ? parseFloat(currentScale[1]) : 1;
    scale = Math.max(scale - 0.2, 1); // Limit min scale to 1
    fullscreenImg.style.transform = `scale(${scale})`;
    updateButtonVisibility(scale);
});

function updateButtonVisibility(scale) {
    zoomOutButton.disabled = (scale <= 1);
    zoomInButton.disabled = (scale >= 5);
}

updateButtonVisibility(1); // Initial button state

// Add zoom with mouse wheel
fullscreenImg.addEventListener('wheel', function(event) {
    event.preventDefault();
    event.stopPropagation(); // Prevent background scroll
    var currentScale = fullscreenImg.style.transform.match(/scale\(([^)]+)\)/);
    var scale = currentScale ? parseFloat(currentScale[1]) : 1;
    if (event.deltaY < 0) {
        // Zoom in
        scale = Math.min(scale + 0.2, 5); // Limit max scale to 5
    } else {
        // Zoom out
        scale = Math.max(scale - 0.2, 1); // Limit min scale to 1
    }
    fullscreenImg.style.transform = `scale(${scale})`;
    updateButtonVisibility(scale);
});

// Prevent clicks on the image itself from closing the overlay
fullscreenImg.addEventListener('click', function(event) {
    event.stopPropagation();
});

// Prevent clicks on the caption itself from closing the overlay
fullscreenCaption.addEventListener('click', function(event) {
    event.stopPropagation();
});
