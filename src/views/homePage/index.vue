<template>
  <div
    class="homePage"
    :class="{
      scan: buildMode,
      confirm: !buildMode
    }"
  >
    <div class="height_1"></div>
    <Header />
    <div class="main" @click="toInputConfirm"></div>
    <div class="item">
      <Footer
        class="footer"
        :content="buildMode ? contentList[0] : contentList[1]"
      />
      <img v-if="buildMode" src="../../assets/tag.gif" alt="" />
    </div>
    <!-- 确认框 -->
    <el-dialog
      v-model="centerDialogVisible"
      title="操作确认"
      width="500"
      align-center
      @close="qrCodeData = ''"
      :close-on-click-modal="false"
    >
      <span>是否需要修改乘车信息？</span>
      <!-- <span>当前已选择-{{ rideFlag === '115001' ? '乘车' : '不乘车' }}-是否需要修改？</span> -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="toCheckHotelOrUserCar('n')">否</el-button>
          <el-button type="primary" @click="toCheckHotelOrUserCar('o')"
            >是</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Footer from '../../components/footer'
import Header from '../../components/header'
import Req from '../../utils/request'
export default {
  components: { Footer, Header },
  data() {
    return {
      buildMode: window.buildMode === 'scan',
      contentList: [
        {
          className: 'scanQRcodes',
          zh: '请在屏幕下方二维码扫码区域扫码签到',
          en: 'Please scan the QR code in the QR code scanningarea below the screen to sign in'
        },
        {
          className: 'confirmNumber',
          zh: '请输入您的确认号，以完成本次操作',
          en: 'Please enter your confirmation number to complete this operation'
        }
      ],
      rideFlag: '115001',
      hotelName: '',
      centerDialogVisible: false,
      qrCodeData: '',
      startX: 0 // 记录起始触摸位置
    }
  },
  mounted() {
    this.qrCodeData = ''
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL)
    })
    // 监听touchstart事件
    document.addEventListener('touchstart', this.handleTouchStart, false)
    // 监听touchmove事件
    document.addEventListener('touchmove', this.handleTouchMove, false)
    if (this.buildMode) {
      window.addEventListener('keydown', this.handleEnterKey)
    }
  },
  unmounted() {
    window.removeEventListener('keydown', this.handleEnterKey)
    document.removeEventListener('touchstart', this.handleTouchStart, false)
    document.removeEventListener('touchmove', this.handleTouchMove, false)
  },
  methods: {
    // 获取是否成功扫码
    getIsScanSuccess(value) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let formData = new FormData()
      formData.append('confirmationNumber', value)
      formData.append('airportType', window.airportType)
      formData.append(
        'terminal',
        window.airportType === '718004' ? 'T1' : window.terminal
      )
      Req.request(
        'post',
        this.buildMode
          ? '/fa-pro-boao/ignore/airportEquipment/scanCodeSign'
          : '/fa-pro-boao/ignore/airportEquipment/confirmationNumberSign',
        formData
      )
        .then(res => {
          if (res.code === 0 && res.data.signStatus) {
            this.rideFlag = res.data.rideFlag
            this.hotelName = res.data.hotel
            this.centerDialogVisible = true
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
          this.$router.replace({
            path: '/Fail',
            query: {
              content: err
            }
          })
        })
        .finally(() => {
          loading.close()
        })
    },
    toInputConfirm() {
      if (this.buildMode) return
      this.$router.replace('/inputConfirm')
    },
    confirmSuccess(params, flag) {
      let formData = new FormData()
      for (const key in params) {
        formData.append(key, params[key])
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      Req.request(
        'post',
        '/fa-pro-boao/ignore/airportEquipment/saveRideFlag',
        formData
      )
        .then(res => {
          if (res.code == 0) {
            if (flag === '115002') {
              this.$router.push({
                path: '/weChart',
                query: {
                  isCheckHotel: false
                }
              })
            } else {
              this.$router.push({
                path: '/checkHotel',
                query: {
                  confirmationNumber: this.value,
                  useCarNumber: 1,
                  value: this.hotelName ?? '~',
                  isConfirm: true
                }
              })
            }
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
    // 扫描确认号拿到当前状态
    // 保存数据并去选择酒店页面还是用车页面
    toCheckHotelOrUserCar(v) {
      if (v === 'n') {
        // 如果当前是乘车,选择否的话去选择酒店
        // 如果当前是不乘车,选择否的话取跳转完成页面
        this.confirmSuccess(
          {
            confirmationNumber: this.value,
            rideFlag: this.rideFlag, // 115001 是  115002 否
            ridingNumber: 1
          },
          this.rideFlag
        )
      } else {
        // 去用车页面
        this.$router.push({
          path: 'useCar',
          query: {
            value: 1,
            confirmationNumber: this.value
          }
        })
      }
    },
    handleEnterKey(event) {
      const char = event.key
      // 判断是否是回车键（Enter）
      if (char === 'Enter') {
        this.qrCodeData = this.qrCodeData.replace(/Shift/g, '')
        this.qrCodeData = this.qrCodeData.replace(/Control/g, '')
        this.qrCodeData = this.qrCodeData.replace(/ArrowDown/g, '')
        if (this.qrCodeData.indexOf('ArrowDown') != -1) {
          this.qrCodeData = ''
          return this.$message({
            type: 'error',
            dangerouslyUseHTMLString: true,
            showClose: true,
            message: '请勿重复扫码!'
          })
        }
        const str = this.qrCodeData
        this.value = this.qrCodeData
        this.qrCodeData = ''
        if (!this.centerDialogVisible) this.getIsScanSuccess(str)
      } else {
        this.qrCodeData += char
      }
    },
    handleTouchStart(e) {
      // 记录起始触摸位置
      this.startX = e.touches[0].clientX
    },
    handleTouchMove(e) {
      // 记录并比较当前触摸位置和起始触摸位置
      const currentX = e.touches[0].clientX
      const distance = currentX - this.startX

      if (distance < 0) {
        // 当滑动方向为向左时
        e.preventDefault() // 阻止默认滑动行为
      }
    }
  }
}
</script>

<style lang="less" scoped>
::v-deep .el-dialog {
  margin-top: 50% !important;
  transform: translateY(-50%);
}

.homePage {
  width: 1024px;
  height: 1280px;
  position: relative;

  &.confirm {
    background-image: url('../../assets/confirm.gif');
    background-repeat: no-repeat;
    background-size: cover;
  }

  &.scan {
    background-image: url('../../assets/扫码备份.png');
    background-repeat: no-repeat;
    background-size: cover;
  }

  .item {
    .footer {
      position: absolute;
      bottom: 70px;
      text-align: center;
      left: 50%;
      transform: translateX(-50%);
    }

    img {
      width: 110px;
      height: 110px;
      transform: rotate(180deg);
      position: absolute;
      bottom: 82px;
      right: 106px;
    }
  }
}

.main {
  width: 400px;
  height: 388px;
  margin: 20px auto;
  position: absolute;
  bottom: 425px;
  left: 50%;
  transform: translateX(-50%);
}
</style>