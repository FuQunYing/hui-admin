<template>
  <a-layout>
    <a-layout-sider  width="240">
      <div class="logo"><img src="../assets/logo.jpg" alt=""></div>
      <a-menu mode="inline" theme="dark"
              :selectedKeys="selectKey"
              :openKeys="openKey"
              class="side-menu"
              @openChange="onOpenChange">
        <template v-for="item in menus">
          <a-sub-menu v-if="item.children.length>0" :key="item.key">
            <template #icon><Icon :icon="item.icon"/></template>
            <template #title>{{item.title}}</template>
            <a-menu-item  v-for="child in item.children" :key="child.key">
              <router-link :to="child.path">{{child.title}}</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item v-if="item.children.length===0" :key="item.key">
            <template #icon><Icon :icon="item.icon"/></template>
            <router-link :to="item.path">{{item.title}}</router-link>
          </a-menu-item>
        </template>
      </a-menu>
    </a-layout-sider>

    <a-layout  class="main">
      <a-layout-header  class="top-header">
        <span class="avatar">
        <span>欢迎你，<span>{{userName}}</span></span>
        <a @click="logout"><Icon icon="LogoutOutlined"/>退出</a>
      </span>
      </a-layout-header>
      <a-layout-content class="container">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import {NAV} from "@/router/menu";
import {message} from "ant-design-vue";

let router = useRouter()
// let menus = JSON.parse(localStorage.getItem('menu'))
let menus = NAV
let selectKey = ref([])
let openKey = ref([])
let rootSubmenuKeys = ref([])

let userName = localStorage.getItem('uname')

const route = useRoute();
onMounted(() => {
  console.log(menus);
  menus.forEach((item) => {
    rootSubmenuKeys.value.push(item.key)
  })
  console.log(rootSubmenuKeys.value);
  matchRoute(route.path)
})
onUnmounted(() => {
  window.onresize = null
})
watch(
    () => route.path,
    async path => {matchRoute(path)}
)
const onOpenChange = openKeys => {
  const latestOpenKey = openKeys.find(key => openKey.value.indexOf(key) === -1);
  if (rootSubmenuKeys.value.indexOf(latestOpenKey) === -1) {
    openKey.value = openKeys;
  } else {
    openKey.value = latestOpenKey ? [latestOpenKey] : [];
  }
};
function matchRoute(path) {
  console.log(path);
  selectKey.value = []
  menus.forEach(val => {
    if(val.children && val.children.length>0){
      val.children.forEach(cval => {
        if(cval.path === path){
          selectKey.value.push(cval.key)
          openKey.value.push(val.key)
        }
      })
    } else {
      if(val.path === path) {
        selectKey.value.push(val.key)
      }
    }
  })
  // console.log(selectKey.value);
}
function logout() {
  localStorage.clear()
  message.success('退出成功')
  router.push('/login')
  /*CommonService.logout({})
      .then((res) => {
        if(res.code === 200) {
          message.success('退出成功')
          router.push('/login')
        } else {
          message.error(res.msg)
        }
      })*/
}
</script>

<style lang="less">
*{
  &::-webkit-scrollbar{
    width: .2rem;
    height: .2rem;
    background: hsla(0, 0%, 100%, 0.6);
  }
  &::-webkit-scrollbar-track{
    border-radius: 0;
  }
  &::-webkit-scrollbar-thumb{
    background-color: rgba(95,95,95,.4);
    transition: all .2s;
    border-radius: .5rem;
    &:hover {
      background-color: rgba(95,95,95, .7);
    }
  }

}
.slide-fade-enter-active {transition: all 0.4s ease-out;}
.slide-fade-leave-active {transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);}
.slide-fade-enter-from,
.slide-fade-leave-to {transform: translateY(30px);opacity: 0;}
.slide-fade-leave-to {display: none;}
body, html {
  font-size: 16px;
  overflow: hidden;
}
@media screen and (max-width: 1440px) {
  body, html {
    font-size: 15px;
  }
}
@media screen and (max-width: 1220px) {
  body, html {
    font-size: 14px;
  }
}
.mr-5{margin-right: 5px !important;}
.mr-10 {margin-right: 10px !important;}
.mr-15 {margin-right: 15px !important;}
.mr-20 {margin-right: 20px !important; ;}
.mr-32 {margin-right: 32px !important; ;}
.mb-10 {margin-bottom: 10px;}
.mb-16 {margin-bottom: 16px;}
.mb-32 {margin-bottom: 32px;}
.mt-16 {margin-top: 16px;}
.mt-24 {margin-top: 24px;}
.mt-32 {margin-top: 32px;}
.red {color: #f00}
.green {color: #87d068}
@media screen and (max-width: 960px) {
  body, html {
    font-size: 12px;
  }
}

#app {
  width: 100%;
  height: 100vh;
  position: relative;
  .ant-menu-sub.ant-menu-inline {background: transparent;}
  .ant-menu-sub.ant-menu-inline > .ant-menu-item, .ant-menu-sub.ant-menu-inline > .ant-menu-submenu > .ant-menu-submenu-title {
    height: 50px;
    line-height: 50px;
  }
  .ant-tree .ant-tree-treenode{
    width: 100%;
  }
  .ant-tree-switcher{
    line-height: 30px;
  }
  .ant-tree .ant-tree-node-content-wrapper {
    width: 100%;
    line-height: 30px;
    .ant-btn {
      float: right;
      opacity: 0;
    }
  }
  .ant-tree .ant-tree-node-content-wrapper:hover {
    .ant-btn {
      opacity: 1;
    }
  }
  .ant-layout {height: 100vh;}
  .section {
    height: 100vh;
    overflow: hidden;
  }
  .logo {
    width: 100%;
    text-align: center;
    height: 64px;
    line-height: 64rpx;
    >img{
      width: 75%;
    }
  }
  .top-header {
    width: 100%;
    background-color: #fff;
    position: relative;
    box-shadow: 0 1px 10px #999;
    z-index: 1;
    text-align: right;
    .avatar {
      font-size: 16px;
      color: #000;
      >span {
        margin-right: 48px;
        position: relative;
        .icon {
          width: 40px;
          height: 30px;
          position: relative;
          top: 8px;
        }
        &:after {
          display: block;
          content: "";
          height: 14px;
          width: 1px;
          background: #ccc;
          position: absolute;
          right: -24px;
          top: 2px;
        }
      }
    }
    a {
      svg {
        margin-right: 6px;
      }
    }
  }
  .main{

  }
  .side-menu {
    height: calc(100% - 100px);
    overflow-y: auto;
    &::-webkit-scrollbar{
      width: .2rem;
      height: .2rem;
      background: transparent;
    }
    &::-webkit-scrollbar-track{
      border-radius: 0;
    }
    &::-webkit-scrollbar-thumb{
      background-color: #009688;
      transition: all .2s;
      border-radius: .5rem;
      &:hover {
        background-color: rgba(95,95,95, .7);
      }
    }
    >li {
      font-size: 15px;
      line-height: 54px;
    }
  }
  .ant-menu-inline.ant-menu-root .ant-menu-item >.ant-menu-title-content{
    white-space: pre-wrap;
    line-height: 1.25;
  }
  .ant-menu-item .ant-menu-item-icon, .ant-menu-submenu-title .ant-menu-item-icon, .ant-menu-item .anticon, .ant-menu-submenu-title .anticon {
    font-size: 16px;
  }
  .ant-collapse-borderless > .ant-collapse-item > .ant-collapse-content{
    background-color: #fff;
  }
  .ant-collapse-borderless > .ant-collapse-item{
    border-bottom: 0;
  }
  .container {
    padding: 16px;
    width: 100%;
  }
  .pd-0{
    padding: 0;
  }
}
.top-group {
  padding: 8px;
  border-radius: 4px;
  background: #fff;
  position: relative;
  width: 100%;
  margin-bottom: 16px;
  .extra{
    position: absolute;
    top: 16px;
    right: 16px;
    margin-bottom: 32px;
  }
  .last-col-btn {
    text-align: right;
  }
  .ant-form-row{
    flex-wrap: nowrap;
  }
}
.ant-modal-body {
  .ant-form-item {
    margin-top: 16px;
  }
}
.content-container{
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  height: 100%;
  overflow: hidden;
  font-size: 16px;
}
.table{
  height: calc(100% - 27.5vh);
  .ant-table-wrapper,.ant-spin-nested-loading,.ant-spin-container{
    height: 100%;
  }
  .ant-table{
    height: 100%;
    overflow-y: auto;
  }
  td{
    white-space: pre-wrap;
    word-break: break-word;
  }
}
.modal-inner{
  max-height: 85vh;
  overflow-y: auto;
}
.preview-img{
  position: relative;
  width: 100px;
  height: auto;
  .preview-mask{
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all .25s;
    opacity: 0;
    span{
      margin-right: 8px;
    }
  }
  &:hover{
    .preview-mask{
      opacity: 1;
    }
  }
}
.preview-modal-img{
  display: block;
  margin: auto;
  max-height: 60vh;
  margin-bottom: 24px;
}
</style>
