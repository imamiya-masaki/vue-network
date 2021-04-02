<template>
  <div class="MainNetwork" id="cy">
  </div>
</template>

<script>
import cytoscape from 'cytoscape'

export default {
  name: 'ReadFile',
  props: {
    loadData: {
    },
    edgeOption: {
    },
    vertexInfos: {
    }
  },
  data () {
    return {
      fileUpperCamelCase: true, // 後々ここフラグによって変化させたいので
      readFileOnly: false // 読み込んだファイルのみをネットワーク表示させる
    }
  },
  methods: {
    shapeEdges: function (datas = {}, option = {}) {
      const edges = []
      const nodes = {} // この地点ではcytoscapeに合わせれない
      // とりあえず
      // { counter: {}, pure: {}} 型の想定で行う
      for (const src of Object.keys(datas)) {
        if (option.readFileOnly && !option.readFileOnly.hasOwnProperty(src)) {
          // ReadFileOnlyがtrueでReadFileOnlyの中にpreが入っていなければ
          continue
        }
        nodes[src] = 1
        for (const [target, value] of Object.entries(datas[src].counter)) {
          if (option.readFileOnly && !option.readFileOnly.hasOwnProperty(target)) {
          // ReadFileOnlyがtrueでReadFileOnlyの中にtargetが入っていなければ
            continue
          }
          nodes[target] = 1
          const edge = { data: {} }
          edge.data.source = src
          edge.data.target = target
          edge.data.relationship = value
          edges.push(edge)
        }
      }
      return { vertexs: nodes, edges: edges }
    },
    shapeNodes: function (vertexs = [], vertexInfos = {}) {
      // vertexs はArrayでもらう。vertexInfosはObjectでもらう。
      const nodes = []
      for (const vertex of vertexs) {
        const node = { data: {} }
        node.data.id = vertex
        node.data.name = vertex
        if (vertexInfos.hasOwnProperty(vertex) && vertexInfos[vertex] && typeof vertexInfos[vertex] === 'object' && !Array.isArray(vertexInfos[vertex])) {
          for (const [key, value] of Object.entries(vertexInfos[vertex] || {})) {
            node.data[key] = value
          }
        }
        nodes.push(node)
      }
      return nodes
    },
    shapeDatas: function (datas = {}, edgeOption = {}, vertexInfos = {}) {
      const output = {}
      const preEdges = this.shapeEdges(datas, edgeOption)
      output.edges = preEdges.edges
      output.nodes = this.shapeNodes(Object.keys(preEdges.vertexs), vertexInfos)
      return output
    }
  },
  computed: {
    shapedData () {
      console.log('loadData', this.loadData)
      if (this.loadData && Object.keys(this.loadData).length > 0) {
        const processedData = this.shapeDatas(this.loadData, this.edgeOption, this.vertexInfos)
        console.log('processData', processedData)
        return processedData
      }
      return {}
    }
  },
  watch: {
    counter () {
    },
    loadData () {
      const data = this.shapeDatas(this.loadData)
      console.log('shapeData', data)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .MainNetwork {
  border: 0.5px solid;
  width: 700px;
  height: 500px;
 }
</style>
