// ========== PAGE NAVIGATION ==========
const pages = document.querySelectorAll('.page');
const navItems = document.querySelectorAll('.nav-menu li');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

function switchPage(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add('active');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageId) item.classList.add('active');
    });
    if (window.innerWidth <= 900 && navMenu) navMenu.style.display = 'none';
}

navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (item.dataset.page) switchPage(item.dataset.page);
    });
});

// ========== SIDEBAR TOGGLE ==========
const sidebar = document.getElementById('sidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');
const overlay = document.getElementById('sidebarOverlay');

function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.classList.add('sidebar-open');
}

function closeSidebarFunc() {
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('sidebar-open');
}

if (hamburger) hamburger.addEventListener('click', openSidebar);
if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebarFunc);
if (overlay) overlay.addEventListener('click', closeSidebarFunc);

// Close sidebar when any link inside is clicked
document.querySelectorAll('.sidebar-menu a').forEach(link => {
    link.addEventListener('click', closeSidebarFunc);
});

// ========== ROLE SWITCHER ==========
const roleBtns = document.querySelectorAll('.role-btn');
let currentRole = 'farmer';

function updateRole(role) {
    currentRole = role;
    roleBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.role === role));

    const dashboardMsg = document.getElementById('dashboard-msg');
    const stat1 = document.getElementById('stat1');
    const stat2 = document.getElementById('stat2');
    const stat3 = document.getElementById('stat3');
    const activityList = document.getElementById('activity-list');
    const profileInfo = document.getElementById('profile-info');

    if (role === 'farmer') {
        dashboardMsg.innerHTML = 'Welcome, Farmer! Here is your farm summary.';
        stat1.innerText = '1,200';
        stat2.innerText = '6,600,000 UGX';
        stat3.innerText = '8';
        activityList.innerHTML = `<li><i class="fas fa-check-circle green"></i> Sold 50kg dried coffee - 2 days ago</li>
                                  <li><i class="fas fa-check-circle green"></i> New buyer inquiry - yesterday</li>`;
        profileInfo.innerHTML = '<p><strong>Name:</strong> Okello John (Farmer)</p><p><strong>Phone:</strong> +256 701 234567</p><p><strong>Member since:</strong> 2025</p><p><strong>Verified:</strong> <i class="fas fa-check-circle green"></i></p>';
    } else if (role === 'trader') {
        dashboardMsg.innerHTML = 'Welcome, Trader! Current market overview.';
        stat1.innerText = '5,400';
        stat2.innerText = '27,000,000 UGX';
        stat3.innerText = '12';
        activityList.innerHTML = `<li><i class="fas fa-check-circle green"></i> Purchased 300kg from Masaka - 3 days ago</li>
                                  <li><i class="fas fa-check-circle green"></i> 2 new processor requests</li>`;
        profileInfo.innerHTML = '<p><strong>Name:</strong> Nambi Grace (Trader)</p><p><strong>Phone:</strong> +256 702 345678</p><p><strong>Member since:</strong> 2024</p><p><strong>Verified:</strong> <i class="fas fa-check-circle green"></i></p>';
    } else if (role === 'processor') {
        dashboardMsg.innerHTML = 'Welcome, Processor! Your processing stats.';
        stat1.innerText = '3,800';
        stat2.innerText = '68,400,000 UGX';
        stat3.innerText = '5';
        activityList.innerHTML = `<li><i class="fas fa-check-circle green"></i> Processed 1,200kg this week</li>
                                  <li><i class="fas fa-check-circle green"></i> 3 farmers awaiting pickup</li>`;
        profileInfo.innerHTML = '<p><strong>Name:</strong> Ssali Moses (Processor)</p><p><strong>Phone:</strong> +256 703 456789</p><p><strong>Member since:</strong> 2023</p><p><strong>Verified:</strong> <i class="fas fa-check-circle green"></i></p>';
    }
}

roleBtns.forEach(btn => btn.addEventListener('click', () => updateRole(btn.dataset.role)));
updateRole('farmer');

// ========== PULSE BACKGROUND HOVER ==========
document.addEventListener('DOMContentLoaded', () => {
    const bgContainer = document.getElementById('pulse-bg');
    const columns = document.querySelectorAll('.team-column');
    if (!bgContainer || columns.length === 0) return;

    const originalBg = bgContainer.style.backgroundImage;
    columns.forEach(column => {
        const imgUrl = column.getAttribute('data-bg');
        if (imgUrl) new Image().src = imgUrl;
        column.addEventListener('mouseenter', () => {
            const newBg = column.getAttribute('data-bg');
            if (newBg) bgContainer.style.backgroundImage = `url('${newBg}')`;
        });
        column.addEventListener('mouseleave', () => bgContainer.style.backgroundImage = originalBg);
    });
});

// ========== NEWSLETTER FORM ==========
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('newsletterForm');
    const successDiv = document.getElementById('formSuccess');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const firstname = document.getElementById('firstname').value.trim();
            const lastname = document.getElementById('lastname').value.trim();
            const email = document.getElementById('email').value.trim();
            if (!firstname || !lastname || !email) {
                alert('Please fill all required fields (*)');
                return;
            }
            successDiv.style.display = 'block';
            form.reset();
            setTimeout(() => successDiv.style.display = 'none', 5000);
        });
    }
});

// ========== PRICE METERS & COUNTERS (animated on scroll) ==========
function animateMeter(meterElement) {
    if (meterElement.dataset.animated === 'true') return;
    meterElement.dataset.animated = 'true';

    const target = parseFloat(meterElement.dataset.target);
    const priceSpan = meterElement.querySelector('.price-number');
    const fillBar = meterElement.querySelector('.meter-bar > div');
    if (!priceSpan || !fillBar) return;

    const card = meterElement.closest('.price-card');
    if (card) {
        const borderColor = getComputedStyle(card).borderTopColor;
        fillBar.style.backgroundColor = borderColor;
    }

    let current = 0;
    const duration = 2000;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        priceSpan.innerText = Math.floor(current);
        fillBar.style.width = (current / target) * 100 + '%';
    }, stepTime);
}

// Observe all price meters
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

// ========== MODALS ==========
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');

window.openModal = function(type) {
    let content = '';
    if (type === 'tos') {
        content = `**TERMS OF SERVICE**\n\nBy using BUDDU platform you agree to:\n1. Provide accurate information.\n2. Respect fair trade practices.\n3. Payments are handled between parties.\n4. We may contact you via WhatsApp.\n5. Disputes to be resolved through local mediation.\n\nFor help: +256 700 123456`;
    } else if (type === 'pp') {
        content = `**PRIVACY POLICY**\n\nWe collect your name, phone, and role to facilitate connections. We never share your data with third parties. You can request deletion anytime.`;
    } else if (type === 'faq') {
        content = `**FREQUENTLY ASKED QUESTIONS**\n\nQ: How do I join?\nA: Click Signup and choose your role.\n\nQ: Are prices fixed?\nA: Prices shown are guidance; actual deals are between you and the other party.\n\nQ: Can I change my role?\nA: Contact support.\n\nQ: Is WhatsApp free?\nA: Yes, click the WhatsApp link to chat.`;
    }
    modalBody.innerText = content;
    modal.style.display = 'block';
};

window.closeModal = function() {
    modal.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target === modal) closeModal();
};

// ========== SIGNUP FORM ==========
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for joining! (Demo - no data sent)');
        switchPage('dashboard');
    });
}

// ========== CHAT (WebSocket) – optional, keep as is ==========
// ... (your existing chat code, unchanged)
