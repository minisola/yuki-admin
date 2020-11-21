var router = [
    {
        id: 2,
        name: "人车管理",
        icon:"icon-cheguanjia"
    },
    {
        id: 3,
        name: "我的车辆",
        url: "/static/page/truck/list_index.html"
    },
    {
        id: 4,
        name: "我的司机",
        url: "/static/page/driver/list_index.html"
    }, {
        id: 5,
        name: "我要找车",
        newWin:true,
        url: "/static/page/truck/find.html"
    }, {
        id: 6,
        name: "在途跟踪",
        newWin:true,
        url: "/static/page/truck/view.html"
    },  {
        id: 8,
        name: "项目管理",
        icon:"icon-xiangmuguanli",
    }, {
        id: 9,
        name: "项目列表",
        url: "/static/page/project/list_index.html"
    }, {
        id: 10,
        name: "项目转包",
        url: "/static/page/project/list_subcontract.html"
    }, {
        id: 11,
        name: "公路运输",
        icon:"icon-gonglu",
    },{
        id: 12,
        name: "新建运单",
        subName:"公路新建运单",
        url: "/static/page/transport_road/edit.html"
    }, {
        id: 13,
        name: "公路运单列表",
        url: "/pages/transport_road/list_index.html"
    }, {
        id: 14,
        name: "公路运单审批",
        url: "/static/page/transport_road/list_auditing.html"
    }, {
        id: 63,
        name: "货源管理",
        url: "/static/page/transport_road/list_source.html"
    }
    ,{
        id: 15,
        name: "铁路运输",
        icon:"icon-tielu",
    }, {
        id: 16,
        name: "铁路运单列表",
        url: "/static/page/transport_railway/list_index.html"
    }, {
        id: 17,
        name: "铁路运单审批",
        url: "/static/page/transport_railway/list_auditing.html"
    },{
        id: 18,
        name: "水运运输",
        icon:"icon-haiyun",
    }, {
        id: 19,
        name: "水运运单列表",
        icon: "gonglu",
        url: "/static/page/transport_sea/list_index.html"
    }, {
        id: 20,
        name: "水运运单审批",
        icon: "cba",
        url: "/static/page/transport_sea/list_auditing.html"
    }
    , {
        id: 21,
        name: "付款管理",
        icon:"icon-fukuan",
    },{
        id: 22,
        name: "申请付款",
        url: "/static/page/pay/list_apply.html"
    }, {
        id: 23,
        name: "付款审批",
        url: "/static/page/pay/payAudit.html"
    }, {
        id: 24,
        name: "运输打款",
        url: "/static/page/pay/list_pay.html"
    }
    , {
        id: 68,
        name: "油卡支付",
        url: "/static/page/pay/list_oilPay.html"
    }, {
        id: 26,
        name: "资金管理",
        icon:"icon-zijinguanli",
    },
    {
        id: 50,
        name: "还款管理",
        url: "/static/page/capital/list_receivable.html?listType=2"
    },{
        id: 27,
        name: "资金账户管理",
        url: "/static/page/capital/list_index.html"
    },{
        id: 62,
        name: "保险账户管理",
        url: "/static/page/capital/list_policy.html"
    }
    ,{
        id: 64,
        name: "油卡账户管理",
        url: "/static/page/capital/list_oil.html"
    }
    , {
        id: 46,
        name: "成本核算",
        url: "/static/page/capital/list_receivable.html?listType=1"
    },
    {
        id: 47,
        name: "利率管理",
        url: "/static/page/capital/list_rate.html"
    }, {
        id: 48,
        name: "利息统计",
        url: "/static/page/capital/list_interest.html"
    }, {
        id: 28,
        name: "交易流水",
        icon:"icon-jiaoyimingxi",
    }, {
        id: 29,
        name: "运输交易流水",
        url: "/static/page/capitalFlow/transportFlow.html"
    }, {
        id: 30,
        name: "资金垫付流水",
        url: "/static/page/capitalFlow/advanceFlow.html"
    }, {
        id: 31,
        name: "转入流水",
        url: "/static/page/capitalFlow/rechargeFlow.html"
    }, {
        id: 32,
        name: "转出流水",
        url: "/static/page/capitalFlow/cashFlow.html"
    }, {
        id: 61,
        name: "保费交易流水",
        url: "/static/page/capitalFlow/policyFlow.html"
    },{
        id: 65,
        name: "油卡转入转出流水",
        url: "/static/page/capitalFlow/oil_inFlow.html"
    },{
        id: 66,
        name: "油卡交易流水",
        url: "/static/page/capitalFlow/oil_tranFlow.html"
    },{
        id: 67,
        name: "油卡垫付流水",
        url: "/static/page/capitalFlow/oil_advanceFlow.html"
    },
    {
        id: 34,
        name: "系统管理",
        icon: "icon-ext-icon-xitongguanli",
    }, {
        id: 35,
        name: "组织结构",
        url: "/static/page/system_manage/list_organization.html"
    }, {
        id: 36,
        name: "角色管理",
        url: "/static/page/system_manage/list_role.html"
    }, {
        id: 37,
        name: "用户管理",
        url: "/static/page/system_manage/list_user.html"
    }, {
        id: 38,
        name: "客户管理",
        url: "/static/page/system_manage/list_customer.html"
    }, {
        id: 39,
        name: "运输协议管理",
        url: "/static/page/system_manage/list_transport.html"
    }, {
        id: 399,
        name: "运输协议管理",
        url: "/static/page/system_manage/list_transport.html"
    }, {
        id: 41,
        name: "委托承运业务管理",
        icon:"icon-zhuanbao"
    }, {
        id: 42,
        name: "项目管理",
        url: "/static/page/car_free_carrier/projectManage_list.html"
    }, {
        id: 43,
        name: "公路运单管理",
        url: "/static/page/car_free_carrier/list_road.html"
    }, {
        id: 69,
        name: "水运运单管理",
        url: "/static/page/car_free_carrier/list_sea.html"
    }, {
        id: 44,
        name: "付款明细",
        url: "/static/page/car_free_carrier/payDetail.html"
    }, {
        id: 45,
        name: "付款审批",
        url: "/static/page/car_free_carrier/pay.html"
    }, {
        id: 49,
        name: "查运单",
        url: "/static/page/transport_road/list_find.html"
    },
    {
        id: 59,
        name: "委托承运流水",
        url: "/static/page/capitalFlow/transportFlow.html?usage=1"
    },
    //江苏供应链定制模块
    {
        id: 56,
        name: "统计报表",
        icon:"icon-jiaoyimingxi",
    }, {
        id: 57,
        name: "月统计报表",
        url: ""
    }, {
        id: 51,
        name: "发货需求",
        url: "/static/page/transport_road/delivery_requirement.html"
    }
    , {
        id: 58,
        name: "运营统计分析",
        url: "/static/page/custom_page/jsgyl/list_project.html"
    }
    , {
        id: 52,
        name: "服务账单",
        icon: "icon-etc",
    }
    , {
        id: 53,
        name: "ETC电子发票服务账单",
        url: "/static/page/EtcInvoice/etcBill.html"
    }
    , {
        id: 54,
        name: "ETC电子发票明细",
        url: "/static/page/EtcInvoice/etcDetail.html"
    }
    , {
        id: 60,
        name: "总账户流水",
        url: "/static/page/capitalFlow/accountFlow.html"
    }
    //随行付
    ,{
        id: 81,
        name: "融资管理",
        url: "/static/page/capitalFlow/accountFlow.html"
    }
    ,{
        id: 82,
        name: "申请融资",
        url: "/static/page/finance/finance.html"
    }
    ,{
        id: 83,
        name: "融资审批",
        url: "/static/page/finance_apply/list_apply.html"
    }
    ,{
        id: 84,
        name: "融资账户管理",
        url: "/static/page/capital/sxf_capital.html"
    }
    ,{
        id: 85,
        name: "还款管理",
        url: "/static/page/capital/sxf_receivable.html"
    }
    , {
        id: 70,
        name: "结算管理",
        icon:"icon-jiesuan"
    }
    , {
        id: 71,
        name: "客户对账",
        url: "/static/page/settlement/list_bills.html?type=1"  //项目类型(1:自营 2:平台)
    }
    , {
        id: 72,
        name: "开票申请",
        url: "/static/page/settlement/list_invoice_apply.html?type=1"
    }, {
        id: 73,
        name: "开票审批",
        url: "/static/page/settlement/list_invoice_audit.html?type=1"
    }, {
        id: 74,
        name: "开票完成",
        url: "/static/page/settlement/list_invoice_complete.html?type=1"
    }, {
        id: 75,
        name: "发票核销",
        url: "/static/page/settlement/list_invoice_verification.html?type=1"
    }, {
        id: 76,
        name: "结算管理",
        icon:"icon-jiesuan"
    }
    , {
        id: 77,
        name: "客户对账",
        url: "/static/page/settlement/list_bills.html?type=2"
    }
    , {
        id: 78,
        name: "开票申请",
        url: "/static/page/settlement/list_invoice_apply.html?type=2"
    }, {
        id: 79,
        name: "开票审批",
        url: "/static/page/settlement/list_invoice_audit.html?type=2"
    }, {
        id: 80,
        name: "开票完成",
        url: "/static/page/settlement/list_invoice_complete.html?type=2"
    }, {
        id: 86,
        name: "日志管理",
        url: "/static/page/system_manage/list_log.html"
    }, {
        id: 87,
        name: "ETC发票数据统计",
        url: "/static/page/capitalFlow/invoice_statistics.html"
    }
]

export default router