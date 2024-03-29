import Vue from 'vue';
import Vuex from 'vuex';

// import {config} from "config"

import axios from 'axios';

// const axios = require('axios').create({baseURL: "http://localhost:5000"})

Vue.use(Vuex);

export default new Vuex.Store({

    state: {
        admin: false,
        authToken: null,
        name: "User",
        orders: [
            {
                id: 1,
                items: [
                    {
                        productId: 102,
                        amount: 1
                    }
                ]
            }
        ],
        cart: [
            {
                id: 106, // PRODUCT ID <-- (Includes AMT in some cases) (example, 101 is 1g of silver haze, 102 is 3.5g of silver haze)
                amount: 1
            },
        ],
        store: {
            inventoryLoaded: true,
            inventory: [
                {
                    id: 102, //Item ID <- Not PRODUCT ID
                    title: "Sundae Driver",
                    description: "Beautiful crystal nugs with hues of rich blue, green, and orange. Each of these babies packs 23% THC & 1.5% CBD.",
                    images: {
                        cover: require("./assets/sundae-driver.jpg"),
                        gallery: [
                            {
                                src: require('./assets/sundae-driver.jpg')
                            }
                        ]
                    },
                    tags: ["Hybrid", "Flower"],
                    products: [
                        {
                            id: 102,
                            name: "1g",
                            cost: 10
                        },

                        {
                            id: 103,
                            name: "3.5g",
                            cost: 25
                        },

                        {
                            id: 104,
                            name: "7g",
                            cost: 45
                        },

                        {
                            id: 105,
                            name: "14g",
                            cost: 80
                        },
                        {
                            id: 106,
                            name: "28g",
                            cost: 140
                        }
                    ]
                },
                {
                    id: 103, //Item ID <- Not PRODUCT ID
                    title: "Vanilla Kush",
                    description: "Beautiful crystal nugs with hues of rich blue, green, and orange. Each of these babies packs 23% THC & 1.5% CBD.",
                    images: {
                        cover: require("./assets/sundae-driver.jpg"),
                        gallery: [
                            {
                                src: require('./assets/sundae-driver.jpg')
                            }
                        ]
                    },
                    tags: ["Hybrid", "Flower"],
                    products: [
                        {
                            id: 107,
                            name: "1g",
                            cost: 10
                        },

                        {
                            id: 108,
                            name: "3.5g",
                            cost: 25
                        },

                        {
                            id: 109,
                            name: "7g",
                            cost: 45
                        },

                        {
                            id: 110,
                            name: "14g",
                            cost: 80
                        },
                        {
                            id: 111,
                            name: "28g",
                            cost: 140
                        }
                    ]
                },
                {
                    id: 104, //Item ID <- Not PRODUCT ID
                    title: "White Poison",
                    description: "Beautiful crystal nugs with hues of rich blue, green, and orange. Each of these babies packs 23% THC & 1.5% CBD.",
                    images: {
                        cover: require("./assets/sundae-driver.jpg"),
                        gallery: [
                            {
                                src: require('./assets/sundae-driver.jpg')
                            }
                        ]
                    },
                    tags: ["Hybrid", "Flower"],
                    products: [
                        {
                            id: 112,
                            name: "1g",
                            cost: 10
                        },

                        {
                            id: 113,
                            name: "3.5g",
                            cost: 25
                        },

                        {
                            id: 114,
                            name: "7g",
                            cost: 45
                        },

                        {
                            id: 115,
                            name: "14g",
                            cost: 80
                        },
                        {
                            id: 116,
                            name: "28g",
                            cost: 140
                        }
                    ]
                },
            ]
        }
    },
    getters: {
        isLoggedIn: (state) => {
            if (state.authToken == null) {
                return false;
            }

            return state.authToken.length > 0;
        },
        isAdmin: (state) => {
            return state.admin;
        }
    },
    mutations: {
        setAuthToken(state, token) {
            console.log(`Authentication token set: ${JSON.stringify(token)}`);
            state.authToken = token.token;
            state.admin = token.admin
            localStorage.authToken = token;
        },
        logout(state) {
            console.log("Logging Out")
            state.authToken = null;
        },
        addCartItem(state, productId, amount = 1) {
            console.log(`User added product ${amount}x${productId} to their cart`)
            state.cart.push({id: productId, amount: amount});
        },
        removeCartItem(state, productId) {
            let cartItems = [];

            for (let item of state.cart) {
                if (item.id !== productId) {
                    cartItems.push(item);
                    continue;
                }
                console.log(`Removing item ${productId} from cart rn`);
            }

            state.cart = cartItems;
        },
        clearCart(state) {
            state.cart = [];
            console.log(`Cart has been cleared`);
        }
    },
    actions: {
        addToCart({commit}, productId, amount) {
            console.log(`Dispatching commit:: addCartItem `);
            commit('addCartItem', productId, amount);
        },
        removeFromCart({commit}, productId) {
            console.log(`Dispatching commit:: removeCartItem x Product ID ${productId}`);
            commit(`removeCartItem`, productId);
        },
        submitOrder(context) {
            //todo submit call to backend.
            //todo create endpoint which calls this method.
            console.log(`Submitting Order with cart ${JSON.stringify(context.state.cart)}`)
            // context.commit('clearCart'); //todo reimplement this when the cart is saved on the backend.
        },
        /*
        TODO:
            - Use axios to perform login
            - Write methods for logout and other functionality linked to API
         */
        login(context, email, password) {
            axios({
                method: 'post',
                url: 'http://localhost:5000/auth/login/',
                data: {
                    email: email,
                    password: password
                }
            }).then(res => {
                console.log(res.data);
                context.commit("setAuthToken", res.data.payload.auth);
            });
        },
        register(context, firstName, lastName, email, password) {
            axios({
                method: 'post',
                url: 'http://localhost:5000/auth/register/',
                data: {
                    email: email,
                    password: password,
                    first_name: firstName,
                    last_name: lastName,
                }
            }).then(res => {
               console.log(res.data);

               let status = res.data.status;

               if (status !== "success") {
                   console.error("Unable to register!!")
                   return;
               }

               context.commit("setAuthToken",res.data.payload.auth);
            });
        }
    }

})