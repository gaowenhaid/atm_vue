<template lang="">
  <div class="main">
    <div class="height_1"></div>
    <Header />
    <div class="useCarWarp">
      <div class="content">
        <p>是否使用年会统调接机车辆</p>
        <p>Whether to use annual meeting coordinationand pick-up vehicles</p>
        <img src="../../assets/车.png" alt="">
      </div>
      <div class="line">
        <div class="left">
          <p></p>
          <p></p>
        </div>
        <div class="right">
          <p></p>
          <p></p>
        </div>
      </div>
      <div class="content bottomContent">
        <div class="noFooter">
          <p>参会嘉宾 Attending guests</p>
        <div class="input noTitle">
          <span>{{ selectPerson.name }}</span>
          <span>{{ selectPerson.orgName }} </span>
          <span>{{ selectPerson.position}}</span>
        </div>
        <p>乘车人数 Number of passe</p>
        <div class="input" @click.prevent="toInputPersonNumber">{{ useCarNumber }}</div>
        </div>
        <div class="btns">
          <p class="yes" @click.prevent="toCheckHotel">是 Yes</p>
          <p class="no" @click.prevent="toQRcODE">否 No</p>
        </div>
      </div>
      <p class="back" @click.prevent="backTep">上一步 Back</p>
    </div>
  </div>
</template>

<script>
import Header from '../../components/header'
import Req from '../../utils/request'
export default {
  components: {
    Header
  },
  data() {
    return {
      useCarNumber: '1', // 乘车人数
      confirmationNumber: '', // 确认号
      selectPerson: {}
    }
  },
  mounted() {
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL)
    })
    let { value, confirmationNumber } = this.$route.query // 乘车人数
    if (confirmationNumber) this.confirmationNumber = confirmationNumber // 确认号
    if (value) {
      this.useCarNumber = value
    } else {
      this.useCarNumber = 1
    }
    this.getPerson(confirmationNumber)
  },
  methods: {
    // 点击输入乘车人数
    toInputPersonNumber() {
      this.$router.replace({
        path: '/inputHotelName',
        query: {
          type: 'number',
          confirmationNumber: this.confirmationNumber
        }
      })
    },
    // 去乘车选择酒店(确定)
    toCheckHotel() {
      if (
        Number(this.useCarNumber).toString() != 'NaN' &&
        Number(this.useCarNumber) >= 1
      ) {
        const params = {
          confirmationNumber: this.confirmationNumber,
          rideFlag: '115001', // 115001 是  115002 否
          ridingNumber: this.useCarNumber
        }
        this.confirmSuccess(params, '115001')
      } else {
        this.$message({
          type: 'error',
          dangerouslyUseHTMLString: true,
          showClose: true,
          message: '只能输入大于等于1的数字!'
        })
      }
    },
    toQRcODE() {
      // 确认号方式 | 选择了不乘车  | 直接跳转小程序二维码页面
      const params = {
        confirmationNumber: this.confirmationNumber,
        rideFlag: '115002', // 115001 是  115002 否
        ridingNumber: 1
      }
      this.confirmSuccess(params, '115002')
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
              this.$router.replace({
                path: '/weChart',
                query: {
                  isCheckHotel: false
                }
              })
            } else {
              this.$router.replace({
                path: '/checkHotel',
                query: {
                  confirmationNumber: this.confirmationNumber,
                  useCarNumber: this.useCarNumber
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
    backTep() {
      this.$router.replace({
        path: '/inputConfirm',
        query: {
          confirmationNumber: this.$route.query.confirmationNumber
        }
      })
    },
    getPerson(v) {
      let formData = new FormData()
      formData.append('confirmationNumber', v)
      Req.request(
        'post',
        '/fa-pro-boao/ignore/airportEquipment/getRegInfoByName',
        formData
      )
        .then(res => {
          if (res.code == 0 && res.data.length) {
            this.selectPerson = res.data[0]
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
    }
  }
}
</script>

<style lang="less" scoped>
* {
  box-sizing: border-box;
}
.main {
  width: 100%;
  height: 100%;
  background-image: url(../../assets/背景.png);

  .useCarWarp {
    width: 952px;
    height: 1017px;
    padding-top: 60px;
    margin: 0 auto;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
    border-radius: 30px;
    box-sizing: border-box;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .content {
      width: 747px;
      height: 230px;
      background: #f6f8ff;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 100px;
      box-sizing: border-box;
      position: relative;
      margin-top: 10px;
      p {
        width: 100%;
        text-align: center;
        margin-bottom: 10px;
        font-size: 26px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #333333;
      }

      img {
        position: absolute;
        top: -53px;
        right: 15px;
        /* animation：动画名称 持续时间 运动曲线(匀速linear) 何时开始 播放次数(无限infinite ) 是否反方向(逆播放alternate) 动画起始或者结束的状态(保持forwards/回到起始backwards); */
        animation: car 1.5s linear infinite;
      }

      .btns {
        display: flex;
        margin-top: 42px;
        justify-content: space-evenly;

        p {
          width: 190px;
          height: 70px;
          border-radius: 10px;
          text-align: center;
          line-height: 70px;

          &.yes {
            background: #4170fa;
            color: #ffffff;
          }

          &.no {
            background: #ffffff;
            color: #4170fa;
          }
        }
      }
    }

    .bottomContent {
      display: block;
      padding: 26px 30px 20px 30px;
      height: 304px;
      
      p {
        text-align: start;
        font-size: 26px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
        color: #333333;
      }
      .noFooter {
        height:calc(304px - 45px);
        overflow: auto;
      }
      .input {
        width: 682px;
        min-height: 60px;
        background: #ffffff;
        border-radius: 10px;
        border: 1px solid #979797;
        margin-top: 20px;
        margin-bottom: 20px;
        padding: 0 10px;
        font-size: 26px;
        word-break: break-all;
        display: flex;
        align-items: center;
        &.noTitle {
          display: flex;
          justify-content: space-evenly;
          border: none;
          background: #fff;
          color: #000;
          // padding: 0;
          > span {
            width: 33%;
            display: flex;
            align-items: center;
          }
        }
      }
    }

    .line {
      position: relative;

      > div {
        width: 15px;
        height: 53px;
        background: #7d9aff;
        border-radius: 8px;
        position: absolute;
        z-index: 9;
        top: -20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 2px 0;
        box-sizing: border-box;

        > p {
          width: 12px;
          height: 12px;
          background: #f6f8ff;
          border-radius: 50%;
        }

        &.left {
          left: -300px;
        }

        &.right {
          right: -300px;
        }
      }
    }
  }
}

@keyframes car {
  0% {
    right: 15px;
  }

  100% {
    right: 50px;
  }
}
.back {
  width: 190px;
  height: 70px;
  border-radius: 10px;
  text-align: center;
  line-height: 70px;
  background: #4170fa;
  color: #ffffff;
  margin-top: 120px;
  font-size: 24px;
  font-family: PingFangSC, PingFang SC;
}
</style>