<template>
<div>
    <!-- 参考网易严选页面的思路实现 -->
    <div class="e-img-container" @mouseover="handOver" @mousemove="handMove" @mouseout="handOut">
        <img ref="innerImg" class="e-img" :src="picUrl"/>
        <b class="shadow" :style="{top: top+ 'px', left: left + 'px', display: dd ? 'block': 'none'}"/>
    </div>
    <div class="showDetails" :style="{display: dd ? 'block': 'none'}">
        <img class="showImgBig" :src="picUrl" :style="{top: -2*top+ 'px', left: -2*left + 'px'}"/>
    </div>
</div>
</template>
<style scoped>
.e-img-container {
  position: relative;
  top: 0;
  left: 0;
  border: 1px solid #eee;
  width: 400px;
  height: 400px;
  overflow: hidden;
  cursor: crosshair;
  border: 1px solid #eee;
}
.e-img {
  width: 400px;
  height: 400px;
  vertical-align: middle;
  display: inline-block;
  z-index: 100;
}
.shadow {
  background-color: #000;
  opacity: 0.3;
  display: inline-block;
  width: 200px;
  height: 200px;
  position: absolute;
  z-index: 10;
  /* top: 0px;
  left: 0px; */
  /* display: none; */
}
.showDetails {
  width: 400px;
  height: 400px;
  position: absolute;
  zoom: 1;
  z-index: 1001;
  top: 0px;
  left: 430px;
  overflow: hidden;
  border: #ededed 1px solid;
  /* display: none; */
  background: #fff;
}
.showImgBig {
  position: absolute;
  z-index: 1000;
  width: 800px;
  height: 800px;
  top: 0px;
  left: 0px;
}
</style>

<script>
export default {
  props: {
    picUrl: String
  },
  data() {
    return {
      top: 0,
      left: 0,
      dd: false
    };
  },
  methods: {
    handOut(e) {
      this.dd = false;
    },
    handOver(e) {
      this.dd = true;
    },
    handMove(e) {
      this.imgObj = this.$refs.innerImg;
      this.imgRect = this.imgObj.getBoundingClientRect();
      let objX = e.x - this.imgRect.left;
      let objY = e.y - this.imgRect.top;
      if (objX < 100) {
        this.left = 0;
      }
      if (objX > 300) {
        this.left = 200;
      }
      if (objY < 100) {
        this.top = 0;
      }
      if (objY > 300) {
        this.top = 200;
      }
      if (objX >= 100 && objX <= 300) {
        this.left = objX - 100 >= 0 ? objX - 100 : 0;
      }
      if (objY >= 100 && objY <= 300) {
        this.top = objY - 100 >= 0 ? objY - 100 : 0;
      }
    }
  },
  mounted() {
    this.$refs.innerImg.onload = () => {
      this.$emit("on-pic-loaded");
    };

    this.$refs.innerImg.onerror = () => {
      this.$emit("on-pic-error");
    };
  }
};
</script>
