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
                  <EAmount ref="eAmount" style="margin-right:4px;"/>
                </div>
                <Button :disabled="bought" v-if="(!this.$store.state.isseller || this.$store.state.isbuyer) && this.$route.name != 'snap_goods'" type="error" class="add2cart" @click="add2cart">加入购物车</Button>
                <Button v-if="this.$store.state.isseller" type="primary" class="add2cart" @click="edit">编辑</Button>           
            </Col>
        </Row>
        <Row>
          {{ this.detail }}
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
import qs from "qs"
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
      id: Number.parseInt(this.$route.params.id),
      name: "",
      description: "",
      price: "",
      picUrl: "",
      detail: "",
      bought: false,
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
          goods_id: this.id
        }
      });
    },
    add2cart() {
      if (this.$isLogin()) {
        this.$Modal.confirm({
          title: "确认加入购物车？",
          content: "",
          onOk: () => {
            this.$http.post("/addcart", {
                userId: this.$store.state.user_id,
                goodsId: this.id,
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
        this.$confirm_login();
      }
    }
  },
  mounted() {
    console.log("goods mounted");
    
    //todo: 如果没有这个goods，那么应该做事情

    // const data = new FormData();
    // data.append("ids", [this.id]);
    if (this.$route.name === 'goods') {
      this.$http.post("/goods/query", qs.stringify({
          ids: this.id
        }), {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
        .then(response => {
          this.name = response.data[0].name;
          this.description = response.data[0].description;
          this.price = response.data[0].price;
          this.picUrl = response.data[0].picUrl;
          this.detail = response.data[0].detail;
        });
    } else if (this.$route.name === 'snap_goods') {
      this.$http.get("/snapshot/" + this.$route.params.snap_id)
        .then(response => {
          let snapshot = response.data.data;
          this.name = snapshot.snapGoodsName;
          this.description = snapshot.snapDescription;
          this.price = snapshot.snapPrice;
          this.picUrl = snapshot.snapPicUrl;
          this.detail = snapshot.snapDetail;
          this.$refs.eAmount.amount = snapshot.amount
          console.log(response)
        });
    }
    // fixme: seller页面也不应该发送
    if (this.$isLogin() && this.$route.name != 'snap_goods') {
      this.$http.get('hasbought', {
        params: {
          goodsId: this.id
        }
      }).then(res => {
        if (res.data.data === true) {
          this.bought = true
        }
      });
    }
  }
};
</script>