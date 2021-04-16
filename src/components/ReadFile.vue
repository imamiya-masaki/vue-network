<template>
  <div class="ReadFile">
    <b-form-file v-if="!reader" v-model="files" class="mt-3" @input="readFile" multiple directory plain></b-form-file>
    <div class="mt-3">ファイル数: {{ files ? files.length : 0 }}</div>
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
      files: null,
      reader: false,
      output: [],
      outputObject: {},
      pathToNameObject: {},
      count: 0,
      counter: 0
    }
  },
  methods: {
    checkVueFile: function (file) {
      const fileNameSpl = file.name.split('.')
      if (fileNameSpl.length <= 1 || fileNameSpl[fileNameSpl.length - 1] !== 'vue') {
        return false
      } else {
        return true
      }
    },
    async extractVue (file) {
      // vueファイルを取り出す
      // vueファイルはtypeで識別できないので、nameの末尾で判定する
      const fileNameSpl = file.name.split('.')
      const IntermediatePath = file.$path.split('/').slice(1, file.$path.split('/').length - 1)
      const output = { text: await file.text(), name: fileNameSpl.slice(0, fileNameSpl.length - 1).join('.'), path: IntermediatePath, rawPath: file.$path }
      return output
    },
    readFile: function () {
      const files = this.files
      let output = []
      this.output = []
      this.counter = 0
      this.outputObject = {}
      for (let item of files) {
        if (this.checkVueFile(item)) {
          const res = this.extractVue(item)
          output.push(res)
        }
      }
      this.count = output.length
      return Promise.all(output)
        .then(items => {
          console.log('fileCheck', files, items)
          this.reader = true
          // console.log('ss', items)
          for (let itemIndex in items) {
            const worker = new FileParseWorker()
            worker.onmessage = e => {
              // 設定?
              const { data } = e
              if (typeof data !== 'string' && data.length !== 0) {
                this.output.push(data.path)
                this.outputObject[data.path] = {
                  ...data.data,
                  name: data.name,
                  rawPath: data.rawPath,
                  template: data.rawTemplate,
                  script: data.rawScript
                }
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
        console.log('reloaded', this.output, this.outputObject)
        this.$emit('load', this.outputObject)
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
