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
        img: "report.jpg",
        title: "Q1 2023 Impact Report",
        desc: "Expanding a data-driven approach to improve respectful care, defining ‘exemplars for quality’ in hospitals, and making user-centered...",
        pdf: "/reports/q1-2023.pdf"
    },
    {
        img: "mothers.jpg",
        title: "2022 Annual Report",
        desc: "Expanding a data‑driven approach to improve farmer support and market transparency, defining ‘exemplars for quality’ in cooperatives and processing hubs, and making user‑centered…",
        pdf: "/reports/annual-2022.pdf"
    },
    {
        img: "logic.jpg",
        title: "Q4 2022 Impact Report",
        desc: "Testing GROW content to increase relevance for farmers, building dashboards to generate systems‑level insights for cooperatives and district governments, and supporting governments to use data…",
        pdf: "/reports/q4-2022.pdf"
    },
    {
        img: "networks.jpg",
        title: "Q3 2022 Impact Report",
        desc: "Strengthening market linkages between farmers and buyers, improving cooperative and processing hub readiness, and training extension agents and farmer trainers…",
        pdf: "/reports/q3-2022.pdf"
    },
    {
        img: "year.jpeg",
        title: "2021 Annual Report",
        desc: "Our first full year of impact: reaching 50,000 coffee farmers and establishing partnerships with 15 coffee‑growing districts…",
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


// Country selector data (coffee context)
const countryData = {
    uganda: {
        name: 'Uganda',
        description: 'BUDDU partners with district local governments and the Ministry of Agriculture, Animal Industry and Fisheries to improve productivity, quality, and market access for coffee farmers. We co‑design scalable solutions that integrate into public agricultural systems, with a focus on climate‑smart practices and post‑harvest infrastructure.',
        link: 'our-work-uganda.html'
    },
    rwanda: {
        name: 'Rwanda',
        description: 'BUDDU is working with the Rwanda Agriculture Board and local cooperatives to test how our GROW platform can help smallholder coffee farmers access real‑time market intelligence, improve quality, and strengthen cooperative governance. We are adapting our model to Rwanda\'s high‑altitude coffee regions.',
        link: 'our-work-rwanda.html'
    },
    ethiopia: {
        name: 'Ethiopia',
        description: 'In Ethiopia, we are collaborating with the Ethiopian Coffee and Tea Authority and regional governments to pilot our data‑driven PULSE system, helping farmers and traders connect to premium markets while promoting sustainable farming practices that preserve forest coffee ecosystems.',
        link: 'our-work-ethiopia.html'
    }
};

// Get elements
const btns = document.querySelectorAll('.country-btn');
const countryNameSpan = document.getElementById('countryName');
const countryDescP = document.getElementById('countryDescription');
const countryBtn = document.getElementById('countryButton');

// Function to update content
function setCountry(countryKey) {
    const data = countryData[countryKey];
    if (!data) return;

    countryNameSpan.textContent = data.name;
    countryDescP.textContent = data.description;
    countryBtn.href = data.link;
    countryBtn.textContent = `Our Work in ${data.name} →`;

    // Update active button class
    btns.forEach(btn => {
        if (btn.dataset.country === countryKey) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Add click event listeners
btns.forEach(btn => {
    btn.addEventListener('click', () => {
        const country = btn.dataset.country;
        setCountry(country);
    });
});

// Set default (Uganda)
setCountry('uganda');


(function() {
    const overlay = document.getElementById('botsOverlay');
    if (!overlay) return;

    function removeTooltip() {
        const existing = document.querySelector('.bot-tooltip');
        if (existing) existing.remove();
    }

    function showTooltip(bot, question) {
        removeTooltip();

        const botRect = bot.getBoundingClientRect();
        const overlayRect = overlay.getBoundingClientRect();

        const tooltip = document.createElement('div');
        tooltip.className = 'bot-tooltip';
        tooltip.innerHTML = `<span class="close-bot-tooltip">&times;</span> ${question}`;
        overlay.appendChild(tooltip);

        const tooltipRect = tooltip.getBoundingClientRect();

        const spaceRight = overlayRect.right - botRect.right;
        const spaceLeft = botRect.left - overlayRect.left;
        const spaceTop = botRect.top - overlayRect.top;
        const spaceBottom = overlayRect.bottom - botRect.bottom;

        let leftPos = 0, topPos = 0, placement = '';

        if (spaceRight >= tooltipRect.width + 10) {
            leftPos = botRect.left - overlayRect.left + botRect.width + 8;
            topPos = botRect.top - overlayRect.top + (botRect.height / 2) - (tooltipRect.height / 2);
            placement = 'right';
        } else if (spaceLeft >= tooltipRect.width + 10) {
            leftPos = botRect.left - overlayRect.left - tooltipRect.width - 8;
            topPos = botRect.top - overlayRect.top + (botRect.height / 2) - (tooltipRect.height / 2);
            placement = 'left';
        } else if (spaceBottom >= tooltipRect.height + 10) {
            topPos = botRect.top - overlayRect.top + botRect.height + 8;
            leftPos = botRect.left - overlayRect.left + (botRect.width / 2) - (tooltipRect.width / 2);
            placement = 'bottom';
        } else {
            topPos = botRect.top - overlayRect.top - tooltipRect.height - 8;
            leftPos = botRect.left - overlayRect.left + (botRect.width / 2) - (tooltipRect.width / 2);
            placement = 'top';
        }

        tooltip.style.left = `${leftPos}px`;
        tooltip.style.top = `${topPos}px`;
        tooltip.classList.add(placement);

        const closeBtn = tooltip.querySelector('.close-bot-tooltip');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeTooltip();
            });
        }

        function closeOnClickOutside(e) {
            if (!tooltip.contains(e.target) && !bot.contains(e.target)) {
                removeTooltip();
                document.removeEventListener('click', closeOnClickOutside);
            }
        }
        setTimeout(() => document.addEventListener('click', closeOnClickOutside), 0);
    }

    const bots = document.querySelectorAll('.bot');
    bots.forEach(bot => {
        bot.addEventListener('click', function(e) {
            e.stopPropagation();
            const question = this.getAttribute('data-question');
            if (question) showTooltip(this, question);
        });
    });
})();
(function() {
    const overlay = document.getElementById('botsOverlay');
    if (!overlay) return;

    let currentTooltip = null;

    function removeTooltip() {
        if (currentTooltip) {
            currentTooltip.remove();
            currentTooltip = null;
        }
    }

    // Show a simple tooltip on hover (using data-label)
    function showHoverTooltip(bot, label) {
        removeTooltip();
        const tooltip = document.createElement('div');
        tooltip.className = 'bot-tooltip hover-tooltip';
        tooltip.innerHTML = `<span class="close-bot-tooltip" style="display:none;">&times;</span> ${label}`;
        overlay.appendChild(tooltip);
        currentTooltip = tooltip;

        // Position the tooltip (same logic as before)
        const botRect = bot.getBoundingClientRect();
        const overlayRect = overlay.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        const spaceRight = overlayRect.right - botRect.right;
        const spaceLeft = botRect.left - overlayRect.left;
        const spaceTop = botRect.top - overlayRect.top;
        const spaceBottom = overlayRect.bottom - botRect.bottom;

        let leftPos = 0, topPos = 0, placement = '';

        if (spaceRight >= tooltipRect.width + 10) {
            leftPos = botRect.left - overlayRect.left + botRect.width + 8;
            topPos = botRect.top - overlayRect.top + (botRect.height / 2) - (tooltipRect.height / 2);
            placement = 'right';
        } else if (spaceLeft >= tooltipRect.width + 10) {
            leftPos = botRect.left - overlayRect.left - tooltipRect.width - 8;
            topPos = botRect.top - overlayRect.top + (botRect.height / 2) - (tooltipRect.height / 2);
            placement = 'left';
        } else if (spaceBottom >= tooltipRect.height + 10) {
            topPos = botRect.top - overlayRect.top + botRect.height + 8;
            leftPos = botRect.left - overlayRect.left + (botRect.width / 2) - (tooltipRect.width / 2);
            placement = 'bottom';
        } else {
            topPos = botRect.top - overlayRect.top - tooltipRect.height - 8;
            leftPos = botRect.left - overlayRect.left + (botRect.width / 2) - (tooltipRect.width / 2);
            placement = 'top';
        }

        tooltip.style.left = `${leftPos}px`;
        tooltip.style.top = `${topPos}px`;
        tooltip.classList.add(placement);
    }

    // Show detailed question tooltip on click
    function showClickTooltip(bot, question) {
        removeTooltip();
        const tooltip = document.createElement('div');
        tooltip.className = 'bot-tooltip';
        tooltip.innerHTML = `<span class="close-bot-tooltip">&times;</span> ${question}`;
        overlay.appendChild(tooltip);
        currentTooltip = tooltip;

        // Position using the same logic (reuse positioning)
        const botRect = bot.getBoundingClientRect();
        const overlayRect = overlay.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        const spaceRight = overlayRect.right - botRect.right;
        const spaceLeft = botRect.left - overlayRect.left;
        const spaceTop = botRect.top - overlayRect.top;
        const spaceBottom = overlayRect.bottom - botRect.bottom;

        let leftPos = 0, topPos = 0, placement = '';

        if (spaceRight >= tooltipRect.width + 10) {
            leftPos = botRect.left - overlayRect.left + botRect.width + 8;
            topPos = botRect.top - overlayRect.top + (botRect.height / 2) - (tooltipRect.height / 2);
            placement = 'right';
        } else if (spaceLeft >= tooltipRect.width + 10) {
            leftPos = botRect.left - overlayRect.left - tooltipRect.width - 8;
            topPos = botRect.top - overlayRect.top + (botRect.height / 2) - (tooltipRect.height / 2);
            placement = 'left';
        } else if (spaceBottom >= tooltipRect.height + 10) {
            topPos = botRect.top - overlayRect.top + botRect.height + 8;
            leftPos = botRect.left - overlayRect.left + (botRect.width / 2) - (tooltipRect.width / 2);
            placement = 'bottom';
        } else {
            topPos = botRect.top - overlayRect.top - tooltipRect.height - 8;
            leftPos = botRect.left - overlayRect.left + (botRect.width / 2) - (tooltipRect.width / 2);
            placement = 'top';
        }

        tooltip.style.left = `${leftPos}px`;
        tooltip.style.top = `${topPos}px`;
        tooltip.classList.add(placement);

        // Close button inside detailed tooltip
        const closeBtn = tooltip.querySelector('.close-bot-tooltip');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeTooltip();
            });
        }

        // Click outside to close (only for detailed tooltip)
        function closeOnClickOutside(e) {
            if (!tooltip.contains(e.target) && !bot.contains(e.target)) {
                removeTooltip();
                document.removeEventListener('click', closeOnClickOutside);
            }
        }
        setTimeout(() => document.addEventListener('click', closeOnClickOutside), 0);
    }

    const bots = document.querySelectorAll('.bot');
    bots.forEach(bot => {
        // Hover event – show simple label
        bot.addEventListener('mouseenter', function(e) {
            const label = this.getAttribute('data-label');
            if (label) showHoverTooltip(this, label);
        });
        bot.addEventListener('mouseleave', function(e) {
            // Only remove if it's a hover tooltip (no close button)
            if (currentTooltip && !currentTooltip.querySelector('.close-bot-tooltip')) {
                removeTooltip();
            }
        });
        // Click event – show detailed question
        bot.addEventListener('click', function(e) {
            e.stopPropagation();
            const question = this.getAttribute('data-question');
            if (question) showClickTooltip(this, question);
        });
    });
})();