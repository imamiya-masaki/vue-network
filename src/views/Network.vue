<template>
  <div class="network">
    <read-file @load="extractReadFile"/>
    <right-bar
    :targetCode="targetCode"
    ref="rightBar"
    />
    <main-network
    class="main-network__position"
    :loadData="readFileData"
    @edgeTap="catchEdgeTap"
    @nodeTap="catchNodeTap"
    />
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
      readFileData: {},
      targetCode: {}
    }
  },
  methods: {
    extractReadFile: function (data) {
      this.readFileData = data
      console.log('extract', data)
    },
    catchNodeTap: function (node) {
      console.log('node', node)
      let targetCode = {}
      targetCode.type = 'node'
      targetCode.node = node
      this.targetCode = targetCode
      this.$refs.rightBar.visible = true
    },
    catchEdgeTap: function (edge) {
      let targetCode = {}
      targetCode.type = 'edge'
      targetCode.node = edge
      this.targetCode = targetCode
      this.$refs.rightBar.visible = true
    }
  }
}
</script>

<style scoped>
.main-network__position {
  text-align: center;
}
.network {
}
</style>
