<template>
  <div class="ReadFile">
    <b-form-file v-model="file" class="mt-3" @change="readFile()" multiple directory plain></b-form-file>
    <div class="mt-3">Selected file: {{ file ? file.name : '' }}</div>
    <button @click="readFile()">確認</button>
  </div>
</template>

<script>
export default {
  name: 'ReadFile',
  props: {
  },
  data () {
    return {
      file: null
    }
  },
  methods: {
    readFile: function () {
      console.log('file', this.file)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.ReadFile {
}
</style>
