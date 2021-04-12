<template>
  <div class="CodeView">
    <!-- <code-highlight language="Markup" class="line-numbers">
      {{ code }}
    </code-highlight> -->
    <prism-editor class="my-editor" v-model="takeCode" :highlight="highlighter" line-numbers/>
  </div>
</template>

<script>
// @ is an alias to /src
// import CodeHighlight from 'vue-code-highlight/src/CodeHighlight.vue'
// import Prism from '@/plugins/prism.js'
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css' // import the styles somewhere
// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/themes/prism-tomorrow.css'
import 'vue-code-highlight/themes/prism-okaidia.css'
export default {
  name: 'CodeView',
  components: {
    // CodeHighlight
    PrismEditor
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
    },
    highlighter (code) {
      return highlight(code, languages.js) // returns html
    }
  },
  mounted: function () {
  }
}
</script>

<style scoped>
.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: #cfcfcf;
  color: rgb(119, 115, 115);

  /* you must provide font-family font-size line-height. Example: */
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  width: 500px;
  height: 10000px;
  overflow-x: scroll;
  padding: 5px;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}
</style>
