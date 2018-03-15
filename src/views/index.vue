<template>
<div class="index">
  <BackTop></BackTop>
  <Row type="flex" justify="end" align="middle" style="margin: 10px;">
    <Col :xs="24" :sm="14" :md="8" :lg="6" style="text-align: right;">
      <RadioGroup v-if="this.$store.state.islogin && this.$store.state.isbuyer"  v-model="region" @on-change="changeRegion">
        <Radio label="all">全部</Radio>
        <Radio label="unpurchase">未购买</Radio>
        <Radio label="bought">已购买</Radio>
      </RadioGroup>
      <RadioGroup v-if="this.$store.state.islogin && this.$store.state.isseller"  v-model="region" @on-change="changeRegion1">
        <Radio label="all">全部</Radio>
        <Radio label="sold">已卖出</Radio>
      </RadioGroup>
    </Col>
    <Col :xs="24" :sm="10" :md="8" :lg="6" style="text-align: right;">
      <Input v-model="searchText" @on-change="search" icon="ios-search" style="max-width: 266px">
        <!-- <Button slot="append" icon="ios-search" disabled></Button> -->
      </Input>
    </Col>
  </Row>
  
  <Row>
    <Col :xs="12" :sm="8" :md="8" :lg="6" v-for="goods in filterGoodsList" :key="goods.id">
      <Ecard :id="goods.id"
             :name="goods.name"
             :price="goods.price"
             :picUrl="goods.picUrl"
             :desc="goods.description"
             :bought="goods.bought"
             :hasSold="goods.hasSold"/>
    </Col>
  </Row>
</div>

</template>
<style scoped>
.index {
  width: 80%;
  margin: auto;
  margin-top: 20px;
}
@media screen and (max-width: 450px) {
  .index {
    width: 98%;
    margin: auto;
    margin-top: 20px;
  }
}
</style>

<script>
import Ecard from "../common/e-card.vue";
import Vue from 'vue';
export default {
  components: {
    Ecard
  },
  data() {
    return {
      goodsList: [],
      filterGoodsList: [],
      region: "all",
      searchText: ""
    };
  },
  methods: {
    changeRegion: function(msg) {
      this.search();
    },
    changeRegion1: function(msg) {
      this.search();
    },
    search: function() {
      this.filterGoodsList = this.goodsList.filter(e => {
        if (this.region === "all") {
          return e.name.indexOf(this.searchText) > -1;
        } else if (this.region === "unpurchase") {
          return e.name.indexOf(this.searchText) > -1 && e.bought == false;
        } else if (this.region === "bought") {
          return e.name.indexOf(this.searchText) > -1 && e.bought == true;
        } else if (this.region === "sold") {
          return e.name.indexOf(this.searchText) > -1 && e.hasSold > 0;
        }
      });
    }
  },
  beforeMount() {
    this.$Spin.show();
  },
  mounted() {
    this.$Spin.hide();
    console.log("index mounted");
    let goods_task = this.$http.get("/goods");
    let task = [goods_task];

    if (this.$store.state.isbuyer === true) {
      let pr_task = this.$http.get("/history");
      task.push(pr_task);
    }
    var p = Promise.all(task);
    p.then(res => {
      let goods_list = res[0].data;
      goods_list = goods_list.map(item => {
        item.bought = false;
        return item;
      });
      if (res.length >= 2) {
        let purchase_record = res[1].data.data;
        purchase_record.forEach(item => {
          let gid = item.goodsId;
          goods_list.forEach(goods => {
            if (goods.id == gid) {
              goods.bought = true;
            }
          });
        });
      }
      this.goodsList = goods_list;
      this.filterGoodsList = goods_list;
    });
  }
};
</script>