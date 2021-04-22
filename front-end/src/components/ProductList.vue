<template>
  <div class="wrapper">
    <div class="products">
      <router-link class="product" v-for="product in products" :key="product._id" :to="'/product/' + product._id">
        <div>
          <div class="info">
            <h2>{{product.desc}}</h2>
            <p>Set #: {{parseInt(product._id,16) % 1000}}</p>
          </div>
          <div class="image">
            <img :src="'/images/'+product.photo.path">
          </div>
          <div class="info">
            <h2>{{product.price}}</h2>
            <p>Part Count: {{product.count}}</p>          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'ProductList',
  props: {
    products: Array
  },
  methods: {
    async getNumComments(id) {
      try {
        let res = await axios.get('/api/comments/' + id);
        return res.data.length;
      } catch(error) {
        console.log(error);
      }
      return -1;
    },
  }
}
</script>
<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.products {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.product div {
  border-radius:15px;
  background-color:#000;
  padding:5px;
}

.product {
  margin: 5px;
  width: 150px;
  text-decoration: none;
}


.image {
  display: flex;
  justify-content: center;
}

.image img {
  height: 150px;
  width: 150px;
  object-fit: cover;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
}

.info {
  background: black;
  color: #000;
  padding: 10px 30px;
}

.info h1 {
  font-size: 16px;
  color: white;
  margin-bottom:0px;
}

.info h2 {
  font-size: 14px;
  color: white;
}

.info p {
  margin: 0px;
  font-size: 10px;
  color: white;
}

.price {
  display: flex;
}

button {
  height: 50px;
  background: #000;
  color: white;
  border: none;
}

.auto {
  margin-left: auto;
}

.tooltipP {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.tooltipP .tooltiptext {
  visibility: hidden;
  width: 240px;
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;
  opacity: 1;
  /* Position the tooltip text - see examples below! */
  position: relative;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltipP:hover .tooltiptext {
  visibility: visible;
}
</style>
