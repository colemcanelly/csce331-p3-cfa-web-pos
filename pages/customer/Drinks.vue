<template>
    <h1>Drinks</h1>
    <div class="grid-wrap">
        <div 
        class="product-item"
        v-for="drink in drinks"
        :key="drink.id"
        >
            <img :src="drink.imageName" />
            <h3 class="product-name"> {{ drink.name }}</h3>
            <p class="product-price"> {{ drink.price }}</p>
            <button>Add to Order</button>
        </div>
    </div>
</template>

<script>
import { drinks } from '../temp-data';

export default {
    name: "DrinksPage",
    layout: 'customer',
    data() {
        return {
            drinks,
        }
    }
}
</script>