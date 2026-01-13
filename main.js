// Main JavaScript for Savoir Restaurant Website

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeCarousel();
    initializeCalendar();
    initializeFormHandlers();
    initializeParticles();
    initializeScrollEffects();
});

// Scroll reveal animations
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// Particle system for hero section
function initializeParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    // Create p5.js sketch for particles
    new p5((p) => {
        let particles = [];
        const numParticles = 30;

        p.setup = () => {
            const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
            canvas.parent(container);
            
            // Create particles
            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    size: p.random(2, 6),
                    speedX: p.random(-0.5, 0.5),
                    speedY: p.random(-0.8, -0.2),
                    opacity: p.random(0.3, 0.7)
                });
            }
        };

        p.draw = () => {
            p.clear();
            
            // Update and draw particles
            particles.forEach(particle => {
                // Update position
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Reset particle if it goes off screen
                if (particle.y < -10) {
                    particle.y = p.height + 10;
                    particle.x = p.random(p.width);
                }
                if (particle.x < -10 || particle.x > p.width + 10) {
                    particle.x = p.random(p.width);
                }
                
                // Draw particle
                p.fill(248, 246, 240, particle.opacity * 255);
                p.noStroke();
                p.ellipse(particle.x, particle.y, particle.size);
            });
        };

        p.windowResized = () => {
            p.resizeCanvas(container.offsetWidth, container.offsetHeight);
        };
    });
}

// Initialize carousel
function initializeCarousel() {
    const carousel = document.getElementById('chef-specials');
    if (!carousel) return;

    new Splide(carousel, {
        type: 'loop',
        perPage: 3,
        perMove: 1,
        gap: '2rem',
        autoplay: true,
        interval: 4000,
        pauseOnHover: true,
        breakpoints: {
            1024: {
                perPage: 2,
            },
            640: {
                perPage: 1,
            }
        }
    }).mount();
}

// Calendar functionality
let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;

function initializeCalendar() {
    updateCalendar();
    generateTimeSlots();
    
    // Calendar navigation
    document.getElementById('prev-month')?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });
    
    document.getElementById('next-month')?.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });
}

function updateCalendar() {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const currentMonthElement = document.getElementById('current-month');
    if (currentMonthElement) {
        currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
    
    generateCalendarDays();
}

function generateCalendarDays() {
    const calendarGrid = document.getElementById('calendar-grid');
    if (!calendarGrid) return;
    
    calendarGrid.innerHTML = '';
    
    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'text-center text-sm font-semibold text-cream/70 py-2';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const today = new Date();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement('div');
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayElement = document.createElement('div');
        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Check if day is available (not past, not Sunday)
        if (dayDate >= today && dayDate.getDay() !== 0) {
            dayElement.classList.add('available');
            dayElement.addEventListener('click', () => selectDate(dayDate, dayElement));
        } else {
            dayElement.classList.add('unavailable');
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

function selectDate(date, element) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day.selected').forEach(el => {
        el.classList.remove('selected');
        el.classList.add('available');
    });
    
    // Add selection to clicked element
    element.classList.remove('available');
    element.classList.add('selected');
    
    selectedDate = date;
    generateTimeSlots(); // Regenerate time slots for new date
}

function generateTimeSlots() {
    const timeSlotsContainer = document.getElementById('time-slots');
    if (!timeSlotsContainer) return;
    
    timeSlotsContainer.innerHTML = '';
    
    const timeSlots = [
        '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
        '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM', '10:30 PM'
    ];
    
    timeSlots.forEach(time => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.textContent = time;
        
        // Randomly make some slots unavailable for demo
        const isAvailable = Math.random() > 0.3;
        
        if (selectedDate && isAvailable) {
            timeSlot.addEventListener('click', () => selectTime(time, timeSlot));
        } else {
            timeSlot.classList.add('unavailable');
        }
        
        timeSlotsContainer.appendChild(timeSlot);
    });
}

function selectTime(time, element) {
    // Remove previous selection
    document.querySelectorAll('.time-slot.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Add selection to clicked element
    element.classList.add('selected');
    selectedTime = time;
}

// Form handlers
function initializeFormHandlers() {
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', handleReservationSubmit);
    }
    
    // Add to order buttons
    document.querySelectorAll('.splide__slide button').forEach(button => {
        if (button.textContent.includes('Add to Order')) {
            button.addEventListener('click', handleAddToOrder);
        }
    });
}

function handleReservationSubmit(e) {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
        showNotification('Please select a date and time for your reservation.', 'error');
        return;
    }
    
    // Simulate form submission
    const formData = new FormData(e.target);
    const reservationData = {
        date: selectedDate.toLocaleDateString(),
        time: selectedTime,
        firstName: formData.get('firstName') || e.target.querySelector('input[type="text"]').value,
        email: formData.get('email') || e.target.querySelector('input[type="email"]').value,
        phone: formData.get('phone') || e.target.querySelector('input[type="tel"]').value,
        partySize: e.target.querySelector('select').value
    };
    
    // Show success message
    showReservationConfirmation(reservationData);
}

function handleAddToOrder(e) {
    const card = e.target.closest('.splide__slide');
    const dishName = card.querySelector('h3').textContent;
    const price = card.querySelector('.text-sienna').textContent;
    
    showNotification(`${dishName} added to your order!`, 'success');
    
    // Animate button
    anime({
        targets: e.target,
        scale: [1, 0.95, 1],
        duration: 200,
        easing: 'easeOutQuad'
    });
}

function showReservationConfirmation(data) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-charcoal/80 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-cream rounded-2xl p-8 max-w-md w-full text-center">
            <div class="w-16 h-16 bg-sage rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-8 h-8 text-cream" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
            </div>
            <h3 class="text-2xl font-bold text-charcoal mb-4">Reservation Confirmed!</h3>
            <p class="text-charcoal/70 mb-6">
                Thank you for choosing Savoir. We've confirmed your reservation for 
                <strong>${data.date}</strong> at <strong>${data.time}</strong> 
                for <strong>${data.partySize} guests</strong>.
            </p>
            <p class="text-sm text-charcoal/60 mb-6">
                A confirmation email has been sent to ${data.email}
            </p>
            <button onclick="closeModal()" class="bg-sienna text-cream px-6 py-3 rounded-lg hover:bg-sienna/90 transition-colors">
                Perfect!
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate modal appearance
    anime({
        targets: modal,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });
    
    anime({
        targets: modal.querySelector('.bg-cream'),
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 400,
        delay: 100,
        easing: 'easeOutBack'
    });
}

function closeModal() {
    const modal = document.querySelector('.fixed.inset-0');
    if (modal) {
        anime({
            targets: modal,
            opacity: [1, 0],
            duration: 200,
            easing: 'easeInQuad',
            complete: () => modal.remove()
        });
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-6 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        type === 'success' ? 'bg-sage text-cream' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-charcoal text-cream'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate notification
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: [0, 300],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuad',
            complete: () => notification.remove()
        });
    }, 3000);
}

// Utility functions
function scrollToReservation() {
    const reservationSection = document.getElementById('reservation');
    if (reservationSection) {
        reservationSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize text animations
function initializeAnimations() {
    // Animate hero text on load
    anime.timeline({
        easing: 'easeOutExpo',
        duration: 1000
    })
    .add({
        targets: '.reveal',
        opacity: [0, 1],
        translateY: [50, 0],
        delay: anime.stagger(200, {start: 500})
    });
    
    // Animate navigation on scroll
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            nav?.classList.add('shadow-lg');
        } else {
            nav?.classList.remove('shadow-lg');
        }
        
        lastScrollY = currentScrollY;
    });
}

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial animations
    setTimeout(() => {
        initializeAnimations();
    }, 100);
});