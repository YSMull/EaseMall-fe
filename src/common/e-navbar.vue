<template>
    <div>
        <Menu mode='horizontal' :theme='theme' active-name='home' @on-select='onSelect'>
            <MenuItem name='home'>首页</MenuItem>
            <MenuItem v-if="this.$store.state.isbuyer" name='accounting'>账务</MenuItem>
            <MenuItem v-if="this.$store.state.isbuyer" name='shopcart'>购物车</MenuItem>
            <MenuItem v-if="this.$store.state.isseller" name='publish'>发布</MenuItem>
            <Submenu v-if='this.$store.state.islogin' name='user' class='ivu-menu-item user-bar'>
                <template slot='title'>
                    <span v-text='this.$store.state.username'/>
                </template>
                <MenuItem name='logout'>登出</MenuItem>
            </Submenu>
            <MenuItem v-else name='login' class='ivu-menu-item user-bar'>登陆</MenuItem>
        </Menu>
    </div>
</template>

<style scoped>
.ivu-menu-horizontal .user-bar {
  float: right;
}
</style>

<script>
import Bus from "../bus.js";
export default {
  data() {
    return {
      theme: "dark"
    };
  },
  methods: {
    onSelect(item) {
      if (item === "home") {
        this.$router.push({ name: "home" });
      } else if (item === "logout") {
        this.logout();
      } else if (item === "shopcart") {
        this.$router.push({ name: "cart" });
      } else if (item === "accounting") {
        this.$router.push({ name: "account" });
      } else if (item === "login") {
        this.$router.push({
          name: "login",
          query: {
            redirectUrl: window.location.href
          }
        });
      } else if (item === "publish") {
        this.$router.push({
          name: "publish"
        });
      }
    },
    logout() {
      this.$http.get("/logout").then(response => {
        window.location.reload();
      });
    }
  },
  mounted() {
    console.log("navbar mounted");
  }
};
</script>
