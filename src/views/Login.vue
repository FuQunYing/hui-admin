<template>
  <div class="login-container">
    <div class="svg-top">
      <!--      <?xml version="1.0" encoding="utf-8"?>-->
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="1337" width="1337">
        <defs>
          <path id="path-1" opacity="1" fill-rule="evenodd" d="M1337,668.5 C1337,1037.455193874239 1037.455193874239,1337 668.5,1337 C523.6725684305388,1337 337,1236 370.50000000000006,1094 C434.03835568300906,824.6732385973953 6.906089672974592e-14,892.6277623047779 0,668.5000000000001 C0,299.5448061257611 299.5448061257609,1.1368683772161603e-13 668.4999999999999,0 C1037.455193874239,0 1337,299.544806125761 1337,668.5Z"/>
          <linearGradient id="linearGradient-2" x1="0.79" y1="0.62" x2="0.21" y2="0.86">
            <stop offset="0" stop-color="rgb(88,62,213)" stop-opacity="1"/>
            <stop offset="1" stop-color="rgb(23,215,250)" stop-opacity="1"/>
          </linearGradient>
        </defs>
        <g opacity="1">
          <use xlink:href="#path-1" fill="url(#linearGradient-2)" fill-opacity="1"/>
        </g>
      </svg>
    </div>
    <div class="svg-bottom">
      <!--      <?xml version="1.0" encoding="utf-8"?>-->
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="896" width="967.8852157128662">
        <defs>
          <path id="path-2" opacity="1" fill-rule="evenodd" d="M896,448 C1142.6325445712241,465.5747656464056 695.2579309733121,896 448,896 C200.74206902668806,896 5.684341886080802e-14,695.2579309733121 0,448.0000000000001 C0,200.74206902668806 200.74206902668791,5.684341886080802e-14 447.99999999999994,0 C695.2579309733121,0 475,418 896,448Z"/>
          <linearGradient id="linearGradient-3" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0" stop-color="rgb(40,175,240)" stop-opacity="1"/>
            <stop offset="1" stop-color="rgb(18,15,196)" stop-opacity="1"/>
          </linearGradient>
        </defs>
        <g opacity="1">
          <use xlink:href="#path-2" fill="url(#linearGradient-3)" fill-opacity="1"/>
        </g>
      </svg>
    </div>
    <div class="login-con">
      <p><span>欢迎登录 </span><span> 邻小帮后台</span></p>
      <a-form :label-col="{span: 5}" class="login-form">
        <a-form-item>
          <a-input v-model:value="userName" placeholder="请输入用户名" size="large">
            <template #prefix>
              <UserOutlined style="opacity: .75;"/>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input-password v-model:value="password" placeholder="请输入密码" @keydown.enter="login" size="large">
            <template #prefix>
              <LockOutlined style="opacity: .75;"/>
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button block type="primary" @click="login" size="large">
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue"
// import { LoginService } from "@/api/api";
import { useRouter } from "vue-router";
let router = useRouter()


onMounted(() => localStorage.clear())

let userName = ref('')
let password = ref('')
function login() {
  const loginParam = {
    userName: userName.value,
    password: password.value
  }
  // message.success('登录成功')
  // localStorage.setItem('uname', userName.value)
  router.push('/index')
 /* LoginService.login(loginParam)
      .then(res => {
        console.log(res);
        if (res.code === 200) {
          message.success('登录成功')
          console.log(res.data);
          localStorage.setItem('uname', userName.value)
          // localStorage.setItem('token', res.data.token)
          router.push('/index')
        } else {
          message.error(res.msg)
        }
      })*/
}
</script>

<style lang="less" scoped>
.login-container{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #DBE0F9;
  .svg-top {
    position: absolute;
    top: -900px;
    right: -300px;
  }
  .svg-bottom {
    position: absolute;
    bottom: -500px;
    left: -200px;
  }
}
.login-con {
  width: 40%;
  max-width: 700px;
  margin: auto;
  position: relative;
  top: 30%;
  padding: 40px;
  border-radius: 20px;
  background-color: #fff;
  > p {
    color: #0436B5;
    font-size: 30px;
    margin-bottom: 20px;
    margin-top: 40px;
    margin-top: 0;
    > span {
      &:last-child {
        font-size: 35px;
        font-weight: bold;
      }
    }
  }
}

.pic-icon {
  position: absolute;
  width: 35%;
  left: -32.5%;
  top: -240%;
  transform: rotate(-30deg);
  filter: drop-shadow(2px 4px 6px black);
  pointer-events: none;
  > svg {
    width: 100%;
    height: auto;
  }
}
</style>
