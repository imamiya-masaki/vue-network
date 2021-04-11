<template>
  <div class="CodeView">
    <code-highlight language="Markup">
      {{ code }}
    </code-highlight>
  </div>
</template>

<script>
// @ is an alias to /src
import CodeHighlight from 'vue-code-highlight/src/CodeHighlight.vue'
import 'vue-code-highlight/themes/prism-okaidia.css'
export default {
  name: 'CodeView',
  components: {
    CodeHighlight
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
