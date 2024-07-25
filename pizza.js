document.addEventListener('alpine:init', () => {

    Alpine.data('pizzaCartWithAPIWidget', function() {
        return {
            title: 'Pizza Cart',
            pizzas: [],
            username: '',
            cartId: '',
            cartPizzas: [],
            cartTotal: 0.00,
            paymentAmount: 0,
            message: '',
            isLoggedIn: !!localStorage.getItem('username'),
            historicalOrders: [],
            featuredPizzas: [],
            payForCart: '',

            login() {
                if (this.username.length > 2) {
                    localStorage['username'] = this.username;
                    this.createCart();
                } else {
                    alert('Username is too short');
                }
            },
            logout() {
                if (confirm('Do you want to logout ?')) {

                    this.username = '';
                    this.cartId = '';
                    localStorage['cartId'] = this.cartId;
                    localStorage['username'] = this.username;
                }
            },
            createCart() {
                if (this.username) {
                    // this.cartId = 'No username to create a cart for'
                    return;

                }

                if (cartId) {
                    this.cartId = cartId;
                    return Promise.resolve()
                } else {
                    const CartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/create?username=${this.username}`
                    return axios.get(createCartURL)
                        .then(result => {
                            this.cartId = result.data.cart_code;
                            localStorage['cartId'] = this.cartId;
                            this.getCart();
                        })
                }
            },

            getCart() {
                const getCartURL = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`;
                return axios.get(getCartURL).then(response => {
                    this.this.cartPizzas = response.data.pizzas.map(pizza => ({
                        ...pizza,
                        quantity: 1,
                        total: pizza.price
                    }));
                })
            },
            addPizza(pizzaId) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/add', {
                    cart_code: this.cartId,
                    pizza_id: pizzaId
                })
            },
            removePizza(pizzaId) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/remove', {
                    cart_code: this.cartId,
                    pizza_id: pizzaId
                })
            },

            pay(amount) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizza-cart/pay', {

                    cart_code: this.cartId,
                    amount: amount
                });
            },
            getFeaturedPizzas() {
                const featuredPizzasURL = `https://pizza-api.projectcodex.net/api/pizzas/featured?username=${this.cartId}/get`;
                axios.get(this.featuredPizzas).then(response => {
                    this.featuredPizzas = result.data.pizzas.slice(0, 3) || [];
                    console.log(response);
                });
            },
            setFeaturedPizza(pizza_id) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizzas/featured', {
                    username: this.username,
                    pizza_id: pizza_id
                }).then(() => {
                    this.getFeaturedPizzas();
                })
            },

            showCartData() {
                this.getCart().then(result => {

                    const cartData = result.data;

                    this.cartPizzas = cartData.pizzas;
                    this.cartTotal = cartData.total.toFixed(2);
                    // alert(this.cartTotal);
                });
            },

            init() {
                if (this.isLoggedIn) {
                    const storedUsername = localStorage['username']
                    if (storedUsername) {
                        this.username = storedUsername;

                        axios.get('https://pizza-api.projectcodex.net/api/pizzas')
                            .then(result => {
                                this.pizzas = result.data.pizzas
                            });

                        if (!this.cartId) {
                            this
                                .createCart()
                                .then((result) => {
                                    this.showCartData();
                                })
                            }
                        }
                    }
                },

            addPizza(pizzaId) {
                this
                    .addPizza(pizzaId)
                    .then(this.showCartData)
            },
            removePizzaFromCart(pizzaId) {
                // alert(pizzaId)
                this
                    .addPizza(pizzaId)
                    .then(this.showCartData)
            },
            saveOrderToLocalStorage(order) {
                let orders = JSON.parse(localStorage.getItem('histroicalOrder')) || [];
                orders.push(order);
                localStorage.setItem('historicalOrders', JSON.stringify(orders));
            },


            getHistoricalOrders() {
                this.historicalOrders = JSON.parse(localStorage.getItem('historicalOrders')) || []
            },

            payForCart() {
                this
                    .pay(this.paymentAmount)
                    .then(result => {
                        if (result.data.status == 'failure') {
                            this.message = result.data.message;
                            setTimeout(() => this.message = '', 3000);
                        } else {
                            this.message = 'Payment received!'
                            setTimeout(() => {
                                this.message = '',
                                    this.cartPizzas = [],
                                    this.cartTotal = 0.00,
                                    this.cartId = '',
                                    this.paymentAmount = 0,
                                    localStorage['cartId'] = '',
                                    this.createCart()
                            }, 3000);
                        }
                    }
                    )
            }
        }
    })
})

