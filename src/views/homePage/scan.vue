<template>
  <div class="homePage scan">
    <div class="height_1"></div>
    <Header />
    <div class="item">
      <Footer class="footer" :content="contentList[0]" />
      <img src="../../assets/tag.gif" alt="" />
    </div>
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
      contentList: [
        {
          className: 'scanQRcodes',
          zh: '请在屏幕下方二维码扫码区域亮码签到',
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
      qrCodeData: '',
      startX: 0, // 记录起始触摸位置
      loading: null
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
    window.addEventListener('keydown', this.handleEnterKey)
  },
  unmounted() {
    window.removeEventListener('keydown', this.handleEnterKey)
    document.removeEventListener('touchstart', this.handleTouchStart, false)
    document.removeEventListener('touchmove', this.handleTouchMove, false)
    this.loading = null
  },
  methods: {
    // 获取是否成功扫码
    getIsScanSuccess(value) {
      this.loading = this.$loading({
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
        '/fa-pro-boao/ignore/airportEquipment/scanCodeSign',
        formData
      )
        .then(res => {
          if (res.code === 0) {
            if (res.data.rideFlag == '115002') {
              this.$router.push({
                path: '/weChart',
                query: {
                  isCheckHotel: false,
                  backScan: true
                }
              })
            } else {
              // 跳转打印页面
              this.$router.push({
                path: '/weChart',
                query: {
                  isCheckHotel: true,
                  id: res.data.id,
                  typeName: res.data.vehicleType,
                  location: res.data.hotel + '&' + res.data.hotelEn,
                  backScan: true
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
          this.$router.replace({
            path: '/Fail',
            query: {
              backScan: true,
              type: 'scan'
            }
          })
        })
        .finally(() => {
          this.loading.close()
        })
    },
    handleEnterKey(event) {
      const char = event.key
      // 判断是否是回车键（Enter）
      if (char === 'Enter') {
        this.qrCodeData = this.qrCodeData.replace(/Shift/g, '')
        this.qrCodeData = this.qrCodeData.replace(/Control/g, '')
        this.qrCodeData = this.qrCodeData.replace(/ArrowDown/g, '')
        this.qrCodeData = this.qrCodeData.replace(/CapsLock/g, '')
        this.qrCodeData = this.qrCodeData.replace(/Alt/g, '')
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
        if(!this.loading) this.getIsScanSuccess(str)
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
</style>