  // script.js

// ========== PAGE NAVIGATION ==========
const pages = document.querySelectorAll('.page');
const navItems = document.querySelectorAll('.nav-menu li');
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
    item.addEventListener('click', () => {
        if (item.dataset.page) {          // only if data-page exists
            switchPage(item.dataset.page);
        }
    });
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

document.addEventListener('DOMContentLoaded', function() {
    const bgContainer = document.getElementById('pulse-bg');
    const columns = document.querySelectorAll('.team-column');
    
    if (!bgContainer || columns.length === 0) return;
    
    // Store the original background image (the inline style)
    const originalBg = bgContainer.style.backgroundImage;
    
    // Preload all hover images to avoid flickering
    columns.forEach(column => {
        const imgUrl = column.getAttribute('data-bg');
        if (imgUrl) {
            const img = new Image();
            img.src = imgUrl;
        }
    });
    
    // Hover events
    columns.forEach(column => {
        column.addEventListener('mouseenter', () => {
            const newBg = column.getAttribute('data-bg');
            if (newBg) {
                bgContainer.style.backgroundImage = `url('${newBg}')`;
            }
        });
        
        column.addEventListener('mouseleave', () => {
            bgContainer.style.backgroundImage = originalBg;
        });
    });
});

// Newsletter form submission (demo)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('newsletterForm');
    const successDiv = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Basic validation
            const firstname = document.getElementById('firstname').value.trim();
            const lastname = document.getElementById('lastname').value.trim();
            const email = document.getElementById('email').value.trim();

            if (!firstname || !lastname || !email) {
                alert('Please fill all required fields (*)');
                return;
            }

            // Simulate success (replace with actual backend later)
            successDiv.style.display = 'block';
            form.reset();

            // Optionally hide success message after 5 seconds
            setTimeout(() => {
                successDiv.style.display = 'none';
            }, 5000);
        });
    }
});

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
  // ===== CONFIGURATION - CHANGE THESE =====
        const WEBSOCKET_URL = 'ws://localhost:8000/ws';  // Your server URL
        const ROOM_NAME = 'support';                      // Channel/room name
        const USERNAME = 'visitor_' + Math.random().toString(36).substring(7); // Unique visitor ID
        
        // ===== GLOBAL VARIABLES =====
        let socket = null;
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 5;
        
        // ===== UI ELEMENTS =====
        const chatwithDiv = document.getElementById('chatwith');
        const textarea = document.getElementById('Chat');
        const sendBtn = document.getElementById('SendBtn');
        const container = document.getElementById('container');
        const chatBtn = document.getElementById('ChatBtn');
        const sentBtn = document.getElementById('SentBtn');

        // ===== CHAT FUNCTIONS =====
        function openChat() {
            container.style.display = 'block';
            chatBtn.style.display = 'none';
            sentBtn.style.display = 'inline-block';
            textarea.focus();
            
            // Connect WebSocket when chat opens
            connectWebSocket();
        }

        function closeChat() {
            container.style.display = 'none';
            chatBtn.style.display = 'block';
            
            // Disconnect WebSocket when chat closes
            if (socket) {
                socket.close();
                socket = null;
            }
        }

        function addMessage(text, sender) {
            const bubble = document.createElement('div');
            bubble.className = sender === 'user' ? 'user-message' : 'admin-message';
            bubble.textContent = text;
            chatwithDiv.appendChild(bubble);
            chatwithDiv.scrollTop = chatwithDiv.scrollHeight;
        }

        function addSystemMessage(text) {
            const system = document.createElement('div');
            system.className = 'system-info';
            system.textContent = text;
            chatwithDiv.appendChild(system);
            chatwithDiv.scrollTop = chatwithDiv.scrollHeight;
        }

        // ===== WEBSOCKET CONNECTION =====
        function connectWebSocket() {
            try {
                socket = new WebSocket(`${WEBSOCKET_URL}/${ROOM_NAME}?username=${USERNAME}`);
                
                socket.onopen = function() {
                    console.log('Connected to chat server');
                    addSystemMessage('✅ Connected to support');
                    reconnectAttempts = 0;
                };
                
                socket.onmessage = function(event) {
                    let data;
                    try {
                        data = JSON.parse(event.data);
                    } catch (e) {
                        // If not JSON, treat as plain text
                        addMessage(event.data, 'admin');
                        return;
                    }
                    
                    // Handle different message formats
                    if (data.type === 'text' || data.message) {
                        addMessage(data.message || data.text, 'admin');
                    } else if (data.username && data.message) {
                        // Format: {username: "admin", message: "hello"}
                        addMessage(data.message, 'admin');
                    } else {
                        // Fallback
                        addMessage(JSON.stringify(data), 'admin');
                    }
                };
                
                socket.onerror = function(error) {
                    console.error('WebSocket error:', error);
                    addSystemMessage('❌ Connection error');
                };
                
                socket.onclose = function() {
                    console.log('Disconnected from chat server');
                    
                    // Attempt to reconnect if chat is still open
                    if (container.style.display === 'block' && reconnectAttempts < maxReconnectAttempts) {
                        reconnectAttempts++;
                        addSystemMessage(`🔄 Reconnecting... (${reconnectAttempts}/${maxReconnectAttempts})`);
                        setTimeout(connectWebSocket, 3000);
                    } else if (reconnectAttempts >= maxReconnectAttempts) {
                        addSystemMessage('❌ Unable to connect. Please refresh.');
                    }
                };
                
            } catch (error) {
                console.error('Failed to create WebSocket:', error);
                addSystemMessage('❌ Failed to connect');
            }
        }

        // ===== SEND MESSAGE =====
        function sendMessage() {
            const msg = textarea.value.trim();
            if (!msg) return;
            
            // Display user message immediately
            addMessage(msg, 'user');
            
            // Send to server if connected
            if (socket && socket.readyState === WebSocket.OPEN) {
                // Format depends on your server - adjust as needed
                const messageObj = {
                    type: 'text',
                    message: msg,
                    username: USERNAME,
                    timestamp: new Date().toISOString()
                };
                socket.send(JSON.stringify(messageObj));
            } else {
                addSystemMessage('⚠️ Not connected - message not sent');
                // Try to reconnect
                if (!socket || socket.readyState === WebSocket.CLOSED) {
                    connectWebSocket();
                }
            }
            
            // Clear input
            textarea.value = '';
        }

        // ===== EVENT LISTENERS =====
        sendBtn.onclick = function(e) {
            e.preventDefault();
            sendMessage();
        };

        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Clean up on page unload
        window.addEventListener('beforeunload', function() {
            if (socket) {
                socket.close();
            }
        });
        //REVEAL ABOUT US PAGE
        // Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const aboutSection = document.getElementById('about-section');
    const dropdownLinks = document.querySelectorAll('.dropdown-content a');
    const closeButton = document.getElementById('close-about');

    // Reveal and scroll when a dropdown link is clicked
    dropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();                     // stop instant jump
            const targetId = this.getAttribute('href');  // e.g. "#mission-vision"
            const targetEl = document.querySelector(targetId);

            if (targetEl) {
                // Show the about section (if hidden)
                aboutSection.style.display = 'block';

                // Smooth scroll to the target
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Main ABOUT US button (the dropbtn) – reveal about section and scroll to top
const mainAboutBtn = document.getElementById('about-main-btn');
if (mainAboutBtn) {
    mainAboutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const aboutSection = document.getElementById('about-section');
        if (aboutSection) {
            aboutSection.style.display = 'block';
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

    // Hide the about section when the close button is clicked
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            aboutSection.style.display = 'none';
        });
    }
});
function showAboutSection() {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
        aboutSection.style.display = 'block';
        aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
}

 // ========== SIDEBAR TOGGLE ==========
const hamburger = document.querySelector('.hamburger');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const overlay = document.getElementById('sidebarOverlay');

function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.classList.add('sidebar-open');
}

function closeSidebarFunc() {
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
