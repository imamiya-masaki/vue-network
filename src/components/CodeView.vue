<template>
  <div class="CodeView">
    <pre>
    </pre>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'CodeView',
  components: {
  },
  props: {
    code: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      visible: false
    }
  },
  methods: {
    onClick: function () {
      this.visible = !this.visible
    }
  },
  mounted: function () {
    const prettyPrint = require('code-prettify')
    console.log('preti', prettyPrint)
  }
}
</script>

<style scoped>
</style>
