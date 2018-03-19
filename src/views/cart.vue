<template>
<div class="e-cart">
    <Table ref="cartGoods" :loading="loading" :columns="columns" :data="cartList" @on-selection-change="selectionChange"></Table>
    <div>
      <span class="amount" style="text-align">总计：¥{{ this.amount }}</span>
    </div>
    <Button @click="purchase">购买</Button>
    <Modal
        v-model="confirmBuy"
        :loading="buyloading"
        title="确认"
        @on-ok="asyncOK"
        :width="300">
        <p>确认购买所选物品？</p>
    </Modal>
</div>
</template>
<style scoped>
.amount {
  font-size: 20px;
  color: #a95656;
}
.e-cart {
  width: 60%;
  margin: auto;
  margin-top: 5%;
}
</style>

<script>
import EAmount from "../common/e-amount.vue";
export default {
  components: {
    EAmount
  },
  data() {
    return {
      amount: 0,
      confirmBuy: false,
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: " ",
          width: "92px",
          align: "right",
          render: (h, params) => {
            return h(
              "router-link",
              {
                props: {
                  to: {
                    name: "goods",
                    params: {
                      goodsId: params.row.goodsId
                    }
                  }
                }
              },
              [
                h("img", {
                  domProps: {
                    src: params.row.picUrl
                  },
                  style: {
                    width: "72px"
                  }
                })
              ]
            );
          }
        },
        {
          title: "商品信息",
          render: (h, params) => {
            return h(
              "router-link",
              {
                props: {
                  to: {
                    name: "goods",
                    params: {
                      goodsId: params.row.goodsId
                    }
                  }
                }
              },
              [h("span", {}, params.row.goodsName)]
            );
          }
        },
        {
          title: "单价",
          key: "price"
        },
        {
          title: "数量",
          render: (h, params) => {
            return h(EAmount, {
              props: {
                amountp: Number(params.row.amount)
              },
              on: {
                change: amount => {
                  // params.row.amount = amount
                  this.cartList[params.row._index].amount = amount;
                  this.$http.post("/changecart", {
                    userId: this.$store.state.userId,
                    goodsId: params.row.goodsId,
                    amount: amount
                  });
                }
              }
            });
          }
        },
        {
          title: "小记",
          key: "all",
          render: (h, params) => {
            return h(
              "span",
              {
                props: {
                  type: "text"
                }
              },
              params.row.price * params.row.amount
            );
          }
        },
        {
          title: "操作",
          key: "op",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.row);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      cartList: [],
      loading: true,
      buyloading: false
    };
  },
  methods: {
    remove(row) {
      let that = this;
      this.$http
        .post("/deletecart", {
          userId: this.$store.state.userId,
          goodsId: row.goodsId
        })
        .then(response => {
          this.$Message.success("删除成功");
          that.cartList = that.cartList.filter(item => {
            return item.goodsId != row.goodsId;
          });
        })
        .catch(error => {
          this.$Message.error("删除失败");
        });
    },
    selectionChange() {
      this.amount = this.$refs.cartGoods
        .getSelection()
        .reduce((total, item) => {
          return total + item.price * item.amount;
        }, 0);
    },
    asyncOK() {
      this.$http
        .post("/buy", this.$refs.cartGoods.getSelection())
        .then(response => {
          this.$Message.success({
            content: "购买成功",
            dureation: 1
          });
          setTimeout(() => {
            location.reload();
          }, 100);
        });
    },
    purchase() {
      if (this.$refs.cartGoods.getSelection().length > 0) {
        this.confirmBuy = true;
      } else {
        this.$Modal.warning({
          title: "提示",
          content: "未购买任何物品"
        });
      }
    },
    fetchData() {
      this.$http.get("/getcart").then(response => {
        this.cartList = response.data.data;
        this.loading = false;
      });
    }
  },
  mounted() {
    console.log("cart mounted!");
    this.fetchData();
  }
};
</script>
