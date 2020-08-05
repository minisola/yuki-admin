import { pageInit } from "@/js/common/init";
import template from "@/libs/art-template/template-web";

pageInit();

var win = window;

$(function () {
  var beginTime = new FlexDate({
    e: "[name=billDateStart]",
    format: "yyyy-MM-dd",
    clearBtn: true,
    todayBtn: true,
    zIndex: 999,
    bindClick: true,
    confirm: function (value) {
      endTime.setMin(value);
    },
  });
  var endTime = new FlexDate({
    e: "[name=billDateEnd]",
    format: "yyyy-MM-dd",
    clearBtn: true,
    todayBtn: true,
    zIndex: 999,
    bindClick: true,
    confirm: function (value) {
      beginTime.setMax(value);
    },
  });
  //到达日期
  var arriveStartTime = new FlexDate({
    e: "[name=arriveDateStart]",
    format: "yyyy-MM-dd",
    clearBtn: true,
    todayBtn: true,
    zIndex: 999,
    bindClick: true,
    confirm: function (value) {
      arriveEndTime.setMin(value);
    },
  });
  var arriveEndTime = new FlexDate({
    e: "[name=arriveDateEnd]",
    format: "yyyy-MM-dd",
    clearBtn: true,
    todayBtn: true,
    zIndex: 999,
    bindClick: true,
    confirm: function (value) {
      arriveStartTime.setMax(value);
    },
  });
  //装车时间
  var planDateStart = new FlexDate({
    e: "[name=planDateStart]",
    format: "yyyy-MM-dd",
    clearBtn: true,
    todayBtn: true,
    zIndex: 999,
    bindClick: true,
    confirm: function (value) {
      planDateEnd.setMin(value);
    },
  });
  var planDateEnd = new FlexDate({
    e: "[name=planDateEnd]",
    format: "yyyy-MM-dd",
    clearBtn: true,
    todayBtn: true,
    zIndex: 999,
    bindClick: true,
    confirm: function (value) {
      planDateStart.setMax(value);
    },
  });
  //订单创建时间
  window.waybillBeginTime = flatpickr("[name=createDateStart]", {
    // locale: flatpickrZh.default.zh,
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    time_24hr: true,
    minuteIncrement: 1,
    onChange: function (selectedDates, dateStr) {
      dateStr &&
        window.waybillEndTime.set({
          minDate: dateStr,
        });
    },
  });
  window.waybillEndTime = flatpickr("[name=createDateEnd]", {
    // locale: flatpickrZh.default.zh,
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    minuteIncrement: 1,
    time_24hr: true,
    onChange: function (selectedDates, dateStr) {
      dateStr &&
        window.waybillBeginTime.set({
          maxDate: dateStr,
        });
    },
  });

  //加载分公司

  _u.getFromApi.getAgencyListByUser($, function (res) {
    var html = "<option value=''>全部</option>";
    $.each(res.data, function () {
      html +=
        "<option value='" + this.id + "'>" + this.agencyName + "</option>";
    });
    $("#agencyId")
      .append(html)
      .select2({
        language: "zh-CN",
      })
      .on("change", function () {
        loadProjects(this.value);
      });
  });
  loadProjects();
  var projectsInit = 0;

  function loadProjects(agencyId) {
    _u.getFromApi.getProjectListByUser($, agencyId || "", function (res) {
      var html = "<option value=''>全部</option>";
      $.each(res.data, function () {
        html +=
          "<option value='" + this.id + "'>" + this.projectName + "</option>";
      });
      if (!projectsInit) {
        projectsInit = 1;
        $("#projectId").append(html).select2({
          language: "zh-CN",
        });
      } else {
        $("#projectId").select2("destroy").html(html).select2({
          language: "zh-CN",
        });
      }
    });
  }

  var params = {
    clickToSelect: true, //是否开始多选模式
    formatTotalMoney: true,
    totalRow: true,
    url: window.env.apiUrl + "/truckWaybill/list",
    toolbar: _u.makBtns(),
    defaultToolbar: ["filter"],
    cols: [
      [
        {
          type: "checkbox",
          fixed: "left",
          fixedWidth: 50,
        },
        {
          type: "numbers",
          event: "view",
          fixed: "left",
        },
        {
          field: "waybillCode",
          title: "运单号",
          minWidth: 170,
          totalRowText: "合计",
          event: "view",
          fixed: "left",
        },
        {
          field: "driverContractCode",
          title: "运输协议单号",
          minWidth: 130,
          event: "view",
        },
        {
          field: "transportStatus",
          title: "运输状态",
          minWidth: 90,
          event: "view",
          templet: function (d) {
            var html = "";
            switch (d.transportStatus) {
              case 1:
                html = '<span class="label label-default">未开始</span>';
                break;
              case 2:
                html = '<span class="label label-primary">在途中</span>';
                break;
              case 3:
                html = '<span class="label label-success">已完成</span>';
                break;
            }
            return html;
          },
        },
        {
          field: "auditStatus",
          title: "运单状态",
          minWidth: 100,
          event: "view",
          templet: function (d) {
            var html = "";
            switch (d.auditStatus) {
              case -1:
                html = '<span class="label label-default">草稿</span>';
                break;
              case 0:
                html = '<span class="label label-default">未提交</span>';
                break;
              case 1:
                html = '<span class="label label-primary">审批中</span>';
                break;
              case 2:
                html = '<span class="label label-success">审批通过</span>';
                break;
              case 4:
                html =
                  '<span class="label label-hover label-danger" data-tips="' +
                  encodeURIComponent(d.auditReason) +
                  '">审批驳回</span>';
                break;
              case 5:
                html =
                  '<span class="label label-hover label-default" data-tips="' +
                  encodeURIComponent(d.revokeReason) +
                  '">已撤回</span>';
                break;
              case 6:
                html = '<span class="label label-primary">随行付同步中</span>';
                break;
            }
            return html;
          },
        },
        {
          field: "settleStatus",
          title: "结算状态",
          minWidth: 100,
          event: "view",
          templet: function (d) {
            var html = "";
            switch (d.settleStatus) {
              case 0:
                html = '<span class="label label-default">未结算</span>';
                break;
              case 1:
                html = '<span class="label label-primary">部分结算</span>';
                break;
              case 2:
                html = '<span class="label label-success">已结算</span>';
                break;
            }
            return html;
          },
        },

        {
          field: "locateStatus",
          title: "定位状态/方式",
          minWidth: 110,
          event: "view",
          // templet: function (d) {
          //     return TransportRoadModel.resolveLocateStatus(d.locateStatus,d.locateType)
          // }
        },
        {
          field: "policyStatus",
          title: "保单状态",
          minWidth: 130,
          event: "view",
          templet: function (d) {
            var html = "";
            switch (d.policyStatus) {
              case 0:
                html = '<span class="label label-default">未投保</span>';
                break;
              case 1:
                html = '<span class="label label-default">不投保</span>';
                break;
              case 2:
                html = '<span class="label label-primary">投保受理成功</span>';
                break;
              case 3:
                html = '<span class="label label-warning">投保受理失败</span>';
                break;
              case 4:
                html = '<span class="label label-danger">系统异常</span>';
                break;
              case 5:
                html =
                  '<span class="label label-success show-pointer" title="查看保单" onclick="viewPolicy(\'' +
                  d.policyNo +
                  "')\">" +
                  "投保成功</span>";
                break;
              case 6:
                html = '<span class="label label-danger">投保失败</span>';
                break;
            }
            return html;
          },
        },

        {
          field: "resource",
          title: "运单来源",
          width: 120,
          event: "view",
          templet: function (d) {
            var html = "";
            switch (d.resource) {
              case 1:
                html = "智联云iTMS";
                break;
              case 2:
                html = "微信端助手";
                break;
              case 3:
                html = "APP";
                break;
              case 4:
                html = "敬业小程序";
                break;
              case 5:
                html = "合作方";
                break;
              case 6:
                html = "iTMS4.0小程序";
                break;
            }
            return html;
          },
        },
        {
          field: "projectName",
          title: "所属项目",
          width: 200,
          event: "view",
        },
        {
          field: "receiveCorporationName",
          title: "收货单位",
          width: 200,
          event: "view",
        },
        //, {field: 'oilCardMoney', title: '油卡金额',totalRow:true, width: 200, event: "view"}
        {
          field: "receiveFare",
          title: "应收运费",
          totalRow: true,
          totalRowLazy: true,
          width: 130,
          align: "right",
          event: "view",
          templet: function (d) {
            return _u.formatMoney(d.receiveFare);
          },
        },
        {
          field: "payFare",
          title: "应付运费",
          totalRow: true,
          totalRowLazy: true,
          align: "right",
          width: 130,
          event: "view",
          templet: function (d) {
            if (d.payFare == -1) {
              return "-";
            } else {
              return _u.formatMoney(d.payFare);
            }
          },
        },
        {
          field: "subcontractCost",
          title: "转包服务费",
          totalRow: true,
          align: "right",
          width: 100,
          totalRowLazy: true,

          event: "view",
          templet: function (d) {
            return _u.formatMoney(d.subcontractCost);
          },
        },
        {
          field: "actualFare",
          totalRow: true,
          title: "实付运费",
          align: "right",
          totalRowLazy: true,
          width: 130,
          event: "view",
          templet: function (d) {
            return _u.formatMoney(d.actualFare);
          },
        },
        {
          field: "lossDamageMoney",
          totalRow: true,
          title: "货损货差",
          align: "right",
          totalRowLazy: true,
          width: 100,
          event: "view",
          templet: function (d) {
            return _u.formatMoney(d.lossDamageMoney);
          },
        },
        {
          field: "otherPayFare",
          title: "其他费用",
          width: 130,
          align: "right",
          event: "view",
          templet: function (d) {
            return _u.formatMoney(d.otherPayFare);
          },
        },
        {
          field: "paidOtherPayFare",
          title: "已付其他费用",
          align: "right",
          width: 110,
          event: "view",
          templet: function (d) {
            return _u.formatMoney(d.paidOtherPayFare);
          },
        },
        {
          field: "policyFee",
          title: "保价",
          width: 100,
          align: "right",
          event: "view",
          templet: function (d) {
            return _u.formatMoney(d.policyFee);
          },
        },
        {
          field: "feeAmount",
          title: "应收数量",
          width: 100,
          event: "view",
          templet: function (d) {
            return d.feeAmount ? d.feeAmount : "-";
          },
        },
        {
          field: "plateNo",
          title: "车牌号码",
          width: 100,
          event: "view",
        },
        {
          field: "driverName",
          title: "司机姓名",
          width: 100,
          event: "view",
        },
        {
          field: "receiptName",
          title: "收款人",
          width: 100,
          event: "view",
        },
        {
          field: "receiptCard",
          title: "收款账号",
          width: 120,
          event: "view",
        },
        {
          field: "unloadAddress",
          title: "收货地址",
          width: 150,
          event: "view",
        },
        {
          field: "arriveTime",
          title: "到达日期",
          width: 100,
          event: "view",
          templet: function (d) {
            return d.isArrive == 1 ? d.arriveTime.substring(0, 10) : "-";
          },
        },
        {
          field: "billDate",
          title: "单据日期",
          width: 150,
          event: "view",
          templet: function (d) {
            return d.billDate.substring(0, 10);
          },
        },
        {
          field: "creatorName",
          title: "创建人",
          width: 100,
          event: "view",
        },
        {
          field: "createTime",
          title: "创建时间",
          width: 150,
          event: "view",
        },
        {
          field: "remark",
          title: "运单备注",
          minWidth: 170,
          event: "view",
        },
      ],
    ],
  };

  //查看保单
  win.viewPolicy = function (id) {
    _u.fullDialog({
      type: 2,
      content: "/static/page/common/policy.html?id=" + id,
    });
  };

  //生成列表
  layui.use("table", function () {
    _u.searchBarMore();
    win.table = layui.table;
    var config = {
      table: table,
      tableOptions: params,
      minute2Second: true,
      minute2SecondStart: ["createDateStart"],
      minute2SecondEnd: ["createDateEnd"],
      rowDoubleFun: function (data) {
        _u.fullDialog({
          content: "/static/page/transport_road/detail.html?id=" + data.id,
        });
      },
      totalFun: function (res, searchData) {
        // TransportRoadModel.getTruckWaybillSumList(searchData).done(function(res){
        //     var totalData = res.rows[0]
        //     for(key in totalData){
        //         var totalCell = $('.table-cell-lazy-' + key)
        //         if(totalCell.length){
        //             totalCell.text( _u.formatMoney(totalData[key]))
        //         }
        //     }
        // })
      },
      resetFun: function () {
        endTime.clearMinMax();
        beginTime.clearMinMax();
        arriveStartTime.clearMinMax();
        arriveEndTime.clearMinMax();
        planDateStart.clearMinMax();
        planDateEnd.clearMinMax();

        window.waybillBeginTime.set({
          maxDate: "",
        });
        window.waybillEndTime.set({
          minDate: "",
        });

        $("input[name='planTimeStart']").val("");
        $("input[name='planTimeEnd']").val("");
        $("input[name='arriveTimeStart']").val("");
        $("input[name='arriveTimeEnd']").val("");
        $(".select2-hidden-accessible").val(null).trigger("change");
      },
    };
    _u.cTable(config);

    //驳回原因
    _u.showLabelHover();

    //绑定按钮
    $(document).on("click", ".btn-handler", function () {
      var operationName = this.innerHTML;
      switch (operationName) {
        case "新增":
          top.addNavTab(
            "12",
            "新建运单",
            "/static/page/transport_road/edit.html"
          );
          break;
        case "编辑":
          var els = _u.getSelectedItem(true);
          if (!els) return;
          if (els.data.length == 0) {
            layer.msg("请选择一项进行编辑");
            return;
          }
          if (els.data.length > 1) {
            layer.msg("只可以选择一项进行编辑");
            return;
          }
          var el = els.data[0];
          if (el.auditStatus == 1) {
            _u.zlmsg.info("审批中的运单无法编辑");
            return;
          }

          if (el.auditStatus == 2) {
            _u.zlmsg.info("审批通过运单无法编辑");
            return;
          }
          _u.fullDialog({
            content: "/static/page/transport_road/edit.html?id=" + el.id,
          });
          break;
        case "提交运单":
          var els = _u.getSelectedItem(true);
          if (!els) return;
          if (els.data.length == 0) {
            layer.msg("请选择一项进行提交");
            return;
          }
          if (els.data.length > 1) {
            layer.msg("只可以选择一项进行提交");
            return;
          }
          var el = els.data[0];
          if (el.auditStatus == 1) {
            _u.zlmsg.info("审批中的运单无法提交");
            return;
          }
          if (el.auditStatus == 2) {
            _u.zlmsg.info("审批通过运单无法提交");
            return;
          }
          var accountMoney;
          var policyMoney;
          var $confirm = _u.zlmsg.confirm("确认提交此运单?", function () {
            if (el.isPolicy == 1) {
              _u.getTemplate(
                "/static/page/transport_road/policy_tip.html",
                function (html) {
                  _u.zlmsg.open({
                    type: 1,
                    title: "投保提示",
                    content: html,
                    scrollbar: false,
                    area: ["400px", "330px"],
                    btn: ["确定", "取消"],
                    btnAlign: "c",
                    success: function () {
                      $("#waybillcode").html(el.waybillCode);
                      $("#unsetpolicy").hide();
                      $("#setpolicy").show();
                      $("#policy_agreement").show();

                      //判断余额是否小于500

                      $.post(env.apiUrl + "/funds/accountOtherMoney", {
                        truckId: el.id,
                        accountType: "51",
                      }).done(function (res) {
                        _u.ajaxData(res, function () {
                          if (res.data[0].littleAccounts[0].money < 500) {
                            $("#accountMoney").show();
                            accountMoney = res.data[0].littleAccounts[0].money;
                          }
                        });
                      });
                      $.post(env.apiUrl + "/orgProject/insuranceCalculation", {
                        projectId: el.projectId,
                        money: el.payFare,
                      }).done(function (res) {
                        _u.ajaxData(res, function () {
                          $("#policy_money").html(res.data.money);
                          policyMoney = res.data.money;
                        });
                      });
                    },
                    yes: function () {
                      if ($("#policy_agree").is(":checked")) {
                        //运单已提交成功
                        layer.close($confirm);
                        win.loading = _u.zlmsg.progress("提交中..");
                        // if(accountMoney>=policyMoney){
                        $.post(env.apiUrl + "/truckWaybill/commitWaybill", {
                          id: el.id,
                        }).done(function (res) {
                          _u.ajaxData(res, function () {
                            layer.confirm(
                              "运单已成功投保",
                              {
                                btn: ["确定", "取消"], //按钮
                              },
                              function () {
                                _u.zlmsg.success("提交成功");
                                layer.closeAll();
                                tableList[0].reload();
                              }
                            );
                          });
                        });
                        // }else{
                        //         layer.confirm('账户余额不足，请充值后再次提交运单', {
                        //             btn: ['确定','取消'] //按钮
                        //           }, function(){
                        //                 _u.zlmsg.success("提交失败")
                        //                 layer.closeAll()
                        //                 tableList[0].reload()
                        //           });
                        // }
                      } else {
                        _u.zlmsg.fail("请选择同意条款");
                      }
                    },
                  });
                }
              );
            } else {
              _u.getTemplate(
                "/static/page/transport_road/policy_tip.html",
                function (html) {
                  _u.zlmsg.open({
                    type: 1,
                    title: "投保提示",
                    content: html,
                    scrollbar: false,
                    area: ["400px", "330px"],
                    btn: ["确定", "取消"],
                    btnAlign: "c",
                    success: function () {
                      $("#waybillcode").html(el.waybillCode);
                      $("#policy_money").html("未设置投保");
                      $("#setpolicy").hide();
                      $("#unsetpolicy").show();
                      $("#policy_agreement").hide();
                      //判断余额是否小于500
                      $.post(env.apiUrl + "/funds/accountOtherMoney", {
                        truckId: el.id,
                        accountType: "51",
                      }).done(function (res) {
                        _u.ajaxData(res, function () {
                          if (res.data[0].littleAccounts[0].money < 500) {
                            $("#accountMoney").show();
                          }
                        });
                      });
                    },
                    yes: function () {
                      //运单已提交成功
                      layer.close($confirm);
                      win.loading = _u.zlmsg.progress("提交中..");
                      $.post(env.apiUrl + "/truckWaybill/commitWaybill", {
                        id: el.id,
                      }).done(function (res) {
                        _u.ajaxData(res, function () {
                          _u.zlmsg.success("提交成功");
                          layer.closeAll();
                          tableList[0].reload();
                        });
                      });
                    },
                  });
                }
              );
            }
          });
          break;
        case "导出":
          var totalCount = Number($(".layui-laypage-count").text());
          if (totalCount > 10000)
            return layer.alert(
              "不支持大于10000条的运单导出,请通过创建时间筛选运单再试"
            );
          _u.getTemplate("/static/page/template/export.html", function (html) {
            _u.zlmsg.open({
              type: 1,
              title: "导出",
              content: html,
              scrollbar: false,
              area: ["550px", "430px"],
              btn: ["导出", "取消"],
              btnAlign: "c",
              success: function () {
                var customerChecksCon = $("#customChecks");
                var list = [
                  {
                    name: "agencyName",
                    value: "所属分公司",
                    width: 35,
                  },
                  {
                    name: "billDateString",
                    value: "单据日期",
                    width: 30,
                  },
                  {
                    name: "projectName",
                    value: "所属项目",
                    width: 35,
                  },
                  {
                    name: "waybillCode",
                    value: "运单编号",
                    width: 35,
                  },
                  {
                    name: "driverContractCode",
                    value: "运输协议单号",
                    width: 30,
                  },
                  {
                    name: "waybillStatusName",
                    value: "运输状态",
                  },
                  {
                    name: "auditStatusName",
                    value: "运单状态",
                  },
                  {
                    name: "settleName",
                    value: "结算状态",
                  },
                  {
                    name: "shipperCorporationName",
                    value: "托运单位",
                  },
                  {
                    name: "loadingAddress",
                    value: "详细地址",
                    width: 40,
                  },
                  {
                    name: "shipperPerson",
                    value: "联系人",
                  },
                  {
                    name: "shipperPhone",
                    value: "联系电话",
                  },
                  {
                    name: "receiveCorporationName",
                    value: "收货单位",
                  },
                  {
                    name: "unloadAddress",
                    value: "详细地址",
                  },
                  {
                    name: "receivePerson",
                    value: "联系人",
                  },
                  {
                    name: "receivePhone",
                    value: "联系电话",
                  },
                  {
                    name: "goodsName",
                    value: "货物名称",
                  },
                  {
                    name: "goodsCategoryString",
                    value: "货物类别",
                  },
                  {
                    name: "goodsAmount",
                    value: "件数",
                  },
                  {
                    name: "goodsPackingString",
                    value: "包装",
                  },
                  {
                    name: "goodsWeightString",
                    value: "货物重量(吨)",
                  },
                  {
                    name: "goodsVolume",
                    value: "货物体积(m³)",
                  },
                  {
                    name: "driverName",
                    value: "司机姓名",
                  },
                  {
                    name: "driverPhone",
                    value: "联系电话",
                  },
                  {
                    name: "driverLicense",
                    value: "驾驶证号",
                    width: 30,
                  },
                  {
                    name: "receiptName",
                    value: "收款人户名",
                  },
                  {
                    name: "receiptPhone",
                    value: "手机号",
                  },
                  {
                    name: "receiptIdentity",
                    value: "收款人身份证号",
                    width: 30,
                  },
                  {
                    name: "receiptBankName",
                    value: "开户行",
                    width: 30,
                  },
                  {
                    name: "receiptCard",
                    value: "银行卡号",
                    width: 30,
                  },
                  {
                    name: "plateNo",
                    value: "车牌号码",
                  },
                  {
                    name: "truckTonnage",
                    value: "载重(吨)",
                  },
                  {
                    name: "truckLengthString",
                    value: "车辆长度(米)",
                  },
                  {
                    name: "truckBoxName",
                    value: "车型",
                  },
                  {
                    name: "truckMaxWeight",
                    value: "车辆准牵引总质量",
                  },
                  {
                    name: "owner",
                    value: "车主",
                  },
                  {
                    name: "qualificationCertificate",
                    value: "司机从业资格证号",
                  },
                  {
                    name: "transportNo",
                    value: "道路运输许可证",
                    width: 30,
                  },
                  {
                    name: "planStartTime",
                    value: "预计发车时间",
                    width: 30,
                  },
                  {
                    name: "actualStartTime",
                    value: "实际发车时间",
                    width: 30,
                  },
                  {
                    name: "planEndTime",
                    value: "预计到达时间",
                    width: 30,
                  },
                  {
                    name: "actualEndTime",
                    value: "实际到达时间",
                    width: 30,
                  },
                  {
                    name: "planDistinct",
                    value: "运输距离(km)",
                  },
                  {
                    name: "feePrice",
                    value: "单价",
                  },
                  {
                    name: "feeUnitName",
                    value: "单位",
                  },
                  {
                    name: "feeAmount",
                    value: "数量",
                  },
                  {
                    name: "receiveFare",
                    value: "应收运费",
                  },
                  {
                    name: "payFare",
                    value: "金额(总运费)",
                  },
                  {
                    name: "actualFare",
                    value: "实付(总运费)",
                  },
                  {
                    name: "prepayTypeName",
                    value: "方式(预付)",
                  },
                  {
                    name: "oilCardNo",
                    value: "油卡号",
                  },
                  {
                    name: "prepayMoney",
                    value: "金额",
                  },
                  {
                    name: "prepayActualMoney",
                    value: "实付(预付)",
                  },
                  {
                    name: "arriveMoney",
                    value: "金额(到付)",
                  },
                  {
                    name: "arriveActualMoney",
                    value: "实付(到付)",
                  },
                  {
                    name: "isReceiptName",
                    value: "是否有回单",
                  },
                  {
                    name: "receiptMoney",
                    value: "金额",
                  },
                  {
                    name: "otherPayFareExportString",
                    value: "其他费用",
                    width: 150,
                  },
                  {
                    name: "isLocateName",
                    value: "是否定位",
                  },
                  {
                    name: "lossDamageMoney",
                    value: "货损货差",
                  },
                  {
                    name: "locateTypeName",
                    value: "定位方式",
                  },
                  {
                    name: "isPolicyName",
                    value: "是否投保",
                  },
                  {
                    name: "policyNo",
                    value: "保单号",
                  },
                  {
                    name: "policyStatusName",
                    value: "保单状态",
                  },
                  {
                    name: "remark",
                    value: "运单备注",
                  },
                  {
                    name: "createTime",
                    value: "创建时间",
                  },
                  {
                    name: "manifestNo",
                    value: "货物清单号",
                  },
                ];

                var html = template("customChecks", {
                  list: list,
                });

                customerChecksCon.html(html);
                // if (win.exportInit) return
                // else win.exportInit = 1
                $("[name=export]").on("change", function () {
                  //导出全部
                  if (this.id == "exportAll") {
                    customerChecksCon.find("input").prop("checked", true);
                  } else {
                    customerChecksCon.find("input").prop("checked", false);
                    //自定义导出
                    // TransportRoadModel.getDefaultExportWords().done(function (data) {
                    //     var names = data.split(',')
                    //     $.each(names, function () {
                    //         $("#check_" + this).prop("checked", true)
                    //     })
                    // })
                  }
                });
                $("#customChecks input").on("change", function () {
                  if (!this.checked) {
                    $("#exportCustom").prop("checked", true);
                  }
                });
              },
              yes: function () {
                var exportData = _u.form2Group();
                var exportListNames = [];
                var exportListValues = [];
                var exportListWidth = [];
                $.each($("#customChecks input[type=checkbox]"), function () {
                  if (this.checked) {
                    exportListNames.push(this.name);
                    exportListValues.push(this.value);
                    exportListWidth.push(
                      $(this).data("width").toString() || "0"
                    );
                  }
                });
                exportData.exportType = $("#exportCustom")[0].checked ? 1 : 0;
                exportData.exportListNames = exportListNames.join(",");
                exportData.exportListValues = exportListValues.join(",");
                exportData.exportListWidth = exportListWidth.join(",");
                exportData.token = localStorage.token;
                console.log(exportData);
                _u.downloadFile({
                  url: env.apiUrl + "/truckWaybill/exportExcel",
                  data: exportData,
                });
              },
            });
          });
          break;

        case "删除":
          var els = _u.getSelectedItem(true);
          if (!els) return;
          if (els.data.length == 0) {
            layer.msg("请选择一项进行删除");
            return;
          }
          _u.zlmsg.confirm("确认删除此运单?", function () {
            win.loading = _u.zlmsg.progress("删除中..");
            $.post(env.apiUrl + "/truckWaybill/delete", {
              id: els.ids.join(","),
            }).done(function (res) {
              _u.ajaxData(res, function () {
                _u.zlmsg.success("删除成功");
                tableList[0].reload();
              });
            });
          });
          break;
        case "完善资料":
          var els = _u.getSelectedItem(true);
          if (!els) return;
          if (els.data.length == 0) {
            layer.msg("请选择一项进行完善资料");
            return;
          }
          if (els.data.length > 1) {
            layer.msg("只可以选择一项进行完善资料");
            return;
          }
          var el = els.data[0];
          _u.fullDialog({
            content: "/static/page/transport_road/upload.html?id=" + el.id,
          });
          break;
        case "复制运单":
          var els = _u.getSelectedItem(true);
          if (!els) return;
          if (els.data.length == 0) {
            layer.msg("请选择一项进行复制");
            return;
          }
          if (els.data.length > 1) {
            layer.msg("只可以选择一项进行复制");
            return;
          }
          var el = els.data[0];
          if (el.resource != 1) {
            return _u.zlmsg.info("来自移动端的运单无法进行复制");
          }
          _u.fullDialog({
            content:
              "/static/page/transport_road/edit.html?mode=copy&id=" + el.id,
          });
          break;
        case "复制运单编号":
          var els = _u.getSelectedItem(true);
          if (!els) return;
          if (els.data.length == 0) {
            layer.msg("请选择一项进行复制");
            return;
          }
          if (els.data.length > 1) {
            layer.msg("只可以选择一项进行复制");
            return;
          }
          var el = els.data[0];
          _u.copyToClipboard(el.waybillCode);
          break;
        case "确认收货":
          var els = _u.getSelectedItem(true);
          if (!els) return;
          if (els.data.length == 0) {
            layer.msg("请至少选择一项进行确认收货");
            return;
          }
          var ids = [];
          $.each(els.data, function () {
            if (this.isArrive == 1) {
              _u.zlmsg.alert("运单已确认收货,无需重复确认");
              return;
            }
            ids.push(this.id);
          });
          if (ids.length == 0) {
            return;
          }
          _u.zlmsg.confirm("是否确认收货?", function () {
            win.loading = _u.zlmsg.progress("请稍候..");
            $.post(env.apiUrl + "/truckWaybill/confirmArrive", {
              ids: ids.join(","),
            }).done(function (res) {
              _u.ajaxData(res, function () {
                _u.zlmsg.success("确认成功");
                tableList[0].reload();
              });
            });
          });
          break;
        case "查看轨迹":
          var els = _u.getSelectedItem(true);
          if (!els) return;
          if (els.data.length == 0) {
            layer.msg("请选择一项进行查看");
            return;
          }
          if (els.data.length > 1) {
            layer.msg("只可以选择一项进行查看");
            return;
          }
          var el = els.data[0];
          _u.viewPath(el.id);
          break;
        case "费用登记":
          var els = _u.getSelectedItem(true);
          if (!els) return;
          if (els.data.length == 0) {
            layer.msg("请选择一项进行费用登记");
            return;
          }
          if (els.data.length > 1) {
            layer.msg("只可以选择一项进行费用登记");
            return;
          }
          var el = els.data[0];
          _u.fullDialog({
            content: "/static/page/transport_road/fee.html?id=" + el.id,
          });
          break;
        case "查看ETC发票":
          var els = _u.getSelectedItem(true);
          if (!els) return;
          if (els.data.length == 0) {
            layer.msg("请选择一项进行查看");
            return;
          }
          if (els.data.length > 1) {
            layer.msg("只可以选择一项进行查看");
            return;
          }
          _u.zlmsg.open({
            type: 2,
            title: "ECT发票 : " + els.data[0].waybillCode,
            content:
              "/static/page/transport_road/seeEtc.html?waybillCode=" +
              els.data[0].waybillCode,
            scrollbar: false,
            area: ["90%", "90%"],
          });
          break;
        case "导入":
          var index = _u.zlmsg.open({
            type: 1,
            title: "导入",
            content:
              '<form id=\'uploadForm\' action="#" style="border-radius: 0px;" class="form-horizontal group-border-dashed xs-p-15">\n' +
              '                      <div class="text-center">上传Excel文件</div>\n' +
              '                      <div class="text-center">\n' +
              '                        <input type="file" name="file" id="uploadFile" class="inputfile">\n' +
              '                        <label for="uploadFile" class="btn-primary"> <i class="mdi mdi-upload"></i><span>点此选择文件</span></label>\n' +
              '                      <div class="text-center file-name-hook ">\n' +
              "</div>" +
              "                      </div>\n" +
              "<div class='form-group'>\n" +
              "<div class='col-sm-4' style='float:none;margin:0px auto'>\n" +
              "<label class='control-label'><span class='text-danger '>*</span>是否直接审核通过</label>\n" +
              "<select required parsley-trigger='change' name='isAudit'  id='isAudit' class='form-control input-sm'>\n" +
              "<option value='0'>否</option>\n" +
              "<option value='1'>是</option>\n" +
              "</select>\n" +
              "</div>\n" +
              "<p style='color:red;text-align:center;padding:6px'>请确保数据已经核对无误，导入成功后，数据无法修改！！</p>\n" +
              "</div>\n" +
              "</form>",
            scrollbar: false,
            area: ["500px", "340px"],
            btn: ["开始导入", "下载模板"],
            btnAlign: "c",
            success: function () {
              $("#uploadFile").on("change", function () {
                $(".file-name-hook").text(this.files[0].name);
              });
            },
            yes: function () {
              var data = new FormData();
              var file = $("#uploadFile")[0].files[0];
              if (!file) return _u.zlmsg.fail("请先选择需要上传的EXCEL文件");
              if (file.name.indexOf(".xls") == -1)
                return _u.zlmsg.fail("请上传正确的.xls/.xlsx后缀文件");
              data.append("upfile", file);
              data.append("isAudit", $("#isAudit").val());
              win.loading = _u.zlmsg.progress("加载中...");
              $.ajax({
                url: env.apiUrl + "/truckWaybill/import",
                type: "POST",
                data: data,
                processData: false,
                contentType: false,
              }).done(function (res) {
                _u.ajaxDataComplete(res, function () {
                  if (res.code == 1) {
                    layer.close(index);
                    _u.zlmsg.success("上传成功");
                    tableList[0].reload();
                  } else {
                    if (res.msg) return _u.zlmsg.fail(res.msg);
                    var html = "<div class='xs-p-15'>";
                    $.each(res.data, function () {
                      html +=
                        "<div><b> " +
                        this.row +
                        "</b> 行, <b>" +
                        this.column +
                        "</b> 列 【" +
                        this.titleName +
                        "】 发生错误: <b>" +
                        this.errorInfo +
                        "</b> </div>";
                    });
                    html += "</div>";
                    _u.zlmsg.open({
                      type: 1,
                      title: "导入出错",
                      content: html,
                      scrollbar: false,
                      area: ["600px", "280px"],
                      btn: ["确定"],
                      btnAlign: "c",
                    });
                  }
                });
              });
            },
            btn2: function () {
              location.href =
                env.appUrl +
                "/truckWaybill/excelOut?token=" +
                localStorage.token;
              return false;
            },
          });
      }
    });
  });
});
