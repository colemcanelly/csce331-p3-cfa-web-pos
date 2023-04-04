<template>
    <h1>Order Summary</h1>
    <div class="grid-wrap">
        <div 
        class="product-item"
        v-for="item in cartItems"
        :key="item.id"
        >
            <!-- <img :src="product.imageName" /> -->
            <h3 class="product-name"> {{ item.name }}</h3>
            <p class="product-price"> {{ item.price }}</p>
            <button @click="removeItemFromOrder">Add to Order</button>
        </div>
    </div>
</template>

<script>
import { cartItems } from '../temp-data';

export default {
    name: "OrderPage",
    layout: 'customer',
    data() {
        return {
            cartItems: cartItems,
        }
    },
    methods: {
        removeItemFromOrder() {
            cartItems.pop();
        }
    }
}
</script>