<template>
  <div class="container">
    <div class="gap_input" @click="keyClick">
      <p>{{ title }}</p>
      <el-input v-model="currValue" />
    </div>
    <div class="gap_keycode">
      <KeyboardCopy @onChange="onChange" :input="inputValue" />
    </div>
  </div>
</template>
<script>
import KeyboardCopy from './chKeyCode.vue'
export default {
  props: {
    inputValue: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  components: {
    KeyboardCopy
  },
  data() {
    return {
      keyShow: false,
      currValue: ''
    }
  },
  watch: {
    inputValue(val) {
      this.currValue = val
    }
  },
  methods: {
    onChange(value) {
      this.currValue = value
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  width: 100%;

  .gap_input {
    width: 752px;
    height: 144px;
    margin: 0 auto;

    .el-input {
      pointer-events: none;
    }

    p {
      margin-bottom: 40px; 
      font-size: 26px;
    }

    /deep/ .el-input__inner {
      border-radius: 0;
      font-size: 26px;
      width: 752px;
      height: 88px;
      background: #FFFFFF;
      border-radius: 10px;
      border: 1px solid #979797;
    }
  }

  .gap_keycode {
    width: 752px;
    margin: 0 auto;
    margin-top: 70px;
  }
}
</style>