<style lang="less">
  @import "./pro.less";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
              <Form-item label="项目名称" prop="username">
                <Input type="text" v-model="searchForm.username" clearable placeholder="请输入关键字" style="width: 200px"/>
              </Form-item>
              <span v-if="drop">
                              <Form-item label="是否显示" prop="status">
                                <Select v-model="searchForm.status" placeholder="请选择" clearable style="width: 200px">
                                  <Option value="0">不显示</Option>
                                  <Option value="-1">显示</Option>
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
            <Button onclick="window.location.hash = '/operation/pro_edit';" type="primary" icon="plus-round">添加项目</Button>
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
            <Table :loading="loading" border :columns="columns"  :data="data"  sortable="true" :default-sort = "{prop: 'sort', order: 'ascending'}" @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table"></Table>
            <Table :columns="columns" :data="exportData" ref="exportTable" style="display:none"></Table>
          </Row>
          <Row type="flex" justify="end" class="code-row-bg page">
            <Page :current="this.searchForm.pageNumber" :total="total" :page-size="this.searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50,100]" size="small" show-total show-elevator show-sizer></Page>
          </Row>
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
            title: "序号",
            key: "sort",
            width: 80,
            align:'center',
            sortable:true
          },
          {
            title: "项目名称",
            key: "name",
            width: 145,
          },
          {
            title: "标签",
            key: "tag",
            width: 200,
          },
          {
            title: "项目简介",
            key: "intro",
            width: 240,
          },
          {
            title: "状态",
            key: "status",
            align: "center",
            width: 140,
            render: (h, params) => {
              let re = "";
              if (params.row.status === 1) {
                return h("div", [
                  h("Tag", {
                      props: {
                        type: "dot",
                        color: "green"
                      }
                    },
                    "显示")
                ]);
              } else {
                return h("div", [
                  h("Tag", {
                      props: {
                        type: "dot",
                        color: "red"
                      }
                    },
                    "不显示")
                ]);
              }
            },
            filters: [
              {
                label: "显示",
                value: 1
              },
              {
                label: "不显示",
                value: 0
              },
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
            title: "发布时间",
            key: "create_time",
            sortType: "desc",
            width: 160
          },
          {title: "排序",
            key: "action",
            align: "center",
            width: 160,
            render: (h, params) => {
              return [
                h("a", {
                  style: {
                    marginRight: "8px",
                    fontSize:'14px'
                  },
                  on: {
                    click: () => {
                      this.postRequest("/admin/pro/update/id/" + params.row.id,{sort:1}).then(res => {
                        if (res.code === 0) {
                          this.init();
                        }
                      });
                    }
                  }
                },'顶置'),
                h("img", {
                  attrs: {
                    src: "static/main/images/up.png",
                    height:'14px'
                  },
                  style: {
                    marginRight: "8px",
                    cursor:'pointer'
                  },
                  on: {
                    click: () => {
                      this.postRequest("/admin/pro/update/id/" + params.row.id,{sort:params.row.sort-1}).then(res => {
                        if (res.code === 0) {
                          this.init();
                        }
                      });
                    }
                  }
                }),
                h("img", {
                  attrs: {
                    src: "static/main/images/down.png",
                    height:'14px'
                  },
                  style: {
                    marginRight: "8px",
                    cursor:'pointer'
                  },
                  on: {
                    click: () => {
                      this.postRequest("/admin/pro/update/id/" + params.row.id,{sort:params.row.sort+1}).then(res => {
                        if (res.code === 0) {
                          this.init();
                        }
                      });
                    }
                  }
                }),
              ];
            }
          },
          {
            title: "操作",
            key: "action",
            width: 166,
            align:'center',
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
                          window.location.hash = '/operation/pro_edit?id='+params.row.id;
                      }
                    }
                  },"编辑"),
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
                        this.toggle(params.row);
                      }
                    }
                  }
                  ,params.row.status==1?'隐藏':'显示'));

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
        this.getRequest("/admin/pro", this.searchForm).then(res => {
          this.loading = false;
          if (res.code === 0) {
            this.data = res.data.data;
            this.total = res.data.total;
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
            let url = "/user/pro/add";
            if (this.modalType === 1) {
              url = "/admin/pro/update/id/"+this.userForm.id;
            }

            this.submitLoading = true;
            this.postRequest(url, this.userForm).then(res => {
              this.submitLoading = false;
              if (res.code === 0) {
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
        // this.modalType = 0;
        // this.modalTitle = "添加用户";
        // this.$refs.userForm.resetFields();
        // this.userModalVisible = true;
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
      toggle(v) {
        if(v.status==1){
          var action = '隐藏';
          var status = 0;
        }else {
          var action = '显示';
          var status = 1;
        }

        this.$Modal.confirm({
          title: "确认"+action,
          content: "您确认要" + action+ "该信息 ?",
          onOk: () => {
            this.postRequest("/admin/pro/update/id/" + v.id,{status:status}).then(res => {
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
            this.deleteRequest("/admin/pro/delete/id/"+v.id, { ids: v.id }).then(res => {
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
