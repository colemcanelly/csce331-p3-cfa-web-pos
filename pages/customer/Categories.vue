<template>
<v-app>
<v-container>
    <NuxtLink to="./Combos" class="link">
        <v-card class="center">
            <v-row>
                <v-col cols="7">
                    <v-card-item>
                        <div><img src="/combos.png" class="image"></div>
                    </v-card-item>
                </v-col>
                <v-col cols="5">
                    <v-card-item>
                        <div><v-card-title class="text-center">Combos</v-card-title></div>
                    </v-card-item>
                </v-col>
            </v-row>
        </v-card>
    </NuxtLink> 
    <NuxtLink to="./Breakfast" class="link">
        <v-card class="center">
            <v-row>
                <v-col cols="7">
                    <v-card-item>
                        <div><img src="/breakfast.png" class="image"></div>
                    </v-card-item>
                </v-col>
                <v-col cols="5">
                    <v-card-item>
                        <div><v-card-title class="text-center align-center">Breakfast</v-card-title></div>
                    </v-card-item>
                </v-col>
            </v-row>
        </v-card>
    </NuxtLink>
    <NuxtLink to="./Drinks" class="link">
        <v-card class="center">
            <v-row>
                <v-col cols="7">
                    <v-card-item>
                        <div><img src="/drink.jpeg" class="image"></div>
                    </v-card-item>
                </v-col>
                <v-col cols="5">
                    <v-card-item>
                        <div><v-card-title class="text-center">Drinks</v-card-title></div>
                    </v-card-item>
                </v-col>
            </v-row>
        </v-card>
    </NuxtLink>
    <NuxtLink to="./Desserts" class="link">
        <v-card class="center">
            <v-row>
                <v-col cols="7">
                    <v-card-item>
                        <div><img src="/dessert.png" class="image"></div>
                    </v-card-item>
                </v-col>
                <v-col cols="5">
                    <v-card-item>
                        <div><v-card-title class="text-center">Desserts</v-card-title></div>
                    </v-card-item>
                </v-col>
            </v-row>
        </v-card>
    </NuxtLink>
</v-container>
</v-app>
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

<style scoped>

.link {
    text-decoration: none;
}

.image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    vertical-align: center;
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px; /* Set the height of the container as needed */
}

.cfa-red-text {
    text-decoration: cfa-red;
}

</style scoped>