// /*
// * Revision: 3.6.6.119402
// * Revision date: 02/08/2016
// *
// * http://www.asperasoft.com/
// *
// * Â© Copyright IBM Corp. 2008, 2016
// */
"use strict";if(typeof AW4=="undefined")var AW4={};AW4.Utils=function(){function j(a){if(typeof a!="string")return null;var b=a,c=document.createElement("a");c.href=b;var d=c.href;d.indexOf("/",d.length-1)!==-1&&(d=d.slice(0,-1));return d}var a="fasp://initialize",b=typeof navigator!="undefined"?navigator.userAgent:"",c={MAC_LEGACY:b.indexOf("Intel Mac OS X 10_6")!=-1},d={OPERA:/opera|opr/i.test(b)&&!/edge/i.test(b),IE:/msie|trident/i.test(b)&&!/edge/i.test(b),CHROME:/chrome|crios|crmo/i.test(b)&&!/opera|opr/i.test(b)&&!/edge/i.test(b),FIREFOX:/firefox|iceweasel/i.test(b)&&!/edge/i.test(b),FIREFOX_32:/firefox|iceweasel/i.test(b)&&!/Win64/i.test(b)&&!/edge/i.test(b),FIREFOX_64:/firefox|iceweasel/i.test(b)&&/Win64/i.test(b)&&!/edge/i.test(b),EDGE:/edge/i.test(b),SAFARI:/safari/i.test(b)&&!/chrome|crios|crmo/i.test(b)&&!/edge/i.test(b)};(function(){if(document.all&&!window.setTimeout.isPolyfill){var a=window.setTimeout;window.setTimeout=function(b,c){var d=Array.prototype.slice.call(arguments,2);return a(b instanceof Function?function(){b.apply(null,d)}:b,c)},window.setTimeout.isPolyfill=!0}if(document.all&&!window.setInterval.isPolyfill){var b=window.setInterval;window.setInterval=function(a,c){var d=Array.prototype.slice.call(arguments,2);return b(a instanceof Function?function(){a.apply(null,d)}:a,c)},window.setInterval.isPolyfill=!0}})();var e=function(a,b){var c="";a==-1&&(c="Invalid request");return{error:{code:a,internal_message:c,user_message:b}}},f=function(a){var b;if(typeof a=="string"&&(a.length===0||a.replace(/\s/g,"")==="{}"))return{};try{b=JSON.parse(a)}catch(c){b=e(-1,c)}return b},g=function(a,b){var c=function(a){var b=a.split("."),c=[];for(var d=0;d<b.length;d++){var e=parseInt(b[d],10);isNaN(e)||c.push(e)}return c},d=c(a),e=c(b),f;for(f=0;f<Math.min(d.length,e.length);f++){if(d[f]<e[f])return!0;if(d[f]>e[f])return!1}return!1},h=function(){var a=(new Date).getTime();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(b){var c=((a+16)*Math.random()).toFixed()%16;b!=="x"&&(c=c&3|8);return c.toString(16)})},i=function(b){var c=!1,e=function(a){typeof b=="function"&&b(a)};if(d.CHROME||d.OPERA)document.body.focus(),document.body.onblur=function(){c=!0},document.location=a,setTimeout(function(){document.body.onblur=null,e(c)},500);else if(d.EDGE)document.location=a;else if(d.FIREFOX_64){var f=document.createElement("IFRAME");f.src=a,f.style.visibility="hidden",f.style.position="absolute",document.body.appendChild(f)}return null};return{FASP_URL:a,OS:c,BROWSER:d,versionLessThan:g,createError:e,generateUuid:h,launchConnect:i,parseJson:f,getFullURI:j}}(),AW4.ConnectInstaller=function(a){function q(a){return a===""||a===null||typeof a=="undefined"}AW4.ConnectInstaller.EVENT={DOWNLOAD_CONNECT:"downloadconnect",REFRESH_PAGE:"refresh",IFRAME_REMOVED:"removeiframe",IFRAME_LOADED:"iframeloaded"};var b=AW4.ConnectInstaller.EVENT,c="//d3gcli72yxqn2z.cloudfront.net/connect/v4",d="/connectversions.min.js",e={},f=[],g=null,h=0,i=!1,j=0;q(a)&&(a={}),e.iframeId=a.iframeId||"aspera-iframe-container",e.sdkLocation=q(a.sdkLocation)?c:AW4.Utils.getFullURI(a.sdkLocation),e.stylesheetLocation=AW4.Utils.getFullURI(a.stylesheetLocation);var k=function(a,b,c){if(!(a!==null&&typeof a!="undefined"&&a instanceof Array))return null;if(b===null||typeof b!="string")return null;var d=0,e=document.getElementsByTagName("head")[0]||document.documentElement,f=function(a){var f=!1,g=null;if(b.toLowerCase()==="js")g=document.createElement("script"),g.setAttribute("type","text/javascript"),g.setAttribute("src",a);else if(b.toLowerCase()==="css")g=document.createElement("link"),g.setAttribute("rel","stylesheet"),g.setAttribute("type","text/css"),g.setAttribute("href",a);else return null;typeof c=="function"&&(g.onload=g.onreadystatechange=function(){!f&&(!this.readyState||this.readyState==="loaded"||this.readyState==="complete")&&(f=!1,g.onload=g.onreadystatechange=null,e&&g.parentNode&&e.removeChild(g),--d<=0&&typeof c=="function"&&c(!0))},g.onerror=function(){c(!1)}),e.insertBefore(g,e.firstChild)};d=a.length;for(var g=0;g<d;g++)typeof a[g]=="string"&&f(a[g])},l=function(){var a="Not supported";/Win/.test(navigator.platform)?navigator.userAgent.indexOf("WOW64")!=-1||navigator.userAgent.indexOf("Win64")!=-1?a="Win64":a="Win32":/Mac OS X 10[._]6/.test(navigator.userAgent)?a="MacIntel-10.6-legacy":/Mac/.test(navigator.platform)?a="MacIntel":/Linux x86_64/.test(navigator.platform)?a="Linux x86_64":/Linux/.test(navigator.platform)&&(a="Linux i686");return a},m=function(){var a="";/Win/.test(navigator.platform)?a=navigator.userAgent.match(/Windows NT (\d+)[._](\d+)/):/Mac/.test(navigator.platform)&&(a=navigator.userAgent.match(/OS X (\d+)[._](\d+)/));if(q(a))return null;var b={highWord:parseFloat(a[1]),loWord:parseFloat(a[2])};return b},n=function(a){if(!q(a)){var b=a.match(/(\d+)[.](\d+)/);if(q(b))return null;var c={highWord:parseFloat(b[1]),loWord:parseFloat(b[2])};return c}return a},o=function(a){for(var b=0;b<f.length;b++)f[b](a)},p=function(a){var b=document.createElement("style");b.setAttribute("type","text/css"),b.styleSheet?b.styleSheet.cssText=a:b.innerHTML=a,document.body.appendChild(b)},r=function(a){if(typeof a!="function")return null;f.push(a);return null},s=function(a){if(typeof a!="function")return null;if(g!==null){a(g);return null}var b=e.sdkLocation,f=function(a,b){for(var c=0;c<b.links.length;c++){var d=b.links[c].href;!/^https?:\/\//i.test(d)&&!/^\/\//.test(d)&&(b.links[c].hrefAbsolute=a+"/"+d)}},h=function(b){var c=AW4.connectVersions,d=c.entries,e=function(c){f(b,c),g=c,a(c)},h=l();for(var i=0;i<d.length;i++){var j=d[i];if(j.navigator.platform===h){var k=m(),o=n(j.platform.version);if(!!q(o)||!!q(k)){e(j);return null}if(k.highWord>o.highWord||k.highWord>=o.highWord&&k.loWord>=o.loWord){e(j);return null}}}},i=function(a){var e=c;a&&AW4.connectVersions!=undefined?h(b):b!==e&&(b=e,k([b+d],"js",i))};k([b+d],"js",i);return null},t=function(a){function f(){i=!0,o(b.IFRAME_LOADED);var c=document.getElementById(e.iframeId);c.contentWindow.postMessage(a,"*");var d=function(a){for(var b=0;b<a.links.length;b++){var d=a.links[b];d.rel==="enclosure"&&typeof c!="undefined"&&c!==null&&c.contentWindow.postMessage("downloadlink="+d.hrefAbsolute,"*")}};s(d),e.stylesheetLocation&&typeof c!="undefined"&&c!==null&&c.contentWindow.postMessage("insertstylesheet="+e.stylesheetLocation,"*"),o(b.IFRAME_LOADED)}function d(a){if(a.data===b.DOWNLOAD_CONNECT)o(a.data),w();else if(a.data===b.REFRESH_PAGE){o(a.data);var c=!1;try{c=window.self!==window.top}catch(d){c=!0}var e=c?contentWindow:window;e.location.reload(!0)}else a.data===b.IFRAME_REMOVED&&(o(a.data),z())}h!==0&&clearTimeout(h);var c=document.getElementById(e.iframeId);if(!c){p("."+e.iframeId+"{position: absolute;width: 100%;height: 80px;margin: 0px;padding: 0px;border: none;outline: none;overflow: hidden;top: 0px;left: 0px;z-index: 999999999}");var c=document.createElement("iframe");c.id=e.iframeId,c.className=e.iframeId,c.frameBorder="0",c.src=e.sdkLocation+"/install/auto-topbar/index.html",document.body.appendChild(c);if(!c.contentWindow.postMessage)return;window.attachEvent?window.attachEvent("onmessage",d):window.addEventListener("message",d,!1)}i?c.contentWindow.postMessage(a,"*"):c.attachEvent?c.attachEvent("onload",f):c.onload=f},u=function(a){a=typeof a=="number"?a:1500,h!==0&&clearTimeout(h);var b=function(){t("launching")};h=setTimeout(b,a)},v=function(){t("download")},w=function(){t("install")},x=function(){t("update")},y=function(a){a=typeof a=="number"?a:2e3,clearTimeout(h);var b=document.getElementById(e.iframeId);typeof b!="undefined"&&b!==null&&(t("running"),setTimeout(z,a));return null},z=function(){h!==0&&clearTimeout(h);var a=document.getElementById(e.iframeId);typeof a!="undefined"&&a!==null&&a.parentNode.removeChild(a);return null};return{addEventListener:r,installationJSON:s,showLaunching:u,showDownload:v,showInstall:w,showUpdate:x,connected:y,dismiss:z}};
