<template>
    <h1>Combos</h1>
    <div class="grid-wrap">
        <div 
        class="product-item"
        v-for="combo in combos"
        :key="combo.id"
        >
            <!-- <img :src="product.imageName" /> -->
            <h3 class="product-name"> {{ combo.name }}</h3>
            <p class="product-price"> {{ combo.price }}</p>
            <button @click="addItemToOrder()">Add to Order</button>
        </div>
    </div>
</template>

<script>
import { combos } from '../../assets/temp-data';
import { cartItems } from '../../assets/temp-data';
import basilBottle from '../assets/basil-bottle.webp';

export default {
    name: "CombosPage",
    layout: 'customer',
    data() {
        return {
            combos,
            cartItems,
        }
    },
    methods: {
        addItemToOrder() {
            const newItem = {
                id: '456',
                name: 'New Item',
                price: '$10.00',
                imageName: basilBottle,
            };
            console.log("about to push a cartItem");
            this.$set(this.cartItems, this.cartItems.length, newItem);
        }
    }
}
</script>