<template>
  <div class="network">
    <read-file @load="extractReadFile"/>
    <main-network class="main-network__position" :loadData="readFileData"/>
  <div id="cy">
  </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ReadFile from '@/components/ReadFile.vue'
import MainNetwork from '@/components/MainNetwork'
export default {
  name: 'Network',
  components: {
    ReadFile,
    MainNetwork
  },
  data: function () {
    return {
      readFileData: {}
    }
  },
  methods: {
    extractReadFile: function (data) {
      this.readFileData = data
      console.log('extract', data)
    }
  }
}
</script>

<style scoped>
.main-network__position {
  margin-left: auto;
  margin-right: auto;
}
.network {
  position: absolute;
}
</style>
