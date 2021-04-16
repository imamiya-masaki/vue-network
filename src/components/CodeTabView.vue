<template>
  <div class="CodeView">
    <b-tabs>
      <b-tab v-if="template" title="template" >
        <template-view :code="template"/>
      </b-tab>
      <b-tab v-if="javaScript" title="script">
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
