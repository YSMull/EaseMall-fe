<template>
<div class="e-cart">
    <Table ref="cartGoods" :loading="loading" :columns="columns" :data="cartList" @on-selection-change="selectionChange"></Table>
    <div>
      <span class="amount" style="text-align">总计：¥{{ this.amount }}</span>
    </div>
    <Button @click="purchase">购买</Button>
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
              "a",
              {
                domProps: {
                  href: "/goods/" + params.row.goodsId
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
              "a",
              {
                domProps: {
                  href: "/goods/" + params.row.goodsId
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
                    userId: this.$store.state.user_id,
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
      modalLoading: true
    };
  },
  methods: {
    remove(row) {
      let that = this
      this.$http.post("/deletecart", {
          userId: this.$store.state.user_id,
          goodsId: row.goodsId
        })
        .then(response => {
          this.$Message.success("删除成功");
          that.cartList = that.cartList.filter(item => {
            return item.goodsId != row.goodsId
          })
        })
        .catch(error => {
          this.$Message.error("删除失败");
        });
    },
    selectionChange() {
      this.amount = this.$refs.cartGoods.getSelection().reduce((total, item) => {return total + item.price*item.amount}, 0)
    },
    purchase() {
      if (this.$refs.cartGoods.getSelection().length > 0) {
        this.$Modal.confirm({
          title: "确认购买所选物品？",
          content: "",
          loading: "modalLoading",
          onOk: () => {
            this.$http.post("/buy", this.$refs.cartGoods.getSelection())
              .then(response => {
                this.$Message.success({
                  content: "购买成功",
                  dureation: 1
                });
                setTimeout(() => {
                  location.reload();
                }, 500);
              })
              .catch(error => {
                // todo 这里要区分error类型
                // 这里可以放到main.js处理,但不要aop到axios里
                this.$Modal.confirm({
                  title: "您还没有登录，是否登录商城？",
                  content: "",
                  onOk: () => {
                    this.$router.push({
                      name: "login",
                      query: {
                        redirectUrl: window.location.href
                      }
                    });
                  },
                  onCancel: () => {}
                });
              });
          },
          onCancel: () => {}
        });
      } else {
        this.$Modal.warning({
          title: "提示",
          content: "未购买任何物品"
        });
      }
    }
  },
  mounted() {
    console.log("cart mounted!");
    // this.$allowBuyer();
    this.$http.get("/getcart")
    .then(response => {
      this.cartList = response.data.data;
      this.loading = false;
    });
  }
};
</script>
