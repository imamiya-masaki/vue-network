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
      readFileOnly: false, // 読み込んだファイルのみをネットワーク表示させる
      cytoscapeData: {}
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
        for (const [target, value] of Object.entries(datas[src].counter || {})) {
          if (option.readFileOnly && !option.readFileOnly.hasOwnProperty(target)) {
          // ReadFileOnlyがtrueでReadFileOnlyの中にtargetが入っていなければ
            continue
          }
          nodes[target] = 1
          const edge = { data: {} }
          edge.data.source = src
          edge.data.target = target
          edge.data.count = value
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
        node.data.name = vertex // ここ、ユーザー側で名前の表示にできるようにしたい....
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
    },
    setNetwork: function () {
      this.cy = cytoscape(
        {
          container: document.getElementById('cy'),
          // boxSelectionEnabled: false,
          // autounselectify: false,
          style: this.shapeStyle,
          elements: this.cytoscapeData,
          layout: {
            left: 0,
            name: 'breadthfirst'
          }
        }
      )
      // なぜか画面が半分になってしまうので致し方ない処理...
      const canvas = document.querySelector('canvas[data-id="layer2-node"]')
      canvas.style.position = 'relative'
    }
  },
  computed: {
    shapedData () {
      if (this.loadData && Object.keys(this.loadData).length > 0) {
        const processedData = this.shapeDatas(this.loadData, this.edgeOption, this.vertexInfos)
        console.log('processData', processedData)
        return processedData
      }
      return {}
    },
    shapeStyle () {
      const styles = []
      styles.push({
        selector: 'code',
        css: {
          'width': 100
        }
      })
      styles.push({
        selector: 'node',
        css: {
          'height': 80,
          'width': 80,
          'background-fit': 'cover',
          'border-color': '#000',
          'border-width': 3,
          'border-opacity': 0.5,
          'content': 'data(name)',
          'text-valign': 'center'
        }
      })
      styles.push({
        selector: 'edge',
        css: {
          'width': 6,
          'target-arrow-shape': 'triangle',
          'line-color': '#ffaaaa',
          'target-arrow-color': '#ffaaaa',
          'curve-style': 'bezier',
          'content': 'data(count)'
        }
      })
      for (let key of Object.keys(this.loadData || {})) {
        // fileとして存在しているnodeを特別な表示する
        let style = {}
        style.selector = `node[id = "${key}"]`
        style.css = {
          'background-color': '#F5A45D'
        }
        styles.push(style)
      }
      return styles
    }
  },
  watch: {
    counter () {
    },
    loadData () {
      console.log('loadData', this.loadData)
      const data = this.shapeDatas(this.loadData)
      this.cytoscapeData = data
      console.log('cytoscapeData', data)
      this.cy = {}
      this.setNetwork()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .MainNetwork {
  border: 0.5px solid;
  width: 1000px;
  height: 700px;
 }
 #cy {
 }
</style>
