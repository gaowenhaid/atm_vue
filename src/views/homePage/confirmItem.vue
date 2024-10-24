<template>
  <div
    class="homePage confirm"
  >
    <div class="height_1"></div>
    <Header />
    <div class="main" @click="toInputConfirm"></div>
    <div class="item">
      <Footer
        class="footer"
        :content=" contentList[1]"
      />
    </div>
  </div>
</template>

<script>
import Footer from '../../components/footer'
import Header from '../../components/header'
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
          zh: '请输入您的姓名/确认号完成签到',
          en: 'Please enter your name or confirmation number to complete the check-in process'
        }
      ],
      rideFlag: '115001',
      hotelName: '',
      startX: 0 // 记录起始触摸位置
    }
  },
  mounted() {
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL)
    })
    // 监听touchstart事件
    document.addEventListener('touchstart', this.handleTouchStart, false)
    // 监听touchmove事件
    document.addEventListener('touchmove', this.handleTouchMove, false)
  },
  unmounted() {
    window.removeEventListener('keydown', this.handleEnterKey)
    document.removeEventListener('touchstart', this.handleTouchStart, false)
    document.removeEventListener('touchmove', this.handleTouchMove, false)
  },
  methods: {
    toInputConfirm() {
      this.$router.replace('/inputConfirm')
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