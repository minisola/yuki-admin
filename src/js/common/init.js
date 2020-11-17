// var apiUrl = "", //配置全局api请求域名
//     appUrl = "/index.html",

import accounting from '@/libs/account/account.min.js'

import '@/libs/layui/layui'
import '@/libs/select2/js/select2.full'
import '@/libs/FlexDate/dist/js/flexDate'
import '@/libs/flatpickr/flatpickr'

// import '@/less/style.less'
import '@/libs/flexdate/dist/css/flexDate.css'
import '@/libs/flatpickr/flatpickr.css'

//初始化layui配置
layui.config({
  dir: '/libs/layui/',
})

export const pageInit = () => {
  console.log('page init start')
  const nodeEnv = process.env.NODE_ENV
  console.log(nodeEnv)
  const envMap = {
    appUrl: {
      development: '/',
      production: '/',
    },
    apiUrl: {
      development: '/api',
      production: '/',
    },
    jsgylApiUrl: {
      development: 'http://192.168.20.103:1988',
      production: 'https://jsgyl.56zly.com',
    },
  }
  window.env = {
    appUrl: envMap.appUrl[nodeEnv],
    apiUrl: envMap.apiUrl[nodeEnv],
    jsgylApiUrl: envMap.jsgylApiUrl[nodeEnv],
  }

  // window.noneImg = "/src/image/none.png"  //NoImg placeholder
  if (
    (navigator.appName == 'Microsoft Internet Explorer' &&
      navigator.appVersion.split(';')[1].replace(/[ ]/g, '') == 'MSIE6.0') ||
    (navigator.appName == 'Microsoft Internet Explorer' &&
      navigator.appVersion.split(';')[1].replace(/[ ]/g, '') == 'MSIE7.0') ||
    (navigator.appName == 'Microsoft Internet Explorer' &&
      navigator.appVersion.split(';')[1].replace(/[ ]/g, '') == 'MSIE8.0') ||
    (navigator.appName == 'Microsoft Internet Explorer' &&
      navigator.appVersion.split(';')[1].replace(/[ ]/g, '') == 'MSIE9.0')
  ) {
    alert('您的浏览器版本过低，请下载IE9以上版本或使用其他浏览器')
    // window.close();
  }

  //如果未登录不允许访问内部页面
  var excludePath = ['/pages/register/register_itms.html']

  if (!localStorage.token || !localStorage.user) {
    var excludeFlag = false
    $.each(excludePath, function () {
      if (location.href.indexOf(this) > -1) excludeFlag = true
    })
    if (!excludeFlag && location.href.indexOf('/pages/') > -1) {
      location.href = '/pages/common/error.html?errNum=401&errText=' + encodeURIComponent('您尚未登录')
    }
  }
  //将工具类提升到全局
  if (accounting) window.accounting = accounting
  //ajax初始化
  $.ajaxSetup({
    headers: {
      token: localStorage.token,
    },
    cache: false,
    timeout: 60000 * 30,
    dataType: 'json',
    complete: function (res) {
      if (res.status === 403) {
        location.href = '/pages/common/error.html?errNum=403&errText=' + encodeURIComponent('您无此项操作权限')
      }
    },
    error: function (data) {
      console.log(data)
      window.loading ? layer.close(loading) : null
      _u.zlmsg.fail('程序异常，请联系管理员')
    },
  })

  console.log('page init end')
}
