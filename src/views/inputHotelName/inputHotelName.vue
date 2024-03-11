<template>
  <div class="main">
    <div class="height_1"></div>
    <Header />
    <div class="inputHotelName">
      <KeyIndex ref="keyCode" :title="type === 'hotelName' ? '酒店名称 Hotel Name' : ' 乘车人数 Number of passe'" />
      <div class="btns">
        <p class="btn" @click.prevent="Confirm">确 认 Confirm</p>
        <p class="btn" @click.prevent="back">返 回 Back</p>
      </div>
    </div>
  </div>
</template>

<script>
import KeyIndex from '../../components/keyCode/index.vue'
import Header from '../../components/header';
export default {
  components: { KeyIndex, Header },
  data() {
    return {
      type: "hotelName",
      useCarNumber: ""
    }
  },
  mounted() {
    this.type = this.$route.query.type ? this.$route.query.type : 'hotelName'
  },
  methods: {
    Confirm() {
      if (!this.$refs.keyCode.currValue) return
      this.$router.replace({
        path: this.type === 'hotelName' ? "/checkHotel" : "/useCar",
        query: {
          value: this.$refs.keyCode.currValue,
          isConfirm: true,
          confirmationNumber: this.$route.query.confirmationNumber,
          useCarNumber: this.$route.query.useCarNumber
        }
      })
    },
    back() {
      this.$router.replace({
        path: this.type === 'hotelName' ? "/checkHotel" : "/useCar",
        query: {
          value: this.$refs.keyCode.currValue,
          homeValue: null,
          confirmationNumber: this.$route.query.confirmationNumber
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.main {
  width: 100%;
  height: 100%;
  background-image: url(../../assets/背景.png);
  background-repeat: no-repeat;

  .inputHotelName {
    width: 952px;
    height: 1017px;
    margin: 0 auto;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
    border-radius: 30px;
    box-sizing: border-box;
    background-color: #fff;
    padding: 96px;
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    margin-top: 67px;
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
</style>