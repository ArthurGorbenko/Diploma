!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);n(1),n(2),n(3),n(4),n(5)},function(e,t){window.$=function(e,t){return(t||document).querySelectorAll(e)}},function(e,t){window.app={slideshow:$(".slideshow")[0]},app.datas=app.slideshow.dataset},function(e,t){var n,o=app.datas.speed,r=$(".slide"),i=0,a=function e(){r[i].classList.remove("active","beforeEnd");var t=$("video",r[i])[0];t&&(t.pause(),t.currentTime=0),i=r[i+1]?i+1:0,r[i].classList.add("active"),(t=$("video",r[i])[0])&&(t.play(),r[i].classList.contains("slide-video")&&(clearInterval(n),t.onended=function(){e(),u()}))},u=function(){n=setInterval((function(){r[i].classList.add("beforeEnd"),setTimeout(a,425)}),1e3*o-425)};r[1]&&u()},function(e,t){var n=location,o=n.origin,r=n.search,i=new URLSearchParams(r),a=i.get("uuid"),u=i.get("slideshow_id"),c=app.datas.version;a&&u&&setInterval((function(){fetch("".concat(o,"/api/version/").concat(a,"/").concat(u)).then((function(e){if(e.ok&&e.status<203)return e.json()})).then((function(e){return e.version!=c&&location.reload(!0)}))}),5e3)},function(e,t,n){}]);