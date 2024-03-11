
<template>
  <div class="header">
    <div class="left">
      <p>{{ yearMonthDay }}</p>
      <p> {{nowLocation }}&nbsp; 24°C &nbsp;{{ week }}</p>
    </div>
    <div class="right">
      {{ time }}
    </div>
  </div>
</template>

<script>
export default ({
  data() {
    return {
      yearMonthDay: '',
      week: "",
      time: '',
      timer: null,
      nowLocation: window.nowLocation
    }
  },
  mounted() {
    this.getYearMonthDay()
    this.timer = setInterval(() => {
      this.getYearMonthDay()
    }, 1000)
  },
  unmounted() {
    clearInterval(this.timer)
  },
  methods: {
    getYearMonthDay() {
      const date = new Date();
      const year = date.getFullYear(); // 获取当前年份，
      const month = date.getMonth() + 1; // 获取当前月份，
      const day = date.getDate(); // 获取当前日期，
      this.yearMonthDay = `${year}年${month}月${day}日`;
      const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      this.week = days[date.getDay()];
      const hours = date.getHours();
      const minutes = date.getMinutes();
      this.time = hours + ':' + ((minutes + '').length > 1 ? minutes : 0 + '' + minutes)
    }
  }
});
</script>

<style lang="less" scoped>
.header {
  width: 950px;
  height: 182px;
  margin: 20px auto;
  display: flex;
  justify-content: end;

  .left {
    min-width: 171px;
    padding: 0 10px;
    line-height: 2rem;
    text-align: end;
    font-size: 20px;
    font-family: MicrosoftYaHeiUI;
    color: #FFFFFF;
  }

  .right {
    width: 146px;
    font-size: 53px;
    font-family: MicrosoftYaHeiUI, MicrosoftYaHeiUI;
    font-weight: bold;
    color: #FFFFFF;
  }
}
</style>
