<template>
  <a-layout>
    <a-layout-content style="background:#fff">
      <a-row>
        <a-button
          type="link"
          style="float:right;margin-top: 35px;margin-right: 34px;margin-left:-50px;"
          @click="toLogin"
          v-if="!isLogin"
        >
          登录
        </a-button>
        <div style="float:right;margin-top: 40px;margin-right:30px;">
          <span style="">欢迎：</span>
          <span style="" v-if="isLogin">{{ avatarValue }}</span>
        </div>
      </a-row>
      <a-row type="flex" justify="center">
        <img
          :src="require('@/assets/logo.png')"
          width="120px"
          height="120px"
          style="margin-bottom: 30px;margin-top:10px;"
        />
      </a-row>
      <a-row type="flex" justify="center">
        <a-col :xs="12" :span="8">
          <a-input-search
            :placeholder="mytips"
            enter-button="开始寻踪"
            size="large"
            @search="getSearchResult"
          />
        </a-col>
      </a-row>
      <a-row id="text-tip" type="flex" justify="center">
        <span class="diy-text">
          搜索条件：
        </span>
        <a-radio-group
          :options="plainOptions"
          :default-value="value"
          @change="onChange"
        />
      </a-row>
      <a-row id="result" type="flex" justify="center">
        <a-col :xs="12" :span="8">
          <a-spin :spinning="spinning">
            <div class="spin-content" v-if="isLoading">
              正在努力寻踪中，请耐心等待...
            </div></a-spin
          >
          <a-descriptions title="寻踪结果：" bordered v-if="isFound">
            <a-descriptions-item label="个人信息">
              姓名：{{ resultData["chs_name"] }}
              <br />
              员工号：{{ resultData["staff_code"] }}
              <br />
              所属部门：{{ resultData["department"] }}
              <br />
              上级领导：{{ resultData["leader"] }}
              <br />
              邮箱地址：{{ resultData["email"] }}
              <br />
              用户名：{{ resultData["username"] }}
              <br />
            </a-descriptions-item>

            <a-descriptions-item label="设备信息" :span="2">
              IP地址：{{ resultData["ip"] }}
              <br />
              MAC地址：{{ resultData["mac"] }}
              <br />
              设备名：{{ resultData["fqdn"] }}
              <br />
              设备厂商：{{ resultData["oui"] }}
              <br />
              接入类型：{{ resultData["connection_type"] }}
              <br />
            </a-descriptions-item>
            <a-descriptions-item label="位置信息" :span="3">
              区域：{{ resultData["area"] }}
              <br />
              办公点：{{ resultData["location"] }}
              <br />
              接入点：{{ resultData["position"] }}
              <br />
            </a-descriptions-item>
          </a-descriptions>
        </a-col>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<script>
// @ is an alias to /src
import { get } from "@/http";
export default {
  name: "Home",
  data() {
    return {
      avatarValue: "",
      color: "#1890ff",
      resultData: {
        ip: "",
        mac: "",
        area: "",
        location: "",
        position: "",
        connection_type: "",
        ip_type: "",
        username: "",
        email: "",
        chs_name: "",
        leader: "",
        department: "",
        staff_code: "",
        fqdn: "",
        oui: ""
      },
      plainOptions: ["IP", "MAC", "Username"],
      value: "IP",
      mytips: "请输入IP",
      spinning: false,
      isLoading: false,
      isFound: false,
      isLogin: false
    };
  },
  methods: {
    getSearchResult(ip) {
      if (!this.isLogin) {
        this.$message.error("请登录后使用！");
        return "";
      }
      if (ip === "") {
        this.$message.error("请输入关键词！");
        return "";
      }
      this.spinning = true;
      this.isLoading = true;
      get("/trace/ip/" + ip + "/").then(res => {
        this.resultData = res;
        if (this.resultData == "该IP不在线") {
          //this.$message.error("该IP不在线");
          this.$notification["error"]({
            message: "寻踪失败！",
            description: "该IP不在线！"
          });
          this.isFound = false;
        } else if (this.resultData == "输入有误") {
          //this.$message.error("该IP不在线");
          this.$notification["error"]({
            message: "输入有误！",
            description: "请输入正确格式！"
          });
          this.isFound = false;
        } else {
          this.isFound = true;
        }
        this.spinning = false;
        this.isLoading = false;
      });
    },
    onChange(e) {
      if (e.target.value === "MAC") {
        this.mytips = "请输入MAC：f3ff.d12c.478c";
      } else if (e.target.value === "Username") {
        this.mytips = "请输入Usermame：xiaoming1";
      } else {
        this.mytips = "请输入IP";
      }
    },
    CheckStatus() {
      get("/trace/user/").then(res => {
        if (res === "AnonymousUser") {
          this.$message.error("请登录后使用！");
          this.isLogin = false;
        } else {
          this.isLogin = true;
          this.$message.success("登录成功！");
          this.avatarValue = res;
        }
      });
    },
    toLogin() {
      window.location.href =
        "https://www.google.com";
    }
  },
  created() {
    this.CheckStatus();
  }
};
</script>

<style lang="scss">
.spin-content {
  border: 1px solid #91d5ff;
  background-color: #e6f7ff;
  padding: 30px;
}
.diy-text {
  font-size: 14px;
  font-weight: 600;
  color: rgba(34, 34, 34, 1);
}
#text-tip {
  margin-top: 30px;
}

#result {
  margin-top: 30px;
}
</style>
