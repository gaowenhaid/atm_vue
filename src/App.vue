<template>
  <div id="appTest">
    <router-view />
  </div>
</template>
<script>
export default {
  components: {},
  mounted() {
    // this.enterFullScreen();
  },
  methods: {
    enterFullScreen() {
      let element = document.documentElement
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.mozRequestFullScreen) {
        /* Firefox */
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        element.webkitRequestFullscreen()
      } else if (element.msRequestFullscreen) {
        /* IE/Edge */
        element.msRequestFullscreen()
      }
    }
  }
}
</script>
<style scoped lang="less">
#appTest {
  width: 1024px;
  height: 1280px;
}
</style>
