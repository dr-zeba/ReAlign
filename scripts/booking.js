document.addEventListener('DOMContentLoaded', () => {
    const bookBtns = document.querySelectorAll('.btn-primary'); // Assuming "Book Consultation" buttons have this class
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.display = 'none';
    document.body.appendChild(modalOverlay);

    // Load modal content
    let modalContent = null;

    async function loadModal() {
        if (modalContent) return;
        try {
            const response = await fetch('components/booking-form.html');
            const html = await response.text();
            modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            modalContent.innerHTML = `
        <button class="close-modal">&times;</button>
        ${html}
      `;
            modalOverlay.appendChild(modalContent);

            // Attach event listeners after content is loaded
            attachFormListeners();
        } catch (error) {
            console.error('Error loading booking form:', error);
        }
    }

    function attachFormListeners() {
        const closeBtn = modalContent.querySelector('.close-modal');
        closeBtn.addEventListener('click', closeModal);

        const form = document.getElementById('bookingForm');
        const dateInput = document.getElementById('date');

        // Set min date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (validateForm(form)) {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                try {
                    const response = await fetch('/api/book', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    const result = await response.json();
                    if (result.success) {
                        alert('Booking confirmed! We will contact you shortly.');
                        closeModal();
                        form.reset();
                    } else {
                        alert('Something went wrong. Please try again.');
                    }
                } catch (error) {
                    console.error('Submission error:', error);
                    alert('Could not connect to server. Please ensure server.js is running.');
                }
            }
        });
    }

    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input, select');

        inputs.forEach(input => {
            const errorSpan = document.getElementById(`${input.name}Error`) || input.nextElementSibling;
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                showError(input, errorSpan);
            } else {
                clearError(input, errorSpan);
            }

            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    showError(input, errorSpan);
                }
            }

            if (input.type === 'tel' && input.value) {
                const phoneRegex = /^[0-9+\s-]{10,}$/;
                if (!phoneRegex.test(input.value)) {
                    isValid = false;
                    showError(input, errorSpan);
                }
            }
        });

        return isValid;
    }

    function showError(input, span) {
        input.classList.add('invalid');
        if (span) span.style.display = 'block';
    }

    function clearError(input, span) {
        input.classList.remove('invalid');
        if (span) span.style.display = 'none';
    }

    function openModal() {
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // Initialize
    loadModal();

    bookBtns.forEach(btn => {
        if (btn.textContent.includes('Book')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        }
    });
});
