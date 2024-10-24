<template>
  <div ref="homePage" class="homePage">
    <div class="warp">
      <div ref="confirm" class="confirm">
        <confirmItem v-if="!scrollPosition" />
      </div>
      <div ref="scan" class="scan">
        <scanItem v-if="scrollPosition" />
      </div>
    </div>
  </div>
</template>
<script>
import scanItem from './scan.vue'
import confirmItem from './confirmItem.vue'
export default {
  components: { scanItem, confirmItem },
  data() {
    return {
      scrollPosition: 0,
      timer: null
    }
  },
  watch: {
    scrollPosition: {
      handler(v) {
        this.changeScanConfirm(v)
      },
      immediate: true
    }
  },
  mounted() {
    const homePage = document.querySelector('.homePage')
    const backScan = this.$route.query.backScan
    console.log(backScan)
    if(backScan) homePage.scrollLeft = 1024
    homePage.addEventListener('scroll', e => {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        if (e.target.scrollLeft > 512) {
          e.target.scrollLeft = 1024
          this.scrollPosition = e.target.scrollLeft
        } else {
          e.target.scrollLeft = 0
          this.scrollPosition = e.target.scrollLeft
        }
      }, 100)
    })
  },
  methods: {
    changeScanConfirm(v) {
      if (v === 0) {
        console.log('扫码')
      } else {
        console.log('确认号')
      }
    }
  }
}
</script>
<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.homePage {
  width: 1024px;
  height: 1280px;
  overflow: scroll;
  .warp {
    width: 2048px;
    height: 100%;
    display: flex;
    > div {
      width: 1024px;
      height: 100%;
    }
  }
}
</style>