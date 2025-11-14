// 学术风格个人主页交互功能

document.addEventListener('DOMContentLoaded', function() {
    // 导航栏平滑滚动
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // 考虑固定导航栏高度
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

    // 侧边栏粘性定位优化
    const sidebar = document.querySelector('.sidebar');
    const profile = document.querySelector('.profile');
    
    if (profile) {
        let sidebarTop = sidebar.offsetTop;
        let sidebarHeight = profile.offsetHeight;
        
        function handleSidebarScroll() {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // 侧边栏滚动逻辑
            if (scrollTop > sidebarTop - 100) {
                if (scrollTop + windowHeight < documentHeight - 100) {
                    profile.style.position = 'fixed';
                    profile.style.top = '100px';
                    profile.style.width = '300px';
                } else {
                    // 到达底部时停止固定
                    profile.style.position = 'absolute';
                    profile.style.top = 'auto';
                    profile.style.bottom = '0';
                }
            } else {
                profile.style.position = 'static';
                profile.style.width = 'auto';
            }
        }
        
        // 防抖处理
        let scrollTimer;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimer);
            scrollTimer = setTimeout(handleSidebarScroll, 10);
        });
        
        // 窗口大小改变时重新计算
        window.addEventListener('resize', function() {
            sidebarTop = sidebar.offsetTop;
            sidebarHeight = profile.offsetHeight;
        });
    }

    // 滚动动画
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

    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.publication, .project, .news-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // 搜索功能（可选）
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '搜索论文或项目...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        width: 100%;
        padding: 12px;
        margin-bottom: 20px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 16px;
        display: none;
    `;

    // 添加搜索框到论文部分
    const publicationsSection = document.getElementById('publications');
    if (publicationsSection) {
        const sectionTitle = publicationsSection.querySelector('.section-title');
        if (sectionTitle) {
            sectionTitle.after(searchInput);
            
            // 添加搜索按钮
            const searchBtn = document.createElement('button');
            searchBtn.textContent = '搜索';
            searchBtn.className = 'search-btn';
            searchBtn.style.cssText = `
                padding: 12px 20px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin-left: 10px;
                display: none;
            `;
            
            searchInput.after(searchBtn);
            
            // 搜索功能实现
            function performSearch() {
                const searchTerm = searchInput.value.toLowerCase();
                const publications = publicationsSection.querySelectorAll('.publication');
                let hasResults = false;
                
                publications.forEach(pub => {
                    const text = pub.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        pub.style.display = 'block';
                        hasResults = true;
                    } else {
                        pub.style.display = 'none';
                    }
                });
                
                // 显示无结果提示
                let noResults = publicationsSection.querySelector('.no-results');
                if (!hasResults && !noResults) {
                    noResults = document.createElement('p');
                    noResults.className = 'no-results';
                    noResults.textContent = '未找到匹配的论文';
                    noResults.style.cssText = 'text-align: center; color: #666; font-style: italic;';
                    publicationsSection.querySelector('.view-more').before(noResults);
                } else if (hasResults && noResults) {
                    noResults.remove();
                }
            }
            
            searchBtn.addEventListener('click', performSearch);
            searchInput.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });
        }
    }

    // 复制引用功能
    function addCopyButtons() {
        const publications = document.querySelectorAll('.publication');
        
        publications.forEach(pub => {
            const copyBtn = document.createElement('button');
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> 引用';
            copyBtn.className = 'copy-btn';
            copyBtn.style.cssText = `
                padding: 0.5em 1em;
                background: #6c757d;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9em;
                margin-left: 10px;
            `;
            
            const pubLinks = pub.querySelector('.pub-links');
            if (pubLinks) {
                pubLinks.appendChild(copyBtn);
                
                copyBtn.addEventListener('click', function() {
                    const title = pub.querySelector('.pub-title').textContent;
                    const authors = pub.querySelector('.pub-authors').textContent;
                    const venue = pub.querySelector('.pub-venue').textContent;
                    
                    const citation = `${title}. ${authors}. ${venue}.`;
                    
                    navigator.clipboard.writeText(citation).then(() => {
                        const originalText = copyBtn.innerHTML;
                        copyBtn.innerHTML = '<i class="fas fa-check"></i> 已复制';
                        copyBtn.style.background = '#28a745';
                        
                        setTimeout(() => {
                            copyBtn.innerHTML = originalText;
                            copyBtn.style.background = '#6c757d';
                        }, 2000);
                    }).catch(err => {
                        console.error('复制失败:', err);
                    });
                });
            }
        });
    }
    
    addCopyButtons();

    // 打印友好功能
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '<i class="fas fa-print"></i> 打印页面';
    printBtn.className = 'print-btn';
    printBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 16px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(printBtn);
    
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    printBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    });
    
    printBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    });

    // 主题切换（深色模式）
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.className = 'theme-toggle';
    themeToggle.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: #333;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(themeToggle);
    
    // 检查本地存储的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        if (isDark) {
            this.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            this.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    });

    // 深色模式样式
    const darkThemeStyles = document.createElement('style');
    darkThemeStyles.textContent = `
        body.dark-theme {
            background-color: #1a1a1a;
            color: #e0e0e0;
        }
        
        body.dark-theme .site-header {
            background-color: #2d2d2d;
            border-bottom-color: #444;
        }
        
        body.dark-theme .site-title,
        body.dark-theme .section-title,
        body.dark-theme .profile h1,
        body.dark-theme .pub-title,
        body.dark-theme .project-title {
            color: #ffffff;
        }
        
        body.dark-theme .publication,
        body.dark-theme .project {
            background-color: #2d2d2d;
            border-color: #444;
        }
        
        body.dark-theme .news-item,
        body.dark-theme .student-item,
        body.dark-theme .cv-content {
            background-color: #2d2d2d;
        }
        
        body.dark-theme .sidebar {
            background-color: #2d2d2d;
        }
        
        body.dark-theme .site-footer {
            background-color: #2d2d2d;
            border-top-color: #444;
        }
        
        @media (max-width: 768px) {
            .theme-toggle {
                top: 20px;
                right: 20px;
            }
        }
    `;
    document.head.appendChild(darkThemeStyles);

    // 错误处理
    window.addEventListener('error', function(e) {
        console.error('页面错误:', e.error);
    });

    // 性能监控
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`页面加载完成，耗时: ${loadTime.toFixed(2)}ms`);
        
        // 显示加载完成提示
        const notification = document.createElement('div');
        notification.textContent = '页面加载完成';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #28a745;
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: fadeInOut 3s ease;
        `;
        
        const fadeOutStyle = document.createElement('style');
        fadeOutStyle.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                20% { opacity: 1; transform: translateX(-50%) translateY(0); }
                80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
        `;
        document.head.appendChild(fadeOutStyle);
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
            fadeOutStyle.remove();
        }, 3000);
    });

    console.log('韩迪教授学术主页已加载完成！');
});