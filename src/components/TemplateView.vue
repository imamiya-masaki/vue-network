<template>
  <div class="CodeView">
    <highlightjs language="HTML" :code="code" class="highlightCode" :highlightLines="hilightLines" />
  </div>
</template>

<script>
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
    },
    hilightLines: {
      type: Object,
      default: () => ({})
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
  },
  watch: {
    hilightLines: function (value) {
    }
  }
}
</script>

<style scoped>
.highlightCode {
  text-align: left;
}
</style>
