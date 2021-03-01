<template>
  <div class="network">
    <ReadFile/>
  </div>
</template>

<script>
// @ is an alias to /src
import ReadFile from '@/components/ReadFile.vue'
export default {
  name: 'Network',
  components: {
    ReadFile
  }
}
</script>
