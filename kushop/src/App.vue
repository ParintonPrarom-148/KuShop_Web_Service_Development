<template>
  <MainMenu />
  <div class="container">
    <!-- <router-link to="/">Home</router-link>
    <router-link to="/login">Login</router-link> -->
    <router-view/>
  </div>
</template>


<script>
import MainMenu from './components/MainMenu.vue'
export default {
  name:'App',
  components:{
    MainMenu
  }
}
</script>
<style></style>