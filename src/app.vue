<template>
    <div>
        <Navbar></Navbar>
        <router-view></router-view>
    </div>
</template>
<style>
html,
body {
  height: 100%;
}
</style>

<script>
import Navbar from "./common/e-navbar.vue";
export default {
  components: {
    Navbar
  },
  data() {
    return {};
  },
  mounted() {
    console.log("app mounted");
  }
};
</script>