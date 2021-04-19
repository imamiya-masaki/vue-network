<template>
  <div class="CodeView" v-if="isCode">
    <b-tabs>
      <b-tab
        :disabled="!template"
        title="template"
      >
        <template-view :code="template"/>
      </b-tab>
      <b-tab :disabled="!javaScript" title="script">
        <java-script-view :code="javaScript"/>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import Vue from 'vue'
import TemplateView from '@/components/TemplateView'
import JavaScriptView from '@/components/JavaScriptView'

export default {
  name: 'CodeView',
  components: {
    TemplateView,
    JavaScriptView
  },
  props: {
    javaScript: {
      default: null,
      type: String
    },
    template: {
      default: null,
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
  },
  computed: {
    isCode () {
      // console.log('javascript', this.javaScript)
      // console.log('template', this.template)
      return !!this.javaScript || !!this.template
    }
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
