<template>
  <div class="main">
    <div class="height_1"></div>
    <Header />
    <div class="weChartWarp">
      <div v-if="useCar" class="useCar">
        <div class="height_1"></div>
        <div class="header">
          <div class="image">
            <img src="../../assets/码.png" alt="" />
          </div>
          <div class="tips">
            <p>请扫描二维码查看乘车二维码以及获取更多年会服务</p>
            <p class="en">
              Please scan the QR code to view the ride QR code and obtain more
              annual conference services
            </p>
          </div>
          <div class="location">
            <div class="left">
              目的地 <br />
              destination
            </div>
            <div class="right">
              {{ location && location.length && location[0] }} <br />
              {{ location && location.length && location[1] }}
            </div>
          </div>
          <p class="btn" @click.prevent="back">
            返回首页 homepage
            <!-- 返回首页 homepage ({{ second }}s) -->
          </p>
        </div>
        <div class="footer">
          <p>
            乘车小票正在为您打印中 <br />
            The train ticket is currently being printed for you
          </p>
          <img src="../../assets/tag.gif" alt="" />
        </div>
      </div>
      <div v-else class="notUseCar">
        <div class="height_1"></div>
        <div class="status">
          <img src="../../assets/成功.png" alt="" />
          <span>签到成功 <i>Successful check-in</i></span>
        </div>
        <div class="image">
          <img src="../../assets/码.png" alt="" />
        </div>
        <div class="tips">
          请扫描二维码获取更多年会服务<br />
          <i>Please scan the QR code for more annual conference services</i>
        </div>
        <p class="btn" @click.prevent="back">
          返回首页 homepage
          <!-- 返回首页 homepage ({{ second }}s) -->
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../../components/header'
import axios from 'axios'
export default {
  components: {
    Header
  },
  data() {
    return {
      useCar: this.$route.query.isCheckHotel === 'true', // 是否用车点进来的
      second: 10,
      timer: null,
      location: '',
      helper: null,
      id: '',
      printName: 'A', // 709001 小车代表   709002 统调代表
      startX: 0, // 记录起始触摸位置
      printTimer: null
    }
  },
  mounted() {
    history.pushState(null, null, document.URL)
    this.id = this.$route.query.id
    this.printName = this.$route.query.typeName === '709001' ? 'A' : 'B'
    window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL)
    })
    // 监听touchstart事件
    document.addEventListener('touchstart', this.handleTouchStart, false)
    // 监听touchmove事件
    document.addEventListener('touchmove', this.handleTouchMove, false)
    if (this.useCar) {
      this.location = this.$route.query.location.split('&')
      this.printTimer = setTimeout(() => {
        this.initIo()
      }, 1300)
    }
    // else {
    //   this.timer = setInterval(() => {
    //     this.second -= 1
    //     if (this.second <= 0) {
    //       clearInterval(this.timer)
    //       this.timer = null
    //       this.$router.push('/')
    //     }
    //   }, 1000)
    // }
  },
  methods: {
    back() {
      if (this.$route.query.backScan != 'true') {
        this.$router.replace('/')
      } else {
        this.$router.replace({
          path: '/',
          query:{
            backScan:true
          }
        })
      }
    },
    initIo() {
      this.helper = new PrintHelper()
      this.helper.open(TX_TYPE_USB, 686381074)
      this.helper.init()
      // 左侧写一个b 或者a根据角色判断
      this.helper.doFunction(TX_FEED, 2, 0)
      this.helper.doFunction(TX_FONT_BOLD, TX_ON, 0)
      this.helper.doFunction(TX_FONT_SIZE, TX_SIZE_2X, TX_SIZE_2X)
      this.helper.doFunction(TX_UNIT_TYPE, TX_UNIT_MM, 0)
      this.helper.doFunction(TX_ALIGN, TX_ALIGN_LEFT, 0)
      this.helper.doFunction(TX_HOR_POS, 5, -10)
      this.helper.addStringLn(this.printName)
      this.helper.resetFont()
      // 图片
      this.helper.doFunction(TX_ALIGN, TX_ALIGN_RIGHT, 0)
      this.helper.printImage('file:///D:/100-200.jpg')
      // 左侧是当前打印时间
      this.helper.doFunction(TX_FEED, 2, 0)
      this.helper.doFunction(TX_ALIGN, TX_ALIGN_LEFT, 0)
      this.helper.addStringLn(`打印时间： ${this.getNowTimeCode()}`)
      this.helper.resetFont()
      // 中间是一个二维码
      this.helper.doFunction(TX_FEED, 4, 0)
      this.helper.doFunction(TX_ALIGN, TX_ALIGN_CENTER, 0)
      this.helper.doFunction(TX_QR_DOTSIZE, 6, 0)
      this.helper.doFunction(TX_QR_ERRLEVEL, TX_QR_ERRLEVEL_M, 0)
      this.helper.printQRcode(this.id)
      this.helper.resetFont()
      // 下划线
      this.helper.doFunction(TX_FEED, 5, 0)
      this.helper.doFunction(TX_FONT_BOLD, TX_ON, 0)
      this.helper.addStringLn('------------------------------------------')
      this.helper.resetFont()
      // 目的地
      this.helper.doFunction(TX_FONT_BOLD, TX_ON, 0)
      this.helper.addStringLn(
        `      目的地          ${this.location[0] ?? '~'}`
      )
      // 下划线
      this.helper.doFunction(TX_FONT_BOLD, TX_ON, 0)
      this.helper.addStringLn('------------------------------------------')
      // 目的地英文
      this.helper.doFunction(TX_FONT_BOLD, TX_ON, 0)
      this.helper.addStringLn(`  DESTINATION     ${this.location[1] ?? '~'}`)
      this.helper.resetFont()
      // TIPS
      this.helper.doFunction(TX_FEED, 5, 0)
      this.helper.doFunction(TX_ALIGN, TX_ALIGN_CENTER, 0)
      this.helper.addStringLn('请持小票前往乘车点乘车')
      this.helper.addStringLn('Please bring your ticket to the')
      this.helper.addStringLn('boardingpoint to board the train')
      // 剪短打印纸
      this.helper.doFunction(TX_CUT, TX_CUT_FULL, 5, 'cut')
      this.helper.close()
      // const status = this.helper.doFunction(TX_CUT, TX_CUT_FULL, 5, 'cut')
      // if (status === 'end') {
      //   this.timer = setInterval(() => {
      //     this.second -= 1
      //     if (this.second <= 0) {
      //       this.helper.close()
      //       clearInterval(this.timer)
      //       this.timer = null
      //       this.$router.push('/')
      //     }
      //   }, 1000)
      // }
      axios('http://127.0.0.1:54321/print', {
        method: 'POST',
        data: this.helper.getAllContent(),
        contentType: 'text/plain',
        dataType: 'json'
      }).then(res => {
        console.log(res)
      })
    },
    getNowTimeCode() {
      let currentTime = new Date()
      let year = currentTime.getFullYear() // 获取当前年份
      let month = currentTime.getMonth() + 1 // 获取当前月份（注意月份是从0开始的，所以要加1）
      let date = currentTime.getDate() // 获取当前日期
      let hours = currentTime.getHours() // 获取当前小时
      let minutes = currentTime.getMinutes() // 获取当前分钟
      let seconds = currentTime.getSeconds() // 获取当前秒数
      // 补全月份、日期、小时、分钟和秒数，使其始终为两位数
      month = month < 10 ? '0' + month : month
      date = date < 10 ? '0' + date : date
      hours = hours < 10 ? '0' + hours : hours
      minutes = minutes < 10 ? '0' + minutes : minutes
      seconds = seconds < 10 ? '0' + seconds : seconds
      return (
        year +
        '-' +
        month +
        '-' +
        date +
        ' ' +
        hours +
        ':' +
        minutes +
        ':' +
        seconds
      )
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
  },
  unmounted() {
    document.removeEventListener('touchstart', this.handleTouchStart, false)
    document.removeEventListener('touchmove', this.handleTouchMove, false)
    // clearInterval(this.timer)
    clearInterval(this.printTimer)
    // this.timer = null
    this.helper = null
    this.printTimer = null
  }
}
</script>

<style scoped lang="less">
.main {
  width: 100%;
  height: 100%;
  background-image: url(../../assets/背景.png);
  background-repeat: no-repeat;

  .weChartWarp {
    width: 952px;
    height: 1017px;
    margin: 0 auto;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
    border-radius: 30px;
    box-sizing: border-box;
    background-color: #fff;
    box-sizing: border-box;

    .useCar {
      .header {
        width: 852px;
        margin: 0 auto;
        margin-top: 88px;

        .image {
          width: 417px;
          height: 348px;
          margin: 0 auto;
          text-align: center;
          img {
            height: 100%;
            object-fit: cover;
          }
        }

        .tips {
          width: 100%;
          font-size: 30px;
          font-family: PingFangSC, PingFang SC;
          font-weight: 400;
          color: #333333;

          p {
            text-align: center;
            width: 100%;
            margin-top: 10px;

            &.en {
              font-size: 24px;
            }
          }
        }

        .location {
          width: 100%;
          height: 99px;
          background: #f6f8ff;
          border-radius: 10px;
          margin-top: 50px;
          display: flex;

          > div {
            width: 50%;
            height: 100%;
            line-height: 2rem;
            padding-top: 20px;
            color: #333333;
            font-family: PingFangSC, PingFang SC;
            box-sizing: border-box;
            font-size: 20px;

            &.left {
              padding-left: 10px;
              font-weight: 400;
            }

            &.right {
              padding-right: 10px;
              text-align: end;
              font-weight: 900;
            }
          }
        }

        .btn {
          width: 312px;
          height: 68px;
          background: #4170fa;
          border-radius: 10px;
          text-align: center;
          line-height: 68px;
          color: #fff;
          margin: 0 auto;
          margin-top: 50px;
        }
      }

      .footer {
        height: 70px;
        width: 90%;
        margin: 0 auto;
        margin-top: 74px;
        padding-left: 10px;
        font-weight: 400;
        color: #000;
        font-family: PingFangSC, PingFang SC;
        box-sizing: border-box;
        line-height: 2rem;
        font-size: 28px;

        img {
          width: 68px;
          height: 68px;
          transform: rotate(180deg);
        }
      }
    }

    .notUseCar {
      .status {
        width: 332px;
        height: 116px;
        margin: 0 auto;
        margin-top: 46px;
        display: flex;
        align-items: center;
        line-height: 1.5rem;
        font-size: 26px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #333333;

        span {
          i {
            font-size: 20px;
            font-style: normal;
          }
        }
      }

      .image {
        width: 587px;
        height: 425px;
        margin: 0 auto;
        margin-top: 13px;
        text-align: center;
        margin-bottom: 45px;

        img {
          height: 100%;
          object-fit: cover;
        }
      }

      .tips {
        width: 699px;
        height: 66px;
        margin: 0 auto;
        text-align: center;
        line-height: 2rem;
        font-size: 30px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #333333;

        > i {
          font-size: 24px;
          font-style: normal;
        }
      }

      .btn {
        width: 312px;
        height: 68px;
        background: #4170fa;
        border-radius: 10px;
        text-align: center;
        line-height: 68px;
        color: #fff;
        margin: 0 auto;
        margin-top: 78px;
      }
    }
  }
}
</style>