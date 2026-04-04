        // Animate each price meter when its card scrolls into view
function animateMeter(meterElement) {
    if (meterElement.dataset.animated === 'true') return;
    meterElement.dataset.animated = 'true';

    const targetPrice = parseFloat(meterElement.dataset.target);
    const priceSpan = meterElement.querySelector('.price-number');
    // Get the fill bar element (the div inside .meter-bar)
    const fillBar = meterElement.querySelector('.meter-bar > div');

    // Set fill bar background to match the card's border-top color
    const card = meterElement.closest('.price-card');
    if (card) {
        const borderColor = getComputedStyle(card).borderTopColor;
        fillBar.style.backgroundColor = borderColor;
    }

    let current = 0;
    const duration = 2000; // 2 seconds
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = targetPrice / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= targetPrice) {
            current = targetPrice;
            clearInterval(timer);
        }
        priceSpan.innerText = Math.floor(current);
        const percent = (current / targetPrice) * 100;
        fillBar.style.width = percent + '%';
    }, stepTime);
}

// Set up Intersection Observer for each meter
const meters = document.querySelectorAll('.price-meter');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateMeter(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

meters.forEach(meter => observer.observe(meter));

 // ========== SIDEBAR TOGGLE ==========
const hamburger = document.querySelector('.hamburger');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const overlay = document.getElementById('sidebarOverlay');

function openSidebar() {
    if (!sidebar || !overlay) {
        console.error('Sidebar or overlay element missing');
        return;
    }
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.classList.add('sidebar-open');
}

function closeSidebarFunc() {
    if (!sidebar || !overlay) return;
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.classList.remove('sidebar-open');
}

if (hamburger) {
    hamburger.addEventListener('click', openSidebar);
}

if (closeSidebar) {
    closeSidebar.addEventListener('click', closeSidebarFunc);
}

if (overlay) {
    overlay.addEventListener('click', closeSidebarFunc);
}

// Close sidebar when any link inside it is clicked
const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
sidebarLinks.forEach(link => {
    link.addEventListener('click', closeSidebarFunc);
});

// Interactive Dots – Tooltip on click
(function() {
    const overlay = document.getElementById('dotsOverlay');
    if (!overlay) return;

    function removeTooltip() {
        const existing = document.querySelector('.dot-tooltip');
        if (existing) existing.remove();
    }

    function showTooltip(dot, question) {
        removeTooltip();

        const dotRect = dot.getBoundingClientRect();
        const overlayRect = overlay.getBoundingClientRect();

        const tooltip = document.createElement('div');
        tooltip.className = 'dot-tooltip';
        tooltip.innerHTML = `<span class="close-tooltip">&times;</span> ${question}`;
        overlay.appendChild(tooltip);

        const tooltipRect = tooltip.getBoundingClientRect();

        const spaceRight = overlayRect.right - dotRect.right;
        const spaceLeft = dotRect.left - overlayRect.left;
        const spaceBottom = overlayRect.bottom - dotRect.bottom;

        let leftPos = 0, topPos = 0, placement = '';

        if (spaceRight >= tooltipRect.width + 10) {
            leftPos = dotRect.left - overlayRect.left + dotRect.width + 8;
            topPos = dotRect.top - overlayRect.top + (dotRect.height / 2) - (tooltipRect.height / 2);
            placement = 'right';
        } else if (spaceLeft >= tooltipRect.width + 10) {
            leftPos = dotRect.left - overlayRect.left - tooltipRect.width - 8;
            topPos = dotRect.top - overlayRect.top + (dotRect.height / 2) - (tooltipRect.height / 2);
            placement = 'left';
        } else {
            if (spaceBottom >= tooltipRect.height + 10) {
                topPos = dotRect.top - overlayRect.top + dotRect.height + 8;
                leftPos = dotRect.left - overlayRect.left + (dotRect.width / 2) - (tooltipRect.width / 2);
                placement = 'bottom';
            } else {
                topPos = dotRect.top - overlayRect.top - tooltipRect.height - 8;
                leftPos = dotRect.left - overlayRect.left + (dotRect.width / 2) - (tooltipRect.width / 2);
                placement = 'top';
            }
        }

        tooltip.style.left = `${leftPos}px`;
        tooltip.style.top = `${topPos}px`;
        tooltip.classList.add(placement);

        const closeBtn = tooltip.querySelector('.close-tooltip');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeTooltip();
            });
        }

        function closeOnClickOutside(e) {
            if (!tooltip.contains(e.target) && !dot.contains(e.target)) {
                removeTooltip();
                document.removeEventListener('click', closeOnClickOutside);
            }
        }
        setTimeout(() => {
            document.addEventListener('click', closeOnClickOutside);
        }, 0);
    }

    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => {
        dot.addEventListener('click', function(e) {
            e.stopPropagation();
            const question = this.getAttribute('data-question');
            if (question) showTooltip(this, question);
        });
    });
})();



(function() {
    const track = document.getElementById('carouselTrack');
    const container = document.querySelector('.carousel-container');
    const prevBtn = document.querySelector('.carousel-nav.prev');
    const nextBtn = document.querySelector('.carousel-nav.next');

    if (!track || !prevBtn || !nextBtn) return;

    // Get original cards (the 3 we have)
    const originalCards = Array.from(document.querySelectorAll('.carousel-card'));
    const totalOriginal = originalCards.length;

    // Clone first and last for infinite loop
    const firstClone = originalCards[0].cloneNode(true);
    const lastClone = originalCards[totalOriginal - 1].cloneNode(true);
    track.appendChild(firstClone);
    track.insertBefore(lastClone, originalCards[0]);

    // All cards including clones
    const allCards = Array.from(track.children);
    const totalSlides = allCards.length;

    let currentIndex = 1; // start at the first real card (index 1 because we inserted a clone at beginning)
    let startX = 0;
    let startTranslate = 0;
    let isDragging = false;
    let dragDistance = 0;

    // Function to get the width of one card
    function getCardWidth() {
        return originalCards[0].offsetWidth;
    }

    // Function to move to a specific index (with transition)
    function moveToIndex(index, withTransition = true) {
        if (withTransition) {
            track.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
        } else {
            track.style.transition = 'none';
        }
        const offset = -index * getCardWidth();
        track.style.transform = `translateX(${offset}px)`;
        currentIndex = index;

        // After transition, if at clone, jump to real card without transition
        if (withTransition) {
            setTimeout(() => {
                if (currentIndex === 0) {
                    // at first clone, jump to last original
                    moveToIndex(totalOriginal, false);
                } else if (currentIndex === totalSlides - 1) {
                    // at last clone, jump to first original
                    moveToIndex(1, false);
                }
            }, 400);
        }
    }

    // Navigation functions
    function nextSlide() {
        moveToIndex(currentIndex + 1);
    }
    function prevSlide() {
        moveToIndex(currentIndex - 1);
    }

    // Arrow listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // ----- Drag / Swipe -----
    function onDragStart(e) {
        e.preventDefault();
        isDragging = true;
        startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
        startTranslate = currentIndex * getCardWidth();
        track.style.transition = 'none';
        track.style.cursor = 'grabbing';
    }

    function onDragMove(e) {
        if (!isDragging) return;
        const currentX = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
        const deltaX = currentX - startX;
        dragDistance = deltaX;
        const newTranslate = startTranslate - deltaX;
        track.style.transform = `translateX(-${newTranslate}px)`;
    }

    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = '';
        track.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
        if (Math.abs(dragDistance) > 50) {
            if (dragDistance > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            // snap back to current index
            moveToIndex(currentIndex);
        }
        dragDistance = 0;
    }

    // Mouse events
    track.addEventListener('mousedown', onDragStart);
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);

    // Touch events
    track.addEventListener('touchstart', onDragStart);
    window.addEventListener('touchmove', onDragMove);
    window.addEventListener('touchend', onDragEnd);

    // Initial position (first real card)
    moveToIndex(1, false);

    // Update on window resize
    window.addEventListener('resize', () => {
        moveToIndex(currentIndex, false);
    });
})();

// Reports data (image URLs, titles, descriptions, PDF links)
const reportsData = [
    {
        img: "https://res.cloudinary.com/dxd5hibh7/image/upload/v1743123456/report_q1_2023.jpg",
        title: "Q1 2023 Impact Report",
        desc: "Expanding a data-driven approach to improve respectful care, defining ‘exemplars for quality’ in hospitals, and making user-centered...",
        pdf: "/reports/q1-2023.pdf"
    },
    {
        img: "https://res.cloudinary.com/dxd5hibh7/image/upload/v1743123457/report_2022_annual.jpg",
        title: "2022 Annual Report",
        desc: "How we increased the scale and sustainability of our impact on mothers and babies in 2022…",
        pdf: "/reports/annual-2022.pdf"
    },
    {
        img: "https://res.cloudinary.com/dxd5hibh7/image/upload/v1743123458/report_q4_2022.jpg",
        title: "Q4 2022 Impact Report",
        desc: "Testing PROMPTS content to increase relevance, building dashboards to generate systems-level insights, and supporting governments to use data…",
        pdf: "/reports/q4-2022.pdf"
    },
    {
        img: "https://res.cloudinary.com/dxd5hibh7/image/upload/v1743123459/report_q3_2022.jpg",
        title: "Q3 2022 Impact Report",
        desc: "Strengthening referral networks, improving facility readiness, and training community health workers…",
        pdf: "/reports/q3-2022.pdf"
    },
    {
        img: "https://res.cloudinary.com/dxd5hibh7/image/upload/v1743123460/report_2021_annual.jpg",
        title: "2021 Annual Report",
        desc: "Our first full year of impact: reaching 50,000 mothers and establishing partnerships with 15 counties…",
        pdf: "/reports/annual-2021.pdf"
    }
];

// Set how many cards per page
const cardsPerPage = 3;
const totalPages = Math.ceil(reportsData.length / cardsPerPage);

let currentPage = 0;

function renderReports() {
    const track = document.getElementById('reportsTrack');
    if (!track) return;

    // Clear track
    track.innerHTML = '';

    // Get current slice of data
    const start = currentPage * cardsPerPage;
    const end = start + cardsPerPage;
    const pageData = reportsData.slice(start, end);

    pageData.forEach(report => {
        const card = document.createElement('div');
        card.className = 'report-card';
        card.innerHTML = `
            <img class="report-img" src="${report.img}" alt="${report.title}" loading="lazy">
            <div class="report-content">
                <div class="report-title">${report.title}</div>
                <div class="report-desc">${report.desc}</div>
                <a href="${report.pdf}" class="download-link" download><i class="fas fa-download"></i> Download</a>
            </div>
        `;
        track.appendChild(card);
    });

    // Update pagination dots
    updatePagination();
}

function updatePagination() {
    const container = document.getElementById('reportsPagination');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('div');
        dot.className = `page-dot ${i === currentPage ? 'active' : ''}`;
        dot.addEventListener('click', () => goToPage(i));
        container.appendChild(dot);
    }
}

function goToPage(page) {
    if (page < 0 || page >= totalPages) return;
    currentPage = page;
    renderReports();
}

function nextPage() {
    if (currentPage + 1 < totalPages) {
        goToPage(currentPage + 1);
    }
}

function prevPage() {
    if (currentPage - 1 >= 0) {
        goToPage(currentPage - 1);
    }
}

// Attach event listeners
const prevBtn = document.getElementById('reportsPrev');
const nextBtn = document.getElementById('reportsNext');
if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', prevPage);
    nextBtn.addEventListener('click', nextPage);
}

// Newsletter signup (demo)
const signupForm = document.getElementById('reportsSignup');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = signupForm.querySelector('input').value;
        alert(`Thank you for subscribing! We'll send reports to ${email}`);
        signupForm.reset();
    });
}

// Initial render
renderReports();