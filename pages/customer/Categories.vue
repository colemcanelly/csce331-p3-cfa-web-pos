<template>
        <!-- <img class="product-image" :src="product.imageName" /> -->
        <div class="details=wrap">
            <NuxtLink to="./Combos.vue">COMBOS</NuxtLink>
        </div>

        <div class="details=wrap">
            <NuxtLink to="./Breakfast.vue">BREAKFAST</NuxtLink>
        </div>

        <div class="details=wrap">
            <NuxtLink to="./Drinks.vue">DRINKS</NuxtLink>
        </div>

        <div class="details=wrap">
            <NuxtLink to="./Desserts.vue">DESSERTS</NuxtLink>
        </div>
</template>

<script>
import {categories} from '../../assets/temp-data';

export default {
    name: "CategoriesPage",
    layout: 'customer',
    data() {
        return {
            categories,
        }
    }
}
</script>