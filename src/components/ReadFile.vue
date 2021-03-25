<template>
  <div class="ReadFile">
    <b-form-file v-if="!reader" v-model="file" class="mt-3" @input="readFile" multiple directory plain></b-form-file>
    <div class="mt-3">Selected file: {{ file ? file.name : '' }}</div>
    <button @click="readFile()">確認</button>
  </div>
</template>

<script>
import FileParseWorker from 'worker-loader!@/workers/FileParseWorker'
export default {
  name: 'ReadFile',
  props: {
  },
  data () {
    return {
      file: null,
      reader: false,
      output: [],
      count: 0,
      counter: 0
    }
  },
  methods: {
    readFile: function () {
      const files = this.file
      let output = []
      this.output = []
      for (let item of files) {
        output.push(item.text())
      }
      this.count = files.length
      return Promise.all(output)
        .then(items => {
          this.reader = true
          // console.log('ss', items)
          for (let itemIndex in items) {
            const worker = new FileParseWorker()
            worker.onmessage = e => {
              // 設定?
              const { data } = e
              if (typeof data !== 'string' && data.length !== 0) {
                this.output.push(data)
              }
              this.counter++
              worker.terminate()
            }
            if (items[itemIndex]) {
              worker.postMessage(items[itemIndex])
            }
          }
        }
        )
    },
    testWorker: function () {
      const worker = new FileParseWorker()
      worker.onmessage = e => {
        // 設定?
        const { data } = e
        console.log('data', data)
        worker.terminate()
      }
      worker.postMessage(100)
    }
  },
  watch: {
    counter () {
      if (this.counter === this.count) {
        this.reader = false
        console.log('reloaded', this.output)
        this.$emit('reloaded', this.output)
      }
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
  text-align: left;
}
</style>
