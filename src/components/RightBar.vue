<template>
  <div class="right_bar">
    <b-button v-if="buttonVisible" @click="onClick">Toggle Sidebar</b-button>
    <b-sidebar id="sidebar-right"  v-model="visible" right shadow width="600px">
      <div class="header">
        <div class="header__title">
          タイトル
        </div>
      </div>
      <div class="code-view">
      <span class="code-view__title"></span>
      <code-tab-view :template="sample"/>
      </div>
    </b-sidebar>
  </div>
</template>

<script>
// @ is an alias to /src
import CodeTabView from '@/components/CodeTabView'

export default {
  name: 'Home',
  components: {
    CodeTabView
  },
  props: {
    buttonVisible: {
      default: true,
      type: Boolean
    }
  },
  data () {
    return {
      visible: false,
      sample: `
      <template>
  <div class="right_bar">
    <b-button v-if="buttonVisible" @click="onClick">Toggle Sidebar</b-button>
    <b-sidebar id="sidebar-right" title="Sidebar"  v-model="visible" right shadow>
      <div class="px-3 py-2">
        <p>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis
          in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
        </p>
      </div>
      <code-view />
    </b-sidebar>
  </div>
</template>
`
    }
  },
  methods: {
    onClick: function () {
      this.visible = !this.visible
    }
  }
}
</script>

<style scoped>
.code-view__title {
  text-align: left;
}
.code-view {
  display: block;
}
.header__title {
  font-size: 150%;
  font-weight: 500;
  text-align: center;
}
</style>
