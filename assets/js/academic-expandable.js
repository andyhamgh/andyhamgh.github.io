// 可折叠学术主页交互功能

document.addEventListener('DOMContentLoaded', function() {
    console.log('韩迪副教授学术主页已加载');
    
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
    highlightActiveNav();

    // 可折叠功能
    function setupExpandableButton(buttonId, contentId, buttonTextExpanded, buttonTextCollapsed) {
        const button = document.getElementById(buttonId);
        const content = document.getElementById(contentId);
        const btnText = button.querySelector('.btn-text');
        const icon = button.querySelector('i');
        
        if (!button || !content) return;
        
        button.addEventListener('click', function() {
            const isExpanded = content.classList.contains('expanded');
            
            if (isExpanded) {
                // 收起内容
                content.classList.remove('expanded');
                button.classList.remove('expanded');
                btnText.textContent = buttonTextCollapsed;
                
                // 滚动到按钮位置
                setTimeout(() => {
                    button.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            } else {
                // 展开内容
                content.classList.add('expanded');
                button.classList.add('expanded');
                btnText.textContent = buttonTextExpanded;
                
                // 滚动到内容开始位置
                setTimeout(() => {
                    const firstElement = content.querySelector('h3');
                    if (firstElement) {
                        firstElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            }
        });
    }

    // 设置论文折叠功能
    setupExpandableButton('togglePublications', 'allPublications', '收起论文', '查看全部论文');
    
    // 设置项目折叠功能
    setupExpandableButton('toggleProjects', 'allProjects', '收起项目', '查看更多项目');

    // 照片加载错误处理
    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
        profileImg.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjhGOUZBIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9Ijc1IiByPSIzMCIgZmlsbD0iIzAwN0JGRiIvPgo8L3N2Zz4K';
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

    // 观察需要动画的元素（排除可折叠内容）
    const animatedElements = document.querySelectorAll('.publication, .project, .news-item, .student-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        observer.observe(el);
    });

    // 响应式设计处理
    function handleResponsive() {
        const width = window.innerWidth;
        
        if (width < 768) {
            // 移动端适配
            document.querySelectorAll('.expand-btn').forEach(btn => {
                btn.style.fontSize = '0.9em';
                btn.style.padding = '10px 20px';
            });
        } else {
            // 桌面端样式
            document.querySelectorAll('.expand-btn').forEach(btn => {
                btn.style.fontSize = '1em';
                btn.style.padding = '12px 24px';
            });
        }
    }

    // 初始化响应式
    handleResponsive();
    window.addEventListener('resize', handleResponsive);

    // 错误处理
    window.addEventListener('error', function(e) {
        console.error('页面错误:', e.message);
    });

    // 性能监控
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`页面加载完成，耗时: ${loadTime.toFixed(2)}ms`);
    });

    // 添加键盘支持
    document.addEventListener('keydown', function(e) {
        // ESC键收起所有展开的内容
        if (e.key === 'Escape') {
            document.querySelectorAll('.expandable-content.expanded').forEach(content => {
                content.classList.remove('expanded');
            });
            
            document.querySelectorAll('.expand-btn.expanded').forEach(button => {
                button.classList.remove('expanded');
                const btnText = button.querySelector('.btn-text');
                if (button.id === 'togglePublications') {
                    btnText.textContent = '查看全部论文';
                } else if (button.id === 'toggleProjects') {
                    btnText.textContent = '查看更多项目';
                }
            });
        }
    });

    console.log('可折叠功能已启用');
});