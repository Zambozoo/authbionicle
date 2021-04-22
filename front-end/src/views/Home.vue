<template>
<div class="dashboard">
  <ProductsHome v-if="user" />
  <Login v-else />
</div>
</template>
<script>
import ProductsHome from '../components/ProductsHome.vue';
import Login from '../components/Login.vue';
import axios from 'axios';
export default {
  name: 'dashboard',
  components: {
    ProductsHome,
    Login,
  },
  async created() {
    try {
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  }
}
</script>
<style scoped>
h1 {
        margin-top:20px;
}
</style>

