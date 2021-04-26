import { mount } from '@vue/test-utils'
import CodeTabView from '@/components/CodeTabView.vue'

describe('CodeTabView', () => {
  const wrapper = mount(CodeTabView)
  console.log('test')
  // const testTemplate = `<template>
  // <div class="test">
  // <span class="test-span__test">
  // test-aaa
  // {{ istestProp }}
  // </span>
  // <div class="test-div__test"></div>
  // </div>
  // </template>`

  // const testScript = `export default {
  //   name: 'testScrip',
  //   components: {
  //   },
  //   props: {
  //     testProp: {
  //       default: null,
  //       type: String
  //     }
  //   },
  //   data () {
  //     return {
  //       testData: null,
  //       testBool: false
  //     }
  //   },
  //   methods: {
  //     onClick: function () {
  //       this.testBool = !this.testBool
  //     }
  //   },
  //   computed: {
  //     istestProp () {
  //       return testProp
  //     }
  //   },
  //   mounted: function () {
  //   },
  //   watch: {
  //     templateHilightLines: function (value) {
  //     }
  //   }
  // }
  // `
  it('b-tab check', () => {
    const wrapper = mount(CodeTabView)
    // const bTab = wrapper.findAll('div').at(0)
    console.log('wrapper', wrapper)
    expect(wrapper.is(CodeTabView)).toBe(true)

  })
})