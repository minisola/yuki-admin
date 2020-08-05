    var utils = {}
    /**
     *  通过name获取节点
     * @param name
     * @returns {jQuery|HTMLElement}
     */
    utils.getFromName = function (name) {
        return $("[name='" + name + "']")
    }
    /**
     * @description 获取当前时间
     * @return {String} "2018-11-11 11:11:11"
     */
    utils.getTimeNow = function (float) {
        var myDate = float ? new Date(float) : new Date();
        //获取当前年
        var year = myDate.getFullYear();
        //获取当前月
        var month = myDate.getMonth() + 1;
        month = month < 10 ? "0" + month : month
        //获取当前日
        var date = myDate.getDate();
        var h = myDate.getHours(); //获取当前小时数(0-23)
        h = h < 10 ? "0" + h : h
        var m = myDate.getMinutes(); //获取当前分钟数(0-59)
        var s = myDate.getSeconds();
        m = m < 10 ? "0" + m : m
        s = s < 10 ? "0" + s : s
        var now = year + '-' + month + "-" + date + " " + h + ':' + m + ":" + s;
        return now;
    }


    /**
     * @description 获取search某个项目值
     * @param {String} name
     */
    utils.getQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2];
        return '';
    }

    /**
     * @description 获取search对象
     * @param {String} name
     */
    utils.getQueryObject = function () {
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) continue;
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
    }


    /**
     * 去空格处理
     */
    utils.replaceBlank = function (data) {
        for (key in data) {
            if (data.hasOwnProperty(key) && typeof data[key] === 'string') {
                data[key] = data[key].replace(/\s/g, '')
            }
        }
    }
    /**
     * 将form类型转换为JSON序列
     * @param domName
     * @param disabledAllowed 不允许disabled的input提交
     */
    utils.form2Group = function (domName, disabledNotAllowed) {
        domName = domName ? domName : "form"
        var inputs = $(domName).find("input,select,textarea")
        var data = {}
        var reg = /^\[(\w+)\]+(\w+)$/
        $.each(inputs, function () {
            if (this.type == "file") return
            if (!this.name) return
            if (disabledNotAllowed && this.disabled) return
            var $value = ""
            //筛选布尔
            if (typeof this.value == "boolean") {
                $value = this.value === true ? 1 : 0
            } else {
                $value = this.value
            }
            //筛选checkbox
            if (this.type == "checkbox" && this.checked) $value = 1
            if (this.type == "checkbox" && !this.checked) $value = 2
            //筛选radio
            if (this.type == "radio") $value = $("[name=" + this.name + "]:checked").val()

            //组合
            if (reg.test(this.name)) {
                var regList = this.name.match(reg)
                var parent = regList[1]
                var child = regList[2]
                if (!data.hasOwnProperty(parent)) data[parent] = {}
                data[parent][child] = $.trim($value)
            } else {
                data[this.name] = $.trim($value)
            }
        })
        return data
    }


    /**
     * 将输入数据插入到表单中
     * @param data
     */
    utils.input2Form = function (data, dom) {
        dom = dom ? dom : "form"
        if (dom.selector) dom = dom[0]
        var inputData = []
        for (key in data) {
            var el = data[key]
            var type = typeof el
            if (type != "object") {
                inputData.push({
                    name: key,
                    value: el
                })
            } else {
                for (keyC in el) {
                    var elC = el[keyC]
                    inputData.push({
                        name: "[" + key + "]" + keyC,
                        value: elC
                    })
                }
            }
        }
        $.each(inputData, function () {
            try {
                $(dom).find("input[type=text][name='" + this.name + "']").val(this.value)
                $(dom).find("input[type=hidden][name='" + this.name + "']").val(this.value)
                $(dom).find("input[type=number][name='" + this.name + "']").val(this.value)
                $(dom).find("select[name='" + this.name + "']").val(this.value)
                $(dom).find("textarea[name='" + this.name + "']").val(this.value)
                $(dom).find("input[type=radio][name='" + this.name + "'][value='" + this.value + "']").attr("checked", true)
            } catch (e) {

            }
        })
    }


    /**
     * @description 获取当前日期
     * @param {Number} AddDayCount 获取AddDayCount天后的日期
     */
    utils.getDateStr = function (AddDayCount) {
        var dd = new Date();
        if (AddDayCount) {
            dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        }
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;//获取当前月份的日期
        if (m < 10) m = "0" + m.toString()
        var d = dd.getDate();
        if (d < 10) d = "0" + d.toString()
        return y + "-" + m + "-" + d;
    }


    /**
     * @description 倒数秒
     * @param {String} o 获取AddDayCount天后的日期
     * @example countDown(2012-01-01 12:12:12)
     */
    utils.countDown = function (o) {
        var a = /^[\d]{4}-[\d]{1,2}-[\d]{1,2}( [\d]{1,2}:[\d]{1,2}(:[\d]{1,2})?)?$/ig, str = '', conn, s;
        if (!o.match(a)) {
            console.log('参数格式为2012-01-01[ 01:01[:01]].\r其中[]内的内容可省略');
            return false;
        }
        var sec = (new Date(o.replace(/-/ig, '/')).getTime() - new Date().getTime()) / 1000;
        if (sec > 0) {
            conn = '还有';
        } else {
            conn = '已过去';
            sec *= -1;
        }
        s = {'天': sec / 24 / 3600, '小时': sec / 3600 % 24, '分': sec / 60 % 60, '秒': sec % 60};
        for (i in s) {
            if (Math.floor(s[i]) > 0) str += Math.floor(s[i]) + i;
        }
        if (Math.floor(sec) == 0) {
            str = '0秒';
        }
        document.getElementById('show').innerHTML = '距离<u>' + o + '</u>' + conn + '<u>' + str + '</u>';
        setTimeout(function () {
            count_down(o)
        }, 1000);
    }

    /**
     * @description 回到顶部
     */
    utils.scrollToTop = function () {
        if ($) {
            $("body").append("<span class='backToTop iconfont'>↑</span>");
            var scroller = $('.backToTop')
            $(window).scroll(function () {
                document.documentElement.scrollTop + document.body.scrollTop > 200 ? scroller.show() : scroller.hide();
            });
            $('.backToTop').click(function () {
                utils.scrollTo('body');
            });
        }
    };
    /**
     * @description 回到
     * @param {String} name 回到DOM的名称
     * @example utils.scrollTo('body')
     */
    utils.scrollTo = function (name) {
        if ($) {
            $('html,body').animate({
                scrollTop: $(name).offset().top
            }, 300)
        }
    }
    /*
     * formatMoney(s,type)
     * 功能：金额按千位逗号分割
     * 参数：s，需要格式化的金额数值.
     * 参数：type,判断格式化后的金额是否需要小数位.
     * 返回：返回格式化后的数值字符串.
     */

    utils.formatMoney = function (s, params) {

        var fixed = 2
        if (params) {
            if (params.fixed != undefined) fixed = params.fixed

        }
        s = accounting.formatMoney(s, "", fixed)
        return s;
    }

    /**
     * 将form表单元素的值序列化成对象
     *
     * @example sy.serializeObject($('#formId'))
     * @requires jQuery
     *
     * @returns object
     */
    utils.serializeObject = function (form) {
        var o = {};
        $.each(form.serializeArray(), function (index) {
            if (this['value'] != undefined && this['value'].length > 0) {// 如果表单项的值非空，才进行序列化操作
                if (o[this['name']]) {
                    o[this['name']] = o[this['name']] + "," + this['value'];
                } else {
                    o[this['name']] = this['value'];
                }
            }
        });
        return o;
    };
    /**
     * @description 多行文本转义和反转义
     **/
    utils.textarea_str = function (text) {
        var t = text.replace(/\r{0,}\n/g, "<br>").replace(/\s/g, "&nbsp;");
        return t || '';
    }

    utils.str_textarea = function (str) {
        var t = str.replace(/<br>/g, "\n").replace(/\&nbsp\;/g, "\s");
        return t || '';
    }
    /**
     * @description 验证规则
     */
    utils.validateReg = {  //验证规则
        strongPwd: /((^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[\da-zA-Z\w]{6,16}$)|(^(?=.*\d)(?=.*[A-Z])(?=.*\W)[\da-zA-Z\W]{6,16}$)|(^(?=.*\d)(?=.*[a-z])(?=.*\W)[\da-zA-Z\W]{6,16}$)|(^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\da-zA-Z\w]{6,16}$))/,
        mobile: /^[1-9]\d{10}$/, //手机
        name: /^[\u4e00-\u9fa5a-zA-Z]+$/,   //中英文
        idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,   //身份证
        pw: /[^\w\.\/]/ig,  //密码
        price: /^([1-9]\d*|0)(\.\d{1,2})?$/,  //两位小数的价格
        num: /^[1-9]\d*$/,  //正整数
        bmId: /^\w+$/,  //正整数和英文
        pricets: /^(-)?([1-9]\d*|0)(\.\d{1,2})?$/,  //可以负数的两位小数
        mail: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,   //邮箱
        pw2: /^(\w*@*\.*\-*\+*)+$/,  //英文数字小数点@,-,+组成的密码
        isImg: /.*(.jpg|.png|.gif|.jpeg|.bmp|.tiff|.raw|.webp)$/i //是否为图片文件
    }

    /**
     * @description 浮点型除法
     * @param {any} a
     * @param {any} b
     * @returns
     */
    utils.div = function (a, b) {
        var c, d, e = 0,
            f = 0;
        try {
            e = a.toString().split(".")[1].length;
        } catch (g) {
        }
        try {
            f = b.toString().split(".")[1].length;
        } catch (g) {
        }
        return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), utils.mul(c / d, Math.pow(10, f - e));
    }
    /**
     * @description 浮点型加法
     * @param {any} a
     * @param {any} b
     * @returns
     */
    utils.accAdd = function (arg1, arg2, fixed) {
        var r1, r2, m;
        try {
            r1 = arg1.toString().split(".")[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split(".")[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        return ((arg1 * m + arg2 * m) / m).toFixed(fixed || 2);
    }
    /**
     * @description 浮点型乘法
     * @param {any} a
     * @param {any} b
     * @returns
     */
    utils.mul = function (a, b) {
        var c = 0,
            d = a.toString(),
            e = b.toString();
        try {
            c += d.split(".")[1].length;
        } catch (f) {
        }
        try {
            c += e.split(".")[1].length;
        } catch (f) {
        }
        return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
    }
    /**
     * @description 浮点型减法
     * @param {any} a
     * @param {any} b
     * @returns
     */
    utils.accSubtr = function (arg1, arg2) {

        var r1, r2, m, n;

        try {
            r1 = arg1.toString().split(".")[1].length
        } catch (e) {
            r1 = 0
        }

        try {
            r2 = arg2.toString().split(".")[1].length
        } catch (e) {
            r2 = 0
        }

        m = Math.pow(10, Math.max(r1, r2));

        //动态控制精度长度

        n = (r1 >= r2) ? r1 : r2;

        return ((arg1 * m - arg2 * m) / m).toFixed(n);

    }


//取得默认搜索栏高度
    function getTopHeight() {
        var top1 = Number($(".zl-page-top").height())
        var top2 = Number($(".zl-tableTop-btns").height() || 0)
        var top3 = Number($(".zl-tabs").height() || 0)
        var top4 = Number($(".zl-table-search").height() || 0)
        var top5 = Number($(".zl-tab-btns").height() || 0)
        var topHeight = top1 + top2 + top3 + top4 + top5
        return topHeight
    }

    utils.getTopHeight = getTopHeight

    /**
     * 创建数据表格
     * @param win window
     * @param table layui.table
     * @param options 表格选项可以覆盖
     * @param cb 工具条事件回调
     * @param resetFun 重置事件前置事件
     */

    utils.cTable = function (config) {
        window.table = config.table

        var default_options = {
            id: 'main',
            elem: '#table-main',
            headers: {
                token: localStorage.token
            }
            ,
            height: 'full-' + (35 + getTopHeight())
            ,
            url: ''
            ,
            page: true
            ,
            loading: true
            ,
            size: "sm"
            ,
            limit: $(document).height() > 640 ? 20 : 10,
            method: "post",
            cellMinWidth: 80,
            limits: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            request: {
                limitName: "rows"
            }
            , response: {
                statusName: 'status' //规定数据状态的字段名称，默认：code
                , statusCode: 0 //规定成功的状态码，默认：0
                , msgName: 'msg' //规定状态信息的字段名称，默认：msg
                , countName: 'total' //规定数据总数的字段名称，默认：count
                , dataName: 'rows' //规定数据列表的字段名称，默认：data
            }, parseData: function (res) { //res 即为原始返回的数据

                //response钩子
                config.totalFun && config.totalFun(res)  //sola

                if (res.code == 401) {
                    top.layer.alert("登录信息已过期,请重新登录", function () {
                        location.href = appUrl
                    })
                    return
                }
                return {
                    "status": 0, //解析接口状态
                    // "msg": res.message, //解析提示文本
                    "total": res.total, //解析数据长度
                    "rows": res.rows, //解析数据列表
                    "footer": (res.footer && res.footer[0]) || {} //合计行
                };
            },
            jumpReset: function () {
                //重置选择
                tableList && tableList[0] && (tableList[0].selectedItem = null)
            },
            cols: []
        }
        var _config = $.extend(true, {}, default_options, config.tableOptions)
        var tableMain = table.render(_config);
        tableMain.TableClass = window.table

        //监听个双击事件
        if (config.rowDoubleFun) {
            table.on("rowDouble(table-" + _config.id + ")", function (obj) {
                config.rowDoubleFun(obj.data)
            });
        }
        //监听其它事件
        table.on('tool(table-' + _config.id + ')', function (obj) {
            config.event && config.event(obj)
            tableMain.selectedItem = obj.data
        });

        //监听搜索项
        layui.form.on('submit(formSubmit)', function (data) {
            tableMain.selectedItem = null
            var isVisible = tableMain.config.elem.parents(".zl-page-main").is(":visible")
            if (isVisible) {
                for (key in data.field) {
                    if (data.field[key] == "" || data.field[key] == undefined) {
                        delete data.field[key]
                    }
                }
                //搜索项内有车辆长度,重量则处理为x1000
                if (config.fixTruckParameter) {
                    data.field.truckTonnage && (data.field.truckTonnage = utils.mul(Number(data.field.truckTonnage) || 0, 1000))
                    data.field.truckLength && (data.field.truckLength = utils.mul(Number(data.field.truckLength) || 0, 1000))
                }
                //对特定起终时间做处理
                if (config.minute2Second) {
                    $.each(config.minute2SecondStart, function () {
                        var time = data.field[this]
                        if (time) {
                            data.field[this] = time + ':00'
                        }

                    })
                    $.each(config.minute2SecondEnd, function () {
                        var time = data.field[this]
                        if (time) {
                            data.field[this] = time + ':59'
                        }
                    })
                }

                tableMain.reload({
                    page: _config.page ? {
                        curr: 1
                    } : false,
                    where: data.field
                })
                return false;
            } else {
                return false
            }
        });
        //监听重置事件

        $(document).off("click", ".search-reset-hook")
        $(document).on("click", ".search-reset-hook", function () {
            tableMain.selectedItem = null
            if (config.resetFun) {
                config.resetFun({
                    config: _config
                })
                tableMain.reload({
                    page: _config.page ? {
                        curr: 1
                    } : false,
                    where: _config.where || {}
                })
            } else {
                $("form").find("input,select").val("")
                tableMain.reload({
                    page: _config.page ? {
                        curr: 1
                    } : false,
                    where: {}
                })
            }

        })
        //将表格组插入全局变量
        window.tableList = [tableMain]
    }

    /**
     * 取出当前选中的行数据
     * @param id
     * @returns {*}
     */

    utils.getTableSelected = function (index) {
        index = index ? index : 0
        var s = tableList[index]
        if (s) {
            return tableList[index].selectedItem
        } else {
            return false
        }
    }

    /**
     * 取出行数据并返回信息
     * @param multiply {Boolean} 是否多行数据
     * @param tableId {String} 表格ID
     * @returns {*}
     */

    utils.getSelectedItem = function (multiply, tableId,warnText) {
        if (!multiply) {
            var el = utils.getTableSelected()
            if (el) {
                return el
            } else {
                utils.zlmsg.msg(warnText || "请选择一项进行操作")
                return false
            }
        } else {

            var checkStatus = window.table.checkStatus(tableId || "main")

            if (!checkStatus.data.length) {
                utils.zlmsg.msg(warnText || "请选择一项进行操作")
                return false
            } else {
                checkStatus.ids = []
                for (var i = 0; i < checkStatus.data.length; i++) {
                    checkStatus.ids.push(checkStatus.data[i].id)
                }
                return checkStatus
            }
        }

    }

    /**
     * //生成合计行
     * @param rowList {Array}
     * @param domId {String} "#toatal-row"
     */
    utils.renderTotalRow = function (rowList, domId) {
        var html = '<div class="btn">合计:</div>'
        $.each(rowList, function () {
            if ((this.value.toString()).indexOf(",") == -1) this.value = utils.formatMoney(this.value)
            html += "<div class=\"btn\">" +
                this.name + ": " +
                "<b class=\"text-success\">" + this.value + "</b> 元" +
                "</div>"
        })
        domId = domId ? domId : "#total-row"
        $(domId).html(html)
    }


    /**
     * 更多搜索项展开
     * @param tableO
     * @param fixHeight  展开后高度
     * @param prevHeight 展开前高度
     */

    utils.searchBarMore = function (tableO, fixHeight, prevHeight) {
        //更多搜索项
        var flag = 0
        var doc = document
        $(doc).on('click', ".searchBar-more-hook", function () {
            var moreBox = $(doc).find(".zl-searchBarMore")
            var page = $(doc).find(".zl-page")
            page.css("overflow-y", "hidden")
            var currentHeight = ""
            if (flag == 0) {
                moreBox.show()
                $(this).find("i").removeClass("mdi-caret-down").addClass("mdi-caret-up")
                flag++
                currentHeight = fixHeight || 'full-' + (35 + getTopHeight())
            } else {
                moreBox.hide()
                $(this).find("i").removeClass("mdi-caret-up").addClass("mdi-caret-down")
                flag--
                currentHeight = prevHeight || 'full-' + (35 + getTopHeight())
            }
            tableList[0].TableClass.resizeHeight = currentHeight
            tableList[0].resize()
        });
    }
    /**
     * 复制到剪切板
     * @param value {string} 剪切内容
     */
    utils.copyToClipboard = function (value) {
        var copyContainer = $("#copyContainer")
        if (!copyContainer.length) {
            var copyContainerHTML = '<input type="text" id="copyContainer" style="opacity: 0;position: absolute;left:-10000px">'
            $("body").append(copyContainerHTML)
            copyContainer = $("#copyContainer")
        }
        copyContainer.val(value)
        copyContainer.focus();
        copyContainer.select();
        try {
            if (document.execCommand('copy', false, null)) {
                utils.zlmsg.success('已复制到剪贴板');
            } else {
                utils.zlmsg.success('您的浏览器不支持一键复制');
            }
        } catch (err) {
            utils.zlmsg.success('您的浏览器不支持一键复制');

        }
    }

    /**
     * 显示轨迹
     * @param el {object} 订单内容
     */
    utils.showTrack = function (el) {
        if (!el) {
            parent.zlmsg.msg('请选择一个运单查看轨迹');
            return;
        }
        // if(el.locateType != 1 && el.locateType != 2){
        //     parent.zlmsg.msg("GPS和基站定位方式才有轨迹信息！");
        //     return;
        // }
        localStorage.locateStatus = el.locateStatus
        parent.zlmsg.open({
            type: 2,
            title: '运单（' + el.waybillCode + '）轨迹',
            content: "/go.do?path=test/trackMap&id=" + el.id,
            area: ['800px', '600px']
        })
    }

//选择渲染日期选择
    utils.dateRange = function (laydate, begin, end, config) {
        begin = begin ? begin : "beginTime"
        end = end ? end : "endTime"
        var beginCon = $("#" + begin)
        var endCon = $("#" + end)
        var options = {
            elem: '#dateRange'
            , range: true
            , done: function (value) {
                if (value) {
                    var startDate = value.split(" - ")[0]
                    var endDate = value.split(" - ")[1]
                    //是否携带HMS
                    if (config && config.withHMS) {
                        beginCon.val(startDate + ' 00:00:00')
                        endCon.val(endDate + " 23:59:59")
                    } else {
                        beginCon.val(startDate)
                        endCon.val(endDate)
                    }
                } else {
                    beginCon.val('')
                    endCon.val('')
                }
                config && config.selected && config.selected()
            }
        }
        var _options = {}
        if (config) _options = $.extend(true, {}, options, config)
        else _options = options
        laydate.render(_options);
    }

    /**
     *导出方法
     * @param options {object} {url:xxx;data:obj}
     */
    utils.downloadFile = function (options) {
        var config = $.extend(true, {method: 'post'}, options);
        var $form = $('<form method="' + config.method + '" style="display: none;" />');
        $form.attr('action', config.url);
        for (var key in config.data) {
            $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
        }
        $(document.body).append($form);
        $form[0].submit();
        $form.remove();
    };
    /**
     * 获取上传文件key值
     * @param fileUrl
     * @returns {string}
     */
    utils.getUpFileKey = function (fileUrl) {
        var key = "195708243";
        if (fileUrl.indexOf("managefile.56zly.com") != -1) {
            key = "195760305";
        } else if (fileUrl.indexOf("wxfile.56zly.com") != -1) {
            key = "195707126";
        }
        return key
    }

//加载状态
    utils.loading = function (layer, content) {
        layer = layer ? layer : window.layer
        window.loading = layer.msg(content ? content : "正在加载...", {icon: 16, time: 0, shade: [0.3, '#fff']})
        return window.loading
    }
//解析双重string
    utils.resStringParse = function (string) {
        return JSON.parse(JSON.parse(string))
    }

    utils.zlmsg = {};

    utils.zlmsg.msg = function (content) {
        return layer.msg(content)
    };
    utils.zlmsg.tips = function (content, dom, config) {
        var params = config ? $.extend({}, {
            tips: [3, "#4285f4"]
        }, config) : {
            tips: [3, "#4285f4"]
        }
        return layer.tips(content, dom, params)
    }
    utils.zlmsg.alert = function (content, func) {
        return layer.alert(content, func)
    };
    utils.zlmsg.confirm = function (content, func,fail) {
        return layer.confirm(content, func,fail)
    };
    utils.zlmsg.progress = function (content, config) {
        content = content ? content : "正在加载...";
        var params = {icon: 16, time: 0, shade: [0.5, '#fff']}
        $.extend(params, config || {})
        return layer.msg(content, params)
    };
    utils.zlmsg.success = function (content) {
        content = content ? content : "操作成功";
        return layer.msg(content, {icon: 1})
    };
    utils.zlmsg.info = function (content) {
        content = content ? content : "提示";
        return layer.msg(content, {icon: 7})
    };
    utils.zlmsg.fail = function (content) {
        content = content ? content : "发生错误";
        return layer.msg(content, {icon: 5})
    };
    utils.zlmsg.dangerTips = function (msg, dom) {
        utils.zlmsg.tips(msg, $(dom), {
            tips: [2, "#4285f4"]
        })
    }
    utils.zlmsg.loading = function (param, theme) {
        var shadow = {
            shade: [.3, "#000"]
        }
        $.extend(true, shadow, param || {})
        return layer.load(theme || 1, shadow)
    };
    utils.zlmsg.open = function (param) {
        var defaultParam = {
            shade: [.5, "#fff"],
            scrollbar: false,
            move: false
        }
        $.extend(defaultParam, param || {})
        return layer.open(defaultParam)
    };


//新增弹框

    utils.fullDialog = function (config) {
        var options = {
            type: 2,
            title: false,
            closeBtn: 0, //不显示关闭按钮
            shade: [0],
            scrollbar: false,
            area: ["100%", "100%"],
            content: "",
            success: function () {
                $(".layui-layer.layui-layer-iframe").css("overflow", "hidden")   //最大化后可能会出现滚动条bug

            }
        }
        options = $.extend(true, {}, options, config)
        return layer.open(options)
    }

//返回警告弹框
    utils.goBackConfirm = function (confirmText) {
        $(".go-back-hook").click(function () {
            confirmText = confirmText ? confirmText : "直接返回将不会保存当前数据,确定?"
            layer.confirm(confirmText, function () {
                parent.layer.closeAll()
            })
        })
    }
//返回
    utils.goBack = function () {
        $(".go-back-hook").click(function () {
            parent.layer.closeAll()
        })
    }

//label-hover 显示信息
    utils.showLabelHover = function () {
        $(document).on("mouseenter", ".label-hover", function () {
            var content = decodeURIComponent($(this).data("tips"))
            content && utils.zlmsg.tips(content, this, {
                tips: [2, "#4285f4"]
            })
        })
    }

    /**
     * 生成操作按钮
     * @param options
     * @returns {string}
     */
    utils.makBtns = function (options) {

        var menuId = this.getQueryString("menu")
        var operation = JSON.parse(localStorage.user)['operation']
        var current = []
        $.each(operation, function () {
            if (this.moduleId == menuId) {

                current.push(this)

            }
        })
        var html = ""
        var currentExceptHidden = []
        for (var i = 0; i < current.length; i++) {
            var el = current[i]
            //如果是摘选模式
            if (options && options.showList) {
                $.each(options.hideList, function () {
                    if (el.operation == this || el.id == this) currentExceptHidden.push(el)
                })
            } else {
                var showFlag = 1
                if (options && options.hideList) {
                    $.each(options.hideList, function () {
                        if (el.operation == this || el.id == this) showFlag = 0
                    })
                }
                if (showFlag) currentExceptHidden.push(el)
            }
        }
        for (var i = 0; i < currentExceptHidden.length; i++) {
            var el = currentExceptHidden[i]
            el.color = i == 0 ? "primary" : "default"
            html += "<button class=\"btn btn-" + el.color + " btn-handler\" data-url='" + el.operationUrl + "' >" + el.operation + "</button>"
        }
        //如果需要多项合计
        if (options && options.total) {
            html += " <div class=\"btn\">\n" +
                "  已选择:\n" +
                " <b class=\"text-danger table-checked-num-hook\">0</b> 项\n" +
                " </div>\n" +
                " <div class=\"btn\">\n" +
                " 合计:\n" +
                " <b class=\"text-success table-total-hook\">0</b> " + options.totalUnit || "元" + "\n" +
                " </div>"
        }
        //如果需要自定义合计
        if (options && options.totalCustom) {
            html += options.totalCustom
        }

        if (!html) return ""
        return "<div><div class=\"btn-group\" role=\"group\">" + html + "</div></div>"

    }

    /**
     * 是否有导出按钮的权限
     * @returns {boolean}
     */
    utils.hasExportAuth = function () {
        var btnsHTML = utils.makBtns()
        if (btnsHTML.indexOf("导出") > -1) {
            return true
        } else {
            return false
        }
    }
    /**
     * 生成导出按钮
     */
    utils.makExportBtn = function (options) {
        //debugger
        var html = ""
        if (utils.getQueryString("export")) {
            html += "<div class=\"btn-group\" role=\"group\">" + "<button class=\"btn btn-primary btn-handler\" >导出</button>" + "</div>"

        }
        //如果需要多项合计
        if (options && options.total) {
            html += " <div class=\"btn\">\n" +
                "  已选择:\n" +
                " <b class=\"text-danger table-checked-num-hook\">0</b> 项\n" +
                " </div>\n" +
                " <div class=\"btn\">\n" +
                " 合计:\n" +
                " <b class=\"text-success table-total-hook\">0</b> " + options.totalUnit || "元" + "\n" +
                " </div>"
        }
        //如果需要自定义合计
        if (options && options.totalCustom) {
            html += options.totalCustom
        }

        if (!html) return ""
        return "<div><div class=\"btn-group\" role=\"group\">" + html + "</div></div>"


    }

    /**
     * 获取模板
     * @param template 模板地址
     * @param success 成功回调
     * @param content {string} 加载提示
     */
    utils.getTemplate = function (template, success, content) {
        var loading = utils.zlmsg.progress(content)
        $.get(template + "?zly=" + "dev" + new Date().getTime(), function (html) {
            layer.close(loading)
            success(html)
        }, "html")
    }

//ajax相关方法
    utils.ajaxInit = function ($) {

        $.ajaxSetup({
            headers: {
                token: localStorage.token
            },
            cache: false,
            timeout: 60000 * 30,
            dataType: "json",
            complete: function (res) {
                if (res.status === 403) {
                    location.href = "/pages/common/error.html?errNum=403&errText=" + encodeURIComponent('您无此项操作权限')
                }
            },
            error: function (data) {
                console.log(data)
                window.loading ? layer.close(loading) : null
                utils.zlmsg.fail("程序异常，请联系管理员");
            }
        })


        // $(document).ajaxError(function (event, xhr, settings) {
        //     if (xhr.responseText == "sessionOut") {
        //         utils.zlmsg.progress('close');
        //         utils.zlmsg.alert('由于您长时间没有操作,请重新登录！', function () {
        //             parent.location.reload();
        //         });
        //     } else {
        //         try {
        //             utils.zlmsg.progress('close');
        //             if (XMLHttpRequest.responseText != undefined) {
        //                 utils.zlmsg.msg(XMLHttpRequest.responseText);
        //             } else {
        //                 utils.zlmsg.fail("操作异常，请联系管理员！");
        //             }
        //         } catch (e) {
        //             utils.zlmsg.alert(XMLHttpRequest.responseText);
        //         }
        //     }
        // });
    }

    /**
     * 处理ajax返回数据
     * @param res  response原始数据
     * @param success 成功回调
     * @param fail
     */

    utils.ajaxData = function (res, success, fail) {
        window.loading && layer.close(window.loading)
        if (res.code == 1) {
            success && success(res)
        } else if (res.code == 0) {
            if (fail) {
                fail(res)
            } else {
                utils.zlmsg.fail(res.msg || res.message)
            }
        } else if (res.code == 401) {
            top.layer.alert("登录信息已过期,请重新登录", function () {
                location.href = appUrl
            })
        } else {
            if (fail) {
                fail(res)
            } else {
                utils.zlmsg.fail(res.msg || res.message)
            }
        }
    }

    /**
     * 处理ajax完成返回数据(code为0也可以正常运行)
     * @param res  response原始数据
     * @param complete 完成回调
     * @param fail
     */

    utils.ajaxDataComplete = function (res, complete) {
        window.loading && layer.close(window.loading)
        if (res.code == 401) {
            top.layer.alert("登录信息已过期,请重新登录", function () {
                location.href = appUrl
            })
        } else {
            complete && complete(res)
        }
    }
    /**
     * 舍掉两位小数
     * @param float
     * @returns {string}
     */
    utils.subFloat2 = function (float) {
        return (parseInt(float * 100) / 100).toFixed(2);
    }


    /**
     * 查看轨迹
     * @param options layer参数
     * @param id waybillId
     */
    utils.viewPath = function (id, options) {
        options = $.extend(true, {}, options || {}, {
            type: 2,
            title: "查看轨迹",
            area: ["90%", "90%"],
            content: "/static/page/common/path.html?id=" + id
        })
        utils.zlmsg.open(options)
    }


//获取常用数据

    utils.getFromApi = {}
    /**
     * 查询银行总行的编码
     * @param $
     * @param callback
     */
    utils.getFromApi.getBank = function ($, callback) {
        window.loading = utils.zlmsg.progress()
        $.post(window.env.apiUrl + "/bankList/bankInfo").done(function (res) {
            utils.ajaxData(res, function () {
                callback && callback(res)
            })
        })
    }
    /**
     * 查询省级
     * @param $
     * @param callback
     */
    utils.getFromApi.province = function ($, callback) {
        window.loading = utils.zlmsg.progress()
        $.post(window.env.apiUrl + "/bankList/province").done(function (res) {
            utils.ajaxData(res, function () {
                callback && callback(res)
            })
        })
    }


    /**
     * 获取当前用户下的所有机构(分公司)
     * @param $
     * @param callback
     */
    utils.getFromApi.getAgencyListByUser = function ($, callback) {
        window.loading = utils.zlmsg.progress()
        $.post(window.env.apiUrl + "/common/getAgencyListByUser").done(function (res) {
            utils.ajaxData(res, function () {
                callback && callback(res)
            })
        })
    }
//用户编辑禁用下分公司
    utils.getFromApi.editAgencyListByUser = function ($, callback) {
        window.loading = utils.zlmsg.progress()
        $.post(window.env.apiUrl + "/authUser/getAgencyListByUser").done(function (res) {
            utils.ajaxData(res, function () {
                callback && callback(res)
            })
        })
    }
    /**
     * 获取获取当前用户下的所有部门
     * @param $
     * @param callback
     */
    utils.getFromApi.getPartmentList = function ($, callback, agencyId) {
        window.loading = utils.zlmsg.progress()
        $.post(window.env.apiUrl + "/authDepartment/list?agencyId=" + agencyId).done(function (res) {
            utils.ajaxData(res, function () {
                callback && callback(res)
            })
        })
    }
//获取省份
    utils.getFromApi.getprovince = function ($, callback) {
        window.loading = utils.zlmsg.progress()
        $.post(window.env.apiUrl + "/ptmBank/getName").done(function (res) {
            utils.ajaxData(res, function () {
                callback && callback(res)
            })
        })
    }
//获取城市
    utils.getFromApi.getcity = function ($, id, callback) {
        window.loading = utils.zlmsg.progress()
        $.post(window.env.apiUrl + "/ptmBank/getName?id=" + id).done(function (res) {
            utils.ajaxData(res, function () {
                callback && callback(res)
            })
        })
    }
    /**
     * 获取项目
     * @param $
     * @param callback
     */
    utils.getFromApi.getProjectList = function ($, callback) {
        window.loading = utils.zlmsg.progress()
        $.get(window.env.apiUrl + "/pdsApply/projectList").done(function (res) {
            utils.ajaxData(res, function () {
                callback && callback(res)
            })
        })
    }
    /**
     * 获取转包商户信息
     * @param $
     * @param callback
     */
    utils.getFromApi.findTenantry = function ($, callback) {
        window.loading = utils.zlmsg.progress()
        $.get(window.env.apiUrl + "/orgProjectSubcontract/getSubcontractTenantryList").done(function (res) {
            utils.ajaxData(res, function () {
                callback && callback(res)
            })
        })
    }
    /**
     * 当前用户下（传agencyId则是该用户下某机构）的所有项目
     * @param $
     * @param callback
     *
     */
    utils.getFromApi.getProjectListByUser = function ($, agencyId, callback) {
        window.loading = utils.zlmsg.progress()
        var data = agencyId ? {agencyId: agencyId} : null
        $.post(window.env.apiUrl + "/common/getProjectListByUser", data).done(function (res) {
            utils.ajaxData(res, function () {
                callback && callback(res)
            })
        })
    }
    /**
     * 当前用户下（传agencyId则是该用户下某机构）的所有项目_资金管理使用
     * @param $
     * @param params agencyId或对象
     * @param callback
     *
     */
    utils.getFromApi.getCapitalProjectListByUser = function ($, params, callback) {
        window.loading = utils.zlmsg.progress()
        var data = null
        if (typeof params != 'object') {
            data = {
                agencyId: params
            }
        } else {
            data = params
        }
        $.post(window.env.apiUrl + "/pdsRepay/listProject", data).done(function (res) {
            utils.ajaxData(res, function () {
                callback && callback(res)
            })
        })
    }
    /**
     * 获取资金流水项目
     * @param $
     * @param data   agencyId || {}
     * @param callback
     *
     */
    utils.getFromApi.getProjectListByAgency = function ($, data, callback) {
        window.loading = utils.zlmsg.progress()
        var sendData = null
        if (typeof data != "object") {
            sendData = {
                agencyId: data,
            }
        } else {
            sendData = data
        }
        $.get(window.env.apiUrl + "/funds/projectList", sendData).done(function (res) {
            utils.ajaxData(res, function () {
                callback && callback(res)
            })
        })
    }
    /**
     * 获取油卡交易流水/垫付流水项目
     * @param $
     * @param data   agencyId || {}
     * @param callback
     *
     */
    utils.getFromApi.getOilProjectList = function ($, data, callback) {
        window.loading = utils.zlmsg.progress()
        var sendData = null
        if (typeof data != "object") {
            sendData = {
                agencyId: data,
            }
        } else {
            sendData = data
        }
        $.get(window.env.apiUrl + "/funds/projectNeedList", sendData).done(function (res) {
            utils.ajaxData(res, function () {
                callback && callback(res)
            })
        })
    }
    /**
     * 获取数据字典信息
     * @param $
     * @param code 编码（HWLB:货物类别  HC:货车类别 HCCC:货车车长（单位：米）BZ :包装）
     * @param callback
     *
     */

    utils.getFromApi.getDictionaryInfo = function ($, code, callback) {
        window.loading = utils.zlmsg.progress()
        // 编码（HWLB:货物类别  HC:货车类别 HCCC:货车车长（单位：米）BZ :包装）
        $.get(window.env.apiUrl + "/common/getDictionaryInfo", {
            code: code
        }).done(function (res) {
            utils.ajaxData(res, function () {
                callback && callback(res)
            })
        })
    }

    /**
     * 验证银行卡,身份证,姓名三要素
     * @param success
     */
    utils.validateBankAccount = function (data, success) {
        window.loading = utils.zlmsg.progress("验证收款人信息...")
        $.ajax({
            url: window.env.apiUrl + "/orgDriver/checkBank",
            type: "post",
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify({
                cardNumber: data.receiptCard,
                idCard: data.receiptIdentity,
                realName: data.receiptName
            })
        }).done(function (res) {
            utils.ajaxDataComplete(res, function () {
                if (res.code == 0 || res.code == 3) {
                    utils.zlmsg.fail(res.msg || res.message)
                } else if (res.code == 1) {
                    success && success()
                } else if (res.code == 2) {
                    layer.confirm('户名:' + data.receiptName + '<br>银行卡:' + data.receiptCard + '<br>身份证:' + data.receiptIdentity + '<br>检测到户名与银行卡或身份证信息不匹配，会导致付款失败,是否继续？',
                        function () {
                            success && success()
                        }
                    )
                }
            })
        })
    }

//获取调度员列表
    utils.getFromApi.getDispatcher = function ($, callback) {
        window.loading = utils.zlmsg.progress()
        $.get(window.env.apiUrl + "/demandMain/getDispatcherName").done(function (res) {
            utils.ajaxData(res, function () {
                callback && callback(res)
            })
        })
    }

    /**
     * 根据银行卡号生成银行名称,联行号
     * @param doms
     */
    utils.getBankByCardNo = function (doms) {
        doms = doms ? doms : {}
        var cardNo = doms.cardNo || "[name=receiptCard]"
        var bankName = doms.bankName || "[name=receiptBankName]"
        var bankCode = doms.bankCode || "[name=receiptBankCode]"
        $(document).off("keyup", cardNo)
        $(document).on("keyup", cardNo, function () {
            this.value = this.value.replace(/\s/g, "")
            var $value = this.value
            if (this.value.length > 11 && this.value.length < 21) {
                clearTimeout(window.getBankByCardNoTime)
                window.getBankByCardNoTime = setTimeout(function () {
                    $.get(window.env.apiUrl + "/common/getBankByCardNo", {
                        bankCard: $.trim($value)
                    }).done(function (res) {
                        if (res.code == 1) {
                            $(bankName).val(res.data.bankName)
                            $(bankCode).val(res.data.bankUnionNumber)
                        } else {
                            $(bankName).val("")
                            $(bankCode).val("")
                        }
                    })
                }, 200)
            } else {
                $(bankName).val("")
                $(bankCode).val("")
            }
        })
    }
    /**
     * 根据银行卡号生成银行名称,联行号与手动选择切换
     * @param  targetContainer
     */


    utils.receiptDirectionSwitch = function (targetContainer) {
        targetContainer = targetContainer ? targetContainer + " " : ""
        var rd1 = $(".receiptDirection1-hook")
        var rd2 = $(".receiptDirection2-hook")
        var card = $(targetContainer + "[name=receiptCard]")
        var bName = $(targetContainer + "#receiptBankName")
        $("[name=receiptDirection]").on("change", function () {
            if (this.value == 1) {
                //对私
                rd1.show().find("input").prop("disabled", false)
                rd2.hide().find("input").val("").prop("disabled", true)
                utils.getBankByCardNo({
                    bankName: ".receiptDirection1-hook [name=receiptBankName]",
                    bankCode: ".receiptDirection1-hook [name=receiptBankCode]"
                })
                bName.off("click")
                card.trigger("keyup")
            } else {
                //对公
                rd2.show().find("input").prop("disabled", false)
                rd1.hide().find("input").val("").prop("disabled", true)
                card.off("keyup")
                bName.off("click")
                bName.on("click", function () {
                    window.$bankSelect = utils.zlmsg.open({
                        type: 2,
                        title: "选择开户银行",
                        content: "/static/page/bank_select/bank_list.html?mode=select",
                        area: ["80%", "80%"]
                    })
                })
            }
        })


        //设置银行名称和联行号
        window.setBankValue = function (data) {
            rd2.find("[name=receiptBankName]").val(data.branchName)
            rd2.find("[name=receiptBankCode]").val(data.branchCode)
            layer.close(window.$bankSelect)
        }
    }
    //随行付
    utils.finance = function (targetContainer) {
        targetContainer = targetContainer ? targetContainer + " " : ""
        var card = $(targetContainer + "[name=receiptCard]")
        var bName = $(targetContainer + "#receiptBankName")
        $("[name=receiptDirection]").on("change", function () {
            if (this.value == 1) {
                //对私
                utils.getBankByCardNo({
                    bankName: ".receiptDirection1-hook [name=receiptBankName]",
                    bankCode: ".receiptDirection1-hook [name=receiptBankCode]"
                })

            } else {
            }
        })
        card.off("keyup")
        bName.off("click")
        bName.on("click", function () {
            window.$bankSelect = utils.zlmsg.open({
                type: 2,
                title: "选择开户银行",
                content: "/static/page/finance/bank_list.html?mode=select",
                area: ["80%", "80%"]
            })
        })

        //设置银行名称和联行号
        window.setBankValue = function (data) {
            $("[name=receiptBankName]").val(data.branchName)
            $("[name=receiptBankCode]").val(data.branchCode)
            layer.close(window.$bankSelect)
        }
    }


    //获取银行卡的联行名称和号码
    utils.getBankByCardNoSync =  function (bankCard) {
        var dtd = $.Deferred()
        $.get(window.env.apiUrl + "/common/getBankByCardNo", {
            bankCard: $.trim(bankCard)
        }).done(function (res) {
            if (res.code == 1) {
                dtd.resolve(res.data)
            } else {
                dtd.reject(res)
            }
        })
        return dtd.promise()
    },

    /**
     * 附件删除
     */
    utils.fileDel = function (id, fileCategory) {
        var dtd = $.Deferred()
        utils.zlmsg.confirm("确认删除此附件?", function () {
            window.loading = utils.zlmsg.progress()
            $.post(window.env.apiUrl + "/common/deleteFile", {
                id: id,
                fileCategory: fileCategory
            }, function (res) {
                utils.ajaxData(res, function () {
                    dtd.resolve(res.data)
                }, function () {
                    dtd.reject(res.data)
                })
            })
        })
        return dtd.promise()
    }
    /**
     * 初始化图片查看器
     * @param Viewer
     * @param callback
     */
    utils.viewInit = function (Viewer, dom, callback) {
        if (window.viewer) window.viewer.destroy()
        dom = dom ? dom : "#file"
        window.viewer = new Viewer($(dom)[0], {
            filter: function (image) {
                return $(image).attr("src") != "/src/image/none.png";
            }
        })
        callback && callback()
    }

    /**
     * iframe内容区域高度限制
     * @param options
     */
    utils.limitIframeHeight = function (options) {
//限制内容区高度
        resizeList()

        function resizeList() {
            var listContainer = $(".project-list")
            var tabPane = $(".tab-pane")
            var wHeight = $(window).height()
            listContainer.height(wHeight - 55 - ($(".zl-page-top").height() || 0) - ($(".tab-container").height() || 0) - ($(".zl-table-search").height() || 0) + 'px')
            tabPane.height(wHeight - 35 - ($(".zl-page-top").height() || 0) - ($(".tab-container").height() || 0) + 'px')
        }

        window.onresize = function () {
            resizeList()
        }
    }
    /**
     * 解析运单类型
     * @param waybillCode
     * @returns {string}
     */
    utils.getWaybillType = function (waybillCode) {
        if (waybillCode.indexOf("T") > -1) {
            return "公路"
        } else if (waybillCode.indexOf("S") > -1) {
            return "水路"
        } else if (waybillCode.indexOf("R") > -1) {
            return "铁路"
        }
    }


//提供全局的一些匹配map
    utils._map = {}
//项目类型
    utils._map.projectType = {
        "1": "自营",
        "2": "无车承运"
    }
//图片压缩参数
    utils._map.imageViewer = "imageView2/0/w/200/h/200/format/jpg/interlace/1/q/75"
//费用类型
    utils._map.feeType = {
        "1": "装卸费",
        "2": "加固费",
        "3": "翻箱打托费",
        "4": "放空费",
        "5": "提货费",
        "6": "货损货差",
        "99": "其他"
    }
//审批类型
    utils._map.auditStatus = {
        "0": "待审批",
        "1": "审批驳回",
        "2": "审批不通过",
        "3": "审批通过",
    }
//证件类型
// 收款人证件类型（1.身份证 2.营业执照 3.组织机构代码证 4.护照 5.户口本 6.军官证 7.士兵证 8.回乡证 9.外国护照 10.其他）
    utils._map.identityType = {
        "1": "身份证",
        "2": "营业执照",
        "3": "组织机构代码证",
        "4": "护照",
        "5": "户口本",
        "6": "军官证",
        "7": "士兵证",
        "8": "回乡证",
        "9": "外国护照",
        "10": "其他"
    }


//资金类型
    utils._map.capitalResource = {
        1: "自有资金",
        2: "资金垫付"
    }
//获取基本信息
    utils._map.getInfo = function () {
        var BZ = JSON.parse(localStorage.BZ)
        var HC = JSON.parse(localStorage.HC)
        var HCCC = JSON.parse(localStorage.HCCC)
        var HWLB = JSON.parse(localStorage.HWLB)
        return {
            BZ: BZ,
            HC: HC,  //车型
            HCCC: HCCC,
            HWLB: HWLB,
        }
    }


//车辆数据清洗

    utils.truckDataClean = function (data) {
        if (data.truckBox == "0") {
            data.truckBox = ""
        }
        if (data.truckLength == -0.001) {
            data.truckLength = ""
        }
        if (data.truckTonnage == -0.001) {
            data.truckTonnage = ""
        }
        return data
    }


//地图轨迹生成方法
    utils.makTruckPath = function (map, pathSimplifierIns, isCltx, inputData) {
        var res = JSON.parse(JSON.stringify(inputData))
        var path = res.$data.map[0].path
        pathSimplifierIns.setData([{
            name: "车辆轨迹",
            path: path
        }]);

        function onload() {
            pathSimplifierIns.renderLater();
        }

        var startPoint = [Number(res.loadingLongitude), Number(res.loadingLatitude)]
        var endPoint = [Number(res.unloadLongitude), Number(res.unloadLatitude)]

        var cityMarkerStart = new AMap.Marker({ //添加自定义点标记
            map: map,
            position: startPoint, //基点位置
            offset: new AMap.Pixel(0, 0), //相对于基点的偏移位置
            content: '<div class="waybill-path-dot-pot"></div><div class="waybill-path-dot">\n' +
                '                                        <div class="waybill-path-dot-flag">起</div> \n' +
                '                                        <div class="waybill-path-dot-content">' + res.loadingCity + '</div> \n' +
                '                                        </div>'
        });
        var cityMarkerEnd = new AMap.Marker({ //添加自定义点标记
            map: map,
            position: endPoint, //基点位置
            offset: new AMap.Pixel(0, 0), //相对于基点的偏移位置
            content: '<div class="waybill-path-dot-pot end-flag"></div><div class="waybill-path-dot">\n' +
                '                                        <div class="waybill-path-dot-flag end-flag">终</div> \n' +
                '                                        <div class="waybill-path-dot-content">' + res.unloadCity + '</div> \n' +
                '                                        </div>'   //自定义点标记覆盖物内容
        });

        map.add(cityMarkerStart);
        map.add(cityMarkerEnd);

        var markerStart = new AMap.Marker({ //添加自定义点标记
            map: map,
            position: path[0], //基点位置
            offset: new AMap.Pixel(0, 0), //相对于基点的偏移位置
            content: '<div style="opacity: 0">起点</div>'
        });
        var markerEnd = new AMap.Marker({ //添加自定义点标记
            map: map,
            position: path[path.length-1], //基点位置
            offset: new AMap.Pixel(0, 0), //相对于基点的偏移位置
            content: '<div style="opacity: 0">终点</div>'   //自定义点标记覆盖物内容
        });

        map.add(markerStart);
        map.add(markerEnd);

        //如果是运输中 或者非车联商户 显示当前位置
        // if(!isCltx){
        //     try {
        //         var currentLocate =res.locateList[res.locateList.length-1]
        //         var firstLocate =res.locateList[0]
        //         var markerNow = new AMap.Marker({ //添加自定义点标记
        //             map: map,
        //             position: [Number(currentLocate.longitude),Number(currentLocate.latitude)], //基点位置
        //             offset: new AMap.Pixel(0, 0), //相对于基点的偏移位置
        //             icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        //         });
        //         var markerFirst = new AMap.Marker({ //添加自定义点标记
        //             map: map,
        //             position: [Number(firstLocate.longitude),Number(firstLocate.latitude)], //基点位置
        //             offset: new AMap.Pixel(0, 0), //相对于基点的偏移位置
        //             icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        //         });
        //         map.add(markerNow);
        //         map.add(markerFirst);
        //         var $tips = null
        //         markerNow.on('mouseover',function(){
        //             $tips = layer.tips(currentLocate.location + '<br>' + (currentLocate.createTime || currentLocate.time),markerNow.Ge.contentDom,{
        //                 tips: [1, '#333'],
        //                 time:90000
        //             })
        //         })
        //         markerFirst.on('mouseover',function(){
        //             $tips = layer.tips(firstLocate.location + '<br>' + (firstLocate.createTime || firstLocate.time),markerFirst.Ge.contentDom,{
        //                 tips: [1, '#333'],
        //                 time:90000
        //             })
        //         })
        //         markerNow.on('mouseout',function(){
        //             layer.close($tips)
        //         })
        //         markerFirst.on('mouseout',function(){
        //             layer.close($tips)
        //         })
        //     }catch(e){
        //
        //     }
        // }

        var navg = pathSimplifierIns.createPathNavigator(0, {
            loop: true,
            speed: res.$data.speed,
            pathNavigatorStyle: {
                width: 16,
                height: 32,
                content: PathSimplifier.Render.Canvas.getImageContent('/src/image/truck.png', onload, onerror),
                strokeStyle: null,
                fillStyle: null
            }
        });
        navg.start();
        map.setFitView()
    }

//防抖函数
    utils.debounce = function (func, delay) {
        var timeout = null
        return function () {
            clearTimeout(timeout)
            timeout = setTimeout(function () {
                func.apply(this, arguments)
            }, delay || 200)
        }
    }

    module.exports =  utils 

