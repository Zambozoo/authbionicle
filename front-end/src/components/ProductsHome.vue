<template>
  <div>
    <h1>Products</h1>
    <hr>
    <h2>Turaga</h2>
    <p><em>Wise and aged heores of the past</em></p>
    <ProductList :products="turaga" />
    <hr>
    <h2>Toa</h2>
    <p><em>Strong and brave symbols of unity, duty, and destiny</em></p>
    <ProductList :products="toa" />
    <hr>
    <h2>Titans</h2>
    <p><em>Grand warriors whose strength surpasses the ordinary</em></p>
    <ProductList :products="titan" />
  </div>
</template>

<script>
import axios from 'axios';
import ProductList from "../components/ProductList.vue"
export default {
  name: 'Browse',
  components: {
    ProductList
  },
  data() {
    return {
      country: '',
      products:[],
      turaga:[],
      toa:[],
      titan:[],
    }
  },
  created() {
    this.getProductsDB();
  },
  computed: {
  },
  methods: {
    async getProductsDB() {
      try {
        let res = await axios.get('api/products/');
        this.products = res.data;
        //for(let i = 0; i < this.products.length; i++) {
          //this.products[i].comments = await axios.get('api/comments/' + this.products[i]._id).data.length; 
        //}
        this.turaga = this.products.filter(product => product.price == "$6.99");
        this.toa = this.products.filter(product => product.price == "$9.99");
        this.titan = this.products.filter(product => product.price == "$19.99");
        return true;
      } catch(error) {
        console.log(error);
        return false;
      }
    },
  },
}
</script>
<style scoped>
h1 {
        margin-top:20px;
}
</style>

