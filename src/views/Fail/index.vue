<template>
  <div class="scanFail">
    <div class="height_1"></div>
    <Header />
    <div class="main">
      <div class="height_1"></div>
      <div class="logo">
        <img src="../../assets/失败.png" alt="" />
        <span>失败</span><br />
        <span>failed</span><br />
      </div>
      <div class="content">
        <div class="zh">{{ content.zh }}</div>
        <div class="en">{{ content.en }}</div>
      </div>
    </div>
    <div class="line"></div>
    <div class="circle" @click="back">×</div>
  </div>
</template>

<script>
import Header from '../../components/header'
export default {
  components: { Header },
  data() {
    return {
      content: {
        zh: '',
        en: ''
      }
    }
  },
  mounted() {
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL)
    })
    let type = this.$route.query.type
    if (type == 'scan') {
      this.content = {
        zh: '请检查您的设备是否正常，并确保您正在使用正确的二维码',
        en: 'Please check if your device is functioning properly and ensure that you are using the correct QR code'
      }
    } else {
      this.content = {
        zh: '您的确认号有误，请检查并重新输入',
        en: 'Your confirmation number is incorrect. Please check and re-enter it'
      }
    }
  },
  methods: {
    back() {
      if (this.$route.query.backScan != 'true') {
        this.$router.replace('/')
      } else {
        this.$router.replace({
          path: '/',
          query: {
            backScan: true
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.scanFail {
  width: 100%;
  height: calc(100% - 1px);
  background-image: url(../../assets/背景.png);
  overflow: hidden;
}

.main {
  width: 808px;
  height: calc(532px - 1px);
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
  border-radius: 30px;
  margin: 0 auto;
  margin-top: 167px;

  .logo {
    width: 153px;
    height: 263px;
    margin: 0 auto;
    margin-top: 60px;

    img {
      width: 100%;
      object-fit: center;
    }

    span {
      display: inline-block;
      width: 100%;
      text-align: center;
      height: 56px;
      font-size: 40px;
      font-weight: 400;
      color: #333333;
      line-height: 56px;
    }
  }

  .content {
    width: 80%;
    margin: 0 auto;
    text-align: center;
    margin-top: 60px;
    line-height: 2rem;
    font-size: 20px;
    font-weight: 400;
    color: #333333;
  }
}

.line {
  width: 4px;
  height: 111px;
  background: #fff;
  margin: 0 auto;
}

.circle {
  width: 68px;
  height: 68px;
  background: #fff;
  margin: 0 auto;
  border-radius: 50%;
  font-size: 45px;
  color: #1260fc;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>