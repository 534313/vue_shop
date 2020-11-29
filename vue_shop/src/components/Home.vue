<template>
  <!-- <div>
    <el-button @click="logout">退出</el-button>
  </div> -->
  <el-container class="home_container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../image/购物车.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <!-- "isCollapse ? '64px' : '200px'" -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠按钮 -->
        <div class="toggle-button" @click="toggleCollapse">
          | | |
        </div>
        <!--unique-opened只允许一个menu展开  -->
        <el-menu
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color=" rgb(44, 175, 219)"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active ="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="menu.id+''" @handleOpen="handleOpen" @handleClose="handleClose" v-for="menu in menuList" :key="menu.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <!-- 文本 -->
              <span>{{menu.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+item.path" v-for="item in menu.children" :key="item.id" @click="saveNavState('/'+item.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>{{item.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主要部分 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      menuList: [],
      isCollapse: false,
      // 被激活的地址
      activePath: window.sessionStorage.getItem('activePath')
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout: function () {
      //  清空token
      window.sessionStorage.clear()
      //  跳转到登陆页
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get(
        'menus/findAll'
      )
      console.log(res)
      if (res.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    handleOpen: function () {},
    handleClose: function () {}
  }
}
</script>
<style lang='less' scoped>
.home_container {
  height: 100%;
}
.logo {
  height: 100%;
  border-radius: 50%;
}
// .tit{
//     color:aliceblue;
//     font-family: 'youyuan';
//     font-size: 20px;
//     position:absolute;
//     top:20px
// }
.toggle-button {
  background-color: rgb(12, 43, 61);
  color: white;
  text-align: center;
  font-size: 10px;
  line-height: 25px;
  //letter-spacing:字与字之间的间隙
  letter-spacing: 0.1em;
  //鼠标变成小手
  cursor: pointer;
}
.logout {
  position: absolute;
  top: 20px;
  right: 0;
}

.el-menu {
  border-right: 0;
}
.el-header {
  background-color: rgb(5, 32, 56);
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    > img {
      height: 60px;
    }
    display: flex;
    align-items: center;
  }
  color: aliceblue;
  font-family: 'youyuan';
  font-size: 20px;
}
.el-aside {
  background-color: rgb(5, 32, 56);
}
.el-main {
  background-color: white;
}
</style>
