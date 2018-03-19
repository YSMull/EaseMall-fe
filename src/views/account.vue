<template>
<div class="e-account">
    <Table ref="cartGoods" :loading="loading" :columns="columns" :data="recordList"></Table>
    <div style="text-align: right;">
      <span class="amount" style="text-align">总计：¥{{ this.amount }}</span>
    </div>
</div>
</template>
<style scoped>
.e-account {
  width: 60%;
  margin: auto;
  margin-top: 3%;
}
.amount {
  font-size: 20px;
  color: #a95656;
}
</style>

<script>
import moment from "moment";

export default {
  data() {
    return {
      amount: 0,
      columns: [
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
                    name: "snap_goods",
                    params: {
                      snapId: params.row.id
                    }
                  }
                }
              },
              [
                h("img", {
                  domProps: {
                    src: params.row.snapPicUrl
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
          width: "192px",
          render: (h, params) => {
            return h(
              "router-link",
              {
                props: {
                  to: {
                    name: "snap_goods",
                    params: {
                      snapId: params.row.id
                    }
                  }
                }
              },
              [h("span", {}, params.row.snapGoodsName)]
            );
          }
        },
        {
          title: "单价",
          render: (h, params) => {
            return h(
              "span",
              {
                props: {
                  type: "text"
                }
              },
              "¥" + params.row.snapPrice
            );
          }
        },
        {
          title: "数量",
          key: "amount"
        },
        {
          title: "小记",
          render: (h, params) => {
            return h(
              "span",
              {
                props: {
                  type: "text"
                }
              },
              "¥" + params.row.snapPrice * params.row.amount
            );
          }
        },
        {
          title: "购买时间",
          width: "192px",
          render: (h, params) => {
            return h(
              "span",
              {
                props: {
                  type: "text"
                }
              },
              moment(String(params.row.purchaseTime)).format("YYYY/MM/DD hh:mm")
            );
          }
        }
      ],
      recordList: [],
      loading: true
    };
  },
  methods: {
    fetchData() {
      this.$http.get("/history").then(response => {
        this.recordList = response.data.data;
        this.amount = this.recordList.reduce((total, item) => {
          return total + item.snapPrice * item.amount;
        }, 0);
        this.loading = false;
      });
    }
  },
  mounted() {
    console.log("record mounted!");
    this.fetchData();
  }
};
</script>
