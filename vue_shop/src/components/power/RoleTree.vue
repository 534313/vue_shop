<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/home' }" @click="returnHome">活动管理</el-breadcrumb-item> -->
      <!-- @click="returnHome" -->
      <el-breadcrumb-item
        ><a href="#/welcome" @click="returnHome">首页</a></el-breadcrumb-item
      >
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showTable">显示表格</el-button>
        </el-col>
      </el-row>
      <el-tree :data="rightList" @node-click="handleNodeClick">
        <span class="custom-tree-node" slot-scope="{ data }">
          <span>{{ data.authName }}</span>
          <span>
            <el-tag v-if="data.level === '0'">一级</el-tag>
            <el-tag type="success" v-if="data.level === '1'">二级</el-tag>
            <el-tag type="warning" v-if="data.level === '2'">三级</el-tag>
          </span>
        </span>
      </el-tree>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightList: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    }
  },
  created() {
    this.getRightList()
  },
  methods: {
    async getRightList() {
      const { data: res } = await this.$http.get('rights/tree')
      console.log(res)
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      } else {
        this.rightList = res.data
      }
    },
    returnHome() {
      window.sessionStorage.removeItem('activePath')
    },
    handleNodeClick(data) {
      console.log(data)
    },
    showTable() {
      this.$router.push('/rights')
    },
  },
}
</script>
<style>
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin-left: 10px;
}
.el-tree-node__content {
  height: 50px !important
}
</style>
