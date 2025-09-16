// Dynamic Product Filter with DOM Manipulation
// Experiment 3: Advanced filtering system with real-time updates

class ProductFilter {
    constructor() {
        this.products = this.initializeProducts();
        this.filteredProducts = [...this.products];
        this.currentFilters = {
            category: 'all',
            price: 'all',
            rating: 'all',
            sort: 'name',
            search: ''
        };
        
        this.initializeElements();
        this.setupEventListeners();
        this.renderProducts();
        this.updateResultsSummary();
    }

    // Comprehensive product dataset
    initializeProducts() {
        return [
            // Electronics
            { id: 1, name: "MacBook Pro 16-inch", category: "electronics", price: 2499, rating: 4.8, description: "Powerful laptop for professionals", image: "💻", dateAdded: "2024-01-15" },
            { id: 2, name: "iPhone 15 Pro", category: "electronics", price: 999, rating: 4.7, description: "Latest smartphone with advanced camera", image: "📱", dateAdded: "2024-01-10" },
            { id: 3, name: "Sony WH-1000XM5", category: "electronics", price: 399, rating: 4.6, description: "Premium noise-canceling headphones", image: "🎧", dateAdded: "2024-01-08" },
            { id: 4, name: "iPad Air", category: "electronics", price: 599, rating: 4.5, description: "Versatile tablet for work and play", image: "📱", dateAdded: "2024-01-05" },
            { id: 5, name: "Apple Watch Series 9", category: "electronics", price: 399, rating: 4.4, description: "Smartwatch with health tracking", image: "⌚", dateAdded: "2024-01-03" },
            { id: 6, name: "Dell XPS 13", category: "electronics", price: 1299, rating: 4.3, description: "Ultrabook with stunning display", image: "💻", dateAdded: "2024-01-01" },
            
            // Clothing
            { id: 7, name: "Nike Air Max 270", category: "clothing", price: 150, rating: 4.5, description: "Comfortable running shoes", image: "👟", dateAdded: "2024-01-12" },
            { id: 8, name: "Levi's 501 Jeans", category: "clothing", price: 89, rating: 4.4, description: "Classic straight-fit jeans", image: "👖", dateAdded: "2024-01-09" },
            { id: 9, name: "Adidas Hoodie", category: "clothing", price: 75, rating: 4.3, description: "Warm and comfortable hoodie", image: "👕", dateAdded: "2024-01-07" },
            { id: 10, name: "Converse Chuck Taylor", category: "clothing", price: 65, rating: 4.6, description: "Timeless canvas sneakers", image: "👟", dateAdded: "2024-01-04" },
            { id: 11, name: "Zara Blazer", category: "clothing", price: 120, rating: 4.2, description: "Elegant business blazer", image: "👔", dateAdded: "2024-01-02" },
            
            // Books
            { id: 12, name: "The Great Gatsby", category: "books", price: 12, rating: 4.7, description: "Classic American novel", image: "📚", dateAdded: "2024-01-14" },
            { id: 13, name: "JavaScript: The Good Parts", category: "books", price: 35, rating: 4.8, description: "Essential guide to JavaScript", image: "📖", dateAdded: "2024-01-11" },
            { id: 14, name: "Atomic Habits", category: "books", price: 18, rating: 4.6, description: "Build good habits and break bad ones", image: "📘", dateAdded: "2024-01-06" },
            { id: 15, name: "1984", category: "books", price: 14, rating: 4.9, description: "Dystopian masterpiece", image: "📕", dateAdded: "2024-01-13" },
            
            // Home & Garden
            { id: 16, name: "Philips Hue Smart Bulbs", category: "home", price: 199, rating: 4.4, description: "Smart lighting system", image: "💡", dateAdded: "2024-01-16" },
            { id: 17, name: "Dyson V15 Vacuum", category: "home", price: 749, rating: 4.5, description: "Powerful cordless vacuum", image: "🧹", dateAdded: "2024-01-17" },
            { id: 18, name: "KitchenAid Mixer", category: "home", price: 399, rating: 4.7, description: "Professional stand mixer", image: "🥄", dateAdded: "2024-01-18" },
            { id: 19, name: "IKEA Kallax Shelf", category: "home", price: 89, rating: 4.2, description: "Versatile storage solution", image: "📦", dateAdded: "2024-01-19" },
            
            // Sports
            { id: 20, name: "Peloton Bike", category: "sports", price: 1495, rating: 4.3, description: "Interactive fitness bike", image: "🚴", dateAdded: "2024-01-20" },
            { id: 21, name: "Yoga Mat Pro", category: "sports", price: 45, rating: 4.6, description: "Premium yoga mat", image: "🧘", dateAdded: "2024-01-21" },
            { id: 22, name: "Dumbbell Set", category: "sports", price: 129, rating: 4.4, description: "Adjustable weight set", image: "🏋️", dateAdded: "2024-01-22" },
            
            // Beauty
            { id: 23, name: "SK-II Facial Treatment", category: "beauty", price: 299, rating: 4.5, description: "Luxury skincare essence", image: "🧴", dateAdded: "2024-01-23" },
            { id: 24, name: "Dyson Hair Dryer", category: "beauty", price: 399, rating: 4.6, description: "Professional hair dryer", image: "💨", dateAdded: "2024-01-24" },
            { id: 25, name: "Chanel No. 5", category: "beauty", price: 150, rating: 4.7, description: "Iconic luxury perfume", image: "🌸", dateAdded: "2024-01-25" }
        ];
    }

    initializeElements() {
        this.elements = {
            categoryFilter: document.getElementById('category-filter'),
            priceFilter: document.getElementById('price-filter'),
            ratingFilter: document.getElementById('rating-filter'),
            sortFilter: document.getElementById('sort-filter'),
            searchInput: document.getElementById('search-input'),
            clearFiltersBtn: document.getElementById('clear-filters'),
            resetFiltersBtn: document.getElementById('reset-filters'),
            productsContainer: document.getElementById('products-container'),
            resultsCount: document.getElementById('results-count'),
            activeFilters: document.getElementById('active-filters'),
            loading: document.getElementById('loading'),
            noResults: document.getElementById('no-results')
        };
    }

    setupEventListeners() {
        // Filter change events
        this.elements.categoryFilter.addEventListener('change', (e) => {
            this.currentFilters.category = e.target.value;
            this.applyFilters();
        });

        this.elements.priceFilter.addEventListener('change', (e) => {
            this.currentFilters.price = e.target.value;
            this.applyFilters();
        });

        this.elements.ratingFilter.addEventListener('change', (e) => {
            this.currentFilters.rating = e.target.value;
            this.applyFilters();
        });

        this.elements.sortFilter.addEventListener('change', (e) => {
            this.currentFilters.sort = e.target.value;
            this.applyFilters();
        });

        // Search input with debouncing
        let searchTimeout;
        this.elements.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.applyFilters();
            }, 300);
        });

        // Clear and reset buttons
        this.elements.clearFiltersBtn.addEventListener('click', () => {
            this.clearAllFilters();
        });

        this.elements.resetFiltersBtn.addEventListener('click', () => {
            this.clearAllFilters();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'k') {
                e.preventDefault();
                this.elements.searchInput.focus();
            }
        });
    }

    applyFilters() {
        this.showLoading();
        
        // Simulate API delay for better UX
        setTimeout(() => {
            this.filteredProducts = this.products.filter(product => {
                return this.matchesFilters(product);
            });

            this.sortProducts();
            this.renderProducts();
            this.updateResultsSummary();
            this.hideLoading();
        }, 500);
    }

    matchesFilters(product) {
        // Category filter
        if (this.currentFilters.category !== 'all' && 
            product.category !== this.currentFilters.category) {
            return false;
        }

        // Price filter
        if (this.currentFilters.price !== 'all') {
            const price = product.price;
            switch (this.currentFilters.price) {
                case '0-50':
                    if (price > 50) return false;
                    break;
                case '50-100':
                    if (price < 50 || price > 100) return false;
                    break;
                case '100-500':
                    if (price < 100 || price > 500) return false;
                    break;
                case '500+':
                    if (price < 500) return false;
                    break;
            }
        }

        // Rating filter
        if (this.currentFilters.rating !== 'all') {
            const minRating = parseFloat(this.currentFilters.rating);
            if (product.rating < minRating) return false;
        }

        // Search filter
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search;
            const searchableText = `${product.name} ${product.description} ${product.category}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) return false;
        }

        return true;
    }

    sortProducts() {
        this.filteredProducts.sort((a, b) => {
            switch (this.currentFilters.sort) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'newest':
                    return new Date(b.dateAdded) - new Date(a.dateAdded);
                default:
                    return 0;
            }
        });
    }

    renderProducts() {
        const container = this.elements.productsContainer;
        
        if (this.filteredProducts.length === 0) {
            this.showNoResults();
            return;
        }

        this.hideNoResults();

        // Create product cards HTML
        const productsHTML = this.filteredProducts.map(product => 
            this.createProductCard(product)
        ).join('');

        // Update DOM with animation
        container.innerHTML = productsHTML;
        
        // Add fade-in animation to each card
        const cards = container.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });

        // Add click handlers for product actions
        this.addProductEventListeners();
    }

    createProductCard(product) {
        const stars = this.generateStars(product.rating);
        const formattedPrice = this.formatPrice(product.price);
        
        return `
            <div class="product-card fade-in" data-category="${product.category}" data-id="${product.id}">
                <div class="product-image">
                    ${product.image}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <span class="product-category">${product.category}</span>
                    <div class="product-price">${formattedPrice}</div>
                    <div class="product-rating">
                        <div class="stars">${stars}</div>
                        <span class="rating-text">${product.rating}/5</span>
                    </div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-actions">
                        <button class="btn btn-primary" data-action="add-to-cart" data-id="${product.id}">
                            Add to Cart
                        </button>
                        <button class="btn btn-secondary" data-action="view-details" data-id="${product.id}">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '<span class="star">★</span>';
        }
        
        // Half star
        if (hasHalfStar) {
            stars += '<span class="star">☆</span>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars += '<span class="star">☆</span>';
        }
        
        return stars;
    }

    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }

    addProductEventListeners() {
        const buttons = this.elements.productsContainer.querySelectorAll('[data-action]');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                const productId = parseInt(e.target.dataset.id);
                const product = this.products.find(p => p.id === productId);
                
                this.handleProductAction(action, product, e.target);
            });
        });
    }

    handleProductAction(action, product, button) {
        switch (action) {
            case 'add-to-cart':
                this.addToCart(product, button);
                break;
            case 'view-details':
                this.viewDetails(product);
                break;
        }
    }

    addToCart(product, button) {
        // Visual feedback
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.style.background = '#4caf50';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);

        // Show notification
        this.showNotification(`${product.name} added to cart!`, 'success');
    }

    viewDetails(product) {
        this.showNotification(`Viewing details for ${product.name}`, 'info');
    }

    updateResultsSummary() {
        const count = this.filteredProducts.length;
        const total = this.products.length;
        
        this.elements.resultsCount.textContent = 
            `Showing ${count} of ${total} products`;
        
        this.updateActiveFilters();
    }

    updateActiveFilters() {
        const activeFilters = [];
        
        if (this.currentFilters.category !== 'all') {
            activeFilters.push(`Category: ${this.currentFilters.category}`);
        }
        
        if (this.currentFilters.price !== 'all') {
            activeFilters.push(`Price: ${this.currentFilters.price}`);
        }
        
        if (this.currentFilters.rating !== 'all') {
            activeFilters.push(`Rating: ${this.currentFilters.rating}+ stars`);
        }
        
        if (this.currentFilters.search) {
            activeFilters.push(`Search: "${this.currentFilters.search}"`);
        }
        
        if (activeFilters.length > 0) {
            this.elements.activeFilters.innerHTML = 
                activeFilters.map(filter => 
                    `<span class="filter-tag">${filter}</span>`
                ).join('');
        } else {
            this.elements.activeFilters.innerHTML = '';
        }
    }

    clearAllFilters() {
        this.currentFilters = {
            category: 'all',
            price: 'all',
            rating: 'all',
            sort: 'name',
            search: ''
        };
        
        // Reset form elements
        this.elements.categoryFilter.value = 'all';
        this.elements.priceFilter.value = 'all';
        this.elements.ratingFilter.value = 'all';
        this.elements.sortFilter.value = 'name';
        this.elements.searchInput.value = '';
        
        this.applyFilters();
        this.showNotification('All filters cleared!', 'info');
    }

    showLoading() {
        this.elements.loading.classList.remove('hidden');
        this.elements.productsContainer.style.opacity = '0.5';
    }

    hideLoading() {
        this.elements.loading.classList.add('hidden');
        this.elements.productsContainer.style.opacity = '1';
    }

    showNoResults() {
        this.elements.noResults.classList.remove('hidden');
        this.elements.productsContainer.innerHTML = '';
    }

    hideNoResults() {
        this.elements.noResults.classList.add('hidden');
    }

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
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Set background color based on type
        const colors = {
            info: '#2196f3',
            success: '#4caf50',
            warning: '#ff9800',
            error: '#f44336'
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
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the product filter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const productFilter = new ProductFilter();
    
    // Add some demo interactions
    console.log('Product Filter initialized with', productFilter.products.length, 'products');
    
    // Show welcome message
    setTimeout(() => {
        productFilter.showNotification('Welcome! Use filters to explore products. Try Ctrl+K to focus search.', 'info');
    }, 1000);
});

// Add some utility functions for demonstration
window.ProductFilterUtils = {
    // Function to add a new product (for demo purposes)
    addProduct: function(name, category, price, rating, description, image) {
        const products = window.productFilter?.products || [];
        const newProduct = {
            id: Math.max(...products.map(p => p.id)) + 1,
            name,
            category,
            price,
            rating,
            description,
            image,
            dateAdded: new Date().toISOString().split('T')[0]
        };
        
        if (window.productFilter) {
            window.productFilter.products.push(newProduct);
            window.productFilter.applyFilters();
            window.productFilter.showNotification(`Added new product: ${name}`, 'success');
        }
    },
    
    // Function to get current filter state
    getCurrentFilters: function() {
        return window.productFilter?.currentFilters || {};
    },
    
    // Function to get filtered products
    getFilteredProducts: function() {
        return window.productFilter?.filteredProducts || [];
    }
};

// Make productFilter globally accessible for demo purposes
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.productFilter = new ProductFilter();
    }, 100);
});
