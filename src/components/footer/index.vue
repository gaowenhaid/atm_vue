
<template>
  <div class="footer">
    <span>{{ content.zh }}</span>
    <span>{{ content.en }}</span>
  </div>
</template>

<script>
export default ({
  data() {
    return {
    }
  },
  props: {
    content: {
      type: Object,
      default: () => ({})
    }
  }
});
</script>

<style lang="less" scoped>
.footer {
  width: 826px;
  height: 282px;
  line-height: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  flex-wrap: wrap;
  span {
    width: 100%;

    &:first-of-type {
      font-size: 38px;
      font-family: MicrosoftYaHeiUI, MicrosoftYaHeiUI;
      font-weight: bold;
      color: #333333;
    }

    &:last-of-type {
      font-size: 32px;
      font-family: Helvetica;
      color: #333333;
      margin-top: -50px;
    }
  }

}
</style>
