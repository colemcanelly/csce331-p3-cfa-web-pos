<template>
    <div 
    class="product-container"
    v-for="cat in categories"
    :key="cat.id"
    >
        <!-- <img class="product-image" :src="product.imageName" /> -->
        <div class="details=wrap">
            <h3>{{  cat.name }}</h3>
        </div>
    </div>
</template>

<script>
import {categories} from '../temp-data'

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