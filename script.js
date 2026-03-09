// script.js

// ========== PAGE NAVIGATION ==========
const pages = document.querySelectorAll('.page');
const navItems = document.querySelectorAll('.nav-menu li');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

function switchPage(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageId) item.classList.add('active');
    });
    // close mobile menu if open
    if (window.innerWidth <= 900) navMenu.style.display = 'none';
}

navItems.forEach(item => {
    item.addEventListener('click', () => switchPage(item.dataset.page));
});

hamburger.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});

// ========== ROLE SWITCHER ==========
const roleBtns = document.querySelectorAll('.role-btn');
let currentRole = 'farmer'; // default

function updateRole(role) {
    currentRole = role;
    roleBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.role === role);
    });

    // Update dashboard content based on role
    const dashboardMsg = document.getElementById('dashboard-msg');
    const stat1 = document.getElementById('stat1');
    const stat2 = document.getElementById('stat2');
    const stat3 = document.getElementById('stat3');
    const activityList = document.getElementById('activity-list');

    if (role === 'farmer') {
        dashboardMsg.innerHTML = 'Welcome, Farmer! Here is your farm summary.';
        stat1.innerText = '1,200';
        stat2.innerText = '6,600,000 UGX';
        stat3.innerText = '8';
        activityList.innerHTML = `
            <li><i class="fas fa-check-circle green"></i> Sold 50kg dried coffee - 2 days ago</li>
            <li><i class="fas fa-check-circle green"></i> New buyer inquiry - yesterday</li>
        `;
    } else if (role === 'trader') {
        dashboardMsg.innerHTML = 'Welcome, Trader! Current market overview.';
        stat1.innerText = '5,400';
        stat2.innerText = '27,000,000 UGX';
        stat3.innerText = '12';
        activityList.innerHTML = `
            <li><i class="fas fa-check-circle green"></i> Purchased 300kg from Masaka - 3 days ago</li>
            <li><i class="fas fa-check-circle green"></i> 2 new processor requests</li>
        `;
    } else if (role === 'processor') {
        dashboardMsg.innerHTML = 'Welcome, Processor! Your processing stats.';
        stat1.innerText = '3,800';
        stat2.innerText = '68,400,000 UGX';
        stat3.innerText = '5';
        activityList.innerHTML = `
            <li><i class="fas fa-check-circle green"></i> Processed 1,200kg this week</li>
            <li><i class="fas fa-check-circle green"></i> 3 farmers awaiting pickup</li>
        `;
    }

    // Update profile info (simple)
    const profileInfo = document.getElementById('profile-info');
    if (role === 'farmer') {
        profileInfo.innerHTML = '<p><strong>Name:</strong> Okello John (Farmer)</p><p><strong>Phone:</strong> +256 701 234567</p><p><strong>Member since:</strong> 2025</p><p><strong>Verified:</strong> <i class="fas fa-check-circle green"></i></p>';
    } else if (role === 'trader') {
        profileInfo.innerHTML = '<p><strong>Name:</strong> Nambi Grace (Trader)</p><p><strong>Phone:</strong> +256 702 345678</p><p><strong>Member since:</strong> 2024</p><p><strong>Verified:</strong> <i class="fas fa-check-circle green"></i></p>';
    } else if (role === 'processor') {
        profileInfo.innerHTML = '<p><strong>Name:</strong> Ssali Moses (Processor)</p><p><strong>Phone:</strong> +256 703 456789</p><p><strong>Member since:</strong> 2023</p><p><strong>Verified:</strong> <i class="fas fa-check-circle green"></i></p>';
    }
}

roleBtns.forEach(btn => {
    btn.addEventListener('click', () => updateRole(btn.dataset.role));
});

// Initialize default role
updateRole('farmer');

// ========== MODALS for ToS, PP, FAQ ==========
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');

function openModal(type) {
    let content = '';
    if (type === 'tos') {
        content = `**TERMS OF SERVICE**\n\nBy using BUDDU platform you agree to:\n1. Provide accurate information.\n2. Respect fair trade practices.\n3. Payments are handled between parties.\n4. We may contact you via WhatsApp.\n5. Disputes to be resolved through local mediation.\n\nFor help: +256 700 123456`;
    } else if (type === 'pp') {
        content = `**PRIVACY POLICY**\n\nWe collect your name, phone, and role to facilitate connections. We never share your data with third parties. You can request deletion anytime.`;
    } else if (type === 'faq') {
        content = `**FREQUENTLY ASKED QUESTIONS**\n\nQ: How do I join?\nA: Click Signup and choose your role.\n\nQ: Are prices fixed?\nA: Prices shown are guidance; actual deals are between you and the other party.\n\nQ: Can I change my role?\nA: Contact support.\n\nQ: Is WhatsApp free?\nA: Yes, click the WhatsApp link to chat.`;
    }
    modalBody.innerText = content; // using preformat
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

// Close modal if clicked outside
window.onclick = function(event) {
    if (event.target === modal) closeModal();
}

// ========== SIGNUP FORM SUBMIT (demo) ==========
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for joining! (Demo - no data sent)');
    switchPage('dashboard');
});

// ========== SMOOTH SCROLL AND INITIAL LOAD ==========
// Ensure home is active by default (already in HTML)
window.addEventListener('load', function() {
    // Additional animation triggers if needed
});
