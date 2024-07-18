document.addEventListener('alpine:innit', () => {

    Alpine.data('pizzaCart', () => {
        return {
            title: 'Pizza Cart API',
            pizzas: [],
            username: 'omartabz',
            cartId: '6o9Pu4u8zB',
            cartPizzas: [],
            cartTotal: 0.00,

            getCart() {
                const getCartURL = 'https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get'
                return axios.get(getCartURL);

            },
            addPizza(pizzaId) {
                return axios.post('https://pizza-api.projectcodex.net/api/pizzas', {
                    'cart_code': this.cartId,
                    'pizza_id': 5
                })
            },

            showCartData() {
                this.getCart().then(result => {

                    const cartData = result.data;

                    this.cartPizzas = cartData.pizzas;
                    this.cartTotal = cartData.total.toFixed(2);
                    // alert(this.cartTotal);
                })
            },

            init() {
                axios
                    .get('https://pizza-api.projectcodex.net/api/pizzas')
                    .then(result => {
                        // code here
                        // console.log(result.data);
                        this.pizzas = result.data.pizzas
                        // code here
                    })
                this.showCartData();
            },

            addPizza(pizzaId) {
                this
                    .addPizza(pizzaId)
                    .then(this.showCartData)
            },
            removePizzaFromCart(pizzaId) {
                // alert(pizzaId)

            }
        }
    });

});