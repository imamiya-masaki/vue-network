<template>
  <div class="ReadFile">
    <b-form-file v-model="file" class="mt-3" @input="readFile" multiple directory plain></b-form-file>
    <div class="mt-3">Selected file: {{ file ? file.name : '' }}</div>
    <button @click="readFile()">確認</button>
    {{ output }}
  </div>
</template>

<script>
import Worker1 from 'worker-loader!../workers/worker1'
export default {
  name: 'ReadFile',
  props: {
  },
  data () {
    return {
      file: null,
      reader: null,
      output: []
    }
  },
  methods: {
    readFile: function () {
      console.log('file', this.file)
      const files = this.file
      let output = []
      for (let item of files) {
        output.push(item.text())
      }
      return Promise.all(output)
        .then(items => {
          let output = []
          // console.log('ss', items)
          for (let itemIndex in items) {
            const worker = new Worker1()
            worker.onmessage = e => {
              // 設定?
              const { data } = e
              console.log('data', data)
              this.output.push(data)
              console.log('output', output)
              worker.terminate()
            }
            if (items[itemIndex]) {
              const chk = worker.postMessage(items[itemIndex])
              console.log('chk', chk)
            }
          }
          console.log('promises', output, this.output)
        }
        )
    },
    testWorker: function () {
      const worker = new Worker1()
      worker.onmessage = e => {
        // 設定?
        const { data } = e
        console.log('data', data)
        worker.terminate()
      }
      worker.postMessage(100)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.ReadFile {
}
</style>
