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
  methods: {
    validation() {
      if (this.$isLogin()) {
        this.$http.get("/valid", {
            params: {
              '__t': Date.parse(new Date())
            }
          }).then(response => {
            this.$store.state.islogin = true
            this.$store.state.username = response.data.data.username
            this.$store.state.user_id = response.data.data.userId
            if (response.data.data.role === 0) {
              this.$store.state.isbuyer = true
            } else if (response.data.data.role === 1) {
              this.$store.state.isseller = true
            }
            Bus.$emit("validate-complete")
          })
      }
    }
  },
  mounted() {
    this.validation()
    console.log("app mounted");
  }
};
</script>