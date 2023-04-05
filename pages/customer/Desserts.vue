<template>
    <h1>Desserts</h1>
    <div class="grid-wrap">
        <div 
        class="product-item"
        v-for="dessert in desserts"
        :key="dessert.id"
        >
            <img :src="dessert.imageName" />
            <h3 class="product-name"> {{ dessert.name }}</h3>
            <p class="product-price"> {{ dessert.price }}</p>
            <button>Add to Order</button>
        </div>
    </div>
</template>

<script>
import { desserts } from '../temp-data';

export default {
    name: "DessertsPage",
    layout: 'customer',
    data() {
        return {
            desserts,
        }
    }
}
</script>