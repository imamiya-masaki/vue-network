<template>
  <div class="right_bar">
    <b-button v-if="buttonVisible" @click="onClick">Toggle Sidebar</b-button>
    <b-sidebar id="sidebar-right"  v-model="visible" right shadow width="600px">
      <div class="code-view">
      <span class="code-view__title"></span>
      <code-tab-view :template="viewCode.template" :javaScript="viewCode.script"/>
      </div>
      <div class="detail">
        <div class="detail__title">
          {{ this.itemInfo.type }}
        </div>
        <div class="detail__name">
          {{ this.itemInfo.name }}
        </div>
        <div class="detail__path">
          {{ this.itemInfo.path }}
        </div>
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
    },
    targetCode: {
      default: () => ({ type: '' }),
      type: Object
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
  },
  computed: {
    viewCode () {
      if (!this.targetCode) {
        console.log('why targetCode undified or null ?')
        return {}
      }
      let targetCode = this.targetCode
      let template = ''
      let script = ''
      // これここでtypeで分けるのが良い形なのか不明なので後々帰るかも...
      if (targetCode.type === 'node') {
        const node = targetCode.node
        console.log('node', node)
        if (node.template) {
          template = node.template
        }
        if (node.script) {
          script = node.script
        }
      } else if (targetCode.type === 'edge') {
        const edge = targetCode.edge
        console.log('edge', edge, targetCode)
      }
      let output = { 'template': template, 'script': script }
      return output
    },
    itemInfo () {
      let targetCode = this.targetCode
      let item = {}
      const type = targetCode.type
      item.type = type
      if (type === 'node') {
        const node = targetCode.node
        item.name = node.name
        item.path = node.rawPath
      }
      return item
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
.detail__title {
  font-size: 150%;
  font-weight: 500;
}
.detail {
  display: block;
}
</style>
