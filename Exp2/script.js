// Admin Dashboard JavaScript Functionality

class AdminDashboard {
    constructor() {
        this.dashboard = document.querySelector('.dashboard');
        this.themeToggle = document.getElementById('theme-toggle');
        this.sidebarToggle = document.getElementById('sidebar-toggle');
        this.sidebar = document.querySelector('.sidebar');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupSidebarToggle();
        this.setupNavigation();
        this.loadSavedTheme();
        this.setupResponsiveBehavior();
        this.animateStats();
    }

    // Theme Toggle Functionality
    setupThemeToggle() {
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    toggleTheme() {
        const currentTheme = this.dashboard.dataset.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        this.dashboard.dataset.theme = newTheme;
        this.updateThemeButton(newTheme);
        this.saveTheme(newTheme);
        
        // Add a subtle animation effect
        this.dashboard.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.dashboard.style.transform = 'scale(1)';
        }, 150);
    }

    updateThemeButton(theme) {
        const themeIcon = this.themeToggle.querySelector('.theme-icon');
        const themeText = this.themeToggle.querySelector('.theme-text');
        
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Light Mode';
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Dark Mode';
        }
    }

    saveTheme(theme) {
        localStorage.setItem('admin-dashboard-theme', theme);
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('admin-dashboard-theme');
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        
        // Use saved theme, or fall back to system preference
        const theme = savedTheme || systemPreference;
        
        this.dashboard.dataset.theme = theme;
        this.updateThemeButton(theme);
    }

    // Sidebar Toggle for Mobile
    setupSidebarToggle() {
        this.sidebarToggle.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!this.sidebar.contains(e.target) && !this.sidebarToggle.contains(e.target)) {
                    this.sidebar.classList.remove('open');
                }
            }
        });
    }

    toggleSidebar() {
        this.sidebar.classList.toggle('open');
    }

    // Navigation Functionality
    setupNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all links
                this.navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                link.classList.add('active');
                
                // Close sidebar on mobile after navigation
                if (window.innerWidth <= 768) {
                    this.sidebar.classList.remove('open');
                }
                
                // Simulate page navigation
                this.simulateNavigation(link.textContent.trim());
            });
        });
    }

    simulateNavigation(pageName) {
        const contentHeader = document.querySelector('.content-header h1');
        const originalTitle = contentHeader.textContent;
        
        // Add loading effect
        contentHeader.style.opacity = '0.5';
        contentHeader.textContent = `Loading ${pageName}...`;
        
        setTimeout(() => {
            contentHeader.textContent = pageName;
            contentHeader.style.opacity = '1';
        }, 500);
    }

    // Responsive Behavior
    setupResponsiveBehavior() {
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.sidebar.classList.remove('open');
            }
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only update if no theme is saved in localStorage
            if (!localStorage.getItem('admin-dashboard-theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                this.dashboard.dataset.theme = newTheme;
                this.updateThemeButton(newTheme);
            }
        });
    }

    // Animate Statistics Cards
    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateNumber(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        statNumbers.forEach(stat => {
            observer.observe(stat);
        });
    }

    animateNumber(element) {
        const finalValue = element.textContent;
        const isPercentage = finalValue.includes('%');
        const isCurrency = finalValue.includes('$');
        const isComma = finalValue.includes(',');
        
        let numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
        let currentValue = 0;
        const increment = numericValue / 50;
        const duration = 1000;
        const stepTime = duration / 50;

        const timer = setInterval(() => {
            currentValue += increment;
            
            if (currentValue >= numericValue) {
                currentValue = numericValue;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(currentValue);
            
            if (isComma && displayValue >= 1000) {
                displayValue = displayValue.toLocaleString();
            }
            
            if (isCurrency) {
                element.textContent = `$${displayValue}`;
            } else if (isPercentage) {
                element.textContent = `${displayValue}%`;
            } else {
                element.textContent = displayValue;
            }
        }, stepTime);
    }

    // Utility Methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            info: '#007bff',
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Simulate real-time data updates
    startDataSimulation() {
        setInterval(() => {
            this.updateRandomStat();
        }, 10000); // Update every 10 seconds
    }

    updateRandomStat() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const randomStat = statNumbers[Math.floor(Math.random() * statNumbers.length)];
        const currentValue = parseInt(randomStat.textContent.replace(/[^0-9]/g, ''));
        const change = Math.floor(Math.random() * 10) - 5; // Random change between -5 and +5
        const newValue = Math.max(0, currentValue + change);
        
        // Animate the change
        randomStat.style.color = change > 0 ? 'var(--success-color)' : 'var(--danger-color)';
        randomStat.textContent = randomStat.textContent.replace(/[0-9,]+/, newValue.toLocaleString());
        
        setTimeout(() => {
            randomStat.style.color = '';
        }, 2000);
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new AdminDashboard();
    
    // Start data simulation for demo purposes
    dashboard.startDataSimulation();
    
    // Show welcome notification
    setTimeout(() => {
        dashboard.showNotification('Welcome to the Admin Dashboard!', 'success');
    }, 1000);
});

// Add some interactive chart animations
document.addEventListener('DOMContentLoaded', () => {
    const bars = document.querySelectorAll('.bar');
    const pieChart = document.querySelector('.pie-chart');
    
    // Animate bars on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                bars.forEach((bar, index) => {
                    setTimeout(() => {
                        bar.style.transform = 'scaleY(1)';
                        bar.style.opacity = '1';
                    }, index * 100);
                });
            }
        });
    });

    const chartContainer = document.querySelector('.chart-bars');
    if (chartContainer) {
        observer.observe(chartContainer);
    }

    // Animate pie chart
    if (pieChart) {
        const pieObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    pieChart.style.transform = 'rotate(360deg)';
                    pieChart.style.transition = 'transform 2s ease';
                }
            });
        });
        pieObserver.observe(pieChart);
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + D to toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        document.getElementById('theme-toggle').click();
    }
    
    // Escape to close sidebar on mobile
    if (e.key === 'Escape' && window.innerWidth <= 768) {
        document.querySelector('.sidebar').classList.remove('open');
    }
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Dashboard loaded in ${loadTime}ms`);
        }, 0);
    });
}
