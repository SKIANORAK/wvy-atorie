// product_atorie.js - СТРАНИЦА ТОВАРА

// Данные товаров с несколькими фото и видео
const products = [
    {
        id: 1,
        name: "BasedGod Hoodie",
        price: 3500,
        images: [
            "images/photo_2025-09-18_00-15-44.jpg",
            "images/photo_2025-10-01_23-25-32 (2).jpg",
            "images/photo_2025-10-01_23-25-32.jpg"
        ],
        videos: [
            {
                src: "videos/hoodie-video1.mp4",
                caption: "BasedGod Hoodie в движении"
            },
            {
                src: "videos/hoodie-video2.mp4", 
                caption: "Детали и качество пошива"
            }
        ],
        description: "Черное худи премиального качества с уникальным принтом.",
        features: ["100% хлопок", "Усиленные швы", "Свободный крой"]
    },
    {
        id: 2, 
        name: "WHITE T-SHIRT", 
        price: 1500,
        images: [
            "images/tshirt1.jpg",
            "images/tshirt2.jpg",
            "images/tshirt3.jpg"
        ],
        videos: [
            {
                src: "videos/tshirt-video1.mp4",
                caption: "Белая футболка - обзор"
            }
        ],
        description: "Белая футболка классического кроя.",
        features: ["100% хлопок", "Прямой крой"]
    },
    {
        id: 3,
        name: "CREW NECK",
        price: 2200,
        images: [
            "images/crew1.jpg",
            "images/crew2.jpg",
            "images/crew3.jpg"
        ],
        videos: [
            {
                src: "videos/crew-video1.mp4",
                caption: "Свитшот в повседневном стиле"
            }
        ],
        description: "Свитшот с круглой горловиной.",
        features: ["Хлопок 80%, полиэстер 20%", "Французский трикотаж"]
    }
];

let currentProduct = null;
let currentImageIndex = 0;

// Загрузка данных товара
function loadProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    currentProduct = products.find(p => p.id === productId);
    
    if (!currentProduct) {
        document.body.innerHTML = '<div style="padding:50px;text-align:center;color:white;">Товар не найден</div>';
        return;
    }
    
    // Заполняем страницу данными
    document.getElementById('product-title').textContent = currentProduct.name;
    document.getElementById('product-price').textContent = currentProduct.price + ' ₽';
    document.getElementById('product-description').textContent = currentProduct.description;
    
    // Инициализируем галерею
    initGallery();
    
    // Загружаем видео
    loadVideos();
    
    // Заполняем характеристики
    const featuresList = document.getElementById('product-features');
    featuresList.innerHTML = '';
    currentProduct.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });
    
    document.title = currentProduct.name + ' - wвы atorie';
}

// Инициализация галереи
function initGallery() {
    if (!currentProduct.images || currentProduct.images.length === 0) return;
    
    // Показываем первую картинку
    showImage(0);
    
    // Создаем миниатюры
    createThumbnails();
}

// Показать изображение по индексу
function showImage(index) {
    if (!currentProduct.images[index]) return;
    
    const productImage = document.getElementById('product-image');
    productImage.src = currentProduct.images[index];
    productImage.alt = currentProduct.name + ' - фото ' + (index + 1);
    
    currentImageIndex = index;
    
    // Обновляем активную миниатюру
    updateActiveThumbnail();
}

// Смена изображения
function changeImage(direction) {
    const newIndex = currentImageIndex + direction;
    
    if (newIndex >= 0 && newIndex < currentProduct.images.length) {
        showImage(newIndex);
    } else if (newIndex < 0) {
        showImage(currentProduct.images.length - 1); // Последняя картинка
    } else {
        showImage(0); // Первая картинка
    }
}

// Создание миниатюр
function createThumbnails() {
    const thumbnailsContainer = document.getElementById('thumbnails');
    thumbnailsContainer.innerHTML = '';
    
    currentProduct.images.forEach((image, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = image;
        thumbnail.alt = 'Миниатюра ' + (index + 1);
        thumbnail.className = 'thumbnail';
        if (index === 0) thumbnail.classList.add('active');
        
        thumbnail.addEventListener('click', () => showImage(index));
        thumbnailsContainer.appendChild(thumbnail);
    });
}

// Обновление активной миниатюры
function updateActiveThumbnail() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentImageIndex);
    });
}

// Загрузка видео
function loadVideos() {
    const videoContainer = document.getElementById('video-container');
    
    if (!currentProduct.videos || currentProduct.videos.length === 0) {
        videoContainer.innerHTML = '<p style="text-align:center;color:#666;">Видео скоро появятся</p>';
        return;
    }
    
    videoContainer.innerHTML = '';
    
    currentProduct.videos.forEach(video => {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        
        videoItem.innerHTML = `
            <video controls muted>
                <source src="${video.src}" type="video/mp4">
                Ваш браузер не поддерживает видео.
            </video>
            <div class="video-caption">${video.caption}</div>
        `;
        
        videoContainer.appendChild(videoItem);
    });
}

// Остальные функции остаются без изменений
function addToCart(productId, size = 'M') {
    const product = products.find(p => p.id === productId);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.id === productId && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0], // Берем первую картинку
            quantity: 1,
            size: size
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Товар "' + product.name + '" добавлен в корзину!');
    updateCartCounter();
}

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartCounter = document.getElementById('cart-count');
    if (cartCounter) {
        cartCounter.textContent = totalItems;
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    loadProduct();
    updateCartCounter();
    
    const addToCartBtn = document.getElementById('add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const selectedSize = document.getElementById('size-select').value;
            const urlParams = new URLSearchParams(window.location.search);
            const productId = parseInt(urlParams.get('id'));
            addToCart(productId, selectedSize);
        });
    }
});