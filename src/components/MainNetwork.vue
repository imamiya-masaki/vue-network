<template>
  <div class="MainNetwork" id="cy">
  </div>
</template>

<script>
import cytoscape from 'cytoscape'

export default {
  name: 'ReadFile',
  props: {
  },
  data () {
    return {
      fileUpperCamelCase: true, // 後々ここフラグによって変化させたいので
      ReadFileOnly: false // 読み込んだファイルのみをネットワーク表示させる
    }
  },
  methods: {
  },
  watch: {
    counter () {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .MainNetwork {
  border: 0.5px solid;
  width: 700px;
  height: 500px;
 }
</style>
