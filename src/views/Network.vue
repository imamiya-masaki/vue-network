<template>
  <div class="network">
    <read-file @load="extractReadFile"/>
    <right-bar />
    <main-network class="main-network__position" :loadData="readFileData"/>
  </div>
</template>

<script>
// @ is an alias to /src
import ReadFile from '@/components/ReadFile.vue'
import RightBar from '@/components/RightBar'
import Network from '@/components/MainNetwork'
export default {
  name: 'Network',
  components: {
    ReadFile,
    MainNetwork: Network,
    RightBar
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
}
.network {
}
</style>
