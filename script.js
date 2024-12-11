// Function to flash a UI element
function flashElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        // Remove the class if already present
        element.classList.remove('highlight-flash');
        void element.offsetWidth; // Trigger reflow to restart animation
        element.classList.add('highlight-flash');
    }
}

// Example Usage:
// When updating stack display
document.getElementById('stackDisplay').innerText = 'Updated stack contents...';
flashElement('stackDisplay');
