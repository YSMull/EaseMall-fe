<template>
    <div v-if="exsits" class="e-card" @click="onClick">
      <p v-if="this.$store.state.isseller">已卖出 <strong>{{ hasSold != null ? hasSold : 0 }}</strong> 件</p>
      <span v-if="hasSold === 0" class="e-delete" @click.stop="deleteGoods">删除</span>
      <lazy-component style="height: 212.8px">
        <div v-images-loaded:on.progress="imageProgress">
          <img v-show="isImgLoaded" v-bind:class="{'e-img-bought': bought}" class="e-img" :src="picUrl" :alt="name">
          <div v-show="!isImgLoaded" style="position: relative;height: 218px;">
            <Spin fix size="large"/>
          </div>
        </div>
      </lazy-component>
      <strong class="e-price" v-bind:class="{'e-price-bought': bought}" v-text="price"/> 
      <span v-if="bought" class="e-bought"><b>已购买</b></span>
      <p class="e-name"><strong>{{ name }}</strong></p> 
      <p class="e-desc" v-text="desc"/>
    </div>
</template>
<style scoped>
.e-card {
  text-align: center;
  margin-bottom: 8px;
  font-size: 14px;
  position: relative;
  transition: all 0.2s ease-in-out;
  border: 1px solid #c1c1c3;
  cursor: pointer;
}

.e-card:hover .e-delete {
  opacity: 1;
}
.e-delete:hover {
  background: #c5c4c4fa;
}
.e-delete {
  transition: color 0.2s linear, background-color 0.2s linear,
    border 0.2s linear;
  position: absolute;
  opacity: 0;
  padding: 5px;
  top: -1px;
  right: -1px;
  border: 1px solid;
  background: #efefef;
  z-index: 100;
}

.e-img {
  width: 80%;
  max-height: 212.8px;
  margin-bottom: 2px;
}
@media screen and (min-width: 320px) and (max-width: 374px) {
  .e-card {
    font-size: 12px;
    height: 230px;
    margin: 3px;
    margin-bottom: 8px;
  }
}
@media screen and (min-width: 375px) and (max-width: 413px) {
  .e-card {
    height: 260px;
    margin: 3px;
    margin-bottom: 8px;
  }
}
@media screen and (min-width: 414px) and (max-width: 450px) {
  .e-card {
    height: 290px;
    margin: 3px;
    margin-bottom: 8px;
  }
}
@media screen and (min-width: 451px) and (max-width: 480px) {
  .e-card {
    height: 250px;
    margin: 10px;
    margin-bottom: 10px;
  }
}
@media screen and (min-width: 481px) and (max-width: 767px) {
  .e-card {
    height: 345px;
    margin: 10px;
    margin-bottom: 10px;
  }
}
@media screen and (min-width: 768px) and (max-width: 1024px) {
  .e-card {
    height: 345px;
    margin: 10px;
    margin-bottom: 10px;
  }
}

@media screen and (min-width: 1025px) and (max-width: 1366px) {
  .e-card {
    height: 345px;
    margin: 10px;
    margin-bottom: 10px;
  }
}

@media screen and (min-width: 1367px) {
  .e-card {
    height: 345px;
    margin: 10px;
    margin-bottom: 10px;
  }
}

.e-card:hover {
  box-shadow: 0 0px 6px 1px rgba(0, 0, 0, 0.16);
  border: 1px solid #151430;
}
.e-bought {
  position: absolute;
  top: 0;
  left: 0;
  height: 0;
  width: 0;
  z-index: 1000;
  border-style: solid;
  border-width: 22px;
  border-color: #8bc34ab8 transparent transparent #8bc34ab8;
  border-top-left-radius: 2px;
}
.e-bought b {
  position: absolute;
  top: -12px;
  left: -25px;
  width: 40px;
  text-align: center;
  white-space: nowrap;
  line-height: 14px;
  font-size: 12px;
  transform: rotate(-45deg);
  color: #1c243891;
}

.e-img-bought {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  filter: gray;
}

.e-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 6px;
  margin: 12px;
  margin-top: 0px;
}

.e-desc {
  margin-top: 6px;
  margin: 12px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

@media screen and (max-width: 450px) {
  .e-desc {
    margin-top: 6px;
    margin: 12px;
    -webkit-line-clamp: 2;
  }
}

.e-price {
  font-size: 18px;
  color: #d7282d;
  font-weight: 700;
  font-family: arial;
  margin: 12px;
  height: 22px;
  line-height: 22px;
  overflow: hidden;
}

.e-price-bought {
  color: black;
}

.e-price:before {
  content: "¥";
  font-size: 80%;
  margin-right: 2px;
}
</style>

<script>
import imagesLoaded from "vue-images-loaded";
export default {
  directives: {
    imagesLoaded
  },
  props: {
    id: Number,
    name: String,
    price: Number,
    picUrl: String,
    bought: Boolean,
    desc: String,
    hasSold: Number
  },
  data() {
    return {
      exsits: true,
      isImgLoaded: false
    };
  },
  methods: {
    onClick() {
      this.$router.push({
        name: "goods",
        params: {
          id: this.id
        }
      });
    },
    deleteGoods() {
      this.$Modal.confirm({
        title: "确认删除商品？",
        content: "",
        onOk: () => {
          this.$http
            .delete("/goods/delete/" + this.id)
            .then(res => {
              this.exsits = false
              this.$Message.success("删除成功");
            });
        },
        onCancel: () => {}
      });
    },
    imageProgress(instance, image) {
      if (image.isLoaded) {
        image.img.width = image.img.height;
        this.isImgLoaded = true;
      } else {
      }
    }
  },
  mounted() {}
};
</script>
