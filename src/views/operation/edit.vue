<style lang="less">
  @import "./ad.less";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
              <Form-item label="网站名称" prop="username">
                <Input type="text" v-model="searchForm.username" clearable placeholder="请输入用户名" style="width: 200px"/>
              </Form-item>
              <span v-if="drop">
                              <Form-item label="邮箱" prop="email">
                                <Input type="text" v-model="searchForm.email" clearable placeholder="请输入邮箱" style="width: 200px"/>
                              </Form-item>
                              <Form-item label="状态" prop="status">
                                <Select v-model="searchForm.status" placeholder="请选择" clearable style="width: 200px">
                                  <Option value="0">正常</Option>
                                  <Option value="-1">禁用</Option>
                                </Select>
                              </Form-item>
                              <Form-item label="创建时间">
                                <DatePicker type="daterange" format="yyyy-MM-dd" clearable @on-change="selectDateRange" placeholder="选择起始时间" style="width: 200px"></DatePicker>
                              </Form-item>
                            </span>
              <Form-item style="margin-left:-35px;">
                <Button @click="handleSearch" type="primary" icon="search">搜索</Button>
                <Button @click="handleReset" type="ghost" >重置</Button>
                <a class="drop-down" @click="dropDown">{{dropDownContent}}
                  <Icon :type="dropDownIcon"></Icon>
                </a>
              </Form-item>
            </Form>
          </Row>
          <Row class="operation">
            <Button @click="addUser" type="primary" icon="plus-round">添加网站</Button>
            <Button @click="delAll" type="ghost" icon="trash-a">批量删除</Button>
            <Dropdown @on-click="handleDropdown">
              <Button type="ghost">
                更多操作
                <Icon type="arrow-down-b"></Icon>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="refresh">刷新</DropdownItem>
                <DropdownItem name="exportData">导出所选数据</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Row>
          <Row>
            <Alert show-icon>
              已选择 <span class="select-count">{{selectCount}}</span> 项
              <a class="select-clear" @click="clearSelectAll">清空</a>
            </Alert>
          </Row>
          <Row class="margin-top-10 searchable-table-con1">
            <Table :loading="loading" border :columns="columns" :data="data" sortable="custom" @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table"></Table>
            <Table :columns="columns" :data="exportData" ref="exportTable" style="display:none"></Table>
          </Row>
          <Row type="flex" justify="end" class="code-row-bg page">
            <Page :current="this.searchForm.pageNumber" :total="total" :page-size="this.searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50,100]" size="small" show-total show-elevator show-sizer></Page>
          </Row>
          <form class="layui-form" action="">
            <div class="layui-form-item">
              <label class="layui-form-label">单行输入框</label>
              <div class="layui-input-block">
                <input type="text" name="title" lay-verify="title" autocomplete="off" placeholder="请输入标题" class="layui-input">
              </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label">验证必填项</label>
              <div class="layui-input-block">
                <input type="text" name="username" lay-verify="required" placeholder="请输入" autocomplete="off" class="layui-input">
              </div>
            </div>

            <div class="layui-form-item">
              <div class="layui-inline">
                <label class="layui-form-label">验证手机</label>
                <div class="layui-input-inline">
                  <input type="tel" name="phone" lay-verify="required|phone" autocomplete="off" class="layui-input">
                </div>
              </div>
              <div class="layui-inline">
                <label class="layui-form-label">验证邮箱</label>
                <div class="layui-input-inline">
                  <input type="text" name="email" lay-verify="email" autocomplete="off" class="layui-input">
                </div>
              </div>
            </div>

            <div class="layui-form-item">
              <div class="layui-inline">
                <label class="layui-form-label">多规则验证</label>
                <div class="layui-input-inline">
                  <input type="text" name="number" lay-verify="required|number" autocomplete="off" class="layui-input">
                </div>
              </div>
              <div class="layui-inline">
                <label class="layui-form-label">验证日期</label>
                <div class="layui-input-inline">
                  <input type="text" name="date" id="date" lay-verify="date" placeholder="yyyy-MM-dd" autocomplete="off" class="layui-input">
                </div>
              </div>
              <div class="layui-inline">
                <label class="layui-form-label">验证链接</label>
                <div class="layui-input-inline">
                  <input type="tel" name="url" lay-verify="url" autocomplete="off" class="layui-input">
                </div>
              </div>
            </div>

            <div class="layui-form-item">
              <label class="layui-form-label">验证身份证</label>
              <div class="layui-input-block">
                <input type="text" name="identity" lay-verify="identity" placeholder="" autocomplete="off" class="layui-input">
              </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label">自定义验证</label>
              <div class="layui-input-inline">
                <input type="password" name="password" lay-verify="pass" placeholder="请输入密码" autocomplete="off" class="layui-input">
              </div>
              <div class="layui-form-mid layui-word-aux">请填写6到12位密码</div>
            </div>

            <div class="layui-form-item">
              <div class="layui-inline">
                <label class="layui-form-label">范围</label>
                <div class="layui-input-inline" style="width: 100px;">
                  <input type="text" name="price_min" placeholder="￥" autocomplete="off" class="layui-input">
                </div>
                <div class="layui-form-mid">-</div>
                <div class="layui-input-inline" style="width: 100px;">
                  <input type="text" name="price_max" placeholder="￥" autocomplete="off" class="layui-input">
                </div>
              </div>
            </div>

            <div class="layui-form-item">
              <label class="layui-form-label">单行选择框</label>
              <div class="layui-input-block">
                <select name="interest" lay-filter="aihao">
                  <option value=""></option>
                  <option value="0">写作</option>
                  <option value="1" selected="">阅读</option>
                  <option value="2">游戏</option>
                  <option value="3">音乐</option>
                  <option value="4">旅行</option>
                </select>
              </div>
            </div>


            <div class="layui-form-item">
              <div class="layui-inline">
                <label class="layui-form-label">分组选择框</label>
                <div class="layui-input-inline">
                  <select name="quiz">
                    <option value="">请选择问题</option>
                    <optgroup label="城市记忆">
                      <option value="你工作的第一个城市">你工作的第一个城市</option>
                    </optgroup>
                    <optgroup label="学生时代">
                      <option value="你的工号">你的工号</option>
                      <option value="你最喜欢的老师">你最喜欢的老师</option>
                    </optgroup>
                  </select>
                </div>
              </div>
              <div class="layui-inline">
                <label class="layui-form-label">搜索选择框</label>
                <div class="layui-input-inline">
                  <select name="modules" lay-verify="required" lay-search="">
                    <option value="">直接选择或搜索选择</option>
                    <option value="1">layer</option>
                    <option value="2">form</option>
                    <option value="3">layim</option>
                    <option value="4">element</option>
                    <option value="5">laytpl</option>
                    <option value="6">upload</option>
                    <option value="7">laydate</option>
                    <option value="8">laypage</option>
                    <option value="9">flow</option>
                    <option value="10">util</option>
                    <option value="11">code</option>
                    <option value="12">tree</option>
                    <option value="13">layedit</option>
                    <option value="14">nav</option>
                    <option value="15">tab</option>
                    <option value="16">table</option>
                    <option value="17">select</option>
                    <option value="18">checkbox</option>
                    <option value="19">switch</option>
                    <option value="20">radio</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="layui-form-item">
              <label class="layui-form-label">联动选择框</label>
              <div class="layui-input-inline">
                <select name="quiz1">
                  <option value="">请选择省</option>
                  <option value="浙江" selected="">浙江省</option>
                  <option value="你的工号">江西省</option>
                  <option value="你最喜欢的老师">福建省</option>
                </select>
              </div>
              <div class="layui-input-inline">
                <select name="quiz2">
                  <option value="">请选择市</option>
                  <option value="杭州">杭州</option>
                  <option value="宁波" disabled="">宁波</option>
                  <option value="温州">温州</option>
                  <option value="温州">台州</option>
                  <option value="温州">绍兴</option>
                </select>
              </div>
              <div class="layui-input-inline">
                <select name="quiz3">
                  <option value="">请选择县/区</option>
                  <option value="西湖区">西湖区</option>
                  <option value="余杭区">余杭区</option>
                  <option value="拱墅区">临安市</option>
                </select>
              </div>
              <div class="layui-form-mid layui-word-aux">此处只是演示联动排版，并未做联动交互</div>
            </div>

            <div class="layui-form-item">
              <label class="layui-form-label">复选框</label>
              <div class="layui-input-block">
                <input type="checkbox" name="like[write]" title="写作">
                <input type="checkbox" name="like[read]" title="阅读" checked="">
                <input type="checkbox" name="like[game]" title="游戏">
              </div>
            </div>

            <div class="layui-form-item" pane="">
              <label class="layui-form-label">原始复选框</label>
              <div class="layui-input-block">
                <input type="checkbox" name="like1[write]" lay-skin="primary" title="写作" checked="">
                <input type="checkbox" name="like1[read]" lay-skin="primary" title="阅读">
                <input type="checkbox" name="like1[game]" lay-skin="primary" title="游戏" disabled="">
              </div>
            </div>

            <div class="layui-form-item">
              <label class="layui-form-label">开关-默认关</label>
              <div class="layui-input-block">
                <input type="checkbox" name="close" lay-skin="switch" lay-text="ON|OFF">
              </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label">开关-默认开</label>
              <div class="layui-input-block">
                <input type="checkbox" checked="" name="open" lay-skin="switch" lay-filter="switchTest" lay-text="ON|OFF">
              </div>
            </div>
            <div class="layui-form-item">
              <label class="layui-form-label">单选框</label>
              <div class="layui-input-block">
                <input type="radio" name="sex" value="男" title="男" checked="">
                <input type="radio" name="sex" value="女" title="女">
                <input type="radio" name="sex" value="禁" title="禁用" disabled="">
              </div>
            </div>
            <div class="layui-form-item layui-form-text">
              <label class="layui-form-label">普通文本域</label>
              <div class="layui-input-block">
                <textarea placeholder="请输入内容" class="layui-textarea"></textarea>
              </div>
            </div>
            <div class="layui-form-item layui-form-text">
              <label class="layui-form-label">编辑器</label>
              <div class="layui-input-block">
                <textarea class="layui-textarea layui-hide" name="content" lay-verify="content" id="LAY_demo_editor"></textarea>
              </div>
            </div>
            <div class="layui-form-item">
              <div class="layui-input-block">
                <button class="layui-btn" lay-submit="" lay-filter="demo1">立即提交</button>
                <button type="reset" class="layui-btn layui-btn-primary">重置</button>
              </div>
            </div>
          </form>
        </Card>
      </Col>
    </Row>
    <Modal :title="modalTitle" v-model="userModalVisible" :mask-closable='false' :width="500" :styles="{top: '30px'}">
      <Form ref="userForm" :model="userForm" :label-width="70" :rules="userFormValidate">
        <FormItem label="网站名称" prop="title">
          <Input v-model="userForm.title"/>
        </FormItem>
        <FormItem label="网站地址"  v-if="modalType===0" :error="errorPass">
          <Input type="password" v-model="userForm.url"/>
        </FormItem>
        <FormItem label="联系人" prop="contacts_name">
          <Input v-model="userForm.contacts_name"/>
        </FormItem>
        <FormItem label="邮箱" prop="contacts_email">
          <Input v-model="userForm.contacts_email"/>
        </FormItem>
        <FormItem label="QQ" prop="contacts_qq">
          <Input v-model="userForm.contacts_qq"/>
        </FormItem>
        <FormItem label="审核" prop="status">
          <Select v-model="userForm.status" placeholder="请选择">
            <Option :value="1">通过</Option>
            <Option :value="-1">不通过</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelUser">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitUser">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>

  layui.use('layedit', function(){
    var layedit = layui.layedit;
    layedit.build('demo'); //建立编辑器
  });

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


  import { getStore } from "@/utils/storage";
  export default {
    name: "user-manage",
    data() {
      return {
        accessToken: {},
        loading: true,
        drop: false,
        dropDownContent: "展开",
        dropDownIcon: "chevron-down",
        selectCount: 0,
        selectList: [],
        imgUrl: "",
        viewImage: false,
        searchForm: {
          username: "",
          mobile: "",
          email: "",
          sex: "",
          type: "",
          status: "",
          pageNumber: 1,
          pageSize: 10,
          sort: "createTime",
          order: "desc",
          startDate: "",
          endDate: ""
        },
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
        this.getUserList();
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
      getUserList() {
        // 多条件搜索用户列表
        this.loading = true;
        this.getRequest("/admin/link", this.searchForm).then(res => {
          this.loading = false;
          if (res.success === true) {
            this.data = res.result.data;
            this.total = res.result.total;
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
              if (res.success === true) {
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
              if (res.success === true) {
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
              if (res.success === true) {
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
              if (res.success === true) {
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
