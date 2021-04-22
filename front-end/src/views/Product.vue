<template>
  <div>
    <div v-for="product in products" v-bind:key="product._id">
      <div class="image">
        <img :src="'/images/'+ product.photo.path">
      </div>
      <div class="info">
        <h1>{{product.photo.title}}</h1>
        <h6>{{product.desc}}</h6>
        <h6>{{product.price}}</h6>
        <p>{{product.full_desc}}</p>
      </div>
      <hr>
      <h1>Comments</h1>
      <div v-for="comment in comments" v-bind:key="comment.id">
        <hr>
        <form v-if="editing(comment._id)" @submit.prevent="editCommentDB(comment._id, comment.name, comment.body)">
          <textarea v-model="comment.body"></textarea>
          <br />
          <button type="submit">Submit</button>
        </form>
        <div v-else class="comment">
          <div class="body">
            <p><i>{{comment.name}}</i> <h7>|{{formatDate(comment.created)}}</h7></p>
            <p>--{{comment.body}}</p>
            <div v-if="isUser(comment.name)">
              <button @click="edit(comment._id)">Edit</button>
              <button @click="removeComment(comment._id)">Remove</button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <hr>
        <form v-if="user" @submit.prevent="addCommentDB">
          <p></p>
          <textarea v-model="body" placeholder="Comment"></textarea>
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import axios from 'axios';
export default {
  name: 'Product',
  data() {
    return {
      creating: true,
      products: [],
      comments:[],
      editIndex : -1,
      body:"",
      addedComment:null,
      photo:''
    }
  },
  created() {
    this.getProductDB(this.$route.params.id);
    this.getPhotosDB();
  },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  },
  methods: {
    toggleForm() {
      this.creating = !this.creating;
    },
    edit(id) {
     this.editIndex = id;
    },
    async removeComment(id) {
      try {
        await axios.post('/api/comment/remove/' + id);
        this.getCommentsDB();
      } catch(error) {
        console.log(error);
      }
      this.editIndex = -1;
    },
    editing(id) {
      return this.editIndex == id;
    },
    async editCommentDB(id, name, body) {
      try {
        const formData = new FormData();
        formData.body = body;
        formData.productID = this.$route.params.id;
        await axios.post('/api/comment/edit/' + id, {formData});
        this.getCommentsDB();
      } catch(error) {
        console.log(error);
      }
      this.editIndex = -1;
    },
    async getCommentsDB() {
      try {
        let res = await axios.get('/api/comments/' + this.products[0]._id);
        this.comments = res.data;
        return true;
      } catch(error) {
        console.log(error);
      }
      return false;
    },
    async getProductDB(productId) {
      try {
        let res = await axios.get('/api/product/' + productId);
        this.products.push(res.data);
        this.getCommentsDB();
        return true;
      } catch(error) {
        console.log(error);
      }
      return false;
    },
    async addCommentDB() {
      try {
        const formData = new FormData();
        formData.body = this.body;
        await axios.post("/api/comment/" + this.products[0]._id, {formData});
//	alert(this.products[0]._id);
        this.getCommentsDB();
        this.body = '';
        this.name = '';
      } catch(error) {
        console.log(error);
      }
    },
    async getPhotosDB() {
      try {
        let res = await axios.get("/api/photos/" + this.product._id);
        this.photo = res.data[0];
      } catch (error) {
        console.log(error);
      }
    },
    formatDate(date) {
      if (moment(date).diff(Date.now(), 'days') < 15)
        return moment(date).fromNow();
      else
        return moment(date).format('d MMMM YYYY');
    },
    isUser(name) {
     return this.$root.$data.user && name == this.$root.$data.user.username;
    }
  },
}
</script>

<style scoped>
.intro {
  font-style: italic;
}

.product {
  margin:10px;
}

img {
  border: 1px solid #333;
  height: 450px;
  width: 350px;
  object-fit: cover;
}

</style>
