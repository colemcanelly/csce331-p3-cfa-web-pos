<template>
    <div>
        <h1>Breakfast</h1>
        <div class="grid-wrap">
            <div 
            class="product-item"
            v-for="item in breakfast"
            :key="item.id"
            >
                <img :src="item.imageName" />
                <h3 class="product-name"> {{ item.name }}</h3>
                <p class="product-price"> {{ item.price }}</p>
                <button>Add to Order</button>
            </div>
        </div>
    </div>
</template>

<script>
import { breakfast } from '../temp-data';

export default {
    name: "BreakfastPage",
    layout: 'customer',
    data() {
        return {
            breakfast,
        }
    }
}
</script>