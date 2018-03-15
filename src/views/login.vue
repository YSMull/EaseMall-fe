<template>
  <div class="login">
    <Form ref="formInline" :model="formInline" :rules="ruleInline">
      <FormItem prop="user">
        <Input type="text" v-model="formInline.user" placeholder="用户名">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" @on-enter="handleSubmit('formInline')" v-model="formInline.password" placeholder="密码">
        <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
      </FormItem>
    </Form>
  </div>
</template>

<style scoped>
.login {
  width: 20%;
  margin: auto;
  margin-top: 8%;
}
</style>

<script>
import crypto from "crypto";
import axios from "axios";
import util from "../libs/util";
export default {
  data() {
    return {
      formInline: {
        user: "buyer",
        password: "reyub"
      },
      ruleInline: {
        user: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          const data = new FormData();
          data.append("username", this.formInline.user);
          data.append(
            "password",
            crypto
              .createHash("md5")
              .update(this.formInline.password)
              .digest("hex")
          );
          this.$http.post("/login", data, {})
            .then(response => {
              if (response.data.code == 0) {
                this.$Message.success("登录成功!");
                console.log("user_id:" + response.data.data.user_id)
                this.$store.state.userId = response.data.data.user_id
                if (this.$route.query.redirectUrl) {
                  location.href=this.$route.query.redirectUrl
                } else {
                  // this.$router.push({name: 'home'})
                  // location.reload();
                  location.href = '//' +location.host
                }
              } else {
                this.$Message.error("登录失败!");
              }
            })
        }
      });
    }
  },
  mounted() {
    console.log("login mounted");
  }
};
</script>
