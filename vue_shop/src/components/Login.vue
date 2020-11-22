<template>
    <div class="login_container">
        <div class="login_box">
            <!--logo-->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!--登录区-->
            <el-form ref="LoginFormRef" :model="loginForm" class="login_form" :rules="loginRules">
               <!--用户名输入-->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="fontFamily hhtxdenglu"></el-input>
                </el-form-item>
                <!-- 密码输入 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="fontFamily hhtxmima1" type="password"></el-input>
                </el-form-item>
                <!-- 按钮form -->
                <el-form-item >
                    <!-- 登录按钮 -->
                    <el-button type="primary" class="btnl" @click="login">登录</el-button>
                    <!-- 重置 -->
                    <el-button type="info" class="btnr" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },

      loginRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        //   { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      this.$refs.LoginFormRef.resetFields()
    },
    login () {
      this.$refs.LoginFormRef.validate(async valid => {
        if (!valid) return
        const result = await this.$http.post('login', this.loginForm)
        if (result.data.data !== null) {
          console.log(result)
          return this.$message.success('登陆成功')
        } else {
          return this.$message.error('登陆失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
    background-color: #2b4b6d;
    height: 100%
}
.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);

    .avatar_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px;
        position: absolute;
        left:50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        img{
            height: 100%;
            widows: 100%;
            background-color: #eee;
            border-radius: 50%;
        }
    }
}
.login_form{
    position: absolute;
    top:35%;
    // bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
// .btn{
//     display: flex;
//     justify-content: flex-end;
// }
.btnl{
    position: absolute;
    left: 40%;
    transform: translate(-50%);
}
.btnr{
    position: absolute;
    left: 60%;
    transform: translate(-50%);
}
</style>
