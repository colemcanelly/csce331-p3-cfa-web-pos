<template>
    <div>
        <!-- <img class="product-image" :src="product.imageName" /> -->
        <div class="details=wrap">
            <NuxtLink to="/customer/Combos">COMBOS</NuxtLink>
        </div>

        <div class="details=wrap">
            <NuxtLink to="/customer/Breakfast">BREAKFAST</NuxtLink>
        </div>

        <div class="details=wrap">
            <NuxtLink to="/customer/Drinks">DRINKS</NuxtLink>
        </div>

        <div class="details=wrap">
            <NuxtLink to="/customer/Desserts">DESSERTS</NuxtLink>
        </div>
    </div>
</template>

<script>
import {categories} from '~/static/temp-data'

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