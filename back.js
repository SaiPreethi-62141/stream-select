document.addEventListener('DOMContentLoaded', function() {
  
  const cardsContainer = document.getElementById('cards');
  const loadingSpinner = document.getElementById('loading');
  const categorySelect = document.getElementById('categorySelect');
  const priceRange = document.getElementById('priceRange');
  const priceValue = document.getElementById('priceValue');
  const searchInput = document.getElementById('searchInput');
  const sortPriceBtn = document.getElementById('sortPrice');
  const sortNameBtn = document.getElementById('sortName');
  const themeToggle = document.getElementById('themeToggle');
  const cartButton = document.getElementById('cartButton');
  const cartModal = document.getElementById('cartModal');
  const closeCart = document.getElementById('closeCart');
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cartCount = document.getElementById('cartCount');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  const closeToast = document.getElementById('closeToast');

  
  let subscriptions = [];
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let currentSort = 'default';
  let darkMode = localStorage.getItem('darkMode') === 'true';


  initTheme();
  updateCartCount();
  fetchSubscriptions();

  categorySelect.addEventListener('change', filterSubscriptions);
  priceRange.addEventListener('input', function() {
    priceValue.textContent = this.value;
    filterSubscriptions();
  });
  searchInput.addEventListener('input', filterSubscriptions);
  sortPriceBtn.addEventListener('click', () => sortSubscriptions('price'));
  sortNameBtn.addEventListener('click', () => sortSubscriptions('name'));
  themeToggle.addEventListener('click', toggleTheme);
  cartButton.addEventListener('click', openCart);
  closeCart.addEventListener('click', closeCartModal);
  checkoutBtn.addEventListener('click', checkout);
  closeToast.addEventListener('click', hideToast);


  cartModal.addEventListener('click', function(e) {
    if (e.target === cartModal) {
      closeCartModal();
    }
  });


  function fetchSubscriptions() {
    loadingSpinner.style.display = 'block';
    cardsContainer.innerHTML = '';
    
    
    setTimeout(() => {
      subscriptions = [
        {
          id: 1,
          title: 'Netflix',
          description: 'Unlimited movies, TV shows, and more. Watch anywhere. Cancel anytime. color:black;',
          price: 799,
          category: 'tv',
          image: 'https://th.bing.com/th?q=Netflix+Original+Logo&w=120&h=120&c=1&rs=1&qlt=70&r=0&o=7&cb=1&pid=InlineBlock&rm=3&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247',
          link: 'https://www.netflix.com/in/'
        },
        {
          id: 2,
          title: 'Disney+',
          description: 'Disney+ Hotstar is the ultimate streaming platform for the best of Disney, Pixar, Marvel, Star Wars, and National Geographic.',
          price: 895,
          category: 'tv',
          image: 'data:image/jpeg;base64,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',
          link: 'https://www.hotstar.com/in/home?ref=%2Fin'
        },
        {
          id: 3,
          title: 'Spotify',
          description: 'Music for everyone. Millions of songs. No credit card needed.',
          price: 295,
          category: 'music',
          image: 'data:image/png;base64,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',
          link: 'https://open.spotify.com/'
        },
        {
          id: 4,
          title: 'Netflix + Disney+',
          description: 'Combo pack for ultimate entertainment with both Netflix and Disney+',
          price: 1499,
          category: 'combo',
          image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASsAAACoCAMAAACPKThEAAAA/FBMVEUTA3AAAACxBg/lCRP///8hISEpIXYNAG8WCHETA26rBg4AAGgAAGMAAGUAAGsAAGYgAQO1Bg8uAgUAAF8OAAEaAQKgBQ/sCRSkBQ+XBA6TBA6oBg+MAw2uBg8AAFubBQ7RCBN+AQ2GAg3FBxLk4+vu7fPMytmnpcBwBQrhCRPZCBN5BQuZl7jIxtYfFnNqZpeBfqOxsMfAvtRNSIbn5uz49/s9N3rX1uN1cKNgBAgpAQRBAwfNBxJNSYCCfqqenbVeW5KLiLC0s8Fyb5g7NYBWAwhmYpUxKXhSS49gWpaioMGVk64oIXE3MH5UUJCsq79oZY01LnWJh6U/AgVVfFNVAAAO6ElEQVR4nO2ca0MauxaGUTmEIZeRPRW5U5FLW0UFBGxPVShUa6v1bPf//y9nJZmBgcnUKRNr3c37wbYwI83jeldWVjImEr+fUCr5n43fUM/NRSXDKroMq+gyrKLLsIouwyq6DKvoMqyiy7CKLsMqugyr6DKsosuwii7DKroMq+gyrKLLsIouwyq6DKvoMqyiy7CKLsMqugyr6DKsosuwii7DKroMq+j6SVZ/KRW8bkepP4vV212V3qxetp1VafPPYrW/uxXUbjbIalOhzJ/FqqJitbVrWKlYvVayOjCsgtrMqlht7RtWQWXzSla7HwwrBauPSlZ1wyrIqqLO7q8NqyCrzcJbZWD917AKssrtK1kVDKsgq0xOacJ3hlWQVaUYwYSGlWC1WVOWWLsVwyrIKl9TmvCtYRVklSm/UwaWv9lgWElWlcLjJjSsQHzIubLShFuvDKsAq1Jd3WzwmdCwcllliup1jq/ZYFi5rCq5stKDu4t+umHlstrM1x9rNhhWHqtSMf9Is8Gw8lhlanW1CeebX4aVx6qSq+8rWRUNqwCrfFG9zpmb0LDyWG2WCntqE3rNBsNqzgoSlnqdkzesAqzy5cIPO37bKlR/JqsKmFDdbHhvWK2yCjVhxrBaYbWZyZVDmg2G1SorqBpCTCibDduVp2Nl/To4K1qTValWVzcbsi4rFSwNrCzQL+Xj13qsNku1cl1tQtFs2M7oZYUQYxjEbMYQgtB6FmBrssrkins/OF60ncnoY4UowbfnxxeHl5ffLsZD5hAA9pJY5Qt1dbNBdPy2S6rAWosVc4aHrUFyocFpb9J37GfAtSarCjeh0oOi47dTUgXWGqwQvWkkFRp0To4IfgSXNf/yvKy4CfeVrHizYSevCqw1WNltFSmp0eTW+VF0IYYdrfG3Niswofpkw0fOKqeHFTtOJhuHZ+Pzfr9/Pp5O2r1RcwnX1KEhLBB2jrujxqidwrqCa01WPGGV90JPNnBWQVg/z4p+Ah5Dnsu5GGa0StPjb778NWgfUaYYF8OH3kWTR8361KxKtTAT1jgrlQnXiKspjLVJ/XHBkVXp98tFGvs0pIxXEf7Ki9z44q91TLTAWpdVpZQr1kObDTs1lQnXyFd4djI9woH6E3iR2eUcR++WIv8liBwup7aeKvR+GSthwgO1CT9v7BRy+Uygdl+nZoAiFCmzDc/c45YHow05fFHSky4PR/etzgi+HOuAtT4rbsKwjt9OoaYwoe61M6TvWc+jdeIgjxV+4FnqSkKEubDN/3hOVsKEYc2GnaLKhPr7DBaj1x6t0ZEtsxK6hn9dYJ7aB18cnGA3yeThs8YVVFgwE4Z0/F4VuQlXYWljhehiZkPO0EvzF0TYlddkLYdbsHkEsYaqnWTy+llZQcICE26GPMtUVplQFytE24cLWBZ2HlxYXVFsEYi0joiqFCyzGbmHN4iOCisGK0hYdfXJhq3tOgTWk7FiMMt99SUghK/d0GowiB9876I7x0hG3ShkfvhlrCBhwUyoNuFBvSxmwidhhQj3l69kAp8Rdy00SLEEG7tRViVHUz4JNmykpesVgxWYsFwvqdc5e+Vi0IS6WKU4ifFSBkJk6sK6ZgjLKBs0ZNkwwkxPizAeq2J9T/1AYb2umAk1sZJx820lW+O+hNVMYzzx16Ft54dF+08wjMWKz4Tq40VZlQl1sboQpThdGTObyQXgKUFXC1KjLz9AhX6uCbE+K0juwCqk4/fuoCwC6ylYybDpOKsRgWfugoaCSZvdzqjVe7hzsLxMeHDlDjQ8c8K9GXwjBqtKSZhQORHuFhUm1MXqUgQMCYwGu0n9zG6PhjYmhMBEiGSusoSWb6HtZGu5paNOa96LcVhJE+4rYW3uBU2oi1VbsgIOK++4S+aBgwlLLChBUYFtIEeozfztGQyXtxdW5hsgXO4VmHpliQZWrglDHqMQM+FyJzk+KwvGY1dFXDVmw1sGw8d8bG48IGckYH3DPBelsHgZVo1s/NDutUZgyvbFHRFY+OW8k5jsMwg2hjGh7O/+1XTy8JBi4pOORvfYRaiFFZgwrOOnMGFsVozRo+m9vzXa6HydpggvCuRoruXLkM9JK3nDB83IpJH0q0Wg8Bf9QXTL4xPyHvt+32ks+ofn8CZKD/iV/P5hyg3GOKxcE4Y8Ls5NqJEVjIikDpeH7QG7vPP6V7QrXrmwObURrGzsq8HK1adVxE4HZ9x7YtHYZ+x85QobIQqfNIG4ouNT3v5C8VmBCcM6fq4JtbFCTr+jAuXOfRbzB1aHiI5qiuGTwJW3ssi/sGWLOtnD6Pp0+Zo7RsHnTQeWSDIDthwNrLgJQzp+tboo3TWxwune6qiXNJhJWERkrAHGX+GPK3vovt2EXHX/dTId8qmRilDrM0sATcIcQXxIB6M2Y/y+MUVumLqrhDisROn+mAm1sLK8qhxG3WjJfHXfvu/2WqeexQZy9mcyEIaUo/3m8K+nZ3fYcSCpYb7FAV6WpWoTI5bgfzljFqIcVnPcnx1hp4pRtcHzGiISFXxEz47PSphQ3fGDBfSKCddmBZOS+D93Hr7fwlhE3T4gGGPq2PRuKiPuRASWC+KK8PZy12lwBJOr2REixIEbeCHhBUubWuL9HsyXDvf3/wROSHyUf8IX212QX8GHN6tWTFbuTHigXufktbESpXqv7zh8KBY7kzaTlThM6TTNI60tWX0X4zuj3Is9/x5Fs9GZ8B0fi6dtGXzMFo15iogI2+PZzfEYyglEIJJa1aq8eYr5Wpy3NeKxck2oPjLzUZhQCyvAc+Iwt/6WoTPA3h68lXB4ED344+qYuwgmQrKyb90YE5T2/jGSM0AywXy58BSsyV+9cTsXbYIw/ChsDayECbfVbXfebPAnrBhninDyk2Mts1qsTpyh8KTMVzJL9yUr22JHZ5ewNGzMa7KJjKEZj7spFbm/f+3HSZHd46aThUQDJkO4qEl4JojLigfWxr7ShKUVE8aYB2E5cikbBsBqLFl5izvGY+dU1OOJhC0LCyZKJ2BlsfRFt9PpHl70+ycifIYiXsRkMcAixs6Ibx97ClkMSoh2yvUpSvBpYsR/UnFZiXJ04436MQpuQj2sEOSfHkECj2TVpG6tbqGzUeeCyraDa7AWkaxowlcNDNrkDqC0eRoasCr3bQ8LVoJL4+b7l/7MZumEzb+DDERYLooMeEhjsxImrBU3NpQe5B0/f8KKU1/xNUdz7DAfq7kHGeH7OiLVu7P8sRtXFMFA2/Ns1K9CxHT4crLJsLCfCKjvYmI9x3LlbCXwAi9BLM2vueWnAFhsVjATvtpQl1iVvaWEFatuZyle5twS5OarJvGW/9biq5uPoeIWrBoO1AdTQojYzm9eVLlbe3zr4tS2nDlCJravHYZtku7fsgRpeO+cUDzkt3YIn0JixxU34auN92Edv4IvYcVbO7MUH0L7iIj2AM+2gVMOVddwUGWLymlEIM99c2xSdVJf/k5NxFLmgYdeg1rIzUiQxkV0XQ/Pug1xs+1RHNC+jNNrJlo78VjJmfDVxoZ6nVOu+xNWzD4Do+Ln3zufLOUrVxZiyB1jFxKxiI0GAdskB61P9/e9+TkksSXWcay0W+InuwvPiRTF0HFyWWc4oYlVvgas1K3k7F7Rt8yJ25NB1F9aVn17fvzczJ1XSrUoFKy22OyiFD+sjPtQLIe7tpVOEHl05Da9dMExLA+Xb3mgaTlxxGaVEaw+hzUboGrQxQoWH7PGfASTI8ehWCx0HDS+HHmvy7Yw5i2EEdT2ztKmTvK+ivm8dsFE9cFhgef8ZwWh9mTLcXXsVr2xWQkT8t9iod5ULdQLOllZiPiG3hx1ut32p87SuUhY5aVhfsd8vId8DxXPFr2cxjGUFjyViRNIFiPfjxm28CJcR32aTtst3/frpbGOHvISK/Xh0X0w4Txh6XhuAtk/bM40+jBRpvmkhU9GPdleRpRdfev2eu2TGYVAs3Dqa989rCVOd1nIS+atMUXeXq38abRnhM3zYmxWfE3IWf2lXueACUs6WSUsm4aeTR4dEzzfi2HzzjJPZ5hSyrDcyWEYLTaixelJ52LU6DxcEyr6rzLMGpPpUPSaLW1x5bHaUD9GkfOZUNM+Dp2oQR3eOsIu85Sv3sDir6dX32GQ+RjiAQlR1hDfb4ZF0GlmVRKs1F0sMKFuVkj2/YZXJ+1ur9NqdXrdw2mfitPGSzum6n1SS70L6EKByuBOoneWa109rCqSldqEu2BCL2HpYQVTOp/zOjwSuLVsm9g8BAKxsqbcTH8WPDUZn9Wmyyqk2ZCvzxOWtrNqVue0S3znhERA6HqYRHbsk4pj3jpYZSSrg5BmQyGvmVUCYTDcctWuCRR8b1ugkitA7aw2XVY7yolwqw5Vg2ZWgs4TPULoNlYvsNazH6usNrLKw6OVeu1JWD0FKJDYLEsmj1DwE3Swqris1B2/d/WCm7BexLPhRFT5DaqIW52sQjp+5WL+JbESqb2NFYWFVlbqw6PZspuwXhCrK6bwuFZWIR2/vVrp5bCS+cpSHY7UwWpz/tsyQ5oNxfzLYYV4509xaDChm1VIx6+eq7wYVgk2bPJHnZ6c1X/VHT+3angZrBIMj1OKikE3qxAT5oqlF8Qq9Ci3ZlZFdbOhnH9JrMKkmVVIx08mLMNqidVGyPGiQsawCrAKaTaUS4ZVgNUHpQe3RMIyrJZZhZxs2CwYVkFWYSbMGFYBViHNhkLJsAqyUnb8trI5wyrIKqTZUDSsgqxC1jm1TNawCrAqKTNWNm9YBVmFHC8qGA8GWYWYsGRYKVipn1TdLxlWQVbqZsPbvGEVZBVyvGhdD1rp30Ra93E8qZ9lel1aj9Vvozissp5WWX3YdbUMK6/8lv9aVtkFIfF7iuoHb968/xy47P2bPf6MV3b/47utObXd7B/GKpuplQ/ef/5nO/Itr/76/Kaey+6/2339+MX/JlYfHr8kXP/8xLXPzUWln2T1y/TcXFQyrKLLsIouwyq6DKvoMqyiy7CKLsMqugyr6DKsosuwii7DKroMq+gyrKLLsIouwyq6DKvoMqyiy7CKLsMqugyr6DKsosuwii7DKroMq+gyrKLrd2X1f9RSA4k96NLSAAAAAElFTkSuQmCC',
          link: 'https://www.netflix.com/in/'
        }
      ];

      renderSubscriptions(subscriptions);
      loadingSpinner.style.display = 'none';
    }, 1000);
  }

  function renderSubscriptions(subscriptions) {
    cardsContainer.innerHTML = '';
    
    
    subscriptions.forEach(sub => {
      const card = document.createElement('div');
      card.className = 'bg-white p-6 rounded-lg shadow-md subscription-card dark:dark-card';
      card.setAttribute('data-category', sub.category);
      card.setAttribute('data-price', sub.price);
      card.setAttribute('data-name', sub.title.toLowerCase());
      
      card.innerHTML = `
        <img src="${sub.image}" alt="${sub.title}" class="w-24 h-24 mx-auto mb-4">
        <h2 class="font-bold text-xl text-center mb-2 dark:text-white">${sub.title}</h2>
        <p class="text-gray-600 mb-4 text-center dark:text-gray-300">${sub.description}</p>
        <p class="font-bold text-blue-600 text-center mb-4 dark:text-blue-400">₹${sub.price}/month</p>
        <div class="flex justify-center gap-3">
          <a href="${sub.link}" target="_blank" class="w-full">
            <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full transition-colors">
              Subscribe
            </button>
          </a>
          <button class="add-btn bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full transition-colors" data-id="${sub.id}">
            Add to Cart
          </button>
        </div>
      `;
      
      cardsContainer.appendChild(card);
    });


    document.querySelectorAll('.add-btn').forEach(button => {
      button.addEventListener('click', function() {
        const subId = parseInt(this.getAttribute('data-id'));
        const subscription = subscriptions.find(sub => sub.id === subId);
        addToCart(subscription);
      });
    });
  }

  function filterSubscriptions() {
    const selectedCategory = categorySelect.value;
    const selectedPrice = parseInt(priceRange.value);
    const searchQuery = searchInput.value.toLowerCase();
    
    const filtered = subscriptions.filter(sub => {
      const categoryMatch = selectedCategory === 'all' || selectedCategory === sub.category;
      const priceMatch = sub.price <= selectedPrice;
      const searchMatch = sub.title.toLowerCase().includes(searchQuery) || 
                         sub.description.toLowerCase().includes(searchQuery);
      
      return categoryMatch && priceMatch && searchMatch;
    });

    renderSubscriptions(filtered);
  }

  function sortSubscriptions(type) {
    let sortedSubs = [...subscriptions];
    
    if (type === 'price') {
      sortedSubs.sort((a, b) => a.price - b.price);
      sortPriceBtn.classList.add('bg-blue-500', 'text-white');
      sortPriceBtn.classList.remove('bg-gray-200', 'text-gray-700', 'dark:bg-gray-700');
      sortNameBtn.classList.remove('bg-blue-500', 'text-white');
      sortNameBtn.classList.add('bg-gray-200', 'text-gray-700', 'dark:bg-gray-700');
      currentSort = 'price';
    } else {
      sortedSubs.sort((a, b) => a.title.localeCompare(b.title));
      sortNameBtn.classList.add('bg-blue-500', 'text-white');
      sortNameBtn.classList.remove('bg-gray-200', 'text-gray-700', 'dark:bg-gray-700');
      sortPriceBtn.classList.remove('bg-blue-500', 'text-white');
      sortPriceBtn.classList.add('bg-gray-200', 'text-gray-700', 'dark:bg-gray-700');
      currentSort = 'name';
    }
    
    renderSubscriptions(sortedSubs);
  }

  function toggleTheme() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);
    
    if (darkMode) {
      document.body.classList.add('dark-mode');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      document.body.classList.remove('dark-mode');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  }

  function initTheme() {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      document.body.classList.remove('dark-mode');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  }

  function addToCart(subscription) {
    const existingItem = cart.find(item => item.id === subscription.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...subscription,
        quantity: 1
      });
    }
    
    updateCartCount();
    updateLocalStorage();
    showToast(`${subscription.title} added to cart`);
  }

  function openCart() {
    renderCartItems();
    cartModal.classList.remove('hidden');
  }

  function closeCartModal() {
    cartModal.classList.add('hidden');
  }

  function renderCartItems() {
    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="text-gray-500 text-center py-4 dark:text-gray-400">Your cart is empty</p>';
      checkoutBtn.disabled = true;
      return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'flex justify-between items-center py-3 border-b dark:border-gray-700';
      
      cartItem.innerHTML = `
        <div class="flex-1">
          <h4 class="font-medium dark:text-white">${item.title}</h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">₹${item.price} x ${item.quantity}</p>
        </div>
        <div class="flex items-center">
          <span class="font-bold dark:text-white">₹${item.price * item.quantity}</span>
          <button class="remove-btn ml-4 text-red-500 hover:text-red-700 dark:hover:text-red-400" data-id="${item.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `;
      
      cartItems.appendChild(cartItem);
      total += item.price * item.quantity;
    });
    
    cartTotal.textContent = `₹${total}`;
    checkoutBtn.disabled = false;
    
    
    document.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', function() {
        const itemId = parseInt(this.getAttribute('data-id'));
        removeFromCart(itemId);
      });
    });
  }

  function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartCount();
    updateLocalStorage();
    renderCartItems();
    showToast('Item removed from cart');
  }

  function checkout() {
    showToast('Checkout functionality would be implemented here');
    closeCartModal();
  }

  function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
  }

  function updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  }

  function hideToast() {
    toast.classList.add('hidden');
  }
});