<style lang="less">
  @import "./ad.less";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <div style="margin: 30px 0px 30px 40px;font-size: 15px;color: #666;font-weight: bold;font-family: 微软雅黑">新增案例</div>
          <form class="layui-form" action="">
            <div class="layui-form-item">
              <label class="layui-form-label">名称</label>
              <div class="layui-input-block">
                <input type="hidden" v-if="pro.id" name="id" v-model="pro.id">
                <input type="text" name="name" v-model="pro.name" lay-verify="name"  autocomplete="off" placeholder="请输入案例名称" class="layui-input">
              </div>
            </div>
            <div class="layui-form-item layui-form-text">
              <label class="layui-form-label">简介</label>
              <div class="layui-input-block">
                <textarea placeholder="请输入内容" class="layui-textarea" name="intro" v-model="pro.intro"></textarea>
              </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label">标签</label>
              <div class="layui-input-block" style="width: 180px">
                <input type="text" name="tag" v-model="pro.tag"  maxlength="8" placeholder="多个用逗号隔开" autocomplete="off" class="layui-input">
              </div>
            </div>

            <div class="layui-form-item">
              <label class="layui-form-label">封面</label>
              <input type="hidden" name="cover" v-model="pro.cover">
              <div class="layui-input-block">
                <div class="layui-upload-drag" id="test10">
                  <i v-show="!pro.cover" class="layui-icon" style="color: #2d8cf0"></i>
                  <p v-show="!pro.cover">点击上传，或将图片拖拽到此处</p>
                  <img v-show="pro.cover"  width="150px" :src="pro.cover_url">
                </div>
              </div>
            </div>

            <div class="layui-form-item">
              <label class="layui-form-label">二维码</label>
              <input type="hidden" name="qr_code" v-model="pro.qr_code">
              <div class="layui-input-block">
                <div class="layui-upload-drag" id="qr_code">
                  <p v-show="!pro.qr_code">上传体验二维码图片</p>
                  <img v-show="pro.qr_code"  width="100px" :src="pro.qr_code_url">
                </div>
              </div>
            </div>

            <div class="layui-form-item">
              <label class="layui-form-label">URL</label>
              <div class="layui-input-block">
                <input type="text" name="url" v-model="pro.url" lay-verify="url"  autocomplete="off" placeholder="输入网址" class="layui-input">
              </div>
            </div>
            <div class="layui-form-item layui-form-text">
              <label class="layui-form-label">内容</label>
              <div class="layui-input-block">
                <textarea class="layui-textarea layui-hide" name="content" v-model="pro.content" lay-verify="content" id="LAY_demo_editor"></textarea>
              </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label">显示</label>
              <div class="layui-input-block">
                <input type="hidden" name="status" v-model="pro.status" value="0">
                <input type="checkbox" v-model="pro.status" lay-skin="switch" lay-filter="switchTest" lay-text="ON|OFF">
              </div>
            </div>
            <div class="layui-form-item">
              <div class="layui-input-block">
                <button class="ivu-btn ivu-btn-primary" lay-submit="" lay-filter="demo1">立即提交</button>
                <button type="reset" class="ivu-btn">重置</button>
              </div>
            </div>
          </form>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>

  layui.use(['form', 'layedit', 'laydate','upload'], function(){
    var form = layui.form
      ,layer = layui.layer
      ,layedit = layui.layedit
      ,laydate = layui.laydate
      ,upload = layui.upload;

    //日期
    laydate.render({
      elem: '#date'
    });
    laydate.render({
      elem: '#date1'
    });

    layedit.set({
      uploadImage: {
        url: '/admin/Oss/uploadImg' //接口url
        ,type: 'post' //默认post
      }
    });
    //创建一个编辑器
    var editIndex = layedit.build('LAY_demo_editor',{
      height: 420 //设置编辑器高度
    });

    //自定义验证规则
    form.verify({
      name: function(value){
        if(value.length == 0){
          return '标题不能为空！';
        }
      },
      url: function(value){
        value = value.trim()
        if(value.length>0&&!value.match(/(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/)){
          return '无效网址！';
        }
      }
      ,content: function(value){
        layedit.sync(editIndex);
      }
    });

    //监听指定开关
    form.on('switch(switchTest)', function(data){
        $('input[name=status]').val(this.checked ?1:0);
    });

    //拖拽上传
    upload.render({
      elem: '#test10'
      ,url: '/admin/Oss/uploadImg'
      ,before: function(obj){
        //预读本地文件示例，不支持ie8
        obj.preview(function(index, file, result){
            $('#test10').html('<img width="150px" src="'+result+'">');
        });
      }
      ,done: function(res){
          if(res.code==0){
              $('input[name=cover]').val(res.data.path);
          }
      }
    });
    //拖拽上传
    upload.render({
      elem: '#qr_code'
      ,url: '/admin/Oss/uploadImg'
      ,before: function(obj){
        //预读本地文件示例，不支持ie8
        obj.preview(function(index, file, result){
          $('#qr_code').html('<img width="100px" src="'+result+'">');
        });
      }
      ,done: function(res){
        if(res.code==0){
          $('input[name=qr_code]').val(res.data.path);
        }
      }
    });

    //监听提交
    form.on('submit(demo1)', function(data){
      var proId = $('input[name=id]').val();
      if(proId){
          var url = '/admin/pro/update/id/'+proId;
      }else {
        var url = '/admin/pro/add';
      }

      $.ajax({
        url:url,
        type:'POST',
        data:data.field,
        success:function (res) {
          if(res.code==0){
            window.location.hash = '/home';
          }else {
            layer.alert(res.msg);
          }
        }
      });
      return false;
    });

  });


  import { getStore } from "@/utils/storage";
  export default {
    name: "user-manage",
    data() {
      return {
        pro:{},
        accessToken: {},
        loading: true,
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "chevron-down",
        selectCount: 0,
        selectList: [],
        imgUrl: "",
        viewImage: false,
        searchForm: {},
        modalType: 0,
        userModalVisible: false,
        modalTitle: "",
        userForm: {
          sex: 1,
          type: 0,
          avatar: "https://s1.ax1x.com/2018/05/19/CcdVQP.png",
          roles: []
        },
        userRoles: [],
        roleList: [],
        errorPass: "",
        userFormValidate: {
          username: [
            { required: true, message: "账号不能为空", trigger: "blur" }
          ],
        },
        submitLoading: false,
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center"
          },
          {
            title: "网站名称",
            key: "title",
            width: 145,
            sortable: true
          },
          {
            title: "网站地址",
            key: "url",
            width: 200,
            sortable: true,
          },
          {
            title: "网站简介",
            key: "intro",
            width: 240,
            sortable: true
          },
          {
            title: "联系人",
            key: "contacts_name",
            width: 100,
            sortable: true
          },
          {
            title: "QQ",
            key: "contacts_qq",
            width: 100,
            align: "center",
          },
          {
            title: "邮箱",
            key: "contacts_email",
            width: 200,
            align: "center",
          },
          {
            title: "审核状态",
            key: "status",
            align: "center",
            width: 140,
            render: (h, params) => {
              let re = "";
              if (params.row.status === 0) {
                return h("div", [
                  h("Tag", {
                      props: {
                        type: "dot",
                        color: "yellow"
                      }
                    },
                    "待审核"
                  )
                ]);
              } else if (params.row.status === 1) {
                return h("div", [
                  h("Tag", {
                      props: {
                        type: "dot",
                        color: "green"
                      }
                    },
                  "已通过")
                ]);
              }else {
                return h("div", [
                  h("Tag", {
                      props: {
                        type: "dot",
                        color: "red"
                      }
                    },
                    "未通过")
                ]);
              }
            },
            filters: [
              {
                label: "待审核",
                value: 0
              },
              {
                label: "已通过",
                value: -1
              },
              {
                label: "未通过",
                value: -1
              }
            ],
            filterMultiple: false,
            filterMethod(value, row) {
              if (value === 0) {
                return row.status === 0;
              } else if (value === -1) {
                return row.status === -1;
              }
            }
          },
          {
            title: "申请时间",
            key: "create_time",
            sortable: true,
            sortType: "desc",
            width: 160
          },
          {
            title: "操作",
            key: "action",
            width: 240,
            fixed:'right',
            render: (h, params) => {
              var btns = [
                h("Button", {
                    props: {
                      type: "ghost",
                      size: "small"
                    },
                    style: {
                      marginRight: "5px"
                    },
                    on: {
                      click: () => {
                        this.edit(params.row);
                      }
                    }
                  },
                  "编辑"),
                h("Button", {
                  props: {
                    type: "ghost",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.remove(params.row);
                    }
                  }
                }, "删除")
              ];
              if (params.row.status === 0) {
                btns.push( h("Button", {
                    props: {
                      type: "primary",
                      size: "small"
                    },
                    style: {
                      marginLeft: "5px"
                    },
                    on: {
                      click: () => {
                        this.disable(params.row);
                      }
                    }
                  }
                  ,"审核"));
              }
              return h("div",btns );
            }
          }
        ],
        data: [],
        exportData: [],
        total: 0
      };
    },
    methods: {
      init() {
        this.accessToken = {
          accessToken: getStore("accessToken")
        };
        this.$watch('pro', function(nval, oval) {
          layui.layedit.build('LAY_demo_editor',{
            height: 420 //设置编辑器高度
          });
          layui.form.render(); //这个很重要
        });
        this.getPro();
      },
      getQuery(name) {
        //获取当前URL
        var url = window.location.hash;
        //获取要取得的get参数位置
        var get = window.location.hash.indexOf(name +"=");
        if(get == -1){
          return false;
        }
        //截取字符串
        var par = url.slice(name.length + get + 1);
        //判断截取后的字符串是否还有其他get参数
        var nextPar = par.indexOf("&");
        if(nextPar != -1){
            par = par.slice(0, nextPar);
        }
        return par;
      },
      changePage(v) {
        this.searchForm.pageNumber = v;
        this.getUserList();
        this.clearSelectAll();
      },
      changePageSize(v) {
        this.searchForm.pageSize = v;
        this.getUserList();
      },
      selectDateRange(v) {
        if (v) {
          this.searchForm.startDate = v[0];
          this.searchForm.endDate = v[1];
        }
      },
      getPro() {
        var proId = this.getQuery('id');
        if(proId==null){
            return;
        }
        this.loading = true;
        this.getRequest("/admin/pro/read/id/"+proId).then(res => {
          this.loading = false;
          if (res.code == 0) {
            this.pro = res.data;
          }
        });
      },
      handleSearch() {
        this.searchForm.pageNumber = 1;
        this.searchForm.pageSize = 10;
        this.init();
      },
      handleReset() {
        this.$refs.searchForm.resetFields();
        this.searchForm.pageNumber = 1;
        this.searchForm.pageSize = 10;
        // 重新加载数据
        this.init();
      },
      changeSort(e) {
        this.searchForm.sort = e.key;
        this.searchForm.order = e.order;
        if (e.order === "normal") {
          this.searchForm.order = "";
        }
        this.init();
      },
      handleDropdown(name) {
        if (name === "exportData") {
          if (this.selectCount <= 0) {
            this.$Message.warning("您还未选择要导出的数据");
            return;
          }
          this.$Modal.confirm({
            title: "确认导出",
            content: "您确认要导出所选 " + this.selectCount + " 条数据?",
            onOk: () => {
              this.$refs.exportTable.exportCsv({
                filename: "用户数据"
              });
            }
          });
        } else if (name === "refresh") {
          this.getUserList();
        }
      },
      selectRoles(v) {},
      cancelUser() {
        this.userModalVisible = false;
      },
      submitUser() {
        this.$refs.userForm.validate(valid => {
          if (valid) {
            let url = "/user/admin/add";
            if (this.modalType === 1) {
              url = "/admin/link/update/id/"+this.userForm.id;
            }

            this.submitLoading = true;
            this.postRequest(url, this.userForm).then(res => {
              this.submitLoading = false;
              if (res.code == 0) {
                this.$Message.success("修改成功");
                this.init();
                this.userModalVisible = false;
              }
            });
          }
        });
      },
      viewPic(v) {
        this.imgUrl = v;
        this.viewImage = true;
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: "不支持的文件格式",
          desc:
          "所选文件‘ " +
          file.name +
          " ’格式不正确, 请选择 .jpg .jpeg .png .gif格式文件"
        });
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: "文件大小过大",
          desc: "所选文件‘ " + file.name + " ’大小过大, 不得超过 5M."
        });
      },
      beforeUpload() {
        if(!this.$route.meta.permTypes.includes("upload")){
          this.$Message.error("此处您没有上传权限(页面演示，未配置权限按钮)")
          return false;
        }
        return true;
      },
      handleSuccess(res, file) {
        if (res.success === true) {
          file.url = res.result;
          this.userForm.avatar = res.result;
        } else {
          this.$Message.error(res.message);
        }
      },
      addUser() {
        this.modalType = 0;
        this.modalTitle = "添加用户";
        this.$refs.userForm.resetFields();
        this.userModalVisible = true;
      },
      edit(v) {
        this.modalType = 1;
        this.modalTitle = "修改友链信息";
        this.$refs.userForm.resetFields();
        // 转换null为""
        for (let attr in v) {
          if (v[attr] === null) {
            v[attr] = "";
          }
        }
        let str = JSON.stringify(v);
        let userInfo = JSON.parse(str);
        this.userForm = userInfo;
        this.userModalVisible = true;
      },
      enable(v) {
        this.$Modal.confirm({
          title: "确认启用",
          content: "您确认要启用用户 " + v.username + " ?",
          onOk: () => {
            this.postRequest("/user/admin/enable/" + v.id).then(res => {
              if (res.code== 0) {
                this.$Message.success("操作成功");
                this.init();
              }
            });
          }
        });
      },
      disable(v) {
        this.$Modal.confirm({
          title: '友链审核',
          content: '<label>通过：<input style="vertical-align: middle" type="radio" name="status" value="1"></label>' +
          '<label style="margin-left: 30px">未达标：<input style="vertical-align: middle" type="radio" name="status" value="-1"></label>',
          onOk: () => {
            this.postRequest("/admin/link/update/id/" + v.id,{status:$('input[name=status]:checked').val()}).then(res => {
              if (res.code === 0) {
                this.$Message.success("操作成功");
                this.init();
              }
            });
          }
        });
      },
      remove(v) {
        this.$Modal.confirm({
          title: "确认删除",
          content: "您确认要删除该条友链信息？",
          onOk: () => {
            this.deleteRequest("/admin/link/delete/id/"+v.id, { ids: v.id }).then(res => {
              if (res.code === 0) {
                this.$Message.success("删除成功");
                this.init();
              }
            });
          }
        });
      },
      dropDown() {
        if (this.drop) {
          this.dropDownContent = "展开";
          this.dropDownIcon = "chevron-down";
        } else {
          this.dropDownContent = "收起";
          this.dropDownIcon = "chevron-up";
        }
        this.drop = !this.drop;
      },
      showSelect(e) {
        this.exportData = e;
        this.selectList = e;
        this.selectCount = e.length;
      },
      clearSelectAll() {
        this.$refs.table.selectAll(false);
      },
      delAll() {
        if (this.selectCount <= 0) {
          this.$Message.warning("您还未选择要删除的数据");
          return;
        }
        this.$Modal.confirm({
          title: "确认删除",
          content: "您确认要删除所选的 " + this.selectCount + " 条数据?",
          onOk: () => {
            let ids = "";
            this.selectList.forEach(function(e) {
              ids += e.id + ",";
            });
            ids = ids.substring(0, ids.length - 1);
            this.deleteRequest("/user/delByIds", { ids: ids }).then(res => {
              if (res.success === true) {
                this.$Message.success("删除成功");
                this.clearSelectAll();
                this.init();
              }
            });
          }
        });
      }
    },
    mounted() {
      this.init();
    }
  };
</script>
