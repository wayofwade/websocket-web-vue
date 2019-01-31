<template>
    <div class="main-div">
      <!--聊天的列表-->
      <div class="chat-list">
        <div v-for="(item, index) in personList" :key="index">
        <div class="chat-one top5" :style="{backgroundColor: item.color}"  @click="chatToWho(index)">
          <div class="chat-list-pic top5">
            <img class="imgs" src="../../assets/image/克莱汤普森.jpg">
          </div>
          <div class="chat-list-text">
            <span class="chat-name">{{item.name}}</span>
          </div>
        </div>
        </div>
      </div>
      <!--聊天的列表-->
      <div class="chat-detail">
        <div class="chat-top">
          <div class="chat-top-div top5">
            <div class="chat-top-pic top5">
              <img class="imgs" src="../../assets/image/克莱汤普森.jpg">
            </div>
            <div class="chat-top-person-des">
              <span class="chat-name">浙江省-杭州市-西湖区({{nickName ? nickName : '匿名'}})</span>
            </div>
          </div>
        </div>
        <div class="chat-mid">
          <!--右边的人--->
          <div class="chat-mid-line" style="clear: both;" v-for="(item, index) in chatList" :key="index">
            <div class="chat-mid-right" v-if="item.right">
              <div class="chat-mid-right-text">
                <div class="chat-right-text-detail">
                    {{item.text}}<!-- -{{index}}-->
                </div>
              </div>
              <div class="chat-mid-right-pic">
                <img class="imgs" src="../../assets/image/克莱汤普森.jpg">
              </div>
            </div>
            <div class="chat-mid-left" v-else>
              <div class="chat-mid-left-pic">
                <img class="imgs" src="../../assets/image/克莱汤普森.jpg">
              </div>
              <div class="chat-mid-left-text">
                <div class="chat-left-text-detail">
                  {{item.text}}<!-- -{{index}}-->
                </div>
              </div>
            </div>
          </div>
          <!--右边的人--->
        </div>
        <div class="chat-foot">
          <div class="chat-foot-input">
            <el-input
              class="chat-foot-input-text"
              type="textarea"
              :rows="9"
              placeholder="请输入内容"
              v-model="inputText">
            </el-input>
          </div>
          <div class="chat-foot-btn">
            <el-button class="sb-btn" size="mini" type="primary" @click="addChat" :disabled="ifDisable()">发送</el-button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'
import axios from 'axios'

export default {
  components: {},
  name: '',
  data () {
    return {
      personList: [{name: '德玛西亚', color: 'whitesmoke'}, {name: '张家辉', color: 'white'}, {name: '张学友', color: 'white'}], // 聊天的人员列表
      chatList: [],
      inputText: '', // 输入的文字
      received_messages: [],
      send_message: null,
      style: {
        'backgroundColor': 'white'
      },
      connected: false,
      stompClient: '',
      nickName: '' // 聊天人的名字
    }
  },
  created () {
    this.connect()
  },
  methods: {
    trimStr (str) {
      return str.replace(/(^\s*)|(\s*$)/g, '')
    },
    setBackColor (index) { // backgroundColor
      this.personList.forEach((val, key) => {
        if (key === index) {
          this.personList[key].color = 'whitesmoke'
        } else {
          this.personList[key].color = 'white'
        }
      })
    },
    chatToWho (index) { // 和谁聊天
      console.log(this.personList[index].name)
      this.nickName = this.personList[index].name
      this.setBackColor(index)
    },
    /* 初始化websochet */
    send (message) { // 发送信息到server端。可以了。
      console.log('Send message:' + this.send_message)
      if (this.stompClient && this.stompClient.connected) {
        console.log('连接好了')
        this.stompClient.send('/app-receive/from-client', message, {}) // /app-receive/
      } else {
        console.log('没有连接好了')
      }
    },
    connect () {
      // this.socket = new SockJS('http://localhost:9527/blog/websocket-endpoint') // 连接也是可以的。但是没收到消息
      this.socket = new SockJS('http://localhost:9527/blog/websocket-endpoint') // 连接也是可以的。但是没收到消息
      this.stompClient = Stomp.over(this.socket)
      this.stompClient.connect({}, (frame) => {
        this.connected = true
        console.log(frame)
        this.stompClient.subscribe('/global-message/tick', (tick) => { // 默认地址==》/global-message/tick
          console.log(tick.body)
          let obj = {
            text: tick.body,
            right: false
          }
          this.chatList.push(obj)
          this.$nextTick(() => {
            this.initScroll()
          })
          this.received_messages.push(tick)
        })
        console.log('连接成功啦啦啦啦啦啦')
      }, (error) => {
        console.log('断开连接的')
        console.log(error)
        this.connected = false
      })
    },
    disconnect () {
      if (this.stompClient) {
        this.stompClient.disconnect()
      }
      this.connected = false
    },
    tickleConnection () {
      this.connected ? this.disconnect() : this.connect()
    },
    // ===============================
    addChat () { // 添加聊天内容
      let obj = {
        text: this.inputText,
        right: true
      }
      this.chatList.push(obj)
      this.sendMessage(obj)
      this.send(this.inputText) // 传送socket
      this.inputText = ''
      this.$nextTick(() => {
        this.initScroll()
      })
    },
    sendMessage (msgObj) { // 发送到server
      console.log(msgObj)
      axios.get('/blog/socket/getMessage', { params: { text: msgObj.text } }).then((res) => {
      }).catch((error) => {
        console.log(error)
      })
    },
    ifDisable () {
      return this.trimStr(this.inputText).length === 0
    },
    initScroll () {
      let showContent = document.querySelector('.chat-mid')
      showContent.scrollTop = showContent.scrollHeight
    }
  }
}
</script>

<style scoped>
.main-div{
  width:100%;
  height:100%;
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  background-color: white;
}
  .chat-list{
    width: 200px;
    background-color: white;
    margin-right: 2px;
  }
  .chat-detail{
    float: none;
    clear: both;
    overflow:auto;
    flex: 1;
    min-width: 300px;
    background-color: whitesmoke;
  }
  .chat-one{
    height:60px;
    background-color: white;
    min-height: 60px;
    /*margin-top: 20px;*/
    display: flex;
    flex-wrap: wrap;
    flex-flow: row;
    justify-content: flex-start;
  }
  .chat-top-div{
    height:60px;
    background-color: whitesmoke;
    min-height: 60px;
    display: flex;
    flex-wrap: wrap;
    flex-flow: row;
    justify-content: flex-start;
  }
  .chat-name{
    line-height: 60px;
  }
  .chat-top{
    height: 60px;
    background-color: lightyellow;
  }
  .chat-mid{
    height: 500px;
    max-height: 500px;
    overflow: auto;
    background-color: whitesmoke;
    border: solid 1px lightsteelblue;
  }
  .chat-foot{
    height:calc(100% - 570px);
    background-color: whitesmoke;
    padding: 20px 40px;
    box-sizing: border-box;
  }
  .chat-foot-input{
    width:calc(100% - 10px);
    height: 200px;
  }
  .chat-foot-input-text{
    width: 100%;
    height:100%;
  }
  .chat-foot-btn{
    margin-top: 20px;
  }
  .chat-mid-left{
    min-height: 60px;
    background-color: whitesmoke;
    max-width: 500px;
    float:left;
    display: flex;
    flex-wrap: wrap;
    flex-flow: row;
    justify-content: flex-start;
  }
  .chat-mid-right{
    min-height: 60px;
    background-color: whitesmoke;
    max-width: 500px;
    float:right;
    display: flex;
    flex-wrap: wrap;
    flex-flow: row;
    justify-content: flex-start;
  }
  .chat-mid-left-text{
    background-color: whitesmoke;
    padding: 15px 15px 15px 5px;
    box-sizing: border-box;
  }
  .chat-list-text{
  }
  .chat-mid-right-text{
    background-color: whitesmoke;
    padding: 15px 5px 15px 15px;
    box-sizing: border-box;
  }
  .chat-right-text-detail{
    background-color: #6cb5f4;
    padding: 10px 9px;
    box-sizing: border-box;
    text-align: left;
    border-radius:5px;
    line-height: 25px;
  }
  .chat-left-text-detail{
    background-color: #6cb5f4;
    padding: 10px 15px;
    box-sizing: border-box;
    border-radius:5px;
  }
  .chat-mid-left-pic{
    width:80px;
  }
  .chat-mid-right-pic{
    width:80px;
  }
  .chat-list-pic{
    width: 70px;
  }
  .chat-top-pic {
    width: 104px;
  }
  .chat-mid-line{
    min-height: 100px;
    background-color: whitesmoke;
    padding: 10px;
    box-sizing: border-box;
  }
  .imgs{
    width:50px;
    height:50px;
    border-radius:25px;
  }
  .top5{
    margin-top: 5px;
  }
  .sb-btn{
    float: right;
  }
</style>
