xbase={assert:function(a,b){if(!a)throw"Assertion failed: "+b||"Assertion failed!";},requires:function(a){a=a.split(".");for(var b="",d=window,c=0;c<a.length;++c)if(0!==c&&(b+="."),b+=a[c],d=d[a[c]],"undefined"===typeof d)throw'xbase.js package "'+b+'" not found!';return!0},declares:function(a){a=a.split(".");for(var b="",d=window,c=0;c<a.length;++c)0!==c&&(b+="."),b+=a[c],d=d[a[c]],"undefined"===typeof d&&eval(b+" = {};");return!0},isDOM:function(a){return"object"===typeof HTMLElement?a instanceof
HTMLElement:a&&"object"===typeof a&&null!==a&&1===a.nodeType&&"string"===typeof a.nodeName},_bWithDebugPrints:!1,withDebugPrints:function(){return this._bWithDebugPrints},setDebugLevel:function(a){this._bWithDebugPrints=a;return this},base:{},controls:{},bootstrap:{},jquery:{}};"undefined"===typeof String.prototype.trim&&(String.prototype.trim=function(){return String(this).replace(/^\s+|\s+$/g,"")});(function(){var a=!1,b=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;this.Class=function(){};Class.extend=function(d){function c(){!a&&this.init&&this.init.apply(this,arguments)}var g=this.prototype;a=!0;var f=new this;a=!1;for(var e in d)f[e]="function"==typeof d[e]&&"function"==typeof g[e]&&b.test(d[e])?function(a,b){return function(){var d=this._super;this._super=g[a];var c=b.apply(this,arguments);this._super=d;return c}}(e,d[e]):d[e];c.prototype=f;c.prototype.constructor=c;c.extend=arguments.callee;
return c}})();xbase.Class=Class;Class=void 0;xbase.base.EventManager=xbase.Class.extend({init:function(a,b){this._sName=b?b:"Unnamed";this._oContext=a;this._oCallbacks={}},on:function(a,b){a in this._oCallbacks?this._oCallbacks[a].push(b):this._oCallbacks[a]=[b];return this},bind:function(a,b){return this.on(a,b)},trigger:function(a,b){xbase.withDebugPrints()&&("undefined"!==typeof b?console.debug("[xbase] Event: %s -> %s",a,this._sName,b):console.debug("[xbase] Event: %s -> %s",a,this._sName));if(a in this._oCallbacks)for(var d=0;d<this._oCallbacks[a].length;++d)this._oCallbacks[a][d].call(this._oContext,
b);return this},setName:function(a){this._sName=a}});xbase.ResourceManager=xbase.Class.extend({init:function(a){this._sName=a;this._oResources={}},get:function(a){return a in this._oResources?this._oResources[a]:null},set:function(a,b){this._oResources[a]=b;return this}});xbase.Control=xbase.Class.extend({_sTypeName:"Control",_oOptions:{},init:function(a){this._resolveOptions(a);this._oEventManager=new xbase.base.EventManager(this,this._sTypeName)},setHTML:function(a){var b=document.createElement("div");b.innerHTML=a.trim();if(1!=b.childNodes.length)throw console.warn(b.childNodes),"Needs to be exactly one first level DOM-element!";return this.setDOM(b.childNodes[0])},setDOM:function(a){this._oDOM=a;return this},placeAt:function(a){this._setTarget(a);this._oTarget.appendChild(this._oDOM);
this.trigger("placed");return this},prependTo:function(a){this._setTarget(a);this._oTarget.insertBefore(this._oDOM,this._oTarget.firstChild);this.trigger("placed");return this},select:function(a){return a?this._oDOM.querySelector(a):this._oDOM},on:function(a,b){this._oEventManager.on(a,b);return this},bind:function(a,b){this._oEventManager.on(a,b);return this},trigger:function(a,b){this._oEventManager.trigger(a,b);return this},_setTarget:function(a){"string"===typeof a?this._oTarget=document.querySelector(a):
xbase.isDOM(a)&&(this._oTarget=a);return this},$:function(a){return a?$(this._oDOM).find(a):$(this._oDOM)},__oSetOptions:{},_resolveOptions:function(a){"undefined"===typeof a&&(a={});this.__oSetOptions={};for(var b in this._oOptions)a.hasOwnProperty(b)?this.__oSetOptions[b]=a[b]:this.__oSetOptions[b]=this._oOptions[b];return this},_getOption:function(a){return this.__oSetOptions[a]}});xbase.jControl=xbase.Control.extend({_sTypeName:"jControl",_sHTML:"",_oOptions:{},init:function(a){this._super(a)},placeAt:function(a){this._setTarget(a);this._oTarget.append(this._oDOM);this.trigger("placed");return this},prependTo:function(a){this._setTarget(a);this._oTarget.prepend(this._oDOM);this.trigger("placed");return this},select:function(a){return a?this._oDOM.find(a):this._oDOM},remove:function(){this._oDOM.remove();return this},getDOM:function(){return this._oDOM.get(0)},setDOM:function(a){this._oDOM=
a instanceof jQuery?a:$(a);return this},_buildDOM:function(){this._oDOM=$(this._sHTML);return this},_setTarget:function(a){this._oTarget=a instanceof jQuery?a:$(a);return this}});xbase.controls.TextInput=xbase.Control.extend({_sTypeName:"TextInput",_oOptions:{type:"text",placeholder:null},init:function(a){this._super(a);this.setHTML("<input />");this._oInput=this.select();this._oInput.setAttribute("type",this._getOption("type"));this._oInput.style.width="100%";this._getOption("placeholder")&&this._oInput.setAttribute("placeholder",this._getOption("placeholder"));this._registerEventListeners(this._oInput)},_registerEventListeners:function(a){var b=this;a.addEventListener("keyup",
function(a){var c=-1;window.event?c=a.keyCode:a.which&&(c=a.which);a={keyCode:c,value:b.getValue()};13==c?b.trigger("enter",a):b.trigger("text-change",a)})},setValue:function(a){this._oInput.value=a;return this},getValue:function(){return this._oInput.value}});xbase.controls.Textarea=xbase.Control.extend({_sTypeName:"Textarea",_oOptions:{height:"200px",text:null,enabled:!0},init:function(a){this._super(a);this.setHTML('\t\t\t<div class="xbaseTextarea">\t\t\t\t<div class="xbaseLineNumbers"></div>\t\t\t\t<div class="xbaseTextareaContainer"><textarea></textarea></div>\t\t\t</div>');a=this.select();var b=this.select(".xbaseLineNumbers"),d=this.select(".xbaseTextareaContainer"),c=this.select("textarea");this._setRequiredStyles(a,b,d,c);var g=this._getOption("height");
a.style.height=g;c.style.height=g;b.style.height=g;this._registerEventListeners(c);this._oContainer=a;this._oTextarea=c;this._oLineNumbers=b;this._oTextareaContainer=d;this.setEnabled(this._getOption("enabled"));this._getOption("text")&&this.setValue(this._getOption("text"))},setValue:function(a){this._oTextarea.value=a;this._refresh();return this},getValue:function(){return this._oTextarea.value},setEnabled:function(a){a?this._oTextarea.removeAttribute("disabled"):this._oTextarea.setAttribute("disabled",
"disabled")},_refresh:function(){if(this._oTarget){for(var a=this.getValue().split("\n").length,b="",d=0;d<a;d++)b+=d+1+"<br />";this._oLineNumbers.innerHTML=b+"<br />";this._oTextarea.style.width=this._oContainer.offsetWidth-this._oLineNumbers.offsetWidth-6+"px"}},_registerEventListeners:function(a){var b=this;a.addEventListener("keyup",function(a){var c=-1;window.event?c=a.keyCode:a.which&&(c=a.which);16<=c&&40>=c||91<=c&&93>=c||112<=c&&145>=c||b.trigger("text-change",{keyCode:c,value:b.getValue()})});
a.addEventListener("scroll",function(){b._oLineNumbers.scrollTop=a.scrollTop});this.on("placed",function(){b._refresh()});this.on("text-change",function(){b._refresh()});window.addEventListener("resize",function(){b._refresh()})},_setRequiredStyles:function(a,b,d,c){a.style.width="100%";b.style.styleFloat="left";b.style.cssFloat="left";b.style.overflow="hidden";d.style.styleFloat="left";d.style.cssFloat="left";c.style.fontFamily="inherit";c.style.fontSize="inherit";navigator.appVersion.indexOf("MSIE")?
c.setAttribute("wrap","off"):c.style.whiteSpace="nowrap"}});xbase.declares("xbase.controls");xbase.controls.Button=xbase.Control.extend({_sTypeName:"Button",_oOptions:{"class":"",label:""},init:function(a){this._super(a);this.setHTML("<button></button>");this._oDOM.setAttribute("class",this._getOption("class"));this._oDOM.innerHTML=this._getOption("label");var b=this;this._oDOM.onclick=function(){b.trigger("click")};this._oDOM.ondblclick=function(){b.trigger("dblclick")};this._oDOM.oncontextmenu=function(){b.trigger("rightclick")}}});xbase.controls.Checkbox=xbase.Control.extend({_sTypeName:"Checkbox",_oOptions:{checked:!1,enabled:!0,label:null},init:function(a){this._super(a);a=document.createElement("label");this._oCheckbox=document.createElement("input");this._oCheckbox.setAttribute("type","checkbox");this.setChecked(this._getOption("checked"));this.setEnabled(this._getOption("enabled"));a.appendChild(this._oCheckbox);this._getOption("label")&&(this._oLabel=document.createElement("span"),this._oLabel.innerHTML=this._getOption("label"),
a.appendChild(this._oLabel));this.setDOM(a);var b=this;this._oCheckbox.onchange=function(){b.trigger("state-change",b.getChecked())}},getChecked:function(){return this._oCheckbox.checked},setChecked:function(a){this._oCheckbox.checked=a;return this},getEnabled:function(){return!this._oCheckbox.disabled},setEnabled:function(a){this._oCheckbox.disabled=!a;return this}});xbase.bootstrap||(xbase.bootstrap={});
xbase.bootstrap.Button=xbase.jControl.extend({_sTypeName:"bootstrap.Button",_oOptions:{size:"sm",style:"default",label:"",enabled:!0},init:function(a){this._super(a);a=document.createElement("button");var b="btn btn-"+this._getOption("size")+" btn-"+this._getOption("style");a.setAttribute("class",b);a.innerHTML=this._getOption("label");this.setDOM(a);this.setEnabled(this._getOption("enabled"));var d=this;a.onclick=function(){d.trigger("click")};a.ondblclick=function(){d.trigger("dblclick")};a.oncontextmenu=
function(){d.trigger("rightclick")}},setEnabled:function(a){a?this.select().removeAttr("disabled"):this.select().attr("disabled","disabled")}});xbase.bootstrap||(xbase.bootstrap={});
xbase.bootstrap.DropdownPicker=xbase.jControl.extend({_sTypeName:"DropdownPicker",_oOptions:{size:"sm",style:"default",label:"<i>Pick an option</i>",labelWithoutCaret:!1,enabled:!0,values:[],labelProperty:null,valuesWithID:!1,defaultSelectedID:null},init:function(a){this._super(a);this.setHTML('<div class="xbaseBootstrapDropdownPicker btn-group" style="width: 100%;">\t\t\t<ul class="dropdown-menu" role="menu"></ul>\t\t</div>');this._oButton=new xbase.bootstrap.Button({size:this._getOption("size"),style:this._getOption("style")});
this._oButton.select().addClass("dropdown-toggle");this._oButton.select().attr("data-toggle","dropdown");this._oButton.select().css("width","100%");this.setLabel(this._getOption("label"));this._oButton.prependTo(this._oDOM);this.setEnabled(this._getOption("enabled"));this._getOption("valuesWithID")?this.setValuesWithID(this._getOption("values"),this._getOption("labelProperty")):this.setValues(this._getOption("values"),this._getOption("labelProperty"));this._getOption("defaultSelectedID")&&this.setSelectedID(this._getOption("defaultSelectedID"))},
setEnabled:function(a){this._bEnabled=a;this._oButton.setEnabled(a);a?this.select().removeClass("disabled"):this.select().addClass("disabled")},setValues:function(a,b){this.reset();this._aValues=a;this._sLabelProperty=b;var d=this.select("ul"),c=this;$.each(a,function(a,f){var e=$("<li><a>"+(b?f[b]:f)+"</a></li>");e.click(function(){c.setSelectedID(a)});d.append(e)});this._bWithID=!1;return this},setValuesWithID:function(a,b){this.reset();this._sLabelProperty=b;this._aValues={};var d=this.select("ul"),
c=this;$.each(a,function(a,f){var e=$("<li><a>"+f[b]+"</a></li>");e.click(function(){c.setSelectedID(f.id)});d.append(e);c._aValues[f.id]=f});this._bWithID=!0;return this},getSelectedID:function(){return this._oSelected.id},getSelected:function(){return this._oSelected.value},reset:function(){this._oSelected={value:null,id:null};this.select("ul").html("");this.setLabel(this._getOption("label"))},setSelectedID:function(a){this._oSelected.id=a;this._oSelected.value=this._aValues[a];this.setLabel(this._sLabelProperty?
this._aValues[a][this._sLabelProperty]:this._aValues[a]);this.trigger("change",this._oSelected);return this},setLabel:function(a,b){!0===b||this._getOption("labelWithoutCaret")?this._oButton.select().html(a):this._oButton.select().html(a+' <span class="caret"></span>');return this}});xbase.bootstrap||(xbase.bootstrap={});
xbase.bootstrap.TextInput=xbase.jControl.extend({_sTypeName:"TextInput",_oOptions:{type:"text",placeholder:null,enabled:!0,name:null},init:function(a){this._super(a);this.setHTML('<input class="form-control" />');this._oInput=this.select();this._oInput.attr("type",this._getOption("type"));this._oInput.css("width","100%");this._getOption("placeholder")&&this._oInput.attr("placeholder",this._getOption("placeholder"));this.setEnabled(this._getOption("enabled"));this._getOption("name")&&this.setName(this._getOption("name"));
this._registerEventListeners(this._oInput)},_registerEventListeners:function(a){var b=this;a.bind("keyup",function(a){var c=-1;window.event?c=a.keyCode:a.which&&(c=a.which);a={keyCode:c,value:b.getValue()};13==c?b.trigger("enter",a):b.trigger("text-change",a)})},setName:function(a){return this._oInput.attr("name",a)},getName:function(){return this._oInput.attr("name")},setValue:function(a){this._oInput.val(a);return this},getValue:function(){return this._oInput.val()},setEnabled:function(a){a?this._oInput.removeAttr("disabled"):
this._oInput.attr("disabled","disabled");return this}});
