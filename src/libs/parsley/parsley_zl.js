// Validation errors messages for Parsley
// Load this after Parsley

Parsley.addMessages('zh-cn', {
  defaultMessage: "不正确的值",
  type: {
    email:        "请输入一个有效的电子邮箱地址",
    url:          "请输入一个有效的链接",
    number:       "请输入正确的数字",
    integer:      "请输入正确的整数",
    digits:       "请输入正确的号码",
    alphanum:     "请输入字母或数字"
  },
    contract:"请输入英文或数字",
    idcard:"号码格式不正确",
    plate:"车牌号格式不正确",
    telephone:"请输入正确的手机号码",
    contact:"请输入正确的固话或手机号码",
    rate:"请输入一个0-1之间的数字",
    price:"请输入正确的金额",
    pricethanzero:"请输入大于零的金额",
    quantity:"请输入大于等于0的数字",
    integer:"请输入大于等于0的整数",
    integerthanzero:"请输入大于零的正整数",
  dateiso: "请输入正确格式的日期 (YYYY-MM-DD).",
  notblank:       "请输入值",
  required:       "必填项",
  pattern:        "格式不正确",
  min:            "输入值请大于或等于 %s",
  max:            "输入值请小于或等于 %s",
  range:          "输入值应该在 %s 到 %s 之间",
  minlength:      "请输入至少 %s 个字符",
  maxlength:      "请输入至多 %s 个字符",
  length:         "字符长度应该在 %s 到 %s 之间",
  mincheck:       "请至少选择 %s 个选项",
  maxcheck:       "请选择不超过 %s 个选项",
  check:          "请选择 %s 到 %s 个选项",
  equalto:        "输入值不同"
});

Parsley.setLocale('zh-cn');

Parsley
    .addValidator('contract', {
        validateString: function(value) {
            return /^[A-Za-z0-9]+$/.test(value);
        },
    });

Parsley
    .addValidator('telephone', {
        validateNumber: function(value) {
            return /^1{1}[0-9]{10}$/.test(value);
        },
    });
Parsley
    .addValidator('integer', {
        validateString: function(value) {
            return /^[0-9]\d*$/.test(value);
        },
    });
Parsley
    .addValidator('integerthanzero', {
        validateString: function(value) {
            return /^[1-9]\d*$/.test(value);
        },
    });
//车牌号
Parsley
    .addValidator('plate', {
        validateString: function(value) {
            return /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/.test(value);
        },
    });
//驾驶证/身份证
Parsley
    .addValidator('idcard', {
        validateString: function(value) {
            return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
        },
    });
//费用信息

Parsley
    .addValidator('quantity', {
        validateString: function(value) {
            return Number(value)>=0
        },
    });

Parsley
    .addValidator('price', {
        validateString: function(value) {
            return /^([1-9]\d*|0)(\.\d{1,2})?$/.test(value);
        },
    });
Parsley
    .addValidator('pricethanzero', {
        validateString: function(value) {
            return (/^([1-9]\d*|0)(\.\d{1,2})?$/.test(value) &&  (value > 0))
        },
    });

//验证手机号或固话
Parsley
    .addValidator('contact', {
        validateString: function(value) {
            return /^1{1}[0-9]{10}$/.test(value) || /^0\d{2,3}-?\d{7,8}$/.test(value);
        },
    });

//验证商户编码是否重复
Parsley.addAsyncValidator('ptmTenantry_findByName', function (xhr) {
    return 1 == this.element.disabled || JSON.parse((JSON.parse(xhr.responseText))).code==0;
}, '/ptmTenantry/findByName');




//rate费率
Parsley
    .addValidator('rate', {
        requirementType: 'number',
        validateNumber: function(value) {
            return 0<=value&&value<1;
        },
    });

