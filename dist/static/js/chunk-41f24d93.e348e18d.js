(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-41f24d93"],{2017:function(t,e,n){"use strict";n("cafe")},"585a":function(t,e,n){},"9ed6":function(t,e,n){"use strict";n.r(e);var o=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"login-container"},[n("el-form",{ref:"loginForm",staticClass:"login-form",attrs:{model:t.loginForm,rules:t.loginRules,autocomplete:"on","label-position":"left"}},[n("div",{staticClass:"d-flex justify-center"},[n("v-avatar",{attrs:{size:"180"}},[n("img",{staticClass:"user-avatar",attrs:{src:t.avatar+"?imageView2/1/w/180/h/180"}})])],1),n("div",{staticClass:"title-container"},[n("h3",{staticClass:"title"},[t._v(" "+t._s(t.$t("login.title"))+" ")])]),n("el-form-item",{attrs:{prop:"username"}},[n("span",{staticClass:"svg-container"},[n("svg-icon",{attrs:{"icon-class":"user"}})],1),n("el-input",{ref:"username",attrs:{placeholder:t.$t("login.username"),name:"username",type:"text",tabindex:"1",autocomplete:"on"},model:{value:t.loginForm.username,callback:function(e){t.$set(t.loginForm,"username",e)},expression:"loginForm.username"}})],1),n("el-tooltip",{attrs:{content:"Caps lock is On",placement:"right",manual:""},model:{value:t.capsTooltip,callback:function(e){t.capsTooltip=e},expression:"capsTooltip"}},[n("el-form-item",{attrs:{prop:"password"}},[n("span",{staticClass:"svg-container"},[n("svg-icon",{attrs:{"icon-class":"password"}})],1),n("el-input",{key:t.passwordType,ref:"password",attrs:{type:t.passwordType,placeholder:t.$t("login.password"),name:"password",tabindex:"2",autocomplete:"on"},on:{blur:function(e){t.capsTooltip=!1}},nativeOn:{keyup:[function(e){return t.checkCapslock.apply(null,arguments)},function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.handleLogin.apply(null,arguments)}]},model:{value:t.loginForm.password,callback:function(e){t.$set(t.loginForm,"password",e)},expression:"loginForm.password"}}),n("span",{staticClass:"show-pwd",on:{click:t.showPwd}},[n("svg-icon",{attrs:{"icon-class":"password"===t.passwordType?"eye":"eye-open"}})],1)],1)],1),n("el-button",{staticStyle:{width:"100%","margin-bottom":"30px"},attrs:{loading:t.loading,type:"primary"},nativeOn:{click:function(e){return e.preventDefault(),t.handleLogin.apply(null,arguments)}}},[t._v(" "+t._s(t.$t("login.logIn"))+" ")])],1),n("el-dialog",{attrs:{title:t.$t("login.thirdparty"),visible:t.showDialog},on:{"update:visible":function(e){t.showDialog=e}}},[t._v(" "+t._s(t.$t("login.thirdpartyTips"))+" "),n("br"),n("br"),n("br"),n("social-sign")],1)],1)},s=[],i=n("5530"),a=(n("13d5"),n("b64b"),n("61f7")),r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"social-signup-container"},[n("div",{staticClass:"sign-btn",on:{click:function(e){return t.wechatHandleClick("wechat")}}},[n("span",{staticClass:"wx-svg-container"},[n("svg-icon",{staticClass:"icon",attrs:{"icon-class":"wechat"}})],1),t._v(" WeChat ")]),n("div",{staticClass:"sign-btn",on:{click:function(e){return t.tencentHandleClick("tencent")}}},[n("span",{staticClass:"qq-svg-container"},[n("svg-icon",{staticClass:"icon",attrs:{"icon-class":"qq"}})],1),t._v(" QQ ")])])},c=[],l={name:"SocialSignin",methods:{wechatHandleClick:function(t){alert("ok")},tencentHandleClick:function(t){alert("ok")}}},u=l,p=(n("d9fb"),n("2877")),d=Object(p["a"])(u,r,c,!1,null,"7309fbbb",null),g=d.exports,f=n("2f62"),m={name:"Login",computed:Object(i["a"])({},Object(f["b"])(["avatar"])),metaInfo:function(){return{title:"Mesa de control - JC Riesgos",meta:[{name:"description",content:"Mesa de control - JC Riesgos"},{property:"og:title",content:"Mesa de control - JC Riesgos"},{property:"og:site_name",content:"Mesa de control"},{property:"og:type",content:"website"},{name:"robots",content:"index,follow"}]}},components:{SocialSign:g},data:function(){var t=function(t,e,n){e&&!Object(a["d"])(e)?n(new Error("Ingrese un correo electronico valido.")):n()},e=function(t,e,n){e&&e.length<4?n(new Error("La contraseña no puede tener menos de 5 dígitos.")):n()};return{loginForm:{},loginRules:{username:[{required:!0,trigger:"blur",validator:t}],password:[{required:!0,trigger:"blur",validator:e}]},passwordType:"password",capsTooltip:!1,loading:!1,showDialog:!1,redirect:void 0,otherQuery:{}}},watch:{$route:{handler:function(t){var e=t.query;e&&(this.redirect=e.redirect,this.otherQuery=this.getOtherQuery(e))},immediate:!0}},created:function(){},mounted:function(){""===this.loginForm.username?this.$refs.username.focus():""===this.loginForm.password&&this.$refs.password.focus()},destroyed:function(){},methods:{checkCapslock:function(t){var e=t.key;this.capsTooltip=e&&1===e.length&&e>="A"&&e<="Z"},showPwd:function(){var t=this;"password"===this.passwordType?this.passwordType="":this.passwordType="password",this.$nextTick((function(){t.$refs.password.focus()}))},handleLogin:function(){var t=this;this.$refs.loginForm.validate((function(e){if(!e)return console.log("error submit!!"),!1;t.loading=!0,t.$store.dispatch("user/login",t.loginForm).then((function(){t.$router.push({path:t.redirect||"/",query:t.otherQuery}),t.loading=!1})).catch((function(){t.loading=!1}))}))},getOtherQuery:function(t){return Object.keys(t).reduce((function(e,n){return"redirect"!==n&&(e[n]=t[n]),e}),{})}}},h=m,w=(n("2017"),n("dfc5"),Object(p["a"])(h,o,s,!1,null,"705c4bec",null));e["default"]=w.exports},a9b3:function(t,e,n){},cafe:function(t,e,n){},d9fb:function(t,e,n){"use strict";n("a9b3")},dfc5:function(t,e,n){"use strict";n("585a")}}]);