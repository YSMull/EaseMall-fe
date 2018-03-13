<template>
    <div class="e-amount">
        <input v-model="amount" class="amount-input"></input>
        <span class="amount-btn">
            <span @click="increase" class="increase">
                <Icon style="margin-left: 1px" type="chevron-up"></Icon>
            </span>
            <span @click="decrease" class="decrease">
                <Icon style="margin-left: 1px" type="chevron-down"></Icon>
            </span>
        </span>
    </div>
</template>

<style scoped>
.increase {
  margin-bottom: 3px;
  width: 16px;
  height: 14px;
  overflow: hidden;
  border: 1px solid #a7a6ab;
  display: block;
  cursor: pointer;
  line-height: normal;
}
.decrease {
  width: 16px;
  height: 14px;
  overflow: hidden;
  border: 1px solid #a7a6ab;
  display: block;
  cursor: pointer;
  line-height: normal;
}

.increase:hover {
  background: #a7a6ab;
}
.decrease:hover {
  background: #a7a6ab;
}
.amount-input {
  font-size: 16px;
  text-align: center;
  border: 1px solid #a7a6ac;
  width: 36px;
  background-position: -406px -41px;
  color: #666;
  vertical-align: middle;
  padding: 3px 2px 0 3px;
  line-height: 26px;
}
.amount-btn {
  display: inline-block;
  vertical-align: middle;
}
</style>

<script>
import Bus from "../bus.js";
export default {
  name: 'EAmount',
  props: {
    amountp: {
      type: Number,
      default: 1
    },
    cartMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      amount: this.amountp
    };
  },
  methods: {
    increase() {
      this.amount++;
      this.$emit('change', this.amount)
    },
    decrease() {
      if (this.amount <= 1) {
        this.amount = 1;
      } else {
        this.amount--;
        this.$emit('change', this.amount)
      }
    }
  },
  watch: {
    // 通过watch机制确保 input 框为整数或者整数字符串
    // 缺点：text框不支持负数，因为非数字字符无法输入进去
    amount: function(val, oldVal) {
      if (isNaN(Number(val))) { // 不是数字
        this.amount = oldVal;
      } else if(!Number.isInteger(Number(val))) { // 不是整数
        this.amount = oldVal;
      } else if(Number(val) == 0) { // 不能是0
        this.amount = oldVal;
      }
      if (typeof(this.amount) === 'string') {
        this.amount = this.amount.replace('.', '')
        this.$emit('change', this.amount)
      }
    }
  },
  mounted() {}
};
</script>
