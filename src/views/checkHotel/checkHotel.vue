<template>
  <div class="main">
    <div class="height_1"></div>
    <Header />
    <ul class="checkHotelWarp">
      <li class="title">目的地 SELECT YOUR DROP OFF</li>
      <li class="item" :class="{ 'active': active === item }" @click="changeCheck(item)" v-for="item in list" :key="item">
        {{ item.split('&').join(' ') }}</li>
      <div class="btns">
        <p class="btn" @click.prevent="back">上一步 Back</p>
        <p class="btn" @click.prevent="next">下一步 next step</p>
      </div>
    </ul>
  </div>
</template>

<script>
import Header from '../../components/header';
import Req from '../../utils/request'
export default {
  components: {
    Header
  },
  data() {
    return {
      active: "博鳌亚洲论坛大酒店 & BFA Hotel",
      list: [
        '博鳌亚洲论坛大酒店 & BFA Hotel',
        '博鳌亚洲论坛东屿岛大酒店 & BFA Dongyu Island Hotel',
        '博鳌亚洲论坛金海岸大酒店 & BFA Golden Coast Hotel',
        '博鳌亚洲湾国际大酒店 & Bo‘ao Asia Bay International Hotel',
        '琼海博鳌和悦海景酒店 & Oionghai Boao Holliyard Hotel',
        '海南博鳌道纪海景大酒店 & Qionghai Bo‘ao Tao Ji Seaview Hotel',
        '博鳌佰悦湾真如酒店 & Zhen Hotel Bo‘ao Byou Bay',
        '博鳌悦心康养酒店 & Boao Yuexin Healing Hotel',
      ],
      hotelName: "",
      confirmationNumber: '', // 确认号
      useCarNumber: "",  // 乘车人数
    };
  },
  mounted() {
    history.pushState(null, null, document.URL)
    window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL)
    })
    let isConfirm = this.$route.query.isConfirm  // 是否是确认号
    this.confirmationNumber = this.$route.query.confirmationNumber // 确认号内容
    this.useCarNumber = this.$route.query.useCarNumber// 乘车人数
    if (isConfirm) {
      this.list.push(this.$route.query.value)
    }
  },
  methods: {
    back() {
      this.$router.replace({
        path: '/useCar',
        query: {
          confirmationNumber: this.confirmationNumber,
          value: this.useCarNumber,
        }
      })
    },
    next() {
      const formData = new FormData()
      formData.append('confirmationNumber', this.confirmationNumber)
      const hotelName = this.active.split('&')[0]
      formData.append('destination', hotelName)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      Req.request('post', '/fa-pro-boao/ignore/airportEquipment/saveDestination', formData).then(res => {
        if (res.code == 0) {
          this.$router.replace({
            path: '/weChart',
            query: {
              isCheckHotel: true,
              location: this.active,
              id: res.data.id,
              typeName: res.data.vehicleType
            }
          })
        }
      }).catch(err => {
        this.$message({
          type: 'error',
          dangerouslyUseHTMLString: true,
          showClose: true,
          message: err
        })
      }).finally(() => {
        loading.close();
      })
    },
    changeCheck(item) {
      this.active = item
      if (item === '其他 other') {
        this.$router.replace({
          path: '/inputHotelName',
          query: {
            type: 'hotelName',
            confirmationNumber: this.confirmationNumber,
            useCarNumber: this.useCarNumber
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  background-image: url(../../assets/背景.png);
  background-repeat: no-repeat;


  .checkHotelWarp {
    width: 952px;
    height: 1017px;
    margin: 0 auto;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
    border-radius: 30px;
    box-sizing: border-box;
    background-color: #fff;
    padding: 70px;
    box-sizing: border-box;

    li:not(:first-of-type) {
      font-size: 24px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #333333;
      padding: 0 15px;
      box-sizing: border-box;
    }

    .title {
      font-size: 26px;
      font-family: PingFangSC, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 37px;
    }

    .item {
      width: fit-content;
      height: 60px;
      background: #FFFFFF;
      border-radius: 5px;
      border: 1px solid #979797;
      margin-top: 10px;
      line-height: 60px;

      &.active {
        background: #4170FA;
        color: #FFFFFF;
      }
    }

    .btns {
      display: flex;
      margin-top: 27px;
      justify-content: space-evenly;

      p {
        width: 262px;
        height: 68px;
        background: #4170FA;
        border-radius: 10px;
        line-height: 68px;
        text-align: center;
        color: #fff;
        font-size: 24px;
        font-family: PingFangSC, PingFang SC;
        font-weight: 400;
      }
    }
  }
}
</style>