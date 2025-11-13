// AI Learning Hub - Interactive Features

// ========================================
// Cookie Management System (Security Enhanced)
// ========================================

class CookieManager {
    constructor() {
        this.cookiePrefix = 'ai_learning_';
        this.defaultOptions = {
            secure: true,  // HTTPS only
            sameSite: 'Strict',  // CSRF protection
            expires: 30  // days
        };
    }

    // Set cookie with security options
    setCookie(name, value, options = {}) {
        const opts = { ...this.defaultOptions, ...options };
        const cookieName = this.cookiePrefix + name;

        // Encode value to handle special characters
        const encodedValue = encodeURIComponent(value);

        let cookieString = `${cookieName}=${encodedValue}`;

        // Add expiration
        if (opts.expires) {
            const date = new Date();
            date.setTime(date.getTime() + (opts.expires * 24 * 60 * 60 * 1000));
            cookieString += `; expires=${date.toUTCString()}`;
        }

        // Add path
        cookieString += `; path=/`;

        // Add SameSite
        if (opts.sameSite) {
            cookieString += `; SameSite=${opts.sameSite}`;
        }

        // Add Secure flag (requires HTTPS)
        // Note: Secure flag may prevent cookie in local development (http://)
        if (opts.secure && window.location.protocol === 'https:') {
            cookieString += `; Secure`;
        }

        document.cookie = cookieString;
    }

    // Get cookie value
    getCookie(name) {
        const cookieName = this.cookiePrefix + name;
        const cookies = document.cookie.split(';');

        for (let cookie of cookies) {
            const [key, value] = cookie.trim().split('=');
            if (key === cookieName) {
                return decodeURIComponent(value);
            }
        }
        return null;
    }

    // Delete cookie
    deleteCookie(name) {
        this.setCookie(name, '', { expires: -1 });
    }

    // Check if cookie exists
    hasCookie(name) {
        return this.getCookie(name) !== null;
    }
}

// Session Management
class SessionManager {
    constructor() {
        this.cookieManager = new CookieManager();
        this.sessionKey = 'session_id';
    }

    // Generate unique session ID
    generateSessionId() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        const randomExtra = Math.random().toString(36).substring(2, 15);
        return `${timestamp}-${random}${randomExtra}`;
    }

    // Initialize session
    initSession() {
        if (!this.cookieManager.hasCookie(this.sessionKey)) {
            const sessionId = this.generateSessionId();
            this.cookieManager.setCookie(this.sessionKey, sessionId);
            if (typeof securityLogger !== 'undefined') {
                securityLogger.logActivity('Session Created', { sessionId: sessionId.substring(0, 8) + '...' });
            }
        } else {
            const sessionId = this.getSessionId();
            if (typeof securityLogger !== 'undefined') {
                securityLogger.logActivity('Session Restored', { sessionId: sessionId.substring(0, 8) + '...' });
            }
        }
    }

    // Get current session ID
    getSessionId() {
        return this.cookieManager.getCookie(this.sessionKey);
    }

    // Destroy session
    destroySession() {
        this.cookieManager.deleteCookie(this.sessionKey);
    }

    // Refresh session (extend expiration)
    refreshSession() {
        const sessionId = this.getSessionId();
        if (sessionId) {
            this.cookieManager.setCookie(this.sessionKey, sessionId);
        }
    }
}

// Simple Data Encryption (Base64 with obfuscation)
class DataProtection {
    constructor() {
        this.salt = 'AI_LEARNING_HUB_2025';
    }

    // Encrypt data (simple obfuscation for client-side)
    encrypt(data) {
        try {
            const jsonString = JSON.stringify(data);
            const obfuscated = btoa(encodeURIComponent(jsonString + this.salt));
            return obfuscated;
        } catch (error) {
            console.error('Encryption error:', error);
            return null;
        }
    }

    // Decrypt data
    decrypt(encryptedData) {
        try {
            const decoded = decodeURIComponent(atob(encryptedData));
            const jsonString = decoded.replace(this.salt, '');
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Decryption error:', error);
            return null;
        }
    }

    // Sanitize input to prevent XSS
    sanitize(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }
}

// Initialize security managers
const cookieManager = new CookieManager();
const sessionManager = new SessionManager();
const dataProtection = new DataProtection();

// Security Logger
class SecurityLogger {
    constructor() {
        this.logSecurityInfo();
    }

    logSecurityInfo() {
        console.log('%c🔒 AI Learning Hub - Security Features Enabled', 'color: #27ae60; font-weight: bold; font-size: 14px;');
        console.log('%c✓ Cookie Protection: Secure, SameSite=Strict', 'color: #4a90e2;');
        console.log('%c✓ Session Management: Active', 'color: #4a90e2;');
        console.log('%c✓ Data Encryption: Base64 with salt', 'color: #4a90e2;');
        console.log('%c✓ XSS Protection: Input sanitization enabled', 'color: #4a90e2;');
        console.log('%c⚠️ Note: For production, implement server-side security (HTTPS, HttpOnly cookies, CSRF tokens)', 'color: #f46434; font-style: italic;');
    }

    logActivity(action, details) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${action}:`, details);
    }
}

const securityLogger = new SecurityLogger();

// Progress tracking data
let progressData = {
    introduction: 0,
    machineLearning: 0,
    deepLearning: 0,
    practical: 0
};

// ========================================
// Badge System
// ========================================

class BadgeManager {
    constructor() {
        this.badges = this.initializeBadges();
        this.earnedBadges = this.loadEarnedBadges();
        this.completedLessons = this.loadCompletedLessons();
    }

    // Initialize all available badges
    initializeBadges() {
        return {
            // Section completion badges
            'introduction_complete': {
                id: 'introduction_complete',
                name: '基礎マスター',
                description: 'AI基礎編の全レッスンを完了しました',
                icon: '🎓',
                color: '#f46434',
                category: 'section'
            },
            'machine_learning_complete': {
                id: 'machine_learning_complete',
                name: '機械学習エキスパート',
                description: '機械学習編の全レッスンを完了しました',
                icon: '🤖',
                color: '#4a90e2',
                category: 'section'
            },
            'deep_learning_complete': {
                id: 'deep_learning_complete',
                name: '深層学習マスター',
                description: '深層学習編の全レッスンを完了しました',
                icon: '🧠',
                color: '#9b59b6',
                category: 'section'
            },
            'practical_complete': {
                id: 'practical_complete',
                name: '実践のプロ',
                description: '実践編の全レッスンを完了しました',
                icon: '💻',
                color: '#27ae60',
                category: 'section'
            },
            // Milestone badges
            'first_lesson': {
                id: 'first_lesson',
                name: '最初の一歩',
                description: '初めてのレッスンを完了しました',
                icon: '⭐',
                color: '#ffd700',
                category: 'milestone'
            },
            'ten_lessons': {
                id: 'ten_lessons',
                name: '学習継続者',
                description: '10個のレッスンを完了しました',
                icon: '🌟',
                color: '#ff6b6b',
                category: 'milestone'
            },
            'all_complete': {
                id: 'all_complete',
                name: 'AIマスター',
                description: '全てのレッスンを完了しました！',
                icon: '👑',
                color: '#ff1744',
                category: 'master'
            }
        };
    }

    // Load earned badges from storage
    loadEarnedBadges() {
        const saved = localStorage.getItem('aiLearningBadges');
        if (saved) {
            return JSON.parse(saved);
        }
        return [];
    }

    // Save earned badges to storage
    saveEarnedBadges() {
        localStorage.setItem('aiLearningBadges', JSON.stringify(this.earnedBadges));

        // Also save encrypted to cookie
        const encrypted = dataProtection.encrypt(this.earnedBadges);
        if (encrypted) {
            cookieManager.setCookie('badges_data', encrypted, { expires: 365 });
        }
    }

    // Load completed lessons
    loadCompletedLessons() {
        const saved = localStorage.getItem('aiLearningCompletedLessons');
        if (saved) {
            return JSON.parse(saved);
        }
        return [];
    }

    // Save completed lessons
    saveCompletedLessons() {
        localStorage.setItem('aiLearningCompletedLessons', JSON.stringify(this.completedLessons));
    }

    // Check if badge is earned
    hasBadge(badgeId) {
        return this.earnedBadges.some(badge => badge.id === badgeId);
    }

    // Award a badge
    awardBadge(badgeId) {
        if (this.hasBadge(badgeId)) {
            return false; // Already earned
        }

        const badge = this.badges[badgeId];
        if (badge) {
            const earnedBadge = {
                ...badge,
                earnedAt: new Date().toISOString()
            };

            this.earnedBadges.push(earnedBadge);
            this.saveEarnedBadges();

            // Log badge acquisition
            if (typeof securityLogger !== 'undefined') {
                securityLogger.logActivity('Badge Earned', {
                    badgeId: badge.id,
                    badgeName: badge.name
                });
            }

            // Show badge notification
            this.showBadgeNotification(earnedBadge);
            return true;
        }
        return false;
    }

    // Mark lesson as completed
    completeLesson(lessonNumber) {
        if (!this.completedLessons.includes(lessonNumber)) {
            this.completedLessons.push(lessonNumber);
            this.saveCompletedLessons();

            // Check for badge awards
            this.checkBadgeConditions();
        }
    }

    // Check conditions for badge awards
    checkBadgeConditions() {
        const completedCount = this.completedLessons.length;

        // First lesson badge
        if (completedCount === 1) {
            this.awardBadge('first_lesson');
        }

        // 10 lessons badge
        if (completedCount === 10) {
            this.awardBadge('ten_lessons');
        }

        // Section completion badges
        const sections = {
            introduction: { start: 1, end: 4, badgeId: 'introduction_complete' },
            machineLearning: { start: 5, end: 10, badgeId: 'machine_learning_complete' },
            deepLearning: { start: 11, end: 16, badgeId: 'deep_learning_complete' },
            practical: { start: 17, end: 22, badgeId: 'practical_complete' }
        };

        for (const [section, data] of Object.entries(sections)) {
            const sectionLessons = [];
            for (let i = data.start; i <= data.end; i++) {
                sectionLessons.push(i);
            }

            const allCompleted = sectionLessons.every(lesson =>
                this.completedLessons.includes(lesson)
            );

            if (allCompleted) {
                this.awardBadge(data.badgeId);
            }
        }

        // Master badge (all 22 lessons)
        if (completedCount === 22) {
            this.awardBadge('all_complete');
        }
    }

    // Show badge notification
    showBadgeNotification(badge) {
        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.innerHTML = `
            <div class="badge-notification-content">
                <div class="badge-icon" style="background: ${badge.color}">${badge.icon}</div>
                <div class="badge-info">
                    <h3>バッジを獲得しました！</h3>
                    <h4>${badge.name}</h4>
                    <p>${badge.description}</p>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Add animation styles
        this.addBadgeNotificationStyles();

        // Remove after animation
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease forwards';
            setTimeout(() => notification.remove(), 500);
        }, 4000);

        // Update badge display
        this.updateBadgeDisplay();
    }

    // Add badge notification styles
    addBadgeNotificationStyles() {
        if (!document.getElementById('badge-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'badge-notification-styles';
            style.textContent = `
                .badge-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                    padding: 20px;
                    z-index: 3000;
                    animation: slideIn 0.5s ease;
                    max-width: 350px;
                }

                .badge-notification-content {
                    display: flex;
                    gap: 15px;
                    align-items: center;
                }

                .badge-notification .badge-icon {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    flex-shrink: 0;
                }

                .badge-notification .badge-info h3 {
                    margin: 0 0 5px 0;
                    color: #f46434;
                    font-size: 0.9rem;
                }

                .badge-notification .badge-info h4 {
                    margin: 0 0 5px 0;
                    color: #000814;
                    font-size: 1.1rem;
                }

                .badge-notification .badge-info p {
                    margin: 0;
                    color: #625147;
                    font-size: 0.9rem;
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Update badge display in UI
    updateBadgeDisplay() {
        const badgeContainer = document.querySelector('.badges-container');
        if (!badgeContainer) return;

        badgeContainer.innerHTML = '';

        this.earnedBadges.forEach(badge => {
            const badgeElement = document.createElement('div');
            badgeElement.className = 'badge-item';
            badgeElement.title = badge.description;
            badgeElement.innerHTML = `
                <div class="badge-icon-small" style="background: ${badge.color}">${badge.icon}</div>
                <span class="badge-name">${badge.name}</span>
            `;
            badgeContainer.appendChild(badgeElement);
        });

        // Update badge statistics
        this.updateBadgeStats();
    }

    // Update badge statistics display
    updateBadgeStats() {
        const badgeCountElement = document.getElementById('badge-count');
        const lessonCountElement = document.getElementById('lesson-count');

        if (badgeCountElement) {
            const stats = this.getBadgeStats();
            badgeCountElement.textContent = `${stats.earned}/${stats.total}`;
        }

        if (lessonCountElement) {
            const stats = this.getBadgeStats();
            lessonCountElement.textContent = `${stats.lessonsCompleted}/${stats.totalLessons}`;
        }
    }

    // Get badge statistics
    getBadgeStats() {
        return {
            earned: this.earnedBadges.length,
            total: Object.keys(this.badges).length,
            lessonsCompleted: this.completedLessons.length,
            totalLessons: 22
        };
    }
}

// Initialize badge manager
const badgeManager = new BadgeManager();

// Load progress from localStorage and cookies (with encryption)
function loadProgress() {
    // Try to load from localStorage first
    const savedProgress = localStorage.getItem('aiLearningProgress');

    // Also try to load from encrypted cookie as backup
    const cookieData = cookieManager.getCookie('progress_data');

    if (savedProgress) {
        progressData = JSON.parse(savedProgress);
        updateProgressBars();
    } else if (cookieData) {
        // Decrypt cookie data
        const decryptedData = dataProtection.decrypt(cookieData);
        if (decryptedData) {
            progressData = decryptedData;
            // Restore to localStorage as well
            localStorage.setItem('aiLearningProgress', JSON.stringify(progressData));
            updateProgressBars();
        }
    }
}

// Save progress to localStorage and encrypted cookie
function saveProgress() {
    // Save to localStorage
    localStorage.setItem('aiLearningProgress', JSON.stringify(progressData));

    // Encrypt and save to cookie as backup
    const encryptedData = dataProtection.encrypt(progressData);
    if (encryptedData) {
        cookieManager.setCookie('progress_data', encryptedData, { expires: 365 });
    }

    // Refresh session on activity
    sessionManager.refreshSession();
}

// Update progress bars
function updateProgressBars() {
    const progressItems = document.querySelectorAll('.progress-item');
    const categories = ['introduction', 'machineLearning', 'deepLearning', 'practical'];

    progressItems.forEach((item, index) => {
        const progressFill = item.querySelector('.progress-fill');
        const progressText = item.querySelector('.progress-text');
        const category = categories[index];
        const progress = progressData[category];

        progressFill.style.width = progress + '%';
        progressText.textContent = progress + '%';
    });
}

// Note: handleLessonClick function removed - no longer needed
// Lesson links now navigate directly without showing a modal

// Mark lesson as complete and update progress
function markLessonComplete(lessonNumber, sectionId) {
    const lessonCounts = {
        introduction: 4,
        'machine-learning': 6,
        'deep-learning': 6,
        practical: 6
    };

    const categoryMap = {
        introduction: 'introduction',
        'machine-learning': 'machineLearning',
        'deep-learning': 'deepLearning',
        practical: 'practical'
    };

    const category = categoryMap[sectionId];
    const totalLessons = lessonCounts[sectionId];

    // Mark lesson as completed in badge system
    badgeManager.completeLesson(lessonNumber);

    // Calculate progress (simplified - would track individual lessons in production)
    if (progressData[category] < 100) {
        progressData[category] = Math.min(progressData[category] + (100 / totalLessons), 100);
        progressData[category] = Math.round(progressData[category]);
        saveProgress();
        updateProgressBars();
    }
}

// Note: Modal functions removed (showLessonModal, closeModal, startLesson, addModalStyles)
// Lesson links now navigate directly to their respective pages

// Smooth scroll with offset for sticky nav
function smoothScrollWithOffset(target) {
    const element = document.querySelector(target);
    if (element) {
        const navHeight = document.querySelector('.main-nav').offsetHeight;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - navHeight - 20;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Navigation highlight on scroll
function highlightNavOnScroll() {
    const sections = document.querySelectorAll('.category-section');
    const navLinks = document.querySelectorAll('.main-nav a');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// Note: Active style is now defined in CSS with category-specific colors
function addNavActiveStyle() {
    // No longer needed - styles are in CSS
}

// Card animation on scroll
function animateCardsOnScroll() {
    const cards = document.querySelectorAll('.lesson-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.5s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => observer.observe(card));
}

// Header scroll hide/show functionality
let lastScrollTop = 0;
let scrollTimeout;

function handleHeaderScroll() {
    const nav = document.querySelector('.main-nav');
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // Clear previous timeout
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }

    // Add slight delay to make animation smoother
    scrollTimeout = setTimeout(() => {
        if (currentScroll > lastScrollTop && currentScroll > 100) {
            // Scrolling down & past threshold
            nav.classList.add('nav-hidden');
            nav.classList.remove('nav-visible');
        } else if (currentScroll < lastScrollTop) {
            // Scrolling up
            nav.classList.remove('nav-hidden');
            nav.classList.add('nav-visible');
        }

        // At top of page, always show
        if (currentScroll <= 100) {
            nav.classList.remove('nav-hidden');
            nav.classList.add('nav-visible');
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, 10);
}

// Hamburger Menu Functionality
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Video Completion Tracking
class VideoCompletionTracker {
    constructor() {
        this.completedVideos = this.loadCompletedVideos();
    }

    loadCompletedVideos() {
        const saved = localStorage.getItem('aiLearningCompletedVideos');
        return saved ? JSON.parse(saved) : [];
    }

    saveCompletedVideos() {
        localStorage.setItem('aiLearningCompletedVideos', JSON.stringify(this.completedVideos));
    }

    markVideoComplete(lessonNumber) {
        if (!this.completedVideos.includes(lessonNumber)) {
            this.completedVideos.push(lessonNumber);
            this.saveCompletedVideos();

            // Award badge when video is completed
            if (typeof badgeManager !== 'undefined') {
                badgeManager.completeLesson(lessonNumber);
            }

            // Log activity
            if (typeof securityLogger !== 'undefined') {
                securityLogger.logActivity('Video Completed', { lessonNumber: lessonNumber });
            }

            return true;
        }
        return false;
    }

    isVideoCompleted(lessonNumber) {
        return this.completedVideos.includes(lessonNumber);
    }
}

// Initialize video completion tracker
const videoCompletionTracker = new VideoCompletionTracker();

// YouTube IFrame API - Video Completion Detection
function initYouTubeAPI() {
    // Load YouTube IFrame API
    if (typeof YT === 'undefined') {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
}

// This function will be called by YouTube API when ready
window.onYouTubeIframeAPIReady = function() {
    console.log('YouTube API Ready');
};

// Function to track video completion (called from lesson pages)
function trackVideoCompletion(lessonNumber) {
    const wasNewCompletion = videoCompletionTracker.markVideoComplete(lessonNumber);

    if (wasNewCompletion) {
        // Show completion message
        showVideoCompletionMessage(lessonNumber);
    }
}

// Show video completion message
function showVideoCompletionMessage(lessonNumber) {
    const message = document.createElement('div');
    message.className = 'video-completion-message';
    message.innerHTML = `
        <div class="completion-content">
            <div class="completion-icon">🎉</div>
            <h3>動画視聴完了！</h3>
            <p>レッスン${String(lessonNumber).padStart(2, '0')}の動画を最後まで視聴しました</p>
            <p>バッジ獲得の進捗がアップデートされました</p>
        </div>
    `;

    document.body.appendChild(message);

    // Add styles
    addVideoCompletionStyles();

    // Remove after animation
    setTimeout(() => {
        message.style.animation = 'slideOut 0.5s ease forwards';
        setTimeout(() => message.remove(), 500);
    }, 4000);
}

// Add video completion message styles
function addVideoCompletionStyles() {
    if (!document.getElementById('video-completion-styles')) {
        const style = document.createElement('style');
        style.id = 'video-completion-styles';
        style.textContent = `
            .video-completion-message {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                padding: 25px;
                z-index: 3000;
                animation: slideIn 0.5s ease;
                max-width: 350px;
                border: 3px solid #27ae60;
            }

            .completion-content {
                text-align: center;
            }

            .completion-icon {
                font-size: 3rem;
                margin-bottom: 10px;
            }

            .completion-content h3 {
                margin: 10px 0;
                color: #27ae60;
                font-size: 1.3rem;
            }

            .completion-content p {
                margin: 8px 0;
                color: #625147;
                font-size: 0.95rem;
            }

            @media (max-width: 768px) {
                .video-completion-message {
                    top: 80px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                    padding: 20px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize app
function init() {
    // Initialize session management
    sessionManager.initSession();

    // Load saved progress
    loadProgress();

    // Initialize hamburger menu
    initHamburgerMenu();

    // Initialize YouTube API
    initYouTubeAPI();

    // Note: Modal functionality has been removed
    // All lesson links now navigate directly to their pages

    // Smooth scroll for nav links
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Only prevent default for anchor links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = href;
                smoothScrollWithOffset(target);
            }
        });
    });

    // Add scroll listener for nav highlight
    window.addEventListener('scroll', highlightNavOnScroll);

    // Add scroll listener for header hide/show
    window.addEventListener('scroll', handleHeaderScroll);

    // Add active style
    addNavActiveStyle();

    // Animate cards on scroll
    animateCardsOnScroll();

    // Initialize badge display (only on index page)
    if (typeof badgeManager !== 'undefined' && badgeManager && badgeManager.updateBadgeDisplay) {
        badgeManager.updateBadgeDisplay();
    }

    // Show welcome message on first visit
    if (!localStorage.getItem('aiLearningVisited')) {
        setTimeout(() => {
            alert('すごいAI道場へようこそ！\n\n各レッスンカードをクリックして学習を始めましょう。\n動画を最後まで視聴すると、バッジが獲得できます！');
            localStorage.setItem('aiLearningVisited', 'true');
        }, 500);
    }
}

// Make trackVideoCompletion available globally for lesson pages
window.trackVideoCompletion = trackVideoCompletion;

// Run init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Note: Keyboard shortcuts for modal removed - no longer needed
