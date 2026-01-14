// Toggle mobile menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Close menu when link is clicked
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Toggle menu categories
function toggleCategory(header) {
    const category = header.closest('.menu-category');
    category.classList.toggle('active');
}

let selectedPartySize = null;

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeReservationSystem();
});

function initializeReservationSystem() {
    // Reserve Table button functionality - Open Modal
    const reserveBtn = document.querySelector('.reserve-btn');
    if (reserveBtn) {
        reserveBtn.addEventListener('click', () => {
            openPartySizeModal();
        });
    }

    // Reserve Table button in hero (secondary button)
    const reserveHeroBtn = document.querySelectorAll('.btn-secondary')[0];
    if (reserveHeroBtn) {
        reserveHeroBtn.addEventListener('click', () => {
            openPartySizeModal();
        });
    }

    // Party size button selection
    const partyBtns = document.querySelectorAll('.party-btn');
    partyBtns.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.party-btn').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedPartySize = button.dataset.size;
            
            // Auto open reservation modal after selection
            setTimeout(() => {
                closePartySizeModal();
                openReservationModal();
            }, 300);
        });
    });

    // Time slot selection
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    // Table slot selection
    const tableSlots = document.querySelectorAll('.table-slot');
    tableSlots.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('booked')) {
                // Show alert for booked table
                const alertModal = document.getElementById('alertModal');
                const alertMessage = document.getElementById('alertMessage');
                alertMessage.textContent = 'This table is already booked for the selected time slot. Please choose another table.';
                alertModal.classList.add('show');
            } else {
                document.querySelectorAll('.table-slot').forEach(slot => slot.classList.remove('selected'));
                button.classList.add('selected');
            }
        });
    });

    // Reservation form submission
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('customerName').value;
            const phone = document.getElementById('customerPhone').value;
            const date = document.getElementById('reservationDate').value;
            const time = document.querySelector('.time-slot.selected')?.textContent;
            const table = document.querySelector('.table-slot.selected')?.textContent;
            
            if (!time || !table) {
                alert('Please select both a time slot and a table.');
                return;
            }
            
            // Format the date to a more readable format
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            
            // Populate thank you modal with reservation details
            document.getElementById('confirmName').textContent = name;
            document.getElementById('confirmPhone').textContent = phone;
            document.getElementById('confirmDate').textContent = formattedDate;
            document.getElementById('confirmTime').textContent = time;
            document.getElementById('confirmParty').textContent = selectedPartySize + ' guests';
            document.getElementById('confirmTable').textContent = table;
            
            // Close reservation form and show thank you
            closeReservationModal();
            
            // Show thank you modal
            setTimeout(() => {
                const thankYouModal = document.getElementById('thankYouModal');
                thankYouModal.classList.add('show');
            }, 300);
        });
    }
}


// Party Size Modal Functions
function openPartySizeModal() {
    const modal = document.getElementById('partySizeModal');
    modal.classList.add('show');
}

function closePartySizeModal() {
    const modal = document.getElementById('partySizeModal');
    modal.classList.remove('show');
    document.querySelectorAll('.party-btn').forEach(btn => btn.classList.remove('selected'));
}

// Reservation Modal Functions
function openReservationModal() {
    const modal = document.getElementById('reservationModal');
    modal.classList.add('show');
    
    // Update party size display
    document.getElementById('selectedPartySize').textContent = selectedPartySize;
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('reservationDate').setAttribute('min', today);
}

function closeReservationModal() {
    const modal = document.getElementById('reservationModal');
    modal.classList.remove('show');
    document.getElementById('reservationForm').reset();
    document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
    document.querySelectorAll('.table-slot').forEach(slot => slot.classList.remove('selected'));
}

function closeAlert() {
    const alertModal = document.getElementById('alertModal');
    alertModal.classList.remove('show');
}

function closeThankYou() {
    const thankYouModal = document.getElementById('thankYouModal');
    thankYouModal.classList.remove('show');
    selectedPartySize = null;
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const partySizeModal = document.getElementById('partySizeModal');
    const reservationModal = document.getElementById('reservationModal');
    
    if (event.target === partySizeModal) {
        closePartySizeModal();
    }
    if (event.target === reservationModal) {
        closeReservationModal();
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Explore Menu button
const exploreMenuBtn = document.querySelector('.btn-primary');
if (exploreMenuBtn) {
    exploreMenuBtn.addEventListener('click', () => {
        document.querySelector('#menu').scrollIntoView({ behavior: 'smooth' });
    });
}

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease-in';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .gallery-item, .menu-category, .contact-item').forEach(el => {
    observer.observe(el);
});

// Add fadeIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

document.addEventListener("DOMContentLoaded", () => {
  const orderBtn = document.querySelector(".btn-order");

  if (!orderBtn) return;

  orderBtn.addEventListener("click", () => {
    // Specific WhatsApp number (India)
    const phoneNumber = "8383811681";

    // Optional WhatsApp message
    const message = "Hello! I would like to place an order.";

    // Open WhatsApp chat
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  });
});
