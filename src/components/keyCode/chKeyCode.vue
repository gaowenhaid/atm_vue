<template>
  <div :class="keyboardClass"></div>
</template>

<script>
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';
import layout from 'simple-keyboard-layouts/build/layouts/chinese.js'; // 中文输入法

export default {
  name: 'SimpleKeyboard',
  props: {
    keyboardClass: {
      default: 'simple-keyboard',
      type: String,
    },
    input: {
      default: '',
    },
    maxLength: { default: '' },
  },
  data: () => ({
    keyboard: null,
    displayDefault: {
      '{bksp}': 'backspace',
      '{lock}': 'caps',
      '{enter}': '> enter',
      '{tab}': 'tab',
      '{shift}': 'shift',
      '{change}': '英文',
      '{space}': ' ',
      '{clear}': '清空',
      '{close}': '关闭',
    },
  }),
  mounted() {
    this.keyboard = new Keyboard(this.keyboardClass, {
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
      layoutCandidates: layout.layoutCandidates,
      layout: {
        // 默认布局
        default: [
          '1 2 3 4 5 6 7 8 9 0 {bksp}',
          'q w e r t y u i o p',
          "{lock} a s d f g h j k l",
          '{change} z x c v b n m',
        ],
        // shift布局
        shift: [
          '1 2 3 4 5 6 7 8 9 0 {bksp}',
          'Q W E R T Y U I O P',
          '{lock} A S D F G H J K L',
          '{change} Z X C V B N M',
        ],
      },
      // 按钮展示文字
      display: this.displayDefault,
      // 按钮样式
      buttonTheme: [
        {
          class: 'hg-red close',
          buttons: '{close}',
        },
        {
          class: 'change',
          buttons: '{change}',
        },
      ],
      // 输入限制长度
      maxLength: this.maxLength,
    });
  },
  methods: {
    onChange(input) {
      this.keyboard.setInput(input);
      this.$emit('onChange', input);
    },
    // 点击键盘
    onKeyPress(button, $event) {
      // 点击关闭
      if (button === '{close}') {
        let keyboard = $event.path[3];
        keyboard.style.visibility = 'hidden';
        return false;
      } else if (button === '{change}') {
        // 切换中英文输入法
        if (this.keyboard.options.layoutCandidates !== null) {
          // that.$set(this.displayDefault, '{change}', '中文');
          this.displayDefault['{change}'] = '中文'
          // 切换至英文
          this.keyboard.setOptions({
            layoutCandidates: null,
            display: this.displayDefault,
          });
        } else {
          // 切换至中文
          // that.$set(this.displayDefault, '{change}', '英文');
          this.displayDefault['{change}'] = '英文'
          this.keyboard.setOptions({
            layoutCandidates: layout.layoutCandidates,
            display: this.displayDefault,
          });
        }
      } else if (button === '{clear}') {
        this.keyboard.clearInput();
      } else {
        let value =
          $event.target.offsetParent.parentElement.children[0].children[0]
            .value;
        // 输入框有默认值时，覆写
        if (value) {
          this.keyboard.setInput(value);
        }
        this.$emit('onKeyPress', button);
      }
      if (button === '{shift}' || button === '{lock}') this.handleShift();
    },
    // 切换shift/默认布局
    handleShift() {
      let currentLayout = this.keyboard.options.layoutName;
      let shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

      this.keyboard.setOptions({
        layoutName: shiftToggle,
      });
    },
  },
  watch: {
    input(input) {
      this.keyboard.setInput(input);
    },
  },
};
</script>

<style lang="less">
@deep: ~'>>>';

.hg-theme-default {
  width: 100%;
  min-height: 360px;

  .hg-row {
    height: calc(360px / 4);
  }

  .hg-button {
    height: calc(360px / 4);
    &.hg-red {
      background: #db3e5d;
      color: white;

      &.close {
        max-width: 200px;
      }
    }

    &.change {
      max-width: 200px;
    }
  }
}</style>