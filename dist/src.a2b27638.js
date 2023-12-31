// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/index.js":[function(require,module,exports) {
var audioControl = document.getElementById("audio");
currentVolume = 25;
var volumneControl = document.getElementById("volume-control");
var seekslider = document.getElementById("seekslider");
var seekto, seeking;
var audioSource = null;
var analyser = null;
var audioCtx = null;
var audio1 = audioControl;
var r = 0,
  g = 0,
  b = 0;
audio1.crossOrigin = "anonymous";
var ranges = document.querySelectorAll("input[type=range]");
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
audioControl.addEventListener("timeupdate", function () {
  seekslider.value = "0";
  seektimeupdate();
});
seekslider.addEventListener("mousedown", function (event) {
  seeking = true;
  seek(event);
});
seekslider.addEventListener("mousemove", function (event) {
  seek(event);
});
seekslider.addEventListener("mouseup", function () {
  seeking = false;
});
function seek(event) {
  if (seeking) {
    seekslider.value = event.clientX - seekslider.offsetLeft;
    seekto = audioControl.duration * (seekslider.value / 100);
    audioControl.currentTime = seekto;
  }
}
function seektimeupdate() {
  var nt = audioControl.currentTime * (100 / audioControl.duration);
  if (isNaN(nt)) {
    seekslider.value = "0";
  } else {
    seekslider.value = nt;
  }
  if (audioControl.currentTime === audioControl.duration) {
    document.getElementById("play").classList.remove("fa-pause");
    document.getElementById("play").classList.add("fa-play");
  }
}
function handleFiles(event) {
  var files = event.target.files;
  $("#src").attr("src", URL.createObjectURL(files[0]));
  document.getElementById("audio").load();
  seekslider.value = "0";
  document.getElementById("audioDiv").classList.remove("hide");
  if (document.getElementById("play").classList.contains("fa-pause")) {
    document.getElementById("play").classList.remove("fa-pause");
    document.getElementById("play").classList.add("fa-play");
  }

  // event.preventDefault();
}

document.getElementById("uploadDiv").addEventListener("change", handleFiles);
function audioControls(event) {
  if (event.target.id === "play") {
    if (document.getElementById("play").classList.contains("fa-play")) {
      audioControl.play();
      document.getElementById("play").classList.remove("fa-play");
      document.getElementById("play").classList.add("fa-pause");
    } else if (document.getElementById("play").classList.contains("fa-pause")) {
      audioControl.pause();
      document.getElementById("play").classList.remove("fa-pause");
      document.getElementById("play").classList.add("fa-play");
    }
  }
  if (event.target.id === "forward") {
    audioControl.currentTime += 5;
  }
  if (event.target.id === "backward") {
    audioControl.currentTime -= 5;
  }
  if (event.target.id === "volume-icon") {
    if (document.getElementById("volume-icon").classList.contains("fa-volume-xmark")) {
      document.getElementById("volume-icon").classList.remove("fa-volume-xmark");
      document.getElementById("volume-icon").classList.add("fa-volume-high");
      if (currentVolume === "0") {
        volumneControl.value = "25";
        audioControl.volume = "2.5";
      } else {
        audioControl.volume = currentVolume / 100;
        volumneControl.value = "" + currentVolume + "";
      }
    } else if (document.getElementById("volume-icon").classList.contains("fa-volume-high")) {
      audioControl.volume = 0;
      volumneControl.value = 0;
      document.getElementById("volume-icon").classList.remove("fa-volume-high");
      document.getElementById("volume-icon").classList.add("fa-volume-xmark");
    }
  }
}
function volumeChange(e) {
  currentVolume = volumneControl.value;
  audioControl.volume = e.currentTarget.value / 100;
  if (e.currentTarget.value === "0") {
    document.getElementById("volume-icon").classList.remove("fa-volume-high");
    document.getElementById("volume-icon").classList.add("fa-volume-xmark");
  } else if (document.getElementById("volume-icon").classList.contains("fa-volume-xmark")) {
    document.getElementById("volume-icon").classList.remove("fa-volume-xmark");
    document.getElementById("volume-icon").classList.add("fa-volume-high");
  }
}
volumneControl.addEventListener("change", volumeChange);
function visual() {
  audioCtx = audioCtx || new AudioContext();
  var ctx = canvas.getContext("2d");
  if (!audioSource) {
    audioSource = audioSource || audioCtx.createMediaElementSource(document.getElementById("audio"));
    analyser = audioCtx.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioCtx.destination);
  }
  filter = audioCtx.createBiquadFilter();
  audioSource.connect(filter);
  filter.connect(audioCtx.destination);
  ranges.forEach(function (range) {
    range.addEventListener("change", function () {
      filter.type = range.getAttribute("data-filter");
      filter.gain.value = range.getAttribute("data-param") === "gain" ? range.value : 0;
      filter.frequency.value = range.getAttribute("data-param") === "frequency" ? range.value : 0;
    });
  });
  var playPromise;
  if (playPromise !== undefined) {
    playPromise.then(function (_) {
      if (!audioControl.paused) {
        audioControl.play();
      } else {
        audioControl.pause();
      }
    }).catch(function (error) {});
  }
  analyser.fftSize = 128;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);
  var barWidth = canvas.width / 2 / bufferLength;
  var x = 0;
  function animate() {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    drawVisualizer({
      bufferLength: bufferLength,
      dataArray: dataArray,
      barWidth: barWidth
    });
    requestAnimationFrame(animate);
  }
  var drawVisualizer = function drawVisualizer(_ref) {
    var bufferLength = _ref.bufferLength,
      dataArray = _ref.dataArray,
      barWidth = _ref.barWidth;
    var barHeight;
    for (var i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i];
      ctx.fillStyle = "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")");
      ctx.fillRect(canvas.width / 2 - x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth;
    }
    for (var _i = 0; _i < bufferLength; _i++) {
      barHeight = dataArray[_i];
      ctx.fillStyle = "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")");
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth;
    }
  };
  animate();
}
document.getElementById("colorforChart").addEventListener("change", function (e) {
  r = parseInt(e.currentTarget.value.slice(1, 3), 16);
  g = parseInt(e.currentTarget.value.slice(3, 5), 16);
  b = parseInt(e.currentTarget.value.slice(5, 7), 16);
});
document.getElementById("app").addEventListener("click", visual);
document.getElementById("play").addEventListener("click", audioControls);
document.getElementById("forward").addEventListener("click", audioControls);
document.getElementById("backward").addEventListener("click", audioControls);
document.getElementById("volume").addEventListener("click", audioControls);
document.getElementById("playBackSpeed").addEventListener("change", function (e) {
  console.log(e.currentTarget.value);
  audioControl.playbackRate = e.currentTarget.value;
});
document.getElementById("equalizerSettings").addEventListener("click", function (e) {
  document.getElementById("equalizerDiv").classList.remove("hide");
  e.stopPropagation();
});
$(window).click(function () {
  if (!document.querySelector("#equalizerDiv").classList.contains("hide")) {
    document.getElementById("equalizerDiv").classList.add("hide");
  }
  //Hide the menus if visible
});

// Show loading animation.
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "41081" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map