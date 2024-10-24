<template>
  <div class="main">
    <div class="height_1"></div>
    <Header />
    <div class="keycodeWarp">
      <div class="face_pic">
        <el-button type="text" class="face_btn" @click="toFaceCheck()">人脸识别 Face recognition</el-button>
      </div>
      <doubleInput
        :confirmationNumber="confirmationNumber"
        ref="keyCode"
        :title="['姓名 Name', '确认号 Confirmation num']"
      ></doubleInput>
      <div class="buttonWarp">
        <div class="button" @click="$router.push('/')">上一步 back</div>
        <div class="button" @click="next">下一步 next step</div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../../components/header'
import doubleInput from './doubleInput.vue'
import Req from '../../utils/request'
export default {
  components: {
    Header,
    doubleInput
  },
  data() {
    return {
      centerDialogVisible: false,
      confirmationNumber: ''
    }
  },
  mounted() {
    if (this.$route.query.confirmationNumber) {
      this.confirmationNumber = this.$route.query.confirmationNumber
      
    }
    
  },
  methods: {
    // 点击下一步
    next() {
      const inputValue = this.$refs.keyCode.inputCode
      if (!inputValue) {
        this.$message({
          type: 'error',
          dangerouslyUseHTMLString: true,
          showClose: true,
          message: '请输入确认号或姓名以进行下一步!'
        })
        return
      }
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
                confirmationNumber: this.$refs.keyCode.inputCode
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
          this.$router.replace({
            path: '/Fail',
            query: {
              type: 'confirm'
            }
          })
        })
        .finally(() => {
          loading.close()
        })
    },
    /* 人脸识别 */
    toFaceCheck(){
      if (!this.$refs.keyCode.inputCode) {
        this.$message({
          type: 'error',
          dangerouslyUseHTMLString: true,
          showClose: true,
          message: '请输入确认号!'
        })
        return
      }
      this.$router.push({
        path: '/faceRecognition',
        query: {
          confirmationNumber: this.$refs.keyCode.inputCode
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  background-image: url(../../assets/背景.png);
}

.keycodeWarp {
  width: 952px;
  height: 999px;
  padding-top: 10px;
  margin: 0 auto;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  border-radius: 30px;
  box-sizing: border-box;
  background-color: #ffffff;
  overflow: auto;
  .face_pic {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 100px;
    box-sizing: border-box;
    .face_btn {
      font-size: 24px;
      font-family: PingFangSC, PingFang SC;
      color: #4170fa;
    }
  }
  .buttonWarp {
    width: 100%;
    height: 70px;
    display: flex;
    margin-top: 30px;
    .button {
      margin: 0 auto;
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
}
</style>