<template>
  <div class="CodeView">
    <!-- <code-highlight language="Markup" class="line-numbers">
      {{ code }}
    </code-highlight> -->
    <!-- <prism-editor class="my-editor" v-model="takeCode" :highlight="highlighter" line-numbers/> -->
    <highlightjs autodetect :code="code" class="highlightCode"/>
  </div>
</template>

<script>
// @ is an alias to /src
// import CodeHighlight from 'vue-code-highlight/src/CodeHighlight.vue'
// import Prism from '@/plugins/prism.js'
// import highlighting library (you can use any library you want just return html string)
import Vue from 'vue'

export default {
  name: 'CodeView',
  components: {
    // CodeHighlight
    // PrismEditor
  },
  props: {
    code: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      visible: false,
      takeCode: this.code
    }
  },
  methods: {
    onClick: function () {
      this.visible = !this.visible
    }
    // highlighter (code) {
    //   return highlight(code, languages.js) // returns html
    // },
    // lineByLineHighilght: function (code) {
    //   let state = null
    //   return code.split('\n').map(function (row) {
    //     let result = hljs.highlight('html', row, true, state)
    //     state = result.top // result.topの状態を次に受け渡す
    //     return result.value + '<br/>'
    //   })
    // }
  },
  computed: {
    // highlighted () {
    //   const code = this.takeCode
    //   let state = null
    //   return code.split('\n').map(function (row) {
    //     let result = hljs.highlight('markdown', row, true, state)
    //     state = result.top // result.topの状態を次に受け渡す
    //     return result.value + '<br/>'
    //   }).join('\n')
    // }
  },
  mounted: function () {
  }
}
</script>

<style scoped>
.highlightCode {
  text-align: left;
}
</style>
