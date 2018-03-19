<template>
    <div class="e-goods">
        <Row>
            <Col :lg="10">
              <EImage :picUrl="picUrl"></EImage>
            </Col>
            <Col :lg="14">
                <p class="e-name" :class="{'e-snapshot': this.$route.name === 'snap_goods'}" v-text="name"/> 
                <p class="e-description" v-text="description"/>
                <h1 class="e-price" v-text="price"/>
                <div v-if="this.$store.state.isbuyer && !bought" class="amount-area">
                  <p class="amount-label">数量</p>
                  <EAmount :disabled="this.$route.name === 'snap_goods'" ref="eAmount" style="margin-right:4px;"/>
                </div>
                <Button style="float:left;" :disabled="bought" v-if="(!this.$store.state.isseller || this.$store.state.isbuyer) && this.$route.name != 'snap_goods'" type="error" class="add2cart" @click="add2cart">
                  <div v-if="bought">已购买</div>
                  <div v-else>加入购物车</div>
                </Button>
                <router-link v-if="bought" style="line-height:35px; font-size:15px;" :to="{name: 'snap_goods', params: {snapId: this.snapId}} ">查看购买记录</router-link>
                <Button v-if="this.$store.state.isseller" type="primary" class="add2cart" @click="edit">编辑</Button>           
            </Col>
        </Row>
        <Row>
          <div class="e-detail">
            <ul style="border-left: 1px solid #e8e8e8; border-bottom: 1px solid;">
              <li class="e-detail-item">详情</li>
            </ul>
            <div style="font-size: 20px; margin: 10px;">
            {{ this.detail }}
            </div>
          </div>
        </Row>
    </div>
</template>
<style scoped>
.e-goods {
  width: 80%;
  margin: auto;
  margin-top: 5%;
}
.e-goods-img {
  width: 350px;
  border: solid 1px;
}
.e-detail-item {
  border: 1px solid #e8e8e8;
  border-bottom: none;
  border-left: none;
  font-size: 15px;
  color: #828188;
  width: 170px;
  text-align: center;
  background-color: #f5f5f5;
  height: 42px;
  line-height: 40px;
}
.e-detail {
  margin-top: 20px;
}
.e-name {
  padding-bottom: 0.2em;
  line-height: 1;
  font-size: 22px;
  font-weight: 700;
  color: #000;
}
.e-snapshot::before {
  content: "[交易快照]"
}
.e-snapshot {
  color: #808080;
}
.e-description {
  margin-top: 5px;
  font-size: 16px;
  color: #808080;
}
.e-price {
  vertical-align: middle;
  font-size: 30px;
  color: #d7282d;
  font-weight: bolder;
  font-family: Arial;
  -webkit-font-smoothing: antialiased;
}
.e-price:before {
  content: "¥";
  margin-right: 2px;
  font-size: 18px;
}
.add2cart {
  height: 35px;
  width: 100px;
  font-size: 14px;
}
.amount-label {
  text-align: left;
  float: left;
  width: 45px;
  color: #838383;
  font-size: 16px;
  margin-top: 3px;
}
.amount-area {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>

<script>
import EAmount from "../common/e-amount.vue";
import EImage from "../common/e-img.vue";
import Cookies from "js-cookie";

export default {
  components: {
    EAmount,
    EImage
  },
  data() {
    return {
      configs: {
        width: 350,
        height: 250,
        maskWidth: 100,
        maskHeight: 100,
        maskColor: "gray",
        maskOpacity: 0.2
      },
      goodsId: "",
      name: "",
      description: "",
      price: "",
      picUrl: "",
      detail: "",
      bought: false,
      snapId: null
    };
  },
  methods: {
    getAmount() {
      return this.$refs.eAmount.amount;
    },
    edit() {
      this.$router.push({
        name: "publish_edit",
        params: {
          goodsId: this.goodsId
        }
      });
    },
    add2cart() {
      if (this.$isLogin()) {
        this.$Modal.confirm({
          title: "确认加入购物车？",
          content: "",
          onOk: () => {
            this.$http
              .post("/addcart", {
                userId: this.$store.state.userId,
                goodsId: this.goodsId,
                amount: this.getAmount()
              })
              .then(response => {
                this.$Message.success("已添加购物车");
              })
              .catch(error => {
                this.$Message.error("添加购物车失败");
              });
          },
          onCancel: () => {}
        });
      } else {
        this.$confirm_login(false);
      }
    },
    initData() {
      this.goodsId = this.$route.params.goodsId;
      this.name = "";
      this.description = "";
      this.price = "";
      this.picUrl = "";
      this.detail = "";
      this.bought = false;
      this.snapId = this.$route.params.snapId;
    },
    fetchData() {
      //todo: 如果没有这个goods，那么应该做事情
      this.initData();
      if (this.$route.name === "goods") {
        this.$http.get("/goods/" + this.goodsId).then(response => {
          let goods = response.data.data;
          this.name = goods.name;
          this.description = goods.description;
          this.price = goods.price;
          this.picUrl = goods.picUrl;
          this.detail = goods.detail;
        });
      } else if (this.$route.name === "snap_goods") {
        this.$http
          .get("/snapshot/" + this.$route.params.snapId)
          .then(response => {
            let snapshot = response.data.data;
            this.name = snapshot.snapGoodsName;
            this.description = snapshot.snapDescription;
            this.price = snapshot.snapPrice;
            this.picUrl = snapshot.snapPicUrl;
            this.detail = snapshot.snapDetail;
            this.$refs.eAmount.amount = snapshot.amount;
          });
      }
      if (this.$store.state.isbuyer && this.$route.name != "snap_goods") {
        this.$http.get("hasbought", {
            params: {
              goodsId: this.goodsId
            }
          })
          .then(res => {
            if (res.data.data != null) {
              this.bought = true;
              this.snapId = res.data.data.id;
            }
          });
      }
    }
  },
  watch: {
    $route: "fetchData"
  },
  mounted() {
    console.log("goods mounted");
    this.fetchData();
  }
};
</script>