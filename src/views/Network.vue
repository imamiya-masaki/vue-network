<template>
  <div class="network">
    <ReadFile/>
    <main-network class="main-network__position"/>
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
  }
}
</script>

<style scoped>
.main-network__position {
  margin-left: auto;
  margin-right: auto
}
</style>
