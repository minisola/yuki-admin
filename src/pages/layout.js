import { pageInit } from "@/js/common/init";
import { hex_md5 } from "@/libs/md5/md5.js";
import Swiper from "@/libs/swiper/js/swiper.jquery.js";
import router from "@/js/common/router";
import "@/libs/bootstrap-3.3.7/js/bootstrap.min.js";

pageInit();
window.onload = function () {
  const doc = document;
  let miniTips;
  let initFirtPage = 0; //打开第一个页面

  //导航条
  const navSwiper = new Swiper(".swiper-container", {
    slidesPerView: "auto",
    nextButton: ".tags-scroll-right-btn",
    prevButton: ".tags-scroll-left-btn",
    slideClass: "tags-item",
    spaceBetween: 5,
    mousewheelControl: true,
  });

  /**
   * 新增导航标签
   * @param id
   * @param title
   * @param url
   */

  window.addNavTab = function (id, title, url) {
    let params = "";

    if (url.indexOf("?") > -1) {
      params = "&menu=" + id;
    } else {
      params = "?menu=" + id;
    }

    //如果是我要找车.途视宝则打开新页面
    if (id == 5 || id == 6 || id == 87) {
      window.open(url + params);
      return;
    }

    const $tab = $("#tab_" + id);
    if ($tab.length && id.toString().indexOf("custom") > -1) {
      _u.zlmsg.fail("已有运单正在编辑,请关闭或保存后再试");
      $tab.click();
      return;
    } else if ($tab.length) {
      $tab.click();
      return;
    }
    navSwiper.appendSlide([
      '<div class="tags-item layui-anim layui-anim-upbit"  id="tab_' +
        id +
        '" data-title="' +
        title +
        '" data-url="' +
        url +
        '" data-id="' +
        id +
        '"><span class="tag-circle"></span>' +
        $.trim(title) +
        ' <i title="关闭">×</i></div>',
    ]);
    if (id.toString().indexOf("custom") == -1) {
      url += params;
    }
    var frameHTML =
      '<iframe class="app-frame-hook" id="frame_' +
      id +
      '" data-id="' +
      id +
      '" data-title="' +
      title +
      '" src="' +
      url +
      '" frameborder="0"></iframe>';
    $(".app-frame").append(frameHTML);
    $("#tab_" + id).click();
  };

  /**
   * 删除导航标签
   * @param {Int} index
   * @param {Function} callback 回调
   *
   * */
  window.removeNavTab = function (index, callback) {
    var $p = $(".tags-item").eq(index);
    var $frame = $("iframe");
    if (!$p.hasClass("active")) {
      navSwiper.removeSlide(index);
      $frame.eq(index).remove();
      return;
    }

    if (!callback) {
      if ($p.next().length) {
        $p.next().click();
      } else {
        $p.prev().click();
      }
    } else {
      callback();
    }
    navSwiper.removeSlide(index);
    $frame.eq(index).remove();
  };
  /**
   * 删除导航标签byId
   * @param {Int} id
   *
   * */
  window.removeNavTabById = function (id) {
    var $p = $("#tab_" + id);
    var index = $("#tab_" + id).index();
    var $frame = $("iframe");
    if (!$p.hasClass("active")) {
      navSwiper.removeSlide(index);
      $frame.eq(index).remove();
      return;
    }
    navSwiper.removeSlide(index);
    $frame.eq(index).remove();
  };
  /**
   * 删除当前激活的导航标签
   * @param {Function} callback 回调
   */
  window.removeActiveNavTab = function (callback) {
    removeNavTab($(".tags-item.active").index(), callback);
  };

  //监听删除tabs
  $(doc).on("click", ".tags-item i", function () {
    removeNavTab($(this).parent().index());
  });

  // //监听顶栏tabs
  $(doc).on("click", ".tags-item", function () {
    var $this = $(this);
    navSwiper.slideTo($this.index() - 1);
    var id = $this.data("id");
    var title = $this.data("title");
    if ($this.hasClass("active")) return;
    $this.addClass("active").siblings().removeClass("active");
    $('iframe[data-id="' + id + '"]')
      .show()
      .siblings()
      .hide();
  });

  //账户相关方法
  let user = localStorage.getItem("user");
  if (!user) location.href = window.env.appUrl;
  user = JSON.parse(user);
  $(".user-name").text(user.authUser.userName);
  $(".tenantry-name").text(user.authUser.tenantryName);
  $(".app-logo").text(user.authUser.tenantryName);

  //菜单
  const menu = user.menu._menus;

  //监听菜单切换
  $(document).on("click", ".app-module", function () {
    var $this = $(this);
    $this.addClass("active").siblings().removeClass("active");
    moduleSwitch(this.id.split("module_")[1], $this.find("span").text());
  });

  //生成模块菜单
  const moduleMenu = $(".app-module-list");

  var moduleMenuHtml = "";
  $.each(menu, function () {
    moduleMenuHtml +=
      '<div id="module_' +
      this.menuid +
      '" class="app-module btn-group">\n' +
      "                    <span>" +
      this.menuname +
      "</span>\n" +
      "                </div>";
  });
  moduleMenu.html(moduleMenuHtml);
  moduleMenu.find(".app-module").eq(1).click();

  //切换模块菜单
  function moduleSwitch(id, name) {
    $(".app-sider-name").text(name);
    var cmenu = [];
    $.each(menu, function () {
      if (this.menuid == id) {
        cmenu = this.menus;
        return false;
      }
    });
    menuRender(cmenu);
  }

  //监听侧栏菜单按钮
  $(doc).on("click", ".sider-item.sider-child .menu-item", function () {
    var id = $(this).data("id");
    var path = $(this).data("path");
    var title = $(this).text();
    addNavTab(id, title, path);
  });
  //监听侧栏按钮触摸事件
  $(doc).on("mouseenter", ".zl-mini .sider-item", function () {
    var name = $(this).find("span").text();
    miniTips = layer.tips(name, this);
  });
  $(doc).on("mouseleave", ".zl-mini .sider-item", function () {
    layer.close(miniTips);
  });

  //监听菜单栏切换按钮
  $(doc).on("click", ".app-menu-switch", function () {
    var $app = $(".zl-app");
    if ($app.hasClass("zl-mini")) {
      $app.removeClass("zl-mini");
      localStorage.menu_mode = "lg";
      $(".sider-dropmenu,.sider-dropmenu-box").addClass("active");
    } else {
      $app.addClass("zl-mini");
      localStorage.menu_mode = "xs";
      $(".sider-dropmenu,.sider-dropmenu-box").removeClass("active");
    }
  });

  //监听开启关闭用户下拉菜单
  $(doc).on("mouseover", ".user-info-group", function () {
    var menuInfo = $(".user-info-group");
    menuInfo.addClass("open");
  });
  $(doc).on("mouseleave", ".user-info-group", function () {
    var menuInfo = $(".user-info-group");
    menuInfo.removeClass("open");
  });
  // //监听开启关闭标签操作菜单
  $(doc).on("mouseover", ".tags-controll-group", function () {
    var menuInfo = $(".tags-controll-group");
    menuInfo.addClass("open");
  });
  $(doc).on("mouseleave", ".tags-controll-group", function () {
    var menuInfo = $(".tags-controll-group");
    menuInfo.removeClass("open");
  });
  //监听标签操作
  //刷新
  var $appFrame = $(".app-frame");
  $(doc).on("click", ".tags-controll-refresh", function () {
    $appFrame.find("iframe:visible")[0].contentWindow.location.reload();
  });
  //关闭其他标签

  $(doc).on("click", ".tags-controll-closeOthers", function () {
    var removeList = [];
    $(".tags-item").each(function () {
      var $this = $(this);
      if (!$this.hasClass("active") && !$this.hasClass("tags-item-fixed")) {
        removeList.push($this.index());
      }
    });
    navSwiper.removeSlide(removeList);
    $appFrame
      .find("iframe:visible")
      .siblings(":not('.app-frame-fixed')")
      .remove();
  });

  //关闭所有
  $(doc).on("click", ".tags-controll-closeAll", function () {
    var removeList = [];
    $(".tags-item").each(function () {
      var $this = $(this);
      if (!$this.hasClass("tags-item-fixed")) {
        removeList.push($this.index());
      }
    });
    navSwiper.removeSlide(removeList);
    $appFrame.find(".app-frame-fixed").siblings().remove();
    $(".tags-item").eq(0).click();
  });

  //菜单响应事件 一级菜单无二级
  $(doc).on("click", ".sider-child", function () {
    layer.close(miniTips);
    var $this = $(this);
    if ($this.hasClass("active")) return;
    var $sider = $this.parents(".sider-menu");
    $sider.find(".sider-child.active").removeClass("active");
    $this.addClass("active").siblings().removeClass("active");
    $this.parents(".sider-dropmenu").siblings().removeClass("active");
    var path = $this.find("a").data("path");
  });
  //一级菜单最小化点击
  $(doc).on("click", ".sider-dropmenu", function () {
    layer.close(miniTips);
    $(".zl-app").removeClass("zl-mini");
    $(".sider-dropmenu-box").addClass("active");
  });

  // //修改密码
  window.cflag = 1;
  $(".changePw-hook").on("click", function () {
    layer.open({
      type: 1,
      title: "修改密码",
      area: "500px",
      closeBtn: window.cflag,
      offset: "100px",
      content: $(".changePw-dialog-hook"),
    });

    layui.use(["form"], function () {
      var form = layui.form;
      //自定义验证规则
      form.verify({
        reInput: function (value) {
          if (value != $("input[name=newpwd]").val()) {
            return "重复密码不正确";
          }
        },
        sameInput: function (value) {
          if (value == $("input[name=oldpwd]").val()) {
            return "新密码不能与旧密码相同";
          }
        },
        pass: [_u.validateReg.strongPwd, "密码格式不正确,请参考说明进行设置"],
      });

      form.on("submit(changePwSubmit)", function (data) {
        var field = data.field;
        $.post(
          window.env.apiUrl + "/changePwd",
          {
            oldPwd: hex_md5(field.oldpwd),
            newPwd: hex_md5(field.renewpwd),
          },
          function (result) {
            if (result.code == 1) {
              _u.zlmsg.alert("密码修改成功,请重新登录!", function () {
                location.href = window.event.appUrl;
              });
            } else {
              _u.zlmsg.fail(result.msg);
            }
          },
          "json"
        );
        return false;
      });
    });
  });
  //退出

  $(".logout-hook").click(function () {
    _u.zlmsg.confirm("确认要退出吗?", function () {
      $.post(window.env.apiUrl + "/logout").done(function (res) {
        _u.ajaxData(res, function () {
          localStorage.user = "";
          localStorage.menu = "";
          localStorage.token = "";
          location.href = window.env.appUrl;
        });
      });
    });
  });

  //当密码是初始密码时修改密码
  if (user.pwdFlag == 1) {
    $(".tipsTitle").show();
    $("#pwTipsContent").html("您的密码为初始密码,请及时修改密码").show();
    window.cflag = 0;
    $(".changePw-hook").click();
  } else if (1 == localStorage.isSimple) {
    //如果是简单的密码
    window.cflag = 0;
    $(".tipsTitle").show();
    $("#pwTipsContent")
      .html("您的密码为简单密码<br>请及时修改为更安全的密码组合")
      .show();
    $(".changePw-hook").click();
    $(".layui-layer-setwin").remove();
  } else {
    $("#pwTipsContent").hide();
  }

  /*
   * @description 左侧菜单渲染
   * @param {object} menu
   */
  function menuRender(menu) {
    var html = "<ul>";
    var appendHTML = "";
    //插入路由和图标数据
    $.each(menu, function (i, el) {
      $.each(router, function () {
        if (el.menuid == this.id) {
          el = $.extend(el, this);
        }
      });
      if (el.menus && el.menus.length) {
        $.each(el.menus, function (i, els) {
          $.each(router, function () {
            if (els.menuid == this.id) {
              els = $.extend(els, this);
            }
          });
        });
      }
    });
    //生成菜单
    $.each(menu, function (i, el) {
      if (this.menus && this.menus.length) {
        appendHTML +=
          '<li class="sider-item sider-dropmenu">\n' +
          '<div class="menu-item"><i class="icon"><svg class="icon" aria-hidden="true">\n' +
          '    <use xlink:href="#' +
          this.icon +
          '"></use>\n' +
          "</svg></i>\n" +
          "<span><b>" +
          this.name +
          "</b></span></div></li>";
        appendHTML += ' <li class="sider-dropmenu-box active"><ul>';
        $.each(this.menus, function (i, el) {
          appendHTML +=
            '<li class="sider-item sider-child">' +
            '<div class="menu-item" id="sider_btn_' +
            this.id +
            '" ' +
            'data-id="' +
            this.id +
            '" data-path="' +
            this.url +
            '">' +
            "<span>" +
            this.name +
            "</span></div></li>";
        });
        appendHTML += " </ul></li>";
      }
    });
    html = html + appendHTML + "</ul>";
    $(".sider-menu")
      .removeClass("layui-anim-upbit")
      .hide(200, function () {
        $(this).addClass("layui-anim-upbit").html(html).show();
        openFirtPage();
        //读取缓存是否是mini模式
        if (localStorage.menu_mode == "xs" && !$(".zl-mini").length) {
          $(".zl-app").addClass("zl-mini");
        }
        if (localStorage.menu_mode == "xs") {
          $(".sider-dropmenu,.sider-dropmenu-box").removeClass("active");
        }
      });
  }

  //初始化后打开的第一个页面
  function openFirtPage() {
    if (initFirtPage) return;
    initFirtPage = 1;
    if ($("#sider_btn_13").length) {
      setTimeout(function () {
        $("#sider_btn_13").trigger("click");
      }, 0);
    } else {
      $(".sider-item.sider-child a").eq(0).trigger("click");
    }
  }

  //获取系统常用参数
  //货物类别
  _u.getFromApi.getDictionaryInfo($, "HWLB", function (res) {
    var data = {};
    $.each(res.data, function () {
      data[this.id] = this.valueName;
    });
    localStorage.HWLB = JSON.stringify(data);
  });
  //货车类别
  _u.getFromApi.getDictionaryInfo($, "HC", function (res) {
    var data = {};
    $.each(res.data, function () {
      data[this.id] = this.valueName;
    });
    localStorage.HC = JSON.stringify(data);
  });
  //火车车长
  _u.getFromApi.getDictionaryInfo($, "HCCC", function (res) {
    var data = [];
    $.each(res.data, function () {
      data.push(Number(this.valueName) * 1000);
    });
    localStorage.HCCC = JSON.stringify(data);
  });
  _u.getFromApi.getDictionaryInfo($, "BZ", function (res) {
    var data = {};
    $.each(res.data, function () {
      data[this.id] = this.valueName;
    });
    localStorage.BZ = JSON.stringify(data);
  });
};
