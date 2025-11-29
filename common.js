// ========================================
// すごいAI道場 - 共通JavaScript
// 全ページで使用される共通機能
// ========================================

// ========================================
// ヘッダー注入機能
// ========================================
function loadHeader() {
    const headerContainer = document.getElementById('site-header');
    if (headerContainer) {
        // ページの階層に応じてパスを調整
        const pathDepth = window.location.pathname.split('/').filter(p => p && p !== 'index.html').length;
        const basePath = pathDepth > 1 ? '../' : './';

        // ヘッダーHTMLを直接生成（fetch不要）
        const headerHTML = `
            <nav class="main-nav">
                <div class="container nav-container">
                    <div class="nav-logo">すごいAI道場</div>
                    <button class="hamburger" id="hamburger" aria-label="メニュー">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <ul class="nav-menu" id="navMenu">
                        <li><a href="${basePath}index.html#ai-general" class="nav-ai">AI全般</a></li>
                        <li><a href="${basePath}index.html#startup" class="nav-startup">起業・ビジコン</a></li>
                        <li><a href="${basePath}index.html#creative" class="nav-creative">クリエイティブ</a></li>
                        <li><a href="${basePath}index.html#community" class="nav-community">コミュニティ</a></li>
                        <li><a href="${basePath}mypage.html" class="nav-mypage">マイページ</a></li>
                    </ul>
                </div>
            </nav>
        `;

        headerContainer.innerHTML = headerHTML;

        // ハンバーガーメニューを初期化
        initHamburgerMenu();
    }
}

// ========================================
// ハンバーガーメニュー機能
// ========================================
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (!hamburger || !navMenu) {
        console.log('Hamburger or navMenu not found');
        return;
    }

    // イベントリスナーが既に登録されているか確認
    if (hamburger.dataset.initialized === 'true') {
        return;
    }

    // ハンバーガーボタンのクリックイベント
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation(); // イベントのバブリングを停止
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
        // ハンバーガーメニューがアクティブな時のみチェック
        if (navMenu.classList.contains('active')) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // 初期化済みフラグを設定
    hamburger.dataset.initialized = 'true';
}

// ========================================
// ヘッダーのスクロール表示/非表示
// ========================================
let lastScrollTop = 0;
let scrollTimeout;

function handleHeaderScroll() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;

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

// ========================================
// YouTube API初期化
// ========================================
function initYouTubeAPI() {
    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
}

// ========================================
// ビデオ完了追跡機能（レッスンページ用）
// ========================================
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

            // マイページ用のストレージにも保存（バッジシステム対応）
            this.saveToLessonsStorage(lessonNumber);

            return true;
        }
        return false;
    }

    // マイページのバッジシステム用にaiLearningCompletedLessonsにも保存
    saveToLessonsStorage(lessonNumber) {
        const saved = localStorage.getItem('aiLearningCompletedLessons');
        const completedLessons = saved ? JSON.parse(saved) : [];

        if (!completedLessons.includes(lessonNumber)) {
            completedLessons.push(lessonNumber);
            localStorage.setItem('aiLearningCompletedLessons', JSON.stringify(completedLessons));
        }
    }

    isVideoCompleted(lessonNumber) {
        return this.completedVideos.includes(lessonNumber);
    }
}

const videoCompletionTracker = new VideoCompletionTracker();

// グローバルに公開（レッスンページから呼ばれる）
function trackVideoCompletion(lessonNumber) {
    const wasNewCompletion = videoCompletionTracker.markVideoComplete(lessonNumber);

    if (wasNewCompletion) {
        showVideoCompletionMessage(lessonNumber);
    }
}

// ビデオ完了メッセージを表示
function showVideoCompletionMessage(lessonNumber) {
    const message = document.createElement('div');
    message.className = 'video-completion-message';
    message.innerHTML = `
        <div class="completion-content">
            <div class="completion-icon">🎉</div>
            <h3>動画視聴完了！</h3>
            <p>レッスン${String(lessonNumber).padStart(2, '0')}の動画を最後まで視聴しました</p>
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

// ビデオ完了メッセージのスタイルを追加
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

// グローバルに公開
window.trackVideoCompletion = trackVideoCompletion;

// ========================================
// 初期化
// ========================================
function initCommon() {
    // ヘッダーを注入
    loadHeader();

    // YouTube APIを初期化
    initYouTubeAPI();

    // スクロールリスナーを追加
    window.addEventListener('scroll', handleHeaderScroll);
}

// DOMの準備ができたら初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommon);
} else {
    initCommon();
}
