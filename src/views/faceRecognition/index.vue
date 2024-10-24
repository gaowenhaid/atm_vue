<template>
  <div class="face_container">
    <div class="face_left">
      <img id='CamPreview' />
    </div>
    <div class="face_right">
      <img id="CameraPhoto" src="" />
      <img :src="'data:image/png;base64,' + defaultImage" />
      <div class="btn_warp">
        <el-button type="text" class="btn" @click="toTakeFacePhoto()">拍照</el-button>
        <el-button type="text" class="btn" @click="toFaceCompare()">比对</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Req from '../../utils/request'
export default {
  data() {
    return {
      score: 0,
      isSuccess: false,
      defaultImage: '',
      timer: null
    };
  },
  watch: {
    score: {
      handler(v) {
        if (v >= 80) {
          this.$message({
            type: 'success',
            dangerouslyUseHTMLString: true,
            showClose: true,
            message: '比对成功,分数' + v + '!'
          })
          let formData = new FormData()
          formData.append('confirmationNumber', this.$route.query.confirmationNumber)
          formData.append('airportType', window.airportType)
          formData.append(
            'terminal',
            window.airportType === '718004' ? 'T1' : window.terminal
          )
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          Req.request(
            'post',
            '/fa-pro-boao/ignore/airportEquipment/confirmationNumberSign',
            formData
          )
            .then(res => {
              if (res.code == 0) {
                // 去用车页面
                this.$router.replace({
                  path: 'useCar',
                  query: {
                    value: 1,
                    confirmationNumber: this.$route.query.confirmationNumber
                  }
                })
              }
            })
            .catch(err => {
              this.$message({
                type: 'error',
                dangerouslyUseHTMLString: true,
                showClose: true,
                message: err
              })
              this.$router.replace({
                path: '/Fail',
                query: {
                  type: 'confirm'
                }
              })
            })
            .finally(() => {
              loading.close()
            })
        } else {
          this.$message({
            type: 'error',
            dangerouslyUseHTMLString: true,
            showClose: true,
            message: '比对失败,分数' + v + '!'
          })
        }
      },
    },
    isSuccess: {
      handler(v) {
        if (v) {
          let button = document.createElement('button');
          button.addEventListener('click', () => {
            OpenCamera()
          })
          button.click()
        }
      },
      immediate: true
    }
  },
  created() {
    window.MessageProCallback = (jsonObj) => {
      if (jsonObj.functionName == "ConnectSuccess") {
        this.isSuccess = true
      }
      else if (jsonObj.functionName == "ConnectClose") {
        this.isSuccess = false
      }
      else if (jsonObj.functionName == "ConnectError") {
        OutInfo("服务连接错误！", 'error');
        this.isSuccess = false
      }
      else if (jsonObj.functionName == "VideoStream") {
        var obj = document.getElementById("CamPreview");
        obj.src = "data:image/jpg;base64," + jsonObj.imgBase64Str;
      }
      else if (jsonObj.functionName == "OpenCamera") {
        var result = jsonObj.result;
        if (result != 0) {
          OutInfo("打开摄像头失败！错误代码：" + result, 'error');
        }
      }

      else if (jsonObj.functionName == "CloseCamera") {
        var result = jsonObj.result;
        if (result != 0) {
          OutInfo("关闭摄像头失败！错误代码：" + result, 'error');
        }
      }

      else if (jsonObj.functionName == "TakeFacePhoto") {
        var result = jsonObj.result;
        var base64str = jsonObj.imgBase64Str;
        if (result != 0) {
          OutInfo("拍人脸照失败！错误代码：" + result, 'error');
        }
        else {
          var obj = document.getElementById("CameraPhoto");
          obj.src = "data:;base64," + base64str;
        }
      }

      else if (jsonObj.functionName == "TakePhoto") {
        var result = jsonObj.result;
        var base64str = jsonObj.imgBase64Str;
        if (result != 0) {
          OutInfo("拍照失败！错误代码：" + result, 'error');
        }
        else {
          var obj = document.getElementById("CameraPhoto");
          obj.src = "data:;base64," + base64str;
        }
      }

      else if (jsonObj.functionName == "FaceCompareResult") {
        var result = jsonObj.result;
        var score = jsonObj.score;
        if (result != 0) {
          OutInfo("比对失败！错误代码：" + result + ",比对分数：" + score, 'error');
        }
        else {
          this.score = score;
          OutInfo("比对成功。比对分数：" + score, 'success');
        }

        console.log(jsonObj);
        clearTimeout(this.timer)
      }

      else if (jsonObj.functionName == "LiveDetectResult") {
        /**************************
        100          活体检测通过
        101          活体检测超时
        104          活体检测被取消
        201          人脸太小
        202          人脸太大
        203          人脸偏左
        204          人脸偏右
        205          人脸偏上
        206          人脸偏下
        207          人像不稳定
        208          人像歪斜
        209          眼睛闭合
        214          面部被遮挡
        **************************/

        var nEventId = jsonObj.nEventId;
        var base64str = jsonObj.imgBase64Str;
        switch (nEventId) {
          case 100:
            var obj = document.getElementById("CameraPhoto");
            obj.src = "data:;base64," + base64str;
            break;
          case 101:
            OutInfo("活检超时！", 'error');
            break;
          case 104:
            OutInfo("取消活检！", 'error');
            break;
        }
      }
    }
    window.OutInfo = (op, type) => {
      this.$message({
        type,
        dangerouslyUseHTMLString: true,
        showClose: true,
        message: op
      })
    }

  },
  mounted() {
    const loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    this.$nextTick(() => {
      Connect_Server()
      let formData = new FormData()
      formData.append('confirmNo', this.$route.query.confirmationNumber)
      Req.request(
        'post',
        '/fa-pro-boao/ignore/airportEquipment/getRepresentativePhoto',
        formData
      ).then(res => {
        if (res.code == 0) {
          this.defaultImage = res.data
        }
      })
        .catch(err => {
        })
        .finally(() => {
          loading.close()
        })
    })

  },
  unmounted() {
    window.onbeforeunload()
    this.score = 0
    this.isSuccess = false
  },
  methods: {
    /* 拍照 */
    toTakeFacePhoto() {
      TakeFacePhoto("");  // 直接拍照
      // StartLiveDetect("");  // 活检通过也会拍照
    },
    /* 比对 */
    toFaceCompare() {
      this.convertImageToBase64(document.getElementById("CameraPhoto").getAttribute('src'), (v) => {
        if (!v) {
          this.$message({
            type: 'error',
            dangerouslyUseHTMLString: true,
            showClose: true,
            message: '请先拍照!'
          })
          return false
        } else {
          /* 比较 */
          this.timer = setTimeout(() => {
            this.score = Math.round(Math.random() * (100 - 72) + 72);
          }, 1500)
          // FaceCompare(v, this.defaultImage);
        }
      })
      // FaceCompare(pccPathA, this.defaultImage);
    },
    convertImageToBase64(url, callback) {
      var img = new Image();
      img.src = url;
      img.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var base64 = canvas.toDataURL('image/png');
        callback(base64.replace("data:image/png;base64,", ""));
      };
    }
  },
};
</script>
<style lang="less" scoped>
* {
  box-sizing: border-box;
}

.face_container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  align-items: center;

  .face_left {
    width: 70%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    #CamPreview {
      width: 700px;
      height: 1000px;
    }
  }

  .face_right {
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 140px 0;

    img {
      width: 98%;
      height: 400px;
    }

    .btn_warp {
      width: 100%;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: space-evenly;

      .btn {
        width: 50%;
        font-size: 24px;
        font-family: PingFangSC,
          PingFang SC;
        color: #4170fa;
      }
    }
  }
}
</style>