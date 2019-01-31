<template>
    <div class="header-div" style="background-color: #324057;top:0px;">
      <span id="system-name">聊天系统</span>
        <el-dropdown @command="handleCommand" class="user">
        <span class="el-dropdown-link" :v-model="name">
         <img id="imgs" src="../../assets/image/克莱汤普森.jpg">
         </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">更改密码</el-dropdown-item>
                <el-dropdown-item command="e" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
      <span id="myName">张家辉</span>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      activeIndex: '1',
      activeIndex2: '1',
      name: '李四'
    }
  },
  methods: {
    handleCommand (command) {
      if (command === 'e') { // 调用登出接口
        axios.post('/apiReal/logout', {}).then(
          (res) => {
            if (res.data.code === 104) {
              this.$message.success('退出成功')
              this.$router.push({path: '/', params: {}})
            } else {
              this.$message.error('退出失败')
            }
          }
        ).catch((error) => {
          console.log(error)
        })
      }
    },
    handleSelect (index) {
    }
  }
}
</script>

<style scoped>
  .header-div{
    width: 100%;
    height:100%;
    padding: 0px;
    box-sizing: border-box;
  }
  a{
      display: inline;
      color: #fff;
      font-size: 20px;
      text-align: center;
      line-height: 60px;
      padding:2px 10px;
    box-sizing: border-box;
      float: left;
  }
  .el-header{
      padding:0;
  }
  .user{
      width:50px;
      height: 50px;
      margin-top: 5px;
      position: absolute;
      right:80px;
      top:0;
      text-align: center;
      line-height: 60px;
      font-size: 14px;
      color: #fff;
      border-radius:25px;
  }
  .el-dropdown-link {
      cursor: pointer;
      color: #fff;
  }
  .el-icon-arrow-down {
      font-size: 12px;
  }
#imgs{
  width:50px;
  height:50px;
  border-radius:25px;
  }
  #myName{
    width:50px;
    height: 50px;
    position: absolute;
    right:20px;
    top:0;
    text-align: center;
    line-height: 60px;
    font-size: 14px;
    color: #fff;
  }
  #system-name{
    height: 50px;
    position: absolute;
    top:0;
    left:50px;
    text-align: left;
    line-height: 60px;
    font-size: 20px;
    color: #fff;
  }
</style>
