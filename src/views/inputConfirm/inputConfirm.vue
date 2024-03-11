<template>
  <div class="main">
    <div class="height_1"></div>
    <Header />
    <div class="keycodeWarp">
      <KeyIndex ref="keyCode" :title="'确认号 Confirmation num'"></KeyIndex>
      <div class="button" @click="next">下一步 next step</div>
    </div>
  </div>
</template>

<script>
import KeyIndex from '../../components/keyCode/index.vue'
import Header from '../../components/header'
import Req from '../../utils/request'
export default {
  components: {
    KeyIndex,
    Header
  },
  data() {
    return {
      centerDialogVisible: false,
    }
  },

  methods: {
    // 点击下一步
    next() {
      const inputValue = this.$refs.keyCode.currValue
      if (!inputValue) return
      let formData = new FormData()
      formData.append('confirmationNumber', inputValue)
      formData.append('airportType', window.airportType)
      formData.append(
        'terminal',
        window.airportType === '718004' ? 'T1' : window.terminal
      )
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      Req.request(
        'post',
        '/fa-pro-boao/ignore/airportEquipment/confirmationNumberSign',
        formData
      )
        .then(res => {
          if (res.code == 0) {
            // 去用车页面
            this.$router.replace({
              path: 'useCar',
              query: {
                value: 1,
                confirmationNumber: this.$refs.keyCode.currValue
              }
            })
          } else {
            this.$router.replace({
              path: '/Fail',
              query: {
                content: ''
              }
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            dangerouslyUseHTMLString: true,
            showClose: true,
            message: err
          })
        })
        .finally(() => {
          loading.close()
        })
    },
  }
}
</script>

<style lang="less" scoped>
::v-deep .el-dialog {
  margin-top: 50% !important;
  transform: translateY(-50%);
}

.main {
  width: 100%;
  height: 100%;
  background-image: url(../../assets/背景.png);
}

.keycodeWarp {
  width: 952px;
  height: 1017px;
  padding-top: 60px;
  margin: 0 auto;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  border-radius: 30px;
  box-sizing: border-box;
  background-color: #ffffff;

  .button {
    margin: 0 auto;
    margin-top: 146px;
    width: 262px;
    height: 68px;
    background: #4170fa;
    border-radius: 10px;
    text-align: center;
    line-height: 68px;
    font-size: 24px;
    font-family: PingFangSC, PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }
}
</style>