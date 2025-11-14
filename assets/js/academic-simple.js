// 简化版学术主页交互功能

document.addEventListener('DOMContentLoaded', function() {
    console.log('韩迪教授学术主页已加载');
    
    // 导航栏平滑滚动
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 导航高亮
    const sections = document.querySelectorAll('section[id]');
    const navLinksArray = Array.from(navLinks);
    
    function highlightActiveNav() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinksArray.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveNav);
    
    // 初始化导航高亮
    highlightActiveNav();

    // 照片加载错误处理
    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
        profileImg.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjhGOUZBIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9Ijc1IiByPSIzMCIgZmlsbD0iIzAwN0JGRiIvPgo8ZWxsaXBzZSBjeD0iMTAwIiBjeT0iMTQwIiByeD0iNTAiIHJ5PSIzMCIgZmlsbD0iIzAwN0JGRiIvPgo8L3N2Zz4K';
            this.alt = '默认头像';
        });
    }

    // 简单的滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 观察需要动画的元素（简化版）
    const animatedElements = document.querySelectorAll('.publication, .project, .news-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        observer.observe(el);
    });

    // 错误处理
    window.addEventListener('error', function(e) {
        console.error('页面错误:', e.message);
    });

    // 论文展示切换功能
    const toggleBtn = document.getElementById('toggle-publications');
    const additionalPubs = document.getElementById('additional-publications');
    let isExpanded = false;

    if (toggleBtn && additionalPubs) {
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();

            if (isExpanded) {
                // 收起
                additionalPubs.style.display = 'none';
                this.innerHTML = '查看全部论文 <i class="fas fa-arrow-right"></i>';
                isExpanded = false;
            } else {
                // 展开
                additionalPubs.style.display = 'block';
                this.innerHTML = '收起论文列表 <i class="fas fa-arrow-up"></i>';
                isExpanded = true;

                // 滚动到展开内容
                setTimeout(() => {
                    additionalPubs.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    }

    // 性能监控（简化版）
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`页面加载完成，耗时: ${loadTime.toFixed(2)}ms`);
    });

});