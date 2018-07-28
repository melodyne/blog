// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import iView from 'iview';
import iviewArea from 'iview-area';
import App from './App'
import { router } from './router/index'
import store from './store';
import '@/locale';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
import Icon from 'vue-awesome/components/Icon';
import 'vue-awesome/icons/brands/qq';
import 'vue-awesome/icons/brands/weixin';
import 'vue-awesome/icons/brands/weibo';
import { getRequest, postRequest, putRequest, deleteRequest, uploadFileRequest } from '@/utils/api';
import util from '@/libs/util';
import hasPermission from '@/libs/hasPermission';

import 'layui-src/dist/css/layui.css';
import 'layui-src/dist/layui.js';

Vue.config.productionTip = false
Vue.use(VueI18n);
Vue.use(iView);
Vue.use(iviewArea);
Vue.component('icon', Icon);
Vue.use(hasPermission);
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.uploadFileRequest = uploadFileRequest;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted() {
        // 初始化菜单
        util.initRouter(this);
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
    }
})


  layui.use(['form', 'layedit', 'laydate'], function(){
    var form = layui.form
      ,layer = layui.layer
      ,layedit = layui.layedit
      ,laydate = layui.laydate;

    //日期
    laydate.render({
      elem: '#date'
    });
    laydate.render({
      elem: '#date1'
    });

    //创建一个编辑器
    var editIndex = layedit.build('LAY_demo_editor');

    //自定义验证规则
    form.verify({
      title: function(value){
        if(value.length < 5){
          return '标题至少得5个字符啊';
        }
      }
      ,pass: [/(.+){6,12}$/, '密码必须6到12位']
      ,content: function(value){
        layedit.sync(editIndex);
      }
    });

    //监听指定开关
    form.on('switch(switchTest)', function(data){
      layer.msg('开关checked：'+ (this.checked ? 'true' : 'false'), {
        offset: '6px'
      });
      layer.tips('温馨提示：请注意开关状态的文字可以随意定义，而不仅仅是ON|OFF', data.othis)
    });

    //监听提交
    form.on('submit(demo1)', function(data){
      layer.alert(JSON.stringify(data.field), {
        title: '最终的提交信息'
      })
      return false;
    });

    //表单初始赋值
    form.val('example', {
      "username": "贤心" // "name": "value"
      ,"password": "123456"
      ,"interest": 1
      ,"like[write]": true //复选框选中状态
      ,"close": true //开关状态
      ,"sex": "女"
      ,"desc": "我爱 layui"
    })


  });
