define("base64",["require","exports","module"],function(e,t,n){_keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",t.encode=function(e){var t="",n,r,i,s,o,u,a,f=0;e=_utf8_encode(e);while(f<e.length)n=e.charCodeAt(f++),r=e.charCodeAt(f++),i=e.charCodeAt(f++),s=n>>2,o=(n&3)<<4|r>>4,u=(r&15)<<2|i>>6,a=i&63,isNaN(r)?u=a=64:isNaN(i)&&(a=64),t=t+_keyStr.charAt(s)+_keyStr.charAt(o)+_keyStr.charAt(u)+_keyStr.charAt(a);return t},t.decode=function(e){var t="",n,r,i,s,o,u,a,f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length)s=_keyStr.indexOf(e.charAt(f++)),o=_keyStr.indexOf(e.charAt(f++)),u=_keyStr.indexOf(e.charAt(f++)),a=_keyStr.indexOf(e.charAt(f++)),n=s<<2|o>>4,r=(o&15)<<4|u>>2,i=(u&3)<<6|a,t+=String.fromCharCode(n),u!=64&&(t+=String.fromCharCode(r)),a!=64&&(t+=String.fromCharCode(i));return t=_utf8_decode(t),t},_utf8_encode=function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);r<128?t+=String.fromCharCode(r):r>127&&r<2048?(t+=String.fromCharCode(r>>6|192),t+=String.fromCharCode(r&63|128)):(t+=String.fromCharCode(r>>12|224),t+=String.fromCharCode(r>>6&63|128),t+=String.fromCharCode(r&63|128))}return t},_utf8_decode=function(e){var t="",n=0,r=c1=c2=0;while(n<e.length)r=e.charCodeAt(n),r<128?(t+=String.fromCharCode(r),n++):r>191&&r<224?(c2=e.charCodeAt(n+1),t+=String.fromCharCode((r&31)<<6|c2&63),n+=2):(c2=e.charCodeAt(n+1),c3=e.charCodeAt(n+2),t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63),n+=3);return t}}),define("promise",["require","exports","module"],function(e,t,n){function r(){}function i(e,t,n){this.type=e,this.target=t,this.data=n}function s(e){this.target=e}r.prototype.trigger=function(e,t){if(arguments.length>2)var t=Array.prototype.slice.call(arguments,1);else if(arguments.length==2)var t=[t];else var t=[];var n=this["on"+e];this.__event_handlers=this.__event_handlers||{};var r=this.__event_handlers[e]||[],s=new i(e,this.target,t);!n||n.apply(this.target||this,t);if(r.length>0)for(var o=0;o<r.length;o++)r[o].apply(this.target||this,t);!n&&r.length===0&&(typeof this.__eventqueue=="undefined"&&(this.__eventqueue={}),typeof this.__eventqueue[e]=="undefined"&&(this.__eventqueue[e]=[]),this.__eventqueue[e].push(t))},r.prototype.on=function(e,t){var n=this.__event_handlers=this.__event_handlers||{};n[e]=n[e]||[],n[e].push(t);while(this.__eventqueue&&this.__eventqueue[e]&&this.__eventqueue[e].length>0){var r=this.__eventqueue[e].pop(0);r.splice(0,0,e),this.trigger.apply(this,r)}return this},r.prototype.error=function(e){return this.on("error",e)},r.prototype.onerror=function(){console.error("Unhandled error",arguments)},s.prototype=new r,s.prototype.then=function(e){return this.on("success",e)},s.prototype.ok=function(e){this.result=e,this.trigger("success",e)},s.chain=function(e){function o(){t.error()}function u(r){function s(s){i[r]=s,n-=1,t.trigger("onedone",r,e[r],s),n===0&&t.trigger("success",i)}return s}var t=new s,n=e.length,r,i=[];for(r=0;r<e.length;r++)e[r].hasOwnProperty("result")?(n-=1,i[r]=e[r].result,t.trigger("onedone",r,e[r],e[r].result)):(e[r].then(u(r)),e[r].on("error",o));return n===0&&t.trigger("success",i),t},t.EventListener=r,t.Promise=s}),define("jsonsca",["require","exports","module","promise"],function(e,t,n){function i(e,t){var n=[],r;for(r=0;r<t.length;r++)n.push(e(t[r]));return n}function s(e){var t=0;for(p in e)e.hasOwnProperty(p)&&t++;return t}var r=e("promise").Promise;t.pack=function(e,n){var i=new r,s=typeof e;if(typeof n=="undefined")var n=new t._ReferenceTracker;var o=n.reference(e);if(o&&o.ref)i.ok({reference:o.ref});else if(s==="string"||s==="number"||s==="boolean")i.ok(e);else if(s==="undefined")i.ok({"undefined":!0});else if(e===null)i.ok({"null":!0});else if(e instanceof Date)i.ok({date:e.getTime()});else if(e instanceof RegExp)i.ok({regexp:{source:e.source}});else if(e instanceof ImageData){var u=new Blob([e.data]),a=new FileReader,f={id:o["new"],imagedata:{width:e.width,height:e.height,data:undefined}};a.onloadend=function(){f.imagedata.data=a.result,i.ok(f)},a.onerror=function(){i.error("Could not serialize")},a.readAsBinaryString(u)}else if(e instanceof File||e instanceof Blob){var l=e instanceof File?"file":"blob",f={id:o["new"]};f[l]={contents:null,properties:{type:e.type}},e instanceof File&&(f[l].properties.name=e.name);var a=new FileReader;a.onloadend=function(){f[l].contents=a.result,i.ok(f)},a.onerror=function(){i.error("Could not serialize")},a.readAsBinaryString(e)}else if(e instanceof Array||e instanceof FileList){var c=[];for(var h=0;h<e.length;h++)c.push(t.pack(e[h],n));r.chain(c).then(function(e){i.ok({id:o["new"],array:e})})}else{var c=[],f={},p;for(prop in e)e.hasOwnProperty(prop)&&(p=t.pack(e[prop],n),p.prop=prop,c.push(p));var d=r.chain(c);d.then(function(){i.ok({object:f})}),d.on("onedone",function(e,t,n){f[t.prop]=n})}return i},t.unpack=function(e,n){var r=typeof e,n=n||{},i=e.id;if(r!=="object")return e;if(e.reference)return console.log("ref",e.reference,n[e.reference]),n[e.reference];if(e["null"])return null;if(e.date){var s=new Date;return s.setTime(e.date),s}if(e.imagedata){var o=document.createElement("canvas"),u=o.getContext("2d"),s=u.createImageData(e.imagedata.width,e.imagedata.height);n[e.id]=s;for(var a=0;a<e.imagedata.data.length;a++)s.data[a]=e.imagedata.data.charCodeAt(a);return s}if(e.file||e.blob){var f=e.file||e.blob,l=new ArrayBuffer(f.contents.length),c=new Uint8Array(l);for(var a=0;a<f.contents.length;a++)c[a]=f.contents.charCodeAt(a);var s=new Blob([c],{type:f.properties.type});return n[e.id]=s,e.file&&(s.name=f.properties.name),s}if(e["undefined"])return undefined;if(e.array){var s=[];n[e.id]=s;for(var a=0;a<e.array.length;a++)s.push(t.unpack(e.array[a],n));return s}if(e.object){var s={};n[e.id]=s;for(prop in e.object)s[prop]=t.unpack(e.object[prop],n);return s}},t.parse=function(e){return t.unpack(JSON.parse(e))},t.stringify=function(e){var n=t.pack(e),i=new r;return n.then(function(e){i.ok(JSON.stringify(e))}),i},t._ReferenceTracker=function(){this.tracked={},this.next_id=1},t._ReferenceTracker.prototype.reference=function(e){var t=typeof e;if(t==="object"){for(n in this.tracked)if(this.tracked[n]===e)return{ref:n};var n=this.next_id;return this.tracked[this.next_id]=e,this.next_id++,{"new":n}}return null}}),define("plasmid",["require","exports","module","base64","jsonsca","promise"],function(e,t,n){function a(){}function f(e){var t=Array.apply(this,arguments),e=Array.prototype.shift.apply(t),n=Array.prototype.shift.apply(t);return function(){var r=Array.apply(this,t);while(arguments.length>0)r.push(Array.prototype.shift.apply(arguments));return n.apply(e,r)}}function l(e,t,n,i,s){function l(){if(u.readyState===4)if(u.status===401)console.log("Not authorized");else if(u.status==200){var e=JSON.parse(u.responseText);f.trigger("success",e)}}var e=e.toUpperCase(),u=new XMLHttpRequest;u.onreadystatechange=l,u.open(e,t),i&&!s&&(s=i.secret,i=i.access);if(i&&s){var a="Basic "+r.encode(i+":"+s);u.setRequestHeader("authorization",a)}e=="POST"||e=="PUT"?u.send(JSON.stringify(n)):u.send(null);var f=new o;return f}var r=e("base64"),i=e("jsonsca"),s=e("promise"),o=s.Promise,u=s.EventListener;window.indexedDB=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB,random_token=function(e){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuv0123456789",n=[];while(e>0)n.push(t[parseInt(Math.random()*t.length)]),e--;return n.join("")};var c=function(e){this.options=e||{},this.access=this.options.access,this.secret=this.options.secret,this.credentials=this.options.credentials};c.prototype=new u,c.prototype.self_cred=function(){this.credentials=this},c.prototype.complete=function(){return!!this.secret},c.prototype.list=function(){var e=this.options,t=l("get",e.api+"a/"+this.access,null,this.credentials||this);t.then(function(e){n.ok(e.permissions)});var n=new o;return n},c.prototype.grant=function(e,t,n){var r=this,i=this.options;e instanceof p&&(reource=e.name),body={permission:t,resource:e,value:n},l("post",i.api+"a/"+this.access,body,this.credentials).then(function(e){e.error?s.trigger("error",e.error):s.ok()});var s=new o;return s},c.prototype.create=function(e){var t=this,n=this.options,r={access:this.access,secret:this.secret,type:e},i=l("post",n.api+"a/",r,this.credentials);i.then(function(e){if(e.success){var n=e.success.access,r=e.success.secret;t.access=n,t.secret=r,s.ok(e.success)}else s.error(e.error)});var s=new o(this);return s};var h=function(t){var t=t||{};this.db=t.db,this.storename=t.storename};h.prototype=new u,h.prototype.count=function(){var e=new o(this),t=this.db._getIDBTrans(this.storename).objectStore(this.storename),n=t.count();return n.onsuccess=function(t){e.ok(t.target.result)},n.onerror=function(){e.error()},e},h.prototype.walk=function(e){var t=new o(this),n=this,r=this.db._getIDBTrans(this.storename).objectStore(this.storename),i=[],s;return e?s=r.index(e).openCursor():s=r.openCursor(),s.onsuccess=function(e){var n=e.target.result;n?(i.push(n.value),t.trigger("each",n.value),n.continue()):t.trigger("success",i)},s.onerror=function(e){t.trigger("error")},t},h.prototype._get_item=function(e){var t=new o(this),n=this.db._getIDBTrans(this.storename).objectStore(this.storename).get(e);return n.onsuccess=function(n){n.target.result?t.trigger("success",n.target.result):t.trigger("missing",e)},n.onerror=function(e){t.trigger("error","unknown")},t},h.prototype.get=function(e){var t=this._get_item(e),n=new o(this);return t.then(function(e){n.ok(e.value)}).on("error",function(e){n.trigger("error",e)}).on("missing",function(){n.trigger("missing",e)}),n},h.prototype.add=function(e,t){var n=this,r=new o(this),i=this.db._getIDBTrans([this.storename],"readwrite"),s=i.objectStore(this.storename).add({key:e,value:t,revision:null});return s.onsuccess=function(t){t.target.result?(r.trigger("success",t.target.result.value),n.trigger("update",e,t.target.result.value)):r.trigger("missing",e)},s.onerror=function(e){r.trigger("error","unknown")},r},h.prototype.put=function(e,t,n){var r=this,i=this.autopush,s=new o(this),u=this.db._getIDBTrans([this.storename],"readwrite"),e=e===null?random_token(16):e,a=u.objectStore(this.storename).put({key:e,value:t,revision:n||"queue"});return a.onsuccess=function(t){t.target.result?(s.trigger("success",t.target.result.value),r.trigger("update",e,t.target.result.value)):s.trigger("missing",e)},a.onerror=function(e){s.trigger("error","unknown")},s},h.prototype.putmany=function(e){function s(){if(e.length===0)r.trigger("success");else{var n=e.pop(),o=n.key===null?random_token(16):n.key,u=i.objectStore(t.storename).put({key:o,value:n.value,revision:null});u.onsuccess=function(e){e.target.result?(s(),t.trigger("update",o,e.target.result.value)):r.trigger("missing",o)},u.onerror=function(e){r.trigger("error","unknown")}}}var t=this,n=this.autopush,r=new o(this),i=this.db._getIDBTrans([this.storename],"readwrite");return s(),r},h.prototype._remove=function(e){var t=this,n=new o(this),r=this.db._getIDBTrans([this.storename],"readwrite"),e=e===null?random_token(16):e,i=r.objectStore(this.storename).remove(e);return i.onsuccess=function(t){t.target.result?n.trigger("success",t.target.result.value):n.trigger("missing",e)},i.onerror=function(e){n.trigger("error","unknown")},n};var p=function(t){this.options=t,this.credentials=t.credentials,this.name=t.name,this.api=t.api,this.localname=t.localname||t.name,this.remotename=t.remotename||null;var n=this;n.stores={};var r;for(storename in t.schema.stores)r=t.schema.stores[storename].sync?d:h,n.stores[storename]=new r({db:n,storename:storename});var i=indexedDB.open(this.localname,t.schema.version);i.onerror=function(e){n.trigger("openerror",e)},i.onsuccess=function(e){function r(e){n.remotename=e}n.idb=e.target.result,t.autoSync&&n.autoSync(t.autoSync),n.remotename?r(n.remotename):n.meta.get("remotename").then(r),n.trigger("opensuccess")},i.onupgradeneeded=function(e){var r=e.target.result,i=e.target.transaction,s,o,u,a;n.idb=r;if(!r.objectStoreNames.contains("meta")){var f=r.createObjectStore("meta",{keyPath:"key"});f.createIndex("key","key",{unique:!0}),f.add({key:"last_revision",value:1}),f.add({key:"plasmid_schema_version",value:1}),f.add({key:"remote_url",value:n._getRemoteEndpoint()})}for(s in t.schema.stores){if(!r.objectStoreNames.contains(s)){var u=r.createObjectStore(s,{keyPath:"key"});u.createIndex("revision","revision",{unique:!1})}else u=i.objectStore(s);for(o in t.schema.stores[s].indexes)a=t.schema.stores[s].indexes[o],a&&u.createIndex(o,"value."+a.key,{unique:a.unique,multi:a.multi})}},this.meta=new h({db:this,storename:"meta"}),this.stores.meta=this.meta};p.prototype=new u,p.prototype._getIDBTrans=function(){var e=this.idb.transaction.apply(this.idb,arguments);return e},p.prototype.transaction=function(e,t){function r(){this.stores={},this.abort=function(){n.abort()},this.commit=function(){n=null},this._getIDBTrans=function(e,t){if(typeof e=="string")var e=[e];if(e.length==n.objectStoreNames.length){for(var r=0;r<e.length;r++)if(e[r]!==n.objectStoreNames[r])return p.prototype._getIDBTrans.apply(this,arguments);return t!==n.mode?p.prototype._getIDBTrans.apply(this,arguments):n}};for(var t=0;t<e.length;t++)this.stores[e[t]]=new h({db:this,storename:e[t]})}var n=this.idb.transaction(e,t);r.prototype=this;var i=new r;return i},p.prototype._getRemoteEndpoint=function(){var e=this.options.api+"d/"+this.remotename+"/";return e},p.prototype.setRemote=function(e){var t=this.remotename===null;this.remotename=e,this.trigger("remotechanged",e);var n=new o(this);return this.meta.put("remotename",e).then(function(){n.ok()}).on("error",function(e){n.trigger("error",e)}),n},p.prototype.http=function(e,t,n){return l(e,t,n,this.credentials)},p.prototype.autoSync=function(e){function n(){try{t.sync()}catch(e){console.error("auto sync error: "+e)}}this.autoSyncIntervalTime=e,!this.autoSyncInterval||window.clearInterval(this.autoSyncInterval),!e||(this.autoSyncInterval=window.setInterval(n,this.autoSyncIntervalTime));var t=this},p.prototype.sync=function(){function n(){t.push().on("error",function(r){r==="outofdate"?t.pull().then(n):(e.trigger("error",r),t.syncing=null)}).then(function(){e.trigger("success"),t.syncing=null})}var e=new o,t=this;return t.syncing?t.syncing:(t.syncing=e,n(),e)},p.prototype.pull=function(){function u(n){var r=n.updates;if(r.length>0){function s(){var e;if(r.length>0){e=r.shift();var n=e.shift(),o=e.shift(),u=e.shift(),a=e.shift(),f=t.stores[n];a=i.unpack(a);function l(){f.put(u,a,o).then(function(){t.meta.put("last_revision",o).then(s)}).error(function(){console.error(arguments)})}f._get_item(u).then(function(e){e.revision===null?f.resolve(f,u,e.value,a):l()}).on("missing",l)}else e=null,t.trigger("updated");return e}s()}else t.meta.put("last_revision",n.until);e.trigger("success")}var e=new o,t=this,n;if(this.remotename===null)e.trigger("error","noremote");else{var r=this._getRemoteEndpoint(),s;this.meta.get("last_revision").then(function(e){s=r+"update/"+e,n=t.http("GET",s),n.then(u)})}return e},p.prototype.push=function(){function f(){var e=t.stores[u.shift()];e._queued().then(function(e){while(e.length>0)a.push(e.pop());u.length>0?f():c()})}function c(){l++,l+1<=a.length?i.pack(a[l][1].value).then(function(e){a[l][1].value=e,c()}):p()}function p(){h={last_revision:s},h.data={};for(var e=0;e<a.length;e++){var n=a[e],i=n[0],o=n[1];typeof h.data[i]=="undefined"&&(h.data[i]={}),h.data[i][o.key]=o.value}t.http("POST",r,h).then(d)}function d(n){if(!n.error){function r(){var e=a.pop();if(!e)s();else{var o=e[0],u=e[1],f=i.unpack(u.value);t.stores[o].put(u.key,f,n.revision).then(function(){a.length>0?r():s()})}}function s(){t.meta.put("last_revision",n.revision).then(function(){t.trigger("push"),e.trigger("success")})}r()}else n&&e.trigger("error",n.reason)}var e=new o;if(this.remotename===null)return e.trigger("error","noremote"),e;var t=this,n,r=t._getRemoteEndpoint()+"update/",s,u=[];for(storename in this.options.schema.stores)this.options.schema.stores[storename].sync&&u.push(storename);this.meta.get("last_revision").then(function(e){s=e,f()});var a=[],l=-1,h;return e},p.prototype.drop=function(){var e=indexedDB.deleteDatabase(this.localname);this.idb.close(),e.onsuccess=function(e){t.ok()},e.onerror=function(e){t.trigger("error")};var t=new o;return t},p.prototype.reset=function(){function t(){p.call(e,e.options)}var e=this;this.drop().then(t)},p.prototype.forgetPushed=function(){var e=[];for(storename in this.stores){var t=this.stores[storename];t.walk().on("each",function(n){var r=t.put(n.key,n.value,null);e.push(r)})}var n=o.chain(e);return n};var d=function(t){h.apply(this,arguments);var n=this;this.options=t||{},this.dbname=t.db.name,this.storename=t.storename,this.autopush=t.autopush||!1};d.prototype=new h,d.clone=function(e,t){},d.prototype.onupdate=function(){},d.prototype.resolve=function(e,t,n,r){function s(e,t){i.push([e,t])}var i=[];this.trigger("conflict",s,t,n,r);if(i.length>0){var o=[];this._remove(t).then(function(){while(i.length>0){var e=i.shift();o.push(this.store.put(e[0],e[1]))}plasmid.Promise.chain(o).then(function(){this.db.meta.put("last_revision",revision).then(next)})})}else console.log("keep",t,r),this.put(t,r).then(function(){this.db.meta.put("last_revision",revision).then(next)})},d.prototype._queued=function(){var e=new o(this),t=this,n=this.db._getIDBTrans(this.storename).objectStore(this.storename).openCursor(),r=[];return n.onsuccess=function(n){var i=n.target.result,s,o=null;if(i){try{s=i.value}catch(o){console.error("Could not clone data from IndexedDB! For key "+i.key+" in store "+this.storename)}o!==null?console.error(!o):i.value.revision==="queue"&&(r.push([t.storename,i.value]),e.trigger("each",i.value)),i.continue()}else e.trigger("success",r)},n.onerror=function(t){e.trigger("error")},e},t.Credentials=c,t.Database=p,t.LocalStore=h,t.SyncStore=d,t.EventListener=u,t.Promise=o,t.http=l});