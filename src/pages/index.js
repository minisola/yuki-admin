import { pageInit } from '@/common/init'
import '@/scss/style.scss'
import md5 from 'md5'
import './index.scss'

pageInit()

//防止页面被嵌套
if (window.top != window) {
  window.top.location = window.location
}
var account = localStorage.getItem('account')

$(function () {
  if (account) {
    $('#remember').attr('checked', true)
    $('#account').val(account)
  } else {
    $('#remember').attr('checked', false)
  }
  $('#loginForm').on('submit', function (e) {
    e.preventDefault()
    loginFun()
    return false
  })

  function showError(content) {
    layer.msg(content, { icon: 5 })
  }

  function loginFun() {
    var account = $('#account').val()
    var pwd = $('#pwd').val()
    // var flag = 1;
    if (account == '') {
      showError('用户名不能为空')
      return
    }
    if (pwd == '') {
      showError('密码不能为空')
      return
    }

    if (_u.validateReg.strongPwd.test(pwd)) {
      //如果是 满足要求的密码,传0
      localStorage.isSimple = 0
    } else {
      localStorage.isSimple = 1
    }
    window.loading = layer.msg('登录中...', { icon: 16, time: 0, shade: [0.3, '#000'] })
    $.ajax({
      type: 'POST',
      url: env.apiUrl + '/login',
      data: {
        account: account,
        pwd: md5(pwd),
      },
      success: function (res) {
        _u.ajaxData(res, function () {
          if ($('#remember').is(':checked')) {
            localStorage.setItem('account', account)
          } else {
            localStorage.setItem('account', '')
          }
          localStorage.setItem('token', res.data.token)
          localStorage.setItem('user', JSON.stringify(res.data))
          location.href = '/pages/main.html'
        })
      },
    })
  }

  //重置密码
  $('#resetPw').on('click', function () {
    window.resetPwDialog = layer.open({
      type: 1,
      shade: 0.3,
      area: ['320px', '330px'],
      title: false, //不显示标题
      content: $('#resetForm'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
      success: function () {
        window.newDialog = new ResetPw()
      },
      cancel: function () {
        newDialog._destroy()
      },
    })
  })
})

//重置密码类
var ResetPw = function () {
  this.userName = ''
  this.code = ''
  this.pw = ''

  this._init()
  //检查账号
  this.checkAccount = function () {
    this.userName = $.trim($('input[name=resetAccount]').val())
    if (this.userName.length === 0) {
      layer.msg('请输入用户名')
      return false
    } else {
      return true
    }
  }
  //检查验证码
  this.checkCode = function () {
    this.code = $.trim($('input[name=resetVcode]').val())
    if (this.code.length === 0) {
      layer.msg('请输入验证码')
      return false
    } else {
      return true
    }
  }
  //检查密码
  this.checkPw = function () {
    this.pw = $.trim($('input[name=resetPw]').val())
    var rePw = $.trim($('input[name=reResetPw]').val())
    if (!_u.validateReg.strongPwd.test(this.pw)) {
      layer.msg('密码格式不正确,请参考说明进行设置')
      return false
    }
    if (this.pw.length === 0) {
      layer.msg('请输入新密码')
      return false
    } else if (this.pw != rePw) {
      layer.msg('确认密码不符合,请检查重新输入')
      return false
    } else {
      return true
    }
  }
  //显示tips
  this.showTips = function (mobile) {
    $('.code-tips-hook').show().find('b').text(mobile)
  }
  //关闭tips
  this.hideTips = function () {
    $('.code-tips-hook').hide()
  }
  //显示loading
  this.showLoading = function (msg) {
    window.TEMP_LOADING = layer.msg(msg, {
      icon: 16,
      shade: 0.2,
      time: 99999,
    })
  }
  //关闭loading
  this.hideLoading = function () {
    layer.close(window.TEMP_LOADING)
  }
}

ResetPw.prototype._init = function () {
  var that = this
  $('.sendCode-hook').on('click', function () {
    if (that.checkAccount()) {
      that.showLoading('发送中...')
      $.ajax({
        url: env.apiUrl + '/getMessageCodeByUserName',
        type: 'POST',
        data: {
          userName: that.userName,
        },
        dataType: 'json',
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

  $('.reset-submit-hook').on('click', function () {
    if (that.checkAccount() && that.checkCode() && that.checkPw()) {
      that.showLoading('处理中...')
      $.ajax({
        url: env.apiUrl + '/resetPwd',
        type: 'POST',
        data: {
          userName: that.userName,
          password: md5(that.pw),
          code: that.code,
        },
        dataType: 'json',
      }).done(function (res) {
        setTimeout(function () {
          that.hideLoading()
          if (res.code == 1) {
            layer.closeAll()
            layer.msg('重置成功,请用新密码登录', { icon: 1 })
            $('#account').val(that.userName)
            that._destroy()
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
  $('.sendCode-hook').off('click')
  $('.reset-submit-hook').off('click')
  $('input[name=resetAccount]').val('')
  $('input[name=resetVcode]').val('')
  $('input[name=resetPw]').val('')
  $('input[name=reResetPw]').val('')
}
