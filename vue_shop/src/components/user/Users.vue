<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/home' }" @click="returnHome">活动管理</el-breadcrumb-item> -->
      <!-- @click="returnHome" -->
      <el-breadcrumb-item
        ><a href="#/welcome" @click="returnHome">首页</a></el-breadcrumb-item
      >
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片主体区 -->
    <el-card>
      <!-- el-row:卡片的一行 -->
      <!-- gutter：列于列之间的空隙 -->
      <el-row :gutter="20">
        <!-- span:一列所占用的栅格数，共24个 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="quaryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
              keyup.enter="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="dialogFormVisible = true"
            >添加用户</el-button
          >
          <!-- 添加用户表单 -->
          <el-dialog
            title="添加用户"
            :visible.sync="dialogFormVisible"
            @close="dialogClosed"
          >
            <el-form :model="addform" :rules="FormRules" ref="addForm">
              <el-form-item label="用户名" prop="username">
                <el-input
                  v-model="addform.username"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="addform.password"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="电话号码" prop="mobile">
                <el-input
                  v-model="addform.mobile"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addform.email" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUser(addform)"
                >确 定</el-button
              >
            </div>
          </el-dialog>
        </el-col>
        <el-col :span="3">
          <el-button type="info" @click="refleshTable">重置</el-button>
        </el-col>
      </el-row>
      <!-- table主体区 -->
      <!-- :data来绑定数据源 -->
      <el-table :data="userList" height="400" border style="width: 100%" stripe>
        <!-- 索引列， type="index"即可指定 -->
        <el-table-column type="index" label="#" width="100"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="100">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="200">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="200">
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" class="options">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showUpdateForm(scope)"
              ></el-button>
            </el-tooltip>
            <!-- 修改用户表单 -->
            <el-dialog
              title="修改用户信息"
              :visible.sync="updateDialogVisible"
              @close="updateDialogClosed"
            >
              <el-form
                :model="updateform"
                :rules="updateFormRules"
                ref="updateForm"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input
                    :value="updateform.username"
                    autocomplete="off"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
                <el-form-item label="电话号码" prop="mobile">
                  <el-input
                    v-model="updateform.mobile"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input
                    v-model="updateform.email"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="updateDialogVisible = false"
                  >取 消</el-button
                >
                <el-button type="primary" @click="updateUser(updateform)"
                  >确 定</el-button
                >
              </div>
            </el-dialog>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="delectMessageShow(scope)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                circle
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="quaryInfo.pagenum"
        :page-sizes="[1, 3, 5, 7]"
        :page-size="quaryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getUserList()
  },
  data() {
    return {
      userList: [],
      total: 0,
      dialogFormVisible: false,
      updateDialogVisible: false,
      addform: {
        username: '',
        password: '',
        mobile: '',
        email: '',
      },
      updateform: {
        id: 0,
        username: '',
        password: '',
        mobile: '',
        email: '',
        mg_state: false,
        role_name: '',
      },
      quaryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 3,
      },
      FormRules: {
        username: { required: true, message: '请输入用户名', trigger: 'blur' },
        password: { required: true, message: '请输入密码', trigger: 'blur' },
        mobile: { required: true, message: '请输入电话号码', trigger: 'blur' },
        email: { required: true, message: '请输入邮箱', trigger: 'blur' },
      },
      updateFormRules: {
        mobile: { required: true, message: '请输入电话号码', trigger: 'blur' },
        email: { required: true, message: '请输入邮箱', trigger: 'blur' },
      },
    }
  },
  methods: {
    returnHome() {
      window.sessionStorage.removeItem('activePath')
    },
    async getUserList() {
      const { data: res } = await this.$http.get('user/findByPage', {
        params: this.quaryInfo,
      })
      console.log(res)
      if (res.status !== 200) return this.$message.error(res.msg)
      this.userList = res.data
      this.total = res.total
    },
    handleSizeChange(pageSize) {
      this.quaryInfo.pagesize = pageSize
      this.getUserList()
    },
    handleCurrentChange(pageNum) {
      console.log(pageNum)
      this.quaryInfo.pagenum = pageNum
      this.getUserList()
    },
    async userStateChanged(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put('user/update', userinfo)
      console.log(res)
    },
    refleshTable() {
      this.quaryInfo.query = ''
      this.getUserList()
    },
    addUser(userinfo) {
      this.$refs.addForm.validate(async (valid) => {
        if (!valid) return
        console.log(userinfo)
        const { data: res } = await this.$http.post('user/addUser', userinfo)
        if (res.status !== 200) {
          this.$message.error(res.msg)
        }
        console.log(res)
        this.dialogFormVisible = false
        this.getUserList()
      })
    },
    dialogClosed() {
      this.$refs.addForm.resetFields()
    },
    getUpdateForm(scope) {
      this.updateform.id = scope.row.id
      this.updateform.password = scope.row.password
      this.updateform.username = scope.row.username
      this.updateform.mobile = scope.row.mobile
      this.updateform.email = scope.row.email
      this.updateform.mg_state = scope.row.mg_state
      this.updateform.role_name = scope.row.role_name
    },
    showUpdateForm(scope) {
      this.updateDialogVisible = true
      this.getUpdateForm(scope)
    },
    updateDialogClosed() {
      this.updateDialogVisible = false
    },
    updateUser(scope) {
      this.$refs.updateForm.validate(async (valid) => {
        if (!valid) return
        console.log(scope)
        const { data: res } = await this.$http.put('user/update', scope)
        if (res.status !== 200) {
          this.$message.error(res.msg)
        }
        console.log(res)
        this.updateDialogVisible = false
        this.getUserList()
      })
    },
    delectMessageShow(scope) {
      this.getUpdateForm(scope)
      this.$confirm(
        '是否删除用户名为' + this.updateform.username + '的用户？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(async () => {
          const { data: res } = await this.$http.post(
            'user/delect',
            this.updateform
          )
          if (res.status === 200) {
            this.getUserList()
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
          } else {
            this.$message({
              type: 'info',
              message: res.msg,
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
  },
}
</script>
<style lang="less" scoped>
.el-button {
  margin-right: 10px;
  margin-left: 10px;
}
.el-row {
  margin-bottom: 20px;
}
.el-table {
  font-size: 12px;
}
.options {
  display: flex;
}
.el-pagination {
  margin-top: 15px;
}
</style>
