
import '@/less/style.less';

// import $ from 'jquery';
import md5 from '@/libs/md5/md5.js';
import layer from '@/libs/layer/layer.js';
// import { utils as _u } from '../js/common/utils.js';

    //防止页面被嵌套
    if (window.top != window) {
        window.top.location = window.location;
    }
    var account = localStorage.getItem("account");

    // var pathname = location.pathname
    // var sys = pathname.match(/^\/(\w+)\/?/) || ""


    // if (sys && sys[1] != "index") {
    //     sys = sys[1]
    // } else {
    //     sys = env == "dev" ? "index" :"index" //dev
    // }
    // console.log(sys,env)

    $(function () {

        // require(['swiper','swiperAni'],function (swiper) {
        //     //轮播
        //     new swiper ('.swiper-container', {
        //         loop: true, // 循环模式选项
        //         autoplay:8000,
        //         speed:1200,
        //         effect:"fade",
        //         onInit:function(swiper){
        //             swiperAnimateCache(swiper)
        //             swiperAnimate(swiper)
        //         },
        //         onSlideChangeEnd:function(swiper){
        //             swiperAnimate(swiper)
        //             // swiper.slides.eq(this.activeIndex).find('.ani').removeClass('ani');
        //         }
        //     })
        // })


        // var typeFun = new TypeIt('.type_1').type('省心：业务全程透明化、管理透明化、数据透明化、财务透明化').pause(200).break().type('安心：我们提供完整的货物在途监控')
        //     .pause(200).break().type('贴心：我们提供完整的在线服务链：物流保理、融资、运输各类保险')
        // setTimeout(function () {
        //     if (typeFun.isComplete) {
        //         typeFun.destroy()
        //        $(".type_1").html("<span>省心：业务全程透明化、管理透明化、数据透明化、财务透明化<br>安心：我们提供完整的货物在途监控<br>贴心：我们提供完整的在线服务链：物流保理、融资、运输各类保险</span>")
        //     }
        // }, 10000)

        if (account) {
            $("#remember").attr("checked", true);
            $("#account").val(account);
        } else {
            $("#remember").attr("checked", false);
        }
        $("#loginForm").on("submit", function (e) {
            e.preventDefault()
            loginFun();
            return false;
        })

        // //查看协议
        // $(".view-service-agreement-hook,.view-trade-agreement-hook").on('click',function(){
        //     var $this = $(this)
        //     var url = ""
        //     if ($this.hasClass('view-service-agreement-hook')){
        //         url = '/static/page/agreement/service.html'
        //     }else{
        //         url = '/static/page/agreement/trade.html'
        //     }
        //     layer.open({
        //         type: 2,
        //         shade: 0.3,
        //         area: ["80%", "90%"],
        //         title: false, //不显示标题
        //         content: url, //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
        //     });
        // })


    });

    function showError(content) {
        layer.msg(content, {icon: 5})
    }

    function loginFun() {
        var account = $("#account").val();
        var pwd = $("#pwd").val();
        // var flag = 1;
        if (account == "") {
            showError("用户名不能为空");
            return;
        }
        if (pwd == "") {
            showError("密码不能为空");
            return;
        }

        // if($("#remember").is(":checked")){
        //     flag = 0;
        // }
        // var isSimple = 1;
        if(_u.validateReg.strongPwd.test(pwd)){
            //如果是 满足要求的密码,传0
            localStorage.isSimple = 0
        }else{
            localStorage.isSimple = 1
        }
        window.loading = layer.msg("登录中...", {icon: 16, time: 0, shade: [0.3, '#000']})
        $.ajax({
            type: "POST",
            url: "/api/index/login",
            // url: sys ? apiUrl + "/" + sys + "/login" : apiUrl + "/login",
            data: {
                "account": account,
                "pwd": md5.hex_md5(pwd),  //tangjj89
            },
            success: function (res) {
                _u.ajaxData(res, function () {
                    if ($("#remember").is(":checked")) {
                        localStorage.setItem("account", account)
                    }else{
                        localStorage.setItem("account", "")
                    }
                    localStorage.setItem("token", res.data.token)
                    localStorage.setItem("user", JSON.stringify(res.data))
                    location.href = "/pages/layout.html";
                })
            }
        });
    }

    //重置密码
    $("#resetPw").click(function () {
        window.resetPwDialog = layer.open({
            type: 1,
            shade: 0.3,
            area: ["320px", "380px"],
            title: false, //不显示标题
            content: $('#resetForm'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
            success: function () {
                window.newDialog = new ResetPw();
            },
            cancel: function () {
                newDialog._destroy()
            }
        });
    })


//重置密码类
    var ResetPw = function () {
        this.userName = "";
        this.code = "";
        this.pw = ""

        this._init()
        //检查账号
        this.checkAccount = function () {
            this.userName = $.trim($("input[name=resetAccount]").val())
            if (this.userName.length === 0) {
                layer.msg("请输入用户名")
                return false
            } else {
                return true
            }
        }
        //检查验证码
        this.checkCode = function () {
            this.code = $.trim($("input[name=resetVcode]").val())
            if (this.code.length === 0) {
                layer.msg("请输入验证码")
                return false
            } else {
                return true
            }
        }
        //检查密码
        this.checkPw = function () {
            this.pw = $.trim($("input[name=resetPw]").val())
            var rePw = $.trim($("input[name=reResetPw]").val())
            if(!_u.validateReg.strongPwd.test(this.pw)){
                layer.msg("密码格式不正确,请参考说明进行设置")
                return false
            }
            if (this.pw.length === 0) {
                layer.msg("请输入新密码")
                return false
            } else if (this.pw != rePw) {
                layer.msg("确认密码不符合,请检查重新输入")
                return false
            } else {
                return true
            }
        }
        //显示tips
        this.showTips = function (mobile) {
            $(".code-tips-hook").show().find("b").text(mobile)
        }
        //关闭tips
        this.hideTips = function () {
            $(".code-tips-hook").hide()
        }
        //显示loading
        this.showLoading = function (msg) {
            window.TEMP_LOADING = layer.msg(msg, {
                icon: 16
                , shade: 0.2,
                time: 99999
            })
        }
        //关闭loading
        this.hideLoading = function () {
            layer.close(window.TEMP_LOADING)
        }
    }

    ResetPw.prototype._init = function () {
        var that = this;
        $(".sendCode-hook").click(function () {
            if (that.checkAccount()) {
                that.showLoading("发送中...")
                $.ajax({
                    url: apiUrl + "/getMessageCodeByUserName",
                    type: "POST",
                    data: {
                        userName: that.userName
                    },
                    dataType: "json",
                }).done(function (res) {
                    setTimeout(function () {
                        that.hideLoading()
                        if (res.code == 1) {
                            that.showTips(res.msg)
                        } else if (res.code == 0) {
                            layer.msg(res.msg)
                        }
                    }, 1000)
                })
            }
        })

        $(".reset-submit-hook").click(function () {
            if (that.checkAccount() && that.checkCode() && that.checkPw()) {
                that.showLoading("处理中...")
                $.ajax({
                    url: apiUrl + "/resetPwd",
                    type: "POST",
                    data: {
                        userName: that.userName,
                        password: md5.hex_md5(that.pw),
                        code: that.code
                    },
                    dataType: "json",
                }).done(function (res) {
                    setTimeout(function () {
                        that.hideLoading()
                        if (res.code == 1) {
                            layer.closeAll();
                            layer.msg('重置成功,请用新密码登录', {icon: 1});
                            $("#account").val(that.userName)
                            that._destroy();
                        } else if (res.code == 0) {
                            layer.msg(res.msg)
                        }
                    }, 1000)
                })
            }
        })
    }
//注销类

    ResetPw.prototype._destroy = function () {
        this.hideTips()
        $(".sendCode-hook").off("click");
        $(".reset-submit-hook").off("click");
        $("input[name=resetAccount]").val("")
        $("input[name=resetVcode]").val("")
        $("input[name=resetPw]").val("")
        $("input[name=reResetPw]").val("")
    }
