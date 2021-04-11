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

<script>
// @ is an alias to /src
import CodeView from '@/components/CodeView'

export default {
  name: 'Home',
  components: {
    CodeView
  },
  props: {
    buttonVisible: {
      default: true,
      type: Boolean
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
  }
}
</script>
