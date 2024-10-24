<template>
  <div class="container">
    <div class="gap_input" style="margin-top: 20px">
      <p>{{ title[1] }}</p>
      <el-input
        :placeholder="'请输入确认号 Please Enter Confirmation Num'"
        ref="CodeInput"
        v-model="inputCode"
        @focus="getFocus('code')"
        @change="changeInputCode"
      />
    </div>

    <div class="second">
      <div class="content">
        <span>代表信息：</span>
        <div class="noTitle">
          <span>{{ selectPerson.name }}</span>
          <span>{{ selectPerson.orgName }} </span>
          <span>{{ selectPerson.position }}</span>
        </div>
      </div>
    </div>
    <div class="gap_input" style="position: relative">
      <p>{{ title[0] }}</p>
      <el-select
        ref="mySelect"
        v-model="selectValue"
        filterable
        remote
        :remote-method="remoteMethod"
        :loading="loading"
        @focus="getFocus('name')"
        :placeholder="'请输入姓名 Please Enter Name'"
        @change="changeSelect"
        no-data-text="暂无数据 No Data"
        @blur="blurValue"
        id="mySelect"
        clearable
        @clearable="clearValue"
        placement="top-start"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="gap_keycode">
      <KeyboardCopy
        :maxLength="40"
        ref="keyCode"
        @onChange="onChange"
        :input="type == 'name' ? selectValue : inputCode"
        @del="del"
      />
    </div>
  </div>
</template>
<script>
import KeyboardCopy from '../../components/keyCode/chKeyCode.vue'
import Req from '../../utils/request'
export default {
  props: {
    title: {
      type: Array,
      default: () => []
    },
    confirmationNumber: {
      type: String,
      default: ''
    }
  },
  components: {
    KeyboardCopy
  },
  data() {
    return {
      selectValue: '',
      inputCode: '',
      selectPerson: {},
      type: '',
      options: [],
      loading: false,
      timer: null
    }
  },
  mounted() {
    if (this.$refs.CodeInput) {
      this.$refs.CodeInput.focus()
    }
  },
  watch: {
    selectValue(v) {
      this.remoteMethod(v ? v : '')
    },
    confirmationNumber: {
      handler(v) {
        if (v) {
          this.inputCode = v
        }
      },
      immediate: true
    },
  },
  methods: {
    onChange(value) {
      if (this.type == 'name') {
        this.selectValue = value
      } else if (this.type == 'code') {
        this.inputCode = value
      }
    },
    getFocus(type) {
      this.type = type
      if (this.type == 'name') {
        this.inputCode = ''
        this.selectPerson = {}
      } else if (this.type == 'code') {
        this.selectValue = ''
        this.selectPerson = {}
      }
    },
    remoteMethod(query) {
      if (query) {
        this.loading = true
        this.getPersonList(query)
      } else {
        this.options = []
      }
    },
    changeSelect(value) {
      if (value) {
        this.inputCode = value
        this.selectValue = ''
        this.selectPerson = this.options.find(item => item.value === value)
      } else {
        this.inputCode = ''
      }
      this.options = []
    },
    changeInputCode() {
      this.selectValue = ''
    },
    getPersonList(name) {
      let formData = new FormData()
      formData.append('name', name)
      Req.request(
        'post',
        '/fa-pro-boao/ignore/airportEquipment/getRegInfoByName',
        formData
      )
        .then(res => {
          this.$nextTick(() => {
            this.$refs.mySelect.handleFocus()
          })
          const list = res.data.filter(item => {
            if (item.confirmationNumber) {
              item.label = item.name + '/' + item.orgName + '/' + item.position
              item.value = item.confirmationNumber
              return item
            }
          })
          this.options = list
          this.loading = false
        })
        .catch(err => {
          this.$message({
            type: 'error',
            dangerouslyUseHTMLString: true,
            showClose: true,
            message: err
          })
        })
    },
    del() {
      if (this.type === 'name') {
        this.selectValue = this.selectValue.substring(
          0,
          this.selectValue.length - 1
        )
      } else {
        this.inputCode = this.inputCode.substring(0, this.inputCode.length - 1)
      }
    },
    blurValue() {},
    clearValue() {
      this.selectValue = ''
      this.inputCode = ''
      this.selectPerson = {}
      this.options = []
    }
  }
}
</script>
<style lang="less" scoped>
::v-deep .el-input__suffix {
  top: 25px !important;
  color: #000 !important;
}
.default-open .el-select-dropdown {
  display: block !important; /* 使下拉框展示 */
}
.container {
  width: 100%;
  .second {
    min-height: 60px;
    margin-top: 30px;
    width: 752px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    .content {
      width: 98%;
      height: 100%;
      text-align: left;
      font-size: 24px;
      padding-left: 2px;
      display: flex;
      align-items: center;
      > span {
        width: 135px;
        display: flex;
        align-items: center;
      }
      .noTitle {
        width: calc(100% - 135px);
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
        > span {
          width: 33%;
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .gap_input {
    width: 752px;
    height: 140px;
    margin: 0 auto;
    p {
      margin-bottom: 20px;
      font-size: 26px;
    }

    /deep/ .el-input__inner {
      border-radius: 0;
      font-size: 26px;
      width: 752px;
      height: 88px;
      background: #ffffff;
      border-radius: 10px;
      // border: 1px solid #979797;
    }

    /deep/ .el-select {
      width: 752px;
      height: 88px;
      border-radius: 10px;
      // border: 1px solid #979797;
      .el-select__wrapper {
        height: 100%;
        .el-select__selection {
          height: 100%;
        }
        .el-select__selected-item {
          height: 100%;
          font-size: 26px;
          >span {
            display: inline-block;
            height: 100%;
            line-height: 88px;
          }
          .el-select__input {
            display: inline-block;
            height: 100%;
            line-height: 88px;
          }
        }
      }
    } 
  }

  .gap_keycode {
    width: 752px;
    margin: 0 auto;
    margin-top: 50px;
  }
}
</style>