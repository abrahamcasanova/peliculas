(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-cd642e46"],{"50cc":function(t,e,a){},c143:function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-main",{staticClass:"ma-10"},[a("v-card",[a("v-card-title",[a("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var r=e.on,n=e.attrs;return[a("v-btn",t._g(t._b({attrs:{color:"primary mr-3",dark:""},on:{click:t.showModal}},"v-btn",n,!1),r),[a("v-icon",{staticClass:"mr-2",attrs:{right:"",dark:""}},[t._v(" mdi-plus ")]),t._v(" Nuevo ")],1)]}}])},[a("span",[t._v("Crear nuevo "+t._s(t.title))])]),t._v(" Avisos "),a("v-spacer"),a("v-text-field",{attrs:{"append-icon":"mdi-magnify",label:"Buscar","single-line":"","hide-details":""},model:{value:t.search,callback:function(e){t.search=e},expression:"search"}})],1),a("v-data-table",{staticClass:"elevation-1",attrs:{headers:t.headers,items:t.list,search:t.search,"items-per-page":5,loading:t.listLoading,"footer-props":{itemsPerPageText:"Filas por página",itemsPerPageAll:"Todos",itemsPerPageOptions:[5,10]},"loading-text":"Cargando....... Espere un momento"},scopedSlots:t._u([{key:"item.url",fn:function(e){var r=e.item;return[a("v-container",{attrs:{fluid:""}},[a("v-layout",{attrs:{"justify-center":"","align-center":""}},[a("v-flex",{attrs:{shrink:""}},[a("div",[a("FsLightbox",{attrs:{toggler:t.toggler,sources:[r.url]}}),a("v-img",{staticStyle:{cursor:"pointer"},attrs:{contain:"","lazy-src":r.url,"max-height":"100","max-width":"120",src:r.url}})],1)])],1)],1)]}},{key:"item.actions",fn:function(e){var r=e.item;return[a("v-row",{attrs:{align:"center",justify:"space-around"}},[a("v-tooltip",{attrs:{top:""},scopedSlots:t._u([{key:"activator",fn:function(e){var n=e.on,i=e.attrs;return[a("v-btn",t._g(t._b({staticClass:"mx-2",attrs:{fab:"",dark:"","x-small":"",color:"green"},on:{click:function(e){return t.editNotice(r)}}},"v-btn",i,!1),n),[a("v-icon",{attrs:{dark:""}},[t._v(" mdi-pencil ")])],1)]}}],null,!0)},[a("span",[t._v("Editar "+t._s(t.title))])]),a("el-popconfirm",{attrs:{title:"Eliminar "+t.title+"?","confirm-button-text":"Eliminar","cancel-button-text":"Cancelar","confirm-button-type":"danger force-white-color"},on:{onConfirm:function(e){return t.deleteNotice(r)}}},[a("v-btn",{staticClass:"mx-2",attrs:{slot:"reference",fab:"",dark:"","x-small":"",color:"red"},slot:"reference"},[a("v-icon",{attrs:{dark:""}},[t._v(" mdi-delete-variant ")])],1)],1)],1)]}}],null,!0)})],1),a("v-dialog",{attrs:{"hide-overlay":"",persistent:"",width:"300"},model:{value:t.dialogLoading,callback:function(e){t.dialogLoading=e},expression:"dialogLoading"}},[a("v-card",{attrs:{color:"primary",dark:""}},[a("v-card-text",[t._v(" Guardando.... espera un momento "),a("v-progress-linear",{staticClass:"mb-0",attrs:{indeterminate:"",color:"white"}})],1)],1)],1),[a("v-row",{attrs:{justify:"center"}},[a("v-dialog",{attrs:{persistent:"","max-width":"600px"},model:{value:t.dialog,callback:function(e){t.dialog=e},expression:"dialog"}},[a("v-card",[a("v-card-title",[a("span",{staticClass:"headline"},[t._v("Nuevo "+t._s(t.title))])]),a("v-card-text",[a("v-container",[a("v-form",{ref:"form",attrs:{"lazy-validation":""},model:{value:t.valid,callback:function(e){t.valid=e},expression:"valid"}},[a("v-row",[a("v-col",{attrs:{cols:"12"}},[a("v-text-field",{attrs:{label:"Nombre*",rules:t.nameRules,required:""},model:{value:t.notice.name,callback:function(e){t.$set(t.notice,"name",e)},expression:"notice.name"}})],1),a("v-col",{attrs:{cols:"12",md:"6"}},[a("v-file-input",{attrs:{placeholder:"Subir aviso",label:"Archivo",rules:t.fileRules,accept:"image/*","prepend-icon":"mdi-paperclip"},scopedSlots:t._u([{key:"selection",fn:function(e){var r=e.text;return[a("v-chip",{attrs:{small:"",label:"",color:"primary"}},[t._v(" "+t._s(r)+" ")])]}}]),model:{value:t.notice.file,callback:function(e){t.$set(t.notice,"file",e)},expression:"notice.file"}})],1)],1)],1)],1),a("small",{staticClass:"red--text"},[t._v("*Campos obligatorios")])],1),a("v-card-actions",[a("v-spacer"),a("v-btn",{attrs:{color:"grey darken-1",text:""},on:{click:function(e){t.dialog=!1}}},[t._v(" Cerrar ")]),0==t.isUpdate?a("v-btn",{attrs:{color:"primary darken-1",text:""},on:{click:function(e){return t.saveNotice()}}},[t._v(" Guardar ")]):a("v-btn",{attrs:{color:"primary darken-1",text:""},on:{click:function(e){return t.updateNotice()}}},[t._v(" Actualizar ")])],1)],1)],1)],1)]],2)},n=[],i=a("1da1"),o=(a("b0c0"),a("96cf"),a("b775"));function s(t){return Object(o["a"])({url:"api/notices/getAll?api_key=".concat(t),method:"get"})}function c(t){return Object(o["a"])({url:"api/auth/notices/update",method:"post",headers:{"Content-Type":"multipart/form-data"},data:t})}function l(t){return Object(o["a"])({url:"api/auth/notices",method:"post",data:t})}function u(t){return Object(o["a"])({url:"api/auth/notices/"+t,method:"delete"})}var d=a("e099"),v=a.n(d),p={name:"Notices",filters:{statusFilter:function(t){var e={published:"success",draft:"info",deleted:"danger"};return e[t]}},components:{FsLightbox:v.a},data:function(){return{list:[],total:0,listLoading:!0,search:"",title:"aviso",toggler:!1,valid:!1,isUpdate:!1,dialogLoading:!1,dialog:!1,notice:{},nameRules:[function(t){return!!t||"Nombre es requerido"}],fileRules:[function(t){return!!t||"Archivo es requerido"}],headers:[{value:"id",align:"center",text:"Folio"},{value:"name",text:"Nombre",sortable:!0},{value:"url",align:"center",text:"Imagen",sortable:!1},{value:"created_at",with:"100%",sortable:!0,align:"center",text:"Registrado"},{value:"actions",text:"Acciones",sortable:!1}],listQuery:{page:1,limit:20}}},created:function(){this.getList()},methods:{getList:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t.listLoading=!0,e.next=3,s(t.$apiKey);case 3:t.list=e.sent,t.listLoading=!1;case 5:case"end":return e.stop()}}),e)})))()},clearInputs:function(){this.notice={}},showModal:function(){var t=this;this.clearInputs(),this.isUpdate=!1,this.fileRules=[function(t){return!!t||"Archivo es requerido"}],this.dialog=!0,this.$nextTick((function(){t.$refs.form.resetValidation()}))},updateNotice:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!t.$refs.form.validate()){e.next=19;break}return t.dialog=!1,t.dialogLoading=!0,a=new FormData,a.append("file",t.notice.file,t.notice.file.name),a.append("name",t.notice.name),a.append("id",t.notice.id),e.prev=7,e.next=10,c(a);case 10:t.getList(),t.dialogLoading=!1,e.next=19;break;case 14:e.prev=14,e.t0=e["catch"](7),console.log("try catch"),console.log(e.t0),t.dialogLoading=!1;case 19:case"end":return e.stop()}}),e,null,[[7,14]])})))()},saveNotice:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!t.$refs.form.validate()){e.next=18;break}return t.dialog=!1,t.dialogLoading=!0,a=new FormData,a.append("file",t.notice.file,t.notice.file.name),a.append("name",t.notice.name),e.prev=6,e.next=9,l(a);case 9:t.getList(),t.dialogLoading=!1,e.next=18;break;case 13:e.prev=13,e.t0=e["catch"](6),console.log("try catch"),console.log(e.t0),t.dialogLoading=!1;case 18:case"end":return e.stop()}}),e,null,[[6,13]])})))()},editNotice:function(t){this.clearInputs(),this.isUpdate=!0,this.notice.name=t.name,this.notice.id=t.id,this.fileRules=[],this.dialog=!0},deleteNotice:function(t){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return e.dialogLoading=!0,a.prev=1,a.next=4,u(t.id);case 4:e.getList(),e.dialogLoading=!1,a.next=13;break;case 8:a.prev=8,a.t0=a["catch"](1),console.log("try catch"),console.log(a.t0),e.dialogLoading=!1;case 13:case"end":return a.stop()}}),a,null,[[1,8]])})))()}}},m=p,f=(a("cb61"),a("2877")),g=Object(f["a"])(m,r,n,!1,null,"b8a432fc",null);e["default"]=g.exports},cb61:function(t,e,a){"use strict";a("50cc")}}]);