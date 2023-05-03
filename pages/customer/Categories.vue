<template>
<v-app>
<v-container>
    <NuxtLink to="./Combos" class="link">
        <v-card class="center">
            <v-row>
                <v-col cols="7">
                    <div><img src="/combos.png" class="image"></div>
                </v-col>
                <v-col cols="5" align-self-center>
                        <v-card elevation="0"><v-card-title text-center style="vertical-align: center">Combos</v-card-title></v-card>
                </v-col>
            </v-row>
        </v-card>
    </NuxtLink> 
    <NuxtLink to="./Breakfast" class="link">
        <v-card class="center">
            <v-row>
                <v-col cols="7">
                        <div><img src="/breakfast.png" class="image"></div>
                </v-col>
                <v-col cols="5" align-self-center>
                        <v-card elevation="0"><v-card-title text-center style="display: flex; align-items: center;">Breakfast</v-card-title></v-card>
                </v-col>
            </v-row>
        </v-card>
    </NuxtLink>
    <NuxtLink to="./Drinks" class="link">
        <v-card class="center">
            <v-row>
                <v-col cols="7">
                        <div><img src="/drink.jpeg" class="image"></div>
                </v-col>
                <v-col cols="5" align-self-center>
                        <div><v-card-title class="text-center">Drinks</v-card-title></div>
                </v-col>
            </v-row>
        </v-card>
    </NuxtLink>
    <NuxtLink to="./Desserts" class="link">
        <v-card class="center">
            <v-row>
                <v-col cols="7">
                        <div><img src="/dessert.png" class="image"></div>
                </v-col>
                <v-col cols="5" align-self-center>
                        <div><v-card-title class="text-center">Desserts</v-card-title></div>
                </v-col>
            </v-row>
        </v-card>
    </NuxtLink>
</v-container>
</v-app>
</template>

<script>

export default {
    name: "CategoriesPage",
    layout: 'customer',
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
  vertical-align: center;
  height: 200px; /* Set the height of the container as needed */
}

.cfa-red-text {
    text-decoration: cfa-red;
}

</style scoped>