/*! Element Plus v2.4.4 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ElementPlus = {}, global.Vue));
})(this, (function (exports, vue) { 'use strict';

  const FOCUSABLE_ELEMENT_SELECTORS = `a[href],button:not([disabled]),button:not([hidden]),:not([tabindex="-1"]),input:not([disabled]),input:not([type="hidden"]),select:not([disabled]),textarea:not([disabled])`;
  const isVisible = (element) => {
    const computed = getComputedStyle(element);
    return computed.position === "fixed" ? false : element.offsetParent !== null;
  };
  const obtainAllFocusableElements$1 = (element) => {
    return Array.from(element.querySelectorAll(FOCUSABLE_ELEMENT_SELECTORS)).filter((item) => isFocusable(item) && isVisible(item));
  };
  const isFocusable = (element) => {
    if (element.tabIndex > 0 || element.tabIndex === 0 && element.getAttribute("tabIndex") !== null) {
      return true;
    }
    if (element.disabled) {
      return false;
    }
    switch (element.nodeName) {
      case "A": {
        return !!element.href && element.rel !== "ignore";
      }
      case "INPUT": {
        return !(element.type === "hidden" || element.type === "file");
      }
      case "BUTTON":
      case "SELECT":
      case "TEXTAREA": {
        return true;
      }
      default: {
        return false;
      }
    }
  };
  const triggerEvent = function(elm, name, ...opts) {
    let eventName;
    if (name.includes("mouse") || name.includes("click")) {
      eventName = "MouseEvents";
    } else if (name.includes("key")) {
      eventName = "KeyboardEvent";
    } else {
      eventName = "HTMLEvents";
    }
    const evt = document.createEvent(eventName);
    evt.initEvent(name, ...opts);
    elm.dispatchEvent(evt);
    return elm;
  };
  const isLeaf = (el) => !el.getAttribute("aria-owns");
  const getSibling = (el, distance, elClass) => {
    const { parentNode } = el;
    if (!parentNode)
      return null;
    const siblings = parentNode.querySelectorAll(elClass);
    const index = Array.prototype.indexOf.call(siblings, el);
    return siblings[index + distance] || null;
  };
  const focusNode = (el) => {
    if (!el)
      return;
    el.focus();
    !isLeaf(el) && el.click();
  };

  const composeEventHandlers = (theirsHandler, oursHandler, { checkForDefaultPrevented = true } = {}) => {
    const handleEvent = (event) => {
      const shouldPrevent = theirsHandler == null ? void 0 : theirsHandler(event);
      if (checkForDefaultPrevented === false || !shouldPrevent) {
        return oursHandler == null ? void 0 : oursHandler(event);
      }
    };
    return handleEvent;
  };
  const whenMouse = (handler) => {
    return (e) => e.pointerType === "mouse" ? handler(e) : void 0;
  };

  var __defProp$9 = Object.defineProperty;
  var __defProps$6 = Object.defineProperties;
  var __getOwnPropDescs$6 = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols$b = Object.getOwnPropertySymbols;
  var __hasOwnProp$b = Object.prototype.hasOwnProperty;
  var __propIsEnum$b = Object.prototype.propertyIsEnumerable;
  var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues$9 = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp$b.call(b, prop))
        __defNormalProp$9(a, prop, b[prop]);
    if (__getOwnPropSymbols$b)
      for (var prop of __getOwnPropSymbols$b(b)) {
        if (__propIsEnum$b.call(b, prop))
          __defNormalProp$9(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps$6 = (a, b) => __defProps$6(a, __getOwnPropDescs$6(b));
  function computedEager(fn, options) {
    var _a;
    const result = vue.shallowRef();
    vue.watchEffect(() => {
      result.value = fn();
    }, __spreadProps$6(__spreadValues$9({}, options), {
      flush: (_a = options == null ? void 0 : options.flush) != null ? _a : "sync"
    }));
    return vue.readonly(result);
  }

  var _a;
  const isClient = typeof window !== "undefined";
  const isDef = (val) => typeof val !== "undefined";
  const isString$2 = (val) => typeof val === "string";
  const noop$1 = () => {
  };
  const isIOS = isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);

  function resolveUnref(r) {
    return typeof r === "function" ? r() : vue.unref(r);
  }

  function createFilterWrapper(filter, fn) {
    function wrapper(...args) {
      filter(() => fn.apply(this, args), { fn, thisArg: this, args });
    }
    return wrapper;
  }
  function debounceFilter(ms, options = {}) {
    let timer;
    let maxTimer;
    const filter = (invoke) => {
      const duration = resolveUnref(ms);
      const maxDuration = resolveUnref(options.maxWait);
      if (timer)
        clearTimeout(timer);
      if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
        if (maxTimer) {
          clearTimeout(maxTimer);
          maxTimer = null;
        }
        return invoke();
      }
      if (maxDuration && !maxTimer) {
        maxTimer = setTimeout(() => {
          if (timer)
            clearTimeout(timer);
          maxTimer = null;
          invoke();
        }, maxDuration);
      }
      timer = setTimeout(() => {
        if (maxTimer)
          clearTimeout(maxTimer);
        maxTimer = null;
        invoke();
      }, duration);
    };
    return filter;
  }
  function throttleFilter(ms, trailing = true, leading = true) {
    let lastExec = 0;
    let timer;
    let isLeading = true;
    const clear = () => {
      if (timer) {
        clearTimeout(timer);
        timer = void 0;
      }
    };
    const filter = (invoke) => {
      const duration = resolveUnref(ms);
      const elapsed = Date.now() - lastExec;
      clear();
      if (duration <= 0) {
        lastExec = Date.now();
        return invoke();
      }
      if (elapsed > duration && (leading || !isLeading)) {
        lastExec = Date.now();
        invoke();
      } else if (trailing) {
        timer = setTimeout(() => {
          lastExec = Date.now();
          isLeading = true;
          clear();
          invoke();
        }, duration);
      }
      if (!leading && !timer)
        timer = setTimeout(() => isLeading = true, duration);
      isLeading = false;
    };
    return filter;
  }
  function identity$1(arg) {
    return arg;
  }

  function tryOnScopeDispose(fn) {
    if (vue.getCurrentScope()) {
      vue.onScopeDispose(fn);
      return true;
    }
    return false;
  }

  function useDebounceFn(fn, ms = 200, options = {}) {
    return createFilterWrapper(debounceFilter(ms, options), fn);
  }

  function refDebounced(value, ms = 200, options = {}) {
    if (ms <= 0)
      return value;
    const debounced = vue.ref(value.value);
    const updater = useDebounceFn(() => {
      debounced.value = value.value;
    }, ms, options);
    vue.watch(value, () => updater());
    return debounced;
  }

  function useThrottleFn(fn, ms = 200, trailing = false, leading = true) {
    return createFilterWrapper(throttleFilter(ms, trailing, leading), fn);
  }

  function tryOnMounted(fn, sync = true) {
    if (vue.getCurrentInstance())
      vue.onMounted(fn);
    else if (sync)
      fn();
    else
      vue.nextTick(fn);
  }

  function useTimeoutFn(cb, interval, options = {}) {
    const {
      immediate = true
    } = options;
    const isPending = vue.ref(false);
    let timer = null;
    function clear() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }
    function stop() {
      isPending.value = false;
      clear();
    }
    function start(...args) {
      clear();
      isPending.value = true;
      timer = setTimeout(() => {
        isPending.value = false;
        timer = null;
        cb(...args);
      }, resolveUnref(interval));
    }
    if (immediate) {
      isPending.value = true;
      if (isClient)
        start();
    }
    tryOnScopeDispose(stop);
    return {
      isPending,
      start,
      stop
    };
  }

  function unrefElement(elRef) {
    var _a;
    const plain = resolveUnref(elRef);
    return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
  }

  const defaultWindow = isClient ? window : void 0;
  const defaultDocument = isClient ? window.document : void 0;

  function useEventListener(...args) {
    let target;
    let event;
    let listener;
    let options;
    if (isString$2(args[0])) {
      [event, listener, options] = args;
      target = defaultWindow;
    } else {
      [target, event, listener, options] = args;
    }
    if (!target)
      return noop$1;
    let cleanup = noop$1;
    const stopWatch = vue.watch(() => unrefElement(target), (el) => {
      cleanup();
      if (!el)
        return;
      el.addEventListener(event, listener, options);
      cleanup = () => {
        el.removeEventListener(event, listener, options);
        cleanup = noop$1;
      };
    }, { immediate: true, flush: "post" });
    const stop = () => {
      stopWatch();
      cleanup();
    };
    tryOnScopeDispose(stop);
    return stop;
  }

  function onClickOutside(target, handler, options = {}) {
    const { window = defaultWindow, ignore, capture = true, detectIframe = false } = options;
    if (!window)
      return;
    const shouldListen = vue.ref(true);
    let fallback;
    const listener = (event) => {
      window.clearTimeout(fallback);
      const el = unrefElement(target);
      const composedPath = event.composedPath();
      if (!el || el === event.target || composedPath.includes(el) || !shouldListen.value)
        return;
      if (ignore && ignore.length > 0) {
        if (ignore.some((target2) => {
          const el2 = unrefElement(target2);
          return el2 && (event.target === el2 || composedPath.includes(el2));
        }))
          return;
      }
      handler(event);
    };
    const cleanup = [
      useEventListener(window, "click", listener, { passive: true, capture }),
      useEventListener(window, "pointerdown", (e) => {
        const el = unrefElement(target);
        shouldListen.value = !!el && !e.composedPath().includes(el);
      }, { passive: true }),
      useEventListener(window, "pointerup", (e) => {
        if (e.button === 0) {
          const path = e.composedPath();
          e.composedPath = () => path;
          fallback = window.setTimeout(() => listener(e), 50);
        }
      }, { passive: true }),
      detectIframe && useEventListener(window, "blur", (event) => {
        var _a;
        const el = unrefElement(target);
        if (((_a = document.activeElement) == null ? void 0 : _a.tagName) === "IFRAME" && !(el == null ? void 0 : el.contains(document.activeElement)))
          handler(event);
      })
    ].filter(Boolean);
    const stop = () => cleanup.forEach((fn) => fn());
    return stop;
  }

  function useSupported(callback, sync = false) {
    const isSupported = vue.ref();
    const update = () => isSupported.value = Boolean(callback());
    update();
    tryOnMounted(update, sync);
    return isSupported;
  }

  const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  const globalKey = "__vueuse_ssr_handlers__";
  _global[globalKey] = _global[globalKey] || {};
  _global[globalKey];

  function useCssVar(prop, target, { window = defaultWindow, initialValue = "" } = {}) {
    const variable = vue.ref(initialValue);
    const elRef = vue.computed(() => {
      var _a;
      return unrefElement(target) || ((_a = window == null ? void 0 : window.document) == null ? void 0 : _a.documentElement);
    });
    vue.watch([elRef, () => resolveUnref(prop)], ([el, prop2]) => {
      var _a;
      if (el && window) {
        const value = (_a = window.getComputedStyle(el).getPropertyValue(prop2)) == null ? void 0 : _a.trim();
        variable.value = value || initialValue;
      }
    }, { immediate: true });
    vue.watch(variable, (val) => {
      var _a;
      if ((_a = elRef.value) == null ? void 0 : _a.style)
        elRef.value.style.setProperty(resolveUnref(prop), val);
    });
    return variable;
  }

  function useDocumentVisibility({ document = defaultDocument } = {}) {
    if (!document)
      return vue.ref("visible");
    const visibility = vue.ref(document.visibilityState);
    useEventListener(document, "visibilitychange", () => {
      visibility.value = document.visibilityState;
    });
    return visibility;
  }

  var __getOwnPropSymbols$f = Object.getOwnPropertySymbols;
  var __hasOwnProp$f = Object.prototype.hasOwnProperty;
  var __propIsEnum$f = Object.prototype.propertyIsEnumerable;
  var __objRest$2 = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$f.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$f)
      for (var prop of __getOwnPropSymbols$f(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$f.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  function useResizeObserver(target, callback, options = {}) {
    const _a = options, { window = defaultWindow } = _a, observerOptions = __objRest$2(_a, ["window"]);
    let observer;
    const isSupported = useSupported(() => window && "ResizeObserver" in window);
    const cleanup = () => {
      if (observer) {
        observer.disconnect();
        observer = void 0;
      }
    };
    const stopWatch = vue.watch(() => unrefElement(target), (el) => {
      cleanup();
      if (isSupported.value && window && el) {
        observer = new ResizeObserver(callback);
        observer.observe(el, observerOptions);
      }
    }, { immediate: true, flush: "post" });
    const stop = () => {
      cleanup();
      stopWatch();
    };
    tryOnScopeDispose(stop);
    return {
      isSupported,
      stop
    };
  }

  function useElementBounding(target, options = {}) {
    const {
      reset = true,
      windowResize = true,
      windowScroll = true,
      immediate = true
    } = options;
    const height = vue.ref(0);
    const bottom = vue.ref(0);
    const left = vue.ref(0);
    const right = vue.ref(0);
    const top = vue.ref(0);
    const width = vue.ref(0);
    const x = vue.ref(0);
    const y = vue.ref(0);
    function update() {
      const el = unrefElement(target);
      if (!el) {
        if (reset) {
          height.value = 0;
          bottom.value = 0;
          left.value = 0;
          right.value = 0;
          top.value = 0;
          width.value = 0;
          x.value = 0;
          y.value = 0;
        }
        return;
      }
      const rect = el.getBoundingClientRect();
      height.value = rect.height;
      bottom.value = rect.bottom;
      left.value = rect.left;
      right.value = rect.right;
      top.value = rect.top;
      width.value = rect.width;
      x.value = rect.x;
      y.value = rect.y;
    }
    useResizeObserver(target, update);
    vue.watch(() => unrefElement(target), (ele) => !ele && update());
    if (windowScroll)
      useEventListener("scroll", update, { passive: true });
    if (windowResize)
      useEventListener("resize", update, { passive: true });
    tryOnMounted(() => {
      if (immediate)
        update();
    });
    return {
      height,
      bottom,
      left,
      right,
      top,
      width,
      x,
      y,
      update
    };
  }

  var __getOwnPropSymbols$7 = Object.getOwnPropertySymbols;
  var __hasOwnProp$7 = Object.prototype.hasOwnProperty;
  var __propIsEnum$7 = Object.prototype.propertyIsEnumerable;
  var __objRest$1 = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp$7.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols$7)
      for (var prop of __getOwnPropSymbols$7(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum$7.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };
  function useMutationObserver(target, callback, options = {}) {
    const _a = options, { window = defaultWindow } = _a, mutationOptions = __objRest$1(_a, ["window"]);
    let observer;
    const isSupported = useSupported(() => window && "MutationObserver" in window);
    const cleanup = () => {
      if (observer) {
        observer.disconnect();
        observer = void 0;
      }
    };
    const stopWatch = vue.watch(() => unrefElement(target), (el) => {
      cleanup();
      if (isSupported.value && window && el) {
        observer = new MutationObserver(callback);
        observer.observe(el, mutationOptions);
      }
    }, { immediate: true });
    const stop = () => {
      cleanup();
      stopWatch();
    };
    tryOnScopeDispose(stop);
    return {
      isSupported,
      stop
    };
  }

  var SwipeDirection;
  (function(SwipeDirection2) {
    SwipeDirection2["UP"] = "UP";
    SwipeDirection2["RIGHT"] = "RIGHT";
    SwipeDirection2["DOWN"] = "DOWN";
    SwipeDirection2["LEFT"] = "LEFT";
    SwipeDirection2["NONE"] = "NONE";
  })(SwipeDirection || (SwipeDirection = {}));

  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  const _TransitionPresets = {
    easeInSine: [0.12, 0, 0.39, 0],
    easeOutSine: [0.61, 1, 0.88, 1],
    easeInOutSine: [0.37, 0, 0.63, 1],
    easeInQuad: [0.11, 0, 0.5, 0],
    easeOutQuad: [0.5, 1, 0.89, 1],
    easeInOutQuad: [0.45, 0, 0.55, 1],
    easeInCubic: [0.32, 0, 0.67, 0],
    easeOutCubic: [0.33, 1, 0.68, 1],
    easeInOutCubic: [0.65, 0, 0.35, 1],
    easeInQuart: [0.5, 0, 0.75, 0],
    easeOutQuart: [0.25, 1, 0.5, 1],
    easeInOutQuart: [0.76, 0, 0.24, 1],
    easeInQuint: [0.64, 0, 0.78, 0],
    easeOutQuint: [0.22, 1, 0.36, 1],
    easeInOutQuint: [0.83, 0, 0.17, 1],
    easeInExpo: [0.7, 0, 0.84, 0],
    easeOutExpo: [0.16, 1, 0.3, 1],
    easeInOutExpo: [0.87, 0, 0.13, 1],
    easeInCirc: [0.55, 0, 1, 0.45],
    easeOutCirc: [0, 0.55, 0.45, 1],
    easeInOutCirc: [0.85, 0, 0.15, 1],
    easeInBack: [0.36, 0, 0.66, -0.56],
    easeOutBack: [0.34, 1.56, 0.64, 1],
    easeInOutBack: [0.68, -0.6, 0.32, 1.6]
  };
  __spreadValues({
    linear: identity$1
  }, _TransitionPresets);

  function useVModel(props, key, emit, options = {}) {
    var _a, _b, _c;
    const {
      passive = false,
      eventName,
      deep = false,
      defaultValue
    } = options;
    const vm = vue.getCurrentInstance();
    const _emit = emit || (vm == null ? void 0 : vm.emit) || ((_a = vm == null ? void 0 : vm.$emit) == null ? void 0 : _a.bind(vm)) || ((_c = (_b = vm == null ? void 0 : vm.proxy) == null ? void 0 : _b.$emit) == null ? void 0 : _c.bind(vm == null ? void 0 : vm.proxy));
    let event = eventName;
    if (!key) {
      {
        key = "modelValue";
      }
    }
    event = eventName || event || `update:${key.toString()}`;
    const getValue = () => isDef(props[key]) ? props[key] : defaultValue;
    if (passive) {
      const proxy = vue.ref(getValue());
      vue.watch(() => props[key], (v) => proxy.value = v);
      vue.watch(proxy, (v) => {
        if (v !== props[key] || deep)
          _emit(event, v);
      }, {
        deep
      });
      return proxy;
    } else {
      return vue.computed({
        get() {
          return getValue();
        },
        set(value) {
          _emit(event, value);
        }
      });
    }
  }

  function useWindowFocus({ window = defaultWindow } = {}) {
    if (!window)
      return vue.ref(false);
    const focused = vue.ref(window.document.hasFocus());
    useEventListener(window, "blur", () => {
      focused.value = false;
    });
    useEventListener(window, "focus", () => {
      focused.value = true;
    });
    return focused;
  }

  function useWindowSize(options = {}) {
    const {
      window = defaultWindow,
      initialWidth = Infinity,
      initialHeight = Infinity,
      listenOrientation = true
    } = options;
    const width = vue.ref(initialWidth);
    const height = vue.ref(initialHeight);
    const update = () => {
      if (window) {
        width.value = window.innerWidth;
        height.value = window.innerHeight;
      }
    };
    update();
    tryOnMounted(update);
    useEventListener("resize", update, { passive: true });
    if (listenOrientation)
      useEventListener("orientationchange", update, { passive: true });
    return { width, height };
  }

  const isFirefox = () => isClient && /firefox/i.test(window.navigator.userAgent);

  const isInContainer = (el, container) => {
    if (!isClient || !el || !container)
      return false;
    const elRect = el.getBoundingClientRect();
    let containerRect;
    if (container instanceof Element) {
      containerRect = container.getBoundingClientRect();
    } else {
      containerRect = {
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
        left: 0
      };
    }
    return elRect.top < containerRect.bottom && elRect.bottom > containerRect.top && elRect.right > containerRect.left && elRect.left < containerRect.right;
  };
  const getOffsetTop = (el) => {
    let offset = 0;
    let parent = el;
    while (parent) {
      offset += parent.offsetTop;
      parent = parent.offsetParent;
    }
    return offset;
  };
  const getOffsetTopDistance = (el, containerEl) => {
    return Math.abs(getOffsetTop(el) - getOffsetTop(containerEl));
  };
  const getClientXY = (event) => {
    let clientX;
    let clientY;
    if (event.type === "touchend") {
      clientY = event.changedTouches[0].clientY;
      clientX = event.changedTouches[0].clientX;
    } else if (event.type.startsWith("touch")) {
      clientY = event.touches[0].clientY;
      clientX = event.touches[0].clientX;
    } else {
      clientY = event.clientY;
      clientX = event.clientX;
    }
    return {
      clientX,
      clientY
    };
  };

  const NOOP = () => {
  };
  const hasOwnProperty$p = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$p.call(val, key);
  const isArray$1 = Array.isArray;
  const isDate$1 = (val) => toTypeString(val) === "[object Date]";
  const isFunction$1 = (val) => typeof val === "function";
  const isString$1 = (val) => typeof val === "string";
  const isObject$1 = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => {
    return isObject$1(val) && isFunction$1(val.then) && isFunction$1(val.catch);
  };
  const objectToString$1 = Object.prototype.toString;
  const toTypeString = (value) => objectToString$1.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
  const cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return (str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  };
  const camelizeRE = /-(\w)/g;
  const camelize = cacheStringFunction((str) => {
    return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
  });
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
  const capitalize$2 = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));

  var freeGlobal = typeof global == "object" && global && global.Object === Object && global;

  var freeSelf = typeof self == "object" && self && self.Object === Object && self;
  var root = freeGlobal || freeSelf || Function("return this")();

  var Symbol$1 = root.Symbol;

  var objectProto$s = Object.prototype;
  var hasOwnProperty$o = objectProto$s.hasOwnProperty;
  var nativeObjectToString$3 = objectProto$s.toString;
  var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
  function getRawTag(value) {
    var isOwn = hasOwnProperty$o.call(value, symToStringTag$1), tag = value[symToStringTag$1];
    try {
      value[symToStringTag$1] = void 0;
      var unmasked = true;
    } catch (e) {
    }
    var result = nativeObjectToString$3.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }

  var objectProto$r = Object.prototype;
  var nativeObjectToString$2 = objectProto$r.toString;
  function objectToString(value) {
    return nativeObjectToString$2.call(value);
  }

  var nullTag = "[object Null]";
  var undefinedTag = "[object Undefined]";
  var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
  function baseGetTag(value) {
    if (value == null) {
      return value === void 0 ? undefinedTag : nullTag;
    }
    return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
  }

  function isObjectLike(value) {
    return value != null && typeof value == "object";
  }

  var symbolTag$3 = "[object Symbol]";
  function isSymbol(value) {
    return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag$3;
  }

  var NAN$2 = 0 / 0;
  function baseToNumber(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol(value)) {
      return NAN$2;
    }
    return +value;
  }

  function arrayMap(array, iteratee) {
    var index = -1, length = array == null ? 0 : array.length, result = Array(length);
    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  var isArray = Array.isArray;

  var INFINITY$5 = 1 / 0;
  var symbolProto$2 = Symbol$1 ? Symbol$1.prototype : void 0;
  var symbolToString = symbolProto$2 ? symbolProto$2.toString : void 0;
  function baseToString(value) {
    if (typeof value == "string") {
      return value;
    }
    if (isArray(value)) {
      return arrayMap(value, baseToString) + "";
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : "";
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY$5 ? "-0" : result;
  }

  function createMathOperation(operator, defaultValue) {
    return function(value, other) {
      var result;
      if (value === void 0 && other === void 0) {
        return defaultValue;
      }
      if (value !== void 0) {
        result = value;
      }
      if (other !== void 0) {
        if (result === void 0) {
          return other;
        }
        if (typeof value == "string" || typeof other == "string") {
          value = baseToString(value);
          other = baseToString(other);
        } else {
          value = baseToNumber(value);
          other = baseToNumber(other);
        }
        result = operator(value, other);
      }
      return result;
    };
  }

  var add = createMathOperation(function(augend, addend) {
    return augend + addend;
  }, 0);

  var reWhitespace = /\s/;
  function trimmedEndIndex(string) {
    var index = string.length;
    while (index-- && reWhitespace.test(string.charAt(index))) {
    }
    return index;
  }

  var reTrimStart$2 = /^\s+/;
  function baseTrim(string) {
    return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart$2, "") : string;
  }

  function isObject(value) {
    var type = typeof value;
    return value != null && (type == "object" || type == "function");
  }

  var NAN$1 = 0 / 0;
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  var reIsBinary = /^0b[01]+$/i;
  var reIsOctal = /^0o[0-7]+$/i;
  var freeParseInt = parseInt;
  function toNumber(value) {
    if (typeof value == "number") {
      return value;
    }
    if (isSymbol(value)) {
      return NAN$1;
    }
    if (isObject(value)) {
      var other = typeof value.valueOf == "function" ? value.valueOf() : value;
      value = isObject(other) ? other + "" : other;
    }
    if (typeof value != "string") {
      return value === 0 ? value : +value;
    }
    value = baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN$1 : +value;
  }

  var INFINITY$4 = 1 / 0;
  var MAX_INTEGER = 17976931348623157e292;
  function toFinite(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY$4 || value === -INFINITY$4) {
      var sign = value < 0 ? -1 : 1;
      return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
  }

  function toInteger(value) {
    var result = toFinite(value), remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
  }

  var FUNC_ERROR_TEXT$b = "Expected a function";
  function after(n, func) {
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$b);
    }
    n = toInteger(n);
    return function() {
      if (--n < 1) {
        return func.apply(this, arguments);
      }
    };
  }

  function identity(value) {
    return value;
  }

  var asyncTag = "[object AsyncFunction]";
  var funcTag$2 = "[object Function]";
  var genTag$1 = "[object GeneratorFunction]";
  var proxyTag = "[object Proxy]";
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    var tag = baseGetTag(value);
    return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
  }

  var coreJsData = root["__core-js_shared__"];

  var maskSrcKey = function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
    return uid ? "Symbol(src)_1." + uid : "";
  }();
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }

  var funcProto$2 = Function.prototype;
  var funcToString$2 = funcProto$2.toString;
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString$2.call(func);
      } catch (e) {
      }
      try {
        return func + "";
      } catch (e) {
      }
    }
    return "";
  }

  var reRegExpChar$1 = /[\\^$.*+?()[\]{}|]/g;
  var reIsHostCtor = /^\[object .+?Constructor\]$/;
  var funcProto$1 = Function.prototype;
  var objectProto$q = Object.prototype;
  var funcToString$1 = funcProto$1.toString;
  var hasOwnProperty$n = objectProto$q.hasOwnProperty;
  var reIsNative = RegExp("^" + funcToString$1.call(hasOwnProperty$n).replace(reRegExpChar$1, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  function getValue$1(object, key) {
    return object == null ? void 0 : object[key];
  }

  function getNative(object, key) {
    var value = getValue$1(object, key);
    return baseIsNative(value) ? value : void 0;
  }

  var WeakMap = getNative(root, "WeakMap");

  var metaMap = WeakMap && new WeakMap();

  var baseSetData = !metaMap ? identity : function(func, data) {
    metaMap.set(func, data);
    return func;
  };

  var objectCreate = Object.create;
  var baseCreate = function() {
    function object() {
    }
    return function(proto) {
      if (!isObject(proto)) {
        return {};
      }
      if (objectCreate) {
        return objectCreate(proto);
      }
      object.prototype = proto;
      var result = new object();
      object.prototype = void 0;
      return result;
    };
  }();

  function createCtor(Ctor) {
    return function() {
      var args = arguments;
      switch (args.length) {
        case 0:
          return new Ctor();
        case 1:
          return new Ctor(args[0]);
        case 2:
          return new Ctor(args[0], args[1]);
        case 3:
          return new Ctor(args[0], args[1], args[2]);
        case 4:
          return new Ctor(args[0], args[1], args[2], args[3]);
        case 5:
          return new Ctor(args[0], args[1], args[2], args[3], args[4]);
        case 6:
          return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
        case 7:
          return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
      }
      var thisBinding = baseCreate(Ctor.prototype), result = Ctor.apply(thisBinding, args);
      return isObject(result) ? result : thisBinding;
    };
  }

  var WRAP_BIND_FLAG$8 = 1;
  function createBind(func, bitmask, thisArg) {
    var isBind = bitmask & WRAP_BIND_FLAG$8, Ctor = createCtor(func);
    function wrapper() {
      var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
      return fn.apply(isBind ? thisArg : this, arguments);
    }
    return wrapper;
  }

  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0:
        return func.call(thisArg);
      case 1:
        return func.call(thisArg, args[0]);
      case 2:
        return func.call(thisArg, args[0], args[1]);
      case 3:
        return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  var nativeMax$g = Math.max;
  function composeArgs(args, partials, holders, isCurried) {
    var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax$g(argsLength - holdersLength, 0), result = Array(leftLength + rangeLength), isUncurried = !isCurried;
    while (++leftIndex < leftLength) {
      result[leftIndex] = partials[leftIndex];
    }
    while (++argsIndex < holdersLength) {
      if (isUncurried || argsIndex < argsLength) {
        result[holders[argsIndex]] = args[argsIndex];
      }
    }
    while (rangeLength--) {
      result[leftIndex++] = args[argsIndex++];
    }
    return result;
  }

  var nativeMax$f = Math.max;
  function composeArgsRight(args, partials, holders, isCurried) {
    var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax$f(argsLength - holdersLength, 0), result = Array(rangeLength + rightLength), isUncurried = !isCurried;
    while (++argsIndex < rangeLength) {
      result[argsIndex] = args[argsIndex];
    }
    var offset = argsIndex;
    while (++rightIndex < rightLength) {
      result[offset + rightIndex] = partials[rightIndex];
    }
    while (++holdersIndex < holdersLength) {
      if (isUncurried || argsIndex < argsLength) {
        result[offset + holders[holdersIndex]] = args[argsIndex++];
      }
    }
    return result;
  }

  function countHolders(array, placeholder) {
    var length = array.length, result = 0;
    while (length--) {
      if (array[length] === placeholder) {
        ++result;
      }
    }
    return result;
  }

  function baseLodash() {
  }

  var MAX_ARRAY_LENGTH$6 = 4294967295;
  function LazyWrapper(value) {
    this.__wrapped__ = value;
    this.__actions__ = [];
    this.__dir__ = 1;
    this.__filtered__ = false;
    this.__iteratees__ = [];
    this.__takeCount__ = MAX_ARRAY_LENGTH$6;
    this.__views__ = [];
  }
  LazyWrapper.prototype = baseCreate(baseLodash.prototype);
  LazyWrapper.prototype.constructor = LazyWrapper;

  function noop() {
  }

  var getData = !metaMap ? noop : function(func) {
    return metaMap.get(func);
  };

  var realNames = {};

  var objectProto$p = Object.prototype;
  var hasOwnProperty$m = objectProto$p.hasOwnProperty;
  function getFuncName(func) {
    var result = func.name + "", array = realNames[result], length = hasOwnProperty$m.call(realNames, result) ? array.length : 0;
    while (length--) {
      var data = array[length], otherFunc = data.func;
      if (otherFunc == null || otherFunc == func) {
        return data.name;
      }
    }
    return result;
  }

  function LodashWrapper(value, chainAll) {
    this.__wrapped__ = value;
    this.__actions__ = [];
    this.__chain__ = !!chainAll;
    this.__index__ = 0;
    this.__values__ = void 0;
  }
  LodashWrapper.prototype = baseCreate(baseLodash.prototype);
  LodashWrapper.prototype.constructor = LodashWrapper;

  function copyArray(source, array) {
    var index = -1, length = source.length;
    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }

  function wrapperClone(wrapper) {
    if (wrapper instanceof LazyWrapper) {
      return wrapper.clone();
    }
    var result = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
    result.__actions__ = copyArray(wrapper.__actions__);
    result.__index__ = wrapper.__index__;
    result.__values__ = wrapper.__values__;
    return result;
  }

  var objectProto$o = Object.prototype;
  var hasOwnProperty$l = objectProto$o.hasOwnProperty;
  function lodash(value) {
    if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
      if (value instanceof LodashWrapper) {
        return value;
      }
      if (hasOwnProperty$l.call(value, "__wrapped__")) {
        return wrapperClone(value);
      }
    }
    return new LodashWrapper(value);
  }
  lodash.prototype = baseLodash.prototype;
  lodash.prototype.constructor = lodash;

  function isLaziable(func) {
    var funcName = getFuncName(func), other = lodash[funcName];
    if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) {
      return false;
    }
    if (func === other) {
      return true;
    }
    var data = getData(other);
    return !!data && func === data[0];
  }

  var HOT_COUNT = 800;
  var HOT_SPAN = 16;
  var nativeNow = Date.now;
  function shortOut(func) {
    var count = 0, lastCalled = 0;
    return function() {
      var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(void 0, arguments);
    };
  }

  var setData = shortOut(baseSetData);

  var reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/;
  var reSplitDetails = /,? & /;
  function getWrapDetails(source) {
    var match = source.match(reWrapDetails);
    return match ? match[1].split(reSplitDetails) : [];
  }

  var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;
  function insertWrapDetails(source, details) {
    var length = details.length;
    if (!length) {
      return source;
    }
    var lastIndex = length - 1;
    details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
    details = details.join(length > 2 ? ", " : " ");
    return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
  }

  function constant(value) {
    return function() {
      return value;
    };
  }

  var defineProperty = function() {
    try {
      var func = getNative(Object, "defineProperty");
      func({}, "", {});
      return func;
    } catch (e) {
    }
  }();

  var baseSetToString = !defineProperty ? identity : function(func, string) {
    return defineProperty(func, "toString", {
      "configurable": true,
      "enumerable": false,
      "value": constant(string),
      "writable": true
    });
  };

  var setToString = shortOut(baseSetToString);

  function arrayEach(array, iteratee) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
    while (fromRight ? index-- : ++index < length) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  function baseIsNaN(value) {
    return value !== value;
  }

  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1, length = array.length;
    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  function baseIndexOf(array, value, fromIndex) {
    return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
  }

  function arrayIncludes(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseIndexOf(array, value, 0) > -1;
  }

  var WRAP_BIND_FLAG$7 = 1;
  var WRAP_BIND_KEY_FLAG$6 = 2;
  var WRAP_CURRY_FLAG$6 = 8;
  var WRAP_CURRY_RIGHT_FLAG$3 = 16;
  var WRAP_PARTIAL_FLAG$6 = 32;
  var WRAP_PARTIAL_RIGHT_FLAG$3 = 64;
  var WRAP_ARY_FLAG$4 = 128;
  var WRAP_REARG_FLAG$3 = 256;
  var WRAP_FLIP_FLAG$2 = 512;
  var wrapFlags = [
    ["ary", WRAP_ARY_FLAG$4],
    ["bind", WRAP_BIND_FLAG$7],
    ["bindKey", WRAP_BIND_KEY_FLAG$6],
    ["curry", WRAP_CURRY_FLAG$6],
    ["curryRight", WRAP_CURRY_RIGHT_FLAG$3],
    ["flip", WRAP_FLIP_FLAG$2],
    ["partial", WRAP_PARTIAL_FLAG$6],
    ["partialRight", WRAP_PARTIAL_RIGHT_FLAG$3],
    ["rearg", WRAP_REARG_FLAG$3]
  ];
  function updateWrapDetails(details, bitmask) {
    arrayEach(wrapFlags, function(pair) {
      var value = "_." + pair[0];
      if (bitmask & pair[1] && !arrayIncludes(details, value)) {
        details.push(value);
      }
    });
    return details.sort();
  }

  function setWrapToString(wrapper, reference, bitmask) {
    var source = reference + "";
    return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
  }

  var WRAP_BIND_FLAG$6 = 1;
  var WRAP_BIND_KEY_FLAG$5 = 2;
  var WRAP_CURRY_BOUND_FLAG$1 = 4;
  var WRAP_CURRY_FLAG$5 = 8;
  var WRAP_PARTIAL_FLAG$5 = 32;
  var WRAP_PARTIAL_RIGHT_FLAG$2 = 64;
  function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary, arity) {
    var isCurry = bitmask & WRAP_CURRY_FLAG$5, newHolders = isCurry ? holders : void 0, newHoldersRight = isCurry ? void 0 : holders, newPartials = isCurry ? partials : void 0, newPartialsRight = isCurry ? void 0 : partials;
    bitmask |= isCurry ? WRAP_PARTIAL_FLAG$5 : WRAP_PARTIAL_RIGHT_FLAG$2;
    bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG$2 : WRAP_PARTIAL_FLAG$5);
    if (!(bitmask & WRAP_CURRY_BOUND_FLAG$1)) {
      bitmask &= ~(WRAP_BIND_FLAG$6 | WRAP_BIND_KEY_FLAG$5);
    }
    var newData = [
      func,
      bitmask,
      thisArg,
      newPartials,
      newHolders,
      newPartialsRight,
      newHoldersRight,
      argPos,
      ary,
      arity
    ];
    var result = wrapFunc.apply(void 0, newData);
    if (isLaziable(func)) {
      setData(result, newData);
    }
    result.placeholder = placeholder;
    return setWrapToString(result, func, bitmask);
  }

  function getHolder(func) {
    var object = func;
    return object.placeholder;
  }

  var MAX_SAFE_INTEGER$5 = 9007199254740991;
  var reIsUint = /^(?:0|[1-9]\d*)$/;
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER$5 : length;
    return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
  }

  var nativeMin$e = Math.min;
  function reorder(array, indexes) {
    var arrLength = array.length, length = nativeMin$e(indexes.length, arrLength), oldArray = copyArray(array);
    while (length--) {
      var index = indexes[length];
      array[length] = isIndex(index, arrLength) ? oldArray[index] : void 0;
    }
    return array;
  }

  var PLACEHOLDER$1 = "__lodash_placeholder__";
  function replaceHolders(array, placeholder) {
    var index = -1, length = array.length, resIndex = 0, result = [];
    while (++index < length) {
      var value = array[index];
      if (value === placeholder || value === PLACEHOLDER$1) {
        array[index] = PLACEHOLDER$1;
        result[resIndex++] = index;
      }
    }
    return result;
  }

  var WRAP_BIND_FLAG$5 = 1;
  var WRAP_BIND_KEY_FLAG$4 = 2;
  var WRAP_CURRY_FLAG$4 = 8;
  var WRAP_CURRY_RIGHT_FLAG$2 = 16;
  var WRAP_ARY_FLAG$3 = 128;
  var WRAP_FLIP_FLAG$1 = 512;
  function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary, arity) {
    var isAry = bitmask & WRAP_ARY_FLAG$3, isBind = bitmask & WRAP_BIND_FLAG$5, isBindKey = bitmask & WRAP_BIND_KEY_FLAG$4, isCurried = bitmask & (WRAP_CURRY_FLAG$4 | WRAP_CURRY_RIGHT_FLAG$2), isFlip = bitmask & WRAP_FLIP_FLAG$1, Ctor = isBindKey ? void 0 : createCtor(func);
    function wrapper() {
      var length = arguments.length, args = Array(length), index = length;
      while (index--) {
        args[index] = arguments[index];
      }
      if (isCurried) {
        var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
      }
      if (partials) {
        args = composeArgs(args, partials, holders, isCurried);
      }
      if (partialsRight) {
        args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
      }
      length -= holdersCount;
      if (isCurried && length < arity) {
        var newHolders = replaceHolders(args, placeholder);
        return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary, arity - length);
      }
      var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
      length = args.length;
      if (argPos) {
        args = reorder(args, argPos);
      } else if (isFlip && length > 1) {
        args.reverse();
      }
      if (isAry && ary < length) {
        args.length = ary;
      }
      if (this && this !== root && this instanceof wrapper) {
        fn = Ctor || createCtor(fn);
      }
      return fn.apply(thisBinding, args);
    }
    return wrapper;
  }

  function createCurry(func, bitmask, arity) {
    var Ctor = createCtor(func);
    function wrapper() {
      var length = arguments.length, args = Array(length), index = length, placeholder = getHolder(wrapper);
      while (index--) {
        args[index] = arguments[index];
      }
      var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
      length -= holders.length;
      if (length < arity) {
        return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, void 0, args, holders, void 0, void 0, arity - length);
      }
      var fn = this && this !== root && this instanceof wrapper ? Ctor : func;
      return apply(fn, this, args);
    }
    return wrapper;
  }

  var WRAP_BIND_FLAG$4 = 1;
  function createPartial(func, bitmask, thisArg, partials) {
    var isBind = bitmask & WRAP_BIND_FLAG$4, Ctor = createCtor(func);
    function wrapper() {
      var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array(leftLength + argsLength), fn = this && this !== root && this instanceof wrapper ? Ctor : func;
      while (++leftIndex < leftLength) {
        args[leftIndex] = partials[leftIndex];
      }
      while (argsLength--) {
        args[leftIndex++] = arguments[++argsIndex];
      }
      return apply(fn, isBind ? thisArg : this, args);
    }
    return wrapper;
  }

  var PLACEHOLDER = "__lodash_placeholder__";
  var WRAP_BIND_FLAG$3 = 1;
  var WRAP_BIND_KEY_FLAG$3 = 2;
  var WRAP_CURRY_BOUND_FLAG = 4;
  var WRAP_CURRY_FLAG$3 = 8;
  var WRAP_ARY_FLAG$2 = 128;
  var WRAP_REARG_FLAG$2 = 256;
  var nativeMin$d = Math.min;
  function mergeData(data, source) {
    var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG$3 | WRAP_BIND_KEY_FLAG$3 | WRAP_ARY_FLAG$2);
    var isCombo = srcBitmask == WRAP_ARY_FLAG$2 && bitmask == WRAP_CURRY_FLAG$3 || srcBitmask == WRAP_ARY_FLAG$2 && bitmask == WRAP_REARG_FLAG$2 && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG$2 | WRAP_REARG_FLAG$2) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG$3;
    if (!(isCommon || isCombo)) {
      return data;
    }
    if (srcBitmask & WRAP_BIND_FLAG$3) {
      data[2] = source[2];
      newBitmask |= bitmask & WRAP_BIND_FLAG$3 ? 0 : WRAP_CURRY_BOUND_FLAG;
    }
    var value = source[3];
    if (value) {
      var partials = data[3];
      data[3] = partials ? composeArgs(partials, value, source[4]) : value;
      data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
    }
    value = source[5];
    if (value) {
      partials = data[5];
      data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
      data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
    }
    value = source[7];
    if (value) {
      data[7] = value;
    }
    if (srcBitmask & WRAP_ARY_FLAG$2) {
      data[8] = data[8] == null ? source[8] : nativeMin$d(data[8], source[8]);
    }
    if (data[9] == null) {
      data[9] = source[9];
    }
    data[0] = source[0];
    data[1] = newBitmask;
    return data;
  }

  var FUNC_ERROR_TEXT$a = "Expected a function";
  var WRAP_BIND_FLAG$2 = 1;
  var WRAP_BIND_KEY_FLAG$2 = 2;
  var WRAP_CURRY_FLAG$2 = 8;
  var WRAP_CURRY_RIGHT_FLAG$1 = 16;
  var WRAP_PARTIAL_FLAG$4 = 32;
  var WRAP_PARTIAL_RIGHT_FLAG$1 = 64;
  var nativeMax$e = Math.max;
  function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary, arity) {
    var isBindKey = bitmask & WRAP_BIND_KEY_FLAG$2;
    if (!isBindKey && typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$a);
    }
    var length = partials ? partials.length : 0;
    if (!length) {
      bitmask &= ~(WRAP_PARTIAL_FLAG$4 | WRAP_PARTIAL_RIGHT_FLAG$1);
      partials = holders = void 0;
    }
    ary = ary === void 0 ? ary : nativeMax$e(toInteger(ary), 0);
    arity = arity === void 0 ? arity : toInteger(arity);
    length -= holders ? holders.length : 0;
    if (bitmask & WRAP_PARTIAL_RIGHT_FLAG$1) {
      var partialsRight = partials, holdersRight = holders;
      partials = holders = void 0;
    }
    var data = isBindKey ? void 0 : getData(func);
    var newData = [
      func,
      bitmask,
      thisArg,
      partials,
      holders,
      partialsRight,
      holdersRight,
      argPos,
      ary,
      arity
    ];
    if (data) {
      mergeData(newData, data);
    }
    func = newData[0];
    bitmask = newData[1];
    thisArg = newData[2];
    partials = newData[3];
    holders = newData[4];
    arity = newData[9] = newData[9] === void 0 ? isBindKey ? 0 : func.length : nativeMax$e(newData[9] - length, 0);
    if (!arity && bitmask & (WRAP_CURRY_FLAG$2 | WRAP_CURRY_RIGHT_FLAG$1)) {
      bitmask &= ~(WRAP_CURRY_FLAG$2 | WRAP_CURRY_RIGHT_FLAG$1);
    }
    if (!bitmask || bitmask == WRAP_BIND_FLAG$2) {
      var result = createBind(func, bitmask, thisArg);
    } else if (bitmask == WRAP_CURRY_FLAG$2 || bitmask == WRAP_CURRY_RIGHT_FLAG$1) {
      result = createCurry(func, bitmask, arity);
    } else if ((bitmask == WRAP_PARTIAL_FLAG$4 || bitmask == (WRAP_BIND_FLAG$2 | WRAP_PARTIAL_FLAG$4)) && !holders.length) {
      result = createPartial(func, bitmask, thisArg, partials);
    } else {
      result = createHybrid.apply(void 0, newData);
    }
    var setter = data ? baseSetData : setData;
    return setWrapToString(setter(result, newData), func, bitmask);
  }

  var WRAP_ARY_FLAG$1 = 128;
  function ary(func, n, guard) {
    n = guard ? void 0 : n;
    n = func && n == null ? func.length : n;
    return createWrap(func, WRAP_ARY_FLAG$1, void 0, void 0, void 0, void 0, n);
  }

  function baseAssignValue(object, key, value) {
    if (key == "__proto__" && defineProperty) {
      defineProperty(object, key, {
        "configurable": true,
        "enumerable": true,
        "value": value,
        "writable": true
      });
    } else {
      object[key] = value;
    }
  }

  function eq(value, other) {
    return value === other || value !== value && other !== other;
  }

  var objectProto$n = Object.prototype;
  var hasOwnProperty$k = objectProto$n.hasOwnProperty;
  function assignValue(object, key, value) {
    var objValue = object[key];
    if (!(hasOwnProperty$k.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
      baseAssignValue(object, key, value);
    }
  }

  function copyObject(source, props, object, customizer) {
    var isNew = !object;
    object || (object = {});
    var index = -1, length = props.length;
    while (++index < length) {
      var key = props[index];
      var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
      if (newValue === void 0) {
        newValue = source[key];
      }
      if (isNew) {
        baseAssignValue(object, key, newValue);
      } else {
        assignValue(object, key, newValue);
      }
    }
    return object;
  }

  var nativeMax$d = Math.max;
  function overRest(func, start, transform) {
    start = nativeMax$d(start === void 0 ? func.length - 1 : start, 0);
    return function() {
      var args = arguments, index = -1, length = nativeMax$d(args.length - start, 0), array = Array(length);
      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return apply(func, this, otherArgs);
    };
  }

  function baseRest(func, start) {
    return setToString(overRest(func, start, identity), func + "");
  }

  var MAX_SAFE_INTEGER$4 = 9007199254740991;
  function isLength(value) {
    return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$4;
  }

  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }

  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
      return eq(object[index], value);
    }
    return false;
  }

  function createAssigner(assigner) {
    return baseRest(function(object, sources) {
      var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
      customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
      if (guard && isIterateeCall(sources[0], sources[1], guard)) {
        customizer = length < 3 ? void 0 : customizer;
        length = 1;
      }
      object = Object(object);
      while (++index < length) {
        var source = sources[index];
        if (source) {
          assigner(object, source, index, customizer);
        }
      }
      return object;
    });
  }

  var objectProto$m = Object.prototype;
  function isPrototype(value) {
    var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto$m;
    return value === proto;
  }

  function baseTimes(n, iteratee) {
    var index = -1, result = Array(n);
    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  var argsTag$3 = "[object Arguments]";
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag$3;
  }

  var objectProto$l = Object.prototype;
  var hasOwnProperty$j = objectProto$l.hasOwnProperty;
  var propertyIsEnumerable$1 = objectProto$l.propertyIsEnumerable;
  var isArguments = baseIsArguments(function() {
    return arguments;
  }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty$j.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
  };

  function stubFalse() {
    return false;
  }

  var freeExports$2 = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule$2 = freeExports$2 && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;
  var Buffer$1 = moduleExports$2 ? root.Buffer : void 0;
  var nativeIsBuffer = Buffer$1 ? Buffer$1.isBuffer : void 0;
  var isBuffer = nativeIsBuffer || stubFalse;

  var argsTag$2 = "[object Arguments]";
  var arrayTag$2 = "[object Array]";
  var boolTag$4 = "[object Boolean]";
  var dateTag$4 = "[object Date]";
  var errorTag$3 = "[object Error]";
  var funcTag$1 = "[object Function]";
  var mapTag$9 = "[object Map]";
  var numberTag$4 = "[object Number]";
  var objectTag$4 = "[object Object]";
  var regexpTag$4 = "[object RegExp]";
  var setTag$9 = "[object Set]";
  var stringTag$4 = "[object String]";
  var weakMapTag$3 = "[object WeakMap]";
  var arrayBufferTag$4 = "[object ArrayBuffer]";
  var dataViewTag$4 = "[object DataView]";
  var float32Tag$2 = "[object Float32Array]";
  var float64Tag$2 = "[object Float64Array]";
  var int8Tag$2 = "[object Int8Array]";
  var int16Tag$2 = "[object Int16Array]";
  var int32Tag$2 = "[object Int32Array]";
  var uint8Tag$2 = "[object Uint8Array]";
  var uint8ClampedTag$2 = "[object Uint8ClampedArray]";
  var uint16Tag$2 = "[object Uint16Array]";
  var uint32Tag$2 = "[object Uint32Array]";
  var typedArrayTags = {};
  typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] = typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] = typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] = typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] = typedArrayTags[uint32Tag$2] = true;
  typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$2] = typedArrayTags[arrayBufferTag$4] = typedArrayTags[boolTag$4] = typedArrayTags[dataViewTag$4] = typedArrayTags[dateTag$4] = typedArrayTags[errorTag$3] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$9] = typedArrayTags[numberTag$4] = typedArrayTags[objectTag$4] = typedArrayTags[regexpTag$4] = typedArrayTags[setTag$9] = typedArrayTags[stringTag$4] = typedArrayTags[weakMapTag$3] = false;
  function baseIsTypedArray(value) {
    return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }

  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
  var freeProcess = moduleExports$1 && freeGlobal.process;
  var nodeUtil = function() {
    try {
      var types = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
      if (types) {
        return types;
      }
      return freeProcess && freeProcess.binding && freeProcess.binding("util");
    } catch (e) {
    }
  }();

  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

  var objectProto$k = Object.prototype;
  var hasOwnProperty$i = objectProto$k.hasOwnProperty;
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
    for (var key in value) {
      if ((inherited || hasOwnProperty$i.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) {
        result.push(key);
      }
    }
    return result;
  }

  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  var nativeKeys = overArg(Object.keys, Object);

  var objectProto$j = Object.prototype;
  var hasOwnProperty$h = objectProto$j.hasOwnProperty;
  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty$h.call(object, key) && key != "constructor") {
        result.push(key);
      }
    }
    return result;
  }

  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }

  var objectProto$i = Object.prototype;
  var hasOwnProperty$g = objectProto$i.hasOwnProperty;
  var assign = createAssigner(function(object, source) {
    if (isPrototype(source) || isArrayLike(source)) {
      copyObject(source, keys(source), object);
      return;
    }
    for (var key in source) {
      if (hasOwnProperty$g.call(source, key)) {
        assignValue(object, key, source[key]);
      }
    }
  });

  function nativeKeysIn(object) {
    var result = [];
    if (object != null) {
      for (var key in Object(object)) {
        result.push(key);
      }
    }
    return result;
  }

  var objectProto$h = Object.prototype;
  var hasOwnProperty$f = objectProto$h.hasOwnProperty;
  function baseKeysIn(object) {
    if (!isObject(object)) {
      return nativeKeysIn(object);
    }
    var isProto = isPrototype(object), result = [];
    for (var key in object) {
      if (!(key == "constructor" && (isProto || !hasOwnProperty$f.call(object, key)))) {
        result.push(key);
      }
    }
    return result;
  }

  function keysIn(object) {
    return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
  }

  var assignIn = createAssigner(function(object, source) {
    copyObject(source, keysIn(source), object);
  });

  var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
    copyObject(source, keysIn(source), object, customizer);
  });

  var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
    copyObject(source, keys(source), object, customizer);
  });

  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
  var reIsPlainProp = /^\w*$/;
  function isKey(value, object) {
    if (isArray(value)) {
      return false;
    }
    var type = typeof value;
    if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
  }

  var nativeCreate = getNative(Object, "create");

  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }

  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
  var objectProto$g = Object.prototype;
  var hasOwnProperty$e = objectProto$g.hasOwnProperty;
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED$2 ? void 0 : result;
    }
    return hasOwnProperty$e.call(data, key) ? data[key] : void 0;
  }

  var objectProto$f = Object.prototype;
  var hasOwnProperty$d = objectProto$f.hasOwnProperty;
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? data[key] !== void 0 : hasOwnProperty$d.call(data, key);
  }

  var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED$1 : value;
    return this;
  }

  function Hash(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  Hash.prototype.clear = hashClear;
  Hash.prototype["delete"] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;

  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  var arrayProto$5 = Array.prototype;
  var splice$2 = arrayProto$5.splice;
  function listCacheDelete(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice$2.call(data, index, 1);
    }
    --this.size;
    return true;
  }

  function listCacheGet(key) {
    var data = this.__data__, index = assocIndexOf(data, key);
    return index < 0 ? void 0 : data[index][1];
  }

  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }

  function listCacheSet(key, value) {
    var data = this.__data__, index = assocIndexOf(data, key);
    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  function ListCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype["delete"] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;

  var Map$1 = getNative(root, "Map");

  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      "hash": new Hash(),
      "map": new (Map$1 || ListCache)(),
      "string": new Hash()
    };
  }

  function isKeyable(value) {
    var type = typeof value;
    return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
  }

  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
  }

  function mapCacheDelete(key) {
    var result = getMapData(this, key)["delete"](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }

  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }

  function mapCacheSet(key, value) {
    var data = getMapData(this, key), size = data.size;
    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  function MapCache(entries) {
    var index = -1, length = entries == null ? 0 : entries.length;
    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype["delete"] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;

  var FUNC_ERROR_TEXT$9 = "Expected a function";
  function memoize(func, resolver) {
    if (typeof func != "function" || resolver != null && typeof resolver != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$9);
    }
    var memoized = function() {
      var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache)();
    return memoized;
  }
  memoize.Cache = MapCache;

  var MAX_MEMOIZE_SIZE = 500;
  function memoizeCapped(func) {
    var result = memoize(func, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });
    var cache = result.cache;
    return result;
  }

  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
  var reEscapeChar = /\\(\\)?/g;
  var stringToPath = memoizeCapped(function(string) {
    var result = [];
    if (string.charCodeAt(0) === 46) {
      result.push("");
    }
    string.replace(rePropName, function(match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
    });
    return result;
  });

  function toString(value) {
    return value == null ? "" : baseToString(value);
  }

  function castPath(value, object) {
    if (isArray(value)) {
      return value;
    }
    return isKey(value, object) ? [value] : stringToPath(toString(value));
  }

  var INFINITY$3 = 1 / 0;
  function toKey(value) {
    if (typeof value == "string" || isSymbol(value)) {
      return value;
    }
    var result = value + "";
    return result == "0" && 1 / value == -INFINITY$3 ? "-0" : result;
  }

  function baseGet(object, path) {
    path = castPath(path, object);
    var index = 0, length = path.length;
    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return index && index == length ? object : void 0;
  }

  function get(object, path, defaultValue) {
    var result = object == null ? void 0 : baseGet(object, path);
    return result === void 0 ? defaultValue : result;
  }

  function baseAt(object, paths) {
    var index = -1, length = paths.length, result = Array(length), skip = object == null;
    while (++index < length) {
      result[index] = skip ? void 0 : get(object, paths[index]);
    }
    return result;
  }

  function arrayPush(array, values) {
    var index = -1, length = values.length, offset = array.length;
    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  var spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : void 0;
  function isFlattenable(value) {
    return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
  }

  function baseFlatten(array, depth, predicate, isStrict, result) {
    var index = -1, length = array.length;
    predicate || (predicate = isFlattenable);
    result || (result = []);
    while (++index < length) {
      var value = array[index];
      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          baseFlatten(value, depth - 1, predicate, isStrict, result);
        } else {
          arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }

  function flatten(array) {
    var length = array == null ? 0 : array.length;
    return length ? baseFlatten(array, 1) : [];
  }

  function flatRest(func) {
    return setToString(overRest(func, void 0, flatten), func + "");
  }

  var at$1 = flatRest(baseAt);

  var getPrototype = overArg(Object.getPrototypeOf, Object);

  var objectTag$3 = "[object Object]";
  var funcProto = Function.prototype;
  var objectProto$e = Object.prototype;
  var funcToString = funcProto.toString;
  var hasOwnProperty$c = objectProto$e.hasOwnProperty;
  var objectCtorString = funcToString.call(Object);
  function isPlainObject(value) {
    if (!isObjectLike(value) || baseGetTag(value) != objectTag$3) {
      return false;
    }
    var proto = getPrototype(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty$c.call(proto, "constructor") && proto.constructor;
    return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
  }

  var domExcTag = "[object DOMException]";
  var errorTag$2 = "[object Error]";
  function isError(value) {
    if (!isObjectLike(value)) {
      return false;
    }
    var tag = baseGetTag(value);
    return tag == errorTag$2 || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
  }

  var attempt = baseRest(function(func, args) {
    try {
      return apply(func, void 0, args);
    } catch (e) {
      return isError(e) ? e : new Error(e);
    }
  });

  var FUNC_ERROR_TEXT$8 = "Expected a function";
  function before(n, func) {
    var result;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$8);
    }
    n = toInteger(n);
    return function() {
      if (--n > 0) {
        result = func.apply(this, arguments);
      }
      if (n <= 1) {
        func = void 0;
      }
      return result;
    };
  }

  var WRAP_BIND_FLAG$1 = 1;
  var WRAP_PARTIAL_FLAG$3 = 32;
  var bind = baseRest(function(func, thisArg, partials) {
    var bitmask = WRAP_BIND_FLAG$1;
    if (partials.length) {
      var holders = replaceHolders(partials, getHolder(bind));
      bitmask |= WRAP_PARTIAL_FLAG$3;
    }
    return createWrap(func, bitmask, thisArg, partials, holders);
  });
  bind.placeholder = {};

  var bindAll = flatRest(function(object, methodNames) {
    arrayEach(methodNames, function(key) {
      key = toKey(key);
      baseAssignValue(object, key, bind(object[key], object));
    });
    return object;
  });

  var WRAP_BIND_FLAG = 1;
  var WRAP_BIND_KEY_FLAG$1 = 2;
  var WRAP_PARTIAL_FLAG$2 = 32;
  var bindKey = baseRest(function(object, key, partials) {
    var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG$1;
    if (partials.length) {
      var holders = replaceHolders(partials, getHolder(bindKey));
      bitmask |= WRAP_PARTIAL_FLAG$2;
    }
    return createWrap(key, bitmask, object, partials, holders);
  });
  bindKey.placeholder = {};

  function baseSlice(array, start, end) {
    var index = -1, length = array.length;
    if (start < 0) {
      start = -start > length ? 0 : length + start;
    }
    end = end > length ? length : end;
    if (end < 0) {
      end += length;
    }
    length = start > end ? 0 : end - start >>> 0;
    start >>>= 0;
    var result = Array(length);
    while (++index < length) {
      result[index] = array[index + start];
    }
    return result;
  }

  function castSlice(array, start, end) {
    var length = array.length;
    end = end === void 0 ? length : end;
    return !start && end >= length ? array : baseSlice(array, start, end);
  }

  var rsAstralRange$3 = "\\ud800-\\udfff";
  var rsComboMarksRange$4 = "\\u0300-\\u036f";
  var reComboHalfMarksRange$4 = "\\ufe20-\\ufe2f";
  var rsComboSymbolsRange$4 = "\\u20d0-\\u20ff";
  var rsComboRange$4 = rsComboMarksRange$4 + reComboHalfMarksRange$4 + rsComboSymbolsRange$4;
  var rsVarRange$3 = "\\ufe0e\\ufe0f";
  var rsZWJ$3 = "\\u200d";
  var reHasUnicode = RegExp("[" + rsZWJ$3 + rsAstralRange$3 + rsComboRange$4 + rsVarRange$3 + "]");
  function hasUnicode(string) {
    return reHasUnicode.test(string);
  }

  function asciiToArray(string) {
    return string.split("");
  }

  var rsAstralRange$2 = "\\ud800-\\udfff";
  var rsComboMarksRange$3 = "\\u0300-\\u036f";
  var reComboHalfMarksRange$3 = "\\ufe20-\\ufe2f";
  var rsComboSymbolsRange$3 = "\\u20d0-\\u20ff";
  var rsComboRange$3 = rsComboMarksRange$3 + reComboHalfMarksRange$3 + rsComboSymbolsRange$3;
  var rsVarRange$2 = "\\ufe0e\\ufe0f";
  var rsAstral$1 = "[" + rsAstralRange$2 + "]";
  var rsCombo$3 = "[" + rsComboRange$3 + "]";
  var rsFitz$2 = "\\ud83c[\\udffb-\\udfff]";
  var rsModifier$2 = "(?:" + rsCombo$3 + "|" + rsFitz$2 + ")";
  var rsNonAstral$2 = "[^" + rsAstralRange$2 + "]";
  var rsRegional$2 = "(?:\\ud83c[\\udde6-\\uddff]){2}";
  var rsSurrPair$2 = "[\\ud800-\\udbff][\\udc00-\\udfff]";
  var rsZWJ$2 = "\\u200d";
  var reOptMod$2 = rsModifier$2 + "?";
  var rsOptVar$2 = "[" + rsVarRange$2 + "]?";
  var rsOptJoin$2 = "(?:" + rsZWJ$2 + "(?:" + [rsNonAstral$2, rsRegional$2, rsSurrPair$2].join("|") + ")" + rsOptVar$2 + reOptMod$2 + ")*";
  var rsSeq$2 = rsOptVar$2 + reOptMod$2 + rsOptJoin$2;
  var rsSymbol$1 = "(?:" + [rsNonAstral$2 + rsCombo$3 + "?", rsCombo$3, rsRegional$2, rsSurrPair$2, rsAstral$1].join("|") + ")";
  var reUnicode$1 = RegExp(rsFitz$2 + "(?=" + rsFitz$2 + ")|" + rsSymbol$1 + rsSeq$2, "g");
  function unicodeToArray(string) {
    return string.match(reUnicode$1) || [];
  }

  function stringToArray(string) {
    return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
  }

  function createCaseFirst(methodName) {
    return function(string) {
      string = toString(string);
      var strSymbols = hasUnicode(string) ? stringToArray(string) : void 0;
      var chr = strSymbols ? strSymbols[0] : string.charAt(0);
      var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
      return chr[methodName]() + trailing;
    };
  }

  var upperFirst = createCaseFirst("toUpperCase");

  function capitalize$1(string) {
    return upperFirst(toString(string).toLowerCase());
  }

  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1, length = array == null ? 0 : array.length;
    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  function basePropertyOf(object) {
    return function(key) {
      return object == null ? void 0 : object[key];
    };
  }

  var deburredLetters = {
    "\xC0": "A",
    "\xC1": "A",
    "\xC2": "A",
    "\xC3": "A",
    "\xC4": "A",
    "\xC5": "A",
    "\xE0": "a",
    "\xE1": "a",
    "\xE2": "a",
    "\xE3": "a",
    "\xE4": "a",
    "\xE5": "a",
    "\xC7": "C",
    "\xE7": "c",
    "\xD0": "D",
    "\xF0": "d",
    "\xC8": "E",
    "\xC9": "E",
    "\xCA": "E",
    "\xCB": "E",
    "\xE8": "e",
    "\xE9": "e",
    "\xEA": "e",
    "\xEB": "e",
    "\xCC": "I",
    "\xCD": "I",
    "\xCE": "I",
    "\xCF": "I",
    "\xEC": "i",
    "\xED": "i",
    "\xEE": "i",
    "\xEF": "i",
    "\xD1": "N",
    "\xF1": "n",
    "\xD2": "O",
    "\xD3": "O",
    "\xD4": "O",
    "\xD5": "O",
    "\xD6": "O",
    "\xD8": "O",
    "\xF2": "o",
    "\xF3": "o",
    "\xF4": "o",
    "\xF5": "o",
    "\xF6": "o",
    "\xF8": "o",
    "\xD9": "U",
    "\xDA": "U",
    "\xDB": "U",
    "\xDC": "U",
    "\xF9": "u",
    "\xFA": "u",
    "\xFB": "u",
    "\xFC": "u",
    "\xDD": "Y",
    "\xFD": "y",
    "\xFF": "y",
    "\xC6": "Ae",
    "\xE6": "ae",
    "\xDE": "Th",
    "\xFE": "th",
    "\xDF": "ss",
    "\u0100": "A",
    "\u0102": "A",
    "\u0104": "A",
    "\u0101": "a",
    "\u0103": "a",
    "\u0105": "a",
    "\u0106": "C",
    "\u0108": "C",
    "\u010A": "C",
    "\u010C": "C",
    "\u0107": "c",
    "\u0109": "c",
    "\u010B": "c",
    "\u010D": "c",
    "\u010E": "D",
    "\u0110": "D",
    "\u010F": "d",
    "\u0111": "d",
    "\u0112": "E",
    "\u0114": "E",
    "\u0116": "E",
    "\u0118": "E",
    "\u011A": "E",
    "\u0113": "e",
    "\u0115": "e",
    "\u0117": "e",
    "\u0119": "e",
    "\u011B": "e",
    "\u011C": "G",
    "\u011E": "G",
    "\u0120": "G",
    "\u0122": "G",
    "\u011D": "g",
    "\u011F": "g",
    "\u0121": "g",
    "\u0123": "g",
    "\u0124": "H",
    "\u0126": "H",
    "\u0125": "h",
    "\u0127": "h",
    "\u0128": "I",
    "\u012A": "I",
    "\u012C": "I",
    "\u012E": "I",
    "\u0130": "I",
    "\u0129": "i",
    "\u012B": "i",
    "\u012D": "i",
    "\u012F": "i",
    "\u0131": "i",
    "\u0134": "J",
    "\u0135": "j",
    "\u0136": "K",
    "\u0137": "k",
    "\u0138": "k",
    "\u0139": "L",
    "\u013B": "L",
    "\u013D": "L",
    "\u013F": "L",
    "\u0141": "L",
    "\u013A": "l",
    "\u013C": "l",
    "\u013E": "l",
    "\u0140": "l",
    "\u0142": "l",
    "\u0143": "N",
    "\u0145": "N",
    "\u0147": "N",
    "\u014A": "N",
    "\u0144": "n",
    "\u0146": "n",
    "\u0148": "n",
    "\u014B": "n",
    "\u014C": "O",
    "\u014E": "O",
    "\u0150": "O",
    "\u014D": "o",
    "\u014F": "o",
    "\u0151": "o",
    "\u0154": "R",
    "\u0156": "R",
    "\u0158": "R",
    "\u0155": "r",
    "\u0157": "r",
    "\u0159": "r",
    "\u015A": "S",
    "\u015C": "S",
    "\u015E": "S",
    "\u0160": "S",
    "\u015B": "s",
    "\u015D": "s",
    "\u015F": "s",
    "\u0161": "s",
    "\u0162": "T",
    "\u0164": "T",
    "\u0166": "T",
    "\u0163": "t",
    "\u0165": "t",
    "\u0167": "t",
    "\u0168": "U",
    "\u016A": "U",
    "\u016C": "U",
    "\u016E": "U",
    "\u0170": "U",
    "\u0172": "U",
    "\u0169": "u",
    "\u016B": "u",
    "\u016D": "u",
    "\u016F": "u",
    "\u0171": "u",
    "\u0173": "u",
    "\u0174": "W",
    "\u0175": "w",
    "\u0176": "Y",
    "\u0177": "y",
    "\u0178": "Y",
    "\u0179": "Z",
    "\u017B": "Z",
    "\u017D": "Z",
    "\u017A": "z",
    "\u017C": "z",
    "\u017E": "z",
    "\u0132": "IJ",
    "\u0133": "ij",
    "\u0152": "Oe",
    "\u0153": "oe",
    "\u0149": "'n",
    "\u017F": "s"
  };
  var deburrLetter = basePropertyOf(deburredLetters);

  var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
  var rsComboMarksRange$2 = "\\u0300-\\u036f";
  var reComboHalfMarksRange$2 = "\\ufe20-\\ufe2f";
  var rsComboSymbolsRange$2 = "\\u20d0-\\u20ff";
  var rsComboRange$2 = rsComboMarksRange$2 + reComboHalfMarksRange$2 + rsComboSymbolsRange$2;
  var rsCombo$2 = "[" + rsComboRange$2 + "]";
  var reComboMark = RegExp(rsCombo$2, "g");
  function deburr(string) {
    string = toString(string);
    return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
  }

  var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
  function asciiWords(string) {
    return string.match(reAsciiWord) || [];
  }

  var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
  function hasUnicodeWord(string) {
    return reHasUnicodeWord.test(string);
  }

  var rsAstralRange$1 = "\\ud800-\\udfff";
  var rsComboMarksRange$1 = "\\u0300-\\u036f";
  var reComboHalfMarksRange$1 = "\\ufe20-\\ufe2f";
  var rsComboSymbolsRange$1 = "\\u20d0-\\u20ff";
  var rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1;
  var rsDingbatRange = "\\u2700-\\u27bf";
  var rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff";
  var rsMathOpRange = "\\xac\\xb1\\xd7\\xf7";
  var rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf";
  var rsPunctuationRange = "\\u2000-\\u206f";
  var rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000";
  var rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde";
  var rsVarRange$1 = "\\ufe0e\\ufe0f";
  var rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
  var rsApos$1 = "['\u2019]";
  var rsBreak = "[" + rsBreakRange + "]";
  var rsCombo$1 = "[" + rsComboRange$1 + "]";
  var rsDigits = "\\d+";
  var rsDingbat = "[" + rsDingbatRange + "]";
  var rsLower = "[" + rsLowerRange + "]";
  var rsMisc = "[^" + rsAstralRange$1 + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]";
  var rsFitz$1 = "\\ud83c[\\udffb-\\udfff]";
  var rsModifier$1 = "(?:" + rsCombo$1 + "|" + rsFitz$1 + ")";
  var rsNonAstral$1 = "[^" + rsAstralRange$1 + "]";
  var rsRegional$1 = "(?:\\ud83c[\\udde6-\\uddff]){2}";
  var rsSurrPair$1 = "[\\ud800-\\udbff][\\udc00-\\udfff]";
  var rsUpper = "[" + rsUpperRange + "]";
  var rsZWJ$1 = "\\u200d";
  var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")";
  var rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")";
  var rsOptContrLower = "(?:" + rsApos$1 + "(?:d|ll|m|re|s|t|ve))?";
  var rsOptContrUpper = "(?:" + rsApos$1 + "(?:D|LL|M|RE|S|T|VE))?";
  var reOptMod$1 = rsModifier$1 + "?";
  var rsOptVar$1 = "[" + rsVarRange$1 + "]?";
  var rsOptJoin$1 = "(?:" + rsZWJ$1 + "(?:" + [rsNonAstral$1, rsRegional$1, rsSurrPair$1].join("|") + ")" + rsOptVar$1 + reOptMod$1 + ")*";
  var rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])";
  var rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])";
  var rsSeq$1 = rsOptVar$1 + reOptMod$1 + rsOptJoin$1;
  var rsEmoji = "(?:" + [rsDingbat, rsRegional$1, rsSurrPair$1].join("|") + ")" + rsSeq$1;
  var reUnicodeWord = RegExp([
    rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [rsBreak, rsUpper, "$"].join("|") + ")",
    rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [rsBreak, rsUpper + rsMiscLower, "$"].join("|") + ")",
    rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
    rsUpper + "+" + rsOptContrUpper,
    rsOrdUpper,
    rsOrdLower,
    rsDigits,
    rsEmoji
  ].join("|"), "g");
  function unicodeWords(string) {
    return string.match(reUnicodeWord) || [];
  }

  function words(string, pattern, guard) {
    string = toString(string);
    pattern = guard ? void 0 : pattern;
    if (pattern === void 0) {
      return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
    }
    return string.match(pattern) || [];
  }

  var rsApos = "['\u2019]";
  var reApos = RegExp(rsApos, "g");
  function createCompounder(callback) {
    return function(string) {
      return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
    };
  }

  var camelCase = createCompounder(function(result, word, index) {
    word = word.toLowerCase();
    return result + (index ? capitalize$1(word) : word);
  });

  function castArray$1() {
    if (!arguments.length) {
      return [];
    }
    var value = arguments[0];
    return isArray(value) ? value : [value];
  }

  var nativeIsFinite$1 = root.isFinite;
  var nativeMin$c = Math.min;
  function createRound(methodName) {
    var func = Math[methodName];
    return function(number, precision) {
      number = toNumber(number);
      precision = precision == null ? 0 : nativeMin$c(toInteger(precision), 292);
      if (precision && nativeIsFinite$1(number)) {
        var pair = (toString(number) + "e").split("e"), value = func(pair[0] + "e" + (+pair[1] + precision));
        pair = (toString(value) + "e").split("e");
        return +(pair[0] + "e" + (+pair[1] - precision));
      }
      return func(number);
    };
  }

  var ceil = createRound("ceil");

  function chain(value) {
    var result = lodash(value);
    result.__chain__ = true;
    return result;
  }

  var nativeCeil$3 = Math.ceil;
  var nativeMax$c = Math.max;
  function chunk(array, size, guard) {
    if (guard ? isIterateeCall(array, size, guard) : size === void 0) {
      size = 1;
    } else {
      size = nativeMax$c(toInteger(size), 0);
    }
    var length = array == null ? 0 : array.length;
    if (!length || size < 1) {
      return [];
    }
    var index = 0, resIndex = 0, result = Array(nativeCeil$3(length / size));
    while (index < length) {
      result[resIndex++] = baseSlice(array, index, index += size);
    }
    return result;
  }

  function baseClamp(number, lower, upper) {
    if (number === number) {
      if (upper !== void 0) {
        number = number <= upper ? number : upper;
      }
      if (lower !== void 0) {
        number = number >= lower ? number : lower;
      }
    }
    return number;
  }

  function clamp(number, lower, upper) {
    if (upper === void 0) {
      upper = lower;
      lower = void 0;
    }
    if (upper !== void 0) {
      upper = toNumber(upper);
      upper = upper === upper ? upper : 0;
    }
    if (lower !== void 0) {
      lower = toNumber(lower);
      lower = lower === lower ? lower : 0;
    }
    return baseClamp(toNumber(number), lower, upper);
  }

  function stackClear() {
    this.__data__ = new ListCache();
    this.size = 0;
  }

  function stackDelete(key) {
    var data = this.__data__, result = data["delete"](key);
    this.size = data.size;
    return result;
  }

  function stackGet(key) {
    return this.__data__.get(key);
  }

  function stackHas(key) {
    return this.__data__.has(key);
  }

  var LARGE_ARRAY_SIZE$2 = 200;
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs = data.__data__;
      if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE$2 - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }

  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }
  Stack.prototype.clear = stackClear;
  Stack.prototype["delete"] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;

  function baseAssign(object, source) {
    return object && copyObject(source, keys(source), object);
  }

  function baseAssignIn(object, source) {
    return object && copyObject(source, keysIn(source), object);
  }

  var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
  var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
  var moduleExports = freeModule && freeModule.exports === freeExports;
  var Buffer = moduleExports ? root.Buffer : void 0;
  var allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
  function cloneBuffer(buffer, isDeep) {
    if (isDeep) {
      return buffer.slice();
    }
    var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
    buffer.copy(result);
    return result;
  }

  function arrayFilter(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  function stubArray() {
    return [];
  }

  var objectProto$d = Object.prototype;
  var propertyIsEnumerable = objectProto$d.propertyIsEnumerable;
  var nativeGetSymbols$1 = Object.getOwnPropertySymbols;
  var getSymbols = !nativeGetSymbols$1 ? stubArray : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter(nativeGetSymbols$1(object), function(symbol) {
      return propertyIsEnumerable.call(object, symbol);
    });
  };

  function copySymbols(source, object) {
    return copyObject(source, getSymbols(source), object);
  }

  var nativeGetSymbols = Object.getOwnPropertySymbols;
  var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
    var result = [];
    while (object) {
      arrayPush(result, getSymbols(object));
      object = getPrototype(object);
    }
    return result;
  };

  function copySymbolsIn(source, object) {
    return copyObject(source, getSymbolsIn(source), object);
  }

  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
  }

  function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
  }

  function getAllKeysIn(object) {
    return baseGetAllKeys(object, keysIn, getSymbolsIn);
  }

  var DataView = getNative(root, "DataView");

  var Promise$1 = getNative(root, "Promise");

  var Set$1 = getNative(root, "Set");

  var mapTag$8 = "[object Map]";
  var objectTag$2 = "[object Object]";
  var promiseTag = "[object Promise]";
  var setTag$8 = "[object Set]";
  var weakMapTag$2 = "[object WeakMap]";
  var dataViewTag$3 = "[object DataView]";
  var dataViewCtorString = toSource(DataView);
  var mapCtorString = toSource(Map$1);
  var promiseCtorString = toSource(Promise$1);
  var setCtorString = toSource(Set$1);
  var weakMapCtorString = toSource(WeakMap);
  var getTag = baseGetTag;
  if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$3 || Map$1 && getTag(new Map$1()) != mapTag$8 || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set$1 && getTag(new Set$1()) != setTag$8 || WeakMap && getTag(new WeakMap()) != weakMapTag$2) {
    getTag = function(value) {
      var result = baseGetTag(value), Ctor = result == objectTag$2 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag$3;
          case mapCtorString:
            return mapTag$8;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag$8;
          case weakMapCtorString:
            return weakMapTag$2;
        }
      }
      return result;
    };
  }
  var getTag$1 = getTag;

  var objectProto$c = Object.prototype;
  var hasOwnProperty$b = objectProto$c.hasOwnProperty;
  function initCloneArray(array) {
    var length = array.length, result = new array.constructor(length);
    if (length && typeof array[0] == "string" && hasOwnProperty$b.call(array, "index")) {
      result.index = array.index;
      result.input = array.input;
    }
    return result;
  }

  var Uint8Array = root.Uint8Array;

  function cloneArrayBuffer(arrayBuffer) {
    var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
    new Uint8Array(result).set(new Uint8Array(arrayBuffer));
    return result;
  }

  function cloneDataView(dataView, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
    return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
  }

  var reFlags$1 = /\w*$/;
  function cloneRegExp(regexp) {
    var result = new regexp.constructor(regexp.source, reFlags$1.exec(regexp));
    result.lastIndex = regexp.lastIndex;
    return result;
  }

  var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : void 0;
  var symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : void 0;
  function cloneSymbol(symbol) {
    return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
  }

  function cloneTypedArray(typedArray, isDeep) {
    var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
    return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
  }

  var boolTag$3 = "[object Boolean]";
  var dateTag$3 = "[object Date]";
  var mapTag$7 = "[object Map]";
  var numberTag$3 = "[object Number]";
  var regexpTag$3 = "[object RegExp]";
  var setTag$7 = "[object Set]";
  var stringTag$3 = "[object String]";
  var symbolTag$2 = "[object Symbol]";
  var arrayBufferTag$3 = "[object ArrayBuffer]";
  var dataViewTag$2 = "[object DataView]";
  var float32Tag$1 = "[object Float32Array]";
  var float64Tag$1 = "[object Float64Array]";
  var int8Tag$1 = "[object Int8Array]";
  var int16Tag$1 = "[object Int16Array]";
  var int32Tag$1 = "[object Int32Array]";
  var uint8Tag$1 = "[object Uint8Array]";
  var uint8ClampedTag$1 = "[object Uint8ClampedArray]";
  var uint16Tag$1 = "[object Uint16Array]";
  var uint32Tag$1 = "[object Uint32Array]";
  function initCloneByTag(object, tag, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
      case arrayBufferTag$3:
        return cloneArrayBuffer(object);
      case boolTag$3:
      case dateTag$3:
        return new Ctor(+object);
      case dataViewTag$2:
        return cloneDataView(object, isDeep);
      case float32Tag$1:
      case float64Tag$1:
      case int8Tag$1:
      case int16Tag$1:
      case int32Tag$1:
      case uint8Tag$1:
      case uint8ClampedTag$1:
      case uint16Tag$1:
      case uint32Tag$1:
        return cloneTypedArray(object, isDeep);
      case mapTag$7:
        return new Ctor();
      case numberTag$3:
      case stringTag$3:
        return new Ctor(object);
      case regexpTag$3:
        return cloneRegExp(object);
      case setTag$7:
        return new Ctor();
      case symbolTag$2:
        return cloneSymbol(object);
    }
  }

  function initCloneObject(object) {
    return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
  }

  var mapTag$6 = "[object Map]";
  function baseIsMap(value) {
    return isObjectLike(value) && getTag$1(value) == mapTag$6;
  }

  var nodeIsMap = nodeUtil && nodeUtil.isMap;
  var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

  var setTag$6 = "[object Set]";
  function baseIsSet(value) {
    return isObjectLike(value) && getTag$1(value) == setTag$6;
  }

  var nodeIsSet = nodeUtil && nodeUtil.isSet;
  var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

  var CLONE_DEEP_FLAG$7 = 1;
  var CLONE_FLAT_FLAG$1 = 2;
  var CLONE_SYMBOLS_FLAG$5 = 4;
  var argsTag$1 = "[object Arguments]";
  var arrayTag$1 = "[object Array]";
  var boolTag$2 = "[object Boolean]";
  var dateTag$2 = "[object Date]";
  var errorTag$1 = "[object Error]";
  var funcTag = "[object Function]";
  var genTag = "[object GeneratorFunction]";
  var mapTag$5 = "[object Map]";
  var numberTag$2 = "[object Number]";
  var objectTag$1 = "[object Object]";
  var regexpTag$2 = "[object RegExp]";
  var setTag$5 = "[object Set]";
  var stringTag$2 = "[object String]";
  var symbolTag$1 = "[object Symbol]";
  var weakMapTag$1 = "[object WeakMap]";
  var arrayBufferTag$2 = "[object ArrayBuffer]";
  var dataViewTag$1 = "[object DataView]";
  var float32Tag = "[object Float32Array]";
  var float64Tag = "[object Float64Array]";
  var int8Tag = "[object Int8Array]";
  var int16Tag = "[object Int16Array]";
  var int32Tag = "[object Int32Array]";
  var uint8Tag = "[object Uint8Array]";
  var uint8ClampedTag = "[object Uint8ClampedArray]";
  var uint16Tag = "[object Uint16Array]";
  var uint32Tag = "[object Uint32Array]";
  var cloneableTags = {};
  cloneableTags[argsTag$1] = cloneableTags[arrayTag$1] = cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$1] = cloneableTags[boolTag$2] = cloneableTags[dateTag$2] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag$5] = cloneableTags[numberTag$2] = cloneableTags[objectTag$1] = cloneableTags[regexpTag$2] = cloneableTags[setTag$5] = cloneableTags[stringTag$2] = cloneableTags[symbolTag$1] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag$1] = cloneableTags[funcTag] = cloneableTags[weakMapTag$1] = false;
  function baseClone(value, bitmask, customizer, key, object, stack) {
    var result, isDeep = bitmask & CLONE_DEEP_FLAG$7, isFlat = bitmask & CLONE_FLAT_FLAG$1, isFull = bitmask & CLONE_SYMBOLS_FLAG$5;
    if (customizer) {
      result = object ? customizer(value, key, object, stack) : customizer(value);
    }
    if (result !== void 0) {
      return result;
    }
    if (!isObject(value)) {
      return value;
    }
    var isArr = isArray(value);
    if (isArr) {
      result = initCloneArray(value);
      if (!isDeep) {
        return copyArray(value, result);
      }
    } else {
      var tag = getTag$1(value), isFunc = tag == funcTag || tag == genTag;
      if (isBuffer(value)) {
        return cloneBuffer(value, isDeep);
      }
      if (tag == objectTag$1 || tag == argsTag$1 || isFunc && !object) {
        result = isFlat || isFunc ? {} : initCloneObject(value);
        if (!isDeep) {
          return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
        }
      } else {
        if (!cloneableTags[tag]) {
          return object ? value : {};
        }
        result = initCloneByTag(value, tag, isDeep);
      }
    }
    stack || (stack = new Stack());
    var stacked = stack.get(value);
    if (stacked) {
      return stacked;
    }
    stack.set(value, result);
    if (isSet(value)) {
      value.forEach(function(subValue) {
        result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
      });
    } else if (isMap(value)) {
      value.forEach(function(subValue, key2) {
        result.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
      });
    }
    var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
    var props = isArr ? void 0 : keysFunc(value);
    arrayEach(props || value, function(subValue, key2) {
      if (props) {
        key2 = subValue;
        subValue = value[key2];
      }
      assignValue(result, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
    });
    return result;
  }

  var CLONE_SYMBOLS_FLAG$4 = 4;
  function clone(value) {
    return baseClone(value, CLONE_SYMBOLS_FLAG$4);
  }

  var CLONE_DEEP_FLAG$6 = 1;
  var CLONE_SYMBOLS_FLAG$3 = 4;
  function cloneDeep(value) {
    return baseClone(value, CLONE_DEEP_FLAG$6 | CLONE_SYMBOLS_FLAG$3);
  }

  var CLONE_DEEP_FLAG$5 = 1;
  var CLONE_SYMBOLS_FLAG$2 = 4;
  function cloneDeepWith(value, customizer) {
    customizer = typeof customizer == "function" ? customizer : void 0;
    return baseClone(value, CLONE_DEEP_FLAG$5 | CLONE_SYMBOLS_FLAG$2, customizer);
  }

  var CLONE_SYMBOLS_FLAG$1 = 4;
  function cloneWith(value, customizer) {
    customizer = typeof customizer == "function" ? customizer : void 0;
    return baseClone(value, CLONE_SYMBOLS_FLAG$1, customizer);
  }

  function wrapperCommit() {
    return new LodashWrapper(this.value(), this.__chain__);
  }

  function compact(array) {
    var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  function concat() {
    var length = arguments.length;
    if (!length) {
      return [];
    }
    var args = Array(length - 1), array = arguments[0], index = length;
    while (index--) {
      args[index - 1] = arguments[index];
    }
    return arrayPush(isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
  }

  var HASH_UNDEFINED = "__lodash_hash_undefined__";
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED);
    return this;
  }

  function setCacheHas(value) {
    return this.__data__.has(value);
  }

  function SetCache(values) {
    var index = -1, length = values == null ? 0 : values.length;
    this.__data__ = new MapCache();
    while (++index < length) {
      this.add(values[index]);
    }
  }
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;

  function arraySome(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  function cacheHas(cache, key) {
    return cache.has(key);
  }

  var COMPARE_PARTIAL_FLAG$5 = 1;
  var COMPARE_UNORDERED_FLAG$3 = 2;
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5, arrLength = array.length, othLength = other.length;
    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    var arrStacked = stack.get(array);
    var othStacked = stack.get(other);
    if (arrStacked && othStacked) {
      return arrStacked == other && othStacked == array;
    }
    var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : void 0;
    stack.set(array, other);
    stack.set(other, array);
    while (++index < arrLength) {
      var arrValue = array[index], othValue = other[index];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== void 0) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      if (seen) {
        if (!arraySome(other, function(othValue2, othIndex) {
          if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
            return seen.push(othIndex);
          }
        })) {
          result = false;
          break;
        }
      } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
        result = false;
        break;
      }
    }
    stack["delete"](array);
    stack["delete"](other);
    return result;
  }

  function mapToArray(map) {
    var index = -1, result = Array(map.size);
    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  function setToArray(set) {
    var index = -1, result = Array(set.size);
    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  var COMPARE_PARTIAL_FLAG$4 = 1;
  var COMPARE_UNORDERED_FLAG$2 = 2;
  var boolTag$1 = "[object Boolean]";
  var dateTag$1 = "[object Date]";
  var errorTag = "[object Error]";
  var mapTag$4 = "[object Map]";
  var numberTag$1 = "[object Number]";
  var regexpTag$1 = "[object RegExp]";
  var setTag$4 = "[object Set]";
  var stringTag$1 = "[object String]";
  var symbolTag = "[object Symbol]";
  var arrayBufferTag$1 = "[object ArrayBuffer]";
  var dataViewTag = "[object DataView]";
  var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0;
  var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag:
        if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;
      case arrayBufferTag$1:
        if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
          return false;
        }
        return true;
      case boolTag$1:
      case dateTag$1:
      case numberTag$1:
        return eq(+object, +other);
      case errorTag:
        return object.name == other.name && object.message == other.message;
      case regexpTag$1:
      case stringTag$1:
        return object == other + "";
      case mapTag$4:
        var convert = mapToArray;
      case setTag$4:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
        convert || (convert = setToArray);
        if (object.size != other.size && !isPartial) {
          return false;
        }
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG$2;
        stack.set(object, other);
        var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack["delete"](object);
        return result;
      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }

  var COMPARE_PARTIAL_FLAG$3 = 1;
  var objectProto$b = Object.prototype;
  var hasOwnProperty$a = objectProto$b.hasOwnProperty;
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty$a.call(other, key))) {
        return false;
      }
    }
    var objStacked = stack.get(object);
    var othStacked = stack.get(other);
    if (objStacked && othStacked) {
      return objStacked == other && othStacked == object;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);
    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key], othValue = other[key];
      if (customizer) {
        var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
      }
      if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == "constructor");
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor, othCtor = other.constructor;
      if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack["delete"](object);
    stack["delete"](other);
    return result;
  }

  var COMPARE_PARTIAL_FLAG$2 = 1;
  var argsTag = "[object Arguments]";
  var arrayTag = "[object Array]";
  var objectTag = "[object Object]";
  var objectProto$a = Object.prototype;
  var hasOwnProperty$9 = objectProto$a.hasOwnProperty;
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag$1(object), othTag = othIsArr ? arrayTag : getTag$1(other);
    objTag = objTag == argsTag ? objectTag : objTag;
    othTag = othTag == argsTag ? objectTag : othTag;
    var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
    if (isSameTag && isBuffer(object)) {
      if (!isBuffer(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack());
      return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
      var objIsWrapped = objIsObj && hasOwnProperty$9.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty$9.call(other, "__wrapped__");
      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
        stack || (stack = new Stack());
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack());
    return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }

  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }

  var COMPARE_PARTIAL_FLAG$1 = 1;
  var COMPARE_UNORDERED_FLAG$1 = 2;
  function baseIsMatch(object, source, matchData, customizer) {
    var index = matchData.length, length = index, noCustomizer = !customizer;
    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (index--) {
      var data = matchData[index];
      if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0], objValue = object[key], srcValue = data[1];
      if (noCustomizer && data[2]) {
        if (objValue === void 0 && !(key in object)) {
          return false;
        }
      } else {
        var stack = new Stack();
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack);
        }
        if (!(result === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack) : result)) {
          return false;
        }
      }
    }
    return true;
  }

  function isStrictComparable(value) {
    return value === value && !isObject(value);
  }

  function getMatchData(object) {
    var result = keys(object), length = result.length;
    while (length--) {
      var key = result[length], value = object[key];
      result[length] = [key, value, isStrictComparable(value)];
    }
    return result;
  }

  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
    };
  }

  function baseMatches(source) {
    var matchData = getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || baseIsMatch(object, source, matchData);
    };
  }

  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }

  function hasPath(object, path, hasFunc) {
    path = castPath(path, object);
    var index = -1, length = path.length, result = false;
    while (++index < length) {
      var key = toKey(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index != length) {
      return result;
    }
    length = object == null ? 0 : object.length;
    return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
  }

  function hasIn(object, path) {
    return object != null && hasPath(object, path, baseHasIn);
  }

  var COMPARE_PARTIAL_FLAG = 1;
  var COMPARE_UNORDERED_FLAG = 2;
  function baseMatchesProperty(path, srcValue) {
    if (isKey(path) && isStrictComparable(srcValue)) {
      return matchesStrictComparable(toKey(path), srcValue);
    }
    return function(object) {
      var objValue = get(object, path);
      return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
    };
  }

  function baseProperty(key) {
    return function(object) {
      return object == null ? void 0 : object[key];
    };
  }

  function basePropertyDeep(path) {
    return function(object) {
      return baseGet(object, path);
    };
  }

  function property(path) {
    return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
  }

  function baseIteratee(value) {
    if (typeof value == "function") {
      return value;
    }
    if (value == null) {
      return identity;
    }
    if (typeof value == "object") {
      return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
    }
    return property(value);
  }

  var FUNC_ERROR_TEXT$7 = "Expected a function";
  function cond(pairs) {
    var length = pairs == null ? 0 : pairs.length, toIteratee = baseIteratee;
    pairs = !length ? [] : arrayMap(pairs, function(pair) {
      if (typeof pair[1] != "function") {
        throw new TypeError(FUNC_ERROR_TEXT$7);
      }
      return [toIteratee(pair[0]), pair[1]];
    });
    return baseRest(function(args) {
      var index = -1;
      while (++index < length) {
        var pair = pairs[index];
        if (apply(pair[0], this, args)) {
          return apply(pair[1], this, args);
        }
      }
    });
  }

  function baseConformsTo(object, source, props) {
    var length = props.length;
    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (length--) {
      var key = props[length], predicate = source[key], value = object[key];
      if (value === void 0 && !(key in object) || !predicate(value)) {
        return false;
      }
    }
    return true;
  }

  function baseConforms(source) {
    var props = keys(source);
    return function(object) {
      return baseConformsTo(object, source, props);
    };
  }

  var CLONE_DEEP_FLAG$4 = 1;
  function conforms(source) {
    return baseConforms(baseClone(source, CLONE_DEEP_FLAG$4));
  }

  function conformsTo(object, source) {
    return source == null || baseConformsTo(object, source, keys(source));
  }

  function arrayAggregator(array, setter, iteratee, accumulator) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      var value = array[index];
      setter(accumulator, value, iteratee(value), array);
    }
    return accumulator;
  }

  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }

  var baseFor = createBaseFor();

  function baseForOwn(object, iteratee) {
    return object && baseFor(object, iteratee, keys);
  }

  function createBaseEach(eachFunc, fromRight) {
    return function(collection, iteratee) {
      if (collection == null) {
        return collection;
      }
      if (!isArrayLike(collection)) {
        return eachFunc(collection, iteratee);
      }
      var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
      while (fromRight ? index-- : ++index < length) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }

  var baseEach = createBaseEach(baseForOwn);

  function baseAggregator(collection, setter, iteratee, accumulator) {
    baseEach(collection, function(value, key, collection2) {
      setter(accumulator, value, iteratee(value), collection2);
    });
    return accumulator;
  }

  function createAggregator(setter, initializer) {
    return function(collection, iteratee) {
      var func = isArray(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
      return func(collection, setter, baseIteratee(iteratee), accumulator);
    };
  }

  var objectProto$9 = Object.prototype;
  var hasOwnProperty$8 = objectProto$9.hasOwnProperty;
  var countBy = createAggregator(function(result, value, key) {
    if (hasOwnProperty$8.call(result, key)) {
      ++result[key];
    } else {
      baseAssignValue(result, key, 1);
    }
  });

  function create(prototype, properties) {
    var result = baseCreate(prototype);
    return properties == null ? result : baseAssign(result, properties);
  }

  var WRAP_CURRY_FLAG$1 = 8;
  function curry(func, arity, guard) {
    arity = guard ? void 0 : arity;
    var result = createWrap(func, WRAP_CURRY_FLAG$1, void 0, void 0, void 0, void 0, void 0, arity);
    result.placeholder = curry.placeholder;
    return result;
  }
  curry.placeholder = {};

  var WRAP_CURRY_RIGHT_FLAG = 16;
  function curryRight(func, arity, guard) {
    arity = guard ? void 0 : arity;
    var result = createWrap(func, WRAP_CURRY_RIGHT_FLAG, void 0, void 0, void 0, void 0, void 0, arity);
    result.placeholder = curryRight.placeholder;
    return result;
  }
  curryRight.placeholder = {};

  var now = function() {
    return root.Date.now();
  };

  var FUNC_ERROR_TEXT$6 = "Expected a function";
  var nativeMax$b = Math.max;
  var nativeMin$b = Math.min;
  function debounce(func, wait, options) {
    var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$6);
    }
    wait = toNumber(wait) || 0;
    if (isObject(options)) {
      leading = !!options.leading;
      maxing = "maxWait" in options;
      maxWait = maxing ? nativeMax$b(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    function invokeFunc(time) {
      var args = lastArgs, thisArg = lastThis;
      lastArgs = lastThis = void 0;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }
    function leadingEdge(time) {
      lastInvokeTime = time;
      timerId = setTimeout(timerExpired, wait);
      return leading ? invokeFunc(time) : result;
    }
    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
      return maxing ? nativeMin$b(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
    }
    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
      return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
    }
    function timerExpired() {
      var time = now();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      timerId = setTimeout(timerExpired, remainingWait(time));
    }
    function trailingEdge(time) {
      timerId = void 0;
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = void 0;
      return result;
    }
    function cancel() {
      if (timerId !== void 0) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = void 0;
    }
    function flush() {
      return timerId === void 0 ? result : trailingEdge(now());
    }
    function debounced() {
      var time = now(), isInvoking = shouldInvoke(time);
      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;
      if (isInvoking) {
        if (timerId === void 0) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === void 0) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }

  function defaultTo(value, defaultValue) {
    return value == null || value !== value ? defaultValue : value;
  }

  var objectProto$8 = Object.prototype;
  var hasOwnProperty$7 = objectProto$8.hasOwnProperty;
  var defaults = baseRest(function(object, sources) {
    object = Object(object);
    var index = -1;
    var length = sources.length;
    var guard = length > 2 ? sources[2] : void 0;
    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      length = 1;
    }
    while (++index < length) {
      var source = sources[index];
      var props = keysIn(source);
      var propsIndex = -1;
      var propsLength = props.length;
      while (++propsIndex < propsLength) {
        var key = props[propsIndex];
        var value = object[key];
        if (value === void 0 || eq(value, objectProto$8[key]) && !hasOwnProperty$7.call(object, key)) {
          object[key] = source[key];
        }
      }
    }
    return object;
  });

  function assignMergeValue(object, key, value) {
    if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) {
      baseAssignValue(object, key, value);
    }
  }

  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }

  function safeGet(object, key) {
    if (key === "constructor" && typeof object[key] === "function") {
      return;
    }
    if (key == "__proto__") {
      return;
    }
    return object[key];
  }

  function toPlainObject(value) {
    return copyObject(value, keysIn(value));
  }

  function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
    var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
    if (stacked) {
      assignMergeValue(object, key, stacked);
      return;
    }
    var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
    var isCommon = newValue === void 0;
    if (isCommon) {
      var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
      newValue = srcValue;
      if (isArr || isBuff || isTyped) {
        if (isArray(objValue)) {
          newValue = objValue;
        } else if (isArrayLikeObject(objValue)) {
          newValue = copyArray(objValue);
        } else if (isBuff) {
          isCommon = false;
          newValue = cloneBuffer(srcValue, true);
        } else if (isTyped) {
          isCommon = false;
          newValue = cloneTypedArray(srcValue, true);
        } else {
          newValue = [];
        }
      } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
        newValue = objValue;
        if (isArguments(objValue)) {
          newValue = toPlainObject(objValue);
        } else if (!isObject(objValue) || isFunction(objValue)) {
          newValue = initCloneObject(srcValue);
        }
      } else {
        isCommon = false;
      }
    }
    if (isCommon) {
      stack.set(srcValue, newValue);
      mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
      stack["delete"](srcValue);
    }
    assignMergeValue(object, key, newValue);
  }

  function baseMerge(object, source, srcIndex, customizer, stack) {
    if (object === source) {
      return;
    }
    baseFor(source, function(srcValue, key) {
      stack || (stack = new Stack());
      if (isObject(srcValue)) {
        baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
      } else {
        var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
        if (newValue === void 0) {
          newValue = srcValue;
        }
        assignMergeValue(object, key, newValue);
      }
    }, keysIn);
  }

  function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
    if (isObject(objValue) && isObject(srcValue)) {
      stack.set(srcValue, objValue);
      baseMerge(objValue, srcValue, void 0, customDefaultsMerge, stack);
      stack["delete"](srcValue);
    }
    return objValue;
  }

  var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
    baseMerge(object, source, srcIndex, customizer);
  });

  var defaultsDeep = baseRest(function(args) {
    args.push(void 0, customDefaultsMerge);
    return apply(mergeWith, void 0, args);
  });

  var FUNC_ERROR_TEXT$5 = "Expected a function";
  function baseDelay(func, wait, args) {
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$5);
    }
    return setTimeout(function() {
      func.apply(void 0, args);
    }, wait);
  }

  var defer = baseRest(function(func, args) {
    return baseDelay(func, 1, args);
  });

  var delay = baseRest(function(func, wait, args) {
    return baseDelay(func, toNumber(wait) || 0, args);
  });

  function arrayIncludesWith(array, value, comparator) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }

  var LARGE_ARRAY_SIZE$1 = 200;
  function baseDifference(array, values, iteratee, comparator) {
    var index = -1, includes = arrayIncludes, isCommon = true, length = array.length, result = [], valuesLength = values.length;
    if (!length) {
      return result;
    }
    if (iteratee) {
      values = arrayMap(values, baseUnary(iteratee));
    }
    if (comparator) {
      includes = arrayIncludesWith;
      isCommon = false;
    } else if (values.length >= LARGE_ARRAY_SIZE$1) {
      includes = cacheHas;
      isCommon = false;
      values = new SetCache(values);
    }
    outer:
      while (++index < length) {
        var value = array[index], computed = iteratee == null ? value : iteratee(value);
        value = comparator || value !== 0 ? value : 0;
        if (isCommon && computed === computed) {
          var valuesIndex = valuesLength;
          while (valuesIndex--) {
            if (values[valuesIndex] === computed) {
              continue outer;
            }
          }
          result.push(value);
        } else if (!includes(values, computed, comparator)) {
          result.push(value);
        }
      }
    return result;
  }

  var difference = baseRest(function(array, values) {
    return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true)) : [];
  });

  function last(array) {
    var length = array == null ? 0 : array.length;
    return length ? array[length - 1] : void 0;
  }

  var differenceBy = baseRest(function(array, values) {
    var iteratee = last(values);
    if (isArrayLikeObject(iteratee)) {
      iteratee = void 0;
    }
    return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), baseIteratee(iteratee)) : [];
  });

  var differenceWith = baseRest(function(array, values) {
    var comparator = last(values);
    if (isArrayLikeObject(comparator)) {
      comparator = void 0;
    }
    return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), void 0, comparator) : [];
  });

  var divide = createMathOperation(function(dividend, divisor) {
    return dividend / divisor;
  }, 1);

  function drop(array, n, guard) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return [];
    }
    n = guard || n === void 0 ? 1 : toInteger(n);
    return baseSlice(array, n < 0 ? 0 : n, length);
  }

  function dropRight(array, n, guard) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return [];
    }
    n = guard || n === void 0 ? 1 : toInteger(n);
    n = length - n;
    return baseSlice(array, 0, n < 0 ? 0 : n);
  }

  function baseWhile(array, predicate, isDrop, fromRight) {
    var length = array.length, index = fromRight ? length : -1;
    while ((fromRight ? index-- : ++index < length) && predicate(array[index], index, array)) {
    }
    return isDrop ? baseSlice(array, fromRight ? 0 : index, fromRight ? index + 1 : length) : baseSlice(array, fromRight ? index + 1 : 0, fromRight ? length : index);
  }

  function dropRightWhile(array, predicate) {
    return array && array.length ? baseWhile(array, baseIteratee(predicate), true, true) : [];
  }

  function dropWhile(array, predicate) {
    return array && array.length ? baseWhile(array, baseIteratee(predicate), true) : [];
  }

  function castFunction(value) {
    return typeof value == "function" ? value : identity;
  }

  function forEach(collection, iteratee) {
    var func = isArray(collection) ? arrayEach : baseEach;
    return func(collection, castFunction(iteratee));
  }

  function arrayEachRight(array, iteratee) {
    var length = array == null ? 0 : array.length;
    while (length--) {
      if (iteratee(array[length], length, array) === false) {
        break;
      }
    }
    return array;
  }

  var baseForRight = createBaseFor(true);

  function baseForOwnRight(object, iteratee) {
    return object && baseForRight(object, iteratee, keys);
  }

  var baseEachRight = createBaseEach(baseForOwnRight, true);

  function forEachRight(collection, iteratee) {
    var func = isArray(collection) ? arrayEachRight : baseEachRight;
    return func(collection, castFunction(iteratee));
  }

  function endsWith(string, target, position) {
    string = toString(string);
    target = baseToString(target);
    var length = string.length;
    position = position === void 0 ? length : baseClamp(toInteger(position), 0, length);
    var end = position;
    position -= target.length;
    return position >= 0 && string.slice(position, end) == target;
  }

  function baseToPairs(object, props) {
    return arrayMap(props, function(key) {
      return [key, object[key]];
    });
  }

  function setToPairs(set) {
    var index = -1, result = Array(set.size);
    set.forEach(function(value) {
      result[++index] = [value, value];
    });
    return result;
  }

  var mapTag$3 = "[object Map]";
  var setTag$3 = "[object Set]";
  function createToPairs(keysFunc) {
    return function(object) {
      var tag = getTag$1(object);
      if (tag == mapTag$3) {
        return mapToArray(object);
      }
      if (tag == setTag$3) {
        return setToPairs(object);
      }
      return baseToPairs(object, keysFunc(object));
    };
  }

  var toPairs = createToPairs(keys);

  var toPairsIn = createToPairs(keysIn);

  var htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  var escapeHtmlChar = basePropertyOf(htmlEscapes);

  var reUnescapedHtml = /[&<>"']/g;
  var reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
  function escape(string) {
    string = toString(string);
    return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
  }

  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
  var reHasRegExpChar = RegExp(reRegExpChar.source);
  function escapeRegExp(string) {
    string = toString(string);
    return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
  }

  function arrayEvery(array, predicate) {
    var index = -1, length = array == null ? 0 : array.length;
    while (++index < length) {
      if (!predicate(array[index], index, array)) {
        return false;
      }
    }
    return true;
  }

  function baseEvery(collection, predicate) {
    var result = true;
    baseEach(collection, function(value, index, collection2) {
      result = !!predicate(value, index, collection2);
      return result;
    });
    return result;
  }

  function every(collection, predicate, guard) {
    var func = isArray(collection) ? arrayEvery : baseEvery;
    if (guard && isIterateeCall(collection, predicate, guard)) {
      predicate = void 0;
    }
    return func(collection, baseIteratee(predicate));
  }

  var MAX_ARRAY_LENGTH$5 = 4294967295;
  function toLength(value) {
    return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH$5) : 0;
  }

  function baseFill(array, value, start, end) {
    var length = array.length;
    start = toInteger(start);
    if (start < 0) {
      start = -start > length ? 0 : length + start;
    }
    end = end === void 0 || end > length ? length : toInteger(end);
    if (end < 0) {
      end += length;
    }
    end = start > end ? 0 : toLength(end);
    while (start < end) {
      array[start++] = value;
    }
    return array;
  }

  function fill(array, value, start, end) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return [];
    }
    if (start && typeof start != "number" && isIterateeCall(array, value, start)) {
      start = 0;
      end = length;
    }
    return baseFill(array, value, start, end);
  }

  function baseFilter(collection, predicate) {
    var result = [];
    baseEach(collection, function(value, index, collection2) {
      if (predicate(value, index, collection2)) {
        result.push(value);
      }
    });
    return result;
  }

  function filter(collection, predicate) {
    var func = isArray(collection) ? arrayFilter : baseFilter;
    return func(collection, baseIteratee(predicate));
  }

  function createFind(findIndexFunc) {
    return function(collection, predicate, fromIndex) {
      var iterable = Object(collection);
      if (!isArrayLike(collection)) {
        var iteratee = baseIteratee(predicate);
        collection = keys(collection);
        predicate = function(key) {
          return iteratee(iterable[key], key, iterable);
        };
      }
      var index = findIndexFunc(collection, predicate, fromIndex);
      return index > -1 ? iterable[iteratee ? collection[index] : index] : void 0;
    };
  }

  var nativeMax$a = Math.max;
  function findIndex(array, predicate, fromIndex) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return -1;
    }
    var index = fromIndex == null ? 0 : toInteger(fromIndex);
    if (index < 0) {
      index = nativeMax$a(length + index, 0);
    }
    return baseFindIndex(array, baseIteratee(predicate), index);
  }

  var find = createFind(findIndex);

  function baseFindKey(collection, predicate, eachFunc) {
    var result;
    eachFunc(collection, function(value, key, collection2) {
      if (predicate(value, key, collection2)) {
        result = key;
        return false;
      }
    });
    return result;
  }

  function findKey(object, predicate) {
    return baseFindKey(object, baseIteratee(predicate), baseForOwn);
  }

  var nativeMax$9 = Math.max;
  var nativeMin$a = Math.min;
  function findLastIndex(array, predicate, fromIndex) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return -1;
    }
    var index = length - 1;
    if (fromIndex !== void 0) {
      index = toInteger(fromIndex);
      index = fromIndex < 0 ? nativeMax$9(length + index, 0) : nativeMin$a(index, length - 1);
    }
    return baseFindIndex(array, baseIteratee(predicate), index, true);
  }

  var findLast = createFind(findLastIndex);

  function findLastKey(object, predicate) {
    return baseFindKey(object, baseIteratee(predicate), baseForOwnRight);
  }

  function head(array) {
    return array && array.length ? array[0] : void 0;
  }

  function baseMap(collection, iteratee) {
    var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
    baseEach(collection, function(value, key, collection2) {
      result[++index] = iteratee(value, key, collection2);
    });
    return result;
  }

  function map(collection, iteratee) {
    var func = isArray(collection) ? arrayMap : baseMap;
    return func(collection, baseIteratee(iteratee));
  }

  function flatMap(collection, iteratee) {
    return baseFlatten(map(collection, iteratee), 1);
  }

  var INFINITY$2 = 1 / 0;
  function flatMapDeep(collection, iteratee) {
    return baseFlatten(map(collection, iteratee), INFINITY$2);
  }

  function flatMapDepth(collection, iteratee, depth) {
    depth = depth === void 0 ? 1 : toInteger(depth);
    return baseFlatten(map(collection, iteratee), depth);
  }

  var INFINITY$1 = 1 / 0;
  function flattenDeep(array) {
    var length = array == null ? 0 : array.length;
    return length ? baseFlatten(array, INFINITY$1) : [];
  }

  function flattenDepth(array, depth) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return [];
    }
    depth = depth === void 0 ? 1 : toInteger(depth);
    return baseFlatten(array, depth);
  }

  var WRAP_FLIP_FLAG = 512;
  function flip(func) {
    return createWrap(func, WRAP_FLIP_FLAG);
  }

  var floor$1 = createRound("floor");

  var FUNC_ERROR_TEXT$4 = "Expected a function";
  var WRAP_CURRY_FLAG = 8;
  var WRAP_PARTIAL_FLAG$1 = 32;
  var WRAP_ARY_FLAG = 128;
  var WRAP_REARG_FLAG$1 = 256;
  function createFlow(fromRight) {
    return flatRest(function(funcs) {
      var length = funcs.length, index = length, prereq = LodashWrapper.prototype.thru;
      if (fromRight) {
        funcs.reverse();
      }
      while (index--) {
        var func = funcs[index];
        if (typeof func != "function") {
          throw new TypeError(FUNC_ERROR_TEXT$4);
        }
        if (prereq && !wrapper && getFuncName(func) == "wrapper") {
          var wrapper = new LodashWrapper([], true);
        }
      }
      index = wrapper ? index : length;
      while (++index < length) {
        func = funcs[index];
        var funcName = getFuncName(func), data = funcName == "wrapper" ? getData(func) : void 0;
        if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG$1 | WRAP_REARG_FLAG$1) && !data[4].length && data[9] == 1) {
          wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
        } else {
          wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
        }
      }
      return function() {
        var args = arguments, value = args[0];
        if (wrapper && args.length == 1 && isArray(value)) {
          return wrapper.plant(value).value();
        }
        var index2 = 0, result = length ? funcs[index2].apply(this, args) : value;
        while (++index2 < length) {
          result = funcs[index2].call(this, result);
        }
        return result;
      };
    });
  }

  var flow = createFlow();

  var flowRight = createFlow(true);

  function forIn(object, iteratee) {
    return object == null ? object : baseFor(object, castFunction(iteratee), keysIn);
  }

  function forInRight(object, iteratee) {
    return object == null ? object : baseForRight(object, castFunction(iteratee), keysIn);
  }

  function forOwn(object, iteratee) {
    return object && baseForOwn(object, castFunction(iteratee));
  }

  function forOwnRight(object, iteratee) {
    return object && baseForOwnRight(object, castFunction(iteratee));
  }

  function fromPairs(pairs) {
    var index = -1, length = pairs == null ? 0 : pairs.length, result = {};
    while (++index < length) {
      var pair = pairs[index];
      result[pair[0]] = pair[1];
    }
    return result;
  }

  function baseFunctions(object, props) {
    return arrayFilter(props, function(key) {
      return isFunction(object[key]);
    });
  }

  function functions(object) {
    return object == null ? [] : baseFunctions(object, keys(object));
  }

  function functionsIn(object) {
    return object == null ? [] : baseFunctions(object, keysIn(object));
  }

  var objectProto$7 = Object.prototype;
  var hasOwnProperty$6 = objectProto$7.hasOwnProperty;
  var groupBy = createAggregator(function(result, value, key) {
    if (hasOwnProperty$6.call(result, key)) {
      result[key].push(value);
    } else {
      baseAssignValue(result, key, [value]);
    }
  });

  function baseGt(value, other) {
    return value > other;
  }

  function createRelationalOperation(operator) {
    return function(value, other) {
      if (!(typeof value == "string" && typeof other == "string")) {
        value = toNumber(value);
        other = toNumber(other);
      }
      return operator(value, other);
    };
  }

  var gt$1 = createRelationalOperation(baseGt);

  var gte = createRelationalOperation(function(value, other) {
    return value >= other;
  });

  var objectProto$6 = Object.prototype;
  var hasOwnProperty$5 = objectProto$6.hasOwnProperty;
  function baseHas(object, key) {
    return object != null && hasOwnProperty$5.call(object, key);
  }

  function has(object, path) {
    return object != null && hasPath(object, path, baseHas);
  }

  var nativeMax$8 = Math.max;
  var nativeMin$9 = Math.min;
  function baseInRange(number, start, end) {
    return number >= nativeMin$9(start, end) && number < nativeMax$8(start, end);
  }

  function inRange(number, start, end) {
    start = toFinite(start);
    if (end === void 0) {
      end = start;
      start = 0;
    } else {
      end = toFinite(end);
    }
    number = toNumber(number);
    return baseInRange(number, start, end);
  }

  var stringTag = "[object String]";
  function isString(value) {
    return typeof value == "string" || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag;
  }

  function baseValues(object, props) {
    return arrayMap(props, function(key) {
      return object[key];
    });
  }

  function values(object) {
    return object == null ? [] : baseValues(object, keys(object));
  }

  var nativeMax$7 = Math.max;
  function includes(collection, value, fromIndex, guard) {
    collection = isArrayLike(collection) ? collection : values(collection);
    fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
    var length = collection.length;
    if (fromIndex < 0) {
      fromIndex = nativeMax$7(length + fromIndex, 0);
    }
    return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
  }

  var nativeMax$6 = Math.max;
  function indexOf(array, value, fromIndex) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return -1;
    }
    var index = fromIndex == null ? 0 : toInteger(fromIndex);
    if (index < 0) {
      index = nativeMax$6(length + index, 0);
    }
    return baseIndexOf(array, value, index);
  }

  function initial(array) {
    var length = array == null ? 0 : array.length;
    return length ? baseSlice(array, 0, -1) : [];
  }

  var nativeMin$8 = Math.min;
  function baseIntersection(arrays, iteratee, comparator) {
    var includes = comparator ? arrayIncludesWith : arrayIncludes, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array(othLength), maxLength = Infinity, result = [];
    while (othIndex--) {
      var array = arrays[othIndex];
      if (othIndex && iteratee) {
        array = arrayMap(array, baseUnary(iteratee));
      }
      maxLength = nativeMin$8(array.length, maxLength);
      caches[othIndex] = !comparator && (iteratee || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : void 0;
    }
    array = arrays[0];
    var index = -1, seen = caches[0];
    outer:
      while (++index < length && result.length < maxLength) {
        var value = array[index], computed = iteratee ? iteratee(value) : value;
        value = comparator || value !== 0 ? value : 0;
        if (!(seen ? cacheHas(seen, computed) : includes(result, computed, comparator))) {
          othIndex = othLength;
          while (--othIndex) {
            var cache = caches[othIndex];
            if (!(cache ? cacheHas(cache, computed) : includes(arrays[othIndex], computed, comparator))) {
              continue outer;
            }
          }
          if (seen) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
    return result;
  }

  function castArrayLikeObject(value) {
    return isArrayLikeObject(value) ? value : [];
  }

  var intersection = baseRest(function(arrays) {
    var mapped = arrayMap(arrays, castArrayLikeObject);
    return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
  });

  var intersectionBy = baseRest(function(arrays) {
    var iteratee = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
    if (iteratee === last(mapped)) {
      iteratee = void 0;
    } else {
      mapped.pop();
    }
    return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, baseIteratee(iteratee)) : [];
  });

  var intersectionWith = baseRest(function(arrays) {
    var comparator = last(arrays), mapped = arrayMap(arrays, castArrayLikeObject);
    comparator = typeof comparator == "function" ? comparator : void 0;
    if (comparator) {
      mapped.pop();
    }
    return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, void 0, comparator) : [];
  });

  function baseInverter(object, setter, iteratee, accumulator) {
    baseForOwn(object, function(value, key, object2) {
      setter(accumulator, iteratee(value), key, object2);
    });
    return accumulator;
  }

  function createInverter(setter, toIteratee) {
    return function(object, iteratee) {
      return baseInverter(object, setter, toIteratee(iteratee), {});
    };
  }

  var objectProto$5 = Object.prototype;
  var nativeObjectToString$1 = objectProto$5.toString;
  var invert = createInverter(function(result, value, key) {
    if (value != null && typeof value.toString != "function") {
      value = nativeObjectToString$1.call(value);
    }
    result[value] = key;
  }, constant(identity));

  var objectProto$4 = Object.prototype;
  var hasOwnProperty$4 = objectProto$4.hasOwnProperty;
  var nativeObjectToString = objectProto$4.toString;
  var invertBy = createInverter(function(result, value, key) {
    if (value != null && typeof value.toString != "function") {
      value = nativeObjectToString.call(value);
    }
    if (hasOwnProperty$4.call(result, value)) {
      result[value].push(key);
    } else {
      result[value] = [key];
    }
  }, baseIteratee);

  function parent(object, path) {
    return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
  }

  function baseInvoke(object, path, args) {
    path = castPath(path, object);
    object = parent(object, path);
    var func = object == null ? object : object[toKey(last(path))];
    return func == null ? void 0 : apply(func, object, args);
  }

  var invoke = baseRest(baseInvoke);

  var invokeMap = baseRest(function(collection, path, args) {
    var index = -1, isFunc = typeof path == "function", result = isArrayLike(collection) ? Array(collection.length) : [];
    baseEach(collection, function(value) {
      result[++index] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
    });
    return result;
  });

  var arrayBufferTag = "[object ArrayBuffer]";
  function baseIsArrayBuffer(value) {
    return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
  }

  var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer;
  var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;

  var boolTag = "[object Boolean]";
  function isBoolean$1(value) {
    return value === true || value === false || isObjectLike(value) && baseGetTag(value) == boolTag;
  }

  var dateTag = "[object Date]";
  function baseIsDate(value) {
    return isObjectLike(value) && baseGetTag(value) == dateTag;
  }

  var nodeIsDate = nodeUtil && nodeUtil.isDate;
  var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;

  function isElement$2(value) {
    return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
  }

  var mapTag$2 = "[object Map]";
  var setTag$2 = "[object Set]";
  var objectProto$3 = Object.prototype;
  var hasOwnProperty$3 = objectProto$3.hasOwnProperty;
  function isEmpty$1(value) {
    if (value == null) {
      return true;
    }
    if (isArrayLike(value) && (isArray(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
      return !value.length;
    }
    var tag = getTag$1(value);
    if (tag == mapTag$2 || tag == setTag$2) {
      return !value.size;
    }
    if (isPrototype(value)) {
      return !baseKeys(value).length;
    }
    for (var key in value) {
      if (hasOwnProperty$3.call(value, key)) {
        return false;
      }
    }
    return true;
  }

  function isEqual$1(value, other) {
    return baseIsEqual(value, other);
  }

  function isEqualWith(value, other, customizer) {
    customizer = typeof customizer == "function" ? customizer : void 0;
    var result = customizer ? customizer(value, other) : void 0;
    return result === void 0 ? baseIsEqual(value, other, void 0, customizer) : !!result;
  }

  var nativeIsFinite = root.isFinite;
  function isFinite(value) {
    return typeof value == "number" && nativeIsFinite(value);
  }

  function isInteger(value) {
    return typeof value == "number" && value == toInteger(value);
  }

  function isMatch(object, source) {
    return object === source || baseIsMatch(object, source, getMatchData(source));
  }

  function isMatchWith(object, source, customizer) {
    customizer = typeof customizer == "function" ? customizer : void 0;
    return baseIsMatch(object, source, getMatchData(source), customizer);
  }

  var numberTag = "[object Number]";
  function isNumber$1(value) {
    return typeof value == "number" || isObjectLike(value) && baseGetTag(value) == numberTag;
  }

  function isNaN$1(value) {
    return isNumber$1(value) && value != +value;
  }

  var isMaskable = coreJsData ? isFunction : stubFalse;

  var CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.";
  function isNative(value) {
    if (isMaskable(value)) {
      throw new Error(CORE_ERROR_TEXT);
    }
    return baseIsNative(value);
  }

  function isNil(value) {
    return value == null;
  }

  function isNull(value) {
    return value === null;
  }

  var regexpTag = "[object RegExp]";
  function baseIsRegExp(value) {
    return isObjectLike(value) && baseGetTag(value) == regexpTag;
  }

  var nodeIsRegExp = nodeUtil && nodeUtil.isRegExp;
  var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;

  var MAX_SAFE_INTEGER$3 = 9007199254740991;
  function isSafeInteger(value) {
    return isInteger(value) && value >= -MAX_SAFE_INTEGER$3 && value <= MAX_SAFE_INTEGER$3;
  }

  function isUndefined$1(value) {
    return value === void 0;
  }

  var weakMapTag = "[object WeakMap]";
  function isWeakMap(value) {
    return isObjectLike(value) && getTag$1(value) == weakMapTag;
  }

  var weakSetTag = "[object WeakSet]";
  function isWeakSet(value) {
    return isObjectLike(value) && baseGetTag(value) == weakSetTag;
  }

  var CLONE_DEEP_FLAG$3 = 1;
  function iteratee(func) {
    return baseIteratee(typeof func == "function" ? func : baseClone(func, CLONE_DEEP_FLAG$3));
  }

  var arrayProto$4 = Array.prototype;
  var nativeJoin = arrayProto$4.join;
  function join(array, separator) {
    return array == null ? "" : nativeJoin.call(array, separator);
  }

  var kebabCase = createCompounder(function(result, word, index) {
    return result + (index ? "-" : "") + word.toLowerCase();
  });

  var keyBy = createAggregator(function(result, value, key) {
    baseAssignValue(result, key, value);
  });

  function strictLastIndexOf(array, value, fromIndex) {
    var index = fromIndex + 1;
    while (index--) {
      if (array[index] === value) {
        return index;
      }
    }
    return index;
  }

  var nativeMax$5 = Math.max;
  var nativeMin$7 = Math.min;
  function lastIndexOf(array, value, fromIndex) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return -1;
    }
    var index = length;
    if (fromIndex !== void 0) {
      index = toInteger(fromIndex);
      index = index < 0 ? nativeMax$5(length + index, 0) : nativeMin$7(index, length - 1);
    }
    return value === value ? strictLastIndexOf(array, value, index) : baseFindIndex(array, baseIsNaN, index, true);
  }

  var lowerCase = createCompounder(function(result, word, index) {
    return result + (index ? " " : "") + word.toLowerCase();
  });

  var lowerFirst = createCaseFirst("toLowerCase");

  function baseLt(value, other) {
    return value < other;
  }

  var lt$1 = createRelationalOperation(baseLt);

  var lte = createRelationalOperation(function(value, other) {
    return value <= other;
  });

  function mapKeys(object, iteratee) {
    var result = {};
    iteratee = baseIteratee(iteratee);
    baseForOwn(object, function(value, key, object2) {
      baseAssignValue(result, iteratee(value, key, object2), value);
    });
    return result;
  }

  function mapValues(object, iteratee) {
    var result = {};
    iteratee = baseIteratee(iteratee);
    baseForOwn(object, function(value, key, object2) {
      baseAssignValue(result, key, iteratee(value, key, object2));
    });
    return result;
  }

  var CLONE_DEEP_FLAG$2 = 1;
  function matches(source) {
    return baseMatches(baseClone(source, CLONE_DEEP_FLAG$2));
  }

  var CLONE_DEEP_FLAG$1 = 1;
  function matchesProperty(path, srcValue) {
    return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG$1));
  }

  function baseExtremum(array, iteratee, comparator) {
    var index = -1, length = array.length;
    while (++index < length) {
      var value = array[index], current = iteratee(value);
      if (current != null && (computed === void 0 ? current === current && !isSymbol(current) : comparator(current, computed))) {
        var computed = current, result = value;
      }
    }
    return result;
  }

  function max$3(array) {
    return array && array.length ? baseExtremum(array, identity, baseGt) : void 0;
  }

  function maxBy(array, iteratee) {
    return array && array.length ? baseExtremum(array, baseIteratee(iteratee), baseGt) : void 0;
  }

  function baseSum(array, iteratee) {
    var result, index = -1, length = array.length;
    while (++index < length) {
      var current = iteratee(array[index]);
      if (current !== void 0) {
        result = result === void 0 ? current : result + current;
      }
    }
    return result;
  }

  var NAN = 0 / 0;
  function baseMean(array, iteratee) {
    var length = array == null ? 0 : array.length;
    return length ? baseSum(array, iteratee) / length : NAN;
  }

  function mean(array) {
    return baseMean(array, identity);
  }

  function meanBy(array, iteratee) {
    return baseMean(array, baseIteratee(iteratee));
  }

  var merge = createAssigner(function(object, source, srcIndex) {
    baseMerge(object, source, srcIndex);
  });

  var method = baseRest(function(path, args) {
    return function(object) {
      return baseInvoke(object, path, args);
    };
  });

  var methodOf = baseRest(function(object, args) {
    return function(path) {
      return baseInvoke(object, path, args);
    };
  });

  function min$3(array) {
    return array && array.length ? baseExtremum(array, identity, baseLt) : void 0;
  }

  function minBy(array, iteratee) {
    return array && array.length ? baseExtremum(array, baseIteratee(iteratee), baseLt) : void 0;
  }

  function mixin$1(object, source, options) {
    var props = keys(source), methodNames = baseFunctions(source, props);
    var chain = !(isObject(options) && "chain" in options) || !!options.chain, isFunc = isFunction(object);
    arrayEach(methodNames, function(methodName) {
      var func = source[methodName];
      object[methodName] = func;
      if (isFunc) {
        object.prototype[methodName] = function() {
          var chainAll = this.__chain__;
          if (chain || chainAll) {
            var result = object(this.__wrapped__), actions = result.__actions__ = copyArray(this.__actions__);
            actions.push({ "func": func, "args": arguments, "thisArg": object });
            result.__chain__ = chainAll;
            return result;
          }
          return func.apply(object, arrayPush([this.value()], arguments));
        };
      }
    });
    return object;
  }

  var multiply = createMathOperation(function(multiplier, multiplicand) {
    return multiplier * multiplicand;
  }, 1);

  var FUNC_ERROR_TEXT$3 = "Expected a function";
  function negate(predicate) {
    if (typeof predicate != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$3);
    }
    return function() {
      var args = arguments;
      switch (args.length) {
        case 0:
          return !predicate.call(this);
        case 1:
          return !predicate.call(this, args[0]);
        case 2:
          return !predicate.call(this, args[0], args[1]);
        case 3:
          return !predicate.call(this, args[0], args[1], args[2]);
      }
      return !predicate.apply(this, args);
    };
  }

  function iteratorToArray(iterator) {
    var data, result = [];
    while (!(data = iterator.next()).done) {
      result.push(data.value);
    }
    return result;
  }

  var mapTag$1 = "[object Map]";
  var setTag$1 = "[object Set]";
  var symIterator$1 = Symbol$1 ? Symbol$1.iterator : void 0;
  function toArray(value) {
    if (!value) {
      return [];
    }
    if (isArrayLike(value)) {
      return isString(value) ? stringToArray(value) : copyArray(value);
    }
    if (symIterator$1 && value[symIterator$1]) {
      return iteratorToArray(value[symIterator$1]());
    }
    var tag = getTag$1(value), func = tag == mapTag$1 ? mapToArray : tag == setTag$1 ? setToArray : values;
    return func(value);
  }

  function wrapperNext() {
    if (this.__values__ === void 0) {
      this.__values__ = toArray(this.value());
    }
    var done = this.__index__ >= this.__values__.length, value = done ? void 0 : this.__values__[this.__index__++];
    return { "done": done, "value": value };
  }

  function baseNth(array, n) {
    var length = array.length;
    if (!length) {
      return;
    }
    n += n < 0 ? length : 0;
    return isIndex(n, length) ? array[n] : void 0;
  }

  function nth(array, n) {
    return array && array.length ? baseNth(array, toInteger(n)) : void 0;
  }

  function nthArg(n) {
    n = toInteger(n);
    return baseRest(function(args) {
      return baseNth(args, n);
    });
  }

  function baseUnset(object, path) {
    path = castPath(path, object);
    object = parent(object, path);
    return object == null || delete object[toKey(last(path))];
  }

  function customOmitClone(value) {
    return isPlainObject(value) ? void 0 : value;
  }

  var CLONE_DEEP_FLAG = 1;
  var CLONE_FLAT_FLAG = 2;
  var CLONE_SYMBOLS_FLAG = 4;
  var omit = flatRest(function(object, paths) {
    var result = {};
    if (object == null) {
      return result;
    }
    var isDeep = false;
    paths = arrayMap(paths, function(path) {
      path = castPath(path, object);
      isDeep || (isDeep = path.length > 1);
      return path;
    });
    copyObject(object, getAllKeysIn(object), result);
    if (isDeep) {
      result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
    }
    var length = paths.length;
    while (length--) {
      baseUnset(result, paths[length]);
    }
    return result;
  });

  function baseSet(object, path, value, customizer) {
    if (!isObject(object)) {
      return object;
    }
    path = castPath(path, object);
    var index = -1, length = path.length, lastIndex = length - 1, nested = object;
    while (nested != null && ++index < length) {
      var key = toKey(path[index]), newValue = value;
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        return object;
      }
      if (index != lastIndex) {
        var objValue = nested[key];
        newValue = customizer ? customizer(objValue, key, nested) : void 0;
        if (newValue === void 0) {
          newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
        }
      }
      assignValue(nested, key, newValue);
      nested = nested[key];
    }
    return object;
  }

  function basePickBy(object, paths, predicate) {
    var index = -1, length = paths.length, result = {};
    while (++index < length) {
      var path = paths[index], value = baseGet(object, path);
      if (predicate(value, path)) {
        baseSet(result, castPath(path, object), value);
      }
    }
    return result;
  }

  function pickBy(object, predicate) {
    if (object == null) {
      return {};
    }
    var props = arrayMap(getAllKeysIn(object), function(prop) {
      return [prop];
    });
    predicate = baseIteratee(predicate);
    return basePickBy(object, props, function(value, path) {
      return predicate(value, path[0]);
    });
  }

  function omitBy(object, predicate) {
    return pickBy(object, negate(baseIteratee(predicate)));
  }

  function once(func) {
    return before(2, func);
  }

  function baseSortBy(array, comparer) {
    var length = array.length;
    array.sort(comparer);
    while (length--) {
      array[length] = array[length].value;
    }
    return array;
  }

  function compareAscending(value, other) {
    if (value !== other) {
      var valIsDefined = value !== void 0, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol(value);
      var othIsDefined = other !== void 0, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol(other);
      if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
        return 1;
      }
      if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
        return -1;
      }
    }
    return 0;
  }

  function compareMultiple(object, other, orders) {
    var index = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
    while (++index < length) {
      var result = compareAscending(objCriteria[index], othCriteria[index]);
      if (result) {
        if (index >= ordersLength) {
          return result;
        }
        var order = orders[index];
        return result * (order == "desc" ? -1 : 1);
      }
    }
    return object.index - other.index;
  }

  function baseOrderBy(collection, iteratees, orders) {
    if (iteratees.length) {
      iteratees = arrayMap(iteratees, function(iteratee) {
        if (isArray(iteratee)) {
          return function(value) {
            return baseGet(value, iteratee.length === 1 ? iteratee[0] : iteratee);
          };
        }
        return iteratee;
      });
    } else {
      iteratees = [identity];
    }
    var index = -1;
    iteratees = arrayMap(iteratees, baseUnary(baseIteratee));
    var result = baseMap(collection, function(value, key, collection2) {
      var criteria = arrayMap(iteratees, function(iteratee) {
        return iteratee(value);
      });
      return { "criteria": criteria, "index": ++index, "value": value };
    });
    return baseSortBy(result, function(object, other) {
      return compareMultiple(object, other, orders);
    });
  }

  function orderBy$1(collection, iteratees, orders, guard) {
    if (collection == null) {
      return [];
    }
    if (!isArray(iteratees)) {
      iteratees = iteratees == null ? [] : [iteratees];
    }
    orders = guard ? void 0 : orders;
    if (!isArray(orders)) {
      orders = orders == null ? [] : [orders];
    }
    return baseOrderBy(collection, iteratees, orders);
  }

  function createOver(arrayFunc) {
    return flatRest(function(iteratees) {
      iteratees = arrayMap(iteratees, baseUnary(baseIteratee));
      return baseRest(function(args) {
        var thisArg = this;
        return arrayFunc(iteratees, function(iteratee) {
          return apply(iteratee, thisArg, args);
        });
      });
    });
  }

  var over = createOver(arrayMap);

  var castRest = baseRest;

  var nativeMin$6 = Math.min;
  var overArgs = castRest(function(func, transforms) {
    transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(baseIteratee)) : arrayMap(baseFlatten(transforms, 1), baseUnary(baseIteratee));
    var funcsLength = transforms.length;
    return baseRest(function(args) {
      var index = -1, length = nativeMin$6(args.length, funcsLength);
      while (++index < length) {
        args[index] = transforms[index].call(this, args[index]);
      }
      return apply(func, this, args);
    });
  });

  var overEvery = createOver(arrayEvery);

  var overSome = createOver(arraySome);

  var MAX_SAFE_INTEGER$2 = 9007199254740991;
  var nativeFloor$3 = Math.floor;
  function baseRepeat(string, n) {
    var result = "";
    if (!string || n < 1 || n > MAX_SAFE_INTEGER$2) {
      return result;
    }
    do {
      if (n % 2) {
        result += string;
      }
      n = nativeFloor$3(n / 2);
      if (n) {
        string += string;
      }
    } while (n);
    return result;
  }

  var asciiSize = baseProperty("length");

  var rsAstralRange = "\\ud800-\\udfff";
  var rsComboMarksRange = "\\u0300-\\u036f";
  var reComboHalfMarksRange = "\\ufe20-\\ufe2f";
  var rsComboSymbolsRange = "\\u20d0-\\u20ff";
  var rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
  var rsVarRange = "\\ufe0e\\ufe0f";
  var rsAstral = "[" + rsAstralRange + "]";
  var rsCombo = "[" + rsComboRange + "]";
  var rsFitz = "\\ud83c[\\udffb-\\udfff]";
  var rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")";
  var rsNonAstral = "[^" + rsAstralRange + "]";
  var rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
  var rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
  var rsZWJ = "\\u200d";
  var reOptMod = rsModifier + "?";
  var rsOptVar = "[" + rsVarRange + "]?";
  var rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*";
  var rsSeq = rsOptVar + reOptMod + rsOptJoin;
  var rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
  var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
  function unicodeSize(string) {
    var result = reUnicode.lastIndex = 0;
    while (reUnicode.test(string)) {
      ++result;
    }
    return result;
  }

  function stringSize(string) {
    return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
  }

  var nativeCeil$2 = Math.ceil;
  function createPadding(length, chars) {
    chars = chars === void 0 ? " " : baseToString(chars);
    var charsLength = chars.length;
    if (charsLength < 2) {
      return charsLength ? baseRepeat(chars, length) : chars;
    }
    var result = baseRepeat(chars, nativeCeil$2(length / stringSize(chars)));
    return hasUnicode(chars) ? castSlice(stringToArray(result), 0, length).join("") : result.slice(0, length);
  }

  var nativeCeil$1 = Math.ceil;
  var nativeFloor$2 = Math.floor;
  function pad(string, length, chars) {
    string = toString(string);
    length = toInteger(length);
    var strLength = length ? stringSize(string) : 0;
    if (!length || strLength >= length) {
      return string;
    }
    var mid = (length - strLength) / 2;
    return createPadding(nativeFloor$2(mid), chars) + string + createPadding(nativeCeil$1(mid), chars);
  }

  function padEnd(string, length, chars) {
    string = toString(string);
    length = toInteger(length);
    var strLength = length ? stringSize(string) : 0;
    return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
  }

  function padStart(string, length, chars) {
    string = toString(string);
    length = toInteger(length);
    var strLength = length ? stringSize(string) : 0;
    return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
  }

  var reTrimStart$1 = /^\s+/;
  var nativeParseInt = root.parseInt;
  function parseInt$1(string, radix, guard) {
    if (guard || radix == null) {
      radix = 0;
    } else if (radix) {
      radix = +radix;
    }
    return nativeParseInt(toString(string).replace(reTrimStart$1, ""), radix || 0);
  }

  var WRAP_PARTIAL_FLAG = 32;
  var partial = baseRest(function(func, partials) {
    var holders = replaceHolders(partials, getHolder(partial));
    return createWrap(func, WRAP_PARTIAL_FLAG, void 0, partials, holders);
  });
  partial.placeholder = {};

  var WRAP_PARTIAL_RIGHT_FLAG = 64;
  var partialRight = baseRest(function(func, partials) {
    var holders = replaceHolders(partials, getHolder(partialRight));
    return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, void 0, partials, holders);
  });
  partialRight.placeholder = {};

  var partition = createAggregator(function(result, value, key) {
    result[key ? 0 : 1].push(value);
  }, function() {
    return [[], []];
  });

  function basePick(object, paths) {
    return basePickBy(object, paths, function(value, path) {
      return hasIn(object, path);
    });
  }

  var pick = flatRest(function(object, paths) {
    return object == null ? {} : basePick(object, paths);
  });

  function wrapperPlant(value) {
    var result, parent = this;
    while (parent instanceof baseLodash) {
      var clone = wrapperClone(parent);
      clone.__index__ = 0;
      clone.__values__ = void 0;
      if (result) {
        previous.__wrapped__ = clone;
      } else {
        result = clone;
      }
      var previous = clone;
      parent = parent.__wrapped__;
    }
    previous.__wrapped__ = value;
    return result;
  }

  function propertyOf(object) {
    return function(path) {
      return object == null ? void 0 : baseGet(object, path);
    };
  }

  function baseIndexOfWith(array, value, fromIndex, comparator) {
    var index = fromIndex - 1, length = array.length;
    while (++index < length) {
      if (comparator(array[index], value)) {
        return index;
      }
    }
    return -1;
  }

  var arrayProto$3 = Array.prototype;
  var splice$1 = arrayProto$3.splice;
  function basePullAll(array, values, iteratee, comparator) {
    var indexOf = comparator ? baseIndexOfWith : baseIndexOf, index = -1, length = values.length, seen = array;
    if (array === values) {
      values = copyArray(values);
    }
    if (iteratee) {
      seen = arrayMap(array, baseUnary(iteratee));
    }
    while (++index < length) {
      var fromIndex = 0, value = values[index], computed = iteratee ? iteratee(value) : value;
      while ((fromIndex = indexOf(seen, computed, fromIndex, comparator)) > -1) {
        if (seen !== array) {
          splice$1.call(seen, fromIndex, 1);
        }
        splice$1.call(array, fromIndex, 1);
      }
    }
    return array;
  }

  function pullAll(array, values) {
    return array && array.length && values && values.length ? basePullAll(array, values) : array;
  }

  var pull = baseRest(pullAll);

  function pullAllBy(array, values, iteratee) {
    return array && array.length && values && values.length ? basePullAll(array, values, baseIteratee(iteratee)) : array;
  }

  function pullAllWith(array, values, comparator) {
    return array && array.length && values && values.length ? basePullAll(array, values, void 0, comparator) : array;
  }

  var arrayProto$2 = Array.prototype;
  var splice = arrayProto$2.splice;
  function basePullAt(array, indexes) {
    var length = array ? indexes.length : 0, lastIndex = length - 1;
    while (length--) {
      var index = indexes[length];
      if (length == lastIndex || index !== previous) {
        var previous = index;
        if (isIndex(index)) {
          splice.call(array, index, 1);
        } else {
          baseUnset(array, index);
        }
      }
    }
    return array;
  }

  var pullAt = flatRest(function(array, indexes) {
    var length = array == null ? 0 : array.length, result = baseAt(array, indexes);
    basePullAt(array, arrayMap(indexes, function(index) {
      return isIndex(index, length) ? +index : index;
    }).sort(compareAscending));
    return result;
  });

  var nativeFloor$1 = Math.floor;
  var nativeRandom$1 = Math.random;
  function baseRandom(lower, upper) {
    return lower + nativeFloor$1(nativeRandom$1() * (upper - lower + 1));
  }

  var freeParseFloat = parseFloat;
  var nativeMin$5 = Math.min;
  var nativeRandom = Math.random;
  function random(lower, upper, floating) {
    if (floating && typeof floating != "boolean" && isIterateeCall(lower, upper, floating)) {
      upper = floating = void 0;
    }
    if (floating === void 0) {
      if (typeof upper == "boolean") {
        floating = upper;
        upper = void 0;
      } else if (typeof lower == "boolean") {
        floating = lower;
        lower = void 0;
      }
    }
    if (lower === void 0 && upper === void 0) {
      lower = 0;
      upper = 1;
    } else {
      lower = toFinite(lower);
      if (upper === void 0) {
        upper = lower;
        lower = 0;
      } else {
        upper = toFinite(upper);
      }
    }
    if (lower > upper) {
      var temp = lower;
      lower = upper;
      upper = temp;
    }
    if (floating || lower % 1 || upper % 1) {
      var rand = nativeRandom();
      return nativeMin$5(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
    }
    return baseRandom(lower, upper);
  }

  var nativeCeil = Math.ceil;
  var nativeMax$4 = Math.max;
  function baseRange(start, end, step, fromRight) {
    var index = -1, length = nativeMax$4(nativeCeil((end - start) / (step || 1)), 0), result = Array(length);
    while (length--) {
      result[fromRight ? length : ++index] = start;
      start += step;
    }
    return result;
  }

  function createRange(fromRight) {
    return function(start, end, step) {
      if (step && typeof step != "number" && isIterateeCall(start, end, step)) {
        end = step = void 0;
      }
      start = toFinite(start);
      if (end === void 0) {
        end = start;
        start = 0;
      } else {
        end = toFinite(end);
      }
      step = step === void 0 ? start < end ? 1 : -1 : toFinite(step);
      return baseRange(start, end, step, fromRight);
    };
  }

  var range$1 = createRange();

  var rangeRight = createRange(true);

  var WRAP_REARG_FLAG = 256;
  var rearg = flatRest(function(func, indexes) {
    return createWrap(func, WRAP_REARG_FLAG, void 0, void 0, void 0, indexes);
  });

  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection2) {
      accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection2);
    });
    return accumulator;
  }

  function reduce(collection, iteratee, accumulator) {
    var func = isArray(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
    return func(collection, baseIteratee(iteratee), accumulator, initAccum, baseEach);
  }

  function arrayReduceRight(array, iteratee, accumulator, initAccum) {
    var length = array == null ? 0 : array.length;
    if (initAccum && length) {
      accumulator = array[--length];
    }
    while (length--) {
      accumulator = iteratee(accumulator, array[length], length, array);
    }
    return accumulator;
  }

  function reduceRight(collection, iteratee, accumulator) {
    var func = isArray(collection) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
    return func(collection, baseIteratee(iteratee), accumulator, initAccum, baseEachRight);
  }

  function reject(collection, predicate) {
    var func = isArray(collection) ? arrayFilter : baseFilter;
    return func(collection, negate(baseIteratee(predicate)));
  }

  function remove(array, predicate) {
    var result = [];
    if (!(array && array.length)) {
      return result;
    }
    var index = -1, indexes = [], length = array.length;
    predicate = baseIteratee(predicate);
    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result.push(value);
        indexes.push(index);
      }
    }
    basePullAt(array, indexes);
    return result;
  }

  function repeat(string, n, guard) {
    if (guard ? isIterateeCall(string, n, guard) : n === void 0) {
      n = 1;
    } else {
      n = toInteger(n);
    }
    return baseRepeat(toString(string), n);
  }

  function replace() {
    var args = arguments, string = toString(args[0]);
    return args.length < 3 ? string : string.replace(args[1], args[2]);
  }

  var FUNC_ERROR_TEXT$2 = "Expected a function";
  function rest(func, start) {
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$2);
    }
    start = start === void 0 ? start : toInteger(start);
    return baseRest(func, start);
  }

  function result(object, path, defaultValue) {
    path = castPath(path, object);
    var index = -1, length = path.length;
    if (!length) {
      length = 1;
      object = void 0;
    }
    while (++index < length) {
      var value = object == null ? void 0 : object[toKey(path[index])];
      if (value === void 0) {
        index = length;
        value = defaultValue;
      }
      object = isFunction(value) ? value.call(object) : value;
    }
    return object;
  }

  var arrayProto$1 = Array.prototype;
  var nativeReverse = arrayProto$1.reverse;
  function reverse(array) {
    return array == null ? array : nativeReverse.call(array);
  }

  var round$1 = createRound("round");

  function arraySample(array) {
    var length = array.length;
    return length ? array[baseRandom(0, length - 1)] : void 0;
  }

  function baseSample(collection) {
    return arraySample(values(collection));
  }

  function sample(collection) {
    var func = isArray(collection) ? arraySample : baseSample;
    return func(collection);
  }

  function shuffleSelf(array, size) {
    var index = -1, length = array.length, lastIndex = length - 1;
    size = size === void 0 ? length : size;
    while (++index < size) {
      var rand = baseRandom(index, lastIndex), value = array[rand];
      array[rand] = array[index];
      array[index] = value;
    }
    array.length = size;
    return array;
  }

  function arraySampleSize(array, n) {
    return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
  }

  function baseSampleSize(collection, n) {
    var array = values(collection);
    return shuffleSelf(array, baseClamp(n, 0, array.length));
  }

  function sampleSize(collection, n, guard) {
    if (guard ? isIterateeCall(collection, n, guard) : n === void 0) {
      n = 1;
    } else {
      n = toInteger(n);
    }
    var func = isArray(collection) ? arraySampleSize : baseSampleSize;
    return func(collection, n);
  }

  function set(object, path, value) {
    return object == null ? object : baseSet(object, path, value);
  }

  function setWith(object, path, value, customizer) {
    customizer = typeof customizer == "function" ? customizer : void 0;
    return object == null ? object : baseSet(object, path, value, customizer);
  }

  function arrayShuffle(array) {
    return shuffleSelf(copyArray(array));
  }

  function baseShuffle(collection) {
    return shuffleSelf(values(collection));
  }

  function shuffle(collection) {
    var func = isArray(collection) ? arrayShuffle : baseShuffle;
    return func(collection);
  }

  var mapTag = "[object Map]";
  var setTag = "[object Set]";
  function size(collection) {
    if (collection == null) {
      return 0;
    }
    if (isArrayLike(collection)) {
      return isString(collection) ? stringSize(collection) : collection.length;
    }
    var tag = getTag$1(collection);
    if (tag == mapTag || tag == setTag) {
      return collection.size;
    }
    return baseKeys(collection).length;
  }

  function slice(array, start, end) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return [];
    }
    if (end && typeof end != "number" && isIterateeCall(array, start, end)) {
      start = 0;
      end = length;
    } else {
      start = start == null ? 0 : toInteger(start);
      end = end === void 0 ? length : toInteger(end);
    }
    return baseSlice(array, start, end);
  }

  var snakeCase = createCompounder(function(result, word, index) {
    return result + (index ? "_" : "") + word.toLowerCase();
  });

  function baseSome(collection, predicate) {
    var result;
    baseEach(collection, function(value, index, collection2) {
      result = predicate(value, index, collection2);
      return !result;
    });
    return !!result;
  }

  function some(collection, predicate, guard) {
    var func = isArray(collection) ? arraySome : baseSome;
    if (guard && isIterateeCall(collection, predicate, guard)) {
      predicate = void 0;
    }
    return func(collection, baseIteratee(predicate));
  }

  var sortBy = baseRest(function(collection, iteratees) {
    if (collection == null) {
      return [];
    }
    var length = iteratees.length;
    if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
      iteratees = [];
    } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
      iteratees = [iteratees[0]];
    }
    return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
  });

  var MAX_ARRAY_LENGTH$4 = 4294967295;
  var MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH$4 - 1;
  var nativeFloor = Math.floor;
  var nativeMin$4 = Math.min;
  function baseSortedIndexBy(array, value, iteratee, retHighest) {
    var low = 0, high = array == null ? 0 : array.length;
    if (high === 0) {
      return 0;
    }
    value = iteratee(value);
    var valIsNaN = value !== value, valIsNull = value === null, valIsSymbol = isSymbol(value), valIsUndefined = value === void 0;
    while (low < high) {
      var mid = nativeFloor((low + high) / 2), computed = iteratee(array[mid]), othIsDefined = computed !== void 0, othIsNull = computed === null, othIsReflexive = computed === computed, othIsSymbol = isSymbol(computed);
      if (valIsNaN) {
        var setLow = retHighest || othIsReflexive;
      } else if (valIsUndefined) {
        setLow = othIsReflexive && (retHighest || othIsDefined);
      } else if (valIsNull) {
        setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
      } else if (valIsSymbol) {
        setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
      } else if (othIsNull || othIsSymbol) {
        setLow = false;
      } else {
        setLow = retHighest ? computed <= value : computed < value;
      }
      if (setLow) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return nativeMin$4(high, MAX_ARRAY_INDEX);
  }

  var MAX_ARRAY_LENGTH$3 = 4294967295;
  var HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH$3 >>> 1;
  function baseSortedIndex(array, value, retHighest) {
    var low = 0, high = array == null ? low : array.length;
    if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
      while (low < high) {
        var mid = low + high >>> 1, computed = array[mid];
        if (computed !== null && !isSymbol(computed) && (retHighest ? computed <= value : computed < value)) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return high;
    }
    return baseSortedIndexBy(array, value, identity, retHighest);
  }

  function sortedIndex(array, value) {
    return baseSortedIndex(array, value);
  }

  function sortedIndexBy(array, value, iteratee) {
    return baseSortedIndexBy(array, value, baseIteratee(iteratee));
  }

  function sortedIndexOf(array, value) {
    var length = array == null ? 0 : array.length;
    if (length) {
      var index = baseSortedIndex(array, value);
      if (index < length && eq(array[index], value)) {
        return index;
      }
    }
    return -1;
  }

  function sortedLastIndex(array, value) {
    return baseSortedIndex(array, value, true);
  }

  function sortedLastIndexBy(array, value, iteratee) {
    return baseSortedIndexBy(array, value, baseIteratee(iteratee), true);
  }

  function sortedLastIndexOf(array, value) {
    var length = array == null ? 0 : array.length;
    if (length) {
      var index = baseSortedIndex(array, value, true) - 1;
      if (eq(array[index], value)) {
        return index;
      }
    }
    return -1;
  }

  function baseSortedUniq(array, iteratee) {
    var index = -1, length = array.length, resIndex = 0, result = [];
    while (++index < length) {
      var value = array[index], computed = iteratee ? iteratee(value) : value;
      if (!index || !eq(computed, seen)) {
        var seen = computed;
        result[resIndex++] = value === 0 ? 0 : value;
      }
    }
    return result;
  }

  function sortedUniq(array) {
    return array && array.length ? baseSortedUniq(array) : [];
  }

  function sortedUniqBy(array, iteratee) {
    return array && array.length ? baseSortedUniq(array, baseIteratee(iteratee)) : [];
  }

  var MAX_ARRAY_LENGTH$2 = 4294967295;
  function split(string, separator, limit) {
    if (limit && typeof limit != "number" && isIterateeCall(string, separator, limit)) {
      separator = limit = void 0;
    }
    limit = limit === void 0 ? MAX_ARRAY_LENGTH$2 : limit >>> 0;
    if (!limit) {
      return [];
    }
    string = toString(string);
    if (string && (typeof separator == "string" || separator != null && !isRegExp(separator))) {
      separator = baseToString(separator);
      if (!separator && hasUnicode(string)) {
        return castSlice(stringToArray(string), 0, limit);
      }
    }
    return string.split(separator, limit);
  }

  var FUNC_ERROR_TEXT$1 = "Expected a function";
  var nativeMax$3 = Math.max;
  function spread(func, start) {
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT$1);
    }
    start = start == null ? 0 : nativeMax$3(toInteger(start), 0);
    return baseRest(function(args) {
      var array = args[start], otherArgs = castSlice(args, 0, start);
      if (array) {
        arrayPush(otherArgs, array);
      }
      return apply(func, this, otherArgs);
    });
  }

  var startCase = createCompounder(function(result, word, index) {
    return result + (index ? " " : "") + upperFirst(word);
  });

  function startsWith(string, target, position) {
    string = toString(string);
    position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
    target = baseToString(target);
    return string.slice(position, position + target.length) == target;
  }

  function stubObject() {
    return {};
  }

  function stubString() {
    return "";
  }

  function stubTrue() {
    return true;
  }

  var subtract = createMathOperation(function(minuend, subtrahend) {
    return minuend - subtrahend;
  }, 0);

  function sum$1(array) {
    return array && array.length ? baseSum(array, identity) : 0;
  }

  function sumBy(array, iteratee) {
    return array && array.length ? baseSum(array, baseIteratee(iteratee)) : 0;
  }

  function tail(array) {
    var length = array == null ? 0 : array.length;
    return length ? baseSlice(array, 1, length) : [];
  }

  function take(array, n, guard) {
    if (!(array && array.length)) {
      return [];
    }
    n = guard || n === void 0 ? 1 : toInteger(n);
    return baseSlice(array, 0, n < 0 ? 0 : n);
  }

  function takeRight(array, n, guard) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return [];
    }
    n = guard || n === void 0 ? 1 : toInteger(n);
    n = length - n;
    return baseSlice(array, n < 0 ? 0 : n, length);
  }

  function takeRightWhile(array, predicate) {
    return array && array.length ? baseWhile(array, baseIteratee(predicate), false, true) : [];
  }

  function takeWhile(array, predicate) {
    return array && array.length ? baseWhile(array, baseIteratee(predicate)) : [];
  }

  function tap(value, interceptor) {
    interceptor(value);
    return value;
  }

  var objectProto$2 = Object.prototype;
  var hasOwnProperty$2 = objectProto$2.hasOwnProperty;
  function customDefaultsAssignIn(objValue, srcValue, key, object) {
    if (objValue === void 0 || eq(objValue, objectProto$2[key]) && !hasOwnProperty$2.call(object, key)) {
      return srcValue;
    }
    return objValue;
  }

  var stringEscapes = {
    "\\": "\\",
    "'": "'",
    "\n": "n",
    "\r": "r",
    "\u2028": "u2028",
    "\u2029": "u2029"
  };
  function escapeStringChar(chr) {
    return "\\" + stringEscapes[chr];
  }

  var reInterpolate = /<%=([\s\S]+?)%>/g;

  var reEscape = /<%-([\s\S]+?)%>/g;

  var reEvaluate = /<%([\s\S]+?)%>/g;

  var templateSettings = {
    "escape": reEscape,
    "evaluate": reEvaluate,
    "interpolate": reInterpolate,
    "variable": "",
    "imports": {
      "_": { "escape": escape }
    }
  };

  var INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`";
  var reEmptyStringLeading = /\b__p \+= '';/g;
  var reEmptyStringMiddle = /\b(__p \+=) '' \+/g;
  var reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
  var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
  var reNoMatch = /($^)/;
  var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
  var objectProto$1 = Object.prototype;
  var hasOwnProperty$1 = objectProto$1.hasOwnProperty;
  function template(string, options, guard) {
    var settings = templateSettings.imports._.templateSettings || templateSettings;
    if (guard && isIterateeCall(string, options, guard)) {
      options = void 0;
    }
    string = toString(string);
    options = assignInWith({}, options, settings, customDefaultsAssignIn);
    var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
    var isEscaping, isEvaluating, index = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
    var reDelimiters = RegExp((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
    var sourceURL = hasOwnProperty$1.call(options, "sourceURL") ? "//# sourceURL=" + (options.sourceURL + "").replace(/\s/g, " ") + "\n" : "";
    string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
      interpolateValue || (interpolateValue = esTemplateValue);
      source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
      if (escapeValue) {
        isEscaping = true;
        source += "' +\n__e(" + escapeValue + ") +\n'";
      }
      if (evaluateValue) {
        isEvaluating = true;
        source += "';\n" + evaluateValue + ";\n__p += '";
      }
      if (interpolateValue) {
        source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";
    var variable = hasOwnProperty$1.call(options, "variable") && options.variable;
    if (!variable) {
      source = "with (obj) {\n" + source + "\n}\n";
    } else if (reForbiddenIdentifierChars.test(variable)) {
      throw new Error(INVALID_TEMPL_VAR_ERROR_TEXT);
    }
    source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
    source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
    var result = attempt(function() {
      return Function(importsKeys, sourceURL + "return " + source).apply(void 0, importsValues);
    });
    result.source = source;
    if (isError(result)) {
      throw result;
    }
    return result;
  }

  var FUNC_ERROR_TEXT = "Expected a function";
  function throttle(func, wait, options) {
    var leading = true, trailing = true;
    if (typeof func != "function") {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    if (isObject(options)) {
      leading = "leading" in options ? !!options.leading : leading;
      trailing = "trailing" in options ? !!options.trailing : trailing;
    }
    return debounce(func, wait, {
      "leading": leading,
      "maxWait": wait,
      "trailing": trailing
    });
  }

  function thru(value, interceptor) {
    return interceptor(value);
  }

  var MAX_SAFE_INTEGER$1 = 9007199254740991;
  var MAX_ARRAY_LENGTH$1 = 4294967295;
  var nativeMin$3 = Math.min;
  function times(n, iteratee) {
    n = toInteger(n);
    if (n < 1 || n > MAX_SAFE_INTEGER$1) {
      return [];
    }
    var index = MAX_ARRAY_LENGTH$1, length = nativeMin$3(n, MAX_ARRAY_LENGTH$1);
    iteratee = castFunction(iteratee);
    n -= MAX_ARRAY_LENGTH$1;
    var result = baseTimes(length, iteratee);
    while (++index < n) {
      iteratee(index);
    }
    return result;
  }

  function wrapperToIterator() {
    return this;
  }

  function baseWrapperValue(value, actions) {
    var result = value;
    if (result instanceof LazyWrapper) {
      result = result.value();
    }
    return arrayReduce(actions, function(result2, action) {
      return action.func.apply(action.thisArg, arrayPush([result2], action.args));
    }, result);
  }

  function wrapperValue() {
    return baseWrapperValue(this.__wrapped__, this.__actions__);
  }

  function toLower(value) {
    return toString(value).toLowerCase();
  }

  function toPath(value) {
    if (isArray(value)) {
      return arrayMap(value, toKey);
    }
    return isSymbol(value) ? [value] : copyArray(stringToPath(toString(value)));
  }

  var MAX_SAFE_INTEGER = 9007199254740991;
  function toSafeInteger(value) {
    return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
  }

  function toUpper(value) {
    return toString(value).toUpperCase();
  }

  function transform(object, iteratee, accumulator) {
    var isArr = isArray(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
    iteratee = baseIteratee(iteratee);
    if (accumulator == null) {
      var Ctor = object && object.constructor;
      if (isArrLike) {
        accumulator = isArr ? new Ctor() : [];
      } else if (isObject(object)) {
        accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
      } else {
        accumulator = {};
      }
    }
    (isArrLike ? arrayEach : baseForOwn)(object, function(value, index, object2) {
      return iteratee(accumulator, value, index, object2);
    });
    return accumulator;
  }

  function charsEndIndex(strSymbols, chrSymbols) {
    var index = strSymbols.length;
    while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
    }
    return index;
  }

  function charsStartIndex(strSymbols, chrSymbols) {
    var index = -1, length = strSymbols.length;
    while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {
    }
    return index;
  }

  function trim(string, chars, guard) {
    string = toString(string);
    if (string && (guard || chars === void 0)) {
      return baseTrim(string);
    }
    if (!string || !(chars = baseToString(chars))) {
      return string;
    }
    var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars), start = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
    return castSlice(strSymbols, start, end).join("");
  }

  function trimEnd(string, chars, guard) {
    string = toString(string);
    if (string && (guard || chars === void 0)) {
      return string.slice(0, trimmedEndIndex(string) + 1);
    }
    if (!string || !(chars = baseToString(chars))) {
      return string;
    }
    var strSymbols = stringToArray(string), end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
    return castSlice(strSymbols, 0, end).join("");
  }

  var reTrimStart = /^\s+/;
  function trimStart(string, chars, guard) {
    string = toString(string);
    if (string && (guard || chars === void 0)) {
      return string.replace(reTrimStart, "");
    }
    if (!string || !(chars = baseToString(chars))) {
      return string;
    }
    var strSymbols = stringToArray(string), start = charsStartIndex(strSymbols, stringToArray(chars));
    return castSlice(strSymbols, start).join("");
  }

  var DEFAULT_TRUNC_LENGTH = 30;
  var DEFAULT_TRUNC_OMISSION = "...";
  var reFlags = /\w*$/;
  function truncate(string, options) {
    var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
    if (isObject(options)) {
      var separator = "separator" in options ? options.separator : separator;
      length = "length" in options ? toInteger(options.length) : length;
      omission = "omission" in options ? baseToString(options.omission) : omission;
    }
    string = toString(string);
    var strLength = string.length;
    if (hasUnicode(string)) {
      var strSymbols = stringToArray(string);
      strLength = strSymbols.length;
    }
    if (length >= strLength) {
      return string;
    }
    var end = length - stringSize(omission);
    if (end < 1) {
      return omission;
    }
    var result = strSymbols ? castSlice(strSymbols, 0, end).join("") : string.slice(0, end);
    if (separator === void 0) {
      return result + omission;
    }
    if (strSymbols) {
      end += result.length - end;
    }
    if (isRegExp(separator)) {
      if (string.slice(end).search(separator)) {
        var match, substring = result;
        if (!separator.global) {
          separator = RegExp(separator.source, toString(reFlags.exec(separator)) + "g");
        }
        separator.lastIndex = 0;
        while (match = separator.exec(substring)) {
          var newEnd = match.index;
        }
        result = result.slice(0, newEnd === void 0 ? end : newEnd);
      }
    } else if (string.indexOf(baseToString(separator), end) != end) {
      var index = result.lastIndexOf(separator);
      if (index > -1) {
        result = result.slice(0, index);
      }
    }
    return result + omission;
  }

  function unary(func) {
    return ary(func, 1);
  }

  var htmlUnescapes = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'"
  };
  var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

  var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g;
  var reHasEscapedHtml = RegExp(reEscapedHtml.source);
  function unescape(string) {
    string = toString(string);
    return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
  }

  var INFINITY = 1 / 0;
  var createSet = !(Set$1 && 1 / setToArray(new Set$1([, -0]))[1] == INFINITY) ? noop : function(values) {
    return new Set$1(values);
  };

  var LARGE_ARRAY_SIZE = 200;
  function baseUniq(array, iteratee, comparator) {
    var index = -1, includes = arrayIncludes, length = array.length, isCommon = true, result = [], seen = result;
    if (comparator) {
      isCommon = false;
      includes = arrayIncludesWith;
    } else if (length >= LARGE_ARRAY_SIZE) {
      var set = iteratee ? null : createSet(array);
      if (set) {
        return setToArray(set);
      }
      isCommon = false;
      includes = cacheHas;
      seen = new SetCache();
    } else {
      seen = iteratee ? [] : result;
    }
    outer:
      while (++index < length) {
        var value = array[index], computed = iteratee ? iteratee(value) : value;
        value = comparator || value !== 0 ? value : 0;
        if (isCommon && computed === computed) {
          var seenIndex = seen.length;
          while (seenIndex--) {
            if (seen[seenIndex] === computed) {
              continue outer;
            }
          }
          if (iteratee) {
            seen.push(computed);
          }
          result.push(value);
        } else if (!includes(seen, computed, comparator)) {
          if (seen !== result) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
    return result;
  }

  var union = baseRest(function(arrays) {
    return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
  });

  var unionBy = baseRest(function(arrays) {
    var iteratee = last(arrays);
    if (isArrayLikeObject(iteratee)) {
      iteratee = void 0;
    }
    return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), baseIteratee(iteratee));
  });

  var unionWith = baseRest(function(arrays) {
    var comparator = last(arrays);
    comparator = typeof comparator == "function" ? comparator : void 0;
    return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), void 0, comparator);
  });

  function uniq(array) {
    return array && array.length ? baseUniq(array) : [];
  }

  function uniqBy(array, iteratee) {
    return array && array.length ? baseUniq(array, baseIteratee(iteratee)) : [];
  }

  function uniqWith(array, comparator) {
    comparator = typeof comparator == "function" ? comparator : void 0;
    return array && array.length ? baseUniq(array, void 0, comparator) : [];
  }

  var idCounter = 0;
  function uniqueId(prefix) {
    var id = ++idCounter;
    return toString(prefix) + id;
  }

  function unset(object, path) {
    return object == null ? true : baseUnset(object, path);
  }

  var nativeMax$2 = Math.max;
  function unzip(array) {
    if (!(array && array.length)) {
      return [];
    }
    var length = 0;
    array = arrayFilter(array, function(group) {
      if (isArrayLikeObject(group)) {
        length = nativeMax$2(group.length, length);
        return true;
      }
    });
    return baseTimes(length, function(index) {
      return arrayMap(array, baseProperty(index));
    });
  }

  function unzipWith(array, iteratee) {
    if (!(array && array.length)) {
      return [];
    }
    var result = unzip(array);
    if (iteratee == null) {
      return result;
    }
    return arrayMap(result, function(group) {
      return apply(iteratee, void 0, group);
    });
  }

  function baseUpdate(object, path, updater, customizer) {
    return baseSet(object, path, updater(baseGet(object, path)), customizer);
  }

  function update(object, path, updater) {
    return object == null ? object : baseUpdate(object, path, castFunction(updater));
  }

  function updateWith(object, path, updater, customizer) {
    customizer = typeof customizer == "function" ? customizer : void 0;
    return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
  }

  var upperCase = createCompounder(function(result, word, index) {
    return result + (index ? " " : "") + word.toUpperCase();
  });

  function valuesIn(object) {
    return object == null ? [] : baseValues(object, keysIn(object));
  }

  var without = baseRest(function(array, values) {
    return isArrayLikeObject(array) ? baseDifference(array, values) : [];
  });

  function wrap(value, wrapper) {
    return partial(castFunction(wrapper), value);
  }

  var wrapperAt = flatRest(function(paths) {
    var length = paths.length, start = length ? paths[0] : 0, value = this.__wrapped__, interceptor = function(object) {
      return baseAt(object, paths);
    };
    if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
      return this.thru(interceptor);
    }
    value = value.slice(start, +start + (length ? 1 : 0));
    value.__actions__.push({
      "func": thru,
      "args": [interceptor],
      "thisArg": void 0
    });
    return new LodashWrapper(value, this.__chain__).thru(function(array) {
      if (length && !array.length) {
        array.push(void 0);
      }
      return array;
    });
  });

  function wrapperChain() {
    return chain(this);
  }

  function wrapperReverse() {
    var value = this.__wrapped__;
    if (value instanceof LazyWrapper) {
      var wrapped = value;
      if (this.__actions__.length) {
        wrapped = new LazyWrapper(this);
      }
      wrapped = wrapped.reverse();
      wrapped.__actions__.push({
        "func": thru,
        "args": [reverse],
        "thisArg": void 0
      });
      return new LodashWrapper(wrapped, this.__chain__);
    }
    return this.thru(reverse);
  }

  function baseXor(arrays, iteratee, comparator) {
    var length = arrays.length;
    if (length < 2) {
      return length ? baseUniq(arrays[0]) : [];
    }
    var index = -1, result = Array(length);
    while (++index < length) {
      var array = arrays[index], othIndex = -1;
      while (++othIndex < length) {
        if (othIndex != index) {
          result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
        }
      }
    }
    return baseUniq(baseFlatten(result, 1), iteratee, comparator);
  }

  var xor = baseRest(function(arrays) {
    return baseXor(arrayFilter(arrays, isArrayLikeObject));
  });

  var xorBy = baseRest(function(arrays) {
    var iteratee = last(arrays);
    if (isArrayLikeObject(iteratee)) {
      iteratee = void 0;
    }
    return baseXor(arrayFilter(arrays, isArrayLikeObject), baseIteratee(iteratee));
  });

  var xorWith = baseRest(function(arrays) {
    var comparator = last(arrays);
    comparator = typeof comparator == "function" ? comparator : void 0;
    return baseXor(arrayFilter(arrays, isArrayLikeObject), void 0, comparator);
  });

  var zip = baseRest(unzip);

  function baseZipObject(props, values, assignFunc) {
    var index = -1, length = props.length, valsLength = values.length, result = {};
    while (++index < length) {
      var value = index < valsLength ? values[index] : void 0;
      assignFunc(result, props[index], value);
    }
    return result;
  }

  function zipObject(props, values) {
    return baseZipObject(props || [], values || [], assignValue);
  }

  function zipObjectDeep(props, values) {
    return baseZipObject(props || [], values || [], baseSet);
  }

  var zipWith = baseRest(function(arrays) {
    var length = arrays.length, iteratee = length > 1 ? arrays[length - 1] : void 0;
    iteratee = typeof iteratee == "function" ? (arrays.pop(), iteratee) : void 0;
    return unzipWith(arrays, iteratee);
  });

  var array = {
    chunk,
    compact,
    concat,
    difference,
    differenceBy,
    differenceWith,
    drop,
    dropRight,
    dropRightWhile,
    dropWhile,
    fill,
    findIndex,
    findLastIndex,
    first: head,
    flatten,
    flattenDeep,
    flattenDepth,
    fromPairs,
    head,
    indexOf,
    initial,
    intersection,
    intersectionBy,
    intersectionWith,
    join,
    last,
    lastIndexOf,
    nth,
    pull,
    pullAll,
    pullAllBy,
    pullAllWith,
    pullAt,
    remove,
    reverse,
    slice,
    sortedIndex,
    sortedIndexBy,
    sortedIndexOf,
    sortedLastIndex,
    sortedLastIndexBy,
    sortedLastIndexOf,
    sortedUniq,
    sortedUniqBy,
    tail,
    take,
    takeRight,
    takeRightWhile,
    takeWhile,
    union,
    unionBy,
    unionWith,
    uniq,
    uniqBy,
    uniqWith,
    unzip,
    unzipWith,
    without,
    xor,
    xorBy,
    xorWith,
    zip,
    zipObject,
    zipObjectDeep,
    zipWith
  };

  var collection = {
    countBy,
    each: forEach,
    eachRight: forEachRight,
    every,
    filter,
    find,
    findLast,
    flatMap,
    flatMapDeep,
    flatMapDepth,
    forEach,
    forEachRight,
    groupBy,
    includes,
    invokeMap,
    keyBy,
    map,
    orderBy: orderBy$1,
    partition,
    reduce,
    reduceRight,
    reject,
    sample,
    sampleSize,
    shuffle,
    size,
    some,
    sortBy
  };

  var date$1 = {
    now
  };

  var func = {
    after,
    ary,
    before,
    bind,
    bindKey,
    curry,
    curryRight,
    debounce,
    defer,
    delay,
    flip,
    memoize,
    negate,
    once,
    overArgs,
    partial,
    partialRight,
    rearg,
    rest,
    spread,
    throttle,
    unary,
    wrap
  };

  var lang = {
    castArray: castArray$1,
    clone,
    cloneDeep,
    cloneDeepWith,
    cloneWith,
    conformsTo,
    eq,
    gt: gt$1,
    gte,
    isArguments,
    isArray,
    isArrayBuffer,
    isArrayLike,
    isArrayLikeObject,
    isBoolean: isBoolean$1,
    isBuffer,
    isDate,
    isElement: isElement$2,
    isEmpty: isEmpty$1,
    isEqual: isEqual$1,
    isEqualWith,
    isError,
    isFinite,
    isFunction,
    isInteger,
    isLength,
    isMap,
    isMatch,
    isMatchWith,
    isNaN: isNaN$1,
    isNative,
    isNil,
    isNull,
    isNumber: isNumber$1,
    isObject,
    isObjectLike,
    isPlainObject,
    isRegExp,
    isSafeInteger,
    isSet,
    isString,
    isSymbol,
    isTypedArray,
    isUndefined: isUndefined$1,
    isWeakMap,
    isWeakSet,
    lt: lt$1,
    lte,
    toArray,
    toFinite,
    toInteger,
    toLength,
    toNumber,
    toPlainObject,
    toSafeInteger,
    toString
  };

  var math = {
    add,
    ceil,
    divide,
    floor: floor$1,
    max: max$3,
    maxBy,
    mean,
    meanBy,
    min: min$3,
    minBy,
    multiply,
    round: round$1,
    subtract,
    sum: sum$1,
    sumBy
  };

  var number = {
    clamp,
    inRange,
    random
  };

  var object = {
    assign,
    assignIn,
    assignInWith,
    assignWith,
    at: at$1,
    create,
    defaults,
    defaultsDeep,
    entries: toPairs,
    entriesIn: toPairsIn,
    extend: assignIn,
    extendWith: assignInWith,
    findKey,
    findLastKey,
    forIn,
    forInRight,
    forOwn,
    forOwnRight,
    functions,
    functionsIn,
    get,
    has,
    hasIn,
    invert,
    invertBy,
    invoke,
    keys,
    keysIn,
    mapKeys,
    mapValues,
    merge,
    mergeWith,
    omit,
    omitBy,
    pick,
    pickBy,
    result,
    set,
    setWith,
    toPairs,
    toPairsIn,
    transform,
    unset,
    update,
    updateWith,
    values,
    valuesIn
  };

  var seq = {
    at: wrapperAt,
    chain,
    commit: wrapperCommit,
    lodash,
    next: wrapperNext,
    plant: wrapperPlant,
    reverse: wrapperReverse,
    tap,
    thru,
    toIterator: wrapperToIterator,
    toJSON: wrapperValue,
    value: wrapperValue,
    valueOf: wrapperValue,
    wrapperChain
  };

  var string$1 = {
    camelCase,
    capitalize: capitalize$1,
    deburr,
    endsWith,
    escape,
    escapeRegExp,
    kebabCase,
    lowerCase,
    lowerFirst,
    pad,
    padEnd,
    padStart,
    parseInt: parseInt$1,
    repeat,
    replace,
    snakeCase,
    split,
    startCase,
    startsWith,
    template,
    templateSettings,
    toLower,
    toUpper,
    trim,
    trimEnd,
    trimStart,
    truncate,
    unescape,
    upperCase,
    upperFirst,
    words
  };

  var util = {
    attempt,
    bindAll,
    cond,
    conforms,
    constant,
    defaultTo,
    flow,
    flowRight,
    identity,
    iteratee,
    matches,
    matchesProperty,
    method,
    methodOf,
    mixin: mixin$1,
    noop,
    nthArg,
    over,
    overEvery,
    overSome,
    property,
    propertyOf,
    range: range$1,
    rangeRight,
    stubArray,
    stubFalse,
    stubObject,
    stubString,
    stubTrue,
    times,
    toPath,
    uniqueId
  };

  function lazyClone() {
    var result = new LazyWrapper(this.__wrapped__);
    result.__actions__ = copyArray(this.__actions__);
    result.__dir__ = this.__dir__;
    result.__filtered__ = this.__filtered__;
    result.__iteratees__ = copyArray(this.__iteratees__);
    result.__takeCount__ = this.__takeCount__;
    result.__views__ = copyArray(this.__views__);
    return result;
  }

  function lazyReverse() {
    if (this.__filtered__) {
      var result = new LazyWrapper(this);
      result.__dir__ = -1;
      result.__filtered__ = true;
    } else {
      result = this.clone();
      result.__dir__ *= -1;
    }
    return result;
  }

  var nativeMax$1 = Math.max;
  var nativeMin$2 = Math.min;
  function getView(start, end, transforms) {
    var index = -1, length = transforms.length;
    while (++index < length) {
      var data = transforms[index], size = data.size;
      switch (data.type) {
        case "drop":
          start += size;
          break;
        case "dropRight":
          end -= size;
          break;
        case "take":
          end = nativeMin$2(end, start + size);
          break;
        case "takeRight":
          start = nativeMax$1(start, end - size);
          break;
      }
    }
    return { "start": start, "end": end };
  }

  var LAZY_FILTER_FLAG$1 = 1;
  var LAZY_MAP_FLAG = 2;
  var nativeMin$1 = Math.min;
  function lazyValue() {
    var array = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray(array), isRight = dir < 0, arrLength = isArr ? array.length : 0, view = getView(0, arrLength, this.__views__), start = view.start, end = view.end, length = end - start, index = isRight ? end : start - 1, iteratees = this.__iteratees__, iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin$1(length, this.__takeCount__);
    if (!isArr || !isRight && arrLength == length && takeCount == length) {
      return baseWrapperValue(array, this.__actions__);
    }
    var result = [];
    outer:
      while (length-- && resIndex < takeCount) {
        index += dir;
        var iterIndex = -1, value = array[index];
        while (++iterIndex < iterLength) {
          var data = iteratees[iterIndex], iteratee = data.iteratee, type = data.type, computed = iteratee(value);
          if (type == LAZY_MAP_FLAG) {
            value = computed;
          } else if (!computed) {
            if (type == LAZY_FILTER_FLAG$1) {
              continue outer;
            } else {
              break outer;
            }
          }
        }
        result[resIndex++] = value;
      }
    return result;
  }

  var VERSION = "4.17.21";
  var WRAP_BIND_KEY_FLAG = 2;
  var LAZY_FILTER_FLAG = 1;
  var LAZY_WHILE_FLAG = 3;
  var MAX_ARRAY_LENGTH = 4294967295;
  var arrayProto = Array.prototype;
  var objectProto = Object.prototype;
  var hasOwnProperty = objectProto.hasOwnProperty;
  var symIterator = Symbol$1 ? Symbol$1.iterator : void 0;
  var nativeMax = Math.max;
  var nativeMin = Math.min;
  var mixin = function(func2) {
    return function(object2, source, options) {
      if (options == null) {
        var isObj = isObject(source), props = isObj && keys(source), methodNames = props && props.length && baseFunctions(source, props);
        if (!(methodNames ? methodNames.length : isObj)) {
          options = source;
          source = object2;
          object2 = this;
        }
      }
      return func2(object2, source, options);
    };
  }(mixin$1);
  lodash.after = func.after;
  lodash.ary = func.ary;
  lodash.assign = object.assign;
  lodash.assignIn = object.assignIn;
  lodash.assignInWith = object.assignInWith;
  lodash.assignWith = object.assignWith;
  lodash.at = object.at;
  lodash.before = func.before;
  lodash.bind = func.bind;
  lodash.bindAll = util.bindAll;
  lodash.bindKey = func.bindKey;
  lodash.castArray = lang.castArray;
  lodash.chain = seq.chain;
  lodash.chunk = array.chunk;
  lodash.compact = array.compact;
  lodash.concat = array.concat;
  lodash.cond = util.cond;
  lodash.conforms = util.conforms;
  lodash.constant = util.constant;
  lodash.countBy = collection.countBy;
  lodash.create = object.create;
  lodash.curry = func.curry;
  lodash.curryRight = func.curryRight;
  lodash.debounce = func.debounce;
  lodash.defaults = object.defaults;
  lodash.defaultsDeep = object.defaultsDeep;
  lodash.defer = func.defer;
  lodash.delay = func.delay;
  lodash.difference = array.difference;
  lodash.differenceBy = array.differenceBy;
  lodash.differenceWith = array.differenceWith;
  lodash.drop = array.drop;
  lodash.dropRight = array.dropRight;
  lodash.dropRightWhile = array.dropRightWhile;
  lodash.dropWhile = array.dropWhile;
  lodash.fill = array.fill;
  lodash.filter = collection.filter;
  lodash.flatMap = collection.flatMap;
  lodash.flatMapDeep = collection.flatMapDeep;
  lodash.flatMapDepth = collection.flatMapDepth;
  lodash.flatten = array.flatten;
  lodash.flattenDeep = array.flattenDeep;
  lodash.flattenDepth = array.flattenDepth;
  lodash.flip = func.flip;
  lodash.flow = util.flow;
  lodash.flowRight = util.flowRight;
  lodash.fromPairs = array.fromPairs;
  lodash.functions = object.functions;
  lodash.functionsIn = object.functionsIn;
  lodash.groupBy = collection.groupBy;
  lodash.initial = array.initial;
  lodash.intersection = array.intersection;
  lodash.intersectionBy = array.intersectionBy;
  lodash.intersectionWith = array.intersectionWith;
  lodash.invert = object.invert;
  lodash.invertBy = object.invertBy;
  lodash.invokeMap = collection.invokeMap;
  lodash.iteratee = util.iteratee;
  lodash.keyBy = collection.keyBy;
  lodash.keys = keys;
  lodash.keysIn = object.keysIn;
  lodash.map = collection.map;
  lodash.mapKeys = object.mapKeys;
  lodash.mapValues = object.mapValues;
  lodash.matches = util.matches;
  lodash.matchesProperty = util.matchesProperty;
  lodash.memoize = func.memoize;
  lodash.merge = object.merge;
  lodash.mergeWith = object.mergeWith;
  lodash.method = util.method;
  lodash.methodOf = util.methodOf;
  lodash.mixin = mixin;
  lodash.negate = negate;
  lodash.nthArg = util.nthArg;
  lodash.omit = object.omit;
  lodash.omitBy = object.omitBy;
  lodash.once = func.once;
  lodash.orderBy = collection.orderBy;
  lodash.over = util.over;
  lodash.overArgs = func.overArgs;
  lodash.overEvery = util.overEvery;
  lodash.overSome = util.overSome;
  lodash.partial = func.partial;
  lodash.partialRight = func.partialRight;
  lodash.partition = collection.partition;
  lodash.pick = object.pick;
  lodash.pickBy = object.pickBy;
  lodash.property = util.property;
  lodash.propertyOf = util.propertyOf;
  lodash.pull = array.pull;
  lodash.pullAll = array.pullAll;
  lodash.pullAllBy = array.pullAllBy;
  lodash.pullAllWith = array.pullAllWith;
  lodash.pullAt = array.pullAt;
  lodash.range = util.range;
  lodash.rangeRight = util.rangeRight;
  lodash.rearg = func.rearg;
  lodash.reject = collection.reject;
  lodash.remove = array.remove;
  lodash.rest = func.rest;
  lodash.reverse = array.reverse;
  lodash.sampleSize = collection.sampleSize;
  lodash.set = object.set;
  lodash.setWith = object.setWith;
  lodash.shuffle = collection.shuffle;
  lodash.slice = array.slice;
  lodash.sortBy = collection.sortBy;
  lodash.sortedUniq = array.sortedUniq;
  lodash.sortedUniqBy = array.sortedUniqBy;
  lodash.split = string$1.split;
  lodash.spread = func.spread;
  lodash.tail = array.tail;
  lodash.take = array.take;
  lodash.takeRight = array.takeRight;
  lodash.takeRightWhile = array.takeRightWhile;
  lodash.takeWhile = array.takeWhile;
  lodash.tap = seq.tap;
  lodash.throttle = func.throttle;
  lodash.thru = thru;
  lodash.toArray = lang.toArray;
  lodash.toPairs = object.toPairs;
  lodash.toPairsIn = object.toPairsIn;
  lodash.toPath = util.toPath;
  lodash.toPlainObject = lang.toPlainObject;
  lodash.transform = object.transform;
  lodash.unary = func.unary;
  lodash.union = array.union;
  lodash.unionBy = array.unionBy;
  lodash.unionWith = array.unionWith;
  lodash.uniq = array.uniq;
  lodash.uniqBy = array.uniqBy;
  lodash.uniqWith = array.uniqWith;
  lodash.unset = object.unset;
  lodash.unzip = array.unzip;
  lodash.unzipWith = array.unzipWith;
  lodash.update = object.update;
  lodash.updateWith = object.updateWith;
  lodash.values = object.values;
  lodash.valuesIn = object.valuesIn;
  lodash.without = array.without;
  lodash.words = string$1.words;
  lodash.wrap = func.wrap;
  lodash.xor = array.xor;
  lodash.xorBy = array.xorBy;
  lodash.xorWith = array.xorWith;
  lodash.zip = array.zip;
  lodash.zipObject = array.zipObject;
  lodash.zipObjectDeep = array.zipObjectDeep;
  lodash.zipWith = array.zipWith;
  lodash.entries = object.toPairs;
  lodash.entriesIn = object.toPairsIn;
  lodash.extend = object.assignIn;
  lodash.extendWith = object.assignInWith;
  mixin(lodash, lodash);
  lodash.add = math.add;
  lodash.attempt = util.attempt;
  lodash.camelCase = string$1.camelCase;
  lodash.capitalize = string$1.capitalize;
  lodash.ceil = math.ceil;
  lodash.clamp = number.clamp;
  lodash.clone = lang.clone;
  lodash.cloneDeep = lang.cloneDeep;
  lodash.cloneDeepWith = lang.cloneDeepWith;
  lodash.cloneWith = lang.cloneWith;
  lodash.conformsTo = lang.conformsTo;
  lodash.deburr = string$1.deburr;
  lodash.defaultTo = util.defaultTo;
  lodash.divide = math.divide;
  lodash.endsWith = string$1.endsWith;
  lodash.eq = lang.eq;
  lodash.escape = string$1.escape;
  lodash.escapeRegExp = string$1.escapeRegExp;
  lodash.every = collection.every;
  lodash.find = collection.find;
  lodash.findIndex = array.findIndex;
  lodash.findKey = object.findKey;
  lodash.findLast = collection.findLast;
  lodash.findLastIndex = array.findLastIndex;
  lodash.findLastKey = object.findLastKey;
  lodash.floor = math.floor;
  lodash.forEach = collection.forEach;
  lodash.forEachRight = collection.forEachRight;
  lodash.forIn = object.forIn;
  lodash.forInRight = object.forInRight;
  lodash.forOwn = object.forOwn;
  lodash.forOwnRight = object.forOwnRight;
  lodash.get = object.get;
  lodash.gt = lang.gt;
  lodash.gte = lang.gte;
  lodash.has = object.has;
  lodash.hasIn = object.hasIn;
  lodash.head = array.head;
  lodash.identity = identity;
  lodash.includes = collection.includes;
  lodash.indexOf = array.indexOf;
  lodash.inRange = number.inRange;
  lodash.invoke = object.invoke;
  lodash.isArguments = lang.isArguments;
  lodash.isArray = isArray;
  lodash.isArrayBuffer = lang.isArrayBuffer;
  lodash.isArrayLike = lang.isArrayLike;
  lodash.isArrayLikeObject = lang.isArrayLikeObject;
  lodash.isBoolean = lang.isBoolean;
  lodash.isBuffer = lang.isBuffer;
  lodash.isDate = lang.isDate;
  lodash.isElement = lang.isElement;
  lodash.isEmpty = lang.isEmpty;
  lodash.isEqual = lang.isEqual;
  lodash.isEqualWith = lang.isEqualWith;
  lodash.isError = lang.isError;
  lodash.isFinite = lang.isFinite;
  lodash.isFunction = lang.isFunction;
  lodash.isInteger = lang.isInteger;
  lodash.isLength = lang.isLength;
  lodash.isMap = lang.isMap;
  lodash.isMatch = lang.isMatch;
  lodash.isMatchWith = lang.isMatchWith;
  lodash.isNaN = lang.isNaN;
  lodash.isNative = lang.isNative;
  lodash.isNil = lang.isNil;
  lodash.isNull = lang.isNull;
  lodash.isNumber = lang.isNumber;
  lodash.isObject = isObject;
  lodash.isObjectLike = lang.isObjectLike;
  lodash.isPlainObject = lang.isPlainObject;
  lodash.isRegExp = lang.isRegExp;
  lodash.isSafeInteger = lang.isSafeInteger;
  lodash.isSet = lang.isSet;
  lodash.isString = lang.isString;
  lodash.isSymbol = lang.isSymbol;
  lodash.isTypedArray = lang.isTypedArray;
  lodash.isUndefined = lang.isUndefined;
  lodash.isWeakMap = lang.isWeakMap;
  lodash.isWeakSet = lang.isWeakSet;
  lodash.join = array.join;
  lodash.kebabCase = string$1.kebabCase;
  lodash.last = last;
  lodash.lastIndexOf = array.lastIndexOf;
  lodash.lowerCase = string$1.lowerCase;
  lodash.lowerFirst = string$1.lowerFirst;
  lodash.lt = lang.lt;
  lodash.lte = lang.lte;
  lodash.max = math.max;
  lodash.maxBy = math.maxBy;
  lodash.mean = math.mean;
  lodash.meanBy = math.meanBy;
  lodash.min = math.min;
  lodash.minBy = math.minBy;
  lodash.stubArray = util.stubArray;
  lodash.stubFalse = util.stubFalse;
  lodash.stubObject = util.stubObject;
  lodash.stubString = util.stubString;
  lodash.stubTrue = util.stubTrue;
  lodash.multiply = math.multiply;
  lodash.nth = array.nth;
  lodash.noop = util.noop;
  lodash.now = date$1.now;
  lodash.pad = string$1.pad;
  lodash.padEnd = string$1.padEnd;
  lodash.padStart = string$1.padStart;
  lodash.parseInt = string$1.parseInt;
  lodash.random = number.random;
  lodash.reduce = collection.reduce;
  lodash.reduceRight = collection.reduceRight;
  lodash.repeat = string$1.repeat;
  lodash.replace = string$1.replace;
  lodash.result = object.result;
  lodash.round = math.round;
  lodash.sample = collection.sample;
  lodash.size = collection.size;
  lodash.snakeCase = string$1.snakeCase;
  lodash.some = collection.some;
  lodash.sortedIndex = array.sortedIndex;
  lodash.sortedIndexBy = array.sortedIndexBy;
  lodash.sortedIndexOf = array.sortedIndexOf;
  lodash.sortedLastIndex = array.sortedLastIndex;
  lodash.sortedLastIndexBy = array.sortedLastIndexBy;
  lodash.sortedLastIndexOf = array.sortedLastIndexOf;
  lodash.startCase = string$1.startCase;
  lodash.startsWith = string$1.startsWith;
  lodash.subtract = math.subtract;
  lodash.sum = math.sum;
  lodash.sumBy = math.sumBy;
  lodash.template = string$1.template;
  lodash.times = util.times;
  lodash.toFinite = lang.toFinite;
  lodash.toInteger = toInteger;
  lodash.toLength = lang.toLength;
  lodash.toLower = string$1.toLower;
  lodash.toNumber = lang.toNumber;
  lodash.toSafeInteger = lang.toSafeInteger;
  lodash.toString = lang.toString;
  lodash.toUpper = string$1.toUpper;
  lodash.trim = string$1.trim;
  lodash.trimEnd = string$1.trimEnd;
  lodash.trimStart = string$1.trimStart;
  lodash.truncate = string$1.truncate;
  lodash.unescape = string$1.unescape;
  lodash.uniqueId = util.uniqueId;
  lodash.upperCase = string$1.upperCase;
  lodash.upperFirst = string$1.upperFirst;
  lodash.each = collection.forEach;
  lodash.eachRight = collection.forEachRight;
  lodash.first = array.head;
  mixin(lodash, function() {
    var source = {};
    baseForOwn(lodash, function(func2, methodName) {
      if (!hasOwnProperty.call(lodash.prototype, methodName)) {
        source[methodName] = func2;
      }
    });
    return source;
  }(), { "chain": false });
  lodash.VERSION = VERSION;
  (lodash.templateSettings = string$1.templateSettings).imports._ = lodash;
  arrayEach(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(methodName) {
    lodash[methodName].placeholder = lodash;
  });
  arrayEach(["drop", "take"], function(methodName, index) {
    LazyWrapper.prototype[methodName] = function(n) {
      n = n === void 0 ? 1 : nativeMax(toInteger(n), 0);
      var result = this.__filtered__ && !index ? new LazyWrapper(this) : this.clone();
      if (result.__filtered__) {
        result.__takeCount__ = nativeMin(n, result.__takeCount__);
      } else {
        result.__views__.push({
          "size": nativeMin(n, MAX_ARRAY_LENGTH),
          "type": methodName + (result.__dir__ < 0 ? "Right" : "")
        });
      }
      return result;
    };
    LazyWrapper.prototype[methodName + "Right"] = function(n) {
      return this.reverse()[methodName](n).reverse();
    };
  });
  arrayEach(["filter", "map", "takeWhile"], function(methodName, index) {
    var type = index + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
    LazyWrapper.prototype[methodName] = function(iteratee) {
      var result = this.clone();
      result.__iteratees__.push({
        "iteratee": baseIteratee(iteratee),
        "type": type
      });
      result.__filtered__ = result.__filtered__ || isFilter;
      return result;
    };
  });
  arrayEach(["head", "last"], function(methodName, index) {
    var takeName = "take" + (index ? "Right" : "");
    LazyWrapper.prototype[methodName] = function() {
      return this[takeName](1).value()[0];
    };
  });
  arrayEach(["initial", "tail"], function(methodName, index) {
    var dropName = "drop" + (index ? "" : "Right");
    LazyWrapper.prototype[methodName] = function() {
      return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
    };
  });
  LazyWrapper.prototype.compact = function() {
    return this.filter(identity);
  };
  LazyWrapper.prototype.find = function(predicate) {
    return this.filter(predicate).head();
  };
  LazyWrapper.prototype.findLast = function(predicate) {
    return this.reverse().find(predicate);
  };
  LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
    if (typeof path == "function") {
      return new LazyWrapper(this);
    }
    return this.map(function(value) {
      return baseInvoke(value, path, args);
    });
  });
  LazyWrapper.prototype.reject = function(predicate) {
    return this.filter(negate(baseIteratee(predicate)));
  };
  LazyWrapper.prototype.slice = function(start, end) {
    start = toInteger(start);
    var result = this;
    if (result.__filtered__ && (start > 0 || end < 0)) {
      return new LazyWrapper(result);
    }
    if (start < 0) {
      result = result.takeRight(-start);
    } else if (start) {
      result = result.drop(start);
    }
    if (end !== void 0) {
      end = toInteger(end);
      result = end < 0 ? result.dropRight(-end) : result.take(end - start);
    }
    return result;
  };
  LazyWrapper.prototype.takeRightWhile = function(predicate) {
    return this.reverse().takeWhile(predicate).reverse();
  };
  LazyWrapper.prototype.toArray = function() {
    return this.take(MAX_ARRAY_LENGTH);
  };
  baseForOwn(LazyWrapper.prototype, function(func2, methodName) {
    var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName), isTaker = /^(?:head|last)$/.test(methodName), lodashFunc = lodash[isTaker ? "take" + (methodName == "last" ? "Right" : "") : methodName], retUnwrapped = isTaker || /^find/.test(methodName);
    if (!lodashFunc) {
      return;
    }
    lodash.prototype[methodName] = function() {
      var value = this.__wrapped__, args = isTaker ? [1] : arguments, isLazy = value instanceof LazyWrapper, iteratee = args[0], useLazy = isLazy || isArray(value);
      var interceptor = function(value2) {
        var result2 = lodashFunc.apply(lodash, arrayPush([value2], args));
        return isTaker && chainAll ? result2[0] : result2;
      };
      if (useLazy && checkIteratee && typeof iteratee == "function" && iteratee.length != 1) {
        isLazy = useLazy = false;
      }
      var chainAll = this.__chain__, isHybrid = !!this.__actions__.length, isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
      if (!retUnwrapped && useLazy) {
        value = onlyLazy ? value : new LazyWrapper(this);
        var result = func2.apply(value, args);
        result.__actions__.push({ "func": thru, "args": [interceptor], "thisArg": void 0 });
        return new LodashWrapper(result, chainAll);
      }
      if (isUnwrapped && onlyLazy) {
        return func2.apply(this, args);
      }
      result = this.thru(interceptor);
      return isUnwrapped ? isTaker ? result.value()[0] : result.value() : result;
    };
  });
  arrayEach(["pop", "push", "shift", "sort", "splice", "unshift"], function(methodName) {
    var func2 = arrayProto[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru", retUnwrapped = /^(?:pop|shift)$/.test(methodName);
    lodash.prototype[methodName] = function() {
      var args = arguments;
      if (retUnwrapped && !this.__chain__) {
        var value = this.value();
        return func2.apply(isArray(value) ? value : [], args);
      }
      return this[chainName](function(value2) {
        return func2.apply(isArray(value2) ? value2 : [], args);
      });
    };
  });
  baseForOwn(LazyWrapper.prototype, function(func2, methodName) {
    var lodashFunc = lodash[methodName];
    if (lodashFunc) {
      var key = lodashFunc.name + "";
      if (!hasOwnProperty.call(realNames, key)) {
        realNames[key] = [];
      }
      realNames[key].push({ "name": methodName, "func": lodashFunc });
    }
  });
  realNames[createHybrid(void 0, WRAP_BIND_KEY_FLAG).name] = [{
    "name": "wrapper",
    "func": void 0
  }];
  LazyWrapper.prototype.clone = lazyClone;
  LazyWrapper.prototype.reverse = lazyReverse;
  LazyWrapper.prototype.value = lazyValue;
  lodash.prototype.at = seq.at;
  lodash.prototype.chain = seq.wrapperChain;
  lodash.prototype.commit = seq.commit;
  lodash.prototype.next = seq.next;
  lodash.prototype.plant = seq.plant;
  lodash.prototype.reverse = seq.reverse;
  lodash.prototype.toJSON = lodash.prototype.valueOf = lodash.prototype.value = seq.value;
  lodash.prototype.first = lodash.prototype.head;
  if (symIterator) {
    lodash.prototype[symIterator] = seq.toIterator;
  }
  /**
   * @license
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="es" -o ./`
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   */

  const isUndefined = (val) => val === void 0;
  const isBoolean = (val) => typeof val === "boolean";
  const isNumber = (val) => typeof val === "number";
  const isEmpty = (val) => !val && val !== 0 || isArray$1(val) && val.length === 0 || isObject$1(val) && !Object.keys(val).length;
  const isElement$1 = (e) => {
    if (typeof Element === "undefined")
      return false;
    return e instanceof Element;
  };
  const isPropAbsent = (prop) => {
    return isNil(prop);
  };
  const isStringNumber = (val) => {
    if (!isString$1(val)) {
      return false;
    }
    return !Number.isNaN(Number(val));
  };

  const escapeStringRegexp = (string = "") => string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
  const capitalize = (str) => capitalize$2(str);

  const keysOf = (arr) => Object.keys(arr);
  const entriesOf = (arr) => Object.entries(arr);
  const getProp = (obj, path, defaultValue) => {
    return {
      get value() {
        return get(obj, path, defaultValue);
      },
      set value(val) {
        set(obj, path, val);
      }
    };
  };

  class ElementPlusError extends Error {
    constructor(m) {
      super(m);
      this.name = "ElementPlusError";
    }
  }
  function throwError(scope, m) {
    throw new ElementPlusError(`[${scope}] ${m}`);
  }
  function debugWarn(scope, message) {
  }

  const classNameToArray = (cls = "") => cls.split(" ").filter((item) => !!item.trim());
  const hasClass = (el, cls) => {
    if (!el || !cls)
      return false;
    if (cls.includes(" "))
      throw new Error("className should not contain space.");
    return el.classList.contains(cls);
  };
  const addClass = (el, cls) => {
    if (!el || !cls.trim())
      return;
    el.classList.add(...classNameToArray(cls));
  };
  const removeClass = (el, cls) => {
    if (!el || !cls.trim())
      return;
    el.classList.remove(...classNameToArray(cls));
  };
  const getStyle = (element, styleName) => {
    var _a;
    if (!isClient || !element || !styleName)
      return "";
    let key = camelize(styleName);
    if (key === "float")
      key = "cssFloat";
    try {
      const style = element.style[key];
      if (style)
        return style;
      const computed = (_a = document.defaultView) == null ? void 0 : _a.getComputedStyle(element, "");
      return computed ? computed[key] : "";
    } catch (e) {
      return element.style[key];
    }
  };
  function addUnit(value, defaultUnit = "px") {
    if (!value)
      return "";
    if (isNumber(value) || isStringNumber(value)) {
      return `${value}${defaultUnit}`;
    } else if (isString$1(value)) {
      return value;
    }
  }

  const isScroll = (el, isVertical) => {
    if (!isClient)
      return false;
    const key = {
      undefined: "overflow",
      true: "overflow-y",
      false: "overflow-x"
    }[String(isVertical)];
    const overflow = getStyle(el, key);
    return ["scroll", "auto", "overlay"].some((s) => overflow.includes(s));
  };
  const getScrollContainer = (el, isVertical) => {
    if (!isClient)
      return;
    let parent = el;
    while (parent) {
      if ([window, document, document.documentElement].includes(parent))
        return window;
      if (isScroll(parent, isVertical))
        return parent;
      parent = parent.parentNode;
    }
    return parent;
  };
  let scrollBarWidth;
  const getScrollBarWidth = (namespace) => {
    var _a;
    if (!isClient)
      return 0;
    if (scrollBarWidth !== void 0)
      return scrollBarWidth;
    const outer = document.createElement("div");
    outer.className = `${namespace}-scrollbar__wrap`;
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.position = "absolute";
    outer.style.top = "-9999px";
    document.body.appendChild(outer);
    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = "scroll";
    const inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);
    const widthWithScroll = inner.offsetWidth;
    (_a = outer.parentNode) == null ? void 0 : _a.removeChild(outer);
    scrollBarWidth = widthNoScroll - widthWithScroll;
    return scrollBarWidth;
  };
  function scrollIntoView(container, selected) {
    if (!isClient)
      return;
    if (!selected) {
      container.scrollTop = 0;
      return;
    }
    const offsetParents = [];
    let pointer = selected.offsetParent;
    while (pointer !== null && container !== pointer && container.contains(pointer)) {
      offsetParents.push(pointer);
      pointer = pointer.offsetParent;
    }
    const top = selected.offsetTop + offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0);
    const bottom = top + selected.offsetHeight;
    const viewRectTop = container.scrollTop;
    const viewRectBottom = viewRectTop + container.clientHeight;
    if (top < viewRectTop) {
      container.scrollTop = top;
    } else if (bottom > viewRectBottom) {
      container.scrollTop = bottom - container.clientHeight;
    }
  }

  let target = !isClient ? void 0 : document.body;
  function createGlobalNode(id) {
    const el = document.createElement("div");
    if (id !== void 0) {
      el.setAttribute("id", id);
    }
    target.appendChild(el);
    return el;
  }
  function removeGlobalNode(el) {
    el.remove();
  }

  var arrow_down_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "ArrowDown",
    __name: "arrow-down",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.592 30.592 0 0 0-42.752 0z"
        })
      ]));
    }
  });
  var arrow_down_default = arrow_down_vue_vue_type_script_setup_true_lang_default;
  var arrow_left_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "ArrowLeft",
    __name: "arrow-left",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M609.408 149.376 277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0 30.592 30.592 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.592 30.592 0 0 0 0-42.688 29.12 29.12 0 0 0-41.728 0z"
        })
      ]));
    }
  });
  var arrow_left_default = arrow_left_vue_vue_type_script_setup_true_lang_default;
  var arrow_right_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "ArrowRight",
    __name: "arrow-right",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"
        })
      ]));
    }
  });
  var arrow_right_default = arrow_right_vue_vue_type_script_setup_true_lang_default;
  var arrow_up_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "ArrowUp",
    __name: "arrow-up",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "m488.832 344.32-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872 319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0"
        })
      ]));
    }
  });
  var arrow_up_default = arrow_up_vue_vue_type_script_setup_true_lang_default;
  var back_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Back",
    __name: "back",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64"
        }),
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312z"
        })
      ]));
    }
  });
  var back_default = back_vue_vue_type_script_setup_true_lang_default;
  var calendar_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Calendar",
    __name: "calendar",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M128 384v512h768V192H768v32a32 32 0 1 1-64 0v-32H320v32a32 32 0 0 1-64 0v-32H128v128h768v64zm192-256h384V96a32 32 0 1 1 64 0v32h160a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h160V96a32 32 0 0 1 64 0zm-32 384h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64"
        })
      ]));
    }
  });
  var calendar_default = calendar_vue_vue_type_script_setup_true_lang_default;
  var caret_right_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "CaretRight",
    __name: "caret-right",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M384 192v640l384-320.064z"
        })
      ]));
    }
  });
  var caret_right_default = caret_right_vue_vue_type_script_setup_true_lang_default;
  var caret_top_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "CaretTop",
    __name: "caret-top",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 320 192 704h639.936z"
        })
      ]));
    }
  });
  var caret_top_default = caret_top_vue_vue_type_script_setup_true_lang_default;
  var check_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Check",
    __name: "check",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M406.656 706.944 195.84 496.256a32 32 0 1 0-45.248 45.248l256 256 512-512a32 32 0 0 0-45.248-45.248L406.592 706.944z"
        })
      ]));
    }
  });
  var check_default = check_vue_vue_type_script_setup_true_lang_default;
  var circle_check_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "CircleCheckFilled",
    __name: "circle-check-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336z"
        })
      ]));
    }
  });
  var circle_check_filled_default = circle_check_filled_vue_vue_type_script_setup_true_lang_default;
  var circle_check_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "CircleCheck",
    __name: "circle-check",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896"
        }),
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M745.344 361.344a32 32 0 0 1 45.312 45.312l-288 288a32 32 0 0 1-45.312 0l-160-160a32 32 0 1 1 45.312-45.312L480 626.752l265.344-265.408z"
        })
      ]));
    }
  });
  var circle_check_default = circle_check_vue_vue_type_script_setup_true_lang_default;
  var circle_close_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "CircleCloseFilled",
    __name: "circle-close-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336z"
        })
      ]));
    }
  });
  var circle_close_filled_default = circle_close_filled_vue_vue_type_script_setup_true_lang_default;
  var circle_close_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "CircleClose",
    __name: "circle-close",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "m466.752 512-90.496-90.496a32 32 0 0 1 45.248-45.248L512 466.752l90.496-90.496a32 32 0 1 1 45.248 45.248L557.248 512l90.496 90.496a32 32 0 1 1-45.248 45.248L512 557.248l-90.496 90.496a32 32 0 0 1-45.248-45.248z"
        }),
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896"
        })
      ]));
    }
  });
  var circle_close_default = circle_close_vue_vue_type_script_setup_true_lang_default;
  var clock_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Clock",
    __name: "clock",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896"
        }),
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M480 256a32 32 0 0 1 32 32v256a32 32 0 0 1-64 0V288a32 32 0 0 1 32-32"
        }),
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M480 512h256q32 0 32 32t-32 32H480q-32 0-32-32t32-32"
        })
      ]));
    }
  });
  var clock_default = clock_vue_vue_type_script_setup_true_lang_default;
  var close_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Close",
    __name: "close",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
        })
      ]));
    }
  });
  var close_default = close_vue_vue_type_script_setup_true_lang_default;
  var d_arrow_left_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "DArrowLeft",
    __name: "d-arrow-left",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M529.408 149.376a29.12 29.12 0 0 1 41.728 0 30.592 30.592 0 0 1 0 42.688L259.264 511.936l311.872 319.936a30.592 30.592 0 0 1-.512 43.264 29.12 29.12 0 0 1-41.216-.512L197.76 534.272a32 32 0 0 1 0-44.672l331.648-340.224zm256 0a29.12 29.12 0 0 1 41.728 0 30.592 30.592 0 0 1 0 42.688L515.264 511.936l311.872 319.936a30.592 30.592 0 0 1-.512 43.264 29.12 29.12 0 0 1-41.216-.512L453.76 534.272a32 32 0 0 1 0-44.672l331.648-340.224z"
        })
      ]));
    }
  });
  var d_arrow_left_default = d_arrow_left_vue_vue_type_script_setup_true_lang_default;
  var d_arrow_right_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "DArrowRight",
    __name: "d-arrow-right",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M452.864 149.312a29.12 29.12 0 0 1 41.728.064L826.24 489.664a32 32 0 0 1 0 44.672L494.592 874.624a29.12 29.12 0 0 1-41.728 0 30.592 30.592 0 0 1 0-42.752L764.736 512 452.864 192a30.592 30.592 0 0 1 0-42.688m-256 0a29.12 29.12 0 0 1 41.728.064L570.24 489.664a32 32 0 0 1 0 44.672L238.592 874.624a29.12 29.12 0 0 1-41.728 0 30.592 30.592 0 0 1 0-42.752L508.736 512 196.864 192a30.592 30.592 0 0 1 0-42.688z"
        })
      ]));
    }
  });
  var d_arrow_right_default = d_arrow_right_vue_vue_type_script_setup_true_lang_default;
  var delete_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Delete",
    __name: "delete",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32zm448-64v-64H416v64zM224 896h576V256H224zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32m192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32"
        })
      ]));
    }
  });
  var delete_default = delete_vue_vue_type_script_setup_true_lang_default;
  var document_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Document",
    __name: "document",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M832 384H576V128H192v768h640zm-26.496-64L640 154.496V320zM160 64h480l256 256v608a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32m160 448h384v64H320zm0-192h160v64H320zm0 384h384v64H320z"
        })
      ]));
    }
  });
  var document_default = document_vue_vue_type_script_setup_true_lang_default;
  var full_screen_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "FullScreen",
    __name: "full-screen",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "m160 96.064 192 .192a32 32 0 0 1 0 64l-192-.192V352a32 32 0 0 1-64 0V96h64zm0 831.872V928H96V672a32 32 0 1 1 64 0v191.936l192-.192a32 32 0 1 1 0 64zM864 96.064V96h64v256a32 32 0 1 1-64 0V160.064l-192 .192a32 32 0 1 1 0-64l192-.192zm0 831.872-192-.192a32 32 0 0 1 0-64l192 .192V672a32 32 0 1 1 64 0v256h-64z"
        })
      ]));
    }
  });
  var full_screen_default = full_screen_vue_vue_type_script_setup_true_lang_default;
  var hide_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Hide",
    __name: "hide",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M876.8 156.8c0-9.6-3.2-16-9.6-22.4-6.4-6.4-12.8-9.6-22.4-9.6-9.6 0-16 3.2-22.4 9.6L736 220.8c-64-32-137.6-51.2-224-60.8-160 16-288 73.6-377.6 176C44.8 438.4 0 496 0 512s48 73.6 134.4 176c22.4 25.6 44.8 48 73.6 67.2l-86.4 89.6c-6.4 6.4-9.6 12.8-9.6 22.4 0 9.6 3.2 16 9.6 22.4 6.4 6.4 12.8 9.6 22.4 9.6 9.6 0 16-3.2 22.4-9.6l704-710.4c3.2-6.4 6.4-12.8 6.4-22.4Zm-646.4 528c-76.8-70.4-128-128-153.6-172.8 28.8-48 80-105.6 153.6-172.8C304 272 400 230.4 512 224c64 3.2 124.8 19.2 176 44.8l-54.4 54.4C598.4 300.8 560 288 512 288c-64 0-115.2 22.4-160 64s-64 96-64 160c0 48 12.8 89.6 35.2 124.8L256 707.2c-9.6-6.4-19.2-16-25.6-22.4Zm140.8-96c-12.8-22.4-19.2-48-19.2-76.8 0-44.8 16-83.2 48-112 32-28.8 67.2-48 112-48 28.8 0 54.4 6.4 73.6 19.2zM889.599 336c-12.8-16-28.8-28.8-41.6-41.6l-48 48c73.6 67.2 124.8 124.8 150.4 169.6-28.8 48-80 105.6-153.6 172.8-73.6 67.2-172.8 108.8-284.8 115.2-51.2-3.2-99.2-12.8-140.8-28.8l-48 48c57.6 22.4 118.4 38.4 188.8 44.8 160-16 288-73.6 377.6-176C979.199 585.6 1024 528 1024 512s-48.001-73.6-134.401-176Z"
        }),
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M511.998 672c-12.8 0-25.6-3.2-38.4-6.4l-51.2 51.2c28.8 12.8 57.6 19.2 89.6 19.2 64 0 115.2-22.4 160-64 41.6-41.6 64-96 64-160 0-32-6.4-64-19.2-89.6l-51.2 51.2c3.2 12.8 6.4 25.6 6.4 38.4 0 44.8-16 83.2-48 112-32 28.8-67.2 48-112 48Z"
        })
      ]));
    }
  });
  var hide_default = hide_vue_vue_type_script_setup_true_lang_default;
  var info_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "InfoFilled",
    __name: "info-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896.064A448 448 0 0 1 512 64m67.2 275.072c33.28 0 60.288-23.104 60.288-57.344s-27.072-57.344-60.288-57.344c-33.28 0-60.16 23.104-60.16 57.344s26.88 57.344 60.16 57.344M590.912 699.2c0-6.848 2.368-24.64 1.024-34.752l-52.608 60.544c-10.88 11.456-24.512 19.392-30.912 17.28a12.992 12.992 0 0 1-8.256-14.72l87.68-276.992c7.168-35.136-12.544-67.2-54.336-71.296-44.096 0-108.992 44.736-148.48 101.504 0 6.784-1.28 23.68.064 33.792l52.544-60.608c10.88-11.328 23.552-19.328 29.952-17.152a12.8 12.8 0 0 1 7.808 16.128L388.48 728.576c-10.048 32.256 8.96 63.872 55.04 71.04 67.84 0 107.904-43.648 147.456-100.416z"
        })
      ]));
    }
  });
  var info_filled_default = info_filled_vue_vue_type_script_setup_true_lang_default;
  var loading_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Loading",
    __name: "loading",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0m-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"
        })
      ]));
    }
  });
  var loading_default = loading_vue_vue_type_script_setup_true_lang_default;
  var minus_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Minus",
    __name: "minus",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M128 544h768a32 32 0 1 0 0-64H128a32 32 0 0 0 0 64"
        })
      ]));
    }
  });
  var minus_default = minus_vue_vue_type_script_setup_true_lang_default;
  var more_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "MoreFilled",
    __name: "more-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M176 416a112 112 0 1 1 0 224 112 112 0 0 1 0-224m336 0a112 112 0 1 1 0 224 112 112 0 0 1 0-224m336 0a112 112 0 1 1 0 224 112 112 0 0 1 0-224"
        })
      ]));
    }
  });
  var more_filled_default = more_filled_vue_vue_type_script_setup_true_lang_default;
  var more_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "More",
    __name: "more",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M176 416a112 112 0 1 0 0 224 112 112 0 0 0 0-224m0 64a48 48 0 1 1 0 96 48 48 0 0 1 0-96m336-64a112 112 0 1 1 0 224 112 112 0 0 1 0-224m0 64a48 48 0 1 0 0 96 48 48 0 0 0 0-96m336-64a112 112 0 1 1 0 224 112 112 0 0 1 0-224m0 64a48 48 0 1 0 0 96 48 48 0 0 0 0-96"
        })
      ]));
    }
  });
  var more_default = more_vue_vue_type_script_setup_true_lang_default;
  var picture_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "PictureFilled",
    __name: "picture-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M96 896a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h832a32 32 0 0 1 32 32v704a32 32 0 0 1-32 32zm315.52-228.48-68.928-68.928a32 32 0 0 0-45.248 0L128 768.064h778.688l-242.112-290.56a32 32 0 0 0-49.216 0L458.752 665.408a32 32 0 0 1-47.232 2.112M256 384a96 96 0 1 0 192.064-.064A96 96 0 0 0 256 384"
        })
      ]));
    }
  });
  var picture_filled_default = picture_filled_vue_vue_type_script_setup_true_lang_default;
  var plus_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Plus",
    __name: "plus",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64z"
        })
      ]));
    }
  });
  var plus_default = plus_vue_vue_type_script_setup_true_lang_default;
  var question_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "QuestionFilled",
    __name: "question-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m23.744 191.488c-52.096 0-92.928 14.784-123.2 44.352-30.976 29.568-45.76 70.4-45.76 122.496h80.256c0-29.568 5.632-52.8 17.6-68.992 13.376-19.712 35.2-28.864 66.176-28.864 23.936 0 42.944 6.336 56.32 19.712 12.672 13.376 19.712 31.68 19.712 54.912 0 17.6-6.336 34.496-19.008 49.984l-8.448 9.856c-45.76 40.832-73.216 70.4-82.368 89.408-9.856 19.008-14.08 42.24-14.08 68.992v9.856h80.96v-9.856c0-16.896 3.52-31.68 10.56-45.76 6.336-12.672 15.488-24.64 28.16-35.2 33.792-29.568 54.208-48.576 60.544-55.616 16.896-22.528 26.048-51.392 26.048-86.592 0-42.944-14.08-76.736-42.24-101.376-28.16-25.344-65.472-37.312-111.232-37.312zm-12.672 406.208a54.272 54.272 0 0 0-38.72 14.784 49.408 49.408 0 0 0-15.488 38.016c0 15.488 4.928 28.16 15.488 38.016A54.848 54.848 0 0 0 523.072 768c15.488 0 28.16-4.928 38.72-14.784a51.52 51.52 0 0 0 16.192-38.72 51.968 51.968 0 0 0-15.488-38.016 55.936 55.936 0 0 0-39.424-14.784z"
        })
      ]));
    }
  });
  var question_filled_default = question_filled_vue_vue_type_script_setup_true_lang_default;
  var refresh_left_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "RefreshLeft",
    __name: "refresh-left",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M289.088 296.704h92.992a32 32 0 0 1 0 64H232.96a32 32 0 0 1-32-32V179.712a32 32 0 0 1 64 0v50.56a384 384 0 0 1 643.84 282.88 384 384 0 0 1-383.936 384 384 384 0 0 1-384-384h64a320 320 0 1 0 640 0 320 320 0 0 0-555.712-216.448z"
        })
      ]));
    }
  });
  var refresh_left_default = refresh_left_vue_vue_type_script_setup_true_lang_default;
  var refresh_right_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "RefreshRight",
    __name: "refresh-right",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M784.512 230.272v-50.56a32 32 0 1 1 64 0v149.056a32 32 0 0 1-32 32H667.52a32 32 0 1 1 0-64h92.992A320 320 0 1 0 524.8 833.152a320 320 0 0 0 320-320h64a384 384 0 0 1-384 384 384 384 0 0 1-384-384 384 384 0 0 1 643.712-282.88z"
        })
      ]));
    }
  });
  var refresh_right_default = refresh_right_vue_vue_type_script_setup_true_lang_default;
  var scale_to_original_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "ScaleToOriginal",
    __name: "scale-to-original",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M813.176 180.706a60.235 60.235 0 0 1 60.236 60.235v481.883a60.235 60.235 0 0 1-60.236 60.235H210.824a60.235 60.235 0 0 1-60.236-60.235V240.94a60.235 60.235 0 0 1 60.236-60.235h602.352zm0-60.235H210.824A120.47 120.47 0 0 0 90.353 240.94v481.883a120.47 120.47 0 0 0 120.47 120.47h602.353a120.47 120.47 0 0 0 120.471-120.47V240.94a120.47 120.47 0 0 0-120.47-120.47zm-120.47 180.705a30.118 30.118 0 0 0-30.118 30.118v301.177a30.118 30.118 0 0 0 60.236 0V331.294a30.118 30.118 0 0 0-30.118-30.118zm-361.412 0a30.118 30.118 0 0 0-30.118 30.118v301.177a30.118 30.118 0 1 0 60.236 0V331.294a30.118 30.118 0 0 0-30.118-30.118M512 361.412a30.118 30.118 0 0 0-30.118 30.117v30.118a30.118 30.118 0 0 0 60.236 0V391.53A30.118 30.118 0 0 0 512 361.412M512 512a30.118 30.118 0 0 0-30.118 30.118v30.117a30.118 30.118 0 0 0 60.236 0v-30.117A30.118 30.118 0 0 0 512 512"
        })
      ]));
    }
  });
  var scale_to_original_default = scale_to_original_vue_vue_type_script_setup_true_lang_default;
  var search_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Search",
    __name: "search",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704"
        })
      ]));
    }
  });
  var search_default = search_vue_vue_type_script_setup_true_lang_default;
  var sort_down_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "SortDown",
    __name: "sort-down",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M576 96v709.568L333.312 562.816A32 32 0 1 0 288 608l297.408 297.344A32 32 0 0 0 640 882.688V96a32 32 0 0 0-64 0"
        })
      ]));
    }
  });
  var sort_down_default = sort_down_vue_vue_type_script_setup_true_lang_default;
  var sort_up_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "SortUp",
    __name: "sort-up",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M384 141.248V928a32 32 0 1 0 64 0V218.56l242.688 242.688A32 32 0 1 0 736 416L438.592 118.656A32 32 0 0 0 384 141.248"
        })
      ]));
    }
  });
  var sort_up_default = sort_up_vue_vue_type_script_setup_true_lang_default;
  var star_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "StarFilled",
    __name: "star-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M283.84 867.84 512 747.776l228.16 119.936a6.4 6.4 0 0 0 9.28-6.72l-43.52-254.08 184.512-179.904a6.4 6.4 0 0 0-3.52-10.88l-255.104-37.12L517.76 147.904a6.4 6.4 0 0 0-11.52 0L392.192 379.072l-255.104 37.12a6.4 6.4 0 0 0-3.52 10.88L318.08 606.976l-43.584 254.08a6.4 6.4 0 0 0 9.28 6.72z"
        })
      ]));
    }
  });
  var star_filled_default = star_filled_vue_vue_type_script_setup_true_lang_default;
  var star_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "Star",
    __name: "star",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "m512 747.84 228.16 119.936a6.4 6.4 0 0 0 9.28-6.72l-43.52-254.08 184.512-179.904a6.4 6.4 0 0 0-3.52-10.88l-255.104-37.12L517.76 147.904a6.4 6.4 0 0 0-11.52 0L392.192 379.072l-255.104 37.12a6.4 6.4 0 0 0-3.52 10.88L318.08 606.976l-43.584 254.08a6.4 6.4 0 0 0 9.28 6.72zM313.6 924.48a70.4 70.4 0 0 1-102.144-74.24l37.888-220.928L88.96 472.96A70.4 70.4 0 0 1 128 352.896l221.76-32.256 99.2-200.96a70.4 70.4 0 0 1 126.208 0l99.2 200.96 221.824 32.256a70.4 70.4 0 0 1 39.04 120.064L774.72 629.376l37.888 220.928a70.4 70.4 0 0 1-102.144 74.24L512 820.096l-198.4 104.32z"
        })
      ]));
    }
  });
  var star_default = star_vue_vue_type_script_setup_true_lang_default;
  var success_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "SuccessFilled",
    __name: "success-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336z"
        })
      ]));
    }
  });
  var success_filled_default = success_filled_vue_vue_type_script_setup_true_lang_default;
  var view_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "View",
    __name: "view",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352m0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288zm0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448m0 64a160.192 160.192 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160"
        })
      ]));
    }
  });
  var view_default = view_vue_vue_type_script_setup_true_lang_default;
  var warning_filled_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "WarningFilled",
    __name: "warning-filled",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 192a58.432 58.432 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.432 58.432 0 0 0 512 256m0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4"
        })
      ]));
    }
  });
  var warning_filled_default = warning_filled_vue_vue_type_script_setup_true_lang_default;
  var zoom_in_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "ZoomIn",
    __name: "zoom-in",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704m-32-384v-96a32 32 0 0 1 64 0v96h96a32 32 0 0 1 0 64h-96v96a32 32 0 0 1-64 0v-96h-96a32 32 0 0 1 0-64z"
        })
      ]));
    }
  });
  var zoom_in_default = zoom_in_vue_vue_type_script_setup_true_lang_default;
  var zoom_out_vue_vue_type_script_setup_true_lang_default = /* @__PURE__ */ vue.defineComponent({
    name: "ZoomOut",
    __name: "zoom-out",
    setup(__props) {
      return (_ctx, _cache) => (vue.openBlock(), vue.createElementBlock("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 1024 1024"
      }, [
        vue.createElementVNode("path", {
          fill: "currentColor",
          d: "m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704M352 448h256a32 32 0 0 1 0 64H352a32 32 0 0 1 0-64"
        })
      ]));
    }
  });
  var zoom_out_default = zoom_out_vue_vue_type_script_setup_true_lang_default;
  /*! Element Plus Icons Vue v2.3.1 */

  const epPropKey = "__epPropKey";
  const definePropType = (val) => val;
  const isEpProp = (val) => isObject$1(val) && !!val[epPropKey];
  const buildProp = (prop, key) => {
    if (!isObject$1(prop) || isEpProp(prop))
      return prop;
    const { values, required, default: defaultValue, type, validator } = prop;
    const _validator = values || validator ? (val) => {
      let valid = false;
      let allowedValues = [];
      if (values) {
        allowedValues = Array.from(values);
        if (hasOwn(prop, "default")) {
          allowedValues.push(defaultValue);
        }
        valid || (valid = allowedValues.includes(val));
      }
      if (validator)
        valid || (valid = validator(val));
      if (!valid && allowedValues.length > 0) {
        const allowValuesText = [...new Set(allowedValues)].map((value) => JSON.stringify(value)).join(", ");
        vue.warn(`Invalid prop: validation failed${key ? ` for prop "${key}"` : ""}. Expected one of [${allowValuesText}], got value ${JSON.stringify(val)}.`);
      }
      return valid;
    } : void 0;
    const epProp = {
      type,
      required: !!required,
      validator: _validator,
      [epPropKey]: true
    };
    if (hasOwn(prop, "default"))
      epProp.default = defaultValue;
    return epProp;
  };
  const buildProps = (props) => fromPairs(Object.entries(props).map(([key, option]) => [
    key,
    buildProp(option, key)
  ]));

  const iconPropType = definePropType([
    String,
    Object,
    Function
  ]);
  const CloseComponents = {
    Close: close_default
  };
  const TypeComponents = {
    Close: close_default,
    SuccessFilled: success_filled_default,
    InfoFilled: info_filled_default,
    WarningFilled: warning_filled_default,
    CircleCloseFilled: circle_close_filled_default
  };
  const TypeComponentsMap = {
    success: success_filled_default,
    warning: warning_filled_default,
    error: circle_close_filled_default,
    info: info_filled_default
  };
  const ValidateComponentsMap = {
    validating: loading_default,
    success: circle_check_default,
    error: circle_close_default
  };

  const withInstall = (main, extra) => {
    main.install = (app) => {
      for (const comp of [main, ...Object.values(extra != null ? extra : {})]) {
        app.component(comp.name, comp);
      }
    };
    if (extra) {
      for (const [key, comp] of Object.entries(extra)) {
        main[key] = comp;
      }
    }
    return main;
  };
  const withInstallFunction = (fn, name) => {
    fn.install = (app) => {
      fn._context = app._context;
      app.config.globalProperties[name] = fn;
    };
    return fn;
  };
  const withInstallDirective = (directive, name) => {
    directive.install = (app) => {
      app.directive(name, directive);
    };
    return directive;
  };
  const withNoopInstall = (component) => {
    component.install = NOOP;
    return component;
  };

  const composeRefs = (...refs) => {
    return (el) => {
      refs.forEach((ref) => {
        if (isFunction$1(ref)) {
          ref(el);
        } else {
          ref.value = el;
        }
      });
    };
  };

  const EVENT_CODE = {
    tab: "Tab",
    enter: "Enter",
    space: "Space",
    left: "ArrowLeft",
    up: "ArrowUp",
    right: "ArrowRight",
    down: "ArrowDown",
    esc: "Escape",
    delete: "Delete",
    backspace: "Backspace",
    numpadEnter: "NumpadEnter",
    pageUp: "PageUp",
    pageDown: "PageDown",
    home: "Home",
    end: "End"
  };

  const datePickTypes = [
    "year",
    "month",
    "date",
    "dates",
    "week",
    "datetime",
    "datetimerange",
    "daterange",
    "monthrange"
  ];
  const WEEK_DAYS = [
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat"
  ];

  const UPDATE_MODEL_EVENT = "update:modelValue";
  const CHANGE_EVENT = "change";
  const INPUT_EVENT = "input";

  const INSTALLED_KEY = Symbol("INSTALLED_KEY");

  const componentSizes = ["", "default", "small", "large"];
  const componentSizeMap = {
    large: 40,
    default: 32,
    small: 24
  };

  const getComponentSize = (size) => {
    return componentSizeMap[size || "default"];
  };

  const isValidComponentSize = (val) => ["", ...componentSizes].includes(val);

  var PatchFlags = /* @__PURE__ */ ((PatchFlags2) => {
    PatchFlags2[PatchFlags2["TEXT"] = 1] = "TEXT";
    PatchFlags2[PatchFlags2["CLASS"] = 2] = "CLASS";
    PatchFlags2[PatchFlags2["STYLE"] = 4] = "STYLE";
    PatchFlags2[PatchFlags2["PROPS"] = 8] = "PROPS";
    PatchFlags2[PatchFlags2["FULL_PROPS"] = 16] = "FULL_PROPS";
    PatchFlags2[PatchFlags2["HYDRATE_EVENTS"] = 32] = "HYDRATE_EVENTS";
    PatchFlags2[PatchFlags2["STABLE_FRAGMENT"] = 64] = "STABLE_FRAGMENT";
    PatchFlags2[PatchFlags2["KEYED_FRAGMENT"] = 128] = "KEYED_FRAGMENT";
    PatchFlags2[PatchFlags2["UNKEYED_FRAGMENT"] = 256] = "UNKEYED_FRAGMENT";
    PatchFlags2[PatchFlags2["NEED_PATCH"] = 512] = "NEED_PATCH";
    PatchFlags2[PatchFlags2["DYNAMIC_SLOTS"] = 1024] = "DYNAMIC_SLOTS";
    PatchFlags2[PatchFlags2["HOISTED"] = -1] = "HOISTED";
    PatchFlags2[PatchFlags2["BAIL"] = -2] = "BAIL";
    return PatchFlags2;
  })(PatchFlags || {});
  function isFragment(node) {
    return vue.isVNode(node) && node.type === vue.Fragment;
  }
  function isComment(node) {
    return vue.isVNode(node) && node.type === vue.Comment;
  }
  function isValidElementNode(node) {
    return vue.isVNode(node) && !isFragment(node) && !isComment(node);
  }
  const getNormalizedProps = (node) => {
    if (!vue.isVNode(node)) {
      return {};
    }
    const raw = node.props || {};
    const type = (vue.isVNode(node.type) ? node.type.props : void 0) || {};
    const props = {};
    Object.keys(type).forEach((key) => {
      if (hasOwn(type[key], "default")) {
        props[key] = type[key].default;
      }
    });
    Object.keys(raw).forEach((key) => {
      props[camelize(key)] = raw[key];
    });
    return props;
  };
  const ensureOnlyChild = (children) => {
    if (!isArray$1(children) || children.length > 1) {
      throw new Error("expect to receive a single Vue element child");
    }
    return children[0];
  };
  const flattedChildren = (children) => {
    const vNodes = isArray$1(children) ? children : [children];
    const result = [];
    vNodes.forEach((child) => {
      var _a;
      if (isArray$1(child)) {
        result.push(...flattedChildren(child));
      } else if (vue.isVNode(child) && isArray$1(child.children)) {
        result.push(...flattedChildren(child.children));
      } else {
        result.push(child);
        if (vue.isVNode(child) && ((_a = child.component) == null ? void 0 : _a.subTree)) {
          result.push(...flattedChildren(child.component.subTree));
        }
      }
    });
    return result;
  };

  const unique = (arr) => [...new Set(arr)];
  const castArray = (arr) => {
    if (!arr && arr !== 0)
      return [];
    return Array.isArray(arr) ? arr : [arr];
  };

  const isKorean = (text) => /([\uAC00-\uD7AF\u3130-\u318F])+/gi.test(text);

  const rAF = (fn) => isClient ? window.requestAnimationFrame(fn) : setTimeout(fn, 16);
  const cAF = (handle) => isClient ? window.cancelAnimationFrame(handle) : clearTimeout(handle);

  const generateId = () => Math.floor(Math.random() * 1e4);

  const mutable = (val) => val;

  const DEFAULT_EXCLUDE_KEYS = ["class", "style"];
  const LISTENER_PREFIX = /^on[A-Z]/;
  const useAttrs = (params = {}) => {
    const { excludeListeners = false, excludeKeys } = params;
    const allExcludeKeys = vue.computed(() => {
      return ((excludeKeys == null ? void 0 : excludeKeys.value) || []).concat(DEFAULT_EXCLUDE_KEYS);
    });
    const instance = vue.getCurrentInstance();
    if (!instance) {
      return vue.computed(() => ({}));
    }
    return vue.computed(() => {
      var _a;
      return fromPairs(Object.entries((_a = instance.proxy) == null ? void 0 : _a.$attrs).filter(([key]) => !allExcludeKeys.value.includes(key) && !(excludeListeners && LISTENER_PREFIX.test(key))));
    });
  };

  const useDeprecated = ({ from, replacement, scope, version, ref, type = "API" }, condition) => {
    vue.watch(() => vue.unref(condition), (val) => {
    }, {
      immediate: true
    });
  };

  const useDraggable = (targetRef, dragRef, draggable) => {
    let transform = {
      offsetX: 0,
      offsetY: 0
    };
    const onMousedown = (e) => {
      const downX = e.clientX;
      const downY = e.clientY;
      const { offsetX, offsetY } = transform;
      const targetRect = targetRef.value.getBoundingClientRect();
      const targetLeft = targetRect.left;
      const targetTop = targetRect.top;
      const targetWidth = targetRect.width;
      const targetHeight = targetRect.height;
      const clientWidth = document.documentElement.clientWidth;
      const clientHeight = document.documentElement.clientHeight;
      const minLeft = -targetLeft + offsetX;
      const minTop = -targetTop + offsetY;
      const maxLeft = clientWidth - targetLeft - targetWidth + offsetX;
      const maxTop = clientHeight - targetTop - targetHeight + offsetY;
      const onMousemove = (e2) => {
        const moveX = Math.min(Math.max(offsetX + e2.clientX - downX, minLeft), maxLeft);
        const moveY = Math.min(Math.max(offsetY + e2.clientY - downY, minTop), maxTop);
        transform = {
          offsetX: moveX,
          offsetY: moveY
        };
        if (targetRef.value) {
          targetRef.value.style.transform = `translate(${addUnit(moveX)}, ${addUnit(moveY)})`;
        }
      };
      const onMouseup = () => {
        document.removeEventListener("mousemove", onMousemove);
        document.removeEventListener("mouseup", onMouseup);
      };
      document.addEventListener("mousemove", onMousemove);
      document.addEventListener("mouseup", onMouseup);
    };
    const onDraggable = () => {
      if (dragRef.value && targetRef.value) {
        dragRef.value.addEventListener("mousedown", onMousedown);
      }
    };
    const offDraggable = () => {
      if (dragRef.value && targetRef.value) {
        dragRef.value.removeEventListener("mousedown", onMousedown);
      }
    };
    vue.onMounted(() => {
      vue.watchEffect(() => {
        if (draggable.value) {
          onDraggable();
        } else {
          offDraggable();
        }
      });
    });
    vue.onBeforeUnmount(() => {
      offDraggable();
    });
  };

  const useFocus = (el) => {
    return {
      focus: () => {
        var _a, _b;
        (_b = (_a = el.value) == null ? void 0 : _a.focus) == null ? void 0 : _b.call(_a);
      }
    };
  };

  var English = {
    name: "en",
    el: {
      colorpicker: {
        confirm: "OK",
        clear: "Clear",
        defaultLabel: "color picker",
        description: "current color is {color}. press enter to select a new color."
      },
      datepicker: {
        now: "Now",
        today: "Today",
        cancel: "Cancel",
        clear: "Clear",
        confirm: "OK",
        dateTablePrompt: "Use the arrow keys and enter to select the day of the month",
        monthTablePrompt: "Use the arrow keys and enter to select the month",
        yearTablePrompt: "Use the arrow keys and enter to select the year",
        selectedDate: "Selected date",
        selectDate: "Select date",
        selectTime: "Select time",
        startDate: "Start Date",
        startTime: "Start Time",
        endDate: "End Date",
        endTime: "End Time",
        prevYear: "Previous Year",
        nextYear: "Next Year",
        prevMonth: "Previous Month",
        nextMonth: "Next Month",
        year: "",
        month1: "January",
        month2: "February",
        month3: "March",
        month4: "April",
        month5: "May",
        month6: "June",
        month7: "July",
        month8: "August",
        month9: "September",
        month10: "October",
        month11: "November",
        month12: "December",
        week: "week",
        weeks: {
          sun: "Sun",
          mon: "Mon",
          tue: "Tue",
          wed: "Wed",
          thu: "Thu",
          fri: "Fri",
          sat: "Sat"
        },
        weeksFull: {
          sun: "Sunday",
          mon: "Monday",
          tue: "Tuesday",
          wed: "Wednesday",
          thu: "Thursday",
          fri: "Friday",
          sat: "Saturday"
        },
        months: {
          jan: "Jan",
          feb: "Feb",
          mar: "Mar",
          apr: "Apr",
          may: "May",
          jun: "Jun",
          jul: "Jul",
          aug: "Aug",
          sep: "Sep",
          oct: "Oct",
          nov: "Nov",
          dec: "Dec"
        }
      },
      inputNumber: {
        decrease: "decrease number",
        increase: "increase number"
      },
      select: {
        loading: "Loading",
        noMatch: "No matching data",
        noData: "No data",
        placeholder: "Select"
      },
      dropdown: {
        toggleDropdown: "Toggle Dropdown"
      },
      cascader: {
        noMatch: "No matching data",
        loading: "Loading",
        placeholder: "Select",
        noData: "No data"
      },
      pagination: {
        goto: "Go to",
        pagesize: "/page",
        total: "Total {total}",
        pageClassifier: "",
        page: "Page",
        prev: "Go to previous page",
        next: "Go to next page",
        currentPage: "page {pager}",
        prevPages: "Previous {pager} pages",
        nextPages: "Next {pager} pages",
        deprecationWarning: "Deprecated usages detected, please refer to the el-pagination documentation for more details"
      },
      dialog: {
        close: "Close this dialog"
      },
      drawer: {
        close: "Close this dialog"
      },
      messagebox: {
        title: "Message",
        confirm: "OK",
        cancel: "Cancel",
        error: "Illegal input",
        close: "Close this dialog"
      },
      upload: {
        deleteTip: "press delete to remove",
        delete: "Delete",
        preview: "Preview",
        continue: "Continue"
      },
      slider: {
        defaultLabel: "slider between {min} and {max}",
        defaultRangeStartLabel: "pick start value",
        defaultRangeEndLabel: "pick end value"
      },
      table: {
        emptyText: "No Data",
        confirmFilter: "Confirm",
        resetFilter: "Reset",
        clearFilter: "All",
        sumText: "Sum"
      },
      tree: {
        emptyText: "No Data"
      },
      transfer: {
        noMatch: "No matching data",
        noData: "No data",
        titles: ["List 1", "List 2"],
        filterPlaceholder: "Enter keyword",
        noCheckedFormat: "{total} items",
        hasCheckedFormat: "{checked}/{total} checked"
      },
      image: {
        error: "FAILED"
      },
      pageHeader: {
        title: "Back"
      },
      popconfirm: {
        confirmButtonText: "Yes",
        cancelButtonText: "No"
      }
    }
  };

  const buildTranslator = (locale) => (path, option) => translate(path, option, vue.unref(locale));
  const translate = (path, option, locale) => get(locale, path, path).replace(/\{(\w+)\}/g, (_, key) => {
    var _a;
    return `${(_a = option == null ? void 0 : option[key]) != null ? _a : `{${key}}`}`;
  });
  const buildLocaleContext = (locale) => {
    const lang = vue.computed(() => vue.unref(locale).name);
    const localeRef = vue.isRef(locale) ? locale : vue.ref(locale);
    return {
      lang,
      locale: localeRef,
      t: buildTranslator(locale)
    };
  };
  const localeContextKey = Symbol("localeContextKey");
  const useLocale = (localeOverrides) => {
    const locale = localeOverrides || vue.inject(localeContextKey, vue.ref());
    return buildLocaleContext(vue.computed(() => locale.value || English));
  };

  let activeEffectScope;
  function recordEffectScope(effect2, scope = activeEffectScope) {
    if (scope && scope.active) {
      scope.effects.push(effect2);
    }
  }
  const createDep = (effects) => {
    const dep = new Set(effects);
    dep.w = 0;
    dep.n = 0;
    return dep;
  };
  const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
  const newTracked = (dep) => (dep.n & trackOpBit) > 0;
  const initDepMarkers = ({ deps }) => {
    if (deps.length) {
      for (let i = 0; i < deps.length; i++) {
        deps[i].w |= trackOpBit;
      }
    }
  };
  const finalizeDepMarkers = (effect2) => {
    const { deps } = effect2;
    if (deps.length) {
      let ptr = 0;
      for (let i = 0; i < deps.length; i++) {
        const dep = deps[i];
        if (wasTracked(dep) && !newTracked(dep)) {
          dep.delete(effect2);
        } else {
          deps[ptr++] = dep;
        }
        dep.w &= ~trackOpBit;
        dep.n &= ~trackOpBit;
      }
      deps.length = ptr;
    }
  };
  let effectTrackDepth = 0;
  let trackOpBit = 1;
  const maxMarkerBits = 30;
  let activeEffect;
  class ReactiveEffect {
    constructor(fn, scheduler2 = null, scope) {
      this.fn = fn;
      this.scheduler = scheduler2;
      this.active = true;
      this.deps = [];
      this.parent = void 0;
      recordEffectScope(this, scope);
    }
    run() {
      if (!this.active) {
        return this.fn();
      }
      let parent = activeEffect;
      let lastShouldTrack = shouldTrack;
      while (parent) {
        if (parent === this) {
          return;
        }
        parent = parent.parent;
      }
      try {
        this.parent = activeEffect;
        activeEffect = this;
        shouldTrack = true;
        trackOpBit = 1 << ++effectTrackDepth;
        if (effectTrackDepth <= maxMarkerBits) {
          initDepMarkers(this);
        } else {
          cleanupEffect(this);
        }
        return this.fn();
      } finally {
        if (effectTrackDepth <= maxMarkerBits) {
          finalizeDepMarkers(this);
        }
        trackOpBit = 1 << --effectTrackDepth;
        activeEffect = this.parent;
        shouldTrack = lastShouldTrack;
        this.parent = void 0;
        if (this.deferStop) {
          this.stop();
        }
      }
    }
    stop() {
      if (activeEffect === this) {
        this.deferStop = true;
      } else if (this.active) {
        cleanupEffect(this);
        if (this.onStop) {
          this.onStop();
        }
        this.active = false;
      }
    }
  }
  function cleanupEffect(effect2) {
    const { deps } = effect2;
    if (deps.length) {
      for (let i = 0; i < deps.length; i++) {
        deps[i].delete(effect2);
      }
      deps.length = 0;
    }
  }
  let shouldTrack = true;
  function trackEffects(dep, debuggerEventExtraInfo) {
    let shouldTrack2 = false;
    if (effectTrackDepth <= maxMarkerBits) {
      if (!newTracked(dep)) {
        dep.n |= trackOpBit;
        shouldTrack2 = !wasTracked(dep);
      }
    } else {
      shouldTrack2 = !dep.has(activeEffect);
    }
    if (shouldTrack2) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
    }
  }
  function triggerEffects(dep, debuggerEventExtraInfo) {
    const effects = isArray$1(dep) ? dep : [...dep];
    for (const effect2 of effects) {
      if (effect2.computed) {
        triggerEffect(effect2);
      }
    }
    for (const effect2 of effects) {
      if (!effect2.computed) {
        triggerEffect(effect2);
      }
    }
  }
  function triggerEffect(effect2, debuggerEventExtraInfo) {
    if (effect2 !== activeEffect || effect2.allowRecurse) {
      if (effect2.scheduler) {
        effect2.scheduler();
      } else {
        effect2.run();
      }
    }
  }
  function toRaw(observed) {
    const raw = observed && observed["__v_raw"];
    return raw ? toRaw(raw) : observed;
  }
  function trackRefValue(ref2) {
    if (shouldTrack && activeEffect) {
      ref2 = toRaw(ref2);
      {
        trackEffects(ref2.dep || (ref2.dep = createDep()));
      }
    }
  }
  function triggerRefValue(ref2, newVal) {
    ref2 = toRaw(ref2);
    if (ref2.dep) {
      {
        triggerEffects(ref2.dep);
      }
    }
  }
  class ComputedRefImpl {
    constructor(getter, _setter, isReadonly2, isSSR) {
      this._setter = _setter;
      this.dep = void 0;
      this.__v_isRef = true;
      this._dirty = true;
      this.effect = new ReactiveEffect(getter, () => {
        if (!this._dirty) {
          this._dirty = true;
          triggerRefValue(this);
        }
      });
      this.effect.computed = this;
      this.effect.active = this._cacheable = !isSSR;
      this["__v_isReadonly"] = isReadonly2;
    }
    get value() {
      const self = toRaw(this);
      trackRefValue(self);
      if (self._dirty || !self._cacheable) {
        self._dirty = false;
        self._value = self.effect.run();
      }
      return self._value;
    }
    set value(newValue) {
      this._setter(newValue);
    }
  }
  function computed(getterOrOptions, debugOptions, isSSR = false) {
    let getter;
    let setter;
    const onlyGetter = isFunction$1(getterOrOptions);
    if (onlyGetter) {
      getter = getterOrOptions;
      setter = NOOP;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
    return cRef;
  }

  const defaultNamespace = "el";
  const statePrefix = "is-";
  const _bem = (namespace, block, blockSuffix, element, modifier) => {
    let cls = `${namespace}-${block}`;
    if (blockSuffix) {
      cls += `-${blockSuffix}`;
    }
    if (element) {
      cls += `__${element}`;
    }
    if (modifier) {
      cls += `--${modifier}`;
    }
    return cls;
  };
  const namespaceContextKey = Symbol("namespaceContextKey");
  const useGetDerivedNamespace = (namespaceOverrides) => {
    const derivedNamespace = namespaceOverrides || (vue.getCurrentInstance() ? vue.inject(namespaceContextKey, vue.ref(defaultNamespace)) : vue.ref(defaultNamespace));
    const namespace = vue.computed(() => {
      return vue.unref(derivedNamespace) || defaultNamespace;
    });
    return namespace;
  };
  const useNamespace = (block, namespaceOverrides) => {
    const namespace = useGetDerivedNamespace(namespaceOverrides);
    const b = (blockSuffix = "") => _bem(namespace.value, block, blockSuffix, "", "");
    const e = (element) => element ? _bem(namespace.value, block, "", element, "") : "";
    const m = (modifier) => modifier ? _bem(namespace.value, block, "", "", modifier) : "";
    const be = (blockSuffix, element) => blockSuffix && element ? _bem(namespace.value, block, blockSuffix, element, "") : "";
    const em = (element, modifier) => element && modifier ? _bem(namespace.value, block, "", element, modifier) : "";
    const bm = (blockSuffix, modifier) => blockSuffix && modifier ? _bem(namespace.value, block, blockSuffix, "", modifier) : "";
    const bem = (blockSuffix, element, modifier) => blockSuffix && element && modifier ? _bem(namespace.value, block, blockSuffix, element, modifier) : "";
    const is = (name, ...args) => {
      const state = args.length >= 1 ? args[0] : true;
      return name && state ? `${statePrefix}${name}` : "";
    };
    const cssVar = (object) => {
      const styles = {};
      for (const key in object) {
        if (object[key]) {
          styles[`--${namespace.value}-${key}`] = object[key];
        }
      }
      return styles;
    };
    const cssVarBlock = (object) => {
      const styles = {};
      for (const key in object) {
        if (object[key]) {
          styles[`--${namespace.value}-${block}-${key}`] = object[key];
        }
      }
      return styles;
    };
    const cssVarName = (name) => `--${namespace.value}-${name}`;
    const cssVarBlockName = (name) => `--${namespace.value}-${block}-${name}`;
    return {
      namespace,
      b,
      e,
      m,
      be,
      em,
      bm,
      bem,
      is,
      cssVar,
      cssVarName,
      cssVarBlock,
      cssVarBlockName
    };
  };

  const useLockscreen = (trigger, options = {}) => {
    if (!vue.isRef(trigger)) {
      throwError("[useLockscreen]", "You need to pass a ref param to this function");
    }
    const ns = options.ns || useNamespace("popup");
    const hiddenCls = computed(() => ns.bm("parent", "hidden"));
    if (!isClient || hasClass(document.body, hiddenCls.value)) {
      return;
    }
    let scrollBarWidth = 0;
    let withoutHiddenClass = false;
    let bodyWidth = "0";
    const cleanup = () => {
      setTimeout(() => {
        removeClass(document == null ? void 0 : document.body, hiddenCls.value);
        if (withoutHiddenClass && document) {
          document.body.style.width = bodyWidth;
        }
      }, 200);
    };
    vue.watch(trigger, (val) => {
      if (!val) {
        cleanup();
        return;
      }
      withoutHiddenClass = !hasClass(document.body, hiddenCls.value);
      if (withoutHiddenClass) {
        bodyWidth = document.body.style.width;
      }
      scrollBarWidth = getScrollBarWidth(ns.namespace.value);
      const bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight;
      const bodyOverflowY = getStyle(document.body, "overflowY");
      if (scrollBarWidth > 0 && (bodyHasOverflow || bodyOverflowY === "scroll") && withoutHiddenClass) {
        document.body.style.width = `calc(100% - ${scrollBarWidth}px)`;
      }
      addClass(document.body, hiddenCls.value);
    });
    vue.onScopeDispose(() => cleanup());
  };

  const modalStack = [];
  const closeModal = (e) => {
    if (modalStack.length === 0)
      return;
    if (e.code === EVENT_CODE.esc) {
      e.stopPropagation();
      const topModal = modalStack[modalStack.length - 1];
      topModal.handleClose();
    }
  };
  const useModal = (instance, visibleRef) => {
    vue.watch(visibleRef, (val) => {
      if (val) {
        modalStack.push(instance);
      } else {
        modalStack.splice(modalStack.indexOf(instance), 1);
      }
    });
  };
  if (isClient)
    useEventListener(document, "keydown", closeModal);

  const _prop = buildProp({
    type: definePropType(Boolean),
    default: null
  });
  const _event = buildProp({
    type: definePropType(Function)
  });
  const createModelToggleComposable = (name) => {
    const updateEventKey = `update:${name}`;
    const updateEventKeyRaw = `onUpdate:${name}`;
    const useModelToggleEmits2 = [updateEventKey];
    const useModelToggleProps2 = {
      [name]: _prop,
      [updateEventKeyRaw]: _event
    };
    const useModelToggle2 = ({
      indicator,
      toggleReason,
      shouldHideWhenRouteChanges,
      shouldProceed,
      onShow,
      onHide
    }) => {
      const instance = vue.getCurrentInstance();
      const { emit } = instance;
      const props = instance.props;
      const hasUpdateHandler = vue.computed(() => isFunction$1(props[updateEventKeyRaw]));
      const isModelBindingAbsent = vue.computed(() => props[name] === null);
      const doShow = (event) => {
        if (indicator.value === true) {
          return;
        }
        indicator.value = true;
        if (toggleReason) {
          toggleReason.value = event;
        }
        if (isFunction$1(onShow)) {
          onShow(event);
        }
      };
      const doHide = (event) => {
        if (indicator.value === false) {
          return;
        }
        indicator.value = false;
        if (toggleReason) {
          toggleReason.value = event;
        }
        if (isFunction$1(onHide)) {
          onHide(event);
        }
      };
      const show = (event) => {
        if (props.disabled === true || isFunction$1(shouldProceed) && !shouldProceed())
          return;
        const shouldEmit = hasUpdateHandler.value && isClient;
        if (shouldEmit) {
          emit(updateEventKey, true);
        }
        if (isModelBindingAbsent.value || !shouldEmit) {
          doShow(event);
        }
      };
      const hide = (event) => {
        if (props.disabled === true || !isClient)
          return;
        const shouldEmit = hasUpdateHandler.value && isClient;
        if (shouldEmit) {
          emit(updateEventKey, false);
        }
        if (isModelBindingAbsent.value || !shouldEmit) {
          doHide(event);
        }
      };
      const onChange = (val) => {
        if (!isBoolean(val))
          return;
        if (props.disabled && val) {
          if (hasUpdateHandler.value) {
            emit(updateEventKey, false);
          }
        } else if (indicator.value !== val) {
          if (val) {
            doShow();
          } else {
            doHide();
          }
        }
      };
      const toggle = () => {
        if (indicator.value) {
          hide();
        } else {
          show();
        }
      };
      vue.watch(() => props[name], onChange);
      if (shouldHideWhenRouteChanges && instance.appContext.config.globalProperties.$route !== void 0) {
        vue.watch(() => ({
          ...instance.proxy.$route
        }), () => {
          if (shouldHideWhenRouteChanges.value && indicator.value) {
            hide();
          }
        });
      }
      vue.onMounted(() => {
        onChange(props[name]);
      });
      return {
        hide,
        show,
        toggle,
        hasUpdateHandler
      };
    };
    return {
      useModelToggle: useModelToggle2,
      useModelToggleProps: useModelToggleProps2,
      useModelToggleEmits: useModelToggleEmits2
    };
  };
  const { useModelToggle, useModelToggleProps, useModelToggleEmits } = createModelToggleComposable("modelValue");

  const usePreventGlobal = (indicator, evt, cb) => {
    const prevent = (e) => {
      if (cb(e))
        e.stopImmediatePropagation();
    };
    let stop = void 0;
    vue.watch(() => indicator.value, (val) => {
      if (val) {
        stop = useEventListener(document, evt, prevent, true);
      } else {
        stop == null ? void 0 : stop();
      }
    }, { immediate: true });
  };

  const useProp = (name) => {
    const vm = vue.getCurrentInstance();
    return vue.computed(() => {
      var _a, _b;
      return (_b = (_a = vm == null ? void 0 : vm.proxy) == null ? void 0 : _a.$props) == null ? void 0 : _b[name];
    });
  };

  var E$1="top",R="bottom",W="right",P$1="left",me="auto",G=[E$1,R,W,P$1],U$1="start",J="end",Xe="clippingParents",je="viewport",K="popper",Ye="reference",De=G.reduce(function(t,e){return t.concat([e+"-"+U$1,e+"-"+J])},[]),Ee=[].concat(G,[me]).reduce(function(t,e){return t.concat([e,e+"-"+U$1,e+"-"+J])},[]),Ge="beforeRead",Je="read",Ke="afterRead",Qe="beforeMain",Ze="main",et="afterMain",tt="beforeWrite",nt="write",rt="afterWrite",ot=[Ge,Je,Ke,Qe,Ze,et,tt,nt,rt];function C(t){return t?(t.nodeName||"").toLowerCase():null}function H(t){if(t==null)return window;if(t.toString()!=="[object Window]"){var e=t.ownerDocument;return e&&e.defaultView||window}return t}function Q(t){var e=H(t).Element;return t instanceof e||t instanceof Element}function B(t){var e=H(t).HTMLElement;return t instanceof e||t instanceof HTMLElement}function Pe(t){if(typeof ShadowRoot=="undefined")return !1;var e=H(t).ShadowRoot;return t instanceof e||t instanceof ShadowRoot}function Mt(t){var e=t.state;Object.keys(e.elements).forEach(function(n){var r=e.styles[n]||{},o=e.attributes[n]||{},i=e.elements[n];!B(i)||!C(i)||(Object.assign(i.style,r),Object.keys(o).forEach(function(a){var s=o[a];s===!1?i.removeAttribute(a):i.setAttribute(a,s===!0?"":s);}));});}function Rt(t){var e=t.state,n={popper:{position:e.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(e.elements.popper.style,n.popper),e.styles=n,e.elements.arrow&&Object.assign(e.elements.arrow.style,n.arrow),function(){Object.keys(e.elements).forEach(function(r){var o=e.elements[r],i=e.attributes[r]||{},a=Object.keys(e.styles.hasOwnProperty(r)?e.styles[r]:n[r]),s=a.reduce(function(f,c){return f[c]="",f},{});!B(o)||!C(o)||(Object.assign(o.style,s),Object.keys(i).forEach(function(f){o.removeAttribute(f);}));});}}var Ae={name:"applyStyles",enabled:!0,phase:"write",fn:Mt,effect:Rt,requires:["computeStyles"]};function q(t){return t.split("-")[0]}var X$1=Math.max,ve=Math.min,Z=Math.round;function ee(t,e){e===void 0&&(e=!1);var n=t.getBoundingClientRect(),r=1,o=1;if(B(t)&&e){var i=t.offsetHeight,a=t.offsetWidth;a>0&&(r=Z(n.width)/a||1),i>0&&(o=Z(n.height)/i||1);}return {width:n.width/r,height:n.height/o,top:n.top/o,right:n.right/r,bottom:n.bottom/o,left:n.left/r,x:n.left/r,y:n.top/o}}function ke(t){var e=ee(t),n=t.offsetWidth,r=t.offsetHeight;return Math.abs(e.width-n)<=1&&(n=e.width),Math.abs(e.height-r)<=1&&(r=e.height),{x:t.offsetLeft,y:t.offsetTop,width:n,height:r}}function it(t,e){var n=e.getRootNode&&e.getRootNode();if(t.contains(e))return !0;if(n&&Pe(n)){var r=e;do{if(r&&t.isSameNode(r))return !0;r=r.parentNode||r.host;}while(r)}return !1}function N$1(t){return H(t).getComputedStyle(t)}function Wt(t){return ["table","td","th"].indexOf(C(t))>=0}function I$1(t){return ((Q(t)?t.ownerDocument:t.document)||window.document).documentElement}function ge(t){return C(t)==="html"?t:t.assignedSlot||t.parentNode||(Pe(t)?t.host:null)||I$1(t)}function at(t){return !B(t)||N$1(t).position==="fixed"?null:t.offsetParent}function Bt(t){var e=navigator.userAgent.toLowerCase().indexOf("firefox")!==-1,n=navigator.userAgent.indexOf("Trident")!==-1;if(n&&B(t)){var r=N$1(t);if(r.position==="fixed")return null}var o=ge(t);for(Pe(o)&&(o=o.host);B(o)&&["html","body"].indexOf(C(o))<0;){var i=N$1(o);if(i.transform!=="none"||i.perspective!=="none"||i.contain==="paint"||["transform","perspective"].indexOf(i.willChange)!==-1||e&&i.willChange==="filter"||e&&i.filter&&i.filter!=="none")return o;o=o.parentNode;}return null}function se(t){for(var e=H(t),n=at(t);n&&Wt(n)&&N$1(n).position==="static";)n=at(n);return n&&(C(n)==="html"||C(n)==="body"&&N$1(n).position==="static")?e:n||Bt(t)||e}function Le(t){return ["top","bottom"].indexOf(t)>=0?"x":"y"}function fe(t,e,n){return X$1(t,ve(e,n))}function St(t,e,n){var r=fe(t,e,n);return r>n?n:r}function st(){return {top:0,right:0,bottom:0,left:0}}function ft(t){return Object.assign({},st(),t)}function ct(t,e){return e.reduce(function(n,r){return n[r]=t,n},{})}var Tt=function(t,e){return t=typeof t=="function"?t(Object.assign({},e.rects,{placement:e.placement})):t,ft(typeof t!="number"?t:ct(t,G))};function Ht(t){var e,n=t.state,r=t.name,o=t.options,i=n.elements.arrow,a=n.modifiersData.popperOffsets,s=q(n.placement),f=Le(s),c=[P$1,W].indexOf(s)>=0,u=c?"height":"width";if(!(!i||!a)){var m=Tt(o.padding,n),v=ke(i),l=f==="y"?E$1:P$1,h=f==="y"?R:W,p=n.rects.reference[u]+n.rects.reference[f]-a[f]-n.rects.popper[u],g=a[f]-n.rects.reference[f],x=se(i),y=x?f==="y"?x.clientHeight||0:x.clientWidth||0:0,$=p/2-g/2,d=m[l],b=y-v[u]-m[h],w=y/2-v[u]/2+$,O=fe(d,w,b),j=f;n.modifiersData[r]=(e={},e[j]=O,e.centerOffset=O-w,e);}}function Ct(t){var e=t.state,n=t.options,r=n.element,o=r===void 0?"[data-popper-arrow]":r;o!=null&&(typeof o=="string"&&(o=e.elements.popper.querySelector(o),!o)||!it(e.elements.popper,o)||(e.elements.arrow=o));}var pt={name:"arrow",enabled:!0,phase:"main",fn:Ht,effect:Ct,requires:["popperOffsets"],requiresIfExists:["preventOverflow"]};function te(t){return t.split("-")[1]}var qt={top:"auto",right:"auto",bottom:"auto",left:"auto"};function Vt(t){var e=t.x,n=t.y,r=window,o=r.devicePixelRatio||1;return {x:Z(e*o)/o||0,y:Z(n*o)/o||0}}function ut(t){var e,n=t.popper,r=t.popperRect,o=t.placement,i=t.variation,a=t.offsets,s=t.position,f=t.gpuAcceleration,c=t.adaptive,u=t.roundOffsets,m=t.isFixed,v=a.x,l=v===void 0?0:v,h=a.y,p=h===void 0?0:h,g=typeof u=="function"?u({x:l,y:p}):{x:l,y:p};l=g.x,p=g.y;var x=a.hasOwnProperty("x"),y=a.hasOwnProperty("y"),$=P$1,d=E$1,b=window;if(c){var w=se(n),O="clientHeight",j="clientWidth";if(w===H(n)&&(w=I$1(n),N$1(w).position!=="static"&&s==="absolute"&&(O="scrollHeight",j="scrollWidth")),w=w,o===E$1||(o===P$1||o===W)&&i===J){d=R;var A=m&&w===b&&b.visualViewport?b.visualViewport.height:w[O];p-=A-r.height,p*=f?1:-1;}if(o===P$1||(o===E$1||o===R)&&i===J){$=W;var k=m&&w===b&&b.visualViewport?b.visualViewport.width:w[j];l-=k-r.width,l*=f?1:-1;}}var D=Object.assign({position:s},c&&qt),S=u===!0?Vt({x:l,y:p}):{x:l,y:p};if(l=S.x,p=S.y,f){var L;return Object.assign({},D,(L={},L[d]=y?"0":"",L[$]=x?"0":"",L.transform=(b.devicePixelRatio||1)<=1?"translate("+l+"px, "+p+"px)":"translate3d("+l+"px, "+p+"px, 0)",L))}return Object.assign({},D,(e={},e[d]=y?p+"px":"",e[$]=x?l+"px":"",e.transform="",e))}function Nt(t){var e=t.state,n=t.options,r=n.gpuAcceleration,o=r===void 0?!0:r,i=n.adaptive,a=i===void 0?!0:i,s=n.roundOffsets,f=s===void 0?!0:s,c={placement:q(e.placement),variation:te(e.placement),popper:e.elements.popper,popperRect:e.rects.popper,gpuAcceleration:o,isFixed:e.options.strategy==="fixed"};e.modifiersData.popperOffsets!=null&&(e.styles.popper=Object.assign({},e.styles.popper,ut(Object.assign({},c,{offsets:e.modifiersData.popperOffsets,position:e.options.strategy,adaptive:a,roundOffsets:f})))),e.modifiersData.arrow!=null&&(e.styles.arrow=Object.assign({},e.styles.arrow,ut(Object.assign({},c,{offsets:e.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:f})))),e.attributes.popper=Object.assign({},e.attributes.popper,{"data-popper-placement":e.placement});}var Me={name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:Nt,data:{}},ye={passive:!0};function It(t){var e=t.state,n=t.instance,r=t.options,o=r.scroll,i=o===void 0?!0:o,a=r.resize,s=a===void 0?!0:a,f=H(e.elements.popper),c=[].concat(e.scrollParents.reference,e.scrollParents.popper);return i&&c.forEach(function(u){u.addEventListener("scroll",n.update,ye);}),s&&f.addEventListener("resize",n.update,ye),function(){i&&c.forEach(function(u){u.removeEventListener("scroll",n.update,ye);}),s&&f.removeEventListener("resize",n.update,ye);}}var Re={name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:It,data:{}},_t={left:"right",right:"left",bottom:"top",top:"bottom"};function be(t){return t.replace(/left|right|bottom|top/g,function(e){return _t[e]})}var zt={start:"end",end:"start"};function lt(t){return t.replace(/start|end/g,function(e){return zt[e]})}function We(t){var e=H(t),n=e.pageXOffset,r=e.pageYOffset;return {scrollLeft:n,scrollTop:r}}function Be(t){return ee(I$1(t)).left+We(t).scrollLeft}function Ft(t){var e=H(t),n=I$1(t),r=e.visualViewport,o=n.clientWidth,i=n.clientHeight,a=0,s=0;return r&&(o=r.width,i=r.height,/^((?!chrome|android).)*safari/i.test(navigator.userAgent)||(a=r.offsetLeft,s=r.offsetTop)),{width:o,height:i,x:a+Be(t),y:s}}function Ut(t){var e,n=I$1(t),r=We(t),o=(e=t.ownerDocument)==null?void 0:e.body,i=X$1(n.scrollWidth,n.clientWidth,o?o.scrollWidth:0,o?o.clientWidth:0),a=X$1(n.scrollHeight,n.clientHeight,o?o.scrollHeight:0,o?o.clientHeight:0),s=-r.scrollLeft+Be(t),f=-r.scrollTop;return N$1(o||n).direction==="rtl"&&(s+=X$1(n.clientWidth,o?o.clientWidth:0)-i),{width:i,height:a,x:s,y:f}}function Se(t){var e=N$1(t),n=e.overflow,r=e.overflowX,o=e.overflowY;return /auto|scroll|overlay|hidden/.test(n+o+r)}function dt(t){return ["html","body","#document"].indexOf(C(t))>=0?t.ownerDocument.body:B(t)&&Se(t)?t:dt(ge(t))}function ce(t,e){var n;e===void 0&&(e=[]);var r=dt(t),o=r===((n=t.ownerDocument)==null?void 0:n.body),i=H(r),a=o?[i].concat(i.visualViewport||[],Se(r)?r:[]):r,s=e.concat(a);return o?s:s.concat(ce(ge(a)))}function Te(t){return Object.assign({},t,{left:t.x,top:t.y,right:t.x+t.width,bottom:t.y+t.height})}function Xt(t){var e=ee(t);return e.top=e.top+t.clientTop,e.left=e.left+t.clientLeft,e.bottom=e.top+t.clientHeight,e.right=e.left+t.clientWidth,e.width=t.clientWidth,e.height=t.clientHeight,e.x=e.left,e.y=e.top,e}function ht(t,e){return e===je?Te(Ft(t)):Q(e)?Xt(e):Te(Ut(I$1(t)))}function Yt(t){var e=ce(ge(t)),n=["absolute","fixed"].indexOf(N$1(t).position)>=0,r=n&&B(t)?se(t):t;return Q(r)?e.filter(function(o){return Q(o)&&it(o,r)&&C(o)!=="body"}):[]}function Gt(t,e,n){var r=e==="clippingParents"?Yt(t):[].concat(e),o=[].concat(r,[n]),i=o[0],a=o.reduce(function(s,f){var c=ht(t,f);return s.top=X$1(c.top,s.top),s.right=ve(c.right,s.right),s.bottom=ve(c.bottom,s.bottom),s.left=X$1(c.left,s.left),s},ht(t,i));return a.width=a.right-a.left,a.height=a.bottom-a.top,a.x=a.left,a.y=a.top,a}function mt(t){var e=t.reference,n=t.element,r=t.placement,o=r?q(r):null,i=r?te(r):null,a=e.x+e.width/2-n.width/2,s=e.y+e.height/2-n.height/2,f;switch(o){case E$1:f={x:a,y:e.y-n.height};break;case R:f={x:a,y:e.y+e.height};break;case W:f={x:e.x+e.width,y:s};break;case P$1:f={x:e.x-n.width,y:s};break;default:f={x:e.x,y:e.y};}var c=o?Le(o):null;if(c!=null){var u=c==="y"?"height":"width";switch(i){case U$1:f[c]=f[c]-(e[u]/2-n[u]/2);break;case J:f[c]=f[c]+(e[u]/2-n[u]/2);break}}return f}function ne(t,e){e===void 0&&(e={});var n=e,r=n.placement,o=r===void 0?t.placement:r,i=n.boundary,a=i===void 0?Xe:i,s=n.rootBoundary,f=s===void 0?je:s,c=n.elementContext,u=c===void 0?K:c,m=n.altBoundary,v=m===void 0?!1:m,l=n.padding,h=l===void 0?0:l,p=ft(typeof h!="number"?h:ct(h,G)),g=u===K?Ye:K,x=t.rects.popper,y=t.elements[v?g:u],$=Gt(Q(y)?y:y.contextElement||I$1(t.elements.popper),a,f),d=ee(t.elements.reference),b=mt({reference:d,element:x,strategy:"absolute",placement:o}),w=Te(Object.assign({},x,b)),O=u===K?w:d,j={top:$.top-O.top+p.top,bottom:O.bottom-$.bottom+p.bottom,left:$.left-O.left+p.left,right:O.right-$.right+p.right},A=t.modifiersData.offset;if(u===K&&A){var k=A[o];Object.keys(j).forEach(function(D){var S=[W,R].indexOf(D)>=0?1:-1,L=[E$1,R].indexOf(D)>=0?"y":"x";j[D]+=k[L]*S;});}return j}function Jt(t,e){e===void 0&&(e={});var n=e,r=n.placement,o=n.boundary,i=n.rootBoundary,a=n.padding,s=n.flipVariations,f=n.allowedAutoPlacements,c=f===void 0?Ee:f,u=te(r),m=u?s?De:De.filter(function(h){return te(h)===u}):G,v=m.filter(function(h){return c.indexOf(h)>=0});v.length===0&&(v=m);var l=v.reduce(function(h,p){return h[p]=ne(t,{placement:p,boundary:o,rootBoundary:i,padding:a})[q(p)],h},{});return Object.keys(l).sort(function(h,p){return l[h]-l[p]})}function Kt(t){if(q(t)===me)return [];var e=be(t);return [lt(t),e,lt(e)]}function Qt(t){var e=t.state,n=t.options,r=t.name;if(!e.modifiersData[r]._skip){for(var o=n.mainAxis,i=o===void 0?!0:o,a=n.altAxis,s=a===void 0?!0:a,f=n.fallbackPlacements,c=n.padding,u=n.boundary,m=n.rootBoundary,v=n.altBoundary,l=n.flipVariations,h=l===void 0?!0:l,p=n.allowedAutoPlacements,g=e.options.placement,x=q(g),y=x===g,$=f||(y||!h?[be(g)]:Kt(g)),d=[g].concat($).reduce(function(z,V){return z.concat(q(V)===me?Jt(e,{placement:V,boundary:u,rootBoundary:m,padding:c,flipVariations:h,allowedAutoPlacements:p}):V)},[]),b=e.rects.reference,w=e.rects.popper,O=new Map,j=!0,A=d[0],k=0;k<d.length;k++){var D=d[k],S=q(D),L=te(D)===U$1,re=[E$1,R].indexOf(S)>=0,oe=re?"width":"height",M=ne(e,{placement:D,boundary:u,rootBoundary:m,altBoundary:v,padding:c}),T=re?L?W:P$1:L?R:E$1;b[oe]>w[oe]&&(T=be(T));var pe=be(T),_=[];if(i&&_.push(M[S]<=0),s&&_.push(M[T]<=0,M[pe]<=0),_.every(function(z){return z})){A=D,j=!1;break}O.set(D,_);}if(j)for(var ue=h?3:1,xe=function(z){var V=d.find(function(de){var ae=O.get(de);if(ae)return ae.slice(0,z).every(function(Y){return Y})});if(V)return A=V,"break"},ie=ue;ie>0;ie--){var le=xe(ie);if(le==="break")break}e.placement!==A&&(e.modifiersData[r]._skip=!0,e.placement=A,e.reset=!0);}}var vt={name:"flip",enabled:!0,phase:"main",fn:Qt,requiresIfExists:["offset"],data:{_skip:!1}};function gt(t,e,n){return n===void 0&&(n={x:0,y:0}),{top:t.top-e.height-n.y,right:t.right-e.width+n.x,bottom:t.bottom-e.height+n.y,left:t.left-e.width-n.x}}function yt(t){return [E$1,W,R,P$1].some(function(e){return t[e]>=0})}function Zt(t){var e=t.state,n=t.name,r=e.rects.reference,o=e.rects.popper,i=e.modifiersData.preventOverflow,a=ne(e,{elementContext:"reference"}),s=ne(e,{altBoundary:!0}),f=gt(a,r),c=gt(s,o,i),u=yt(f),m=yt(c);e.modifiersData[n]={referenceClippingOffsets:f,popperEscapeOffsets:c,isReferenceHidden:u,hasPopperEscaped:m},e.attributes.popper=Object.assign({},e.attributes.popper,{"data-popper-reference-hidden":u,"data-popper-escaped":m});}var bt={name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:Zt};function en(t,e,n){var r=q(t),o=[P$1,E$1].indexOf(r)>=0?-1:1,i=typeof n=="function"?n(Object.assign({},e,{placement:t})):n,a=i[0],s=i[1];return a=a||0,s=(s||0)*o,[P$1,W].indexOf(r)>=0?{x:s,y:a}:{x:a,y:s}}function tn(t){var e=t.state,n=t.options,r=t.name,o=n.offset,i=o===void 0?[0,0]:o,a=Ee.reduce(function(u,m){return u[m]=en(m,e.rects,i),u},{}),s=a[e.placement],f=s.x,c=s.y;e.modifiersData.popperOffsets!=null&&(e.modifiersData.popperOffsets.x+=f,e.modifiersData.popperOffsets.y+=c),e.modifiersData[r]=a;}var wt={name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:tn};function nn(t){var e=t.state,n=t.name;e.modifiersData[n]=mt({reference:e.rects.reference,element:e.rects.popper,strategy:"absolute",placement:e.placement});}var He={name:"popperOffsets",enabled:!0,phase:"read",fn:nn,data:{}};function rn(t){return t==="x"?"y":"x"}function on(t){var e=t.state,n=t.options,r=t.name,o=n.mainAxis,i=o===void 0?!0:o,a=n.altAxis,s=a===void 0?!1:a,f=n.boundary,c=n.rootBoundary,u=n.altBoundary,m=n.padding,v=n.tether,l=v===void 0?!0:v,h=n.tetherOffset,p=h===void 0?0:h,g=ne(e,{boundary:f,rootBoundary:c,padding:m,altBoundary:u}),x=q(e.placement),y=te(e.placement),$=!y,d=Le(x),b=rn(d),w=e.modifiersData.popperOffsets,O=e.rects.reference,j=e.rects.popper,A=typeof p=="function"?p(Object.assign({},e.rects,{placement:e.placement})):p,k=typeof A=="number"?{mainAxis:A,altAxis:A}:Object.assign({mainAxis:0,altAxis:0},A),D=e.modifiersData.offset?e.modifiersData.offset[e.placement]:null,S={x:0,y:0};if(w){if(i){var L,re=d==="y"?E$1:P$1,oe=d==="y"?R:W,M=d==="y"?"height":"width",T=w[d],pe=T+g[re],_=T-g[oe],ue=l?-j[M]/2:0,xe=y===U$1?O[M]:j[M],ie=y===U$1?-j[M]:-O[M],le=e.elements.arrow,z=l&&le?ke(le):{width:0,height:0},V=e.modifiersData["arrow#persistent"]?e.modifiersData["arrow#persistent"].padding:st(),de=V[re],ae=V[oe],Y=fe(0,O[M],z[M]),jt=$?O[M]/2-ue-Y-de-k.mainAxis:xe-Y-de-k.mainAxis,Dt=$?-O[M]/2+ue+Y+ae+k.mainAxis:ie+Y+ae+k.mainAxis,Oe=e.elements.arrow&&se(e.elements.arrow),Et=Oe?d==="y"?Oe.clientTop||0:Oe.clientLeft||0:0,Ce=(L=D==null?void 0:D[d])!=null?L:0,Pt=T+jt-Ce-Et,At=T+Dt-Ce,qe=fe(l?ve(pe,Pt):pe,T,l?X$1(_,At):_);w[d]=qe,S[d]=qe-T;}if(s){var Ve,kt=d==="x"?E$1:P$1,Lt=d==="x"?R:W,F=w[b],he=b==="y"?"height":"width",Ne=F+g[kt],Ie=F-g[Lt],$e=[E$1,P$1].indexOf(x)!==-1,_e=(Ve=D==null?void 0:D[b])!=null?Ve:0,ze=$e?Ne:F-O[he]-j[he]-_e+k.altAxis,Fe=$e?F+O[he]+j[he]-_e-k.altAxis:Ie,Ue=l&&$e?St(ze,F,Fe):fe(l?ze:Ne,F,l?Fe:Ie);w[b]=Ue,S[b]=Ue-F;}e.modifiersData[r]=S;}}var xt={name:"preventOverflow",enabled:!0,phase:"main",fn:on,requiresIfExists:["offset"]};function an(t){return {scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}}function sn(t){return t===H(t)||!B(t)?We(t):an(t)}function fn(t){var e=t.getBoundingClientRect(),n=Z(e.width)/t.offsetWidth||1,r=Z(e.height)/t.offsetHeight||1;return n!==1||r!==1}function cn(t,e,n){n===void 0&&(n=!1);var r=B(e),o=B(e)&&fn(e),i=I$1(e),a=ee(t,o),s={scrollLeft:0,scrollTop:0},f={x:0,y:0};return (r||!r&&!n)&&((C(e)!=="body"||Se(i))&&(s=sn(e)),B(e)?(f=ee(e,!0),f.x+=e.clientLeft,f.y+=e.clientTop):i&&(f.x=Be(i))),{x:a.left+s.scrollLeft-f.x,y:a.top+s.scrollTop-f.y,width:a.width,height:a.height}}function pn(t){var e=new Map,n=new Set,r=[];t.forEach(function(i){e.set(i.name,i);});function o(i){n.add(i.name);var a=[].concat(i.requires||[],i.requiresIfExists||[]);a.forEach(function(s){if(!n.has(s)){var f=e.get(s);f&&o(f);}}),r.push(i);}return t.forEach(function(i){n.has(i.name)||o(i);}),r}function un(t){var e=pn(t);return ot.reduce(function(n,r){return n.concat(e.filter(function(o){return o.phase===r}))},[])}function ln(t){var e;return function(){return e||(e=new Promise(function(n){Promise.resolve().then(function(){e=void 0,n(t());});})),e}}function dn(t){var e=t.reduce(function(n,r){var o=n[r.name];return n[r.name]=o?Object.assign({},o,r,{options:Object.assign({},o.options,r.options),data:Object.assign({},o.data,r.data)}):r,n},{});return Object.keys(e).map(function(n){return e[n]})}var Ot={placement:"bottom",modifiers:[],strategy:"absolute"};function $t(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return !e.some(function(r){return !(r&&typeof r.getBoundingClientRect=="function")})}function we(t){t===void 0&&(t={});var e=t,n=e.defaultModifiers,r=n===void 0?[]:n,o=e.defaultOptions,i=o===void 0?Ot:o;return function(a,s,f){f===void 0&&(f=i);var c={placement:"bottom",orderedModifiers:[],options:Object.assign({},Ot,i),modifiersData:{},elements:{reference:a,popper:s},attributes:{},styles:{}},u=[],m=!1,v={state:c,setOptions:function(p){var g=typeof p=="function"?p(c.options):p;h(),c.options=Object.assign({},i,c.options,g),c.scrollParents={reference:Q(a)?ce(a):a.contextElement?ce(a.contextElement):[],popper:ce(s)};var x=un(dn([].concat(r,c.options.modifiers)));return c.orderedModifiers=x.filter(function(y){return y.enabled}),l(),v.update()},forceUpdate:function(){if(!m){var p=c.elements,g=p.reference,x=p.popper;if($t(g,x)){c.rects={reference:cn(g,se(x),c.options.strategy==="fixed"),popper:ke(x)},c.reset=!1,c.placement=c.options.placement,c.orderedModifiers.forEach(function(j){return c.modifiersData[j.name]=Object.assign({},j.data)});for(var y=0;y<c.orderedModifiers.length;y++){if(c.reset===!0){c.reset=!1,y=-1;continue}var $=c.orderedModifiers[y],d=$.fn,b=$.options,w=b===void 0?{}:b,O=$.name;typeof d=="function"&&(c=d({state:c,options:w,name:O,instance:v})||c);}}}},update:ln(function(){return new Promise(function(p){v.forceUpdate(),p(c);})}),destroy:function(){h(),m=!0;}};if(!$t(a,s))return v;v.setOptions(f).then(function(p){!m&&f.onFirstUpdate&&f.onFirstUpdate(p);});function l(){c.orderedModifiers.forEach(function(p){var g=p.name,x=p.options,y=x===void 0?{}:x,$=p.effect;if(typeof $=="function"){var d=$({state:c,name:g,instance:v,options:y}),b=function(){};u.push(d||b);}});}function h(){u.forEach(function(p){return p()}),u=[];}return v}}we();var mn=[Re,He,Me,Ae];we({defaultModifiers:mn});var gn=[Re,He,Me,Ae,wt,vt,xt,pt,bt],yn=we({defaultModifiers:gn});

  const usePopper = (referenceElementRef, popperElementRef, opts = {}) => {
    const stateUpdater = {
      name: "updateState",
      enabled: true,
      phase: "write",
      fn: ({ state }) => {
        const derivedState = deriveState(state);
        Object.assign(states.value, derivedState);
      },
      requires: ["computeStyles"]
    };
    const options = vue.computed(() => {
      const { onFirstUpdate, placement, strategy, modifiers } = vue.unref(opts);
      return {
        onFirstUpdate,
        placement: placement || "bottom",
        strategy: strategy || "absolute",
        modifiers: [
          ...modifiers || [],
          stateUpdater,
          { name: "applyStyles", enabled: false }
        ]
      };
    });
    const instanceRef = vue.shallowRef();
    const states = vue.ref({
      styles: {
        popper: {
          position: vue.unref(options).strategy,
          left: "0",
          top: "0"
        },
        arrow: {
          position: "absolute"
        }
      },
      attributes: {}
    });
    const destroy = () => {
      if (!instanceRef.value)
        return;
      instanceRef.value.destroy();
      instanceRef.value = void 0;
    };
    vue.watch(options, (newOptions) => {
      const instance = vue.unref(instanceRef);
      if (instance) {
        instance.setOptions(newOptions);
      }
    }, {
      deep: true
    });
    vue.watch([referenceElementRef, popperElementRef], ([referenceElement, popperElement]) => {
      destroy();
      if (!referenceElement || !popperElement)
        return;
      instanceRef.value = yn(referenceElement, popperElement, vue.unref(options));
    });
    vue.onBeforeUnmount(() => {
      destroy();
    });
    return {
      state: vue.computed(() => {
        var _a;
        return { ...((_a = vue.unref(instanceRef)) == null ? void 0 : _a.state) || {} };
      }),
      styles: vue.computed(() => vue.unref(states).styles),
      attributes: vue.computed(() => vue.unref(states).attributes),
      update: () => {
        var _a;
        return (_a = vue.unref(instanceRef)) == null ? void 0 : _a.update();
      },
      forceUpdate: () => {
        var _a;
        return (_a = vue.unref(instanceRef)) == null ? void 0 : _a.forceUpdate();
      },
      instanceRef: vue.computed(() => vue.unref(instanceRef))
    };
  };
  function deriveState(state) {
    const elements = Object.keys(state.elements);
    const styles = fromPairs(elements.map((element) => [element, state.styles[element] || {}]));
    const attributes = fromPairs(elements.map((element) => [element, state.attributes[element]]));
    return {
      styles,
      attributes
    };
  }

  const useSameTarget = (handleClick) => {
    if (!handleClick) {
      return { onClick: NOOP, onMousedown: NOOP, onMouseup: NOOP };
    }
    let mousedownTarget = false;
    let mouseupTarget = false;
    const onClick = (e) => {
      if (mousedownTarget && mouseupTarget) {
        handleClick(e);
      }
      mousedownTarget = mouseupTarget = false;
    };
    const onMousedown = (e) => {
      mousedownTarget = e.target === e.currentTarget;
    };
    const onMouseup = (e) => {
      mouseupTarget = e.target === e.currentTarget;
    };
    return { onClick, onMousedown, onMouseup };
  };

  const useTeleport = (contentRenderer, appendToBody) => {
    const isTeleportVisible = vue.ref(false);
    if (!isClient) {
      return {
        isTeleportVisible,
        showTeleport: NOOP,
        hideTeleport: NOOP,
        renderTeleport: NOOP
      };
    }
    let $el = null;
    const showTeleport = () => {
      isTeleportVisible.value = true;
      if ($el !== null)
        return;
      $el = createGlobalNode();
    };
    const hideTeleport = () => {
      isTeleportVisible.value = false;
      if ($el !== null) {
        removeGlobalNode($el);
        $el = null;
      }
    };
    const renderTeleport = () => {
      return appendToBody.value !== true ? contentRenderer() : isTeleportVisible.value ? [vue.h(vue.Teleport, { to: $el }, contentRenderer())] : void 0;
    };
    vue.onUnmounted(hideTeleport);
    return {
      isTeleportVisible,
      showTeleport,
      hideTeleport,
      renderTeleport
    };
  };

  const useThrottleRender = (loading, throttle = 0) => {
    if (throttle === 0)
      return loading;
    const throttled = vue.ref(false);
    let timeoutHandle = 0;
    const dispatchThrottling = () => {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      timeoutHandle = window.setTimeout(() => {
        throttled.value = loading.value;
      }, throttle);
    };
    vue.onMounted(dispatchThrottling);
    vue.watch(() => loading.value, (val) => {
      if (val) {
        dispatchThrottling();
      } else {
        throttled.value = val;
      }
    });
    return throttled;
  };

  function useTimeout() {
    let timeoutHandle;
    const registerTimeout = (fn, delay) => {
      cancelTimeout();
      timeoutHandle = window.setTimeout(fn, delay);
    };
    const cancelTimeout = () => window.clearTimeout(timeoutHandle);
    tryOnScopeDispose(() => cancelTimeout());
    return {
      registerTimeout,
      cancelTimeout
    };
  }

  const AFTER_APPEAR = "after-appear";
  const AFTER_ENTER = "after-enter";
  const AFTER_LEAVE = "after-leave";
  const APPEAR = "appear";
  const APPEAR_CANCELLED = "appear-cancelled";
  const BEFORE_ENTER = "before-enter";
  const BEFORE_LEAVE = "before-leave";
  const ENTER = "enter";
  const ENTER_CANCELLED = "enter-cancelled";
  const LEAVE = "leave";
  const LEAVE_CANCELLED = "leave-cancelled";
  const useTransitionFallthroughEmits = [
    AFTER_APPEAR,
    AFTER_ENTER,
    AFTER_LEAVE,
    APPEAR,
    APPEAR_CANCELLED,
    BEFORE_ENTER,
    BEFORE_LEAVE,
    ENTER,
    ENTER_CANCELLED,
    LEAVE,
    LEAVE_CANCELLED
  ];
  const useTransitionFallthrough = () => {
    const { emit } = vue.getCurrentInstance();
    return {
      onAfterAppear: () => {
        emit(AFTER_APPEAR);
      },
      onAfterEnter: () => {
        emit(AFTER_ENTER);
      },
      onAfterLeave: () => {
        emit(AFTER_LEAVE);
      },
      onAppearCancelled: () => {
        emit(APPEAR_CANCELLED);
      },
      onBeforeEnter: () => {
        emit(BEFORE_ENTER);
      },
      onBeforeLeave: () => {
        emit(BEFORE_LEAVE);
      },
      onEnter: () => {
        emit(ENTER);
      },
      onEnterCancelled: () => {
        emit(ENTER_CANCELLED);
      },
      onLeave: () => {
        emit(LEAVE);
      },
      onLeaveCancelled: () => {
        emit(LEAVE_CANCELLED);
      }
    };
  };

  const defaultIdInjection = {
    prefix: Math.floor(Math.random() * 1e4),
    current: 0
  };
  const ID_INJECTION_KEY = Symbol("elIdInjection");
  const useIdInjection = () => {
    return vue.getCurrentInstance() ? vue.inject(ID_INJECTION_KEY, defaultIdInjection) : defaultIdInjection;
  };
  const useId = (deterministicId) => {
    const idInjection = useIdInjection();
    const namespace = useGetDerivedNamespace();
    const idRef = vue.computed(() => vue.unref(deterministicId) || `${namespace.value}-id-${idInjection.prefix}-${idInjection.current++}`);
    return idRef;
  };

  let registeredEscapeHandlers = [];
  const cachedHandler = (e) => {
    const event = e;
    if (event.key === EVENT_CODE.esc) {
      registeredEscapeHandlers.forEach((registeredHandler) => registeredHandler(event));
    }
  };
  const useEscapeKeydown = (handler) => {
    vue.onMounted(() => {
      if (registeredEscapeHandlers.length === 0) {
        document.addEventListener("keydown", cachedHandler);
      }
      if (isClient)
        registeredEscapeHandlers.push(handler);
    });
    vue.onBeforeUnmount(() => {
      registeredEscapeHandlers = registeredEscapeHandlers.filter((registeredHandler) => registeredHandler !== handler);
      if (registeredEscapeHandlers.length === 0) {
        if (isClient)
          document.removeEventListener("keydown", cachedHandler);
      }
    });
  };

  let cachedContainer;
  const usePopperContainerId = () => {
    const namespace = useGetDerivedNamespace();
    const idInjection = useIdInjection();
    const id = vue.computed(() => {
      return `${namespace.value}-popper-container-${idInjection.prefix}`;
    });
    const selector = vue.computed(() => `#${id.value}`);
    return {
      id,
      selector
    };
  };
  const createContainer = (id) => {
    const container = document.createElement("div");
    container.id = id;
    document.body.appendChild(container);
    return container;
  };
  const usePopperContainer = () => {
    const { id, selector } = usePopperContainerId();
    vue.onBeforeMount(() => {
      if (!isClient)
        return;
      if (!cachedContainer && !document.body.querySelector(selector.value)) {
        cachedContainer = createContainer(id.value);
      }
    });
    return {
      id,
      selector
    };
  };

  const useDelayedRender = ({
    indicator,
    intermediateIndicator,
    shouldSetIntermediate = () => true,
    beforeShow,
    afterShow,
    afterHide,
    beforeHide
  }) => {
    vue.watch(() => vue.unref(indicator), (val) => {
      if (val) {
        beforeShow == null ? void 0 : beforeShow();
        vue.nextTick(() => {
          if (!vue.unref(indicator))
            return;
          if (shouldSetIntermediate("show")) {
            intermediateIndicator.value = true;
          }
        });
      } else {
        beforeHide == null ? void 0 : beforeHide();
        vue.nextTick(() => {
          if (vue.unref(indicator))
            return;
          if (shouldSetIntermediate("hide")) {
            intermediateIndicator.value = false;
          }
        });
      }
    });
    vue.watch(() => intermediateIndicator.value, (val) => {
      if (val) {
        afterShow == null ? void 0 : afterShow();
      } else {
        afterHide == null ? void 0 : afterHide();
      }
    });
  };

  const useDelayedToggleProps = buildProps({
    showAfter: {
      type: Number,
      default: 0
    },
    hideAfter: {
      type: Number,
      default: 200
    },
    autoClose: {
      type: Number,
      default: 0
    }
  });
  const useDelayedToggle = ({
    showAfter,
    hideAfter,
    autoClose,
    open,
    close
  }) => {
    const { registerTimeout } = useTimeout();
    const {
      registerTimeout: registerTimeoutForAutoClose,
      cancelTimeout: cancelTimeoutForAutoClose
    } = useTimeout();
    const onOpen = (event) => {
      registerTimeout(() => {
        open(event);
        const _autoClose = vue.unref(autoClose);
        if (isNumber(_autoClose) && _autoClose > 0) {
          registerTimeoutForAutoClose(() => {
            close(event);
          }, _autoClose);
        }
      }, vue.unref(showAfter));
    };
    const onClose = (event) => {
      cancelTimeoutForAutoClose();
      registerTimeout(() => {
        close(event);
      }, vue.unref(hideAfter));
    };
    return {
      onOpen,
      onClose
    };
  };

  const FORWARD_REF_INJECTION_KEY = Symbol("elForwardRef");
  const useForwardRef = (forwardRef) => {
    const setForwardRef = (el) => {
      forwardRef.value = el;
    };
    vue.provide(FORWARD_REF_INJECTION_KEY, {
      setForwardRef
    });
  };
  const useForwardRefDirective = (setForwardRef) => {
    return {
      mounted(el) {
        setForwardRef(el);
      },
      updated(el) {
        setForwardRef(el);
      },
      unmounted() {
        setForwardRef(null);
      }
    };
  };

  const zIndex = vue.ref(0);
  const defaultInitialZIndex = 2e3;
  const zIndexContextKey = Symbol("zIndexContextKey");
  const useZIndex = (zIndexOverrides) => {
    const zIndexInjection = zIndexOverrides || (vue.getCurrentInstance() ? vue.inject(zIndexContextKey, void 0) : void 0);
    const initialZIndex = vue.computed(() => {
      const zIndexFromInjection = vue.unref(zIndexInjection);
      return isNumber(zIndexFromInjection) ? zIndexFromInjection : defaultInitialZIndex;
    });
    const currentZIndex = vue.computed(() => initialZIndex.value + zIndex.value);
    const nextZIndex = () => {
      zIndex.value++;
      return currentZIndex.value;
    };
    return {
      initialZIndex,
      currentZIndex,
      nextZIndex
    };
  };

  function getSide(placement) {
    return placement.split('-')[0];
  }

  function getAlignment(placement) {
    return placement.split('-')[1];
  }

  function getMainAxisFromPlacement(placement) {
    return ['top', 'bottom'].includes(getSide(placement)) ? 'x' : 'y';
  }

  function getLengthFromAxis(axis) {
    return axis === 'y' ? 'height' : 'width';
  }

  function computeCoordsFromPlacement(_ref, placement, rtl) {
    let {
      reference,
      floating
    } = _ref;
    const commonX = reference.x + reference.width / 2 - floating.width / 2;
    const commonY = reference.y + reference.height / 2 - floating.height / 2;
    const mainAxis = getMainAxisFromPlacement(placement);
    const length = getLengthFromAxis(mainAxis);
    const commonAlign = reference[length] / 2 - floating[length] / 2;
    const side = getSide(placement);
    const isVertical = mainAxis === 'x';
    let coords;

    switch (side) {
      case 'top':
        coords = {
          x: commonX,
          y: reference.y - floating.height
        };
        break;

      case 'bottom':
        coords = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;

      case 'right':
        coords = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;

      case 'left':
        coords = {
          x: reference.x - floating.width,
          y: commonY
        };
        break;

      default:
        coords = {
          x: reference.x,
          y: reference.y
        };
    }

    switch (getAlignment(placement)) {
      case 'start':
        coords[mainAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
        break;

      case 'end':
        coords[mainAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
        break;
    }

    return coords;
  }

  /**
   * Computes the `x` and `y` coordinates that will place the floating element
   * next to a reference element when it is given a certain positioning strategy.
   *
   * This export does not have any `platform` interface logic. You will need to
   * write one for the platform you are using Floating UI with.
   */

  const computePosition$1 = async (reference, floating, config) => {
    const {
      placement = 'bottom',
      strategy = 'absolute',
      middleware = [],
      platform
    } = config;
    const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(floating));

    if (process.env.NODE_ENV !== "production") {
      if (platform == null) {
        console.error(['Floating UI: `platform` property was not passed to config. If you', 'want to use Floating UI on the web, install @floating-ui/dom', 'instead of the /core package. Otherwise, you can create your own', '`platform`: https://floating-ui.com/docs/platform'].join(' '));
      }

      if (middleware.filter(_ref => {
        let {
          name
        } = _ref;
        return name === 'autoPlacement' || name === 'flip';
      }).length > 1) {
        throw new Error(['Floating UI: duplicate `flip` and/or `autoPlacement`', 'middleware detected. This will lead to an infinite loop. Ensure only', 'one of either has been passed to the `middleware` array.'].join(' '));
      }
    }

    let rects = await platform.getElementRects({
      reference,
      floating,
      strategy
    });
    let {
      x,
      y
    } = computeCoordsFromPlacement(rects, placement, rtl);
    let statefulPlacement = placement;
    let middlewareData = {};
    let resetCount = 0;

    for (let i = 0; i < middleware.length; i++) {
      const {
        name,
        fn
      } = middleware[i];
      const {
        x: nextX,
        y: nextY,
        data,
        reset
      } = await fn({
        x,
        y,
        initialPlacement: placement,
        placement: statefulPlacement,
        strategy,
        middlewareData,
        rects,
        platform,
        elements: {
          reference,
          floating
        }
      });
      x = nextX != null ? nextX : x;
      y = nextY != null ? nextY : y;
      middlewareData = { ...middlewareData,
        [name]: { ...middlewareData[name],
          ...data
        }
      };

      if (process.env.NODE_ENV !== "production") {
        if (resetCount > 50) {
          console.warn(['Floating UI: The middleware lifecycle appears to be running in an', 'infinite loop. This is usually caused by a `reset` continually', 'being returned without a break condition.'].join(' '));
        }
      }

      if (reset && resetCount <= 50) {
        resetCount++;

        if (typeof reset === 'object') {
          if (reset.placement) {
            statefulPlacement = reset.placement;
          }

          if (reset.rects) {
            rects = reset.rects === true ? await platform.getElementRects({
              reference,
              floating,
              strategy
            }) : reset.rects;
          }

          ({
            x,
            y
          } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
        }

        i = -1;
        continue;
      }
    }

    return {
      x,
      y,
      placement: statefulPlacement,
      strategy,
      middlewareData
    };
  };

  function expandPaddingObject(padding) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...padding
    };
  }

  function getSideObjectFromPadding(padding) {
    return typeof padding !== 'number' ? expandPaddingObject(padding) : {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
  }

  function rectToClientRect(rect) {
    return { ...rect,
      top: rect.y,
      left: rect.x,
      right: rect.x + rect.width,
      bottom: rect.y + rect.height
    };
  }

  const min$2 = Math.min;
  const max$2 = Math.max;

  function within(min$1, value, max$1) {
    return max$2(min$1, min$2(value, max$1));
  }

  /**
   * Positions an inner element of the floating element such that it is centered
   * to the reference element.
   * @see https://floating-ui.com/docs/arrow
   */
  const arrow = options => ({
    name: 'arrow',
    options,

    async fn(middlewareArguments) {
      // Since `element` is required, we don't Partial<> the type
      const {
        element,
        padding = 0
      } = options != null ? options : {};
      const {
        x,
        y,
        placement,
        rects,
        platform
      } = middlewareArguments;

      if (element == null) {
        if (process.env.NODE_ENV !== "production") {
          console.warn('Floating UI: No `element` was passed to the `arrow` middleware.');
        }

        return {};
      }

      const paddingObject = getSideObjectFromPadding(padding);
      const coords = {
        x,
        y
      };
      const axis = getMainAxisFromPlacement(placement);
      const alignment = getAlignment(placement);
      const length = getLengthFromAxis(axis);
      const arrowDimensions = await platform.getDimensions(element);
      const minProp = axis === 'y' ? 'top' : 'left';
      const maxProp = axis === 'y' ? 'bottom' : 'right';
      const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
      const startDiff = coords[axis] - rects.reference[axis];
      const arrowOffsetParent = await (platform.getOffsetParent == null ? void 0 : platform.getOffsetParent(element));
      let clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;

      if (clientSize === 0) {
        clientSize = rects.floating[length];
      }

      const centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the floating element if the center
      // point is outside the floating element's bounds

      const min = paddingObject[minProp];
      const max = clientSize - arrowDimensions[length] - paddingObject[maxProp];
      const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
      const offset = within(min, center, max); // Make sure that arrow points at the reference

      const alignmentPadding = alignment === 'start' ? paddingObject[minProp] : paddingObject[maxProp];
      const shouldAddOffset = alignmentPadding > 0 && center !== offset && rects.reference[length] <= rects.floating[length];
      const alignmentOffset = shouldAddOffset ? center < min ? min - center : max - center : 0;
      return {
        [axis]: coords[axis] - alignmentOffset,
        data: {
          [axis]: offset,
          centerOffset: center - offset
        }
      };
    }

  });

  async function convertValueToCoords(middlewareArguments, value) {
    const {
      placement,
      platform,
      elements
    } = middlewareArguments;
    const rtl = await (platform.isRTL == null ? void 0 : platform.isRTL(elements.floating));
    const side = getSide(placement);
    const alignment = getAlignment(placement);
    const isVertical = getMainAxisFromPlacement(placement) === 'x';
    const mainAxisMulti = ['left', 'top'].includes(side) ? -1 : 1;
    const crossAxisMulti = rtl && isVertical ? -1 : 1;
    const rawValue = typeof value === 'function' ? value(middlewareArguments) : value; // eslint-disable-next-line prefer-const

    let {
      mainAxis,
      crossAxis,
      alignmentAxis
    } = typeof rawValue === 'number' ? {
      mainAxis: rawValue,
      crossAxis: 0,
      alignmentAxis: null
    } : {
      mainAxis: 0,
      crossAxis: 0,
      alignmentAxis: null,
      ...rawValue
    };

    if (alignment && typeof alignmentAxis === 'number') {
      crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
    }

    return isVertical ? {
      x: crossAxis * crossAxisMulti,
      y: mainAxis * mainAxisMulti
    } : {
      x: mainAxis * mainAxisMulti,
      y: crossAxis * crossAxisMulti
    };
  }
  /**
   * Displaces the floating element from its reference element.
   * @see https://floating-ui.com/docs/offset
   */

  const offset = function (value) {
    if (value === void 0) {
      value = 0;
    }

    return {
      name: 'offset',
      options: value,

      async fn(middlewareArguments) {
        const {
          x,
          y
        } = middlewareArguments;
        const diffCoords = await convertValueToCoords(middlewareArguments, value);
        return {
          x: x + diffCoords.x,
          y: y + diffCoords.y,
          data: diffCoords
        };
      }

    };
  };

  function isWindow(value) {
    return value && value.document && value.location && value.alert && value.setInterval;
  }
  function getWindow(node) {
    if (node == null) {
      return window;
    }

    if (!isWindow(node)) {
      const ownerDocument = node.ownerDocument;
      return ownerDocument ? ownerDocument.defaultView || window : window;
    }

    return node;
  }

  function getComputedStyle$1(element) {
    return getWindow(element).getComputedStyle(element);
  }

  function getNodeName(node) {
    return isWindow(node) ? '' : node ? (node.nodeName || '').toLowerCase() : '';
  }

  function getUAString() {
    const uaData = navigator.userAgentData;

    if (uaData != null && uaData.brands) {
      return uaData.brands.map(item => item.brand + "/" + item.version).join(' ');
    }

    return navigator.userAgent;
  }

  function isHTMLElement(value) {
    return value instanceof getWindow(value).HTMLElement;
  }
  function isElement(value) {
    return value instanceof getWindow(value).Element;
  }
  function isNode(value) {
    return value instanceof getWindow(value).Node;
  }
  function isShadowRoot(node) {
    // Browsers without `ShadowRoot` support
    if (typeof ShadowRoot === 'undefined') {
      return false;
    }

    const OwnElement = getWindow(node).ShadowRoot;
    return node instanceof OwnElement || node instanceof ShadowRoot;
  }
  function isOverflowElement(element) {
    // Firefox wants us to check `-x` and `-y` variations as well
    const {
      overflow,
      overflowX,
      overflowY
    } = getComputedStyle$1(element);
    return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
  }
  function isTableElement(element) {
    return ['table', 'td', 'th'].includes(getNodeName(element));
  }
  function isContainingBlock(element) {
    // TODO: Try and use feature detection here instead
    const isFirefox = /firefox/i.test(getUAString());
    const css = getComputedStyle$1(element); // This is non-exhaustive but covers the most common CSS properties that
    // create a containing block.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

    return css.transform !== 'none' || css.perspective !== 'none' || // @ts-ignore (TS 4.1 compat)
    css.contain === 'paint' || ['transform', 'perspective'].includes(css.willChange) || isFirefox && css.willChange === 'filter' || isFirefox && (css.filter ? css.filter !== 'none' : false);
  }
  function isLayoutViewport() {
    // Not Safari
    return !/^((?!chrome|android).)*safari/i.test(getUAString()); // Feature detection for this fails in various ways
    // • Always-visible scrollbar or not
    // • Width of <html>, etc.
    // const vV = win.visualViewport;
    // return vV ? Math.abs(win.innerWidth / vV.scale - vV.width) < 0.5 : true;
  }

  const min$1 = Math.min;
  const max$1 = Math.max;
  const round = Math.round;

  function getBoundingClientRect(element, includeScale, isFixedStrategy) {
    var _win$visualViewport$o, _win$visualViewport, _win$visualViewport$o2, _win$visualViewport2;

    if (includeScale === void 0) {
      includeScale = false;
    }

    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }

    const clientRect = element.getBoundingClientRect();
    let scaleX = 1;
    let scaleY = 1;

    if (includeScale && isHTMLElement(element)) {
      scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
      scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
    }

    const win = isElement(element) ? getWindow(element) : window;
    const addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
    const x = (clientRect.left + (addVisualOffsets ? (_win$visualViewport$o = (_win$visualViewport = win.visualViewport) == null ? void 0 : _win$visualViewport.offsetLeft) != null ? _win$visualViewport$o : 0 : 0)) / scaleX;
    const y = (clientRect.top + (addVisualOffsets ? (_win$visualViewport$o2 = (_win$visualViewport2 = win.visualViewport) == null ? void 0 : _win$visualViewport2.offsetTop) != null ? _win$visualViewport$o2 : 0 : 0)) / scaleY;
    const width = clientRect.width / scaleX;
    const height = clientRect.height / scaleY;
    return {
      width,
      height,
      top: y,
      right: x + width,
      bottom: y + height,
      left: x,
      x,
      y
    };
  }

  function getDocumentElement(node) {
    return ((isNode(node) ? node.ownerDocument : node.document) || window.document).documentElement;
  }

  function getNodeScroll(element) {
    if (isElement(element)) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }

    return {
      scrollLeft: element.pageXOffset,
      scrollTop: element.pageYOffset
    };
  }

  function getWindowScrollBarX(element) {
    // If <html> has a CSS width greater than the viewport, then this will be
    // incorrect for RTL.
    return getBoundingClientRect(getDocumentElement(element)).left + getNodeScroll(element).scrollLeft;
  }

  function isScaled(element) {
    const rect = getBoundingClientRect(element);
    return round(rect.width) !== element.offsetWidth || round(rect.height) !== element.offsetHeight;
  }

  function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    const documentElement = getDocumentElement(offsetParent);
    const rect = getBoundingClientRect(element, // @ts-ignore - checked above (TS 4.1 compat)
    isOffsetParentAnElement && isScaled(offsetParent), strategy === 'fixed');
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    const offsets = {
      x: 0,
      y: 0
    };

    if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== 'fixed') {
      if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }

      if (isHTMLElement(offsetParent)) {
        const offsetRect = getBoundingClientRect(offsetParent, true);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      } else if (documentElement) {
        offsets.x = getWindowScrollBarX(documentElement);
      }
    }

    return {
      x: rect.left + scroll.scrollLeft - offsets.x,
      y: rect.top + scroll.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height
    };
  }

  function getParentNode(node) {
    if (getNodeName(node) === 'html') {
      return node;
    }

    return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
      // @ts-ignore
      node.assignedSlot || // step into the shadow DOM of the parent of a slotted node
      node.parentNode || ( // DOM Element detected
      isShadowRoot(node) ? node.host : null) || // ShadowRoot detected
      getDocumentElement(node) // fallback

    );
  }

  function getTrueOffsetParent(element) {
    if (!isHTMLElement(element) || getComputedStyle$1(element).position === 'fixed') {
      return null;
    }

    return composedOffsetParent(element);
  }
  /**
   * Polyfills the old offsetParent behavior from before the spec was changed:
   * https://github.com/w3c/csswg-drafts/issues/159
   */


  function composedOffsetParent(element) {
    let {
      offsetParent
    } = element;
    let ancestor = element;
    let foundInsideSlot = false;

    while (ancestor && ancestor !== offsetParent) {
      const {
        assignedSlot
      } = ancestor;

      if (assignedSlot) {
        let newOffsetParent = assignedSlot.offsetParent;

        if (getComputedStyle$1(assignedSlot).display === 'contents') {
          const hadStyleAttribute = assignedSlot.hasAttribute('style');
          const oldDisplay = assignedSlot.style.display;
          assignedSlot.style.display = getComputedStyle$1(ancestor).display;
          newOffsetParent = assignedSlot.offsetParent;
          assignedSlot.style.display = oldDisplay;

          if (!hadStyleAttribute) {
            assignedSlot.removeAttribute('style');
          }
        }

        ancestor = assignedSlot;

        if (offsetParent !== newOffsetParent) {
          offsetParent = newOffsetParent;
          foundInsideSlot = true;
        }
      } else if (isShadowRoot(ancestor) && ancestor.host && foundInsideSlot) {
        break;
      }

      ancestor = isShadowRoot(ancestor) && ancestor.host || ancestor.parentNode;
    }

    return offsetParent;
  }

  function getContainingBlock(element) {
    let currentNode = getParentNode(element);

    if (isShadowRoot(currentNode)) {
      currentNode = currentNode.host;
    }

    while (isHTMLElement(currentNode) && !['html', 'body'].includes(getNodeName(currentNode))) {
      if (isContainingBlock(currentNode)) {
        return currentNode;
      } else {
        const parent = currentNode.parentNode;
        currentNode = isShadowRoot(parent) ? parent.host : parent;
      }
    }

    return null;
  } // Gets the closest ancestor positioned element. Handles some edge cases,
  // such as table ancestors and cross browser bugs.


  function getOffsetParent(element) {
    const window = getWindow(element);
    let offsetParent = getTrueOffsetParent(element);

    while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
      offsetParent = getTrueOffsetParent(offsetParent);
    }

    if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static' && !isContainingBlock(offsetParent))) {
      return window;
    }

    return offsetParent || getContainingBlock(element) || window;
  }

  function getDimensions(element) {
    if (isHTMLElement(element)) {
      return {
        width: element.offsetWidth,
        height: element.offsetHeight
      };
    }

    const rect = getBoundingClientRect(element);
    return {
      width: rect.width,
      height: rect.height
    };
  }

  function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
    let {
      rect,
      offsetParent,
      strategy
    } = _ref;
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    const documentElement = getDocumentElement(offsetParent);

    if (offsetParent === documentElement) {
      return rect;
    }

    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    const offsets = {
      x: 0,
      y: 0
    };

    if (isOffsetParentAnElement || !isOffsetParentAnElement && strategy !== 'fixed') {
      if (getNodeName(offsetParent) !== 'body' || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }

      if (isHTMLElement(offsetParent)) {
        const offsetRect = getBoundingClientRect(offsetParent, true);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      } // This doesn't appear to be need to be negated.
      // else if (documentElement) {
      //   offsets.x = getWindowScrollBarX(documentElement);
      // }

    }

    return { ...rect,
      x: rect.x - scroll.scrollLeft + offsets.x,
      y: rect.y - scroll.scrollTop + offsets.y
    };
  }

  function getViewportRect(element, strategy) {
    const win = getWindow(element);
    const html = getDocumentElement(element);
    const visualViewport = win.visualViewport;
    let width = html.clientWidth;
    let height = html.clientHeight;
    let x = 0;
    let y = 0;

    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      const layoutViewport = isLayoutViewport();

      if (layoutViewport || !layoutViewport && strategy === 'fixed') {
        x = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }

    return {
      width,
      height,
      x,
      y
    };
  }

  // of the `<html>` and `<body>` rect bounds if horizontally scrollable

  function getDocumentRect(element) {
    var _element$ownerDocumen;

    const html = getDocumentElement(element);
    const scroll = getNodeScroll(element);
    const body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
    const width = max$1(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
    const height = max$1(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
    let x = -scroll.scrollLeft + getWindowScrollBarX(element);
    const y = -scroll.scrollTop;

    if (getComputedStyle$1(body || html).direction === 'rtl') {
      x += max$1(html.clientWidth, body ? body.clientWidth : 0) - width;
    }

    return {
      width,
      height,
      x,
      y
    };
  }

  function getNearestOverflowAncestor(node) {
    const parentNode = getParentNode(node);

    if (['html', 'body', '#document'].includes(getNodeName(parentNode))) {
      // @ts-ignore assume body is always available
      return node.ownerDocument.body;
    }

    if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
      return parentNode;
    }

    return getNearestOverflowAncestor(parentNode);
  }

  function getOverflowAncestors(node, list) {
    var _node$ownerDocument;

    if (list === void 0) {
      list = [];
    }

    const scrollableAncestor = getNearestOverflowAncestor(node);
    const isBody = scrollableAncestor === ((_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.body);
    const win = getWindow(scrollableAncestor);
    const target = isBody ? [win].concat(win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : []) : scrollableAncestor;
    const updatedList = list.concat(target);
    return isBody ? updatedList : // @ts-ignore: isBody tells us target will be an HTMLElement here
    updatedList.concat(getOverflowAncestors(target));
  }

  function contains(parent, child) {
    const rootNode = child.getRootNode == null ? void 0 : child.getRootNode(); // First, attempt with faster native method

    if (parent.contains(child)) {
      return true;
    } // then fallback to custom implementation with Shadow DOM support
    else if (rootNode && isShadowRoot(rootNode)) {
      let next = child;

      do {
        // use `===` replace node.isSameNode()
        if (next && parent === next) {
          return true;
        } // @ts-ignore: need a better way to handle this...


        next = next.parentNode || next.host;
      } while (next);
    }

    return false;
  }

  function getInnerBoundingClientRect(element, strategy) {
    const clientRect = getBoundingClientRect(element, false, strategy === 'fixed');
    const top = clientRect.top + element.clientTop;
    const left = clientRect.left + element.clientLeft;
    return {
      top,
      left,
      x: left,
      y: top,
      right: left + element.clientWidth,
      bottom: top + element.clientHeight,
      width: element.clientWidth,
      height: element.clientHeight
    };
  }

  function getClientRectFromClippingAncestor(element, clippingParent, strategy) {
    if (clippingParent === 'viewport') {
      return rectToClientRect(getViewportRect(element, strategy));
    }

    if (isElement(clippingParent)) {
      return getInnerBoundingClientRect(clippingParent, strategy);
    }

    return rectToClientRect(getDocumentRect(getDocumentElement(element)));
  } // A "clipping ancestor" is an overflowable container with the characteristic of
  // clipping (or hiding) overflowing elements with a position different from
  // `initial`


  function getClippingAncestors(element) {
    const clippingAncestors = getOverflowAncestors(element);
    const canEscapeClipping = ['absolute', 'fixed'].includes(getComputedStyle$1(element).position);
    const clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

    if (!isElement(clipperElement)) {
      return [];
    } // @ts-ignore isElement check ensures we return Array<Element>


    return clippingAncestors.filter(clippingAncestors => isElement(clippingAncestors) && contains(clippingAncestors, clipperElement) && getNodeName(clippingAncestors) !== 'body');
  } // Gets the maximum area that the element is visible in due to any number of
  // clipping ancestors


  function getClippingRect(_ref) {
    let {
      element,
      boundary,
      rootBoundary,
      strategy
    } = _ref;
    const mainClippingAncestors = boundary === 'clippingAncestors' ? getClippingAncestors(element) : [].concat(boundary);
    const clippingAncestors = [...mainClippingAncestors, rootBoundary];
    const firstClippingAncestor = clippingAncestors[0];
    const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
      const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
      accRect.top = max$1(rect.top, accRect.top);
      accRect.right = min$1(rect.right, accRect.right);
      accRect.bottom = min$1(rect.bottom, accRect.bottom);
      accRect.left = max$1(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
    return {
      width: clippingRect.right - clippingRect.left,
      height: clippingRect.bottom - clippingRect.top,
      x: clippingRect.left,
      y: clippingRect.top
    };
  }

  const platform = {
    getClippingRect,
    convertOffsetParentRelativeRectToViewportRelativeRect,
    isElement,
    getDimensions,
    getOffsetParent,
    getDocumentElement,
    getElementRects: _ref => {
      let {
        reference,
        floating,
        strategy
      } = _ref;
      return {
        reference: getRectRelativeToOffsetParent(reference, getOffsetParent(floating), strategy),
        floating: { ...getDimensions(floating),
          x: 0,
          y: 0
        }
      };
    },
    getClientRects: element => Array.from(element.getClientRects()),
    isRTL: element => getComputedStyle$1(element).direction === 'rtl'
  };

  /**
   * Computes the `x` and `y` coordinates that will place the floating element
   * next to a reference element when it is given a certain CSS positioning
   * strategy.
   */

  const computePosition = (reference, floating, options) => computePosition$1(reference, floating, {
    platform,
    ...options
  });

  const useFloatingProps = buildProps({});
  const unrefReference = (elRef) => {
    if (!isClient)
      return;
    if (!elRef)
      return elRef;
    const unrefEl = unrefElement(elRef);
    if (unrefEl)
      return unrefEl;
    return vue.isRef(elRef) ? unrefEl : elRef;
  };
  const getPositionDataWithUnit = (record, key) => {
    const value = record == null ? void 0 : record[key];
    return isNil(value) ? "" : `${value}px`;
  };
  const useFloating = ({
    middleware,
    placement,
    strategy
  }) => {
    const referenceRef = vue.ref();
    const contentRef = vue.ref();
    const x = vue.ref();
    const y = vue.ref();
    const middlewareData = vue.ref({});
    const states = {
      x,
      y,
      placement,
      strategy,
      middlewareData
    };
    const update = async () => {
      if (!isClient)
        return;
      const referenceEl = unrefReference(referenceRef);
      const contentEl = unrefElement(contentRef);
      if (!referenceEl || !contentEl)
        return;
      const data = await computePosition(referenceEl, contentEl, {
        placement: vue.unref(placement),
        strategy: vue.unref(strategy),
        middleware: vue.unref(middleware)
      });
      keysOf(states).forEach((key) => {
        states[key].value = data[key];
      });
    };
    vue.onMounted(() => {
      vue.watchEffect(() => {
        update();
      });
    });
    return {
      ...states,
      update,
      referenceRef,
      contentRef
    };
  };
  const arrowMiddleware = ({
    arrowRef,
    padding
  }) => {
    return {
      name: "arrow",
      options: {
        element: arrowRef,
        padding
      },
      fn(args) {
        const arrowEl = vue.unref(arrowRef);
        if (!arrowEl)
          return {};
        return arrow({
          element: arrowEl,
          padding
        }).fn(args);
      }
    };
  };

  function useCursor(input) {
    const selectionRef = vue.ref();
    function recordCursor() {
      if (input.value == void 0)
        return;
      const { selectionStart, selectionEnd, value } = input.value;
      if (selectionStart == null || selectionEnd == null)
        return;
      const beforeTxt = value.slice(0, Math.max(0, selectionStart));
      const afterTxt = value.slice(Math.max(0, selectionEnd));
      selectionRef.value = {
        selectionStart,
        selectionEnd,
        value,
        beforeTxt,
        afterTxt
      };
    }
    function setCursor() {
      if (input.value == void 0 || selectionRef.value == void 0)
        return;
      const { value } = input.value;
      const { beforeTxt, afterTxt, selectionStart } = selectionRef.value;
      if (beforeTxt == void 0 || afterTxt == void 0 || selectionStart == void 0)
        return;
      let startPos = value.length;
      if (value.endsWith(afterTxt)) {
        startPos = value.length - afterTxt.length;
      } else if (value.startsWith(beforeTxt)) {
        startPos = beforeTxt.length;
      } else {
        const beforeLastChar = beforeTxt[selectionStart - 1];
        const newIndex = value.indexOf(beforeLastChar, selectionStart - 1);
        if (newIndex !== -1) {
          startPos = newIndex + 1;
        }
      }
      input.value.setSelectionRange(startPos, startPos);
    }
    return [recordCursor, setCursor];
  }

  const getOrderedChildren = (vm, childComponentName, children) => {
    const nodes = flattedChildren(vm.subTree).filter((n) => {
      var _a;
      return vue.isVNode(n) && ((_a = n.type) == null ? void 0 : _a.name) === childComponentName && !!n.component;
    });
    const uids = nodes.map((n) => n.component.uid);
    return uids.map((uid) => children[uid]).filter((p) => !!p);
  };
  const useOrderedChildren = (vm, childComponentName) => {
    const children = {};
    const orderedChildren = vue.shallowRef([]);
    const addChild = (child) => {
      children[child.uid] = child;
      orderedChildren.value = getOrderedChildren(vm, childComponentName, children);
    };
    const removeChild = (uid) => {
      delete children[uid];
      orderedChildren.value = orderedChildren.value.filter((children2) => children2.uid !== uid);
    };
    return {
      children: orderedChildren,
      addChild,
      removeChild
    };
  };

  const useSizeProp = buildProp({
    type: String,
    values: componentSizes,
    required: false
  });
  const useSizeProps = {
    size: useSizeProp
  };
  const SIZE_INJECTION_KEY = Symbol("size");
  const useGlobalSize = () => {
    const injectedSize = vue.inject(SIZE_INJECTION_KEY, {});
    return vue.computed(() => {
      return vue.unref(injectedSize.size) || "";
    });
  };

  function useFocusController(target, { afterFocus, beforeBlur, afterBlur } = {}) {
    const instance = vue.getCurrentInstance();
    const { emit } = instance;
    const wrapperRef = vue.shallowRef();
    const isFocused = vue.ref(false);
    const handleFocus = (event) => {
      if (isFocused.value)
        return;
      isFocused.value = true;
      emit("focus", event);
      afterFocus == null ? void 0 : afterFocus();
    };
    const handleBlur = (event) => {
      var _a;
      const cancelBlur = isFunction$1(beforeBlur) ? beforeBlur(event) : false;
      if (cancelBlur || event.relatedTarget && ((_a = wrapperRef.value) == null ? void 0 : _a.contains(event.relatedTarget)))
        return;
      isFocused.value = false;
      emit("blur", event);
      afterBlur == null ? void 0 : afterBlur();
    };
    const handleClick = () => {
      var _a;
      (_a = target.value) == null ? void 0 : _a.focus();
    };
    vue.watch(wrapperRef, (el) => {
      if (el) {
        el.setAttribute("tabindex", "-1");
      }
    });
    useEventListener(wrapperRef, "click", handleClick);
    return {
      wrapperRef,
      isFocused,
      handleFocus,
      handleBlur
    };
  }

  const configProviderContextKey = Symbol();

  const globalConfig = vue.ref();
  function useGlobalConfig(key, defaultValue = void 0) {
    const config = vue.getCurrentInstance() ? vue.inject(configProviderContextKey, globalConfig) : globalConfig;
    if (key) {
      return vue.computed(() => {
        var _a, _b;
        return (_b = (_a = config.value) == null ? void 0 : _a[key]) != null ? _b : defaultValue;
      });
    } else {
      return config;
    }
  }
  function useGlobalComponentSettings(block, sizeFallback) {
    const config = useGlobalConfig();
    const ns = useNamespace(block, vue.computed(() => {
      var _a;
      return ((_a = config.value) == null ? void 0 : _a.namespace) || defaultNamespace;
    }));
    const locale = useLocale(vue.computed(() => {
      var _a;
      return (_a = config.value) == null ? void 0 : _a.locale;
    }));
    const zIndex = useZIndex(vue.computed(() => {
      var _a;
      return ((_a = config.value) == null ? void 0 : _a.zIndex) || defaultInitialZIndex;
    }));
    const size = vue.computed(() => {
      var _a;
      return vue.unref(sizeFallback) || ((_a = config.value) == null ? void 0 : _a.size) || "";
    });
    provideGlobalConfig(vue.computed(() => vue.unref(config) || {}));
    return {
      ns,
      locale,
      zIndex,
      size
    };
  }
  const provideGlobalConfig = (config, app, global = false) => {
    var _a;
    const inSetup = !!vue.getCurrentInstance();
    const oldConfig = inSetup ? useGlobalConfig() : void 0;
    const provideFn = (_a = app == null ? void 0 : app.provide) != null ? _a : inSetup ? vue.provide : void 0;
    if (!provideFn) {
      return;
    }
    const context = vue.computed(() => {
      const cfg = vue.unref(config);
      if (!(oldConfig == null ? void 0 : oldConfig.value))
        return cfg;
      return mergeConfig(oldConfig.value, cfg);
    });
    provideFn(configProviderContextKey, context);
    provideFn(localeContextKey, vue.computed(() => context.value.locale));
    provideFn(namespaceContextKey, vue.computed(() => context.value.namespace));
    provideFn(zIndexContextKey, vue.computed(() => context.value.zIndex));
    provideFn(SIZE_INJECTION_KEY, {
      size: vue.computed(() => context.value.size || "")
    });
    if (global || !globalConfig.value) {
      globalConfig.value = context.value;
    }
    return context;
  };
  const mergeConfig = (a, b) => {
    var _a;
    const keys = [.../* @__PURE__ */ new Set([...keysOf(a), ...keysOf(b)])];
    const obj = {};
    for (const key of keys) {
      obj[key] = (_a = b[key]) != null ? _a : a[key];
    }
    return obj;
  };

  const configProviderProps = buildProps({
    a11y: {
      type: Boolean,
      default: true
    },
    locale: {
      type: definePropType(Object)
    },
    size: useSizeProp,
    button: {
      type: definePropType(Object)
    },
    experimentalFeatures: {
      type: definePropType(Object)
    },
    keyboardNavigation: {
      type: Boolean,
      default: true
    },
    message: {
      type: definePropType(Object)
    },
    zIndex: Number,
    namespace: {
      type: String,
      default: "el"
    }
  });

  const messageConfig = {};
  const ConfigProvider = vue.defineComponent({
    name: "ElConfigProvider",
    props: configProviderProps,
    setup(props, { slots }) {
      vue.watch(() => props.message, (val) => {
        Object.assign(messageConfig, val != null ? val : {});
      }, { immediate: true, deep: true });
      const config = provideGlobalConfig(props);
      return () => vue.renderSlot(slots, "default", { config: config == null ? void 0 : config.value });
    }
  });

  const ElConfigProvider = withInstall(ConfigProvider);

  const version$1 = "2.4.4";

  const makeInstaller = (components = []) => {
    const install = (app, options) => {
      if (app[INSTALLED_KEY])
        return;
      app[INSTALLED_KEY] = true;
      components.forEach((c) => app.use(c));
      if (options)
        provideGlobalConfig(options, app, true);
    };
    return {
      version: version$1,
      install
    };
  };

  const affixProps = buildProps({
    zIndex: {
      type: definePropType([Number, String]),
      default: 100
    },
    target: {
      type: String,
      default: ""
    },
    offset: {
      type: Number,
      default: 0
    },
    position: {
      type: String,
      values: ["top", "bottom"],
      default: "top"
    }
  });
  const affixEmits = {
    scroll: ({ scrollTop, fixed }) => isNumber(scrollTop) && isBoolean(fixed),
    [CHANGE_EVENT]: (fixed) => isBoolean(fixed)
  };

  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };

  const COMPONENT_NAME$n = "ElAffix";
  const __default__$1D = vue.defineComponent({
    name: COMPONENT_NAME$n
  });
  const _sfc_main$2j = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1D,
    props: affixProps,
    emits: affixEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const ns = useNamespace("affix");
      const target = vue.shallowRef();
      const root = vue.shallowRef();
      const scrollContainer = vue.shallowRef();
      const { height: windowHeight } = useWindowSize();
      const {
        height: rootHeight,
        width: rootWidth,
        top: rootTop,
        bottom: rootBottom,
        update: updateRoot
      } = useElementBounding(root, { windowScroll: false });
      const targetRect = useElementBounding(target);
      const fixed = vue.ref(false);
      const scrollTop = vue.ref(0);
      const transform = vue.ref(0);
      const rootStyle = vue.computed(() => {
        return {
          height: fixed.value ? `${rootHeight.value}px` : "",
          width: fixed.value ? `${rootWidth.value}px` : ""
        };
      });
      const affixStyle = vue.computed(() => {
        if (!fixed.value)
          return {};
        const offset = props.offset ? addUnit(props.offset) : 0;
        return {
          height: `${rootHeight.value}px`,
          width: `${rootWidth.value}px`,
          top: props.position === "top" ? offset : "",
          bottom: props.position === "bottom" ? offset : "",
          transform: transform.value ? `translateY(${transform.value}px)` : "",
          zIndex: props.zIndex
        };
      });
      const update = () => {
        if (!scrollContainer.value)
          return;
        scrollTop.value = scrollContainer.value instanceof Window ? document.documentElement.scrollTop : scrollContainer.value.scrollTop || 0;
        if (props.position === "top") {
          if (props.target) {
            const difference = targetRect.bottom.value - props.offset - rootHeight.value;
            fixed.value = props.offset > rootTop.value && targetRect.bottom.value > 0;
            transform.value = difference < 0 ? difference : 0;
          } else {
            fixed.value = props.offset > rootTop.value;
          }
        } else if (props.target) {
          const difference = windowHeight.value - targetRect.top.value - props.offset - rootHeight.value;
          fixed.value = windowHeight.value - props.offset < rootBottom.value && windowHeight.value > targetRect.top.value;
          transform.value = difference < 0 ? -difference : 0;
        } else {
          fixed.value = windowHeight.value - props.offset < rootBottom.value;
        }
      };
      const handleScroll = () => {
        updateRoot();
        emit("scroll", {
          scrollTop: scrollTop.value,
          fixed: fixed.value
        });
      };
      vue.watch(fixed, (val) => emit("change", val));
      vue.onMounted(() => {
        var _a;
        if (props.target) {
          target.value = (_a = document.querySelector(props.target)) != null ? _a : void 0;
          if (!target.value)
            throwError(COMPONENT_NAME$n, `Target is not existed: ${props.target}`);
        } else {
          target.value = document.documentElement;
        }
        scrollContainer.value = getScrollContainer(root.value, true);
        updateRoot();
      });
      useEventListener(scrollContainer, "scroll", handleScroll);
      vue.watchEffect(update);
      expose({
        update,
        updateRoot
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "root",
          ref: root,
          class: vue.normalizeClass(vue.unref(ns).b()),
          style: vue.normalizeStyle(vue.unref(rootStyle))
        }, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass({ [vue.unref(ns).m("fixed")]: fixed.value }),
            style: vue.normalizeStyle(vue.unref(affixStyle))
          }, [
            vue.renderSlot(_ctx.$slots, "default")
          ], 6)
        ], 6);
      };
    }
  });
  var Affix = /* @__PURE__ */ _export_sfc(_sfc_main$2j, [["__file", "affix.vue"]]);

  const ElAffix = withInstall(Affix);

  const iconProps = buildProps({
    size: {
      type: definePropType([Number, String])
    },
    color: {
      type: String
    }
  });

  const __default__$1C = vue.defineComponent({
    name: "ElIcon",
    inheritAttrs: false
  });
  const _sfc_main$2i = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1C,
    props: iconProps,
    setup(__props) {
      const props = __props;
      const ns = useNamespace("icon");
      const style = vue.computed(() => {
        const { size, color } = props;
        if (!size && !color)
          return {};
        return {
          fontSize: isUndefined(size) ? void 0 : addUnit(size),
          "--color": color
        };
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("i", vue.mergeProps({
          class: vue.unref(ns).b(),
          style: vue.unref(style)
        }, _ctx.$attrs), [
          vue.renderSlot(_ctx.$slots, "default")
        ], 16);
      };
    }
  });
  var Icon = /* @__PURE__ */ _export_sfc(_sfc_main$2i, [["__file", "icon.vue"]]);

  const ElIcon = withInstall(Icon);

  const alertEffects = ["light", "dark"];
  const alertProps = buildProps({
    title: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      values: keysOf(TypeComponentsMap),
      default: "info"
    },
    closable: {
      type: Boolean,
      default: true
    },
    closeText: {
      type: String,
      default: ""
    },
    showIcon: Boolean,
    center: Boolean,
    effect: {
      type: String,
      values: alertEffects,
      default: "light"
    }
  });
  const alertEmits = {
    close: (evt) => evt instanceof MouseEvent
  };

  const __default__$1B = vue.defineComponent({
    name: "ElAlert"
  });
  const _sfc_main$2h = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1B,
    props: alertProps,
    emits: alertEmits,
    setup(__props, { emit }) {
      const props = __props;
      const { Close } = TypeComponents;
      const slots = vue.useSlots();
      const ns = useNamespace("alert");
      const visible = vue.ref(true);
      const iconComponent = vue.computed(() => TypeComponentsMap[props.type]);
      const iconClass = vue.computed(() => [
        ns.e("icon"),
        { [ns.is("big")]: !!props.description || !!slots.default }
      ]);
      const isBoldTitle = vue.computed(() => {
        return { [ns.is("bold")]: props.description || slots.default };
      });
      const close = (evt) => {
        visible.value = false;
        emit("close", evt);
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, {
          name: vue.unref(ns).b("fade"),
          persisted: ""
        }, {
          default: vue.withCtx(() => [
            vue.withDirectives(vue.createElementVNode("div", {
              class: vue.normalizeClass([vue.unref(ns).b(), vue.unref(ns).m(_ctx.type), vue.unref(ns).is("center", _ctx.center), vue.unref(ns).is(_ctx.effect)]),
              role: "alert"
            }, [
              _ctx.showIcon && vue.unref(iconComponent) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                key: 0,
                class: vue.normalizeClass(vue.unref(iconClass))
              }, {
                default: vue.withCtx(() => [
                  (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(iconComponent))))
                ]),
                _: 1
              }, 8, ["class"])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(vue.unref(ns).e("content"))
              }, [
                _ctx.title || _ctx.$slots.title ? (vue.openBlock(), vue.createElementBlock("span", {
                  key: 0,
                  class: vue.normalizeClass([vue.unref(ns).e("title"), vue.unref(isBoldTitle)])
                }, [
                  vue.renderSlot(_ctx.$slots, "title", {}, () => [
                    vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
                  ])
                ], 2)) : vue.createCommentVNode("v-if", true),
                _ctx.$slots.default || _ctx.description ? (vue.openBlock(), vue.createElementBlock("p", {
                  key: 1,
                  class: vue.normalizeClass(vue.unref(ns).e("description"))
                }, [
                  vue.renderSlot(_ctx.$slots, "default", {}, () => [
                    vue.createTextVNode(vue.toDisplayString(_ctx.description), 1)
                  ])
                ], 2)) : vue.createCommentVNode("v-if", true),
                _ctx.closable ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 2 }, [
                  _ctx.closeText ? (vue.openBlock(), vue.createElementBlock("div", {
                    key: 0,
                    class: vue.normalizeClass([vue.unref(ns).e("close-btn"), vue.unref(ns).is("customed")]),
                    onClick: close
                  }, vue.toDisplayString(_ctx.closeText), 3)) : (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 1,
                    class: vue.normalizeClass(vue.unref(ns).e("close-btn")),
                    onClick: close
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(Close))
                    ]),
                    _: 1
                  }, 8, ["class"]))
                ], 64)) : vue.createCommentVNode("v-if", true)
              ], 2)
            ], 2), [
              [vue.vShow, visible.value]
            ])
          ]),
          _: 3
        }, 8, ["name"]);
      };
    }
  });
  var Alert = /* @__PURE__ */ _export_sfc(_sfc_main$2h, [["__file", "alert.vue"]]);

  const ElAlert = withInstall(Alert);

  const formContextKey = Symbol("formContextKey");
  const formItemContextKey = Symbol("formItemContextKey");

  const useFormSize = (fallback, ignore = {}) => {
    const emptyRef = vue.ref(void 0);
    const size = ignore.prop ? emptyRef : useProp("size");
    const globalConfig = ignore.global ? emptyRef : useGlobalSize();
    const form = ignore.form ? { size: void 0 } : vue.inject(formContextKey, void 0);
    const formItem = ignore.formItem ? { size: void 0 } : vue.inject(formItemContextKey, void 0);
    return vue.computed(() => size.value || vue.unref(fallback) || (formItem == null ? void 0 : formItem.size) || (form == null ? void 0 : form.size) || globalConfig.value || "");
  };
  const useFormDisabled = (fallback) => {
    const disabled = useProp("disabled");
    const form = vue.inject(formContextKey, void 0);
    return vue.computed(() => disabled.value || vue.unref(fallback) || (form == null ? void 0 : form.disabled) || false);
  };
  const useSize = useFormSize;
  const useDisabled = useFormDisabled;

  const useFormItem = () => {
    const form = vue.inject(formContextKey, void 0);
    const formItem = vue.inject(formItemContextKey, void 0);
    return {
      form,
      formItem
    };
  };
  const useFormItemInputId = (props, {
    formItemContext,
    disableIdGeneration,
    disableIdManagement
  }) => {
    if (!disableIdGeneration) {
      disableIdGeneration = vue.ref(false);
    }
    if (!disableIdManagement) {
      disableIdManagement = vue.ref(false);
    }
    const inputId = vue.ref();
    let idUnwatch = void 0;
    const isLabeledByFormItem = vue.computed(() => {
      var _a;
      return !!(!props.label && formItemContext && formItemContext.inputIds && ((_a = formItemContext.inputIds) == null ? void 0 : _a.length) <= 1);
    });
    vue.onMounted(() => {
      idUnwatch = vue.watch([vue.toRef(props, "id"), disableIdGeneration], ([id, disableIdGeneration2]) => {
        const newId = id != null ? id : !disableIdGeneration2 ? useId().value : void 0;
        if (newId !== inputId.value) {
          if (formItemContext == null ? void 0 : formItemContext.removeInputId) {
            inputId.value && formItemContext.removeInputId(inputId.value);
            if (!(disableIdManagement == null ? void 0 : disableIdManagement.value) && !disableIdGeneration2 && newId) {
              formItemContext.addInputId(newId);
            }
          }
          inputId.value = newId;
        }
      }, { immediate: true });
    });
    vue.onUnmounted(() => {
      idUnwatch && idUnwatch();
      if (formItemContext == null ? void 0 : formItemContext.removeInputId) {
        inputId.value && formItemContext.removeInputId(inputId.value);
      }
    });
    return {
      isLabeledByFormItem,
      inputId
    };
  };

  const formMetaProps = buildProps({
    size: {
      type: String,
      values: componentSizes
    },
    disabled: Boolean
  });
  const formProps = buildProps({
    ...formMetaProps,
    model: Object,
    rules: {
      type: definePropType(Object)
    },
    labelPosition: {
      type: String,
      values: ["left", "right", "top"],
      default: "right"
    },
    requireAsteriskPosition: {
      type: String,
      values: ["left", "right"],
      default: "left"
    },
    labelWidth: {
      type: [String, Number],
      default: ""
    },
    labelSuffix: {
      type: String,
      default: ""
    },
    inline: Boolean,
    inlineMessage: Boolean,
    statusIcon: Boolean,
    showMessage: {
      type: Boolean,
      default: true
    },
    validateOnRuleChange: {
      type: Boolean,
      default: true
    },
    hideRequiredAsterisk: Boolean,
    scrollToError: Boolean,
    scrollIntoViewOptions: {
      type: [Object, Boolean]
    }
  });
  const formEmits = {
    validate: (prop, isValid, message) => (isArray$1(prop) || isString$1(prop)) && isBoolean(isValid) && isString$1(message)
  };

  function useFormLabelWidth() {
    const potentialLabelWidthArr = vue.ref([]);
    const autoLabelWidth = vue.computed(() => {
      if (!potentialLabelWidthArr.value.length)
        return "0";
      const max = Math.max(...potentialLabelWidthArr.value);
      return max ? `${max}px` : "";
    });
    function getLabelWidthIndex(width) {
      const index = potentialLabelWidthArr.value.indexOf(width);
      if (index === -1 && autoLabelWidth.value === "0") ;
      return index;
    }
    function registerLabelWidth(val, oldVal) {
      if (val && oldVal) {
        const index = getLabelWidthIndex(oldVal);
        potentialLabelWidthArr.value.splice(index, 1, val);
      } else if (val) {
        potentialLabelWidthArr.value.push(val);
      }
    }
    function deregisterLabelWidth(val) {
      const index = getLabelWidthIndex(val);
      if (index > -1) {
        potentialLabelWidthArr.value.splice(index, 1);
      }
    }
    return {
      autoLabelWidth,
      registerLabelWidth,
      deregisterLabelWidth
    };
  }
  const filterFields = (fields, props) => {
    const normalized = castArray$1(props);
    return normalized.length > 0 ? fields.filter((field) => field.prop && normalized.includes(field.prop)) : fields;
  };

  const COMPONENT_NAME$m = "ElForm";
  const __default__$1A = vue.defineComponent({
    name: COMPONENT_NAME$m
  });
  const _sfc_main$2g = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1A,
    props: formProps,
    emits: formEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const fields = [];
      const formSize = useFormSize();
      const ns = useNamespace("form");
      const formClasses = vue.computed(() => {
        const { labelPosition, inline } = props;
        return [
          ns.b(),
          ns.m(formSize.value || "default"),
          {
            [ns.m(`label-${labelPosition}`)]: labelPosition,
            [ns.m("inline")]: inline
          }
        ];
      });
      const addField = (field) => {
        fields.push(field);
      };
      const removeField = (field) => {
        if (field.prop) {
          fields.splice(fields.indexOf(field), 1);
        }
      };
      const resetFields = (properties = []) => {
        if (!props.model) {
          return;
        }
        filterFields(fields, properties).forEach((field) => field.resetField());
      };
      const clearValidate = (props2 = []) => {
        filterFields(fields, props2).forEach((field) => field.clearValidate());
      };
      const isValidatable = vue.computed(() => {
        const hasModel = !!props.model;
        return hasModel;
      });
      const obtainValidateFields = (props2) => {
        if (fields.length === 0)
          return [];
        const filteredFields = filterFields(fields, props2);
        if (!filteredFields.length) {
          return [];
        }
        return filteredFields;
      };
      const validate = async (callback) => validateField(void 0, callback);
      const doValidateField = async (props2 = []) => {
        if (!isValidatable.value)
          return false;
        const fields2 = obtainValidateFields(props2);
        if (fields2.length === 0)
          return true;
        let validationErrors = {};
        for (const field of fields2) {
          try {
            await field.validate("");
          } catch (fields3) {
            validationErrors = {
              ...validationErrors,
              ...fields3
            };
          }
        }
        if (Object.keys(validationErrors).length === 0)
          return true;
        return Promise.reject(validationErrors);
      };
      const validateField = async (modelProps = [], callback) => {
        const shouldThrow = !isFunction$1(callback);
        try {
          const result = await doValidateField(modelProps);
          if (result === true) {
            callback == null ? void 0 : callback(result);
          }
          return result;
        } catch (e) {
          if (e instanceof Error)
            throw e;
          const invalidFields = e;
          if (props.scrollToError) {
            scrollToField(Object.keys(invalidFields)[0]);
          }
          callback == null ? void 0 : callback(false, invalidFields);
          return shouldThrow && Promise.reject(invalidFields);
        }
      };
      const scrollToField = (prop) => {
        var _a;
        const field = filterFields(fields, prop)[0];
        if (field) {
          (_a = field.$el) == null ? void 0 : _a.scrollIntoView(props.scrollIntoViewOptions);
        }
      };
      vue.watch(() => props.rules, () => {
        if (props.validateOnRuleChange) {
          validate().catch((err) => debugWarn());
        }
      }, { deep: true });
      vue.provide(formContextKey, vue.reactive({
        ...vue.toRefs(props),
        emit,
        resetFields,
        clearValidate,
        validateField,
        addField,
        removeField,
        ...useFormLabelWidth()
      }));
      expose({
        validate,
        validateField,
        resetFields,
        clearValidate,
        scrollToField
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("form", {
          class: vue.normalizeClass(vue.unref(formClasses))
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 2);
      };
    }
  });
  var Form = /* @__PURE__ */ _export_sfc(_sfc_main$2g, [["__file", "form.vue"]]);

  function _extends() {
    _extends = Object.assign ? Object.assign.bind() : function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
    return _extends.apply(this, arguments);
  }
  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    _setPrototypeOf(subClass, superClass);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
      return o2.__proto__ || Object.getPrototypeOf(o2);
    };
    return _getPrototypeOf(o);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct)
      return false;
    if (Reflect.construct.sham)
      return false;
    if (typeof Proxy === "function")
      return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct.bind();
    } else {
      _construct = function _construct2(Parent2, args2, Class2) {
        var a = [null];
        a.push.apply(a, args2);
        var Constructor = Function.bind.apply(Parent2, a);
        var instance = new Constructor();
        if (Class2)
          _setPrototypeOf(instance, Class2.prototype);
        return instance;
      };
    }
    return _construct.apply(null, arguments);
  }
  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }
  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
    _wrapNativeSuper = function _wrapNativeSuper2(Class2) {
      if (Class2 === null || !_isNativeFunction(Class2))
        return Class2;
      if (typeof Class2 !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }
      if (typeof _cache !== "undefined") {
        if (_cache.has(Class2))
          return _cache.get(Class2);
        _cache.set(Class2, Wrapper);
      }
      function Wrapper() {
        return _construct(Class2, arguments, _getPrototypeOf(this).constructor);
      }
      Wrapper.prototype = Object.create(Class2.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class2);
    };
    return _wrapNativeSuper(Class);
  }
  var formatRegExp = /%[sdj%]/g;
  var warning = function warning2() {
  };
  if (typeof process !== "undefined" && process.env && false) {
    warning = function warning3(type4, errors) {
      if (typeof console !== "undefined" && console.warn && typeof ASYNC_VALIDATOR_NO_WARNING === "undefined") {
        if (errors.every(function(e) {
          return typeof e === "string";
        })) {
          console.warn(type4, errors);
        }
      }
    };
  }
  function convertFieldsError(errors) {
    if (!errors || !errors.length)
      return null;
    var fields = {};
    errors.forEach(function(error) {
      var field = error.field;
      fields[field] = fields[field] || [];
      fields[field].push(error);
    });
    return fields;
  }
  function format(template) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    var i = 0;
    var len = args.length;
    if (typeof template === "function") {
      return template.apply(null, args);
    }
    if (typeof template === "string") {
      var str = template.replace(formatRegExp, function(x) {
        if (x === "%%") {
          return "%";
        }
        if (i >= len) {
          return x;
        }
        switch (x) {
          case "%s":
            return String(args[i++]);
          case "%d":
            return Number(args[i++]);
          case "%j":
            try {
              return JSON.stringify(args[i++]);
            } catch (_) {
              return "[Circular]";
            }
            break;
          default:
            return x;
        }
      });
      return str;
    }
    return template;
  }
  function isNativeStringType(type4) {
    return type4 === "string" || type4 === "url" || type4 === "hex" || type4 === "email" || type4 === "date" || type4 === "pattern";
  }
  function isEmptyValue(value, type4) {
    if (value === void 0 || value === null) {
      return true;
    }
    if (type4 === "array" && Array.isArray(value) && !value.length) {
      return true;
    }
    if (isNativeStringType(type4) && typeof value === "string" && !value) {
      return true;
    }
    return false;
  }
  function asyncParallelArray(arr, func, callback) {
    var results = [];
    var total = 0;
    var arrLength = arr.length;
    function count(errors) {
      results.push.apply(results, errors || []);
      total++;
      if (total === arrLength) {
        callback(results);
      }
    }
    arr.forEach(function(a) {
      func(a, count);
    });
  }
  function asyncSerialArray(arr, func, callback) {
    var index = 0;
    var arrLength = arr.length;
    function next(errors) {
      if (errors && errors.length) {
        callback(errors);
        return;
      }
      var original = index;
      index = index + 1;
      if (original < arrLength) {
        func(arr[original], next);
      } else {
        callback([]);
      }
    }
    next([]);
  }
  function flattenObjArr(objArr) {
    var ret = [];
    Object.keys(objArr).forEach(function(k) {
      ret.push.apply(ret, objArr[k] || []);
    });
    return ret;
  }
  var AsyncValidationError = /* @__PURE__ */ function(_Error) {
    _inheritsLoose(AsyncValidationError2, _Error);
    function AsyncValidationError2(errors, fields) {
      var _this;
      _this = _Error.call(this, "Async Validation Error") || this;
      _this.errors = errors;
      _this.fields = fields;
      return _this;
    }
    return AsyncValidationError2;
  }(/* @__PURE__ */ _wrapNativeSuper(Error));
  function asyncMap(objArr, option, func, callback, source) {
    if (option.first) {
      var _pending = new Promise(function(resolve, reject) {
        var next = function next2(errors) {
          callback(errors);
          return errors.length ? reject(new AsyncValidationError(errors, convertFieldsError(errors))) : resolve(source);
        };
        var flattenArr = flattenObjArr(objArr);
        asyncSerialArray(flattenArr, func, next);
      });
      _pending["catch"](function(e) {
        return e;
      });
      return _pending;
    }
    var firstFields = option.firstFields === true ? Object.keys(objArr) : option.firstFields || [];
    var objArrKeys = Object.keys(objArr);
    var objArrLength = objArrKeys.length;
    var total = 0;
    var results = [];
    var pending = new Promise(function(resolve, reject) {
      var next = function next2(errors) {
        results.push.apply(results, errors);
        total++;
        if (total === objArrLength) {
          callback(results);
          return results.length ? reject(new AsyncValidationError(results, convertFieldsError(results))) : resolve(source);
        }
      };
      if (!objArrKeys.length) {
        callback(results);
        resolve(source);
      }
      objArrKeys.forEach(function(key) {
        var arr = objArr[key];
        if (firstFields.indexOf(key) !== -1) {
          asyncSerialArray(arr, func, next);
        } else {
          asyncParallelArray(arr, func, next);
        }
      });
    });
    pending["catch"](function(e) {
      return e;
    });
    return pending;
  }
  function isErrorObj(obj) {
    return !!(obj && obj.message !== void 0);
  }
  function getValue(value, path) {
    var v = value;
    for (var i = 0; i < path.length; i++) {
      if (v == void 0) {
        return v;
      }
      v = v[path[i]];
    }
    return v;
  }
  function complementError(rule, source) {
    return function(oe) {
      var fieldValue;
      if (rule.fullFields) {
        fieldValue = getValue(source, rule.fullFields);
      } else {
        fieldValue = source[oe.field || rule.fullField];
      }
      if (isErrorObj(oe)) {
        oe.field = oe.field || rule.fullField;
        oe.fieldValue = fieldValue;
        return oe;
      }
      return {
        message: typeof oe === "function" ? oe() : oe,
        fieldValue,
        field: oe.field || rule.fullField
      };
    };
  }
  function deepMerge(target, source) {
    if (source) {
      for (var s in source) {
        if (source.hasOwnProperty(s)) {
          var value = source[s];
          if (typeof value === "object" && typeof target[s] === "object") {
            target[s] = _extends({}, target[s], value);
          } else {
            target[s] = value;
          }
        }
      }
    }
    return target;
  }
  var required$1 = function required(rule, value, source, errors, options, type4) {
    if (rule.required && (!source.hasOwnProperty(rule.field) || isEmptyValue(value, type4 || rule.type))) {
      errors.push(format(options.messages.required, rule.fullField));
    }
  };
  var whitespace = function whitespace2(rule, value, source, errors, options) {
    if (/^\s+$/.test(value) || value === "") {
      errors.push(format(options.messages.whitespace, rule.fullField));
    }
  };
  var urlReg;
  var getUrlRegex = function() {
    if (urlReg) {
      return urlReg;
    }
    var word = "[a-fA-F\\d:]";
    var b = function b2(options) {
      return options && options.includeBoundaries ? "(?:(?<=\\s|^)(?=" + word + ")|(?<=" + word + ")(?=\\s|$))" : "";
    };
    var v4 = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
    var v6seg = "[a-fA-F\\d]{1,4}";
    var v6 = ("\n(?:\n(?:" + v6seg + ":){7}(?:" + v6seg + "|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8\n(?:" + v6seg + ":){6}(?:" + v4 + "|:" + v6seg + "|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4\n(?:" + v6seg + ":){5}(?::" + v4 + "|(?::" + v6seg + "){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4\n(?:" + v6seg + ":){4}(?:(?::" + v6seg + "){0,1}:" + v4 + "|(?::" + v6seg + "){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4\n(?:" + v6seg + ":){3}(?:(?::" + v6seg + "){0,2}:" + v4 + "|(?::" + v6seg + "){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4\n(?:" + v6seg + ":){2}(?:(?::" + v6seg + "){0,3}:" + v4 + "|(?::" + v6seg + "){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4\n(?:" + v6seg + ":){1}(?:(?::" + v6seg + "){0,4}:" + v4 + "|(?::" + v6seg + "){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4\n(?::(?:(?::" + v6seg + "){0,5}:" + v4 + "|(?::" + v6seg + "){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4\n)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1\n").replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
    var v46Exact = new RegExp("(?:^" + v4 + "$)|(?:^" + v6 + "$)");
    var v4exact = new RegExp("^" + v4 + "$");
    var v6exact = new RegExp("^" + v6 + "$");
    var ip = function ip2(options) {
      return options && options.exact ? v46Exact : new RegExp("(?:" + b(options) + v4 + b(options) + ")|(?:" + b(options) + v6 + b(options) + ")", "g");
    };
    ip.v4 = function(options) {
      return options && options.exact ? v4exact : new RegExp("" + b(options) + v4 + b(options), "g");
    };
    ip.v6 = function(options) {
      return options && options.exact ? v6exact : new RegExp("" + b(options) + v6 + b(options), "g");
    };
    var protocol = "(?:(?:[a-z]+:)?//)";
    var auth = "(?:\\S+(?::\\S*)?@)?";
    var ipv4 = ip.v4().source;
    var ipv6 = ip.v6().source;
    var host = "(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)";
    var domain = "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*";
    var tld = "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))";
    var port = "(?::\\d{2,5})?";
    var path = '(?:[/?#][^\\s"]*)?';
    var regex = "(?:" + protocol + "|www\\.)" + auth + "(?:localhost|" + ipv4 + "|" + ipv6 + "|" + host + domain + tld + ")" + port + path;
    urlReg = new RegExp("(?:^" + regex + "$)", "i");
    return urlReg;
  };
  var pattern$2 = {
    email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,
    hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
  };
  var types = {
    integer: function integer(value) {
      return types.number(value) && parseInt(value, 10) === value;
    },
    "float": function float(value) {
      return types.number(value) && !types.integer(value);
    },
    array: function array(value) {
      return Array.isArray(value);
    },
    regexp: function regexp(value) {
      if (value instanceof RegExp) {
        return true;
      }
      try {
        return !!new RegExp(value);
      } catch (e) {
        return false;
      }
    },
    date: function date(value) {
      return typeof value.getTime === "function" && typeof value.getMonth === "function" && typeof value.getYear === "function" && !isNaN(value.getTime());
    },
    number: function number(value) {
      if (isNaN(value)) {
        return false;
      }
      return typeof value === "number";
    },
    object: function object(value) {
      return typeof value === "object" && !types.array(value);
    },
    method: function method(value) {
      return typeof value === "function";
    },
    email: function email(value) {
      return typeof value === "string" && value.length <= 320 && !!value.match(pattern$2.email);
    },
    url: function url(value) {
      return typeof value === "string" && value.length <= 2048 && !!value.match(getUrlRegex());
    },
    hex: function hex(value) {
      return typeof value === "string" && !!value.match(pattern$2.hex);
    }
  };
  var type$1 = function type(rule, value, source, errors, options) {
    if (rule.required && value === void 0) {
      required$1(rule, value, source, errors, options);
      return;
    }
    var custom = ["integer", "float", "array", "regexp", "object", "method", "email", "number", "date", "url", "hex"];
    var ruleType = rule.type;
    if (custom.indexOf(ruleType) > -1) {
      if (!types[ruleType](value)) {
        errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
      }
    } else if (ruleType && typeof value !== rule.type) {
      errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
    }
  };
  var range = function range2(rule, value, source, errors, options) {
    var len = typeof rule.len === "number";
    var min = typeof rule.min === "number";
    var max = typeof rule.max === "number";
    var spRegexp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    var val = value;
    var key = null;
    var num = typeof value === "number";
    var str = typeof value === "string";
    var arr = Array.isArray(value);
    if (num) {
      key = "number";
    } else if (str) {
      key = "string";
    } else if (arr) {
      key = "array";
    }
    if (!key) {
      return false;
    }
    if (arr) {
      val = value.length;
    }
    if (str) {
      val = value.replace(spRegexp, "_").length;
    }
    if (len) {
      if (val !== rule.len) {
        errors.push(format(options.messages[key].len, rule.fullField, rule.len));
      }
    } else if (min && !max && val < rule.min) {
      errors.push(format(options.messages[key].min, rule.fullField, rule.min));
    } else if (max && !min && val > rule.max) {
      errors.push(format(options.messages[key].max, rule.fullField, rule.max));
    } else if (min && max && (val < rule.min || val > rule.max)) {
      errors.push(format(options.messages[key].range, rule.fullField, rule.min, rule.max));
    }
  };
  var ENUM$1 = "enum";
  var enumerable$1 = function enumerable(rule, value, source, errors, options) {
    rule[ENUM$1] = Array.isArray(rule[ENUM$1]) ? rule[ENUM$1] : [];
    if (rule[ENUM$1].indexOf(value) === -1) {
      errors.push(format(options.messages[ENUM$1], rule.fullField, rule[ENUM$1].join(", ")));
    }
  };
  var pattern$1 = function pattern(rule, value, source, errors, options) {
    if (rule.pattern) {
      if (rule.pattern instanceof RegExp) {
        rule.pattern.lastIndex = 0;
        if (!rule.pattern.test(value)) {
          errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
        }
      } else if (typeof rule.pattern === "string") {
        var _pattern = new RegExp(rule.pattern);
        if (!_pattern.test(value)) {
          errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
        }
      }
    }
  };
  var rules = {
    required: required$1,
    whitespace,
    type: type$1,
    range,
    "enum": enumerable$1,
    pattern: pattern$1
  };
  var string = function string2(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value, "string") && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options, "string");
      if (!isEmptyValue(value, "string")) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
        rules.pattern(rule, value, source, errors, options);
        if (rule.whitespace === true) {
          rules.whitespace(rule, value, source, errors, options);
        }
      }
    }
    callback(errors);
  };
  var method2 = function method3(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== void 0) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var number2 = function number3(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (value === "") {
        value = void 0;
      }
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== void 0) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var _boolean = function _boolean2(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== void 0) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var regexp2 = function regexp3(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (!isEmptyValue(value)) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var integer2 = function integer3(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== void 0) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var floatFn = function floatFn2(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== void 0) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var array2 = function array3(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if ((value === void 0 || value === null) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options, "array");
      if (value !== void 0 && value !== null) {
        rules.type(rule, value, source, errors, options);
        rules.range(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var object2 = function object3(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== void 0) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var ENUM = "enum";
  var enumerable2 = function enumerable3(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (value !== void 0) {
        rules[ENUM](rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var pattern2 = function pattern3(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value, "string") && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (!isEmptyValue(value, "string")) {
        rules.pattern(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var date2 = function date3(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value, "date") && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
      if (!isEmptyValue(value, "date")) {
        var dateObject;
        if (value instanceof Date) {
          dateObject = value;
        } else {
          dateObject = new Date(value);
        }
        rules.type(rule, dateObject, source, errors, options);
        if (dateObject) {
          rules.range(rule, dateObject.getTime(), source, errors, options);
        }
      }
    }
    callback(errors);
  };
  var required2 = function required3(rule, value, callback, source, options) {
    var errors = [];
    var type4 = Array.isArray(value) ? "array" : typeof value;
    rules.required(rule, value, source, errors, options, type4);
    callback(errors);
  };
  var type2 = function type3(rule, value, callback, source, options) {
    var ruleType = rule.type;
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value, ruleType) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options, ruleType);
      if (!isEmptyValue(value, ruleType)) {
        rules.type(rule, value, source, errors, options);
      }
    }
    callback(errors);
  };
  var any = function any2(rule, value, callback, source, options) {
    var errors = [];
    var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
    if (validate) {
      if (isEmptyValue(value) && !rule.required) {
        return callback();
      }
      rules.required(rule, value, source, errors, options);
    }
    callback(errors);
  };
  var validators = {
    string,
    method: method2,
    number: number2,
    "boolean": _boolean,
    regexp: regexp2,
    integer: integer2,
    "float": floatFn,
    array: array2,
    object: object2,
    "enum": enumerable2,
    pattern: pattern2,
    date: date2,
    url: type2,
    hex: type2,
    email: type2,
    required: required2,
    any
  };
  function newMessages() {
    return {
      "default": "Validation error on field %s",
      required: "%s is required",
      "enum": "%s must be one of %s",
      whitespace: "%s cannot be empty",
      date: {
        format: "%s date %s is invalid for format %s",
        parse: "%s date could not be parsed, %s is invalid ",
        invalid: "%s date %s is invalid"
      },
      types: {
        string: "%s is not a %s",
        method: "%s is not a %s (function)",
        array: "%s is not an %s",
        object: "%s is not an %s",
        number: "%s is not a %s",
        date: "%s is not a %s",
        "boolean": "%s is not a %s",
        integer: "%s is not an %s",
        "float": "%s is not a %s",
        regexp: "%s is not a valid %s",
        email: "%s is not a valid %s",
        url: "%s is not a valid %s",
        hex: "%s is not a valid %s"
      },
      string: {
        len: "%s must be exactly %s characters",
        min: "%s must be at least %s characters",
        max: "%s cannot be longer than %s characters",
        range: "%s must be between %s and %s characters"
      },
      number: {
        len: "%s must equal %s",
        min: "%s cannot be less than %s",
        max: "%s cannot be greater than %s",
        range: "%s must be between %s and %s"
      },
      array: {
        len: "%s must be exactly %s in length",
        min: "%s cannot be less than %s in length",
        max: "%s cannot be greater than %s in length",
        range: "%s must be between %s and %s in length"
      },
      pattern: {
        mismatch: "%s value %s does not match pattern %s"
      },
      clone: function clone() {
        var cloned = JSON.parse(JSON.stringify(this));
        cloned.clone = this.clone;
        return cloned;
      }
    };
  }
  var messages = newMessages();
  var Schema = /* @__PURE__ */ function() {
    function Schema2(descriptor) {
      this.rules = null;
      this._messages = messages;
      this.define(descriptor);
    }
    var _proto = Schema2.prototype;
    _proto.define = function define(rules2) {
      var _this = this;
      if (!rules2) {
        throw new Error("Cannot configure a schema with no rules");
      }
      if (typeof rules2 !== "object" || Array.isArray(rules2)) {
        throw new Error("Rules must be an object");
      }
      this.rules = {};
      Object.keys(rules2).forEach(function(name) {
        var item = rules2[name];
        _this.rules[name] = Array.isArray(item) ? item : [item];
      });
    };
    _proto.messages = function messages2(_messages) {
      if (_messages) {
        this._messages = deepMerge(newMessages(), _messages);
      }
      return this._messages;
    };
    _proto.validate = function validate(source_, o, oc) {
      var _this2 = this;
      if (o === void 0) {
        o = {};
      }
      if (oc === void 0) {
        oc = function oc2() {
        };
      }
      var source = source_;
      var options = o;
      var callback = oc;
      if (typeof options === "function") {
        callback = options;
        options = {};
      }
      if (!this.rules || Object.keys(this.rules).length === 0) {
        if (callback) {
          callback(null, source);
        }
        return Promise.resolve(source);
      }
      function complete(results) {
        var errors = [];
        var fields = {};
        function add(e) {
          if (Array.isArray(e)) {
            var _errors;
            errors = (_errors = errors).concat.apply(_errors, e);
          } else {
            errors.push(e);
          }
        }
        for (var i = 0; i < results.length; i++) {
          add(results[i]);
        }
        if (!errors.length) {
          callback(null, source);
        } else {
          fields = convertFieldsError(errors);
          callback(errors, fields);
        }
      }
      if (options.messages) {
        var messages$1 = this.messages();
        if (messages$1 === messages) {
          messages$1 = newMessages();
        }
        deepMerge(messages$1, options.messages);
        options.messages = messages$1;
      } else {
        options.messages = this.messages();
      }
      var series = {};
      var keys = options.keys || Object.keys(this.rules);
      keys.forEach(function(z) {
        var arr = _this2.rules[z];
        var value = source[z];
        arr.forEach(function(r) {
          var rule = r;
          if (typeof rule.transform === "function") {
            if (source === source_) {
              source = _extends({}, source);
            }
            value = source[z] = rule.transform(value);
          }
          if (typeof rule === "function") {
            rule = {
              validator: rule
            };
          } else {
            rule = _extends({}, rule);
          }
          rule.validator = _this2.getValidationMethod(rule);
          if (!rule.validator) {
            return;
          }
          rule.field = z;
          rule.fullField = rule.fullField || z;
          rule.type = _this2.getType(rule);
          series[z] = series[z] || [];
          series[z].push({
            rule,
            value,
            source,
            field: z
          });
        });
      });
      var errorFields = {};
      return asyncMap(series, options, function(data, doIt) {
        var rule = data.rule;
        var deep = (rule.type === "object" || rule.type === "array") && (typeof rule.fields === "object" || typeof rule.defaultField === "object");
        deep = deep && (rule.required || !rule.required && data.value);
        rule.field = data.field;
        function addFullField(key, schema) {
          return _extends({}, schema, {
            fullField: rule.fullField + "." + key,
            fullFields: rule.fullFields ? [].concat(rule.fullFields, [key]) : [key]
          });
        }
        function cb(e) {
          if (e === void 0) {
            e = [];
          }
          var errorList = Array.isArray(e) ? e : [e];
          if (!options.suppressWarning && errorList.length) {
            Schema2.warning("async-validator:", errorList);
          }
          if (errorList.length && rule.message !== void 0) {
            errorList = [].concat(rule.message);
          }
          var filledErrors = errorList.map(complementError(rule, source));
          if (options.first && filledErrors.length) {
            errorFields[rule.field] = 1;
            return doIt(filledErrors);
          }
          if (!deep) {
            doIt(filledErrors);
          } else {
            if (rule.required && !data.value) {
              if (rule.message !== void 0) {
                filledErrors = [].concat(rule.message).map(complementError(rule, source));
              } else if (options.error) {
                filledErrors = [options.error(rule, format(options.messages.required, rule.field))];
              }
              return doIt(filledErrors);
            }
            var fieldsSchema = {};
            if (rule.defaultField) {
              Object.keys(data.value).map(function(key) {
                fieldsSchema[key] = rule.defaultField;
              });
            }
            fieldsSchema = _extends({}, fieldsSchema, data.rule.fields);
            var paredFieldsSchema = {};
            Object.keys(fieldsSchema).forEach(function(field) {
              var fieldSchema = fieldsSchema[field];
              var fieldSchemaList = Array.isArray(fieldSchema) ? fieldSchema : [fieldSchema];
              paredFieldsSchema[field] = fieldSchemaList.map(addFullField.bind(null, field));
            });
            var schema = new Schema2(paredFieldsSchema);
            schema.messages(options.messages);
            if (data.rule.options) {
              data.rule.options.messages = options.messages;
              data.rule.options.error = options.error;
            }
            schema.validate(data.value, data.rule.options || options, function(errs) {
              var finalErrors = [];
              if (filledErrors && filledErrors.length) {
                finalErrors.push.apply(finalErrors, filledErrors);
              }
              if (errs && errs.length) {
                finalErrors.push.apply(finalErrors, errs);
              }
              doIt(finalErrors.length ? finalErrors : null);
            });
          }
        }
        var res;
        if (rule.asyncValidator) {
          res = rule.asyncValidator(rule, data.value, cb, data.source, options);
        } else if (rule.validator) {
          try {
            res = rule.validator(rule, data.value, cb, data.source, options);
          } catch (error) {
            console.error == null ? void 0 : console.error(error);
            if (!options.suppressValidatorError) {
              setTimeout(function() {
                throw error;
              }, 0);
            }
            cb(error.message);
          }
          if (res === true) {
            cb();
          } else if (res === false) {
            cb(typeof rule.message === "function" ? rule.message(rule.fullField || rule.field) : rule.message || (rule.fullField || rule.field) + " fails");
          } else if (res instanceof Array) {
            cb(res);
          } else if (res instanceof Error) {
            cb(res.message);
          }
        }
        if (res && res.then) {
          res.then(function() {
            return cb();
          }, function(e) {
            return cb(e);
          });
        }
      }, function(results) {
        complete(results);
      }, source);
    };
    _proto.getType = function getType(rule) {
      if (rule.type === void 0 && rule.pattern instanceof RegExp) {
        rule.type = "pattern";
      }
      if (typeof rule.validator !== "function" && rule.type && !validators.hasOwnProperty(rule.type)) {
        throw new Error(format("Unknown rule type %s", rule.type));
      }
      return rule.type || "string";
    };
    _proto.getValidationMethod = function getValidationMethod(rule) {
      if (typeof rule.validator === "function") {
        return rule.validator;
      }
      var keys = Object.keys(rule);
      var messageIndex = keys.indexOf("message");
      if (messageIndex !== -1) {
        keys.splice(messageIndex, 1);
      }
      if (keys.length === 1 && keys[0] === "required") {
        return validators.required;
      }
      return validators[this.getType(rule)] || void 0;
    };
    return Schema2;
  }();
  Schema.register = function register(type4, validator) {
    if (typeof validator !== "function") {
      throw new Error("Cannot register a validator by type, validator is not a function");
    }
    validators[type4] = validator;
  };
  Schema.warning = warning;
  Schema.messages = messages;
  Schema.validators = validators;

  const formItemValidateStates = [
    "",
    "error",
    "validating",
    "success"
  ];
  const formItemProps = buildProps({
    label: String,
    labelWidth: {
      type: [String, Number],
      default: ""
    },
    prop: {
      type: definePropType([String, Array])
    },
    required: {
      type: Boolean,
      default: void 0
    },
    rules: {
      type: definePropType([Object, Array])
    },
    error: String,
    validateStatus: {
      type: String,
      values: formItemValidateStates
    },
    for: String,
    inlineMessage: {
      type: [String, Boolean],
      default: ""
    },
    showMessage: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      values: componentSizes
    }
  });

  const COMPONENT_NAME$l = "ElLabelWrap";
  var FormLabelWrap = vue.defineComponent({
    name: COMPONENT_NAME$l,
    props: {
      isAutoWidth: Boolean,
      updateAll: Boolean
    },
    setup(props, {
      slots
    }) {
      const formContext = vue.inject(formContextKey, void 0);
      const formItemContext = vue.inject(formItemContextKey);
      if (!formItemContext)
        throwError(COMPONENT_NAME$l, "usage: <el-form-item><label-wrap /></el-form-item>");
      const ns = useNamespace("form");
      const el = vue.ref();
      const computedWidth = vue.ref(0);
      const getLabelWidth = () => {
        var _a;
        if ((_a = el.value) == null ? void 0 : _a.firstElementChild) {
          const width = window.getComputedStyle(el.value.firstElementChild).width;
          return Math.ceil(Number.parseFloat(width));
        } else {
          return 0;
        }
      };
      const updateLabelWidth = (action = "update") => {
        vue.nextTick(() => {
          if (slots.default && props.isAutoWidth) {
            if (action === "update") {
              computedWidth.value = getLabelWidth();
            } else if (action === "remove") {
              formContext == null ? void 0 : formContext.deregisterLabelWidth(computedWidth.value);
            }
          }
        });
      };
      const updateLabelWidthFn = () => updateLabelWidth("update");
      vue.onMounted(() => {
        updateLabelWidthFn();
      });
      vue.onBeforeUnmount(() => {
        updateLabelWidth("remove");
      });
      vue.onUpdated(() => updateLabelWidthFn());
      vue.watch(computedWidth, (val, oldVal) => {
        if (props.updateAll) {
          formContext == null ? void 0 : formContext.registerLabelWidth(val, oldVal);
        }
      });
      useResizeObserver(vue.computed(() => {
        var _a, _b;
        return (_b = (_a = el.value) == null ? void 0 : _a.firstElementChild) != null ? _b : null;
      }), updateLabelWidthFn);
      return () => {
        var _a, _b;
        if (!slots)
          return null;
        const {
          isAutoWidth
        } = props;
        if (isAutoWidth) {
          const autoLabelWidth = formContext == null ? void 0 : formContext.autoLabelWidth;
          const hasLabel = formItemContext == null ? void 0 : formItemContext.hasLabel;
          const style = {};
          if (hasLabel && autoLabelWidth && autoLabelWidth !== "auto") {
            const marginWidth = Math.max(0, Number.parseInt(autoLabelWidth, 10) - computedWidth.value);
            const marginPosition = formContext.labelPosition === "left" ? "marginRight" : "marginLeft";
            if (marginWidth) {
              style[marginPosition] = `${marginWidth}px`;
            }
          }
          return vue.createVNode("div", {
            "ref": el,
            "class": [ns.be("item", "label-wrap")],
            "style": style
          }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
        } else {
          return vue.createVNode(vue.Fragment, {
            "ref": el
          }, [(_b = slots.default) == null ? void 0 : _b.call(slots)]);
        }
      };
    }
  });

  const _hoisted_1$13 = ["role", "aria-labelledby"];
  const __default__$1z = vue.defineComponent({
    name: "ElFormItem"
  });
  const _sfc_main$2f = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1z,
    props: formItemProps,
    setup(__props, { expose }) {
      const props = __props;
      const slots = vue.useSlots();
      const formContext = vue.inject(formContextKey, void 0);
      const parentFormItemContext = vue.inject(formItemContextKey, void 0);
      const _size = useFormSize(void 0, { formItem: false });
      const ns = useNamespace("form-item");
      const labelId = useId().value;
      const inputIds = vue.ref([]);
      const validateState = vue.ref("");
      const validateStateDebounced = refDebounced(validateState, 100);
      const validateMessage = vue.ref("");
      const formItemRef = vue.ref();
      let initialValue = void 0;
      let isResettingField = false;
      const labelStyle = vue.computed(() => {
        if ((formContext == null ? void 0 : formContext.labelPosition) === "top") {
          return {};
        }
        const labelWidth = addUnit(props.labelWidth || (formContext == null ? void 0 : formContext.labelWidth) || "");
        if (labelWidth)
          return { width: labelWidth };
        return {};
      });
      const contentStyle = vue.computed(() => {
        if ((formContext == null ? void 0 : formContext.labelPosition) === "top" || (formContext == null ? void 0 : formContext.inline)) {
          return {};
        }
        if (!props.label && !props.labelWidth && isNested) {
          return {};
        }
        const labelWidth = addUnit(props.labelWidth || (formContext == null ? void 0 : formContext.labelWidth) || "");
        if (!props.label && !slots.label) {
          return { marginLeft: labelWidth };
        }
        return {};
      });
      const formItemClasses = vue.computed(() => [
        ns.b(),
        ns.m(_size.value),
        ns.is("error", validateState.value === "error"),
        ns.is("validating", validateState.value === "validating"),
        ns.is("success", validateState.value === "success"),
        ns.is("required", isRequired.value || props.required),
        ns.is("no-asterisk", formContext == null ? void 0 : formContext.hideRequiredAsterisk),
        (formContext == null ? void 0 : formContext.requireAsteriskPosition) === "right" ? "asterisk-right" : "asterisk-left",
        { [ns.m("feedback")]: formContext == null ? void 0 : formContext.statusIcon }
      ]);
      const _inlineMessage = vue.computed(() => isBoolean(props.inlineMessage) ? props.inlineMessage : (formContext == null ? void 0 : formContext.inlineMessage) || false);
      const validateClasses = vue.computed(() => [
        ns.e("error"),
        { [ns.em("error", "inline")]: _inlineMessage.value }
      ]);
      const propString = vue.computed(() => {
        if (!props.prop)
          return "";
        return isString$1(props.prop) ? props.prop : props.prop.join(".");
      });
      const hasLabel = vue.computed(() => {
        return !!(props.label || slots.label);
      });
      const labelFor = vue.computed(() => {
        return props.for || (inputIds.value.length === 1 ? inputIds.value[0] : void 0);
      });
      const isGroup = vue.computed(() => {
        return !labelFor.value && hasLabel.value;
      });
      const isNested = !!parentFormItemContext;
      const fieldValue = vue.computed(() => {
        const model = formContext == null ? void 0 : formContext.model;
        if (!model || !props.prop) {
          return;
        }
        return getProp(model, props.prop).value;
      });
      const normalizedRules = vue.computed(() => {
        const { required } = props;
        const rules = [];
        if (props.rules) {
          rules.push(...castArray$1(props.rules));
        }
        const formRules = formContext == null ? void 0 : formContext.rules;
        if (formRules && props.prop) {
          const _rules = getProp(formRules, props.prop).value;
          if (_rules) {
            rules.push(...castArray$1(_rules));
          }
        }
        if (required !== void 0) {
          const requiredRules = rules.map((rule, i) => [rule, i]).filter(([rule]) => Object.keys(rule).includes("required"));
          if (requiredRules.length > 0) {
            for (const [rule, i] of requiredRules) {
              if (rule.required === required)
                continue;
              rules[i] = { ...rule, required };
            }
          } else {
            rules.push({ required });
          }
        }
        return rules;
      });
      const validateEnabled = vue.computed(() => normalizedRules.value.length > 0);
      const getFilteredRule = (trigger) => {
        const rules = normalizedRules.value;
        return rules.filter((rule) => {
          if (!rule.trigger || !trigger)
            return true;
          if (Array.isArray(rule.trigger)) {
            return rule.trigger.includes(trigger);
          } else {
            return rule.trigger === trigger;
          }
        }).map(({ trigger: trigger2, ...rule }) => rule);
      };
      const isRequired = vue.computed(() => normalizedRules.value.some((rule) => rule.required));
      const shouldShowError = vue.computed(() => {
        var _a;
        return validateStateDebounced.value === "error" && props.showMessage && ((_a = formContext == null ? void 0 : formContext.showMessage) != null ? _a : true);
      });
      const currentLabel = vue.computed(() => `${props.label || ""}${(formContext == null ? void 0 : formContext.labelSuffix) || ""}`);
      const setValidationState = (state) => {
        validateState.value = state;
      };
      const onValidationFailed = (error) => {
        var _a, _b;
        const { errors, fields } = error;
        if (!errors || !fields) {
          console.error(error);
        }
        setValidationState("error");
        validateMessage.value = errors ? (_b = (_a = errors == null ? void 0 : errors[0]) == null ? void 0 : _a.message) != null ? _b : `${props.prop} is required` : "";
        formContext == null ? void 0 : formContext.emit("validate", props.prop, false, validateMessage.value);
      };
      const onValidationSucceeded = () => {
        setValidationState("success");
        formContext == null ? void 0 : formContext.emit("validate", props.prop, true, "");
      };
      const doValidate = async (rules) => {
        const modelName = propString.value;
        const validator = new Schema({
          [modelName]: rules
        });
        return validator.validate({ [modelName]: fieldValue.value }, { firstFields: true }).then(() => {
          onValidationSucceeded();
          return true;
        }).catch((err) => {
          onValidationFailed(err);
          return Promise.reject(err);
        });
      };
      const validate = async (trigger, callback) => {
        if (isResettingField || !props.prop) {
          return false;
        }
        const hasCallback = isFunction$1(callback);
        if (!validateEnabled.value) {
          callback == null ? void 0 : callback(false);
          return false;
        }
        const rules = getFilteredRule(trigger);
        if (rules.length === 0) {
          callback == null ? void 0 : callback(true);
          return true;
        }
        setValidationState("validating");
        return doValidate(rules).then(() => {
          callback == null ? void 0 : callback(true);
          return true;
        }).catch((err) => {
          const { fields } = err;
          callback == null ? void 0 : callback(false, fields);
          return hasCallback ? false : Promise.reject(fields);
        });
      };
      const clearValidate = () => {
        setValidationState("");
        validateMessage.value = "";
        isResettingField = false;
      };
      const resetField = async () => {
        const model = formContext == null ? void 0 : formContext.model;
        if (!model || !props.prop)
          return;
        const computedValue = getProp(model, props.prop);
        isResettingField = true;
        computedValue.value = clone(initialValue);
        await vue.nextTick();
        clearValidate();
        isResettingField = false;
      };
      const addInputId = (id) => {
        if (!inputIds.value.includes(id)) {
          inputIds.value.push(id);
        }
      };
      const removeInputId = (id) => {
        inputIds.value = inputIds.value.filter((listId) => listId !== id);
      };
      vue.watch(() => props.error, (val) => {
        validateMessage.value = val || "";
        setValidationState(val ? "error" : "");
      }, { immediate: true });
      vue.watch(() => props.validateStatus, (val) => setValidationState(val || ""));
      const context = vue.reactive({
        ...vue.toRefs(props),
        $el: formItemRef,
        size: _size,
        validateState,
        labelId,
        inputIds,
        isGroup,
        hasLabel,
        addInputId,
        removeInputId,
        resetField,
        clearValidate,
        validate
      });
      vue.provide(formItemContextKey, context);
      vue.onMounted(() => {
        if (props.prop) {
          formContext == null ? void 0 : formContext.addField(context);
          initialValue = clone(fieldValue.value);
        }
      });
      vue.onBeforeUnmount(() => {
        formContext == null ? void 0 : formContext.removeField(context);
      });
      expose({
        size: _size,
        validateMessage,
        validateState,
        validate,
        clearValidate,
        resetField
      });
      return (_ctx, _cache) => {
        var _a;
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "formItemRef",
          ref: formItemRef,
          class: vue.normalizeClass(vue.unref(formItemClasses)),
          role: vue.unref(isGroup) ? "group" : void 0,
          "aria-labelledby": vue.unref(isGroup) ? vue.unref(labelId) : void 0
        }, [
          vue.createVNode(vue.unref(FormLabelWrap), {
            "is-auto-width": vue.unref(labelStyle).width === "auto",
            "update-all": ((_a = vue.unref(formContext)) == null ? void 0 : _a.labelWidth) === "auto"
          }, {
            default: vue.withCtx(() => [
              vue.unref(hasLabel) ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(labelFor) ? "label" : "div"), {
                key: 0,
                id: vue.unref(labelId),
                for: vue.unref(labelFor),
                class: vue.normalizeClass(vue.unref(ns).e("label")),
                style: vue.normalizeStyle(vue.unref(labelStyle))
              }, {
                default: vue.withCtx(() => [
                  vue.renderSlot(_ctx.$slots, "label", { label: vue.unref(currentLabel) }, () => [
                    vue.createTextVNode(vue.toDisplayString(vue.unref(currentLabel)), 1)
                  ])
                ]),
                _: 3
              }, 8, ["id", "for", "class", "style"])) : vue.createCommentVNode("v-if", true)
            ]),
            _: 3
          }, 8, ["is-auto-width", "update-all"]),
          vue.createElementVNode("div", {
            class: vue.normalizeClass(vue.unref(ns).e("content")),
            style: vue.normalizeStyle(vue.unref(contentStyle))
          }, [
            vue.renderSlot(_ctx.$slots, "default"),
            vue.createVNode(vue.TransitionGroup, {
              name: `${vue.unref(ns).namespace.value}-zoom-in-top`
            }, {
              default: vue.withCtx(() => [
                vue.unref(shouldShowError) ? vue.renderSlot(_ctx.$slots, "error", {
                  key: 0,
                  error: validateMessage.value
                }, () => [
                  vue.createElementVNode("div", {
                    class: vue.normalizeClass(vue.unref(validateClasses))
                  }, vue.toDisplayString(validateMessage.value), 3)
                ]) : vue.createCommentVNode("v-if", true)
              ]),
              _: 3
            }, 8, ["name"])
          ], 6)
        ], 10, _hoisted_1$13);
      };
    }
  });
  var FormItem = /* @__PURE__ */ _export_sfc(_sfc_main$2f, [["__file", "form-item.vue"]]);

  const ElForm = withInstall(Form, {
    FormItem
  });
  const ElFormItem = withNoopInstall(FormItem);

  let hiddenTextarea = void 0;
  const HIDDEN_STYLE = `
  height:0 !important;
  visibility:hidden !important;
  ${isFirefox() ? "" : "overflow:hidden !important;"}
  position:absolute !important;
  z-index:-1000 !important;
  top:0 !important;
  right:0 !important;
`;
  const CONTEXT_STYLE = [
    "letter-spacing",
    "line-height",
    "padding-top",
    "padding-bottom",
    "font-family",
    "font-weight",
    "font-size",
    "text-rendering",
    "text-transform",
    "width",
    "text-indent",
    "padding-left",
    "padding-right",
    "border-width",
    "box-sizing"
  ];
  function calculateNodeStyling(targetElement) {
    const style = window.getComputedStyle(targetElement);
    const boxSizing = style.getPropertyValue("box-sizing");
    const paddingSize = Number.parseFloat(style.getPropertyValue("padding-bottom")) + Number.parseFloat(style.getPropertyValue("padding-top"));
    const borderSize = Number.parseFloat(style.getPropertyValue("border-bottom-width")) + Number.parseFloat(style.getPropertyValue("border-top-width"));
    const contextStyle = CONTEXT_STYLE.map((name) => `${name}:${style.getPropertyValue(name)}`).join(";");
    return { contextStyle, paddingSize, borderSize, boxSizing };
  }
  function calcTextareaHeight(targetElement, minRows = 1, maxRows) {
    var _a;
    if (!hiddenTextarea) {
      hiddenTextarea = document.createElement("textarea");
      document.body.appendChild(hiddenTextarea);
    }
    const { paddingSize, borderSize, boxSizing, contextStyle } = calculateNodeStyling(targetElement);
    hiddenTextarea.setAttribute("style", `${contextStyle};${HIDDEN_STYLE}`);
    hiddenTextarea.value = targetElement.value || targetElement.placeholder || "";
    let height = hiddenTextarea.scrollHeight;
    const result = {};
    if (boxSizing === "border-box") {
      height = height + borderSize;
    } else if (boxSizing === "content-box") {
      height = height - paddingSize;
    }
    hiddenTextarea.value = "";
    const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
    if (isNumber(minRows)) {
      let minHeight = singleRowHeight * minRows;
      if (boxSizing === "border-box") {
        minHeight = minHeight + paddingSize + borderSize;
      }
      height = Math.max(minHeight, height);
      result.minHeight = `${minHeight}px`;
    }
    if (isNumber(maxRows)) {
      let maxHeight = singleRowHeight * maxRows;
      if (boxSizing === "border-box") {
        maxHeight = maxHeight + paddingSize + borderSize;
      }
      height = Math.min(maxHeight, height);
    }
    result.height = `${height}px`;
    (_a = hiddenTextarea.parentNode) == null ? void 0 : _a.removeChild(hiddenTextarea);
    hiddenTextarea = void 0;
    return result;
  }

  const inputProps = buildProps({
    id: {
      type: String,
      default: void 0
    },
    size: useSizeProp,
    disabled: Boolean,
    modelValue: {
      type: definePropType([
        String,
        Number,
        Object
      ]),
      default: ""
    },
    type: {
      type: String,
      default: "text"
    },
    resize: {
      type: String,
      values: ["none", "both", "horizontal", "vertical"]
    },
    autosize: {
      type: definePropType([Boolean, Object]),
      default: false
    },
    autocomplete: {
      type: String,
      default: "off"
    },
    formatter: {
      type: Function
    },
    parser: {
      type: Function
    },
    placeholder: {
      type: String
    },
    form: {
      type: String
    },
    readonly: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    suffixIcon: {
      type: iconPropType
    },
    prefixIcon: {
      type: iconPropType
    },
    containerRole: {
      type: String,
      default: void 0
    },
    label: {
      type: String,
      default: void 0
    },
    tabindex: {
      type: [String, Number],
      default: 0
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    inputStyle: {
      type: definePropType([Object, Array, String]),
      default: () => mutable({})
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  });
  const inputEmits = {
    [UPDATE_MODEL_EVENT]: (value) => isString$1(value),
    input: (value) => isString$1(value),
    change: (value) => isString$1(value),
    focus: (evt) => evt instanceof FocusEvent,
    blur: (evt) => evt instanceof FocusEvent,
    clear: () => true,
    mouseleave: (evt) => evt instanceof MouseEvent,
    mouseenter: (evt) => evt instanceof MouseEvent,
    keydown: (evt) => evt instanceof Event,
    compositionstart: (evt) => evt instanceof CompositionEvent,
    compositionupdate: (evt) => evt instanceof CompositionEvent,
    compositionend: (evt) => evt instanceof CompositionEvent
  };

  const _hoisted_1$12 = ["role"];
  const _hoisted_2$H = ["id", "type", "disabled", "formatter", "parser", "readonly", "autocomplete", "tabindex", "aria-label", "placeholder", "form", "autofocus"];
  const _hoisted_3$k = ["id", "tabindex", "disabled", "readonly", "autocomplete", "aria-label", "placeholder", "form", "autofocus"];
  const __default__$1y = vue.defineComponent({
    name: "ElInput",
    inheritAttrs: false
  });
  const _sfc_main$2e = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1y,
    props: inputProps,
    emits: inputEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const rawAttrs = vue.useAttrs();
      const slots = vue.useSlots();
      const containerAttrs = vue.computed(() => {
        const comboBoxAttrs = {};
        if (props.containerRole === "combobox") {
          comboBoxAttrs["aria-haspopup"] = rawAttrs["aria-haspopup"];
          comboBoxAttrs["aria-owns"] = rawAttrs["aria-owns"];
          comboBoxAttrs["aria-expanded"] = rawAttrs["aria-expanded"];
        }
        return comboBoxAttrs;
      });
      const containerKls = vue.computed(() => [
        props.type === "textarea" ? nsTextarea.b() : nsInput.b(),
        nsInput.m(inputSize.value),
        nsInput.is("disabled", inputDisabled.value),
        nsInput.is("exceed", inputExceed.value),
        {
          [nsInput.b("group")]: slots.prepend || slots.append,
          [nsInput.bm("group", "append")]: slots.append,
          [nsInput.bm("group", "prepend")]: slots.prepend,
          [nsInput.m("prefix")]: slots.prefix || props.prefixIcon,
          [nsInput.m("suffix")]: slots.suffix || props.suffixIcon || props.clearable || props.showPassword,
          [nsInput.bm("suffix", "password-clear")]: showClear.value && showPwdVisible.value
        },
        rawAttrs.class
      ]);
      const wrapperKls = vue.computed(() => [
        nsInput.e("wrapper"),
        nsInput.is("focus", isFocused.value)
      ]);
      const attrs = useAttrs({
        excludeKeys: vue.computed(() => {
          return Object.keys(containerAttrs.value);
        })
      });
      const { form, formItem } = useFormItem();
      const { inputId } = useFormItemInputId(props, {
        formItemContext: formItem
      });
      const inputSize = useFormSize();
      const inputDisabled = useFormDisabled();
      const nsInput = useNamespace("input");
      const nsTextarea = useNamespace("textarea");
      const input = vue.shallowRef();
      const textarea = vue.shallowRef();
      const hovering = vue.ref(false);
      const isComposing = vue.ref(false);
      const passwordVisible = vue.ref(false);
      const countStyle = vue.ref();
      const textareaCalcStyle = vue.shallowRef(props.inputStyle);
      const _ref = vue.computed(() => input.value || textarea.value);
      const { wrapperRef, isFocused, handleFocus, handleBlur } = useFocusController(_ref, {
        afterBlur() {
          var _a;
          if (props.validateEvent) {
            (_a = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a.call(formItem, "blur").catch((err) => debugWarn());
          }
        }
      });
      const needStatusIcon = vue.computed(() => {
        var _a;
        return (_a = form == null ? void 0 : form.statusIcon) != null ? _a : false;
      });
      const validateState = vue.computed(() => (formItem == null ? void 0 : formItem.validateState) || "");
      const validateIcon = vue.computed(() => validateState.value && ValidateComponentsMap[validateState.value]);
      const passwordIcon = vue.computed(() => passwordVisible.value ? view_default : hide_default);
      const containerStyle = vue.computed(() => [
        rawAttrs.style,
        props.inputStyle
      ]);
      const textareaStyle = vue.computed(() => [
        props.inputStyle,
        textareaCalcStyle.value,
        { resize: props.resize }
      ]);
      const nativeInputValue = vue.computed(() => isNil(props.modelValue) ? "" : String(props.modelValue));
      const showClear = vue.computed(() => props.clearable && !inputDisabled.value && !props.readonly && !!nativeInputValue.value && (isFocused.value || hovering.value));
      const showPwdVisible = vue.computed(() => props.showPassword && !inputDisabled.value && !props.readonly && !!nativeInputValue.value && (!!nativeInputValue.value || isFocused.value));
      const isWordLimitVisible = vue.computed(() => props.showWordLimit && !!attrs.value.maxlength && (props.type === "text" || props.type === "textarea") && !inputDisabled.value && !props.readonly && !props.showPassword);
      const textLength = vue.computed(() => nativeInputValue.value.length);
      const inputExceed = vue.computed(() => !!isWordLimitVisible.value && textLength.value > Number(attrs.value.maxlength));
      const suffixVisible = vue.computed(() => !!slots.suffix || !!props.suffixIcon || showClear.value || props.showPassword || isWordLimitVisible.value || !!validateState.value && needStatusIcon.value);
      const [recordCursor, setCursor] = useCursor(input);
      useResizeObserver(textarea, (entries) => {
        onceInitSizeTextarea();
        if (!isWordLimitVisible.value || props.resize !== "both")
          return;
        const entry = entries[0];
        const { width } = entry.contentRect;
        countStyle.value = {
          right: `calc(100% - ${width + 15 + 6}px)`
        };
      });
      const resizeTextarea = () => {
        const { type, autosize } = props;
        if (!isClient || type !== "textarea" || !textarea.value)
          return;
        if (autosize) {
          const minRows = isObject$1(autosize) ? autosize.minRows : void 0;
          const maxRows = isObject$1(autosize) ? autosize.maxRows : void 0;
          const textareaStyle2 = calcTextareaHeight(textarea.value, minRows, maxRows);
          textareaCalcStyle.value = {
            overflowY: "hidden",
            ...textareaStyle2
          };
          vue.nextTick(() => {
            textarea.value.offsetHeight;
            textareaCalcStyle.value = textareaStyle2;
          });
        } else {
          textareaCalcStyle.value = {
            minHeight: calcTextareaHeight(textarea.value).minHeight
          };
        }
      };
      const createOnceInitResize = (resizeTextarea2) => {
        let isInit = false;
        return () => {
          var _a;
          if (isInit || !props.autosize)
            return;
          const isElHidden = ((_a = textarea.value) == null ? void 0 : _a.offsetParent) === null;
          if (!isElHidden) {
            resizeTextarea2();
            isInit = true;
          }
        };
      };
      const onceInitSizeTextarea = createOnceInitResize(resizeTextarea);
      const setNativeInputValue = () => {
        const input2 = _ref.value;
        const formatterValue = props.formatter ? props.formatter(nativeInputValue.value) : nativeInputValue.value;
        if (!input2 || input2.value === formatterValue)
          return;
        input2.value = formatterValue;
      };
      const handleInput = async (event) => {
        recordCursor();
        let { value } = event.target;
        if (props.formatter) {
          value = props.parser ? props.parser(value) : value;
        }
        if (isComposing.value)
          return;
        if (value === nativeInputValue.value) {
          setNativeInputValue();
          return;
        }
        emit(UPDATE_MODEL_EVENT, value);
        emit("input", value);
        await vue.nextTick();
        setNativeInputValue();
        setCursor();
      };
      const handleChange = (event) => {
        emit("change", event.target.value);
      };
      const handleCompositionStart = (event) => {
        emit("compositionstart", event);
        isComposing.value = true;
      };
      const handleCompositionUpdate = (event) => {
        var _a;
        emit("compositionupdate", event);
        const text = (_a = event.target) == null ? void 0 : _a.value;
        const lastCharacter = text[text.length - 1] || "";
        isComposing.value = !isKorean(lastCharacter);
      };
      const handleCompositionEnd = (event) => {
        emit("compositionend", event);
        if (isComposing.value) {
          isComposing.value = false;
          handleInput(event);
        }
      };
      const handlePasswordVisible = () => {
        passwordVisible.value = !passwordVisible.value;
        focus();
      };
      const focus = async () => {
        var _a;
        await vue.nextTick();
        (_a = _ref.value) == null ? void 0 : _a.focus();
      };
      const blur = () => {
        var _a;
        return (_a = _ref.value) == null ? void 0 : _a.blur();
      };
      const handleMouseLeave = (evt) => {
        hovering.value = false;
        emit("mouseleave", evt);
      };
      const handleMouseEnter = (evt) => {
        hovering.value = true;
        emit("mouseenter", evt);
      };
      const handleKeydown = (evt) => {
        emit("keydown", evt);
      };
      const select = () => {
        var _a;
        (_a = _ref.value) == null ? void 0 : _a.select();
      };
      const clear = () => {
        emit(UPDATE_MODEL_EVENT, "");
        emit("change", "");
        emit("clear");
        emit("input", "");
      };
      vue.watch(() => props.modelValue, () => {
        var _a;
        vue.nextTick(() => resizeTextarea());
        if (props.validateEvent) {
          (_a = formItem == null ? void 0 : formItem.validate) == null ? void 0 : _a.call(formItem, "change").catch((err) => debugWarn());
        }
      });
      vue.watch(nativeInputValue, () => setNativeInputValue());
      vue.watch(() => props.type, async () => {
        await vue.nextTick();
        setNativeInputValue();
        resizeTextarea();
      });
      vue.onMounted(() => {
        if (!props.formatter && props.parser) ;
        setNativeInputValue();
        vue.nextTick(resizeTextarea);
      });
      expose({
        input,
        textarea,
        ref: _ref,
        textareaStyle,
        autosize: vue.toRef(props, "autosize"),
        focus,
        blur,
        select,
        clear,
        resizeTextarea
      });
      return (_ctx, _cache) => {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", vue.mergeProps(vue.unref(containerAttrs), {
          class: vue.unref(containerKls),
          style: vue.unref(containerStyle),
          role: _ctx.containerRole,
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave
        }), [
          vue.createCommentVNode(" input "),
          _ctx.type !== "textarea" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
            vue.createCommentVNode(" prepend slot "),
            _ctx.$slots.prepend ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: vue.normalizeClass(vue.unref(nsInput).be("group", "prepend"))
            }, [
              vue.renderSlot(_ctx.$slots, "prepend")
            ], 2)) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("div", {
              ref_key: "wrapperRef",
              ref: wrapperRef,
              class: vue.normalizeClass(vue.unref(wrapperKls))
            }, [
              vue.createCommentVNode(" prefix slot "),
              _ctx.$slots.prefix || _ctx.prefixIcon ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 0,
                class: vue.normalizeClass(vue.unref(nsInput).e("prefix"))
              }, [
                vue.createElementVNode("span", {
                  class: vue.normalizeClass(vue.unref(nsInput).e("prefix-inner"))
                }, [
                  vue.renderSlot(_ctx.$slots, "prefix"),
                  _ctx.prefixIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 0,
                    class: vue.normalizeClass(vue.unref(nsInput).e("icon"))
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.prefixIcon)))
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue.createCommentVNode("v-if", true)
                ], 2)
              ], 2)) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("input", vue.mergeProps({
                id: vue.unref(inputId),
                ref_key: "input",
                ref: input,
                class: vue.unref(nsInput).e("inner")
              }, vue.unref(attrs), {
                type: _ctx.showPassword ? passwordVisible.value ? "text" : "password" : _ctx.type,
                disabled: vue.unref(inputDisabled),
                formatter: _ctx.formatter,
                parser: _ctx.parser,
                readonly: _ctx.readonly,
                autocomplete: _ctx.autocomplete,
                tabindex: _ctx.tabindex,
                "aria-label": _ctx.label,
                placeholder: _ctx.placeholder,
                style: _ctx.inputStyle,
                form: props.form,
                autofocus: props.autofocus,
                onCompositionstart: handleCompositionStart,
                onCompositionupdate: handleCompositionUpdate,
                onCompositionend: handleCompositionEnd,
                onInput: handleInput,
                onFocus: _cache[0] || (_cache[0] = (...args) => vue.unref(handleFocus) && vue.unref(handleFocus)(...args)),
                onBlur: _cache[1] || (_cache[1] = (...args) => vue.unref(handleBlur) && vue.unref(handleBlur)(...args)),
                onChange: handleChange,
                onKeydown: handleKeydown
              }), null, 16, _hoisted_2$H),
              vue.createCommentVNode(" suffix slot "),
              vue.unref(suffixVisible) ? (vue.openBlock(), vue.createElementBlock("span", {
                key: 1,
                class: vue.normalizeClass(vue.unref(nsInput).e("suffix"))
              }, [
                vue.createElementVNode("span", {
                  class: vue.normalizeClass(vue.unref(nsInput).e("suffix-inner"))
                }, [
                  !vue.unref(showClear) || !vue.unref(showPwdVisible) || !vue.unref(isWordLimitVisible) ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                    vue.renderSlot(_ctx.$slots, "suffix"),
                    _ctx.suffixIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                      key: 0,
                      class: vue.normalizeClass(vue.unref(nsInput).e("icon"))
                    }, {
                      default: vue.withCtx(() => [
                        (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.suffixIcon)))
                      ]),
                      _: 1
                    }, 8, ["class"])) : vue.createCommentVNode("v-if", true)
                  ], 64)) : vue.createCommentVNode("v-if", true),
                  vue.unref(showClear) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 1,
                    class: vue.normalizeClass([vue.unref(nsInput).e("icon"), vue.unref(nsInput).e("clear")]),
                    onMousedown: vue.withModifiers(vue.unref(NOOP), ["prevent"]),
                    onClick: clear
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(circle_close_default))
                    ]),
                    _: 1
                  }, 8, ["class", "onMousedown"])) : vue.createCommentVNode("v-if", true),
                  vue.unref(showPwdVisible) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 2,
                    class: vue.normalizeClass([vue.unref(nsInput).e("icon"), vue.unref(nsInput).e("password")]),
                    onClick: handlePasswordVisible
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(passwordIcon))))
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue.createCommentVNode("v-if", true),
                  vue.unref(isWordLimitVisible) ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 3,
                    class: vue.normalizeClass(vue.unref(nsInput).e("count"))
                  }, [
                    vue.createElementVNode("span", {
                      class: vue.normalizeClass(vue.unref(nsInput).e("count-inner"))
                    }, vue.toDisplayString(vue.unref(textLength)) + " / " + vue.toDisplayString(vue.unref(attrs).maxlength), 3)
                  ], 2)) : vue.createCommentVNode("v-if", true),
                  vue.unref(validateState) && vue.unref(validateIcon) && vue.unref(needStatusIcon) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: 4,
                    class: vue.normalizeClass([
                      vue.unref(nsInput).e("icon"),
                      vue.unref(nsInput).e("validateIcon"),
                      vue.unref(nsInput).is("loading", vue.unref(validateState) === "validating")
                    ])
                  }, {
                    default: vue.withCtx(() => [
                      (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(validateIcon))))
                    ]),
                    _: 1
                  }, 8, ["class"])) : vue.createCommentVNode("v-if", true)
                ], 2)
              ], 2)) : vue.createCommentVNode("v-if", true)
            ], 2),
            vue.createCommentVNode(" append slot "),
            _ctx.$slots.append ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 1,
              class: vue.normalizeClass(vue.unref(nsInput).be("group", "append"))
            }, [
              vue.renderSlot(_ctx.$slots, "append")
            ], 2)) : vue.createCommentVNode("v-if", true)
          ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
            vue.createCommentVNode(" textarea "),
            vue.createElementVNode("textarea", vue.mergeProps({
              id: vue.unref(inputId),
              ref_key: "textarea",
              ref: textarea,
              class: vue.unref(nsTextarea).e("inner")
            }, vue.unref(attrs), {
              tabindex: _ctx.tabindex,
              disabled: vue.unref(inputDisabled),
              readonly: _ctx.readonly,
              autocomplete: _ctx.autocomplete,
              style: vue.unref(textareaStyle),
              "aria-label": _ctx.label,
              placeholder: _ctx.placeholder,
              form: props.form,
              autofocus: props.autofocus,
              onCompositionstart: handleCompositionStart,
              onCompositionupdate: handleCompositionUpdate,
              onCompositionend: handleCompositionEnd,
              onInput: handleInput,
              onFocus: _cache[2] || (_cache[2] = (...args) => vue.unref(handleFocus) && vue.unref(handleFocus)(...args)),
              onBlur: _cache[3] || (_cache[3] = (...args) => vue.unref(handleBlur) && vue.unref(handleBlur)(...args)),
              onChange: handleChange,
              onKeydown: handleKeydown
            }), null, 16, _hoisted_3$k),
            vue.unref(isWordLimitVisible) ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              style: vue.normalizeStyle(countStyle.value),
              class: vue.normalizeClass(vue.unref(nsInput).e("count"))
            }, vue.toDisplayString(vue.unref(textLength)) + " / " + vue.toDisplayString(vue.unref(attrs).maxlength), 7)) : vue.createCommentVNode("v-if", true)
          ], 64))
        ], 16, _hoisted_1$12)), [
          [vue.vShow, _ctx.type !== "hidden"]
        ]);
      };
    }
  });
  var Input = /* @__PURE__ */ _export_sfc(_sfc_main$2e, [["__file", "input.vue"]]);

  const ElInput = withInstall(Input);

  const GAP = 4;
  const BAR_MAP = {
    vertical: {
      offset: "offsetHeight",
      scroll: "scrollTop",
      scrollSize: "scrollHeight",
      size: "height",
      key: "vertical",
      axis: "Y",
      client: "clientY",
      direction: "top"
    },
    horizontal: {
      offset: "offsetWidth",
      scroll: "scrollLeft",
      scrollSize: "scrollWidth",
      size: "width",
      key: "horizontal",
      axis: "X",
      client: "clientX",
      direction: "left"
    }
  };
  const renderThumbStyle$1 = ({
    move,
    size,
    bar
  }) => ({
    [bar.size]: size,
    transform: `translate${bar.axis}(${move}%)`
  });

  const scrollbarContextKey = Symbol("scrollbarContextKey");

  const thumbProps = buildProps({
    vertical: Boolean,
    size: String,
    move: Number,
    ratio: {
      type: Number,
      required: true
    },
    always: Boolean
  });

  const COMPONENT_NAME$k = "Thumb";
  const _sfc_main$2d = /* @__PURE__ */ vue.defineComponent({
    __name: "thumb",
    props: thumbProps,
    setup(__props) {
      const props = __props;
      const scrollbar = vue.inject(scrollbarContextKey);
      const ns = useNamespace("scrollbar");
      if (!scrollbar)
        throwError(COMPONENT_NAME$k, "can not inject scrollbar context");
      const instance = vue.ref();
      const thumb = vue.ref();
      const thumbState = vue.ref({});
      const visible = vue.ref(false);
      let cursorDown = false;
      let cursorLeave = false;
      let originalOnSelectStart = isClient ? document.onselectstart : null;
      const bar = vue.computed(() => BAR_MAP[props.vertical ? "vertical" : "horizontal"]);
      const thumbStyle = vue.computed(() => renderThumbStyle$1({
        size: props.size,
        move: props.move,
        bar: bar.value
      }));
      const offsetRatio = vue.computed(() => instance.value[bar.value.offset] ** 2 / scrollbar.wrapElement[bar.value.scrollSize] / props.ratio / thumb.value[bar.value.offset]);
      const clickThumbHandler = (e) => {
        var _a;
        e.stopPropagation();
        if (e.ctrlKey || [1, 2].includes(e.button))
          return;
        (_a = window.getSelection()) == null ? void 0 : _a.removeAllRanges();
        startDrag(e);
        const el = e.currentTarget;
        if (!el)
          return;
        thumbState.value[bar.value.axis] = el[bar.value.offset] - (e[bar.value.client] - el.getBoundingClientRect()[bar.value.direction]);
      };
      const clickTrackHandler = (e) => {
        if (!thumb.value || !instance.value || !scrollbar.wrapElement)
          return;
        const offset = Math.abs(e.target.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]);
        const thumbHalf = thumb.value[bar.value.offset] / 2;
        const thumbPositionPercentage = (offset - thumbHalf) * 100 * offsetRatio.value / instance.value[bar.value.offset];
        scrollbar.wrapElement[bar.value.scroll] = thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize] / 100;
      };
      const startDrag = (e) => {
        e.stopImmediatePropagation();
        cursorDown = true;
        document.addEventListener("mousemove", mouseMoveDocumentHandler);
        document.addEventListener("mouseup", mouseUpDocumentHandler);
        originalOnSelectStart = document.onselectstart;
        document.onselectstart = () => false;
      };
      const mouseMoveDocumentHandler = (e) => {
        if (!instance.value || !thumb.value)
          return;
        if (cursorDown === false)
          return;
        const prevPage = thumbState.value[bar.value.axis];
        if (!prevPage)
          return;
        const offset = (instance.value.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]) * -1;
        const thumbClickPosition = thumb.value[bar.value.offset] - prevPage;
        const thumbPositionPercentage = (offset - thumbClickPosition) * 100 * offsetRatio.value / instance.value[bar.value.offset];
        scrollbar.wrapElement[bar.value.scroll] = thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize] / 100;
      };
      const mouseUpDocumentHandler = () => {
        cursorDown = false;
        thumbState.value[bar.value.axis] = 0;
        document.removeEventListener("mousemove", mouseMoveDocumentHandler);
        document.removeEventListener("mouseup", mouseUpDocumentHandler);
        restoreOnselectstart();
        if (cursorLeave)
          visible.value = false;
      };
      const mouseMoveScrollbarHandler = () => {
        cursorLeave = false;
        visible.value = !!props.size;
      };
      const mouseLeaveScrollbarHandler = () => {
        cursorLeave = true;
        visible.value = cursorDown;
      };
      vue.onBeforeUnmount(() => {
        restoreOnselectstart();
        document.removeEventListener("mouseup", mouseUpDocumentHandler);
      });
      const restoreOnselectstart = () => {
        if (document.onselectstart !== originalOnSelectStart)
          document.onselectstart = originalOnSelectStart;
      };
      useEventListener(vue.toRef(scrollbar, "scrollbarElement"), "mousemove", mouseMoveScrollbarHandler);
      useEventListener(vue.toRef(scrollbar, "scrollbarElement"), "mouseleave", mouseLeaveScrollbarHandler);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, {
          name: vue.unref(ns).b("fade"),
          persisted: ""
        }, {
          default: vue.withCtx(() => [
            vue.withDirectives(vue.createElementVNode("div", {
              ref_key: "instance",
              ref: instance,
              class: vue.normalizeClass([vue.unref(ns).e("bar"), vue.unref(ns).is(vue.unref(bar).key)]),
              onMousedown: clickTrackHandler
            }, [
              vue.createElementVNode("div", {
                ref_key: "thumb",
                ref: thumb,
                class: vue.normalizeClass(vue.unref(ns).e("thumb")),
                style: vue.normalizeStyle(vue.unref(thumbStyle)),
                onMousedown: clickThumbHandler
              }, null, 38)
            ], 34), [
              [vue.vShow, _ctx.always || visible.value]
            ])
          ]),
          _: 1
        }, 8, ["name"]);
      };
    }
  });
  var Thumb = /* @__PURE__ */ _export_sfc(_sfc_main$2d, [["__file", "thumb.vue"]]);

  const barProps = buildProps({
    always: {
      type: Boolean,
      default: true
    },
    width: String,
    height: String,
    ratioX: {
      type: Number,
      default: 1
    },
    ratioY: {
      type: Number,
      default: 1
    }
  });

  const _sfc_main$2c = /* @__PURE__ */ vue.defineComponent({
    __name: "bar",
    props: barProps,
    setup(__props, { expose }) {
      const props = __props;
      const moveX = vue.ref(0);
      const moveY = vue.ref(0);
      const handleScroll = (wrap) => {
        if (wrap) {
          const offsetHeight = wrap.offsetHeight - GAP;
          const offsetWidth = wrap.offsetWidth - GAP;
          moveY.value = wrap.scrollTop * 100 / offsetHeight * props.ratioY;
          moveX.value = wrap.scrollLeft * 100 / offsetWidth * props.ratioX;
        }
      };
      expose({
        handleScroll
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(Thumb, {
            move: moveX.value,
            ratio: _ctx.ratioX,
            size: _ctx.width,
            always: _ctx.always
          }, null, 8, ["move", "ratio", "size", "always"]),
          vue.createVNode(Thumb, {
            move: moveY.value,
            ratio: _ctx.ratioY,
            size: _ctx.height,
            vertical: "",
            always: _ctx.always
          }, null, 8, ["move", "ratio", "size", "always"])
        ], 64);
      };
    }
  });
  var Bar = /* @__PURE__ */ _export_sfc(_sfc_main$2c, [["__file", "bar.vue"]]);

  const scrollbarProps = buildProps({
    height: {
      type: [String, Number],
      default: ""
    },
    maxHeight: {
      type: [String, Number],
      default: ""
    },
    native: {
      type: Boolean,
      default: false
    },
    wrapStyle: {
      type: definePropType([String, Object, Array]),
      default: ""
    },
    wrapClass: {
      type: [String, Array],
      default: ""
    },
    viewClass: {
      type: [String, Array],
      default: ""
    },
    viewStyle: {
      type: [String, Array, Object],
      default: ""
    },
    noresize: Boolean,
    tag: {
      type: String,
      default: "div"
    },
    always: Boolean,
    minSize: {
      type: Number,
      default: 20
    },
    id: String,
    role: String,
    ariaLabel: String,
    ariaOrientation: {
      type: String,
      values: ["horizontal", "vertical"]
    }
  });
  const scrollbarEmits = {
    scroll: ({
      scrollTop,
      scrollLeft
    }) => [scrollTop, scrollLeft].every(isNumber)
  };

  const COMPONENT_NAME$j = "ElScrollbar";
  const __default__$1x = vue.defineComponent({
    name: COMPONENT_NAME$j
  });
  const _sfc_main$2b = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1x,
    props: scrollbarProps,
    emits: scrollbarEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const ns = useNamespace("scrollbar");
      let stopResizeObserver = void 0;
      let stopResizeListener = void 0;
      const scrollbarRef = vue.ref();
      const wrapRef = vue.ref();
      const resizeRef = vue.ref();
      const sizeWidth = vue.ref("0");
      const sizeHeight = vue.ref("0");
      const barRef = vue.ref();
      const ratioY = vue.ref(1);
      const ratioX = vue.ref(1);
      const wrapStyle = vue.computed(() => {
        const style = {};
        if (props.height)
          style.height = addUnit(props.height);
        if (props.maxHeight)
          style.maxHeight = addUnit(props.maxHeight);
        return [props.wrapStyle, style];
      });
      const wrapKls = vue.computed(() => {
        return [
          props.wrapClass,
          ns.e("wrap"),
          { [ns.em("wrap", "hidden-default")]: !props.native }
        ];
      });
      const resizeKls = vue.computed(() => {
        return [ns.e("view"), props.viewClass];
      });
      const handleScroll = () => {
        var _a;
        if (wrapRef.value) {
          (_a = barRef.value) == null ? void 0 : _a.handleScroll(wrapRef.value);
          emit("scroll", {
            scrollTop: wrapRef.value.scrollTop,
            scrollLeft: wrapRef.value.scrollLeft
          });
        }
      };
      function scrollTo(arg1, arg2) {
        if (isObject$1(arg1)) {
          wrapRef.value.scrollTo(arg1);
        } else if (isNumber(arg1) && isNumber(arg2)) {
          wrapRef.value.scrollTo(arg1, arg2);
        }
      }
      const setScrollTop = (value) => {
        if (!isNumber(value)) {
          return;
        }
        wrapRef.value.scrollTop = value;
      };
      const setScrollLeft = (value) => {
        if (!isNumber(value)) {
          return;
        }
        wrapRef.value.scrollLeft = value;
      };
      const update = () => {
        if (!wrapRef.value)
          return;
        const offsetHeight = wrapRef.value.offsetHeight - GAP;
        const offsetWidth = wrapRef.value.offsetWidth - GAP;
        const originalHeight = offsetHeight ** 2 / wrapRef.value.scrollHeight;
        const originalWidth = offsetWidth ** 2 / wrapRef.value.scrollWidth;
        const height = Math.max(originalHeight, props.minSize);
        const width = Math.max(originalWidth, props.minSize);
        ratioY.value = originalHeight / (offsetHeight - originalHeight) / (height / (offsetHeight - height));
        ratioX.value = originalWidth / (offsetWidth - originalWidth) / (width / (offsetWidth - width));
        sizeHeight.value = height + GAP < offsetHeight ? `${height}px` : "";
        sizeWidth.value = width + GAP < offsetWidth ? `${width}px` : "";
      };
      vue.watch(() => props.noresize, (noresize) => {
        if (noresize) {
          stopResizeObserver == null ? void 0 : stopResizeObserver();
          stopResizeListener == null ? void 0 : stopResizeListener();
        } else {
          ({ stop: stopResizeObserver } = useResizeObserver(resizeRef, update));
          stopResizeListener = useEventListener("resize", update);
        }
      }, { immediate: true });
      vue.watch(() => [props.maxHeight, props.height], () => {
        if (!props.native)
          vue.nextTick(() => {
            var _a;
            update();
            if (wrapRef.value) {
              (_a = barRef.value) == null ? void 0 : _a.handleScroll(wrapRef.value);
            }
          });
      });
      vue.provide(scrollbarContextKey, vue.reactive({
        scrollbarElement: scrollbarRef,
        wrapElement: wrapRef
      }));
      vue.onMounted(() => {
        if (!props.native)
          vue.nextTick(() => {
            update();
          });
      });
      vue.onUpdated(() => update());
      expose({
        wrapRef,
        update,
        scrollTo,
        setScrollTop,
        setScrollLeft,
        handleScroll
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "scrollbarRef",
          ref: scrollbarRef,
          class: vue.normalizeClass(vue.unref(ns).b())
        }, [
          vue.createElementVNode("div", {
            ref_key: "wrapRef",
            ref: wrapRef,
            class: vue.normalizeClass(vue.unref(wrapKls)),
            style: vue.normalizeStyle(vue.unref(wrapStyle)),
            onScroll: handleScroll
          }, [
            (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.tag), {
              id: _ctx.id,
              ref_key: "resizeRef",
              ref: resizeRef,
              class: vue.normalizeClass(vue.unref(resizeKls)),
              style: vue.normalizeStyle(_ctx.viewStyle),
              role: _ctx.role,
              "aria-label": _ctx.ariaLabel,
              "aria-orientation": _ctx.ariaOrientation
            }, {
              default: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "default")
              ]),
              _: 3
            }, 8, ["id", "class", "style", "role", "aria-label", "aria-orientation"]))
          ], 38),
          !_ctx.native ? (vue.openBlock(), vue.createBlock(Bar, {
            key: 0,
            ref_key: "barRef",
            ref: barRef,
            height: sizeHeight.value,
            width: sizeWidth.value,
            always: _ctx.always,
            "ratio-x": ratioX.value,
            "ratio-y": ratioY.value
          }, null, 8, ["height", "width", "always", "ratio-x", "ratio-y"])) : vue.createCommentVNode("v-if", true)
        ], 2);
      };
    }
  });
  var Scrollbar$1 = /* @__PURE__ */ _export_sfc(_sfc_main$2b, [["__file", "scrollbar.vue"]]);

  const ElScrollbar = withInstall(Scrollbar$1);

  const POPPER_INJECTION_KEY = Symbol("popper");
  const POPPER_CONTENT_INJECTION_KEY = Symbol("popperContent");

  const Effect = {
    LIGHT: "light",
    DARK: "dark"
  };
  const roleTypes = [
    "dialog",
    "grid",
    "group",
    "listbox",
    "menu",
    "navigation",
    "tooltip",
    "tree"
  ];
  const popperProps = buildProps({
    role: {
      type: String,
      values: roleTypes,
      default: "tooltip"
    }
  });
  const usePopperProps = popperProps;

  const __default__$1w = vue.defineComponent({
    name: "ElPopper",
    inheritAttrs: false
  });
  const _sfc_main$2a = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1w,
    props: popperProps,
    setup(__props, { expose }) {
      const props = __props;
      const triggerRef = vue.ref();
      const popperInstanceRef = vue.ref();
      const contentRef = vue.ref();
      const referenceRef = vue.ref();
      const role = vue.computed(() => props.role);
      const popperProvides = {
        triggerRef,
        popperInstanceRef,
        contentRef,
        referenceRef,
        role
      };
      expose(popperProvides);
      vue.provide(POPPER_INJECTION_KEY, popperProvides);
      return (_ctx, _cache) => {
        return vue.renderSlot(_ctx.$slots, "default");
      };
    }
  });
  var Popper = /* @__PURE__ */ _export_sfc(_sfc_main$2a, [["__file", "popper.vue"]]);

  const popperArrowProps = buildProps({
    arrowOffset: {
      type: Number,
      default: 5
    }
  });
  const usePopperArrowProps = popperArrowProps;

  const __default__$1v = vue.defineComponent({
    name: "ElPopperArrow",
    inheritAttrs: false
  });
  const _sfc_main$29 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1v,
    props: popperArrowProps,
    setup(__props, { expose }) {
      const props = __props;
      const ns = useNamespace("popper");
      const { arrowOffset, arrowRef, arrowStyle } = vue.inject(POPPER_CONTENT_INJECTION_KEY, void 0);
      vue.watch(() => props.arrowOffset, (val) => {
        arrowOffset.value = val;
      });
      vue.onBeforeUnmount(() => {
        arrowRef.value = void 0;
      });
      expose({
        arrowRef
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("span", {
          ref_key: "arrowRef",
          ref: arrowRef,
          class: vue.normalizeClass(vue.unref(ns).e("arrow")),
          style: vue.normalizeStyle(vue.unref(arrowStyle)),
          "data-popper-arrow": ""
        }, null, 6);
      };
    }
  });
  var ElPopperArrow = /* @__PURE__ */ _export_sfc(_sfc_main$29, [["__file", "arrow.vue"]]);

  const NAME = "ElOnlyChild";
  const OnlyChild = vue.defineComponent({
    name: NAME,
    setup(_, {
      slots,
      attrs
    }) {
      var _a;
      const forwardRefInjection = vue.inject(FORWARD_REF_INJECTION_KEY);
      const forwardRefDirective = useForwardRefDirective((_a = forwardRefInjection == null ? void 0 : forwardRefInjection.setForwardRef) != null ? _a : NOOP);
      return () => {
        var _a2;
        const defaultSlot = (_a2 = slots.default) == null ? void 0 : _a2.call(slots, attrs);
        if (!defaultSlot)
          return null;
        if (defaultSlot.length > 1) {
          return null;
        }
        const firstLegitNode = findFirstLegitChild(defaultSlot);
        if (!firstLegitNode) {
          return null;
        }
        return vue.withDirectives(vue.cloneVNode(firstLegitNode, attrs), [[forwardRefDirective]]);
      };
    }
  });
  function findFirstLegitChild(node) {
    if (!node)
      return null;
    const children = node;
    for (const child of children) {
      if (isObject$1(child)) {
        switch (child.type) {
          case vue.Comment:
            continue;
          case vue.Text:
          case "svg":
            return wrapTextContent(child);
          case vue.Fragment:
            return findFirstLegitChild(child.children);
          default:
            return child;
        }
      }
      return wrapTextContent(child);
    }
    return null;
  }
  function wrapTextContent(s) {
    const ns = useNamespace("only-child");
    return vue.createVNode("span", {
      "class": ns.e("content")
    }, [s]);
  }

  const popperTriggerProps = buildProps({
    virtualRef: {
      type: definePropType(Object)
    },
    virtualTriggering: Boolean,
    onMouseenter: {
      type: definePropType(Function)
    },
    onMouseleave: {
      type: definePropType(Function)
    },
    onClick: {
      type: definePropType(Function)
    },
    onKeydown: {
      type: definePropType(Function)
    },
    onFocus: {
      type: definePropType(Function)
    },
    onBlur: {
      type: definePropType(Function)
    },
    onContextmenu: {
      type: definePropType(Function)
    },
    id: String,
    open: Boolean
  });
  const usePopperTriggerProps = popperTriggerProps;

  const __default__$1u = vue.defineComponent({
    name: "ElPopperTrigger",
    inheritAttrs: false
  });
  const _sfc_main$28 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1u,
    props: popperTriggerProps,
    setup(__props, { expose }) {
      const props = __props;
      const { role, triggerRef } = vue.inject(POPPER_INJECTION_KEY, void 0);
      useForwardRef(triggerRef);
      const ariaControls = vue.computed(() => {
        return ariaHaspopup.value ? props.id : void 0;
      });
      const ariaDescribedby = vue.computed(() => {
        if (role && role.value === "tooltip") {
          return props.open && props.id ? props.id : void 0;
        }
        return void 0;
      });
      const ariaHaspopup = vue.computed(() => {
        if (role && role.value !== "tooltip") {
          return role.value;
        }
        return void 0;
      });
      const ariaExpanded = vue.computed(() => {
        return ariaHaspopup.value ? `${props.open}` : void 0;
      });
      let virtualTriggerAriaStopWatch = void 0;
      vue.onMounted(() => {
        vue.watch(() => props.virtualRef, (virtualEl) => {
          if (virtualEl) {
            triggerRef.value = unrefElement(virtualEl);
          }
        }, {
          immediate: true
        });
        vue.watch(triggerRef, (el, prevEl) => {
          virtualTriggerAriaStopWatch == null ? void 0 : virtualTriggerAriaStopWatch();
          virtualTriggerAriaStopWatch = void 0;
          if (isElement$1(el)) {
            [
              "onMouseenter",
              "onMouseleave",
              "onClick",
              "onKeydown",
              "onFocus",
              "onBlur",
              "onContextmenu"
            ].forEach((eventName) => {
              var _a;
              const handler = props[eventName];
              if (handler) {
                el.addEventListener(eventName.slice(2).toLowerCase(), handler);
                (_a = prevEl == null ? void 0 : prevEl.removeEventListener) == null ? void 0 : _a.call(prevEl, eventName.slice(2).toLowerCase(), handler);
              }
            });
            virtualTriggerAriaStopWatch = vue.watch([ariaControls, ariaDescribedby, ariaHaspopup, ariaExpanded], (watches) => {
              [
                "aria-controls",
                "aria-describedby",
                "aria-haspopup",
                "aria-expanded"
              ].forEach((key, idx) => {
                isNil(watches[idx]) ? el.removeAttribute(key) : el.setAttribute(key, watches[idx]);
              });
            }, { immediate: true });
          }
          if (isElement$1(prevEl)) {
            [
              "aria-controls",
              "aria-describedby",
              "aria-haspopup",
              "aria-expanded"
            ].forEach((key) => prevEl.removeAttribute(key));
          }
        }, {
          immediate: true
        });
      });
      vue.onBeforeUnmount(() => {
        virtualTriggerAriaStopWatch == null ? void 0 : virtualTriggerAriaStopWatch();
        virtualTriggerAriaStopWatch = void 0;
      });
      expose({
        triggerRef
      });
      return (_ctx, _cache) => {
        return !_ctx.virtualTriggering ? (vue.openBlock(), vue.createBlock(vue.unref(OnlyChild), vue.mergeProps({ key: 0 }, _ctx.$attrs, {
          "aria-controls": vue.unref(ariaControls),
          "aria-describedby": vue.unref(ariaDescribedby),
          "aria-expanded": vue.unref(ariaExpanded),
          "aria-haspopup": vue.unref(ariaHaspopup)
        }), {
          default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "default")
          ]),
          _: 3
        }, 16, ["aria-controls", "aria-describedby", "aria-expanded", "aria-haspopup"])) : vue.createCommentVNode("v-if", true);
      };
    }
  });
  var ElPopperTrigger = /* @__PURE__ */ _export_sfc(_sfc_main$28, [["__file", "trigger.vue"]]);

  const FOCUS_AFTER_TRAPPED = "focus-trap.focus-after-trapped";
  const FOCUS_AFTER_RELEASED = "focus-trap.focus-after-released";
  const FOCUSOUT_PREVENTED = "focus-trap.focusout-prevented";
  const FOCUS_AFTER_TRAPPED_OPTS = {
    cancelable: true,
    bubbles: false
  };
  const FOCUSOUT_PREVENTED_OPTS = {
    cancelable: true,
    bubbles: false
  };
  const ON_TRAP_FOCUS_EVT = "focusAfterTrapped";
  const ON_RELEASE_FOCUS_EVT = "focusAfterReleased";
  const FOCUS_TRAP_INJECTION_KEY = Symbol("elFocusTrap");

  const focusReason = vue.ref();
  const lastUserFocusTimestamp = vue.ref(0);
  const lastAutomatedFocusTimestamp = vue.ref(0);
  let focusReasonUserCount = 0;
  const obtainAllFocusableElements = (element) => {
    const nodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node) => {
        const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
        if (node.disabled || node.hidden || isHiddenInput)
          return NodeFilter.FILTER_SKIP;
        return node.tabIndex >= 0 || node === document.activeElement ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    while (walker.nextNode())
      nodes.push(walker.currentNode);
    return nodes;
  };
  const getVisibleElement = (elements, container) => {
    for (const element of elements) {
      if (!isHidden(element, container))
        return element;
    }
  };
  const isHidden = (element, container) => {
    if (getComputedStyle(element).visibility === "hidden")
      return true;
    while (element) {
      if (container && element === container)
        return false;
      if (getComputedStyle(element).display === "none")
        return true;
      element = element.parentElement;
    }
    return false;
  };
  const getEdges = (container) => {
    const focusable = obtainAllFocusableElements(container);
    const first = getVisibleElement(focusable, container);
    const last = getVisibleElement(focusable.reverse(), container);
    return [first, last];
  };
  const isSelectable = (element) => {
    return element instanceof HTMLInputElement && "select" in element;
  };
  const tryFocus = (element, shouldSelect) => {
    if (element && element.focus) {
      const prevFocusedElement = document.activeElement;
      element.focus({ preventScroll: true });
      lastAutomatedFocusTimestamp.value = window.performance.now();
      if (element !== prevFocusedElement && isSelectable(element) && shouldSelect) {
        element.select();
      }
    }
  };
  function removeFromStack(list, item) {
    const copy = [...list];
    const idx = list.indexOf(item);
    if (idx !== -1) {
      copy.splice(idx, 1);
    }
    return copy;
  }
  const createFocusableStack = () => {
    let stack = [];
    const push = (layer) => {
      const currentLayer = stack[0];
      if (currentLayer && layer !== currentLayer) {
        currentLayer.pause();
      }
      stack = removeFromStack(stack, layer);
      stack.unshift(layer);
    };
    const remove = (layer) => {
      var _a, _b;
      stack = removeFromStack(stack, layer);
      (_b = (_a = stack[0]) == null ? void 0 : _a.resume) == null ? void 0 : _b.call(_a);
    };
    return {
      push,
      remove
    };
  };
  const focusFirstDescendant = (elements, shouldSelect = false) => {
    const prevFocusedElement = document.activeElement;
    for (const element of elements) {
      tryFocus(element, shouldSelect);
      if (document.activeElement !== prevFocusedElement)
        return;
    }
  };
  const focusableStack = createFocusableStack();
  const isFocusCausedByUserEvent = () => {
    return lastUserFocusTimestamp.value > lastAutomatedFocusTimestamp.value;
  };
  const notifyFocusReasonPointer = () => {
    focusReason.value = "pointer";
    lastUserFocusTimestamp.value = window.performance.now();
  };
  const notifyFocusReasonKeydown = () => {
    focusReason.value = "keyboard";
    lastUserFocusTimestamp.value = window.performance.now();
  };
  const useFocusReason = () => {
    vue.onMounted(() => {
      if (focusReasonUserCount === 0) {
        document.addEventListener("mousedown", notifyFocusReasonPointer);
        document.addEventListener("touchstart", notifyFocusReasonPointer);
        document.addEventListener("keydown", notifyFocusReasonKeydown);
      }
      focusReasonUserCount++;
    });
    vue.onBeforeUnmount(() => {
      focusReasonUserCount--;
      if (focusReasonUserCount <= 0) {
        document.removeEventListener("mousedown", notifyFocusReasonPointer);
        document.removeEventListener("touchstart", notifyFocusReasonPointer);
        document.removeEventListener("keydown", notifyFocusReasonKeydown);
      }
    });
    return {
      focusReason,
      lastUserFocusTimestamp,
      lastAutomatedFocusTimestamp
    };
  };
  const createFocusOutPreventedEvent = (detail) => {
    return new CustomEvent(FOCUSOUT_PREVENTED, {
      ...FOCUSOUT_PREVENTED_OPTS,
      detail
    });
  };

  const _sfc_main$27 = vue.defineComponent({
    name: "ElFocusTrap",
    inheritAttrs: false,
    props: {
      loop: Boolean,
      trapped: Boolean,
      focusTrapEl: Object,
      focusStartEl: {
        type: [Object, String],
        default: "first"
      }
    },
    emits: [
      ON_TRAP_FOCUS_EVT,
      ON_RELEASE_FOCUS_EVT,
      "focusin",
      "focusout",
      "focusout-prevented",
      "release-requested"
    ],
    setup(props, { emit }) {
      const forwardRef = vue.ref();
      let lastFocusBeforeTrapped;
      let lastFocusAfterTrapped;
      const { focusReason } = useFocusReason();
      useEscapeKeydown((event) => {
        if (props.trapped && !focusLayer.paused) {
          emit("release-requested", event);
        }
      });
      const focusLayer = {
        paused: false,
        pause() {
          this.paused = true;
        },
        resume() {
          this.paused = false;
        }
      };
      const onKeydown = (e) => {
        if (!props.loop && !props.trapped)
          return;
        if (focusLayer.paused)
          return;
        const { key, altKey, ctrlKey, metaKey, currentTarget, shiftKey } = e;
        const { loop } = props;
        const isTabbing = key === EVENT_CODE.tab && !altKey && !ctrlKey && !metaKey;
        const currentFocusingEl = document.activeElement;
        if (isTabbing && currentFocusingEl) {
          const container = currentTarget;
          const [first, last] = getEdges(container);
          const isTabbable = first && last;
          if (!isTabbable) {
            if (currentFocusingEl === container) {
              const focusoutPreventedEvent = createFocusOutPreventedEvent({
                focusReason: focusReason.value
              });
              emit("focusout-prevented", focusoutPreventedEvent);
              if (!focusoutPreventedEvent.defaultPrevented) {
                e.preventDefault();
              }
            }
          } else {
            if (!shiftKey && currentFocusingEl === last) {
              const focusoutPreventedEvent = createFocusOutPreventedEvent({
                focusReason: focusReason.value
              });
              emit("focusout-prevented", focusoutPreventedEvent);
              if (!focusoutPreventedEvent.defaultPrevented) {
                e.preventDefault();
                if (loop)
                  tryFocus(first, true);
              }
            } else if (shiftKey && [first, container].includes(currentFocusingEl)) {
              const focusoutPreventedEvent = createFocusOutPreventedEvent({
                focusReason: focusReason.value
              });
              emit("focusout-prevented", focusoutPreventedEvent);
              if (!focusoutPreventedEvent.defaultPrevented) {
                e.preventDefault();
                if (loop)
                  tryFocus(last, true);
              }
            }
          }
        }
      };
      vue.provide(FOCUS_TRAP_INJECTION_KEY, {
        focusTrapRef: forwardRef,
        onKeydown
      });
      vue.watch(() => props.focusTrapEl, (focusTrapEl) => {
        if (focusTrapEl) {
          forwardRef.value = focusTrapEl;
        }
      }, { immediate: true });
      vue.watch([forwardRef], ([forwardRef2], [oldForwardRef]) => {
        if (forwardRef2) {
          forwardRef2.addEventListener("keydown", onKeydown);
          forwardRef2.addEventListener("focusin", onFocusIn);
          forwardRef2.addEventListener("focusout", onFocusOut);
        }
        if (oldForwardRef) {
          oldForwardRef.removeEventListener("keydown", onKeydown);
          oldForwardRef.removeEventListener("focusin", onFocusIn);
          oldForwardRef.removeEventListener("focusout", onFocusOut);
        }
      });
      const trapOnFocus = (e) => {
        emit(ON_TRAP_FOCUS_EVT, e);
      };
      const releaseOnFocus = (e) => emit(ON_RELEASE_FOCUS_EVT, e);
      const onFocusIn = (e) => {
        const trapContainer = vue.unref(forwardRef);
        if (!trapContainer)
          return;
        const target = e.target;
        const relatedTarget = e.relatedTarget;
        const isFocusedInTrap = target && trapContainer.contains(target);
        if (!props.trapped) {
          const isPrevFocusedInTrap = relatedTarget && trapContainer.contains(relatedTarget);
          if (!isPrevFocusedInTrap) {
            lastFocusBeforeTrapped = relatedTarget;
          }
        }
        if (isFocusedInTrap)
          emit("focusin", e);
        if (focusLayer.paused)
          return;
        if (props.trapped) {
          if (isFocusedInTrap) {
            lastFocusAfterTrapped = target;
          } else {
            tryFocus(lastFocusAfterTrapped, true);
          }
        }
      };
      const onFocusOut = (e) => {
        const trapContainer = vue.unref(forwardRef);
        if (focusLayer.paused || !trapContainer)
          return;
        if (props.trapped) {
          const relatedTarget = e.relatedTarget;
          if (!isNil(relatedTarget) && !trapContainer.contains(relatedTarget)) {
            setTimeout(() => {
              if (!focusLayer.paused && props.trapped) {
                const focusoutPreventedEvent = createFocusOutPreventedEvent({
                  focusReason: focusReason.value
                });
                emit("focusout-prevented", focusoutPreventedEvent);
                if (!focusoutPreventedEvent.defaultPrevented) {
                  tryFocus(lastFocusAfterTrapped, true);
                }
              }
            }, 0);
          }
        } else {
          const target = e.target;
          const isFocusedInTrap = target && trapContainer.contains(target);
          if (!isFocusedInTrap)
            emit("focusout", e);
        }
      };
      async function startTrap() {
        await vue.nextTick();
        const trapContainer = vue.unref(forwardRef);
        if (trapContainer) {
          focusableStack.push(focusLayer);
          const prevFocusedElement = trapContainer.contains(document.activeElement) ? lastFocusBeforeTrapped : document.activeElement;
          lastFocusBeforeTrapped = prevFocusedElement;
          const isPrevFocusContained = trapContainer.contains(prevFocusedElement);
          if (!isPrevFocusContained) {
            const focusEvent = new Event(FOCUS_AFTER_TRAPPED, FOCUS_AFTER_TRAPPED_OPTS);
            trapContainer.addEventListener(FOCUS_AFTER_TRAPPED, trapOnFocus);
            trapContainer.dispatchEvent(focusEvent);
            if (!focusEvent.defaultPrevented) {
              vue.nextTick(() => {
                let focusStartEl = props.focusStartEl;
                if (!isString$1(focusStartEl)) {
                  tryFocus(focusStartEl);
                  if (document.activeElement !== focusStartEl) {
                    focusStartEl = "first";
                  }
                }
                if (focusStartEl === "first") {
                  focusFirstDescendant(obtainAllFocusableElements(trapContainer), true);
                }
                if (document.activeElement === prevFocusedElement || focusStartEl === "container") {
                  tryFocus(trapContainer);
                }
              });
            }
          }
        }
      }
      function stopTrap() {
        const trapContainer = vue.unref(forwardRef);
        if (trapContainer) {
          trapContainer.removeEventListener(FOCUS_AFTER_TRAPPED, trapOnFocus);
          const releasedEvent = new CustomEvent(FOCUS_AFTER_RELEASED, {
            ...FOCUS_AFTER_TRAPPED_OPTS,
            detail: {
              focusReason: focusReason.value
            }
          });
          trapContainer.addEventListener(FOCUS_AFTER_RELEASED, releaseOnFocus);
          trapContainer.dispatchEvent(releasedEvent);
          if (!releasedEvent.defaultPrevented && (focusReason.value == "keyboard" || !isFocusCausedByUserEvent() || trapContainer.contains(document.activeElement))) {
            tryFocus(lastFocusBeforeTrapped != null ? lastFocusBeforeTrapped : document.body);
          }
          trapContainer.removeEventListener(FOCUS_AFTER_RELEASED, releaseOnFocus);
          focusableStack.remove(focusLayer);
        }
      }
      vue.onMounted(() => {
        if (props.trapped) {
          startTrap();
        }
        vue.watch(() => props.trapped, (trapped) => {
          if (trapped) {
            startTrap();
          } else {
            stopTrap();
          }
        });
      });
      vue.onBeforeUnmount(() => {
        if (props.trapped) {
          stopTrap();
        }
      });
      return {
        onKeydown
      };
    }
  });
  function _sfc_render$v(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.renderSlot(_ctx.$slots, "default", { handleKeydown: _ctx.onKeydown });
  }
  var ElFocusTrap = /* @__PURE__ */ _export_sfc(_sfc_main$27, [["render", _sfc_render$v], ["__file", "focus-trap.vue"]]);

  const POSITIONING_STRATEGIES = ["fixed", "absolute"];
  const popperCoreConfigProps = buildProps({
    boundariesPadding: {
      type: Number,
      default: 0
    },
    fallbackPlacements: {
      type: definePropType(Array),
      default: void 0
    },
    gpuAcceleration: {
      type: Boolean,
      default: true
    },
    offset: {
      type: Number,
      default: 12
    },
    placement: {
      type: String,
      values: Ee,
      default: "bottom"
    },
    popperOptions: {
      type: definePropType(Object),
      default: () => ({})
    },
    strategy: {
      type: String,
      values: POSITIONING_STRATEGIES,
      default: "absolute"
    }
  });
  const popperContentProps = buildProps({
    ...popperCoreConfigProps,
    id: String,
    style: {
      type: definePropType([String, Array, Object])
    },
    className: {
      type: definePropType([String, Array, Object])
    },
    effect: {
      type: String,
      default: "dark"
    },
    visible: Boolean,
    enterable: {
      type: Boolean,
      default: true
    },
    pure: Boolean,
    focusOnShow: {
      type: Boolean,
      default: false
    },
    trapping: {
      type: Boolean,
      default: false
    },
    popperClass: {
      type: definePropType([String, Array, Object])
    },
    popperStyle: {
      type: definePropType([String, Array, Object])
    },
    referenceEl: {
      type: definePropType(Object)
    },
    triggerTargetEl: {
      type: definePropType(Object)
    },
    stopPopperMouseEvent: {
      type: Boolean,
      default: true
    },
    ariaLabel: {
      type: String,
      default: void 0
    },
    virtualTriggering: Boolean,
    zIndex: Number
  });
  const popperContentEmits = {
    mouseenter: (evt) => evt instanceof MouseEvent,
    mouseleave: (evt) => evt instanceof MouseEvent,
    focus: () => true,
    blur: () => true,
    close: () => true
  };
  const usePopperCoreConfigProps = popperCoreConfigProps;
  const usePopperContentProps = popperContentProps;
  const usePopperContentEmits = popperContentEmits;

  const buildPopperOptions = (props, modifiers = []) => {
    const { placement, strategy, popperOptions } = props;
    const options = {
      placement,
      strategy,
      ...popperOptions,
      modifiers: [...genModifiers(props), ...modifiers]
    };
    deriveExtraModifiers(options, popperOptions == null ? void 0 : popperOptions.modifiers);
    return options;
  };
  const unwrapMeasurableEl = ($el) => {
    if (!isClient)
      return;
    return unrefElement($el);
  };
  function genModifiers(options) {
    const { offset, gpuAcceleration, fallbackPlacements } = options;
    return [
      {
        name: "offset",
        options: {
          offset: [0, offset != null ? offset : 12]
        }
      },
      {
        name: "preventOverflow",
        options: {
          padding: {
            top: 2,
            bottom: 2,
            left: 5,
            right: 5
          }
        }
      },
      {
        name: "flip",
        options: {
          padding: 5,
          fallbackPlacements
        }
      },
      {
        name: "computeStyles",
        options: {
          gpuAcceleration
        }
      }
    ];
  }
  function deriveExtraModifiers(options, modifiers) {
    if (modifiers) {
      options.modifiers = [...options.modifiers, ...modifiers != null ? modifiers : []];
    }
  }

  const DEFAULT_ARROW_OFFSET = 0;
  const usePopperContent = (props) => {
    const { popperInstanceRef, contentRef, triggerRef, role } = vue.inject(POPPER_INJECTION_KEY, void 0);
    const arrowRef = vue.ref();
    const arrowOffset = vue.ref();
    const eventListenerModifier = vue.computed(() => {
      return {
        name: "eventListeners",
        enabled: !!props.visible
      };
    });
    const arrowModifier = vue.computed(() => {
      var _a;
      const arrowEl = vue.unref(arrowRef);
      const offset = (_a = vue.unref(arrowOffset)) != null ? _a : DEFAULT_ARROW_OFFSET;
      return {
        name: "arrow",
        enabled: !isUndefined$1(arrowEl),
        options: {
          element: arrowEl,
          padding: offset
        }
      };
    });
    const options = vue.computed(() => {
      return {
        onFirstUpdate: () => {
          update();
        },
        ...buildPopperOptions(props, [
          vue.unref(arrowModifier),
          vue.unref(eventListenerModifier)
        ])
      };
    });
    const computedReference = vue.computed(() => unwrapMeasurableEl(props.referenceEl) || vue.unref(triggerRef));
    const { attributes, state, styles, update, forceUpdate, instanceRef } = usePopper(computedReference, contentRef, options);
    vue.watch(instanceRef, (instance) => popperInstanceRef.value = instance);
    vue.onMounted(() => {
      vue.watch(() => {
        var _a;
        return (_a = vue.unref(computedReference)) == null ? void 0 : _a.getBoundingClientRect();
      }, () => {
        update();
      });
    });
    return {
      attributes,
      arrowRef,
      contentRef,
      instanceRef,
      state,
      styles,
      role,
      forceUpdate,
      update
    };
  };

  const usePopperContentDOM = (props, {
    attributes,
    styles,
    role
  }) => {
    const { nextZIndex } = useZIndex();
    const ns = useNamespace("popper");
    const contentAttrs = vue.computed(() => vue.unref(attributes).popper);
    const contentZIndex = vue.ref(isNumber(props.zIndex) ? props.zIndex : nextZIndex());
    const contentClass = vue.computed(() => [
      ns.b(),
      ns.is("pure", props.pure),
      ns.is(props.effect),
      props.popperClass
    ]);
    const contentStyle = vue.computed(() => {
      return [
        { zIndex: vue.unref(contentZIndex) },
        vue.unref(styles).popper,
        props.popperStyle || {}
      ];
    });
    const ariaModal = vue.computed(() => role.value === "dialog" ? "false" : void 0);
    const arrowStyle = vue.computed(() => vue.unref(styles).arrow || {});
    const updateZIndex = () => {
      contentZIndex.value = isNumber(props.zIndex) ? props.zIndex : nextZIndex();
    };
    return {
      ariaModal,
      arrowStyle,
      contentAttrs,
      contentClass,
      contentStyle,
      contentZIndex,
      updateZIndex
    };
  };

  const usePopperContentFocusTrap = (props, emit) => {
    const trapped = vue.ref(false);
    const focusStartRef = vue.ref();
    const onFocusAfterTrapped = () => {
      emit("focus");
    };
    const onFocusAfterReleased = (event) => {
      var _a;
      if (((_a = event.detail) == null ? void 0 : _a.focusReason) !== "pointer") {
        focusStartRef.value = "first";
        emit("blur");
      }
    };
    const onFocusInTrap = (event) => {
      if (props.visible && !trapped.value) {
        if (event.target) {
          focusStartRef.value = event.target;
        }
        trapped.value = true;
      }
    };
    const onFocusoutPrevented = (event) => {
      if (!props.trapping) {
        if (event.detail.focusReason === "pointer") {
          event.preventDefault();
        }
        trapped.value = false;
      }
    };
    const onReleaseRequested = () => {
      trapped.value = false;
      emit("close");
    };
    return {
      focusStartRef,
      trapped,
      onFocusAfterReleased,
      onFocusAfterTrapped,
      onFocusInTrap,
      onFocusoutPrevented,
      onReleaseRequested
    };
  };

  const __default__$1t = vue.defineComponent({
    name: "ElPopperContent"
  });
  const _sfc_main$26 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1t,
    props: popperContentProps,
    emits: popperContentEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const {
        focusStartRef,
        trapped,
        onFocusAfterReleased,
        onFocusAfterTrapped,
        onFocusInTrap,
        onFocusoutPrevented,
        onReleaseRequested
      } = usePopperContentFocusTrap(props, emit);
      const { attributes, arrowRef, contentRef, styles, instanceRef, role, update } = usePopperContent(props);
      const {
        ariaModal,
        arrowStyle,
        contentAttrs,
        contentClass,
        contentStyle,
        updateZIndex
      } = usePopperContentDOM(props, {
        styles,
        attributes,
        role
      });
      const formItemContext = vue.inject(formItemContextKey, void 0);
      const arrowOffset = vue.ref();
      vue.provide(POPPER_CONTENT_INJECTION_KEY, {
        arrowStyle,
        arrowRef,
        arrowOffset
      });
      if (formItemContext && (formItemContext.addInputId || formItemContext.removeInputId)) {
        vue.provide(formItemContextKey, {
          ...formItemContext,
          addInputId: NOOP,
          removeInputId: NOOP
        });
      }
      let triggerTargetAriaStopWatch = void 0;
      const updatePopper = (shouldUpdateZIndex = true) => {
        update();
        shouldUpdateZIndex && updateZIndex();
      };
      const togglePopperAlive = () => {
        updatePopper(false);
        if (props.visible && props.focusOnShow) {
          trapped.value = true;
        } else if (props.visible === false) {
          trapped.value = false;
        }
      };
      vue.onMounted(() => {
        vue.watch(() => props.triggerTargetEl, (triggerTargetEl, prevTriggerTargetEl) => {
          triggerTargetAriaStopWatch == null ? void 0 : triggerTargetAriaStopWatch();
          triggerTargetAriaStopWatch = void 0;
          const el = vue.unref(triggerTargetEl || contentRef.value);
          const prevEl = vue.unref(prevTriggerTargetEl || contentRef.value);
          if (isElement$1(el)) {
            triggerTargetAriaStopWatch = vue.watch([role, () => props.ariaLabel, ariaModal, () => props.id], (watches) => {
              ["role", "aria-label", "aria-modal", "id"].forEach((key, idx) => {
                isNil(watches[idx]) ? el.removeAttribute(key) : el.setAttribute(key, watches[idx]);
              });
            }, { immediate: true });
          }
          if (prevEl !== el && isElement$1(prevEl)) {
            ["role", "aria-label", "aria-modal", "id"].forEach((key) => {
              prevEl.removeAttribute(key);
            });
          }
        }, { immediate: true });
        vue.watch(() => props.visible, togglePopperAlive, { immediate: true });
      });
      vue.onBeforeUnmount(() => {
        triggerTargetAriaStopWatch == null ? void 0 : triggerTargetAriaStopWatch();
        triggerTargetAriaStopWatch = void 0;
      });
      expose({
        popperContentRef: contentRef,
        popperInstanceRef: instanceRef,
        updatePopper,
        contentStyle
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", vue.mergeProps({
          ref_key: "contentRef",
          ref: contentRef
        }, vue.unref(contentAttrs), {
          style: vue.unref(contentStyle),
          class: vue.unref(contentClass),
          tabindex: "-1",
          onMouseenter: _cache[0] || (_cache[0] = (e) => _ctx.$emit("mouseenter", e)),
          onMouseleave: _cache[1] || (_cache[1] = (e) => _ctx.$emit("mouseleave", e))
        }), [
          vue.createVNode(vue.unref(ElFocusTrap), {
            trapped: vue.unref(trapped),
            "trap-on-focus-in": true,
            "focus-trap-el": vue.unref(contentRef),
            "focus-start-el": vue.unref(focusStartRef),
            onFocusAfterTrapped: vue.unref(onFocusAfterTrapped),
            onFocusAfterReleased: vue.unref(onFocusAfterReleased),
            onFocusin: vue.unref(onFocusInTrap),
            onFocusoutPrevented: vue.unref(onFocusoutPrevented),
            onReleaseRequested: vue.unref(onReleaseRequested)
          }, {
            default: vue.withCtx(() => [
              vue.renderSlot(_ctx.$slots, "default")
            ]),
            _: 3
          }, 8, ["trapped", "focus-trap-el", "focus-start-el", "onFocusAfterTrapped", "onFocusAfterReleased", "onFocusin", "onFocusoutPrevented", "onReleaseRequested"])
        ], 16);
      };
    }
  });
  var ElPopperContent = /* @__PURE__ */ _export_sfc(_sfc_main$26, [["__file", "content.vue"]]);

  const ElPopper = withInstall(Popper);

  const TOOLTIP_INJECTION_KEY = Symbol("elTooltip");

  const useTooltipContentProps = buildProps({
    ...useDelayedToggleProps,
    ...popperContentProps,
    appendTo: {
      type: definePropType([String, Object])
    },
    content: {
      type: String,
      default: ""
    },
    rawContent: {
      type: Boolean,
      default: false
    },
    persistent: Boolean,
    ariaLabel: String,
    visible: {
      type: definePropType(Boolean),
      default: null
    },
    transition: String,
    teleported: {
      type: Boolean,
      default: true
    },
    disabled: Boolean
  });

  const useTooltipTriggerProps = buildProps({
    ...popperTriggerProps,
    disabled: Boolean,
    trigger: {
      type: definePropType([String, Array]),
      default: "hover"
    },
    triggerKeys: {
      type: definePropType(Array),
      default: () => [EVENT_CODE.enter, EVENT_CODE.space]
    }
  });

  const {
    useModelToggleProps: useTooltipModelToggleProps,
    useModelToggleEmits: useTooltipModelToggleEmits,
    useModelToggle: useTooltipModelToggle
  } = createModelToggleComposable("visible");
  const useTooltipProps = buildProps({
    ...popperProps,
    ...useTooltipModelToggleProps,
    ...useTooltipContentProps,
    ...useTooltipTriggerProps,
    ...popperArrowProps,
    showArrow: {
      type: Boolean,
      default: true
    }
  });
  const tooltipEmits = [
    ...useTooltipModelToggleEmits,
    "before-show",
    "before-hide",
    "show",
    "hide",
    "open",
    "close"
  ];

  const isTriggerType = (trigger, type) => {
    if (isArray$1(trigger)) {
      return trigger.includes(type);
    }
    return trigger === type;
  };
  const whenTrigger = (trigger, type, handler) => {
    return (e) => {
      isTriggerType(vue.unref(trigger), type) && handler(e);
    };
  };

  const __default__$1s = vue.defineComponent({
    name: "ElTooltipTrigger"
  });
  const _sfc_main$25 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1s,
    props: useTooltipTriggerProps,
    setup(__props, { expose }) {
      const props = __props;
      const ns = useNamespace("tooltip");
      const { controlled, id, open, onOpen, onClose, onToggle } = vue.inject(TOOLTIP_INJECTION_KEY, void 0);
      const triggerRef = vue.ref(null);
      const stopWhenControlledOrDisabled = () => {
        if (vue.unref(controlled) || props.disabled) {
          return true;
        }
      };
      const trigger = vue.toRef(props, "trigger");
      const onMouseenter = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "hover", onOpen));
      const onMouseleave = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "hover", onClose));
      const onClick = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "click", (e) => {
        if (e.button === 0) {
          onToggle(e);
        }
      }));
      const onFocus = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "focus", onOpen));
      const onBlur = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "focus", onClose));
      const onContextMenu = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "contextmenu", (e) => {
        e.preventDefault();
        onToggle(e);
      }));
      const onKeydown = composeEventHandlers(stopWhenControlledOrDisabled, (e) => {
        const { code } = e;
        if (props.triggerKeys.includes(code)) {
          e.preventDefault();
          onToggle(e);
        }
      });
      expose({
        triggerRef
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(ElPopperTrigger), {
          id: vue.unref(id),
          "virtual-ref": _ctx.virtualRef,
          open: vue.unref(open),
          "virtual-triggering": _ctx.virtualTriggering,
          class: vue.normalizeClass(vue.unref(ns).e("trigger")),
          onBlur: vue.unref(onBlur),
          onClick: vue.unref(onClick),
          onContextmenu: vue.unref(onContextMenu),
          onFocus: vue.unref(onFocus),
          onMouseenter: vue.unref(onMouseenter),
          onMouseleave: vue.unref(onMouseleave),
          onKeydown: vue.unref(onKeydown)
        }, {
          default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "default")
          ]),
          _: 3
        }, 8, ["id", "virtual-ref", "open", "virtual-triggering", "class", "onBlur", "onClick", "onContextmenu", "onFocus", "onMouseenter", "onMouseleave", "onKeydown"]);
      };
    }
  });
  var ElTooltipTrigger = /* @__PURE__ */ _export_sfc(_sfc_main$25, [["__file", "trigger.vue"]]);

  const __default__$1r = vue.defineComponent({
    name: "ElTooltipContent",
    inheritAttrs: false
  });
  const _sfc_main$24 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1r,
    props: useTooltipContentProps,
    setup(__props, { expose }) {
      const props = __props;
      const { selector } = usePopperContainerId();
      const ns = useNamespace("tooltip");
      const contentRef = vue.ref(null);
      const destroyed = vue.ref(false);
      const {
        controlled,
        id,
        open,
        trigger,
        onClose,
        onOpen,
        onShow,
        onHide,
        onBeforeShow,
        onBeforeHide
      } = vue.inject(TOOLTIP_INJECTION_KEY, void 0);
      const transitionClass = vue.computed(() => {
        return props.transition || `${ns.namespace.value}-fade-in-linear`;
      });
      const persistentRef = vue.computed(() => {
        return props.persistent;
      });
      vue.onBeforeUnmount(() => {
        destroyed.value = true;
      });
      const shouldRender = vue.computed(() => {
        return vue.unref(persistentRef) ? true : vue.unref(open);
      });
      const shouldShow = vue.computed(() => {
        return props.disabled ? false : vue.unref(open);
      });
      const appendTo = vue.computed(() => {
        return props.appendTo || selector.value;
      });
      const contentStyle = vue.computed(() => {
        var _a;
        return (_a = props.style) != null ? _a : {};
      });
      const ariaHidden = vue.computed(() => !vue.unref(open));
      const onTransitionLeave = () => {
        onHide();
      };
      const stopWhenControlled = () => {
        if (vue.unref(controlled))
          return true;
      };
      const onContentEnter = composeEventHandlers(stopWhenControlled, () => {
        if (props.enterable && vue.unref(trigger) === "hover") {
          onOpen();
        }
      });
      const onContentLeave = composeEventHandlers(stopWhenControlled, () => {
        if (vue.unref(trigger) === "hover") {
          onClose();
        }
      });
      const onBeforeEnter = () => {
        var _a, _b;
        (_b = (_a = contentRef.value) == null ? void 0 : _a.updatePopper) == null ? void 0 : _b.call(_a);
        onBeforeShow == null ? void 0 : onBeforeShow();
      };
      const onBeforeLeave = () => {
        onBeforeHide == null ? void 0 : onBeforeHide();
      };
      const onAfterShow = () => {
        onShow();
        stopHandle = onClickOutside(vue.computed(() => {
          var _a;
          return (_a = contentRef.value) == null ? void 0 : _a.popperContentRef;
        }), () => {
          if (vue.unref(controlled))
            return;
          const $trigger = vue.unref(trigger);
          if ($trigger !== "hover") {
            onClose();
          }
        });
      };
      const onBlur = () => {
        if (!props.virtualTriggering) {
          onClose();
        }
      };
      let stopHandle;
      vue.watch(() => vue.unref(open), (val) => {
        if (!val) {
          stopHandle == null ? void 0 : stopHandle();
        }
      }, {
        flush: "post"
      });
      vue.watch(() => props.content, () => {
        var _a, _b;
        (_b = (_a = contentRef.value) == null ? void 0 : _a.updatePopper) == null ? void 0 : _b.call(_a);
      });
      expose({
        contentRef
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Teleport, {
          disabled: !_ctx.teleported,
          to: vue.unref(appendTo)
        }, [
          vue.createVNode(vue.Transition, {
            name: vue.unref(transitionClass),
            onAfterLeave: onTransitionLeave,
            onBeforeEnter,
            onAfterEnter: onAfterShow,
            onBeforeLeave
          }, {
            default: vue.withCtx(() => [
              vue.unref(shouldRender) ? vue.withDirectives((vue.openBlock(), vue.createBlock(vue.unref(ElPopperContent), vue.mergeProps({
                key: 0,
                id: vue.unref(id),
                ref_key: "contentRef",
                ref: contentRef
              }, _ctx.$attrs, {
                "aria-label": _ctx.ariaLabel,
                "aria-hidden": vue.unref(ariaHidden),
                "boundaries-padding": _ctx.boundariesPadding,
                "fallback-placements": _ctx.fallbackPlacements,
                "gpu-acceleration": _ctx.gpuAcceleration,
                offset: _ctx.offset,
                placement: _ctx.placement,
                "popper-options": _ctx.popperOptions,
                strategy: _ctx.strategy,
                effect: _ctx.effect,
                enterable: _ctx.enterable,
                pure: _ctx.pure,
                "popper-class": _ctx.popperClass,
                "popper-style": [_ctx.popperStyle, vue.unref(contentStyle)],
                "reference-el": _ctx.referenceEl,
                "trigger-target-el": _ctx.triggerTargetEl,
                visible: vue.unref(shouldShow),
                "z-index": _ctx.zIndex,
                onMouseenter: vue.unref(onContentEnter),
                onMouseleave: vue.unref(onContentLeave),
                onBlur,
                onClose: vue.unref(onClose)
              }), {
                default: vue.withCtx(() => [
                  !destroyed.value ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : vue.createCommentVNode("v-if", true)
                ]),
                _: 3
              }, 16, ["id", "aria-label", "aria-hidden", "boundaries-padding", "fallback-placements", "gpu-acceleration", "offset", "placement", "popper-options", "strategy", "effect", "enterable", "pure", "popper-class", "popper-style", "reference-el", "trigger-target-el", "visible", "z-index", "onMouseenter", "onMouseleave", "onClose"])), [
                [vue.vShow, vue.unref(shouldShow)]
              ]) : vue.createCommentVNode("v-if", true)
            ]),
            _: 3
          }, 8, ["name"])
        ], 8, ["disabled", "to"]);
      };
    }
  });
  var ElTooltipContent = /* @__PURE__ */ _export_sfc(_sfc_main$24, [["__file", "content.vue"]]);

  const _hoisted_1$11 = ["innerHTML"];
  const _hoisted_2$G = { key: 1 };
  const __default__$1q = vue.defineComponent({
    name: "ElTooltip"
  });
  const _sfc_main$23 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1q,
    props: useTooltipProps,
    emits: tooltipEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      usePopperContainer();
      const id = useId();
      const popperRef = vue.ref();
      const contentRef = vue.ref();
      const updatePopper = () => {
        var _a;
        const popperComponent = vue.unref(popperRef);
        if (popperComponent) {
          (_a = popperComponent.popperInstanceRef) == null ? void 0 : _a.update();
        }
      };
      const open = vue.ref(false);
      const toggleReason = vue.ref();
      const { show, hide, hasUpdateHandler } = useTooltipModelToggle({
        indicator: open,
        toggleReason
      });
      const { onOpen, onClose } = useDelayedToggle({
        showAfter: vue.toRef(props, "showAfter"),
        hideAfter: vue.toRef(props, "hideAfter"),
        autoClose: vue.toRef(props, "autoClose"),
        open: show,
        close: hide
      });
      const controlled = vue.computed(() => isBoolean(props.visible) && !hasUpdateHandler.value);
      vue.provide(TOOLTIP_INJECTION_KEY, {
        controlled,
        id,
        open: vue.readonly(open),
        trigger: vue.toRef(props, "trigger"),
        onOpen: (event) => {
          onOpen(event);
        },
        onClose: (event) => {
          onClose(event);
        },
        onToggle: (event) => {
          if (vue.unref(open)) {
            onClose(event);
          } else {
            onOpen(event);
          }
        },
        onShow: () => {
          emit("show", toggleReason.value);
        },
        onHide: () => {
          emit("hide", toggleReason.value);
        },
        onBeforeShow: () => {
          emit("before-show", toggleReason.value);
        },
        onBeforeHide: () => {
          emit("before-hide", toggleReason.value);
        },
        updatePopper
      });
      vue.watch(() => props.disabled, (disabled) => {
        if (disabled && open.value) {
          open.value = false;
        }
      });
      const isFocusInsideContent = (event) => {
        var _a, _b;
        const popperContent = (_b = (_a = contentRef.value) == null ? void 0 : _a.contentRef) == null ? void 0 : _b.popperContentRef;
        const activeElement = (event == null ? void 0 : event.relatedTarget) || document.activeElement;
        return popperContent && popperContent.contains(activeElement);
      };
      vue.onDeactivated(() => open.value && hide());
      expose({
        popperRef,
        contentRef,
        isFocusInsideContent,
        updatePopper,
        onOpen,
        onClose,
        hide
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(ElPopper), {
          ref_key: "popperRef",
          ref: popperRef,
          role: _ctx.role
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(ElTooltipTrigger, {
              disabled: _ctx.disabled,
              trigger: _ctx.trigger,
              "trigger-keys": _ctx.triggerKeys,
              "virtual-ref": _ctx.virtualRef,
              "virtual-triggering": _ctx.virtualTriggering
            }, {
              default: vue.withCtx(() => [
                _ctx.$slots.default ? vue.renderSlot(_ctx.$slots, "default", { key: 0 }) : vue.createCommentVNode("v-if", true)
              ]),
              _: 3
            }, 8, ["disabled", "trigger", "trigger-keys", "virtual-ref", "virtual-triggering"]),
            vue.createVNode(ElTooltipContent, {
              ref_key: "contentRef",
              ref: contentRef,
              "aria-label": _ctx.ariaLabel,
              "boundaries-padding": _ctx.boundariesPadding,
              content: _ctx.content,
              disabled: _ctx.disabled,
              effect: _ctx.effect,
              enterable: _ctx.enterable,
              "fallback-placements": _ctx.fallbackPlacements,
              "hide-after": _ctx.hideAfter,
              "gpu-acceleration": _ctx.gpuAcceleration,
              offset: _ctx.offset,
              persistent: _ctx.persistent,
              "popper-class": _ctx.popperClass,
              "popper-style": _ctx.popperStyle,
              placement: _ctx.placement,
              "popper-options": _ctx.popperOptions,
              pure: _ctx.pure,
              "raw-content": _ctx.rawContent,
              "reference-el": _ctx.referenceEl,
              "trigger-target-el": _ctx.triggerTargetEl,
              "show-after": _ctx.showAfter,
              strategy: _ctx.strategy,
              teleported: _ctx.teleported,
              transition: _ctx.transition,
              "virtual-triggering": _ctx.virtualTriggering,
              "z-index": _ctx.zIndex,
              "append-to": _ctx.appendTo
            }, {
              default: vue.withCtx(() => [
                vue.renderSlot(_ctx.$slots, "content", {}, () => [
                  _ctx.rawContent ? (vue.openBlock(), vue.createElementBlock("span", {
                    key: 0,
                    innerHTML: _ctx.content
                  }, null, 8, _hoisted_1$11)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_2$G, vue.toDisplayString(_ctx.content), 1))
                ]),
                _ctx.showArrow ? (vue.openBlock(), vue.createBlock(vue.unref(ElPopperArrow), {
                  key: 0,
                  "arrow-offset": _ctx.arrowOffset
                }, null, 8, ["arrow-offset"])) : vue.createCommentVNode("v-if", true)
              ]),
              _: 3
            }, 8, ["aria-label", "boundaries-padding", "content", "disabled", "effect", "enterable", "fallback-placements", "hide-after", "gpu-acceleration", "offset", "persistent", "popper-class", "popper-style", "placement", "popper-options", "pure", "raw-content", "reference-el", "trigger-target-el", "show-after", "strategy", "teleported", "transition", "virtual-triggering", "z-index", "append-to"])
          ]),
          _: 3
        }, 8, ["role"]);
      };
    }
  });
  var Tooltip = /* @__PURE__ */ _export_sfc(_sfc_main$23, [["__file", "tooltip.vue"]]);

  const ElTooltip = withInstall(Tooltip);

  const autocompleteProps = buildProps({
    valueKey: {
      type: String,
      default: "value"
    },
    modelValue: {
      type: [String, Number],
      default: ""
    },
    debounce: {
      type: Number,
      default: 300
    },
    placement: {
      type: definePropType(String),
      values: [
        "top",
        "top-start",
        "top-end",
        "bottom",
        "bottom-start",
        "bottom-end"
      ],
      default: "bottom-start"
    },
    fetchSuggestions: {
      type: definePropType([Function, Array]),
      default: NOOP
    },
    popperClass: {
      type: String,
      default: ""
    },
    triggerOnFocus: {
      type: Boolean,
      default: true
    },
    selectWhenUnmatched: {
      type: Boolean,
      default: false
    },
    hideLoading: {
      type: Boolean,
      default: false
    },
    label: {
      type: String
    },
    teleported: useTooltipContentProps.teleported,
    highlightFirstItem: {
      type: Boolean,
      default: false
    },
    fitInputWidth: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    name: String
  });
  const autocompleteEmits = {
    [UPDATE_MODEL_EVENT]: (value) => isString$1(value),
    [INPUT_EVENT]: (value) => isString$1(value),
    [CHANGE_EVENT]: (value) => isString$1(value),
    focus: (evt) => evt instanceof FocusEvent,
    blur: (evt) => evt instanceof FocusEvent,
    clear: () => true,
    select: (item) => isObject$1(item)
  };

  const _hoisted_1$10 = ["aria-expanded", "aria-owns"];
  const _hoisted_2$F = { key: 0 };
  const _hoisted_3$j = ["id", "aria-selected", "onClick"];
  const COMPONENT_NAME$i = "ElAutocomplete";
  const __default__$1p = vue.defineComponent({
    name: COMPONENT_NAME$i,
    inheritAttrs: false
  });
  const _sfc_main$22 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1p,
    props: autocompleteProps,
    emits: autocompleteEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const attrs = useAttrs();
      const rawAttrs = vue.useAttrs();
      const disabled = useFormDisabled();
      const ns = useNamespace("autocomplete");
      const inputRef = vue.ref();
      const regionRef = vue.ref();
      const popperRef = vue.ref();
      const listboxRef = vue.ref();
      let readonly = false;
      let ignoreFocusEvent = false;
      const suggestions = vue.ref([]);
      const highlightedIndex = vue.ref(-1);
      const dropdownWidth = vue.ref("");
      const activated = vue.ref(false);
      const suggestionDisabled = vue.ref(false);
      const loading = vue.ref(false);
      const listboxId = vue.computed(() => ns.b(String(generateId())));
      const styles = vue.computed(() => rawAttrs.style);
      const suggestionVisible = vue.computed(() => {
        const isValidData = suggestions.value.length > 0;
        return (isValidData || loading.value) && activated.value;
      });
      const suggestionLoading = vue.computed(() => !props.hideLoading && loading.value);
      const refInput = vue.computed(() => {
        if (inputRef.value) {
          return Array.from(inputRef.value.$el.querySelectorAll("input"));
        }
        return [];
      });
      const onSuggestionShow = () => {
        if (suggestionVisible.value) {
          dropdownWidth.value = `${inputRef.value.$el.offsetWidth}px`;
        }
      };
      const onHide = () => {
        highlightedIndex.value = -1;
      };
      const getData = async (queryString) => {
        if (suggestionDisabled.value)
          return;
        const cb = (suggestionList) => {
          loading.value = false;
          if (suggestionDisabled.value)
            return;
          if (isArray$1(suggestionList)) {
            suggestions.value = suggestionList;
            highlightedIndex.value = props.highlightFirstItem ? 0 : -1;
          } else {
            throwError(COMPONENT_NAME$i, "autocomplete suggestions must be an array");
          }
        };
        loading.value = true;
        if (isArray$1(props.fetchSuggestions)) {
          cb(props.fetchSuggestions);
        } else {
          const result = await props.fetchSuggestions(queryString, cb);
          if (isArray$1(result))
            cb(result);
        }
      };
      const debouncedGetData = debounce(getData, props.debounce);
      const handleInput = (value) => {
        const valuePresented = !!value;
        emit(INPUT_EVENT, value);
        emit(UPDATE_MODEL_EVENT, value);
        suggestionDisabled.value = false;
        activated.value || (activated.value = valuePresented);
        if (!props.triggerOnFocus && !value) {
          suggestionDisabled.value = true;
          suggestions.value = [];
          return;
        }
        debouncedGetData(value);
      };
      const handleMouseDown = (event) => {
        var _a;
        if (disabled.value)
          return;
        if (((_a = event.target) == null ? void 0 : _a.tagName) !== "INPUT" || refInput.value.includes(document.activeElement)) {
          activated.value = true;
        }
      };
      const handleChange = (value) => {
        emit(CHANGE_EVENT, value);
      };
      const handleFocus = (evt) => {
        if (!ignoreFocusEvent) {
          activated.value = true;
          emit("focus", evt);
          if (props.triggerOnFocus && !readonly) {
            debouncedGetData(String(props.modelValue));
          }
        } else {
          ignoreFocusEvent = false;
        }
      };
      const handleBlur = (evt) => {
        setTimeout(() => {
          var _a;
          if ((_a = popperRef.value) == null ? void 0 : _a.isFocusInsideContent()) {
            ignoreFocusEvent = true;
            return;
          }
          activated.value && close();
          emit("blur", evt);
        });
      };
      const handleClear = () => {
        activated.value = false;
        emit(UPDATE_MODEL_EVENT, "");
        emit("clear");
      };
      const handleKeyEnter = async () => {
        if (suggestionVisible.value && highlightedIndex.value >= 0 && highlightedIndex.value < suggestions.value.length) {
          handleSelect(suggestions.value[highlightedIndex.value]);
        } else if (props.selectWhenUnmatched) {
          emit("select", { value: props.modelValue });
          suggestions.value = [];
          highlightedIndex.value = -1;
        }
      };
      const handleKeyEscape = (evt) => {
        if (suggestionVisible.value) {
          evt.preventDefault();
          evt.stopPropagation();
          close();
        }
      };
      const close = () => {
        activated.value = false;
      };
      const focus = () => {
        var _a;
        (_a = inputRef.value) == null ? void 0 : _a.focus();
      };
      const blur = () => {
        var _a;
        (_a = inputRef.value) == null ? void 0 : _a.blur();
      };
      const handleSelect = async (item) => {
        emit(INPUT_EVENT, item[props.valueKey]);
        emit(UPDATE_MODEL_EVENT, item[props.valueKey]);
        emit("select", item);
        suggestions.value = [];
        highlightedIndex.value = -1;
      };
      const highlight = (index) => {
        if (!suggestionVisible.value || loading.value)
          return;
        if (index < 0) {
          highlightedIndex.value = -1;
          return;
        }
        if (index >= suggestions.value.length) {
          index = suggestions.value.length - 1;
        }
        const suggestion = regionRef.value.querySelector(`.${ns.be("suggestion", "wrap")}`);
        const suggestionList = suggestion.querySelectorAll(`.${ns.be("suggestion", "list")} li`);
        const highlightItem = suggestionList[index];
        const scrollTop = suggestion.scrollTop;
        const { offsetTop, scrollHeight } = highlightItem;
        if (offsetTop + scrollHeight > scrollTop + suggestion.clientHeight) {
          suggestion.scrollTop += scrollHeight;
        }
        if (offsetTop < scrollTop) {
          suggestion.scrollTop -= scrollHeight;
        }
        highlightedIndex.value = index;
        inputRef.value.ref.setAttribute("aria-activedescendant", `${listboxId.value}-item-${highlightedIndex.value}`);
      };
      onClickOutside(listboxRef, () => {
        suggestionVisible.value && close();
      });
      vue.onMounted(() => {
        inputRef.value.ref.setAttribute("role", "textbox");
        inputRef.value.ref.setAttribute("aria-autocomplete", "list");
        inputRef.value.ref.setAttribute("aria-controls", "id");
        inputRef.value.ref.setAttribute("aria-activedescendant", `${listboxId.value}-item-${highlightedIndex.value}`);
        readonly = inputRef.value.ref.hasAttribute("readonly");
      });
      expose({
        highlightedIndex,
        activated,
        loading,
        inputRef,
        popperRef,
        suggestions,
        handleSelect,
        handleKeyEnter,
        focus,
        blur,
        close,
        highlight
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(ElTooltip), {
          ref_key: "popperRef",
          ref: popperRef,
          visible: vue.unref(suggestionVisible),
          placement: _ctx.placement,
          "fallback-placements": ["bottom-start", "top-start"],
          "popper-class": [vue.unref(ns).e("popper"), _ctx.popperClass],
          teleported: _ctx.teleported,
          "gpu-acceleration": false,
          pure: "",
          "manual-mode": "",
          effect: "light",
          trigger: "click",
          transition: `${vue.unref(ns).namespace.value}-zoom-in-top`,
          persistent: "",
          role: "listbox",
          onBeforeShow: onSuggestionShow,
          onHide
        }, {
          content: vue.withCtx(() => [
            vue.createElementVNode("div", {
              ref_key: "regionRef",
              ref: regionRef,
              class: vue.normalizeClass([vue.unref(ns).b("suggestion"), vue.unref(ns).is("loading", vue.unref(suggestionLoading))]),
              style: vue.normalizeStyle({
                [_ctx.fitInputWidth ? "width" : "minWidth"]: dropdownWidth.value,
                outline: "none"
              }),
              role: "region"
            }, [
              vue.createVNode(vue.unref(ElScrollbar), {
                id: vue.unref(listboxId),
                tag: "ul",
                "wrap-class": vue.unref(ns).be("suggestion", "wrap"),
                "view-class": vue.unref(ns).be("suggestion", "list"),
                role: "listbox"
              }, {
                default: vue.withCtx(() => [
                  vue.unref(suggestionLoading) ? (vue.openBlock(), vue.createElementBlock("li", _hoisted_2$F, [
                    vue.createVNode(vue.unref(ElIcon), {
                      class: vue.normalizeClass(vue.unref(ns).is("loading"))
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(vue.unref(loading_default))
                      ]),
                      _: 1
                    }, 8, ["class"])
                  ])) : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(suggestions.value, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("li", {
                      id: `${vue.unref(listboxId)}-item-${index}`,
                      key: index,
                      class: vue.normalizeClass({ highlighted: highlightedIndex.value === index }),
                      role: "option",
                      "aria-selected": highlightedIndex.value === index,
                      onClick: ($event) => handleSelect(item)
                    }, [
                      vue.renderSlot(_ctx.$slots, "default", { item }, () => [
                        vue.createTextVNode(vue.toDisplayString(item[_ctx.valueKey]), 1)
                      ])
                    ], 10, _hoisted_3$j);
                  }), 128))
                ]),
                _: 3
              }, 8, ["id", "wrap-class", "view-class"])
            ], 6)
          ]),
          default: vue.withCtx(() => [
            vue.createElementVNode("div", {
              ref_key: "listboxRef",
              ref: listboxRef,
              class: vue.normalizeClass([vue.unref(ns).b(), _ctx.$attrs.class]),
              style: vue.normalizeStyle(vue.unref(styles)),
              role: "combobox",
              "aria-haspopup": "listbox",
              "aria-expanded": vue.unref(suggestionVisible),
              "aria-owns": vue.unref(listboxId)
            }, [
              vue.createVNode(vue.unref(ElInput), vue.mergeProps({
                ref_key: "inputRef",
                ref: inputRef
              }, vue.unref(attrs), {
                clearable: _ctx.clearable,
                disabled: vue.unref(disabled),
                name: _ctx.name,
                "model-value": _ctx.modelValue,
                onInput: handleInput,
                onChange: handleChange,
                onFocus: handleFocus,
                onBlur: handleBlur,
                onClear: handleClear,
                onKeydown: [
                  _cache[0] || (_cache[0] = vue.withKeys(vue.withModifiers(($event) => highlight(highlightedIndex.value - 1), ["prevent"]), ["up"])),
                  _cache[1] || (_cache[1] = vue.withKeys(vue.withModifiers(($event) => highlight(highlightedIndex.value + 1), ["prevent"]), ["down"])),
                  vue.withKeys(handleKeyEnter, ["enter"]),
                  vue.withKeys(close, ["tab"]),
                  vue.withKeys(handleKeyEscape, ["esc"])
                ],
                onMousedown: handleMouseDown
              }), vue.createSlots({ _: 2 }, [
                _ctx.$slots.prepend ? {
                  name: "prepend",
                  fn: vue.withCtx(() => [
                    vue.renderSlot(_ctx.$slots, "prepend")
                  ])
                } : void 0,
                _ctx.$slots.append ? {
                  name: "append",
                  fn: vue.withCtx(() => [
                    vue.renderSlot(_ctx.$slots, "append")
                  ])
                } : void 0,
                _ctx.$slots.prefix ? {
                  name: "prefix",
                  fn: vue.withCtx(() => [
                    vue.renderSlot(_ctx.$slots, "prefix")
                  ])
                } : void 0,
                _ctx.$slots.suffix ? {
                  name: "suffix",
                  fn: vue.withCtx(() => [
                    vue.renderSlot(_ctx.$slots, "suffix")
                  ])
                } : void 0
              ]), 1040, ["clearable", "disabled", "name", "model-value", "onKeydown"])
            ], 14, _hoisted_1$10)
          ]),
          _: 3
        }, 8, ["visible", "placement", "popper-class", "teleported", "transition"]);
      };
    }
  });
  var Autocomplete = /* @__PURE__ */ _export_sfc(_sfc_main$22, [["__file", "autocomplete.vue"]]);

  const ElAutocomplete = withInstall(Autocomplete);

  const avatarProps = buildProps({
    size: {
      type: [Number, String],
      values: componentSizes,
      default: "",
      validator: (val) => isNumber(val)
    },
    shape: {
      type: String,
      values: ["circle", "square"],
      default: "circle"
    },
    icon: {
      type: iconPropType
    },
    src: {
      type: String,
      default: ""
    },
    alt: String,
    srcSet: String,
    fit: {
      type: definePropType(String),
      default: "cover"
    }
  });
  const avatarEmits = {
    error: (evt) => evt instanceof Event
  };

  const _hoisted_1$$ = ["src", "alt", "srcset"];
  const __default__$1o = vue.defineComponent({
    name: "ElAvatar"
  });
  const _sfc_main$21 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1o,
    props: avatarProps,
    emits: avatarEmits,
    setup(__props, { emit }) {
      const props = __props;
      const ns = useNamespace("avatar");
      const hasLoadError = vue.ref(false);
      const avatarClass = vue.computed(() => {
        const { size, icon, shape } = props;
        const classList = [ns.b()];
        if (isString$1(size))
          classList.push(ns.m(size));
        if (icon)
          classList.push(ns.m("icon"));
        if (shape)
          classList.push(ns.m(shape));
        return classList;
      });
      const sizeStyle = vue.computed(() => {
        const { size } = props;
        return isNumber(size) ? ns.cssVarBlock({
          size: addUnit(size) || ""
        }) : void 0;
      });
      const fitStyle = vue.computed(() => ({
        objectFit: props.fit
      }));
      vue.watch(() => props.src, () => hasLoadError.value = false);
      function handleError(e) {
        hasLoadError.value = true;
        emit("error", e);
      }
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("span", {
          class: vue.normalizeClass(vue.unref(avatarClass)),
          style: vue.normalizeStyle(vue.unref(sizeStyle))
        }, [
          (_ctx.src || _ctx.srcSet) && !hasLoadError.value ? (vue.openBlock(), vue.createElementBlock("img", {
            key: 0,
            src: _ctx.src,
            alt: _ctx.alt,
            srcset: _ctx.srcSet,
            style: vue.normalizeStyle(vue.unref(fitStyle)),
            onError: handleError
          }, null, 44, _hoisted_1$$)) : _ctx.icon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), { key: 1 }, {
            default: vue.withCtx(() => [
              (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.icon)))
            ]),
            _: 1
          })) : vue.renderSlot(_ctx.$slots, "default", { key: 2 })
        ], 6);
      };
    }
  });
  var Avatar = /* @__PURE__ */ _export_sfc(_sfc_main$21, [["__file", "avatar.vue"]]);

  const ElAvatar = withInstall(Avatar);

  const backtopProps = {
    visibilityHeight: {
      type: Number,
      default: 200
    },
    target: {
      type: String,
      default: ""
    },
    right: {
      type: Number,
      default: 40
    },
    bottom: {
      type: Number,
      default: 40
    }
  };
  const backtopEmits = {
    click: (evt) => evt instanceof MouseEvent
  };

  const useBackTop = (props, emit, componentName) => {
    const el = vue.shallowRef();
    const container = vue.shallowRef();
    const visible = vue.ref(false);
    const handleScroll = () => {
      if (el.value)
        visible.value = el.value.scrollTop >= props.visibilityHeight;
    };
    const handleClick = (event) => {
      var _a;
      (_a = el.value) == null ? void 0 : _a.scrollTo({ top: 0, behavior: "smooth" });
      emit("click", event);
    };
    const handleScrollThrottled = useThrottleFn(handleScroll, 300, true);
    useEventListener(container, "scroll", handleScrollThrottled);
    vue.onMounted(() => {
      var _a;
      container.value = document;
      el.value = document.documentElement;
      if (props.target) {
        el.value = (_a = document.querySelector(props.target)) != null ? _a : void 0;
        if (!el.value) {
          throwError(componentName, `target does not exist: ${props.target}`);
        }
        container.value = el.value;
      }
      handleScroll();
    });
    return {
      visible,
      handleClick
    };
  };

  const COMPONENT_NAME$h = "ElBacktop";
  const __default__$1n = vue.defineComponent({
    name: COMPONENT_NAME$h
  });
  const _sfc_main$20 = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1n,
    props: backtopProps,
    emits: backtopEmits,
    setup(__props, { emit }) {
      const props = __props;
      const ns = useNamespace("backtop");
      const { handleClick, visible } = useBackTop(props, emit, COMPONENT_NAME$h);
      const backTopStyle = vue.computed(() => ({
        right: `${props.right}px`,
        bottom: `${props.bottom}px`
      }));
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, {
          name: `${vue.unref(ns).namespace.value}-fade-in`
        }, {
          default: vue.withCtx(() => [
            vue.unref(visible) ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              style: vue.normalizeStyle(vue.unref(backTopStyle)),
              class: vue.normalizeClass(vue.unref(ns).b()),
              onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => vue.unref(handleClick) && vue.unref(handleClick)(...args), ["stop"]))
            }, [
              vue.renderSlot(_ctx.$slots, "default", {}, () => [
                vue.createVNode(vue.unref(ElIcon), {
                  class: vue.normalizeClass(vue.unref(ns).e("icon"))
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(vue.unref(caret_top_default))
                  ]),
                  _: 1
                }, 8, ["class"])
              ])
            ], 6)) : vue.createCommentVNode("v-if", true)
          ]),
          _: 3
        }, 8, ["name"]);
      };
    }
  });
  var Backtop = /* @__PURE__ */ _export_sfc(_sfc_main$20, [["__file", "backtop.vue"]]);

  const ElBacktop = withInstall(Backtop);

  const badgeProps = buildProps({
    value: {
      type: [String, Number],
      default: ""
    },
    max: {
      type: Number,
      default: 99
    },
    isDot: Boolean,
    hidden: Boolean,
    type: {
      type: String,
      values: ["primary", "success", "warning", "info", "danger"],
      default: "danger"
    }
  });

  const _hoisted_1$_ = ["textContent"];
  const __default__$1m = vue.defineComponent({
    name: "ElBadge"
  });
  const _sfc_main$1$ = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1m,
    props: badgeProps,
    setup(__props, { expose }) {
      const props = __props;
      const ns = useNamespace("badge");
      const content = vue.computed(() => {
        if (props.isDot)
          return "";
        if (isNumber(props.value) && isNumber(props.max)) {
          return props.max < props.value ? `${props.max}+` : `${props.value}`;
        }
        return `${props.value}`;
      });
      expose({
        content
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(vue.unref(ns).b())
        }, [
          vue.renderSlot(_ctx.$slots, "default"),
          vue.createVNode(vue.Transition, {
            name: `${vue.unref(ns).namespace.value}-zoom-in-center`,
            persisted: ""
          }, {
            default: vue.withCtx(() => [
              vue.withDirectives(vue.createElementVNode("sup", {
                class: vue.normalizeClass([
                  vue.unref(ns).e("content"),
                  vue.unref(ns).em("content", _ctx.type),
                  vue.unref(ns).is("fixed", !!_ctx.$slots.default),
                  vue.unref(ns).is("dot", _ctx.isDot)
                ]),
                textContent: vue.toDisplayString(vue.unref(content))
              }, null, 10, _hoisted_1$_), [
                [vue.vShow, !_ctx.hidden && (vue.unref(content) || _ctx.isDot)]
              ])
            ]),
            _: 1
          }, 8, ["name"])
        ], 2);
      };
    }
  });
  var Badge = /* @__PURE__ */ _export_sfc(_sfc_main$1$, [["__file", "badge.vue"]]);

  const ElBadge = withInstall(Badge);

  const breadcrumbKey = Symbol("breadcrumbKey");

  const breadcrumbProps = buildProps({
    separator: {
      type: String,
      default: "/"
    },
    separatorIcon: {
      type: iconPropType
    }
  });

  const __default__$1l = vue.defineComponent({
    name: "ElBreadcrumb"
  });
  const _sfc_main$1_ = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1l,
    props: breadcrumbProps,
    setup(__props) {
      const props = __props;
      const ns = useNamespace("breadcrumb");
      const breadcrumb = vue.ref();
      vue.provide(breadcrumbKey, props);
      vue.onMounted(() => {
        const items = breadcrumb.value.querySelectorAll(`.${ns.e("item")}`);
        if (items.length) {
          items[items.length - 1].setAttribute("aria-current", "page");
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "breadcrumb",
          ref: breadcrumb,
          class: vue.normalizeClass(vue.unref(ns).b()),
          "aria-label": "Breadcrumb",
          role: "navigation"
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 2);
      };
    }
  });
  var Breadcrumb = /* @__PURE__ */ _export_sfc(_sfc_main$1_, [["__file", "breadcrumb.vue"]]);

  const breadcrumbItemProps = buildProps({
    to: {
      type: definePropType([String, Object]),
      default: ""
    },
    replace: {
      type: Boolean,
      default: false
    }
  });

  const __default__$1k = vue.defineComponent({
    name: "ElBreadcrumbItem"
  });
  const _sfc_main$1Z = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1k,
    props: breadcrumbItemProps,
    setup(__props) {
      const props = __props;
      const instance = vue.getCurrentInstance();
      const breadcrumbContext = vue.inject(breadcrumbKey, void 0);
      const ns = useNamespace("breadcrumb");
      const router = instance.appContext.config.globalProperties.$router;
      const link = vue.ref();
      const onClick = () => {
        if (!props.to || !router)
          return;
        props.replace ? router.replace(props.to) : router.push(props.to);
      };
      return (_ctx, _cache) => {
        var _a, _b;
        return vue.openBlock(), vue.createElementBlock("span", {
          class: vue.normalizeClass(vue.unref(ns).e("item"))
        }, [
          vue.createElementVNode("span", {
            ref_key: "link",
            ref: link,
            class: vue.normalizeClass([vue.unref(ns).e("inner"), vue.unref(ns).is("link", !!_ctx.to)]),
            role: "link",
            onClick
          }, [
            vue.renderSlot(_ctx.$slots, "default")
          ], 2),
          ((_a = vue.unref(breadcrumbContext)) == null ? void 0 : _a.separatorIcon) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
            key: 0,
            class: vue.normalizeClass(vue.unref(ns).e("separator"))
          }, {
            default: vue.withCtx(() => [
              (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(breadcrumbContext).separatorIcon)))
            ]),
            _: 1
          }, 8, ["class"])) : (vue.openBlock(), vue.createElementBlock("span", {
            key: 1,
            class: vue.normalizeClass(vue.unref(ns).e("separator")),
            role: "presentation"
          }, vue.toDisplayString((_b = vue.unref(breadcrumbContext)) == null ? void 0 : _b.separator), 3))
        ], 2);
      };
    }
  });
  var BreadcrumbItem = /* @__PURE__ */ _export_sfc(_sfc_main$1Z, [["__file", "breadcrumb-item.vue"]]);

  const ElBreadcrumb = withInstall(Breadcrumb, {
    BreadcrumbItem
  });
  const ElBreadcrumbItem = withNoopInstall(BreadcrumbItem);

  const buttonGroupContextKey = Symbol("buttonGroupContextKey");

  const useButton = (props, emit) => {
    useDeprecated({
      from: "type.text",
      replacement: "link",
      version: "3.0.0",
      scope: "props",
      ref: "https://element-plus.org/en-US/component/button.html#button-attributes"
    }, vue.computed(() => props.type === "text"));
    const buttonGroupContext = vue.inject(buttonGroupContextKey, void 0);
    const globalConfig = useGlobalConfig("button");
    const { form } = useFormItem();
    const _size = useFormSize(vue.computed(() => buttonGroupContext == null ? void 0 : buttonGroupContext.size));
    const _disabled = useFormDisabled();
    const _ref = vue.ref();
    const slots = vue.useSlots();
    const _type = vue.computed(() => props.type || (buttonGroupContext == null ? void 0 : buttonGroupContext.type) || "");
    const autoInsertSpace = vue.computed(() => {
      var _a, _b, _c;
      return (_c = (_b = props.autoInsertSpace) != null ? _b : (_a = globalConfig.value) == null ? void 0 : _a.autoInsertSpace) != null ? _c : false;
    });
    const _props = vue.computed(() => {
      if (props.tag === "button") {
        return {
          ariaDisabled: _disabled.value || props.loading,
          disabled: _disabled.value || props.loading,
          autofocus: props.autofocus,
          type: props.nativeType
        };
      }
      return {};
    });
    const shouldAddSpace = vue.computed(() => {
      var _a;
      const defaultSlot = (_a = slots.default) == null ? void 0 : _a.call(slots);
      if (autoInsertSpace.value && (defaultSlot == null ? void 0 : defaultSlot.length) === 1) {
        const slot = defaultSlot[0];
        if ((slot == null ? void 0 : slot.type) === vue.Text) {
          const text = slot.children;
          return /^\p{Unified_Ideograph}{2}$/u.test(text.trim());
        }
      }
      return false;
    });
    const handleClick = (evt) => {
      if (props.nativeType === "reset") {
        form == null ? void 0 : form.resetFields();
      }
      emit("click", evt);
    };
    return {
      _disabled,
      _size,
      _type,
      _ref,
      _props,
      shouldAddSpace,
      handleClick
    };
  };

  const buttonTypes = [
    "default",
    "primary",
    "success",
    "warning",
    "info",
    "danger",
    "text",
    ""
  ];
  const buttonNativeTypes = ["button", "submit", "reset"];
  const buttonProps = buildProps({
    size: useSizeProp,
    disabled: Boolean,
    type: {
      type: String,
      values: buttonTypes,
      default: ""
    },
    icon: {
      type: iconPropType
    },
    nativeType: {
      type: String,
      values: buttonNativeTypes,
      default: "button"
    },
    loading: Boolean,
    loadingIcon: {
      type: iconPropType,
      default: () => loading_default
    },
    plain: Boolean,
    text: Boolean,
    link: Boolean,
    bg: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean,
    color: String,
    dark: Boolean,
    autoInsertSpace: {
      type: Boolean,
      default: void 0
    },
    tag: {
      type: definePropType([String, Object]),
      default: "button"
    }
  });
  const buttonEmits = {
    click: (evt) => evt instanceof MouseEvent
  };

  function bound01$1(n, max) {
    if (isOnePointZero$1(n)) {
      n = "100%";
    }
    var isPercent = isPercentage$1(n);
    n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
    if (isPercent) {
      n = parseInt(String(n * max), 10) / 100;
    }
    if (Math.abs(n - max) < 1e-6) {
      return 1;
    }
    if (max === 360) {
      n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
    } else {
      n = n % max / parseFloat(String(max));
    }
    return n;
  }
  function clamp01(val) {
    return Math.min(1, Math.max(0, val));
  }
  function isOnePointZero$1(n) {
    return typeof n === "string" && n.indexOf(".") !== -1 && parseFloat(n) === 1;
  }
  function isPercentage$1(n) {
    return typeof n === "string" && n.indexOf("%") !== -1;
  }
  function boundAlpha(a) {
    a = parseFloat(a);
    if (isNaN(a) || a < 0 || a > 1) {
      a = 1;
    }
    return a;
  }
  function convertToPercentage(n) {
    if (n <= 1) {
      return "".concat(Number(n) * 100, "%");
    }
    return n;
  }
  function pad2(c) {
    return c.length === 1 ? "0" + c : String(c);
  }

  function rgbToRgb(r, g, b) {
    return {
      r: bound01$1(r, 255) * 255,
      g: bound01$1(g, 255) * 255,
      b: bound01$1(b, 255) * 255
    };
  }
  function rgbToHsl(r, g, b) {
    r = bound01$1(r, 255);
    g = bound01$1(g, 255);
    b = bound01$1(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var s = 0;
    var l = (max + min) / 2;
    if (max === min) {
      s = 0;
      h = 0;
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return { h, s, l };
  }
  function hue2rgb(p, q, t) {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p + (q - p) * (6 * t);
    }
    if (t < 1 / 2) {
      return q;
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
  }
  function hslToRgb(h, s, l) {
    var r;
    var g;
    var b;
    h = bound01$1(h, 360);
    s = bound01$1(s, 100);
    l = bound01$1(l, 100);
    if (s === 0) {
      g = l;
      b = l;
      r = l;
    } else {
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
  }
  function rgbToHsv(r, g, b) {
    r = bound01$1(r, 255);
    g = bound01$1(g, 255);
    b = bound01$1(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var v = max;
    var d = max - min;
    var s = max === 0 ? 0 : d / max;
    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return { h, s, v };
  }
  function hsvToRgb(h, s, v) {
    h = bound01$1(h, 360) * 6;
    s = bound01$1(s, 100);
    v = bound01$1(v, 100);
    var i = Math.floor(h);
    var f = h - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var mod = i % 6;
    var r = [v, q, p, p, t, v][mod];
    var g = [t, v, v, q, p, p][mod];
    var b = [p, p, t, v, v, q][mod];
    return { r: r * 255, g: g * 255, b: b * 255 };
  }
  function rgbToHex(r, g, b, allow3Char) {
    var hex = [
      pad2(Math.round(r).toString(16)),
      pad2(Math.round(g).toString(16)),
      pad2(Math.round(b).toString(16))
    ];
    if (allow3Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1))) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }
    return hex.join("");
  }
  function rgbaToHex(r, g, b, a, allow4Char) {
    var hex = [
      pad2(Math.round(r).toString(16)),
      pad2(Math.round(g).toString(16)),
      pad2(Math.round(b).toString(16)),
      pad2(convertDecimalToHex(a))
    ];
    if (allow4Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1)) && hex[3].startsWith(hex[3].charAt(1))) {
      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }
    return hex.join("");
  }
  function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
  }
  function convertHexToDecimal(h) {
    return parseIntFromHex(h) / 255;
  }
  function parseIntFromHex(val) {
    return parseInt(val, 16);
  }
  function numberInputToObject(color) {
    return {
      r: color >> 16,
      g: (color & 65280) >> 8,
      b: color & 255
    };
  }

  var names = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    goldenrod: "#daa520",
    gold: "#ffd700",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavenderblush: "#fff0f5",
    lavender: "#e6e6fa",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
  };

  function inputToRGB(color) {
    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format = false;
    if (typeof color === "string") {
      color = stringInputToObject(color);
    }
    if (typeof color === "object") {
      if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
        rgb = rgbToRgb(color.r, color.g, color.b);
        ok = true;
        format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
        s = convertToPercentage(color.s);
        v = convertToPercentage(color.v);
        rgb = hsvToRgb(color.h, s, v);
        ok = true;
        format = "hsv";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
        s = convertToPercentage(color.s);
        l = convertToPercentage(color.l);
        rgb = hslToRgb(color.h, s, l);
        ok = true;
        format = "hsl";
      }
      if (Object.prototype.hasOwnProperty.call(color, "a")) {
        a = color.a;
      }
    }
    a = boundAlpha(a);
    return {
      ok,
      format: color.format || format,
      r: Math.min(255, Math.max(rgb.r, 0)),
      g: Math.min(255, Math.max(rgb.g, 0)),
      b: Math.min(255, Math.max(rgb.b, 0)),
      a
    };
  }
  var CSS_INTEGER = "[-\\+]?\\d+%?";
  var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
  var CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
  var PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
  var PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
  var matchers = {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
    rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
    hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
    hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
    hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
    hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
  };
  function stringInputToObject(color) {
    color = color.trim().toLowerCase();
    if (color.length === 0) {
      return false;
    }
    var named = false;
    if (names[color]) {
      color = names[color];
      named = true;
    } else if (color === "transparent") {
      return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }
    var match = matchers.rgb.exec(color);
    if (match) {
      return { r: match[1], g: match[2], b: match[3] };
    }
    match = matchers.rgba.exec(color);
    if (match) {
      return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    match = matchers.hsl.exec(color);
    if (match) {
      return { h: match[1], s: match[2], l: match[3] };
    }
    match = matchers.hsla.exec(color);
    if (match) {
      return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    match = matchers.hsv.exec(color);
    if (match) {
      return { h: match[1], s: match[2], v: match[3] };
    }
    match = matchers.hsva.exec(color);
    if (match) {
      return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    match = matchers.hex8.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        a: convertHexToDecimal(match[4]),
        format: named ? "name" : "hex8"
      };
    }
    match = matchers.hex6.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        format: named ? "name" : "hex"
      };
    }
    match = matchers.hex4.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1] + match[1]),
        g: parseIntFromHex(match[2] + match[2]),
        b: parseIntFromHex(match[3] + match[3]),
        a: convertHexToDecimal(match[4] + match[4]),
        format: named ? "name" : "hex8"
      };
    }
    match = matchers.hex3.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1] + match[1]),
        g: parseIntFromHex(match[2] + match[2]),
        b: parseIntFromHex(match[3] + match[3]),
        format: named ? "name" : "hex"
      };
    }
    return false;
  }
  function isValidCSSUnit(color) {
    return Boolean(matchers.CSS_UNIT.exec(String(color)));
  }

  var TinyColor = function() {
    function TinyColor2(color, opts) {
      if (color === void 0) {
        color = "";
      }
      if (opts === void 0) {
        opts = {};
      }
      var _a;
      if (color instanceof TinyColor2) {
        return color;
      }
      if (typeof color === "number") {
        color = numberInputToObject(color);
      }
      this.originalInput = color;
      var rgb = inputToRGB(color);
      this.originalInput = color;
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
      this.a = rgb.a;
      this.roundA = Math.round(100 * this.a) / 100;
      this.format = (_a = opts.format) !== null && _a !== void 0 ? _a : rgb.format;
      this.gradientType = opts.gradientType;
      if (this.r < 1) {
        this.r = Math.round(this.r);
      }
      if (this.g < 1) {
        this.g = Math.round(this.g);
      }
      if (this.b < 1) {
        this.b = Math.round(this.b);
      }
      this.isValid = rgb.ok;
    }
    TinyColor2.prototype.isDark = function() {
      return this.getBrightness() < 128;
    };
    TinyColor2.prototype.isLight = function() {
      return !this.isDark();
    };
    TinyColor2.prototype.getBrightness = function() {
      var rgb = this.toRgb();
      return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
    };
    TinyColor2.prototype.getLuminance = function() {
      var rgb = this.toRgb();
      var R;
      var G;
      var B;
      var RsRGB = rgb.r / 255;
      var GsRGB = rgb.g / 255;
      var BsRGB = rgb.b / 255;
      if (RsRGB <= 0.03928) {
        R = RsRGB / 12.92;
      } else {
        R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
      }
      if (GsRGB <= 0.03928) {
        G = GsRGB / 12.92;
      } else {
        G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
      }
      if (BsRGB <= 0.03928) {
        B = BsRGB / 12.92;
      } else {
        B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
      }
      return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    };
    TinyColor2.prototype.getAlpha = function() {
      return this.a;
    };
    TinyColor2.prototype.setAlpha = function(alpha) {
      this.a = boundAlpha(alpha);
      this.roundA = Math.round(100 * this.a) / 100;
      return this;
    };
    TinyColor2.prototype.toHsv = function() {
      var hsv = rgbToHsv(this.r, this.g, this.b);
      return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
    };
    TinyColor2.prototype.toHsvString = function() {
      var hsv = rgbToHsv(this.r, this.g, this.b);
      var h = Math.round(hsv.h * 360);
      var s = Math.round(hsv.s * 100);
      var v = Math.round(hsv.v * 100);
      return this.a === 1 ? "hsv(".concat(h, ", ").concat(s, "%, ").concat(v, "%)") : "hsva(".concat(h, ", ").concat(s, "%, ").concat(v, "%, ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toHsl = function() {
      var hsl = rgbToHsl(this.r, this.g, this.b);
      return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
    };
    TinyColor2.prototype.toHslString = function() {
      var hsl = rgbToHsl(this.r, this.g, this.b);
      var h = Math.round(hsl.h * 360);
      var s = Math.round(hsl.s * 100);
      var l = Math.round(hsl.l * 100);
      return this.a === 1 ? "hsl(".concat(h, ", ").concat(s, "%, ").concat(l, "%)") : "hsla(".concat(h, ", ").concat(s, "%, ").concat(l, "%, ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toHex = function(allow3Char) {
      if (allow3Char === void 0) {
        allow3Char = false;
      }
      return rgbToHex(this.r, this.g, this.b, allow3Char);
    };
    TinyColor2.prototype.toHexString = function(allow3Char) {
      if (allow3Char === void 0) {
        allow3Char = false;
      }
      return "#" + this.toHex(allow3Char);
    };
    TinyColor2.prototype.toHex8 = function(allow4Char) {
      if (allow4Char === void 0) {
        allow4Char = false;
      }
      return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
    };
    TinyColor2.prototype.toHex8String = function(allow4Char) {
      if (allow4Char === void 0) {
        allow4Char = false;
      }
      return "#" + this.toHex8(allow4Char);
    };
    TinyColor2.prototype.toRgb = function() {
      return {
        r: Math.round(this.r),
        g: Math.round(this.g),
        b: Math.round(this.b),
        a: this.a
      };
    };
    TinyColor2.prototype.toRgbString = function() {
      var r = Math.round(this.r);
      var g = Math.round(this.g);
      var b = Math.round(this.b);
      return this.a === 1 ? "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")") : "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toPercentageRgb = function() {
      var fmt = function(x) {
        return "".concat(Math.round(bound01$1(x, 255) * 100), "%");
      };
      return {
        r: fmt(this.r),
        g: fmt(this.g),
        b: fmt(this.b),
        a: this.a
      };
    };
    TinyColor2.prototype.toPercentageRgbString = function() {
      var rnd = function(x) {
        return Math.round(bound01$1(x, 255) * 100);
      };
      return this.a === 1 ? "rgb(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%)") : "rgba(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%, ").concat(this.roundA, ")");
    };
    TinyColor2.prototype.toName = function() {
      if (this.a === 0) {
        return "transparent";
      }
      if (this.a < 1) {
        return false;
      }
      var hex = "#" + rgbToHex(this.r, this.g, this.b, false);
      for (var _i = 0, _a = Object.entries(names); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (hex === value) {
          return key;
        }
      }
      return false;
    };
    TinyColor2.prototype.toString = function(format) {
      var formatSet = Boolean(format);
      format = format !== null && format !== void 0 ? format : this.format;
      var formattedString = false;
      var hasAlpha = this.a < 1 && this.a >= 0;
      var needsAlphaFormat = !formatSet && hasAlpha && (format.startsWith("hex") || format === "name");
      if (needsAlphaFormat) {
        if (format === "name" && this.a === 0) {
          return this.toName();
        }
        return this.toRgbString();
      }
      if (format === "rgb") {
        formattedString = this.toRgbString();
      }
      if (format === "prgb") {
        formattedString = this.toPercentageRgbString();
      }
      if (format === "hex" || format === "hex6") {
        formattedString = this.toHexString();
      }
      if (format === "hex3") {
        formattedString = this.toHexString(true);
      }
      if (format === "hex4") {
        formattedString = this.toHex8String(true);
      }
      if (format === "hex8") {
        formattedString = this.toHex8String();
      }
      if (format === "name") {
        formattedString = this.toName();
      }
      if (format === "hsl") {
        formattedString = this.toHslString();
      }
      if (format === "hsv") {
        formattedString = this.toHsvString();
      }
      return formattedString || this.toHexString();
    };
    TinyColor2.prototype.toNumber = function() {
      return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
    };
    TinyColor2.prototype.clone = function() {
      return new TinyColor2(this.toString());
    };
    TinyColor2.prototype.lighten = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.l += amount / 100;
      hsl.l = clamp01(hsl.l);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.brighten = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var rgb = this.toRgb();
      rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
      rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
      rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
      return new TinyColor2(rgb);
    };
    TinyColor2.prototype.darken = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.l -= amount / 100;
      hsl.l = clamp01(hsl.l);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.tint = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      return this.mix("white", amount);
    };
    TinyColor2.prototype.shade = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      return this.mix("black", amount);
    };
    TinyColor2.prototype.desaturate = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.s -= amount / 100;
      hsl.s = clamp01(hsl.s);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.saturate = function(amount) {
      if (amount === void 0) {
        amount = 10;
      }
      var hsl = this.toHsl();
      hsl.s += amount / 100;
      hsl.s = clamp01(hsl.s);
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.greyscale = function() {
      return this.desaturate(100);
    };
    TinyColor2.prototype.spin = function(amount) {
      var hsl = this.toHsl();
      var hue = (hsl.h + amount) % 360;
      hsl.h = hue < 0 ? 360 + hue : hue;
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.mix = function(color, amount) {
      if (amount === void 0) {
        amount = 50;
      }
      var rgb1 = this.toRgb();
      var rgb2 = new TinyColor2(color).toRgb();
      var p = amount / 100;
      var rgba = {
        r: (rgb2.r - rgb1.r) * p + rgb1.r,
        g: (rgb2.g - rgb1.g) * p + rgb1.g,
        b: (rgb2.b - rgb1.b) * p + rgb1.b,
        a: (rgb2.a - rgb1.a) * p + rgb1.a
      };
      return new TinyColor2(rgba);
    };
    TinyColor2.prototype.analogous = function(results, slices) {
      if (results === void 0) {
        results = 6;
      }
      if (slices === void 0) {
        slices = 30;
      }
      var hsl = this.toHsl();
      var part = 360 / slices;
      var ret = [this];
      for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results; ) {
        hsl.h = (hsl.h + part) % 360;
        ret.push(new TinyColor2(hsl));
      }
      return ret;
    };
    TinyColor2.prototype.complement = function() {
      var hsl = this.toHsl();
      hsl.h = (hsl.h + 180) % 360;
      return new TinyColor2(hsl);
    };
    TinyColor2.prototype.monochromatic = function(results) {
      if (results === void 0) {
        results = 6;
      }
      var hsv = this.toHsv();
      var h = hsv.h;
      var s = hsv.s;
      var v = hsv.v;
      var res = [];
      var modification = 1 / results;
      while (results--) {
        res.push(new TinyColor2({ h, s, v }));
        v = (v + modification) % 1;
      }
      return res;
    };
    TinyColor2.prototype.splitcomplement = function() {
      var hsl = this.toHsl();
      var h = hsl.h;
      return [
        this,
        new TinyColor2({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
        new TinyColor2({ h: (h + 216) % 360, s: hsl.s, l: hsl.l })
      ];
    };
    TinyColor2.prototype.onBackground = function(background) {
      var fg = this.toRgb();
      var bg = new TinyColor2(background).toRgb();
      return new TinyColor2({
        r: bg.r + (fg.r - bg.r) * fg.a,
        g: bg.g + (fg.g - bg.g) * fg.a,
        b: bg.b + (fg.b - bg.b) * fg.a
      });
    };
    TinyColor2.prototype.triad = function() {
      return this.polyad(3);
    };
    TinyColor2.prototype.tetrad = function() {
      return this.polyad(4);
    };
    TinyColor2.prototype.polyad = function(n) {
      var hsl = this.toHsl();
      var h = hsl.h;
      var result = [this];
      var increment = 360 / n;
      for (var i = 1; i < n; i++) {
        result.push(new TinyColor2({ h: (h + i * increment) % 360, s: hsl.s, l: hsl.l }));
      }
      return result;
    };
    TinyColor2.prototype.equals = function(color) {
      return this.toRgbString() === new TinyColor2(color).toRgbString();
    };
    return TinyColor2;
  }();

  function darken(color, amount = 20) {
    return color.mix("#141414", amount).toString();
  }
  function useButtonCustomStyle(props) {
    const _disabled = useFormDisabled();
    const ns = useNamespace("button");
    return vue.computed(() => {
      let styles = {};
      const buttonColor = props.color;
      if (buttonColor) {
        const color = new TinyColor(buttonColor);
        const activeBgColor = props.dark ? color.tint(20).toString() : darken(color, 20);
        if (props.plain) {
          styles = ns.cssVarBlock({
            "bg-color": props.dark ? darken(color, 90) : color.tint(90).toString(),
            "text-color": buttonColor,
            "border-color": props.dark ? darken(color, 50) : color.tint(50).toString(),
            "hover-text-color": `var(${ns.cssVarName("color-white")})`,
            "hover-bg-color": buttonColor,
            "hover-border-color": buttonColor,
            "active-bg-color": activeBgColor,
            "active-text-color": `var(${ns.cssVarName("color-white")})`,
            "active-border-color": activeBgColor
          });
          if (_disabled.value) {
            styles[ns.cssVarBlockName("disabled-bg-color")] = props.dark ? darken(color, 90) : color.tint(90).toString();
            styles[ns.cssVarBlockName("disabled-text-color")] = props.dark ? darken(color, 50) : color.tint(50).toString();
            styles[ns.cssVarBlockName("disabled-border-color")] = props.dark ? darken(color, 80) : color.tint(80).toString();
          }
        } else {
          const hoverBgColor = props.dark ? darken(color, 30) : color.tint(30).toString();
          const textColor = color.isDark() ? `var(${ns.cssVarName("color-white")})` : `var(${ns.cssVarName("color-black")})`;
          styles = ns.cssVarBlock({
            "bg-color": buttonColor,
            "text-color": textColor,
            "border-color": buttonColor,
            "hover-bg-color": hoverBgColor,
            "hover-text-color": textColor,
            "hover-border-color": hoverBgColor,
            "active-bg-color": activeBgColor,
            "active-border-color": activeBgColor
          });
          if (_disabled.value) {
            const disabledButtonColor = props.dark ? darken(color, 50) : color.tint(50).toString();
            styles[ns.cssVarBlockName("disabled-bg-color")] = disabledButtonColor;
            styles[ns.cssVarBlockName("disabled-text-color")] = props.dark ? "rgba(255, 255, 255, 0.5)" : `var(${ns.cssVarName("color-white")})`;
            styles[ns.cssVarBlockName("disabled-border-color")] = disabledButtonColor;
          }
        }
      }
      return styles;
    });
  }

  const __default__$1j = vue.defineComponent({
    name: "ElButton"
  });
  const _sfc_main$1Y = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1j,
    props: buttonProps,
    emits: buttonEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const buttonStyle = useButtonCustomStyle(props);
      const ns = useNamespace("button");
      const { _ref, _size, _type, _disabled, _props, shouldAddSpace, handleClick } = useButton(props, emit);
      expose({
        ref: _ref,
        size: _size,
        type: _type,
        disabled: _disabled,
        shouldAddSpace
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.tag), vue.mergeProps({
          ref_key: "_ref",
          ref: _ref
        }, vue.unref(_props), {
          class: [
            vue.unref(ns).b(),
            vue.unref(ns).m(vue.unref(_type)),
            vue.unref(ns).m(vue.unref(_size)),
            vue.unref(ns).is("disabled", vue.unref(_disabled)),
            vue.unref(ns).is("loading", _ctx.loading),
            vue.unref(ns).is("plain", _ctx.plain),
            vue.unref(ns).is("round", _ctx.round),
            vue.unref(ns).is("circle", _ctx.circle),
            vue.unref(ns).is("text", _ctx.text),
            vue.unref(ns).is("link", _ctx.link),
            vue.unref(ns).is("has-bg", _ctx.bg)
          ],
          style: vue.unref(buttonStyle),
          onClick: vue.unref(handleClick)
        }), {
          default: vue.withCtx(() => [
            _ctx.loading ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
              _ctx.$slots.loading ? vue.renderSlot(_ctx.$slots, "loading", { key: 0 }) : (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                key: 1,
                class: vue.normalizeClass(vue.unref(ns).is("loading"))
              }, {
                default: vue.withCtx(() => [
                  (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.loadingIcon)))
                ]),
                _: 1
              }, 8, ["class"]))
            ], 64)) : _ctx.icon || _ctx.$slots.icon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), { key: 1 }, {
              default: vue.withCtx(() => [
                _ctx.icon ? (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.icon), { key: 0 })) : vue.renderSlot(_ctx.$slots, "icon", { key: 1 })
              ]),
              _: 3
            })) : vue.createCommentVNode("v-if", true),
            _ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 2,
              class: vue.normalizeClass({ [vue.unref(ns).em("text", "expand")]: vue.unref(shouldAddSpace) })
            }, [
              vue.renderSlot(_ctx.$slots, "default")
            ], 2)) : vue.createCommentVNode("v-if", true)
          ]),
          _: 3
        }, 16, ["class", "style", "onClick"]);
      };
    }
  });
  var Button = /* @__PURE__ */ _export_sfc(_sfc_main$1Y, [["__file", "button.vue"]]);

  const buttonGroupProps = {
    size: buttonProps.size,
    type: buttonProps.type
  };

  const __default__$1i = vue.defineComponent({
    name: "ElButtonGroup"
  });
  const _sfc_main$1X = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1i,
    props: buttonGroupProps,
    setup(__props) {
      const props = __props;
      vue.provide(buttonGroupContextKey, vue.reactive({
        size: vue.toRef(props, "size"),
        type: vue.toRef(props, "type")
      }));
      const ns = useNamespace("button");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(`${vue.unref(ns).b("group")}`)
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 2);
      };
    }
  });
  var ButtonGroup = /* @__PURE__ */ _export_sfc(_sfc_main$1X, [["__file", "button-group.vue"]]);

  const ElButton = withInstall(Button, {
    ButtonGroup
  });
  const ElButtonGroup$1 = withNoopInstall(ButtonGroup);

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var dayjs_min = {exports: {}};

  (function(module, exports) {
    !function(t, e) {
      module.exports = e() ;
    }(commonjsGlobal, function() {
      var t = 1e3, e = 6e4, n = 36e5, r = "millisecond", i = "second", s = "minute", u = "hour", a = "day", o = "week", f = "month", h = "quarter", c = "year", d = "date", $ = "Invalid Date", l = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, y = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, M = { name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_") }, m = function(t2, e2, n2) {
        var r2 = String(t2);
        return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
      }, g = { s: m, z: function(t2) {
        var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
        return (e2 <= 0 ? "+" : "-") + m(r2, 2, "0") + ":" + m(i2, 2, "0");
      }, m: function t2(e2, n2) {
        if (e2.date() < n2.date())
          return -t2(n2, e2);
        var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, f), s2 = n2 - i2 < 0, u2 = e2.clone().add(r2 + (s2 ? -1 : 1), f);
        return +(-(r2 + (n2 - i2) / (s2 ? i2 - u2 : u2 - i2)) || 0);
      }, a: function(t2) {
        return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
      }, p: function(t2) {
        return { M: f, y: c, w: o, d: a, D: d, h: u, m: s, s: i, ms: r, Q: h }[t2] || String(t2 || "").toLowerCase().replace(/s$/, "");
      }, u: function(t2) {
        return t2 === void 0;
      } }, v = "en", D = {};
      D[v] = M;
      var p = function(t2) {
        return t2 instanceof _;
      }, S = function t2(e2, n2, r2) {
        var i2;
        if (!e2)
          return v;
        if (typeof e2 == "string") {
          var s2 = e2.toLowerCase();
          D[s2] && (i2 = s2), n2 && (D[s2] = n2, i2 = s2);
          var u2 = e2.split("-");
          if (!i2 && u2.length > 1)
            return t2(u2[0]);
        } else {
          var a2 = e2.name;
          D[a2] = e2, i2 = a2;
        }
        return !r2 && i2 && (v = i2), i2 || !r2 && v;
      }, w = function(t2, e2) {
        if (p(t2))
          return t2.clone();
        var n2 = typeof e2 == "object" ? e2 : {};
        return n2.date = t2, n2.args = arguments, new _(n2);
      }, O = g;
      O.l = S, O.i = p, O.w = function(t2, e2) {
        return w(t2, { locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset });
      };
      var _ = function() {
        function M2(t2) {
          this.$L = S(t2.locale, null, true), this.parse(t2);
        }
        var m2 = M2.prototype;
        return m2.parse = function(t2) {
          this.$d = function(t3) {
            var e2 = t3.date, n2 = t3.utc;
            if (e2 === null)
              return new Date(NaN);
            if (O.u(e2))
              return new Date();
            if (e2 instanceof Date)
              return new Date(e2);
            if (typeof e2 == "string" && !/Z$/i.test(e2)) {
              var r2 = e2.match(l);
              if (r2) {
                var i2 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
                return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
              }
            }
            return new Date(e2);
          }(t2), this.$x = t2.x || {}, this.init();
        }, m2.init = function() {
          var t2 = this.$d;
          this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
        }, m2.$utils = function() {
          return O;
        }, m2.isValid = function() {
          return !(this.$d.toString() === $);
        }, m2.isSame = function(t2, e2) {
          var n2 = w(t2);
          return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
        }, m2.isAfter = function(t2, e2) {
          return w(t2) < this.startOf(e2);
        }, m2.isBefore = function(t2, e2) {
          return this.endOf(e2) < w(t2);
        }, m2.$g = function(t2, e2, n2) {
          return O.u(t2) ? this[e2] : this.set(n2, t2);
        }, m2.unix = function() {
          return Math.floor(this.valueOf() / 1e3);
        }, m2.valueOf = function() {
          return this.$d.getTime();
        }, m2.startOf = function(t2, e2) {
          var n2 = this, r2 = !!O.u(e2) || e2, h2 = O.p(t2), $2 = function(t3, e3) {
            var i2 = O.w(n2.$u ? Date.UTC(n2.$y, e3, t3) : new Date(n2.$y, e3, t3), n2);
            return r2 ? i2 : i2.endOf(a);
          }, l2 = function(t3, e3) {
            return O.w(n2.toDate()[t3].apply(n2.toDate("s"), (r2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e3)), n2);
          }, y2 = this.$W, M3 = this.$M, m3 = this.$D, g2 = "set" + (this.$u ? "UTC" : "");
          switch (h2) {
            case c:
              return r2 ? $2(1, 0) : $2(31, 11);
            case f:
              return r2 ? $2(1, M3) : $2(0, M3 + 1);
            case o:
              var v2 = this.$locale().weekStart || 0, D2 = (y2 < v2 ? y2 + 7 : y2) - v2;
              return $2(r2 ? m3 - D2 : m3 + (6 - D2), M3);
            case a:
            case d:
              return l2(g2 + "Hours", 0);
            case u:
              return l2(g2 + "Minutes", 1);
            case s:
              return l2(g2 + "Seconds", 2);
            case i:
              return l2(g2 + "Milliseconds", 3);
            default:
              return this.clone();
          }
        }, m2.endOf = function(t2) {
          return this.startOf(t2, false);
        }, m2.$set = function(t2, e2) {
          var n2, o2 = O.p(t2), h2 = "set" + (this.$u ? "UTC" : ""), $2 = (n2 = {}, n2[a] = h2 + "Date", n2[d] = h2 + "Date", n2[f] = h2 + "Month", n2[c] = h2 + "FullYear", n2[u] = h2 + "Hours", n2[s] = h2 + "Minutes", n2[i] = h2 + "Seconds", n2[r] = h2 + "Milliseconds", n2)[o2], l2 = o2 === a ? this.$D + (e2 - this.$W) : e2;
          if (o2 === f || o2 === c) {
            var y2 = this.clone().set(d, 1);
            y2.$d[$2](l2), y2.init(), this.$d = y2.set(d, Math.min(this.$D, y2.daysInMonth())).$d;
          } else
            $2 && this.$d[$2](l2);
          return this.init(), this;
        }, m2.set = function(t2, e2) {
          return this.clone().$set(t2, e2);
        }, m2.get = function(t2) {
          return this[O.p(t2)]();
        }, m2.add = function(r2, h2) {
          var d2, $2 = this;
          r2 = Number(r2);
          var l2 = O.p(h2), y2 = function(t2) {
            var e2 = w($2);
            return O.w(e2.date(e2.date() + Math.round(t2 * r2)), $2);
          };
          if (l2 === f)
            return this.set(f, this.$M + r2);
          if (l2 === c)
            return this.set(c, this.$y + r2);
          if (l2 === a)
            return y2(1);
          if (l2 === o)
            return y2(7);
          var M3 = (d2 = {}, d2[s] = e, d2[u] = n, d2[i] = t, d2)[l2] || 1, m3 = this.$d.getTime() + r2 * M3;
          return O.w(m3, this);
        }, m2.subtract = function(t2, e2) {
          return this.add(-1 * t2, e2);
        }, m2.format = function(t2) {
          var e2 = this, n2 = this.$locale();
          if (!this.isValid())
            return n2.invalidDate || $;
          var r2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", i2 = O.z(this), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = n2.weekdays, f2 = n2.months, h2 = function(t3, n3, i3, s3) {
            return t3 && (t3[n3] || t3(e2, r2)) || i3[n3].slice(0, s3);
          }, c2 = function(t3) {
            return O.s(s2 % 12 || 12, t3, "0");
          }, d2 = n2.meridiem || function(t3, e3, n3) {
            var r3 = t3 < 12 ? "AM" : "PM";
            return n3 ? r3.toLowerCase() : r3;
          }, l2 = { YY: String(this.$y).slice(-2), YYYY: this.$y, M: a2 + 1, MM: O.s(a2 + 1, 2, "0"), MMM: h2(n2.monthsShort, a2, f2, 3), MMMM: h2(f2, a2), D: this.$D, DD: O.s(this.$D, 2, "0"), d: String(this.$W), dd: h2(n2.weekdaysMin, this.$W, o2, 2), ddd: h2(n2.weekdaysShort, this.$W, o2, 3), dddd: o2[this.$W], H: String(s2), HH: O.s(s2, 2, "0"), h: c2(1), hh: c2(2), a: d2(s2, u2, true), A: d2(s2, u2, false), m: String(u2), mm: O.s(u2, 2, "0"), s: String(this.$s), ss: O.s(this.$s, 2, "0"), SSS: O.s(this.$ms, 3, "0"), Z: i2 };
          return r2.replace(y, function(t3, e3) {
            return e3 || l2[t3] || i2.replace(":", "");
          });
        }, m2.utcOffset = function() {
          return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
        }, m2.diff = function(r2, d2, $2) {
          var l2, y2 = O.p(d2), M3 = w(r2), m3 = (M3.utcOffset() - this.utcOffset()) * e, g2 = this - M3, v2 = O.m(this, M3);
          return v2 = (l2 = {}, l2[c] = v2 / 12, l2[f] = v2, l2[h] = v2 / 3, l2[o] = (g2 - m3) / 6048e5, l2[a] = (g2 - m3) / 864e5, l2[u] = g2 / n, l2[s] = g2 / e, l2[i] = g2 / t, l2)[y2] || g2, $2 ? v2 : O.a(v2);
        }, m2.daysInMonth = function() {
          return this.endOf(f).$D;
        }, m2.$locale = function() {
          return D[this.$L];
        }, m2.locale = function(t2, e2) {
          if (!t2)
            return this.$L;
          var n2 = this.clone(), r2 = S(t2, e2, true);
          return r2 && (n2.$L = r2), n2;
        }, m2.clone = function() {
          return O.w(this.$d, this);
        }, m2.toDate = function() {
          return new Date(this.valueOf());
        }, m2.toJSON = function() {
          return this.isValid() ? this.toISOString() : null;
        }, m2.toISOString = function() {
          return this.$d.toISOString();
        }, m2.toString = function() {
          return this.$d.toUTCString();
        }, M2;
      }(), T = _.prototype;
      return w.prototype = T, [["$ms", r], ["$s", i], ["$m", s], ["$H", u], ["$W", a], ["$M", f], ["$y", c], ["$D", d]].forEach(function(t2) {
        T[t2[1]] = function(e2) {
          return this.$g(e2, t2[0], t2[1]);
        };
      }), w.extend = function(t2, e2) {
        return t2.$i || (t2(e2, _, w), t2.$i = true), w;
      }, w.locale = S, w.isDayjs = p, w.unix = function(t2) {
        return w(1e3 * t2);
      }, w.en = D[v], w.Ls = D, w.p = {}, w;
    });
  })(dayjs_min);
  var dayjs = dayjs_min.exports;

  var customParseFormat$1 = {exports: {}};

  (function(module, exports) {
    !function(e, t) {
      module.exports = t() ;
    }(commonjsGlobal, function() {
      var e = { LTS: "h:mm:ss A", LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY h:mm A", LLLL: "dddd, MMMM D, YYYY h:mm A" }, t = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|YYYY|YY?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g, n = /\d\d/, r = /\d\d?/, i = /\d*[^-_:/,()\s\d]+/, o = {}, s = function(e2) {
        return (e2 = +e2) + (e2 > 68 ? 1900 : 2e3);
      };
      var a = function(e2) {
        return function(t2) {
          this[e2] = +t2;
        };
      }, f = [/[+-]\d\d:?(\d\d)?|Z/, function(e2) {
        (this.zone || (this.zone = {})).offset = function(e3) {
          if (!e3)
            return 0;
          if (e3 === "Z")
            return 0;
          var t2 = e3.match(/([+-]|\d\d)/g), n2 = 60 * t2[1] + (+t2[2] || 0);
          return n2 === 0 ? 0 : t2[0] === "+" ? -n2 : n2;
        }(e2);
      }], h = function(e2) {
        var t2 = o[e2];
        return t2 && (t2.indexOf ? t2 : t2.s.concat(t2.f));
      }, u = function(e2, t2) {
        var n2, r2 = o.meridiem;
        if (r2) {
          for (var i2 = 1; i2 <= 24; i2 += 1)
            if (e2.indexOf(r2(i2, 0, t2)) > -1) {
              n2 = i2 > 12;
              break;
            }
        } else
          n2 = e2 === (t2 ? "pm" : "PM");
        return n2;
      }, d = { A: [i, function(e2) {
        this.afternoon = u(e2, false);
      }], a: [i, function(e2) {
        this.afternoon = u(e2, true);
      }], S: [/\d/, function(e2) {
        this.milliseconds = 100 * +e2;
      }], SS: [n, function(e2) {
        this.milliseconds = 10 * +e2;
      }], SSS: [/\d{3}/, function(e2) {
        this.milliseconds = +e2;
      }], s: [r, a("seconds")], ss: [r, a("seconds")], m: [r, a("minutes")], mm: [r, a("minutes")], H: [r, a("hours")], h: [r, a("hours")], HH: [r, a("hours")], hh: [r, a("hours")], D: [r, a("day")], DD: [n, a("day")], Do: [i, function(e2) {
        var t2 = o.ordinal, n2 = e2.match(/\d+/);
        if (this.day = n2[0], t2)
          for (var r2 = 1; r2 <= 31; r2 += 1)
            t2(r2).replace(/\[|\]/g, "") === e2 && (this.day = r2);
      }], M: [r, a("month")], MM: [n, a("month")], MMM: [i, function(e2) {
        var t2 = h("months"), n2 = (h("monthsShort") || t2.map(function(e3) {
          return e3.slice(0, 3);
        })).indexOf(e2) + 1;
        if (n2 < 1)
          throw new Error();
        this.month = n2 % 12 || n2;
      }], MMMM: [i, function(e2) {
        var t2 = h("months").indexOf(e2) + 1;
        if (t2 < 1)
          throw new Error();
        this.month = t2 % 12 || t2;
      }], Y: [/[+-]?\d+/, a("year")], YY: [n, function(e2) {
        this.year = s(e2);
      }], YYYY: [/\d{4}/, a("year")], Z: f, ZZ: f };
      function c(n2) {
        var r2, i2;
        r2 = n2, i2 = o && o.formats;
        for (var s2 = (n2 = r2.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(t2, n3, r3) {
          var o2 = r3 && r3.toUpperCase();
          return n3 || i2[r3] || e[r3] || i2[o2].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(e2, t3, n4) {
            return t3 || n4.slice(1);
          });
        })).match(t), a2 = s2.length, f2 = 0; f2 < a2; f2 += 1) {
          var h2 = s2[f2], u2 = d[h2], c2 = u2 && u2[0], l = u2 && u2[1];
          s2[f2] = l ? { regex: c2, parser: l } : h2.replace(/^\[|\]$/g, "");
        }
        return function(e2) {
          for (var t2 = {}, n3 = 0, r3 = 0; n3 < a2; n3 += 1) {
            var i3 = s2[n3];
            if (typeof i3 == "string")
              r3 += i3.length;
            else {
              var o2 = i3.regex, f3 = i3.parser, h3 = e2.slice(r3), u3 = o2.exec(h3)[0];
              f3.call(t2, u3), e2 = e2.replace(u3, "");
            }
          }
          return function(e3) {
            var t3 = e3.afternoon;
            if (t3 !== void 0) {
              var n4 = e3.hours;
              t3 ? n4 < 12 && (e3.hours += 12) : n4 === 12 && (e3.hours = 0), delete e3.afternoon;
            }
          }(t2), t2;
        };
      }
      return function(e2, t2, n2) {
        n2.p.customParseFormat = true, e2 && e2.parseTwoDigitYear && (s = e2.parseTwoDigitYear);
        var r2 = t2.prototype, i2 = r2.parse;
        r2.parse = function(e3) {
          var t3 = e3.date, r3 = e3.utc, s2 = e3.args;
          this.$u = r3;
          var a2 = s2[1];
          if (typeof a2 == "string") {
            var f2 = s2[2] === true, h2 = s2[3] === true, u2 = f2 || h2, d2 = s2[2];
            h2 && (d2 = s2[2]), o = this.$locale(), !f2 && d2 && (o = n2.Ls[d2]), this.$d = function(e4, t4, n3) {
              try {
                if (["x", "X"].indexOf(t4) > -1)
                  return new Date((t4 === "X" ? 1e3 : 1) * e4);
                var r4 = c(t4)(e4), i3 = r4.year, o2 = r4.month, s3 = r4.day, a3 = r4.hours, f3 = r4.minutes, h3 = r4.seconds, u3 = r4.milliseconds, d3 = r4.zone, l2 = new Date(), m2 = s3 || (i3 || o2 ? 1 : l2.getDate()), M2 = i3 || l2.getFullYear(), Y = 0;
                i3 && !o2 || (Y = o2 > 0 ? o2 - 1 : l2.getMonth());
                var p = a3 || 0, v = f3 || 0, D = h3 || 0, g = u3 || 0;
                return d3 ? new Date(Date.UTC(M2, Y, m2, p, v, D, g + 60 * d3.offset * 1e3)) : n3 ? new Date(Date.UTC(M2, Y, m2, p, v, D, g)) : new Date(M2, Y, m2, p, v, D, g);
              } catch (e5) {
                return new Date("");
              }
            }(t3, a2, r3), this.init(), d2 && d2 !== true && (this.$L = this.locale(d2).$L), u2 && t3 != this.format(a2) && (this.$d = new Date("")), o = {};
          } else if (a2 instanceof Array)
            for (var l = a2.length, m = 1; m <= l; m += 1) {
              s2[1] = a2[m - 1];
              var M = n2.apply(this, s2);
              if (M.isValid()) {
                this.$d = M.$d, this.$L = M.$L, this.init();
                break;
              }
              m === l && (this.$d = new Date(""));
            }
          else
            i2.call(this, e3);
        };
      };
    });
  })(customParseFormat$1);
  var customParseFormat = customParseFormat$1.exports;

  const timeUnits$1 = ["hours", "minutes", "seconds"];
  const DEFAULT_FORMATS_TIME = "HH:mm:ss";
  const DEFAULT_FORMATS_DATE = "YYYY-MM-DD";
  const DEFAULT_FORMATS_DATEPICKER = {
    date: DEFAULT_FORMATS_DATE,
    dates: DEFAULT_FORMATS_DATE,
    week: "gggg[w]ww",
    year: "YYYY",
    month: "YYYY-MM",
    datetime: `${DEFAULT_FORMATS_DATE} ${DEFAULT_FORMATS_TIME}`,
    monthrange: "YYYY-MM",
    daterange: DEFAULT_FORMATS_DATE,
    datetimerange: `${DEFAULT_FORMATS_DATE} ${DEFAULT_FORMATS_TIME}`
  };

  const buildTimeList = (value, bound) => {
    return [
      value > 0 ? value - 1 : void 0,
      value,
      value < bound ? value + 1 : void 0
    ];
  };
  const rangeArr = (n) => Array.from(Array.from({ length: n }).keys());
  const extractDateFormat = (format) => {
    return format.replace(/\W?m{1,2}|\W?ZZ/g, "").replace(/\W?h{1,2}|\W?s{1,3}|\W?a/gi, "").trim();
  };
  const extractTimeFormat = (format) => {
    return format.replace(/\W?D{1,2}|\W?Do|\W?d{1,4}|\W?M{1,4}|\W?Y{2,4}/g, "").trim();
  };
  const dateEquals = function(a, b) {
    const aIsDate = isDate$1(a);
    const bIsDate = isDate$1(b);
    if (aIsDate && bIsDate) {
      return a.getTime() === b.getTime();
    }
    if (!aIsDate && !bIsDate) {
      return a === b;
    }
    return false;
  };
  const valueEquals = function(a, b) {
    const aIsArray = isArray$1(a);
    const bIsArray = isArray$1(b);
    if (aIsArray && bIsArray) {
      if (a.length !== b.length) {
        return false;
      }
      return a.every((item, index) => dateEquals(item, b[index]));
    }
    if (!aIsArray && !bIsArray) {
      return dateEquals(a, b);
    }
    return false;
  };
  const parseDate = function(date, format, lang) {
    const day = isEmpty(format) || format === "x" ? dayjs(date).locale(lang) : dayjs(date, format).locale(lang);
    return day.isValid() ? day : void 0;
  };
  const formatter = function(date, format, lang) {
    if (isEmpty(format))
      return date;
    if (format === "x")
      return +date;
    return dayjs(date).locale(lang).format(format);
  };
  const makeList = (total, method) => {
    var _a;
    const arr = [];
    const disabledArr = method == null ? void 0 : method();
    for (let i = 0; i < total; i++) {
      arr.push((_a = disabledArr == null ? void 0 : disabledArr.includes(i)) != null ? _a : false);
    }
    return arr;
  };

  const disabledTimeListsProps = buildProps({
    disabledHours: {
      type: definePropType(Function)
    },
    disabledMinutes: {
      type: definePropType(Function)
    },
    disabledSeconds: {
      type: definePropType(Function)
    }
  });
  const timePanelSharedProps = buildProps({
    visible: Boolean,
    actualVisible: {
      type: Boolean,
      default: void 0
    },
    format: {
      type: String,
      default: ""
    }
  });

  const timePickerDefaultProps = buildProps({
    id: {
      type: definePropType([Array, String])
    },
    name: {
      type: definePropType([Array, String]),
      default: ""
    },
    popperClass: {
      type: String,
      default: ""
    },
    format: String,
    valueFormat: String,
    dateFormat: String,
    timeFormat: String,
    type: {
      type: String,
      default: ""
    },
    clearable: {
      type: Boolean,
      default: true
    },
    clearIcon: {
      type: definePropType([String, Object]),
      default: circle_close_default
    },
    editable: {
      type: Boolean,
      default: true
    },
    prefixIcon: {
      type: definePropType([String, Object]),
      default: ""
    },
    size: useSizeProp,
    readonly: Boolean,
    disabled: Boolean,
    placeholder: {
      type: String,
      default: ""
    },
    popperOptions: {
      type: definePropType(Object),
      default: () => ({})
    },
    modelValue: {
      type: definePropType([Date, Array, String, Number]),
      default: ""
    },
    rangeSeparator: {
      type: String,
      default: "-"
    },
    startPlaceholder: String,
    endPlaceholder: String,
    defaultValue: {
      type: definePropType([Date, Array])
    },
    defaultTime: {
      type: definePropType([Date, Array])
    },
    isRange: Boolean,
    ...disabledTimeListsProps,
    disabledDate: {
      type: Function
    },
    cellClassName: {
      type: Function
    },
    shortcuts: {
      type: Array,
      default: () => []
    },
    arrowControl: Boolean,
    label: {
      type: String,
      default: void 0
    },
    tabindex: {
      type: definePropType([String, Number]),
      default: 0
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    unlinkPanels: Boolean
  });

  const _hoisted_1$Z = ["id", "name", "placeholder", "value", "disabled", "readonly"];
  const _hoisted_2$E = ["id", "name", "placeholder", "value", "disabled", "readonly"];
  const __default__$1h = vue.defineComponent({
    name: "Picker"
  });
  const _sfc_main$1W = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1h,
    props: timePickerDefaultProps,
    emits: [
      "update:modelValue",
      "change",
      "focus",
      "blur",
      "calendar-change",
      "panel-change",
      "visible-change",
      "keydown"
    ],
    setup(__props, { expose, emit }) {
      const props = __props;
      const attrs = vue.useAttrs();
      const { lang } = useLocale();
      const nsDate = useNamespace("date");
      const nsInput = useNamespace("input");
      const nsRange = useNamespace("range");
      const { form, formItem } = useFormItem();
      const elPopperOptions = vue.inject("ElPopperOptions", {});
      const refPopper = vue.ref();
      const inputRef = vue.ref();
      const pickerVisible = vue.ref(false);
      const pickerActualVisible = vue.ref(false);
      const valueOnOpen = vue.ref(null);
      let hasJustTabExitedInput = false;
      let ignoreFocusEvent = false;
      const rangeInputKls = vue.computed(() => [
        nsDate.b("editor"),
        nsDate.bm("editor", props.type),
        nsInput.e("wrapper"),
        nsDate.is("disabled", pickerDisabled.value),
        nsDate.is("active", pickerVisible.value),
        nsRange.b("editor"),
        pickerSize ? nsRange.bm("editor", pickerSize.value) : "",
        attrs.class
      ]);
      const clearIconKls = vue.computed(() => [
        nsInput.e("icon"),
        nsRange.e("close-icon"),
        !showClose.value ? nsRange.e("close-icon--hidden") : ""
      ]);
      vue.watch(pickerVisible, (val) => {
        if (!val) {
          userInput.value = null;
          vue.nextTick(() => {
            emitChange(props.modelValue);
          });
        } else {
          vue.nextTick(() => {
            if (val) {
              valueOnOpen.value = props.modelValue;
            }
          });
        }
      });
      const emitChange = (val, isClear) => {
        if (isClear || !valueEquals(val, valueOnOpen.value)) {
          emit("change", val);
          props.validateEvent && (formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn()));
        }
      };
      const emitInput = (input) => {
        if (!valueEquals(props.modelValue, input)) {
          let formatted;
          if (isArray$1(input)) {
            formatted = input.map((item) => formatter(item, props.valueFormat, lang.value));
          } else if (input) {
            formatted = formatter(input, props.valueFormat, lang.value);
          }
          emit("update:modelValue", input ? formatted : input, lang.value);
        }
      };
      const emitKeydown = (e) => {
        emit("keydown", e);
      };
      const refInput = vue.computed(() => {
        if (inputRef.value) {
          const _r = isRangeInput.value ? inputRef.value : inputRef.value.$el;
          return Array.from(_r.querySelectorAll("input"));
        }
        return [];
      });
      const setSelectionRange = (start, end, pos) => {
        const _inputs = refInput.value;
        if (!_inputs.length)
          return;
        if (!pos || pos === "min") {
          _inputs[0].setSelectionRange(start, end);
          _inputs[0].focus();
        } else if (pos === "max") {
          _inputs[1].setSelectionRange(start, end);
          _inputs[1].focus();
        }
      };
      const focusOnInputBox = () => {
        focus(true, true);
        vue.nextTick(() => {
          ignoreFocusEvent = false;
        });
      };
      const onPick = (date = "", visible = false) => {
        if (!visible) {
          ignoreFocusEvent = true;
        }
        pickerVisible.value = visible;
        let result;
        if (isArray$1(date)) {
          result = date.map((_) => _.toDate());
        } else {
          result = date ? date.toDate() : date;
        }
        userInput.value = null;
        emitInput(result);
      };
      const onBeforeShow = () => {
        pickerActualVisible.value = true;
      };
      const onShow = () => {
        emit("visible-change", true);
      };
      const onKeydownPopperContent = (event) => {
        if ((event == null ? void 0 : event.key) === EVENT_CODE.esc) {
          focus(true, true);
        }
      };
      const onHide = () => {
        pickerActualVisible.value = false;
        pickerVisible.value = false;
        ignoreFocusEvent = false;
        emit("visible-change", false);
      };
      const handleOpen = () => {
        pickerVisible.value = true;
      };
      const handleClose = () => {
        pickerVisible.value = false;
      };
      const focus = (focusStartInput = true, isIgnoreFocusEvent = false) => {
        ignoreFocusEvent = isIgnoreFocusEvent;
        const [leftInput, rightInput] = vue.unref(refInput);
        let input = leftInput;
        if (!focusStartInput && isRangeInput.value) {
          input = rightInput;
        }
        if (input) {
          input.focus();
        }
      };
      const handleFocusInput = (e) => {
        if (props.readonly || pickerDisabled.value || pickerVisible.value || ignoreFocusEvent) {
          return;
        }
        pickerVisible.value = true;
        emit("focus", e);
      };
      let currentHandleBlurDeferCallback = void 0;
      const handleBlurInput = (e) => {
        const handleBlurDefer = async () => {
          setTimeout(() => {
            var _a;
            if (currentHandleBlurDeferCallback === handleBlurDefer) {
              if (!(((_a = refPopper.value) == null ? void 0 : _a.isFocusInsideContent()) && !hasJustTabExitedInput) && refInput.value.filter((input) => {
                return input.contains(document.activeElement);
              }).length === 0) {
                handleChange();
                pickerVisible.value = false;
                emit("blur", e);
                props.validateEvent && (formItem == null ? void 0 : formItem.validate("blur").catch((err) => debugWarn()));
              }
              hasJustTabExitedInput = false;
            }
          }, 0);
        };
        currentHandleBlurDeferCallback = handleBlurDefer;
        handleBlurDefer();
      };
      const pickerDisabled = vue.computed(() => {
        return props.disabled || (form == null ? void 0 : form.disabled);
      });
      const parsedValue = vue.computed(() => {
        let dayOrDays;
        if (valueIsEmpty.value) {
          if (pickerOptions.value.getDefaultValue) {
            dayOrDays = pickerOptions.value.getDefaultValue();
          }
        } else {
          if (isArray$1(props.modelValue)) {
            dayOrDays = props.modelValue.map((d) => parseDate(d, props.valueFormat, lang.value));
          } else {
            dayOrDays = parseDate(props.modelValue, props.valueFormat, lang.value);
          }
        }
        if (pickerOptions.value.getRangeAvailableTime) {
          const availableResult = pickerOptions.value.getRangeAvailableTime(dayOrDays);
          if (!isEqual$1(availableResult, dayOrDays)) {
            dayOrDays = availableResult;
            emitInput(isArray$1(dayOrDays) ? dayOrDays.map((_) => _.toDate()) : dayOrDays.toDate());
          }
        }
        if (isArray$1(dayOrDays) && dayOrDays.some((day) => !day)) {
          dayOrDays = [];
        }
        return dayOrDays;
      });
      const displayValue = vue.computed(() => {
        if (!pickerOptions.value.panelReady)
          return "";
        const formattedValue = formatDayjsToString(parsedValue.value);
        if (isArray$1(userInput.value)) {
          return [
            userInput.value[0] || formattedValue && formattedValue[0] || "",
            userInput.value[1] || formattedValue && formattedValue[1] || ""
          ];
        } else if (userInput.value !== null) {
          return userInput.value;
        }
        if (!isTimePicker.value && valueIsEmpty.value)
          return "";
        if (!pickerVisible.value && valueIsEmpty.value)
          return "";
        if (formattedValue) {
          return isDatesPicker.value ? formattedValue.join(", ") : formattedValue;
        }
        return "";
      });
      const isTimeLikePicker = vue.computed(() => props.type.includes("time"));
      const isTimePicker = vue.computed(() => props.type.startsWith("time"));
      const isDatesPicker = vue.computed(() => props.type === "dates");
      const triggerIcon = vue.computed(() => props.prefixIcon || (isTimeLikePicker.value ? clock_default : calendar_default));
      const showClose = vue.ref(false);
      const onClearIconClick = (event) => {
        if (props.readonly || pickerDisabled.value)
          return;
        if (showClose.value) {
          event.stopPropagation();
          focusOnInputBox();
          emitInput(null);
          emitChange(null, true);
          showClose.value = false;
          pickerVisible.value = false;
          pickerOptions.value.handleClear && pickerOptions.value.handleClear();
        }
      };
      const valueIsEmpty = vue.computed(() => {
        const { modelValue } = props;
        return !modelValue || isArray$1(modelValue) && !modelValue.filter(Boolean).length;
      });
      const onMouseDownInput = async (event) => {
        var _a;
        if (props.readonly || pickerDisabled.value)
          return;
        if (((_a = event.target) == null ? void 0 : _a.tagName) !== "INPUT" || refInput.value.includes(document.activeElement)) {
          pickerVisible.value = true;
        }
      };
      const onMouseEnter = () => {
        if (props.readonly || pickerDisabled.value)
          return;
        if (!valueIsEmpty.value && props.clearable) {
          showClose.value = true;
        }
      };
      const onMouseLeave = () => {
        showClose.value = false;
      };
      const onTouchStartInput = (event) => {
        var _a;
        if (props.readonly || pickerDisabled.value)
          return;
        if (((_a = event.touches[0].target) == null ? void 0 : _a.tagName) !== "INPUT" || refInput.value.includes(document.activeElement)) {
          pickerVisible.value = true;
        }
      };
      const isRangeInput = vue.computed(() => {
        return props.type.includes("range");
      });
      const pickerSize = useFormSize();
      const popperEl = vue.computed(() => {
        var _a, _b;
        return (_b = (_a = vue.unref(refPopper)) == null ? void 0 : _a.popperRef) == null ? void 0 : _b.contentRef;
      });
      const actualInputRef = vue.computed(() => {
        var _a;
        if (vue.unref(isRangeInput)) {
          return vue.unref(inputRef);
        }
        return (_a = vue.unref(inputRef)) == null ? void 0 : _a.$el;
      });
      onClickOutside(actualInputRef, (e) => {
        const unrefedPopperEl = vue.unref(popperEl);
        const inputEl = vue.unref(actualInputRef);
        if (unrefedPopperEl && (e.target === unrefedPopperEl || e.composedPath().includes(unrefedPopperEl)) || e.target === inputEl || e.composedPath().includes(inputEl))
          return;
        pickerVisible.value = false;
      });
      const userInput = vue.ref(null);
      const handleChange = () => {
        if (userInput.value) {
          const value = parseUserInputToDayjs(displayValue.value);
          if (value) {
            if (isValidValue(value)) {
              emitInput(isArray$1(value) ? value.map((_) => _.toDate()) : value.toDate());
              userInput.value = null;
            }
          }
        }
        if (userInput.value === "") {
          emitInput(null);
          emitChange(null);
          userInput.value = null;
        }
      };
      const parseUserInputToDayjs = (value) => {
        if (!value)
          return null;
        return pickerOptions.value.parseUserInput(value);
      };
      const formatDayjsToString = (value) => {
        if (!value)
          return null;
        return pickerOptions.value.formatToString(value);
      };
      const isValidValue = (value) => {
        return pickerOptions.value.isValidValue(value);
      };
      const handleKeydownInput = async (event) => {
        if (props.readonly || pickerDisabled.value)
          return;
        const { code } = event;
        emitKeydown(event);
        if (code === EVENT_CODE.esc) {
          if (pickerVisible.value === true) {
            pickerVisible.value = false;
            event.preventDefault();
            event.stopPropagation();
          }
          return;
        }
        if (code === EVENT_CODE.down) {
          if (pickerOptions.value.handleFocusPicker) {
            event.preventDefault();
            event.stopPropagation();
          }
          if (pickerVisible.value === false) {
            pickerVisible.value = true;
            await vue.nextTick();
          }
          if (pickerOptions.value.handleFocusPicker) {
            pickerOptions.value.handleFocusPicker();
            return;
          }
        }
        if (code === EVENT_CODE.tab) {
          hasJustTabExitedInput = true;
          return;
        }
        if (code === EVENT_CODE.enter || code === EVENT_CODE.numpadEnter) {
          if (userInput.value === null || userInput.value === "" || isValidValue(parseUserInputToDayjs(displayValue.value))) {
            handleChange();
            pickerVisible.value = false;
          }
          event.stopPropagation();
          return;
        }
        if (userInput.value) {
          event.stopPropagation();
          return;
        }
        if (pickerOptions.value.handleKeydownInput) {
          pickerOptions.value.handleKeydownInput(event);
        }
      };
      const onUserInput = (e) => {
        userInput.value = e;
        if (!pickerVisible.value) {
          pickerVisible.value = true;
        }
      };
      const handleStartInput = (event) => {
        const target = event.target;
        if (userInput.value) {
          userInput.value = [target.value, userInput.value[1]];
        } else {
          userInput.value = [target.value, null];
        }
      };
      const handleEndInput = (event) => {
        const target = event.target;
        if (userInput.value) {
          userInput.value = [userInput.value[0], target.value];
        } else {
          userInput.value = [null, target.value];
        }
      };
      const handleStartChange = () => {
        var _a;
        const values = userInput.value;
        const value = parseUserInputToDayjs(values && values[0]);
        const parsedVal = vue.unref(parsedValue);
        if (value && value.isValid()) {
          userInput.value = [
            formatDayjsToString(value),
            ((_a = displayValue.value) == null ? void 0 : _a[1]) || null
          ];
          const newValue = [value, parsedVal && (parsedVal[1] || null)];
          if (isValidValue(newValue)) {
            emitInput(newValue);
            userInput.value = null;
          }
        }
      };
      const handleEndChange = () => {
        var _a;
        const values = vue.unref(userInput);
        const value = parseUserInputToDayjs(values && values[1]);
        const parsedVal = vue.unref(parsedValue);
        if (value && value.isValid()) {
          userInput.value = [
            ((_a = vue.unref(displayValue)) == null ? void 0 : _a[0]) || null,
            formatDayjsToString(value)
          ];
          const newValue = [parsedVal && parsedVal[0], value];
          if (isValidValue(newValue)) {
            emitInput(newValue);
            userInput.value = null;
          }
        }
      };
      const pickerOptions = vue.ref({});
      const onSetPickerOption = (e) => {
        pickerOptions.value[e[0]] = e[1];
        pickerOptions.value.panelReady = true;
      };
      const onCalendarChange = (e) => {
        emit("calendar-change", e);
      };
      const onPanelChange = (value, mode, view) => {
        emit("panel-change", value, mode, view);
      };
      vue.provide("EP_PICKER_BASE", {
        props
      });
      expose({
        focus,
        handleFocusInput,
        handleBlurInput,
        handleOpen,
        handleClose,
        onPick
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(ElTooltip), vue.mergeProps({
          ref_key: "refPopper",
          ref: refPopper,
          visible: pickerVisible.value,
          effect: "light",
          pure: "",
          trigger: "click"
        }, _ctx.$attrs, {
          role: "dialog",
          teleported: "",
          transition: `${vue.unref(nsDate).namespace.value}-zoom-in-top`,
          "popper-class": [`${vue.unref(nsDate).namespace.value}-picker__popper`, _ctx.popperClass],
          "popper-options": vue.unref(elPopperOptions),
          "fallback-placements": ["bottom", "top", "right", "left"],
          "gpu-acceleration": false,
          "stop-popper-mouse-event": false,
          "hide-after": 0,
          persistent: "",
          onBeforeShow,
          onShow,
          onHide
        }), {
          default: vue.withCtx(() => [
            !vue.unref(isRangeInput) ? (vue.openBlock(), vue.createBlock(vue.unref(ElInput), {
              key: 0,
              id: _ctx.id,
              ref_key: "inputRef",
              ref: inputRef,
              "container-role": "combobox",
              "model-value": vue.unref(displayValue),
              name: _ctx.name,
              size: vue.unref(pickerSize),
              disabled: vue.unref(pickerDisabled),
              placeholder: _ctx.placeholder,
              class: vue.normalizeClass([vue.unref(nsDate).b("editor"), vue.unref(nsDate).bm("editor", _ctx.type), _ctx.$attrs.class]),
              style: vue.normalizeStyle(_ctx.$attrs.style),
              readonly: !_ctx.editable || _ctx.readonly || vue.unref(isDatesPicker) || _ctx.type === "week",
              label: _ctx.label,
              tabindex: _ctx.tabindex,
              "validate-event": false,
              onInput: onUserInput,
              onFocus: handleFocusInput,
              onBlur: handleBlurInput,
              onKeydown: handleKeydownInput,
              onChange: handleChange,
              onMousedown: onMouseDownInput,
              onMouseenter: onMouseEnter,
              onMouseleave: onMouseLeave,
              onTouchstart: onTouchStartInput,
              onClick: _cache[0] || (_cache[0] = vue.withModifiers(() => {
              }, ["stop"]))
            }, {
              prefix: vue.withCtx(() => [
                vue.unref(triggerIcon) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                  key: 0,
                  class: vue.normalizeClass(vue.unref(nsInput).e("icon")),
                  onMousedown: vue.withModifiers(onMouseDownInput, ["prevent"]),
                  onTouchstart: onTouchStartInput
                }, {
                  default: vue.withCtx(() => [
                    (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(triggerIcon))))
                  ]),
                  _: 1
                }, 8, ["class", "onMousedown"])) : vue.createCommentVNode("v-if", true)
              ]),
              suffix: vue.withCtx(() => [
                showClose.value && _ctx.clearIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                  key: 0,
                  class: vue.normalizeClass(`${vue.unref(nsInput).e("icon")} clear-icon`),
                  onClick: vue.withModifiers(onClearIconClick, ["stop"])
                }, {
                  default: vue.withCtx(() => [
                    (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.clearIcon)))
                  ]),
                  _: 1
                }, 8, ["class", "onClick"])) : vue.createCommentVNode("v-if", true)
              ]),
              _: 1
            }, 8, ["id", "model-value", "name", "size", "disabled", "placeholder", "class", "style", "readonly", "label", "tabindex", "onKeydown"])) : (vue.openBlock(), vue.createElementBlock("div", {
              key: 1,
              ref_key: "inputRef",
              ref: inputRef,
              class: vue.normalizeClass(vue.unref(rangeInputKls)),
              style: vue.normalizeStyle(_ctx.$attrs.style),
              onClick: handleFocusInput,
              onMouseenter: onMouseEnter,
              onMouseleave: onMouseLeave,
              onTouchstart: onTouchStartInput,
              onKeydown: handleKeydownInput
            }, [
              vue.unref(triggerIcon) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                key: 0,
                class: vue.normalizeClass([vue.unref(nsInput).e("icon"), vue.unref(nsRange).e("icon")]),
                onMousedown: vue.withModifiers(onMouseDownInput, ["prevent"]),
                onTouchstart: onTouchStartInput
              }, {
                default: vue.withCtx(() => [
                  (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(vue.unref(triggerIcon))))
                ]),
                _: 1
              }, 8, ["class", "onMousedown"])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode("input", {
                id: _ctx.id && _ctx.id[0],
                autocomplete: "off",
                name: _ctx.name && _ctx.name[0],
                placeholder: _ctx.startPlaceholder,
                value: vue.unref(displayValue) && vue.unref(displayValue)[0],
                disabled: vue.unref(pickerDisabled),
                readonly: !_ctx.editable || _ctx.readonly,
                class: vue.normalizeClass(vue.unref(nsRange).b("input")),
                onMousedown: onMouseDownInput,
                onInput: handleStartInput,
                onChange: handleStartChange,
                onFocus: handleFocusInput,
                onBlur: handleBlurInput
              }, null, 42, _hoisted_1$Z),
              vue.renderSlot(_ctx.$slots, "range-separator", {}, () => [
                vue.createElementVNode("span", {
                  class: vue.normalizeClass(vue.unref(nsRange).b("separator"))
                }, vue.toDisplayString(_ctx.rangeSeparator), 3)
              ]),
              vue.createElementVNode("input", {
                id: _ctx.id && _ctx.id[1],
                autocomplete: "off",
                name: _ctx.name && _ctx.name[1],
                placeholder: _ctx.endPlaceholder,
                value: vue.unref(displayValue) && vue.unref(displayValue)[1],
                disabled: vue.unref(pickerDisabled),
                readonly: !_ctx.editable || _ctx.readonly,
                class: vue.normalizeClass(vue.unref(nsRange).b("input")),
                onMousedown: onMouseDownInput,
                onFocus: handleFocusInput,
                onBlur: handleBlurInput,
                onInput: handleEndInput,
                onChange: handleEndChange
              }, null, 42, _hoisted_2$E),
              _ctx.clearIcon ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                key: 1,
                class: vue.normalizeClass(vue.unref(clearIconKls)),
                onClick: onClearIconClick
              }, {
                default: vue.withCtx(() => [
                  (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.clearIcon)))
                ]),
                _: 1
              }, 8, ["class"])) : vue.createCommentVNode("v-if", true)
            ], 38))
          ]),
          content: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "default", {
              visible: pickerVisible.value,
              actualVisible: pickerActualVisible.value,
              parsedValue: vue.unref(parsedValue),
              format: _ctx.format,
              dateFormat: _ctx.dateFormat,
              timeFormat: _ctx.timeFormat,
              unlinkPanels: _ctx.unlinkPanels,
              type: _ctx.type,
              defaultValue: _ctx.defaultValue,
              onPick,
              onSelectRange: setSelectionRange,
              onSetPickerOption,
              onCalendarChange,
              onPanelChange,
              onKeydown: onKeydownPopperContent,
              onMousedown: _cache[1] || (_cache[1] = vue.withModifiers(() => {
              }, ["stop"]))
            })
          ]),
          _: 3
        }, 16, ["visible", "transition", "popper-class", "popper-options"]);
      };
    }
  });
  var CommonPicker = /* @__PURE__ */ _export_sfc(_sfc_main$1W, [["__file", "picker.vue"]]);

  const panelTimePickerProps = buildProps({
    ...timePanelSharedProps,
    datetimeRole: String,
    parsedValue: {
      type: definePropType(Object)
    }
  });

  const useTimePanel = ({
    getAvailableHours,
    getAvailableMinutes,
    getAvailableSeconds
  }) => {
    const getAvailableTime = (date, role, first, compareDate) => {
      const availableTimeGetters = {
        hour: getAvailableHours,
        minute: getAvailableMinutes,
        second: getAvailableSeconds
      };
      let result = date;
      ["hour", "minute", "second"].forEach((type) => {
        if (availableTimeGetters[type]) {
          let availableTimeSlots;
          const method = availableTimeGetters[type];
          switch (type) {
            case "minute": {
              availableTimeSlots = method(result.hour(), role, compareDate);
              break;
            }
            case "second": {
              availableTimeSlots = method(result.hour(), result.minute(), role, compareDate);
              break;
            }
            default: {
              availableTimeSlots = method(role, compareDate);
              break;
            }
          }
          if ((availableTimeSlots == null ? void 0 : availableTimeSlots.length) && !availableTimeSlots.includes(result[type]())) {
            const pos = first ? 0 : availableTimeSlots.length - 1;
            result = result[type](availableTimeSlots[pos]);
          }
        }
      });
      return result;
    };
    const timePickerOptions = {};
    const onSetOption = ([key, val]) => {
      timePickerOptions[key] = val;
    };
    return {
      timePickerOptions,
      getAvailableTime,
      onSetOption
    };
  };

  const makeAvailableArr = (disabledList) => {
    const trueOrNumber = (isDisabled, index) => isDisabled || index;
    const getNumber = (predicate) => predicate !== true;
    return disabledList.map(trueOrNumber).filter(getNumber);
  };
  const getTimeLists = (disabledHours, disabledMinutes, disabledSeconds) => {
    const getHoursList = (role, compare) => {
      return makeList(24, disabledHours && (() => disabledHours == null ? void 0 : disabledHours(role, compare)));
    };
    const getMinutesList = (hour, role, compare) => {
      return makeList(60, disabledMinutes && (() => disabledMinutes == null ? void 0 : disabledMinutes(hour, role, compare)));
    };
    const getSecondsList = (hour, minute, role, compare) => {
      return makeList(60, disabledSeconds && (() => disabledSeconds == null ? void 0 : disabledSeconds(hour, minute, role, compare)));
    };
    return {
      getHoursList,
      getMinutesList,
      getSecondsList
    };
  };
  const buildAvailableTimeSlotGetter = (disabledHours, disabledMinutes, disabledSeconds) => {
    const { getHoursList, getMinutesList, getSecondsList } = getTimeLists(disabledHours, disabledMinutes, disabledSeconds);
    const getAvailableHours = (role, compare) => {
      return makeAvailableArr(getHoursList(role, compare));
    };
    const getAvailableMinutes = (hour, role, compare) => {
      return makeAvailableArr(getMinutesList(hour, role, compare));
    };
    const getAvailableSeconds = (hour, minute, role, compare) => {
      return makeAvailableArr(getSecondsList(hour, minute, role, compare));
    };
    return {
      getAvailableHours,
      getAvailableMinutes,
      getAvailableSeconds
    };
  };
  const useOldValue = (props) => {
    const oldValue = vue.ref(props.parsedValue);
    vue.watch(() => props.visible, (val) => {
      if (!val) {
        oldValue.value = props.parsedValue;
      }
    });
    return oldValue;
  };

  const nodeList = /* @__PURE__ */ new Map();
  let startClick;
  if (isClient) {
    document.addEventListener("mousedown", (e) => startClick = e);
    document.addEventListener("mouseup", (e) => {
      for (const handlers of nodeList.values()) {
        for (const { documentHandler } of handlers) {
          documentHandler(e, startClick);
        }
      }
    });
  }
  function createDocumentHandler(el, binding) {
    let excludes = [];
    if (Array.isArray(binding.arg)) {
      excludes = binding.arg;
    } else if (isElement$1(binding.arg)) {
      excludes.push(binding.arg);
    }
    return function(mouseup, mousedown) {
      const popperRef = binding.instance.popperRef;
      const mouseUpTarget = mouseup.target;
      const mouseDownTarget = mousedown == null ? void 0 : mousedown.target;
      const isBound = !binding || !binding.instance;
      const isTargetExists = !mouseUpTarget || !mouseDownTarget;
      const isContainedByEl = el.contains(mouseUpTarget) || el.contains(mouseDownTarget);
      const isSelf = el === mouseUpTarget;
      const isTargetExcluded = excludes.length && excludes.some((item) => item == null ? void 0 : item.contains(mouseUpTarget)) || excludes.length && excludes.includes(mouseDownTarget);
      const isContainedByPopper = popperRef && (popperRef.contains(mouseUpTarget) || popperRef.contains(mouseDownTarget));
      if (isBound || isTargetExists || isContainedByEl || isSelf || isTargetExcluded || isContainedByPopper) {
        return;
      }
      binding.value(mouseup, mousedown);
    };
  }
  const ClickOutside = {
    beforeMount(el, binding) {
      if (!nodeList.has(el)) {
        nodeList.set(el, []);
      }
      nodeList.get(el).push({
        documentHandler: createDocumentHandler(el, binding),
        bindingFn: binding.value
      });
    },
    updated(el, binding) {
      if (!nodeList.has(el)) {
        nodeList.set(el, []);
      }
      const handlers = nodeList.get(el);
      const oldHandlerIndex = handlers.findIndex((item) => item.bindingFn === binding.oldValue);
      const newHandler = {
        documentHandler: createDocumentHandler(el, binding),
        bindingFn: binding.value
      };
      if (oldHandlerIndex >= 0) {
        handlers.splice(oldHandlerIndex, 1, newHandler);
      } else {
        handlers.push(newHandler);
      }
    },
    unmounted(el) {
      nodeList.delete(el);
    }
  };

  const REPEAT_INTERVAL = 100;
  const REPEAT_DELAY = 600;
  const vRepeatClick = {
    beforeMount(el, binding) {
      const value = binding.value;
      const { interval = REPEAT_INTERVAL, delay = REPEAT_DELAY } = isFunction$1(value) ? {} : value;
      let intervalId;
      let delayId;
      const handler = () => isFunction$1(value) ? value() : value.handler();
      const clear = () => {
        if (delayId) {
          clearTimeout(delayId);
          delayId = void 0;
        }
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = void 0;
        }
      };
      el.addEventListener("mousedown", (evt) => {
        if (evt.button !== 0)
          return;
        clear();
        handler();
        document.addEventListener("mouseup", () => clear(), {
          once: true
        });
        delayId = setTimeout(() => {
          intervalId = setInterval(() => {
            handler();
          }, interval);
        }, delay);
      });
    }
  };

  const FOCUSABLE_CHILDREN = "_trap-focus-children";
  const FOCUS_STACK = [];
  const FOCUS_HANDLER = (e) => {
    if (FOCUS_STACK.length === 0)
      return;
    const focusableElement = FOCUS_STACK[FOCUS_STACK.length - 1][FOCUSABLE_CHILDREN];
    if (focusableElement.length > 0 && e.code === EVENT_CODE.tab) {
      if (focusableElement.length === 1) {
        e.preventDefault();
        if (document.activeElement !== focusableElement[0]) {
          focusableElement[0].focus();
        }
        return;
      }
      const goingBackward = e.shiftKey;
      const isFirst = e.target === focusableElement[0];
      const isLast = e.target === focusableElement[focusableElement.length - 1];
      if (isFirst && goingBackward) {
        e.preventDefault();
        focusableElement[focusableElement.length - 1].focus();
      }
      if (isLast && !goingBackward) {
        e.preventDefault();
        focusableElement[0].focus();
      }
    }
  };
  const TrapFocus = {
    beforeMount(el) {
      el[FOCUSABLE_CHILDREN] = obtainAllFocusableElements$1(el);
      FOCUS_STACK.push(el);
      if (FOCUS_STACK.length <= 1) {
        document.addEventListener("keydown", FOCUS_HANDLER);
      }
    },
    updated(el) {
      vue.nextTick(() => {
        el[FOCUSABLE_CHILDREN] = obtainAllFocusableElements$1(el);
      });
    },
    unmounted() {
      FOCUS_STACK.shift();
      if (FOCUS_STACK.length === 0) {
        document.removeEventListener("keydown", FOCUS_HANDLER);
      }
    }
  };

  var v=!1,o,f,s,u,d,N,l,p,m,w,D,x,E,M,F;function a(){if(!v){v=!0;var e=navigator.userAgent,n=/(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(e),i=/(Mac OS X)|(Windows)|(Linux)/.exec(e);if(x=/\b(iPhone|iP[ao]d)/.exec(e),E=/\b(iP[ao]d)/.exec(e),w=/Android/i.exec(e),M=/FBAN\/\w+;/i.exec(e),F=/Mobile/i.exec(e),D=!!/Win64/.exec(e),n){o=n[1]?parseFloat(n[1]):n[5]?parseFloat(n[5]):NaN,o&&document&&document.documentMode&&(o=document.documentMode);var r=/(?:Trident\/(\d+.\d+))/.exec(e);N=r?parseFloat(r[1])+4:o,f=n[2]?parseFloat(n[2]):NaN,s=n[3]?parseFloat(n[3]):NaN,u=n[4]?parseFloat(n[4]):NaN,u?(n=/(?:Chrome\/(\d+\.\d+))/.exec(e),d=n&&n[1]?parseFloat(n[1]):NaN):d=NaN;}else o=f=s=d=u=NaN;if(i){if(i[1]){var t=/(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(e);l=t?parseFloat(t[1].replace("_",".")):!0;}else l=!1;p=!!i[2],m=!!i[3];}else l=p=m=!1;}}var _={ie:function(){return a()||o},ieCompatibilityMode:function(){return a()||N>o},ie64:function(){return _.ie()&&D},firefox:function(){return a()||f},opera:function(){return a()||s},webkit:function(){return a()||u},safari:function(){return _.webkit()},chrome:function(){return a()||d},windows:function(){return a()||p},osx:function(){return a()||l},linux:function(){return a()||m},iphone:function(){return a()||x},mobile:function(){return a()||x||E||w||F},nativeApp:function(){return a()||M},android:function(){return a()||w},ipad:function(){return a()||E}},A=_;var c=!!(typeof window<"u"&&window.document&&window.document.createElement),U={canUseDOM:c,canUseWorkers:typeof Worker<"u",canUseEventListeners:c&&!!(window.addEventListener||window.attachEvent),canUseViewport:c&&!!window.screen,isInWorker:!c},h=U;var X;h.canUseDOM&&(X=document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature("","")!==!0);function S(e,n){if(!h.canUseDOM||n&&!("addEventListener"in document))return !1;var i="on"+e,r=i in document;if(!r){var t=document.createElement("div");t.setAttribute(i,"return;"),r=typeof t[i]=="function";}return !r&&X&&e==="wheel"&&(r=document.implementation.hasFeature("Events.wheel","3.0")),r}var b=S;var O=10,I=40,P=800;function T(e){var n=0,i=0,r=0,t=0;return "detail"in e&&(i=e.detail),"wheelDelta"in e&&(i=-e.wheelDelta/120),"wheelDeltaY"in e&&(i=-e.wheelDeltaY/120),"wheelDeltaX"in e&&(n=-e.wheelDeltaX/120),"axis"in e&&e.axis===e.HORIZONTAL_AXIS&&(n=i,i=0),r=n*O,t=i*O,"deltaY"in e&&(t=e.deltaY),"deltaX"in e&&(r=e.deltaX),(r||t)&&e.deltaMode&&(e.deltaMode==1?(r*=I,t*=I):(r*=P,t*=P)),r&&!n&&(n=r<1?-1:1),t&&!i&&(i=t<1?-1:1),{spinX:n,spinY:i,pixelX:r,pixelY:t}}T.getEventType=function(){return A.firefox()?"DOMMouseScroll":b("wheel")?"wheel":"mousewheel"};var Y=T;/**
   * Checks if an event is supported in the current execution environment.
   *
   * NOTE: This will not work correctly for non-generic events such as `change`,
   * `reset`, `load`, `error`, and `select`.
   *
   * Borrows from Modernizr.
   *
   * @param {string} eventNameSuffix Event name, e.g. "click".
   * @param {?boolean} capture Check if the capture phase is supported.
   * @return {boolean} True if the event is supported.
   * @internal
   * @license Modernizr 3.0.0pre (Custom Build) | MIT
   */

  const mousewheel = function(element, callback) {
    if (element && element.addEventListener) {
      const fn = function(event) {
        const normalized = Y(event);
        callback && Reflect.apply(callback, this, [event, normalized]);
      };
      element.addEventListener("wheel", fn, { passive: true });
    }
  };
  const Mousewheel = {
    beforeMount(el, binding) {
      mousewheel(el, binding.value);
    }
  };

  const basicTimeSpinnerProps = buildProps({
    role: {
      type: String,
      required: true
    },
    spinnerDate: {
      type: definePropType(Object),
      required: true
    },
    showSeconds: {
      type: Boolean,
      default: true
    },
    arrowControl: Boolean,
    amPmMode: {
      type: definePropType(String),
      default: ""
    },
    ...disabledTimeListsProps
  });

  const _hoisted_1$Y = ["onClick"];
  const _hoisted_2$D = ["onMouseenter"];
  const _sfc_main$1V = /* @__PURE__ */ vue.defineComponent({
    __name: "basic-time-spinner",
    props: basicTimeSpinnerProps,
    emits: ["change", "select-range", "set-option"],
    setup(__props, { emit }) {
      const props = __props;
      const ns = useNamespace("time");
      const { getHoursList, getMinutesList, getSecondsList } = getTimeLists(props.disabledHours, props.disabledMinutes, props.disabledSeconds);
      let isScrolling = false;
      const currentScrollbar = vue.ref();
      const listHoursRef = vue.ref();
      const listMinutesRef = vue.ref();
      const listSecondsRef = vue.ref();
      const listRefsMap = {
        hours: listHoursRef,
        minutes: listMinutesRef,
        seconds: listSecondsRef
      };
      const spinnerItems = vue.computed(() => {
        return props.showSeconds ? timeUnits$1 : timeUnits$1.slice(0, 2);
      });
      const timePartials = vue.computed(() => {
        const { spinnerDate } = props;
        const hours = spinnerDate.hour();
        const minutes = spinnerDate.minute();
        const seconds = spinnerDate.second();
        return { hours, minutes, seconds };
      });
      const timeList = vue.computed(() => {
        const { hours, minutes } = vue.unref(timePartials);
        return {
          hours: getHoursList(props.role),
          minutes: getMinutesList(hours, props.role),
          seconds: getSecondsList(hours, minutes, props.role)
        };
      });
      const arrowControlTimeList = vue.computed(() => {
        const { hours, minutes, seconds } = vue.unref(timePartials);
        return {
          hours: buildTimeList(hours, 23),
          minutes: buildTimeList(minutes, 59),
          seconds: buildTimeList(seconds, 59)
        };
      });
      const debouncedResetScroll = debounce((type) => {
        isScrolling = false;
        adjustCurrentSpinner(type);
      }, 200);
      const getAmPmFlag = (hour) => {
        const shouldShowAmPm = !!props.amPmMode;
        if (!shouldShowAmPm)
          return "";
        const isCapital = props.amPmMode === "A";
        let content = hour < 12 ? " am" : " pm";
        if (isCapital)
          content = content.toUpperCase();
        return content;
      };
      const emitSelectRange = (type) => {
        let range;
        switch (type) {
          case "hours":
            range = [0, 2];
            break;
          case "minutes":
            range = [3, 5];
            break;
          case "seconds":
            range = [6, 8];
            break;
        }
        const [left, right] = range;
        emit("select-range", left, right);
        currentScrollbar.value = type;
      };
      const adjustCurrentSpinner = (type) => {
        adjustSpinner(type, vue.unref(timePartials)[type]);
      };
      const adjustSpinners = () => {
        adjustCurrentSpinner("hours");
        adjustCurrentSpinner("minutes");
        adjustCurrentSpinner("seconds");
      };
      const getScrollbarElement = (el) => el.querySelector(`.${ns.namespace.value}-scrollbar__wrap`);
      const adjustSpinner = (type, value) => {
        if (props.arrowControl)
          return;
        const scrollbar = vue.unref(listRefsMap[type]);
        if (scrollbar && scrollbar.$el) {
          getScrollbarElement(scrollbar.$el).scrollTop = Math.max(0, value * typeItemHeight(type));
        }
      };
      const typeItemHeight = (type) => {
        const scrollbar = vue.unref(listRefsMap[type]);
        const listItem = scrollbar == null ? void 0 : scrollbar.$el.querySelector("li");
        if (listItem) {
          return Number.parseFloat(getStyle(listItem, "height")) || 0;
        }
        return 0;
      };
      const onIncrement = () => {
        scrollDown(1);
      };
      const onDecrement = () => {
        scrollDown(-1);
      };
      const scrollDown = (step) => {
        if (!currentScrollbar.value) {
          emitSelectRange("hours");
        }
        const label = currentScrollbar.value;
        const now = vue.unref(timePartials)[label];
        const total = currentScrollbar.value === "hours" ? 24 : 60;
        const next = findNextUnDisabled(label, now, step, total);
        modifyDateField(label, next);
        adjustSpinner(label, next);
        vue.nextTick(() => emitSelectRange(label));
      };
      const findNextUnDisabled = (type, now, step, total) => {
        let next = (now + step + total) % total;
        const list = vue.unref(timeList)[type];
        while (list[next] && next !== now) {
          next = (next + step + total) % total;
        }
        return next;
      };
      const modifyDateField = (type, value) => {
        const list = vue.unref(timeList)[type];
        const isDisabled = list[value];
        if (isDisabled)
          return;
        const { hours, minutes, seconds } = vue.unref(timePartials);
        let changeTo;
        switch (type) {
          case "hours":
            changeTo = props.spinnerDate.hour(value).minute(minutes).second(seconds);
            break;
          case "minutes":
            changeTo = props.spinnerDate.hour(hours).minute(value).second(seconds);
            break;
          case "seconds":
            changeTo = props.spinnerDate.hour(hours).minute(minutes).second(value);
            break;
        }
        emit("change", changeTo);
      };
      const handleClick = (type, { value, disabled }) => {
        if (!disabled) {
          modifyDateField(type, value);
          emitSelectRange(type);
          adjustSpinner(type, value);
        }
      };
      const handleScroll = (type) => {
        isScrolling = true;
        debouncedResetScroll(type);
        const value = Math.min(Math.round((getScrollbarElement(vue.unref(listRefsMap[type]).$el).scrollTop - (scrollBarHeight(type) * 0.5 - 10) / typeItemHeight(type) + 3) / typeItemHeight(type)), type === "hours" ? 23 : 59);
        modifyDateField(type, value);
      };
      const scrollBarHeight = (type) => {
        return vue.unref(listRefsMap[type]).$el.offsetHeight;
      };
      const bindScrollEvent = () => {
        const bindFunction = (type) => {
          const scrollbar = vue.unref(listRefsMap[type]);
          if (scrollbar && scrollbar.$el) {
            getScrollbarElement(scrollbar.$el).onscroll = () => {
              handleScroll(type);
            };
          }
        };
        bindFunction("hours");
        bindFunction("minutes");
        bindFunction("seconds");
      };
      vue.onMounted(() => {
        vue.nextTick(() => {
          !props.arrowControl && bindScrollEvent();
          adjustSpinners();
          if (props.role === "start")
            emitSelectRange("hours");
        });
      });
      const setRef = (scrollbar, type) => {
        listRefsMap[type].value = scrollbar;
      };
      emit("set-option", [`${props.role}_scrollDown`, scrollDown]);
      emit("set-option", [`${props.role}_emitSelectRange`, emitSelectRange]);
      vue.watch(() => props.spinnerDate, () => {
        if (isScrolling)
          return;
        adjustSpinners();
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass([vue.unref(ns).b("spinner"), { "has-seconds": _ctx.showSeconds }])
        }, [
          !_ctx.arrowControl ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(vue.unref(spinnerItems), (item) => {
            return vue.openBlock(), vue.createBlock(vue.unref(ElScrollbar), {
              key: item,
              ref_for: true,
              ref: (scrollbar) => setRef(scrollbar, item),
              class: vue.normalizeClass(vue.unref(ns).be("spinner", "wrapper")),
              "wrap-style": "max-height: inherit;",
              "view-class": vue.unref(ns).be("spinner", "list"),
              noresize: "",
              tag: "ul",
              onMouseenter: ($event) => emitSelectRange(item),
              onMousemove: ($event) => adjustCurrentSpinner(item)
            }, {
              default: vue.withCtx(() => [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(timeList)[item], (disabled, key) => {
                  return vue.openBlock(), vue.createElementBlock("li", {
                    key,
                    class: vue.normalizeClass([
                      vue.unref(ns).be("spinner", "item"),
                      vue.unref(ns).is("active", key === vue.unref(timePartials)[item]),
                      vue.unref(ns).is("disabled", disabled)
                    ]),
                    onClick: ($event) => handleClick(item, { value: key, disabled })
                  }, [
                    item === "hours" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                      vue.createTextVNode(vue.toDisplayString(("0" + (_ctx.amPmMode ? key % 12 || 12 : key)).slice(-2)) + vue.toDisplayString(getAmPmFlag(key)), 1)
                    ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                      vue.createTextVNode(vue.toDisplayString(("0" + key).slice(-2)), 1)
                    ], 64))
                  ], 10, _hoisted_1$Y);
                }), 128))
              ]),
              _: 2
            }, 1032, ["class", "view-class", "onMouseenter", "onMousemove"]);
          }), 128)) : vue.createCommentVNode("v-if", true),
          _ctx.arrowControl ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 1 }, vue.renderList(vue.unref(spinnerItems), (item) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              key: item,
              class: vue.normalizeClass([vue.unref(ns).be("spinner", "wrapper"), vue.unref(ns).is("arrow")]),
              onMouseenter: ($event) => emitSelectRange(item)
            }, [
              vue.withDirectives((vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                class: vue.normalizeClass(["arrow-up", vue.unref(ns).be("spinner", "arrow")])
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(arrow_up_default))
                ]),
                _: 1
              }, 8, ["class"])), [
                [vue.unref(vRepeatClick), onDecrement]
              ]),
              vue.withDirectives((vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                class: vue.normalizeClass(["arrow-down", vue.unref(ns).be("spinner", "arrow")])
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(arrow_down_default))
                ]),
                _: 1
              }, 8, ["class"])), [
                [vue.unref(vRepeatClick), onIncrement]
              ]),
              vue.createElementVNode("ul", {
                class: vue.normalizeClass(vue.unref(ns).be("spinner", "list"))
              }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(arrowControlTimeList)[item], (time, key) => {
                  return vue.openBlock(), vue.createElementBlock("li", {
                    key,
                    class: vue.normalizeClass([
                      vue.unref(ns).be("spinner", "item"),
                      vue.unref(ns).is("active", time === vue.unref(timePartials)[item]),
                      vue.unref(ns).is("disabled", vue.unref(timeList)[item][time])
                    ])
                  }, [
                    typeof time === "number" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                      item === "hours" ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                        vue.createTextVNode(vue.toDisplayString(("0" + (_ctx.amPmMode ? time % 12 || 12 : time)).slice(-2)) + vue.toDisplayString(getAmPmFlag(time)), 1)
                      ], 64)) : (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 1 }, [
                        vue.createTextVNode(vue.toDisplayString(("0" + time).slice(-2)), 1)
                      ], 64))
                    ], 64)) : vue.createCommentVNode("v-if", true)
                  ], 2);
                }), 128))
              ], 2)
            ], 42, _hoisted_2$D);
          }), 128)) : vue.createCommentVNode("v-if", true)
        ], 2);
      };
    }
  });
  var TimeSpinner = /* @__PURE__ */ _export_sfc(_sfc_main$1V, [["__file", "basic-time-spinner.vue"]]);

  const _sfc_main$1U = /* @__PURE__ */ vue.defineComponent({
    __name: "panel-time-pick",
    props: panelTimePickerProps,
    emits: ["pick", "select-range", "set-picker-option"],
    setup(__props, { emit }) {
      const props = __props;
      const pickerBase = vue.inject("EP_PICKER_BASE");
      const {
        arrowControl,
        disabledHours,
        disabledMinutes,
        disabledSeconds,
        defaultValue
      } = pickerBase.props;
      const { getAvailableHours, getAvailableMinutes, getAvailableSeconds } = buildAvailableTimeSlotGetter(disabledHours, disabledMinutes, disabledSeconds);
      const ns = useNamespace("time");
      const { t, lang } = useLocale();
      const selectionRange = vue.ref([0, 2]);
      const oldValue = useOldValue(props);
      const transitionName = vue.computed(() => {
        return isUndefined(props.actualVisible) ? `${ns.namespace.value}-zoom-in-top` : "";
      });
      const showSeconds = vue.computed(() => {
        return props.format.includes("ss");
      });
      const amPmMode = vue.computed(() => {
        if (props.format.includes("A"))
          return "A";
        if (props.format.includes("a"))
          return "a";
        return "";
      });
      const isValidValue = (_date) => {
        const parsedDate = dayjs(_date).locale(lang.value);
        const result = getRangeAvailableTime(parsedDate);
        return parsedDate.isSame(result);
      };
      const handleCancel = () => {
        emit("pick", oldValue.value, false);
      };
      const handleConfirm = (visible = false, first = false) => {
        if (first)
          return;
        emit("pick", props.parsedValue, visible);
      };
      const handleChange = (_date) => {
        if (!props.visible) {
          return;
        }
        const result = getRangeAvailableTime(_date).millisecond(0);
        emit("pick", result, true);
      };
      const setSelectionRange = (start, end) => {
        emit("select-range", start, end);
        selectionRange.value = [start, end];
      };
      const changeSelectionRange = (step) => {
        const list = [0, 3].concat(showSeconds.value ? [6] : []);
        const mapping = ["hours", "minutes"].concat(showSeconds.value ? ["seconds"] : []);
        const index = list.indexOf(selectionRange.value[0]);
        const next = (index + step + list.length) % list.length;
        timePickerOptions["start_emitSelectRange"](mapping[next]);
      };
      const handleKeydown = (event) => {
        const code = event.code;
        const { left, right, up, down } = EVENT_CODE;
        if ([left, right].includes(code)) {
          const step = code === left ? -1 : 1;
          changeSelectionRange(step);
          event.preventDefault();
          return;
        }
        if ([up, down].includes(code)) {
          const step = code === up ? -1 : 1;
          timePickerOptions["start_scrollDown"](step);
          event.preventDefault();
          return;
        }
      };
      const { timePickerOptions, onSetOption, getAvailableTime } = useTimePanel({
        getAvailableHours,
        getAvailableMinutes,
        getAvailableSeconds
      });
      const getRangeAvailableTime = (date) => {
        return getAvailableTime(date, props.datetimeRole || "", true);
      };
      const parseUserInput = (value) => {
        if (!value)
          return null;
        return dayjs(value, props.format).locale(lang.value);
      };
      const formatToString = (value) => {
        if (!value)
          return null;
        return value.format(props.format);
      };
      const getDefaultValue = () => {
        return dayjs(defaultValue).locale(lang.value);
      };
      emit("set-picker-option", ["isValidValue", isValidValue]);
      emit("set-picker-option", ["formatToString", formatToString]);
      emit("set-picker-option", ["parseUserInput", parseUserInput]);
      emit("set-picker-option", ["handleKeydownInput", handleKeydown]);
      emit("set-picker-option", ["getRangeAvailableTime", getRangeAvailableTime]);
      emit("set-picker-option", ["getDefaultValue", getDefaultValue]);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, { name: vue.unref(transitionName) }, {
          default: vue.withCtx(() => [
            _ctx.actualVisible || _ctx.visible ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              class: vue.normalizeClass(vue.unref(ns).b("panel"))
            }, [
              vue.createElementVNode("div", {
                class: vue.normalizeClass([vue.unref(ns).be("panel", "content"), { "has-seconds": vue.unref(showSeconds) }])
              }, [
                vue.createVNode(TimeSpinner, {
                  ref: "spinner",
                  role: _ctx.datetimeRole || "start",
                  "arrow-control": vue.unref(arrowControl),
                  "show-seconds": vue.unref(showSeconds),
                  "am-pm-mode": vue.unref(amPmMode),
                  "spinner-date": _ctx.parsedValue,
                  "disabled-hours": vue.unref(disabledHours),
                  "disabled-minutes": vue.unref(disabledMinutes),
                  "disabled-seconds": vue.unref(disabledSeconds),
                  onChange: handleChange,
                  onSetOption: vue.unref(onSetOption),
                  onSelectRange: setSelectionRange
                }, null, 8, ["role", "arrow-control", "show-seconds", "am-pm-mode", "spinner-date", "disabled-hours", "disabled-minutes", "disabled-seconds", "onSetOption"])
              ], 2),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(vue.unref(ns).be("panel", "footer"))
              }, [
                vue.createElementVNode("button", {
                  type: "button",
                  class: vue.normalizeClass([vue.unref(ns).be("panel", "btn"), "cancel"]),
                  onClick: handleCancel
                }, vue.toDisplayString(vue.unref(t)("el.datepicker.cancel")), 3),
                vue.createElementVNode("button", {
                  type: "button",
                  class: vue.normalizeClass([vue.unref(ns).be("panel", "btn"), "confirm"]),
                  onClick: _cache[0] || (_cache[0] = ($event) => handleConfirm())
                }, vue.toDisplayString(vue.unref(t)("el.datepicker.confirm")), 3)
              ], 2)
            ], 2)) : vue.createCommentVNode("v-if", true)
          ]),
          _: 1
        }, 8, ["name"]);
      };
    }
  });
  var TimePickPanel = /* @__PURE__ */ _export_sfc(_sfc_main$1U, [["__file", "panel-time-pick.vue"]]);

  const panelTimeRangeProps = buildProps({
    ...timePanelSharedProps,
    parsedValue: {
      type: definePropType(Array)
    }
  });

  const _hoisted_1$X = ["disabled"];
  const _sfc_main$1T = /* @__PURE__ */ vue.defineComponent({
    __name: "panel-time-range",
    props: panelTimeRangeProps,
    emits: ["pick", "select-range", "set-picker-option"],
    setup(__props, { emit }) {
      const props = __props;
      const makeSelectRange = (start, end) => {
        const result = [];
        for (let i = start; i <= end; i++) {
          result.push(i);
        }
        return result;
      };
      const { t, lang } = useLocale();
      const nsTime = useNamespace("time");
      const nsPicker = useNamespace("picker");
      const pickerBase = vue.inject("EP_PICKER_BASE");
      const {
        arrowControl,
        disabledHours,
        disabledMinutes,
        disabledSeconds,
        defaultValue
      } = pickerBase.props;
      const startContainerKls = vue.computed(() => [
        nsTime.be("range-picker", "body"),
        nsTime.be("panel", "content"),
        nsTime.is("arrow", arrowControl),
        showSeconds.value ? "has-seconds" : ""
      ]);
      const endContainerKls = vue.computed(() => [
        nsTime.be("range-picker", "body"),
        nsTime.be("panel", "content"),
        nsTime.is("arrow", arrowControl),
        showSeconds.value ? "has-seconds" : ""
      ]);
      const startTime = vue.computed(() => props.parsedValue[0]);
      const endTime = vue.computed(() => props.parsedValue[1]);
      const oldValue = useOldValue(props);
      const handleCancel = () => {
        emit("pick", oldValue.value, false);
      };
      const showSeconds = vue.computed(() => {
        return props.format.includes("ss");
      });
      const amPmMode = vue.computed(() => {
        if (props.format.includes("A"))
          return "A";
        if (props.format.includes("a"))
          return "a";
        return "";
      });
      const handleConfirm = (visible = false) => {
        emit("pick", [startTime.value, endTime.value], visible);
      };
      const handleMinChange = (date) => {
        handleChange(date.millisecond(0), endTime.value);
      };
      const handleMaxChange = (date) => {
        handleChange(startTime.value, date.millisecond(0));
      };
      const isValidValue = (_date) => {
        const parsedDate = _date.map((_) => dayjs(_).locale(lang.value));
        const result = getRangeAvailableTime(parsedDate);
        return parsedDate[0].isSame(result[0]) && parsedDate[1].isSame(result[1]);
      };
      const handleChange = (start, end) => {
        emit("pick", [start, end], true);
      };
      const btnConfirmDisabled = vue.computed(() => {
        return startTime.value > endTime.value;
      });
      const selectionRange = vue.ref([0, 2]);
      const setMinSelectionRange = (start, end) => {
        emit("select-range", start, end, "min");
        selectionRange.value = [start, end];
      };
      const offset = vue.computed(() => showSeconds.value ? 11 : 8);
      const setMaxSelectionRange = (start, end) => {
        emit("select-range", start, end, "max");
        const _offset = vue.unref(offset);
        selectionRange.value = [start + _offset, end + _offset];
      };
      const changeSelectionRange = (step) => {
        const list = showSeconds.value ? [0, 3, 6, 11, 14, 17] : [0, 3, 8, 11];
        const mapping = ["hours", "minutes"].concat(showSeconds.value ? ["seconds"] : []);
        const index = list.indexOf(selectionRange.value[0]);
        const next = (index + step + list.length) % list.length;
        const half = list.length / 2;
        if (next < half) {
          timePickerOptions["start_emitSelectRange"](mapping[next]);
        } else {
          timePickerOptions["end_emitSelectRange"](mapping[next - half]);
        }
      };
      const handleKeydown = (event) => {
        const code = event.code;
        const { left, right, up, down } = EVENT_CODE;
        if ([left, right].includes(code)) {
          const step = code === left ? -1 : 1;
          changeSelectionRange(step);
          event.preventDefault();
          return;
        }
        if ([up, down].includes(code)) {
          const step = code === up ? -1 : 1;
          const role = selectionRange.value[0] < offset.value ? "start" : "end";
          timePickerOptions[`${role}_scrollDown`](step);
          event.preventDefault();
          return;
        }
      };
      const disabledHours_ = (role, compare) => {
        const defaultDisable = disabledHours ? disabledHours(role) : [];
        const isStart = role === "start";
        const compareDate = compare || (isStart ? endTime.value : startTime.value);
        const compareHour = compareDate.hour();
        const nextDisable = isStart ? makeSelectRange(compareHour + 1, 23) : makeSelectRange(0, compareHour - 1);
        return union(defaultDisable, nextDisable);
      };
      const disabledMinutes_ = (hour, role, compare) => {
        const defaultDisable = disabledMinutes ? disabledMinutes(hour, role) : [];
        const isStart = role === "start";
        const compareDate = compare || (isStart ? endTime.value : startTime.value);
        const compareHour = compareDate.hour();
        if (hour !== compareHour) {
          return defaultDisable;
        }
        const compareMinute = compareDate.minute();
        const nextDisable = isStart ? makeSelectRange(compareMinute + 1, 59) : makeSelectRange(0, compareMinute - 1);
        return union(defaultDisable, nextDisable);
      };
      const disabledSeconds_ = (hour, minute, role, compare) => {
        const defaultDisable = disabledSeconds ? disabledSeconds(hour, minute, role) : [];
        const isStart = role === "start";
        const compareDate = compare || (isStart ? endTime.value : startTime.value);
        const compareHour = compareDate.hour();
        const compareMinute = compareDate.minute();
        if (hour !== compareHour || minute !== compareMinute) {
          return defaultDisable;
        }
        const compareSecond = compareDate.second();
        const nextDisable = isStart ? makeSelectRange(compareSecond + 1, 59) : makeSelectRange(0, compareSecond - 1);
        return union(defaultDisable, nextDisable);
      };
      const getRangeAvailableTime = ([start, end]) => {
        return [
          getAvailableTime(start, "start", true, end),
          getAvailableTime(end, "end", false, start)
        ];
      };
      const { getAvailableHours, getAvailableMinutes, getAvailableSeconds } = buildAvailableTimeSlotGetter(disabledHours_, disabledMinutes_, disabledSeconds_);
      const {
        timePickerOptions,
        getAvailableTime,
        onSetOption
      } = useTimePanel({
        getAvailableHours,
        getAvailableMinutes,
        getAvailableSeconds
      });
      const parseUserInput = (days) => {
        if (!days)
          return null;
        if (isArray$1(days)) {
          return days.map((d) => dayjs(d, props.format).locale(lang.value));
        }
        return dayjs(days, props.format).locale(lang.value);
      };
      const formatToString = (days) => {
        if (!days)
          return null;
        if (isArray$1(days)) {
          return days.map((d) => d.format(props.format));
        }
        return days.format(props.format);
      };
      const getDefaultValue = () => {
        if (isArray$1(defaultValue)) {
          return defaultValue.map((d) => dayjs(d).locale(lang.value));
        }
        const defaultDay = dayjs(defaultValue).locale(lang.value);
        return [defaultDay, defaultDay.add(60, "m")];
      };
      emit("set-picker-option", ["formatToString", formatToString]);
      emit("set-picker-option", ["parseUserInput", parseUserInput]);
      emit("set-picker-option", ["isValidValue", isValidValue]);
      emit("set-picker-option", ["handleKeydownInput", handleKeydown]);
      emit("set-picker-option", ["getDefaultValue", getDefaultValue]);
      emit("set-picker-option", ["getRangeAvailableTime", getRangeAvailableTime]);
      return (_ctx, _cache) => {
        return _ctx.actualVisible ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass([vue.unref(nsTime).b("range-picker"), vue.unref(nsPicker).b("panel")])
        }, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(vue.unref(nsTime).be("range-picker", "content"))
          }, [
            vue.createElementVNode("div", {
              class: vue.normalizeClass(vue.unref(nsTime).be("range-picker", "cell"))
            }, [
              vue.createElementVNode("div", {
                class: vue.normalizeClass(vue.unref(nsTime).be("range-picker", "header"))
              }, vue.toDisplayString(vue.unref(t)("el.datepicker.startTime")), 3),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(vue.unref(startContainerKls))
              }, [
                vue.createVNode(TimeSpinner, {
                  ref: "minSpinner",
                  role: "start",
                  "show-seconds": vue.unref(showSeconds),
                  "am-pm-mode": vue.unref(amPmMode),
                  "arrow-control": vue.unref(arrowControl),
                  "spinner-date": vue.unref(startTime),
                  "disabled-hours": disabledHours_,
                  "disabled-minutes": disabledMinutes_,
                  "disabled-seconds": disabledSeconds_,
                  onChange: handleMinChange,
                  onSetOption: vue.unref(onSetOption),
                  onSelectRange: setMinSelectionRange
                }, null, 8, ["show-seconds", "am-pm-mode", "arrow-control", "spinner-date", "onSetOption"])
              ], 2)
            ], 2),
            vue.createElementVNode("div", {
              class: vue.normalizeClass(vue.unref(nsTime).be("range-picker", "cell"))
            }, [
              vue.createElementVNode("div", {
                class: vue.normalizeClass(vue.unref(nsTime).be("range-picker", "header"))
              }, vue.toDisplayString(vue.unref(t)("el.datepicker.endTime")), 3),
              vue.createElementVNode("div", {
                class: vue.normalizeClass(vue.unref(endContainerKls))
              }, [
                vue.createVNode(TimeSpinner, {
                  ref: "maxSpinner",
                  role: "end",
                  "show-seconds": vue.unref(showSeconds),
                  "am-pm-mode": vue.unref(amPmMode),
                  "arrow-control": vue.unref(arrowControl),
                  "spinner-date": vue.unref(endTime),
                  "disabled-hours": disabledHours_,
                  "disabled-minutes": disabledMinutes_,
                  "disabled-seconds": disabledSeconds_,
                  onChange: handleMaxChange,
                  onSetOption: vue.unref(onSetOption),
                  onSelectRange: setMaxSelectionRange
                }, null, 8, ["show-seconds", "am-pm-mode", "arrow-control", "spinner-date", "onSetOption"])
              ], 2)
            ], 2)
          ], 2),
          vue.createElementVNode("div", {
            class: vue.normalizeClass(vue.unref(nsTime).be("panel", "footer"))
          }, [
            vue.createElementVNode("button", {
              type: "button",
              class: vue.normalizeClass([vue.unref(nsTime).be("panel", "btn"), "cancel"]),
              onClick: _cache[0] || (_cache[0] = ($event) => handleCancel())
            }, vue.toDisplayString(vue.unref(t)("el.datepicker.cancel")), 3),
            vue.createElementVNode("button", {
              type: "button",
              class: vue.normalizeClass([vue.unref(nsTime).be("panel", "btn"), "confirm"]),
              disabled: vue.unref(btnConfirmDisabled),
              onClick: _cache[1] || (_cache[1] = ($event) => handleConfirm())
            }, vue.toDisplayString(vue.unref(t)("el.datepicker.confirm")), 11, _hoisted_1$X)
          ], 2)
        ], 2)) : vue.createCommentVNode("v-if", true);
      };
    }
  });
  var TimeRangePanel = /* @__PURE__ */ _export_sfc(_sfc_main$1T, [["__file", "panel-time-range.vue"]]);

  dayjs.extend(customParseFormat);
  var TimePicker = vue.defineComponent({
    name: "ElTimePicker",
    install: null,
    props: {
      ...timePickerDefaultProps,
      isRange: {
        type: Boolean,
        default: false
      }
    },
    emits: ["update:modelValue"],
    setup(props, ctx) {
      const commonPicker = vue.ref();
      const [type, Panel] = props.isRange ? ["timerange", TimeRangePanel] : ["time", TimePickPanel];
      const modelUpdater = (value) => ctx.emit("update:modelValue", value);
      vue.provide("ElPopperOptions", props.popperOptions);
      ctx.expose({
        focus: (e) => {
          var _a;
          (_a = commonPicker.value) == null ? void 0 : _a.handleFocusInput(e);
        },
        blur: (e) => {
          var _a;
          (_a = commonPicker.value) == null ? void 0 : _a.handleBlurInput(e);
        },
        handleOpen: () => {
          var _a;
          (_a = commonPicker.value) == null ? void 0 : _a.handleOpen();
        },
        handleClose: () => {
          var _a;
          (_a = commonPicker.value) == null ? void 0 : _a.handleClose();
        }
      });
      return () => {
        var _a;
        const format = (_a = props.format) != null ? _a : DEFAULT_FORMATS_TIME;
        return vue.createVNode(CommonPicker, vue.mergeProps(props, {
          "ref": commonPicker,
          "type": type,
          "format": format,
          "onUpdate:modelValue": modelUpdater
        }), {
          default: (props2) => vue.createVNode(Panel, props2, null)
        });
      };
    }
  });

  const _TimePicker = TimePicker;
  _TimePicker.install = (app) => {
    app.component(_TimePicker.name, _TimePicker);
  };
  const ElTimePicker = _TimePicker;

  const getPrevMonthLastDays = (date, count) => {
    const lastDay = date.subtract(1, "month").endOf("month").date();
    return rangeArr(count).map((_, index) => lastDay - (count - index - 1));
  };
  const getMonthDays = (date) => {
    const days = date.daysInMonth();
    return rangeArr(days).map((_, index) => index + 1);
  };
  const toNestedArr = (days) => rangeArr(days.length / 7).map((index) => {
    const start = index * 7;
    return days.slice(start, start + 7);
  });
  const dateTableProps = buildProps({
    selectedDay: {
      type: definePropType(Object)
    },
    range: {
      type: definePropType(Array)
    },
    date: {
      type: definePropType(Object),
      required: true
    },
    hideHeader: {
      type: Boolean
    }
  });
  const dateTableEmits = {
    pick: (value) => isObject$1(value)
  };

  var localeData$1 = {exports: {}};

  (function(module, exports) {
    !function(n, e) {
      module.exports = e() ;
    }(commonjsGlobal, function() {
      return function(n, e, t) {
        var r = e.prototype, o = function(n2) {
          return n2 && (n2.indexOf ? n2 : n2.s);
        }, u = function(n2, e2, t2, r2, u2) {
          var i2 = n2.name ? n2 : n2.$locale(), a2 = o(i2[e2]), s2 = o(i2[t2]), f = a2 || s2.map(function(n3) {
            return n3.slice(0, r2);
          });
          if (!u2)
            return f;
          var d = i2.weekStart;
          return f.map(function(n3, e3) {
            return f[(e3 + (d || 0)) % 7];
          });
        }, i = function() {
          return t.Ls[t.locale()];
        }, a = function(n2, e2) {
          return n2.formats[e2] || function(n3) {
            return n3.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(n4, e3, t2) {
              return e3 || t2.slice(1);
            });
          }(n2.formats[e2.toUpperCase()]);
        }, s = function() {
          var n2 = this;
          return { months: function(e2) {
            return e2 ? e2.format("MMMM") : u(n2, "months");
          }, monthsShort: function(e2) {
            return e2 ? e2.format("MMM") : u(n2, "monthsShort", "months", 3);
          }, firstDayOfWeek: function() {
            return n2.$locale().weekStart || 0;
          }, weekdays: function(e2) {
            return e2 ? e2.format("dddd") : u(n2, "weekdays");
          }, weekdaysMin: function(e2) {
            return e2 ? e2.format("dd") : u(n2, "weekdaysMin", "weekdays", 2);
          }, weekdaysShort: function(e2) {
            return e2 ? e2.format("ddd") : u(n2, "weekdaysShort", "weekdays", 3);
          }, longDateFormat: function(e2) {
            return a(n2.$locale(), e2);
          }, meridiem: this.$locale().meridiem, ordinal: this.$locale().ordinal };
        };
        r.localeData = function() {
          return s.bind(this)();
        }, t.localeData = function() {
          var n2 = i();
          return { firstDayOfWeek: function() {
            return n2.weekStart || 0;
          }, weekdays: function() {
            return t.weekdays();
          }, weekdaysShort: function() {
            return t.weekdaysShort();
          }, weekdaysMin: function() {
            return t.weekdaysMin();
          }, months: function() {
            return t.months();
          }, monthsShort: function() {
            return t.monthsShort();
          }, longDateFormat: function(e2) {
            return a(n2, e2);
          }, meridiem: n2.meridiem, ordinal: n2.ordinal };
        }, t.months = function() {
          return u(i(), "months");
        }, t.monthsShort = function() {
          return u(i(), "monthsShort", "months", 3);
        }, t.weekdays = function(n2) {
          return u(i(), "weekdays", null, null, n2);
        }, t.weekdaysShort = function(n2) {
          return u(i(), "weekdaysShort", "weekdays", 3, n2);
        }, t.weekdaysMin = function(n2) {
          return u(i(), "weekdaysMin", "weekdays", 2, n2);
        };
      };
    });
  })(localeData$1);
  var localeData = localeData$1.exports;

  const useDateTable = (props, emit) => {
    dayjs.extend(localeData);
    const firstDayOfWeek = dayjs.localeData().firstDayOfWeek();
    const { t, lang } = useLocale();
    const now = dayjs().locale(lang.value);
    const isInRange = vue.computed(() => !!props.range && !!props.range.length);
    const rows = vue.computed(() => {
      let days = [];
      if (isInRange.value) {
        const [start, end] = props.range;
        const currentMonthRange = rangeArr(end.date() - start.date() + 1).map((index) => ({
          text: start.date() + index,
          type: "current"
        }));
        let remaining = currentMonthRange.length % 7;
        remaining = remaining === 0 ? 0 : 7 - remaining;
        const nextMonthRange = rangeArr(remaining).map((_, index) => ({
          text: index + 1,
          type: "next"
        }));
        days = currentMonthRange.concat(nextMonthRange);
      } else {
        const firstDay = props.date.startOf("month").day();
        const prevMonthDays = getPrevMonthLastDays(props.date, (firstDay - firstDayOfWeek + 7) % 7).map((day) => ({
          text: day,
          type: "prev"
        }));
        const currentMonthDays = getMonthDays(props.date).map((day) => ({
          text: day,
          type: "current"
        }));
        days = [...prevMonthDays, ...currentMonthDays];
        const remaining = 7 - (days.length % 7 || 7);
        const nextMonthDays = rangeArr(remaining).map((_, index) => ({
          text: index + 1,
          type: "next"
        }));
        days = days.concat(nextMonthDays);
      }
      return toNestedArr(days);
    });
    const weekDays = vue.computed(() => {
      const start = firstDayOfWeek;
      if (start === 0) {
        return WEEK_DAYS.map((_) => t(`el.datepicker.weeks.${_}`));
      } else {
        return WEEK_DAYS.slice(start).concat(WEEK_DAYS.slice(0, start)).map((_) => t(`el.datepicker.weeks.${_}`));
      }
    });
    const getFormattedDate = (day, type) => {
      switch (type) {
        case "prev":
          return props.date.startOf("month").subtract(1, "month").date(day);
        case "next":
          return props.date.startOf("month").add(1, "month").date(day);
        case "current":
          return props.date.date(day);
      }
    };
    const handlePickDay = ({ text, type }) => {
      const date = getFormattedDate(text, type);
      emit("pick", date);
    };
    const getSlotData = ({ text, type }) => {
      const day = getFormattedDate(text, type);
      return {
        isSelected: day.isSame(props.selectedDay),
        type: `${type}-month`,
        day: day.format("YYYY-MM-DD"),
        date: day.toDate()
      };
    };
    return {
      now,
      isInRange,
      rows,
      weekDays,
      getFormattedDate,
      handlePickDay,
      getSlotData
    };
  };

  const _hoisted_1$W = { key: 0 };
  const _hoisted_2$C = ["onClick"];
  const __default__$1g = vue.defineComponent({
    name: "DateTable"
  });
  const _sfc_main$1S = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1g,
    props: dateTableProps,
    emits: dateTableEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const {
        isInRange,
        now,
        rows,
        weekDays,
        getFormattedDate,
        handlePickDay,
        getSlotData
      } = useDateTable(props, emit);
      const nsTable = useNamespace("calendar-table");
      const nsDay = useNamespace("calendar-day");
      const getCellClass = ({ text, type }) => {
        const classes = [type];
        if (type === "current") {
          const date = getFormattedDate(text, type);
          if (date.isSame(props.selectedDay, "day")) {
            classes.push(nsDay.is("selected"));
          }
          if (date.isSame(now, "day")) {
            classes.push(nsDay.is("today"));
          }
        }
        return classes;
      };
      expose({
        getFormattedDate
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("table", {
          class: vue.normalizeClass([vue.unref(nsTable).b(), vue.unref(nsTable).is("range", vue.unref(isInRange))]),
          cellspacing: "0",
          cellpadding: "0"
        }, [
          !_ctx.hideHeader ? (vue.openBlock(), vue.createElementBlock("thead", _hoisted_1$W, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(weekDays), (day) => {
              return vue.openBlock(), vue.createElementBlock("th", { key: day }, vue.toDisplayString(day), 1);
            }), 128))
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("tbody", null, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(rows), (row, index) => {
              return vue.openBlock(), vue.createElementBlock("tr", {
                key: index,
                class: vue.normalizeClass({
                  [vue.unref(nsTable).e("row")]: true,
                  [vue.unref(nsTable).em("row", "hide-border")]: index === 0 && _ctx.hideHeader
                })
              }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(row, (cell, key) => {
                  return vue.openBlock(), vue.createElementBlock("td", {
                    key,
                    class: vue.normalizeClass(getCellClass(cell)),
                    onClick: ($event) => vue.unref(handlePickDay)(cell)
                  }, [
                    vue.createElementVNode("div", {
                      class: vue.normalizeClass(vue.unref(nsDay).b())
                    }, [
                      vue.renderSlot(_ctx.$slots, "date-cell", {
                        data: vue.unref(getSlotData)(cell)
                      }, () => [
                        vue.createElementVNode("span", null, vue.toDisplayString(cell.text), 1)
                      ])
                    ], 2)
                  ], 10, _hoisted_2$C);
                }), 128))
              ], 2);
            }), 128))
          ])
        ], 2);
      };
    }
  });
  var DateTable$1 = /* @__PURE__ */ _export_sfc(_sfc_main$1S, [["__file", "date-table.vue"]]);

  const adjacentMonth = (start, end) => {
    const firstMonthLastDay = start.endOf("month");
    const lastMonthFirstDay = end.startOf("month");
    const isSameWeek = firstMonthLastDay.isSame(lastMonthFirstDay, "week");
    const lastMonthStartDay = isSameWeek ? lastMonthFirstDay.add(1, "week") : lastMonthFirstDay;
    return [
      [start, firstMonthLastDay],
      [lastMonthStartDay.startOf("week"), end]
    ];
  };
  const threeConsecutiveMonth = (start, end) => {
    const firstMonthLastDay = start.endOf("month");
    const secondMonthFirstDay = start.add(1, "month").startOf("month");
    const secondMonthStartDay = firstMonthLastDay.isSame(secondMonthFirstDay, "week") ? secondMonthFirstDay.add(1, "week") : secondMonthFirstDay;
    const secondMonthLastDay = secondMonthStartDay.endOf("month");
    const lastMonthFirstDay = end.startOf("month");
    const lastMonthStartDay = secondMonthLastDay.isSame(lastMonthFirstDay, "week") ? lastMonthFirstDay.add(1, "week") : lastMonthFirstDay;
    return [
      [start, firstMonthLastDay],
      [secondMonthStartDay.startOf("week"), secondMonthLastDay],
      [lastMonthStartDay.startOf("week"), end]
    ];
  };
  const useCalendar = (props, emit, componentName) => {
    const slots = vue.useSlots();
    const { lang } = useLocale();
    const selectedDay = vue.ref();
    const now = dayjs().locale(lang.value);
    const realSelectedDay = vue.computed({
      get() {
        if (!props.modelValue)
          return selectedDay.value;
        return date.value;
      },
      set(val) {
        if (!val)
          return;
        selectedDay.value = val;
        const result = val.toDate();
        emit(INPUT_EVENT, result);
        emit(UPDATE_MODEL_EVENT, result);
      }
    });
    const validatedRange = vue.computed(() => {
      if (!props.range)
        return [];
      const rangeArrDayjs = props.range.map((_) => dayjs(_).locale(lang.value));
      const [startDayjs, endDayjs] = rangeArrDayjs;
      if (startDayjs.isAfter(endDayjs)) {
        return [];
      }
      if (startDayjs.isSame(endDayjs, "month")) {
        return calculateValidatedDateRange(startDayjs, endDayjs);
      } else {
        if (startDayjs.add(1, "month").month() !== endDayjs.month()) {
          return [];
        }
        return calculateValidatedDateRange(startDayjs, endDayjs);
      }
    });
    const date = vue.computed(() => {
      if (!props.modelValue) {
        return realSelectedDay.value || (validatedRange.value.length ? validatedRange.value[0][0] : now);
      } else {
        return dayjs(props.modelValue).locale(lang.value);
      }
    });
    const prevMonthDayjs = vue.computed(() => date.value.subtract(1, "month").date(1));
    const nextMonthDayjs = vue.computed(() => date.value.add(1, "month").date(1));
    const prevYearDayjs = vue.computed(() => date.value.subtract(1, "year").date(1));
    const nextYearDayjs = vue.computed(() => date.value.add(1, "year").date(1));
    const calculateValidatedDateRange = (startDayjs, endDayjs) => {
      const firstDay = startDayjs.startOf("week");
      const lastDay = endDayjs.endOf("week");
      const firstMonth = firstDay.get("month");
      const lastMonth = lastDay.get("month");
      if (firstMonth === lastMonth) {
        return [[firstDay, lastDay]];
      } else if ((firstMonth + 1) % 12 === lastMonth) {
        return adjacentMonth(firstDay, lastDay);
      } else if (firstMonth + 2 === lastMonth || (firstMonth + 1) % 11 === lastMonth) {
        return threeConsecutiveMonth(firstDay, lastDay);
      } else {
        return [];
      }
    };
    const pickDay = (day) => {
      realSelectedDay.value = day;
    };
    const selectDate = (type) => {
      const dateMap = {
        "prev-month": prevMonthDayjs.value,
        "next-month": nextMonthDayjs.value,
        "prev-year": prevYearDayjs.value,
        "next-year": nextYearDayjs.value,
        today: now
      };
      const day = dateMap[type];
      if (!day.isSame(date.value, "day")) {
        pickDay(day);
      }
    };
    useDeprecated({
      from: '"dateCell"',
      replacement: '"date-cell"',
      scope: "ElCalendar",
      version: "2.3.0",
      ref: "https://element-plus.org/en-US/component/calendar.html#slots",
      type: "Slot"
    }, vue.computed(() => !!slots.dateCell));
    return {
      calculateValidatedDateRange,
      date,
      realSelectedDay,
      pickDay,
      selectDate,
      validatedRange
    };
  };

  const isValidRange$1 = (range) => isArray$1(range) && range.length === 2 && range.every((item) => isDate$1(item));
  const calendarProps = buildProps({
    modelValue: {
      type: Date
    },
    range: {
      type: definePropType(Array),
      validator: isValidRange$1
    }
  });
  const calendarEmits = {
    [UPDATE_MODEL_EVENT]: (value) => isDate$1(value),
    [INPUT_EVENT]: (value) => isDate$1(value)
  };

  const COMPONENT_NAME$g = "ElCalendar";
  const __default__$1f = vue.defineComponent({
    name: COMPONENT_NAME$g
  });
  const _sfc_main$1R = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1f,
    props: calendarProps,
    emits: calendarEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const ns = useNamespace("calendar");
      const {
        calculateValidatedDateRange,
        date,
        pickDay,
        realSelectedDay,
        selectDate,
        validatedRange
      } = useCalendar(props, emit);
      const { t } = useLocale();
      const i18nDate = vue.computed(() => {
        const pickedMonth = `el.datepicker.month${date.value.format("M")}`;
        return `${date.value.year()} ${t("el.datepicker.year")} ${t(pickedMonth)}`;
      });
      expose({
        selectedDay: realSelectedDay,
        pickDay,
        selectDate,
        calculateValidatedDateRange
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(vue.unref(ns).b())
        }, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(vue.unref(ns).e("header"))
          }, [
            vue.renderSlot(_ctx.$slots, "header", { date: vue.unref(i18nDate) }, () => [
              vue.createElementVNode("div", {
                class: vue.normalizeClass(vue.unref(ns).e("title"))
              }, vue.toDisplayString(vue.unref(i18nDate)), 3),
              vue.unref(validatedRange).length === 0 ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                class: vue.normalizeClass(vue.unref(ns).e("button-group"))
              }, [
                vue.createVNode(vue.unref(ElButtonGroup$1), null, {
                  default: vue.withCtx(() => [
                    vue.createVNode(vue.unref(ElButton), {
                      size: "small",
                      onClick: _cache[0] || (_cache[0] = ($event) => vue.unref(selectDate)("prev-month"))
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(vue.unref(t)("el.datepicker.prevMonth")), 1)
                      ]),
                      _: 1
                    }),
                    vue.createVNode(vue.unref(ElButton), {
                      size: "small",
                      onClick: _cache[1] || (_cache[1] = ($event) => vue.unref(selectDate)("today"))
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(vue.unref(t)("el.datepicker.today")), 1)
                      ]),
                      _: 1
                    }),
                    vue.createVNode(vue.unref(ElButton), {
                      size: "small",
                      onClick: _cache[2] || (_cache[2] = ($event) => vue.unref(selectDate)("next-month"))
                    }, {
                      default: vue.withCtx(() => [
                        vue.createTextVNode(vue.toDisplayString(vue.unref(t)("el.datepicker.nextMonth")), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ], 2)) : vue.createCommentVNode("v-if", true)
            ])
          ], 2),
          vue.unref(validatedRange).length === 0 ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(vue.unref(ns).e("body"))
          }, [
            vue.createVNode(DateTable$1, {
              date: vue.unref(date),
              "selected-day": vue.unref(realSelectedDay),
              onPick: vue.unref(pickDay)
            }, vue.createSlots({ _: 2 }, [
              _ctx.$slots["date-cell"] || _ctx.$slots.dateCell ? {
                name: "date-cell",
                fn: vue.withCtx((data) => [
                  _ctx.$slots["date-cell"] ? vue.renderSlot(_ctx.$slots, "date-cell", vue.normalizeProps(vue.mergeProps({ key: 0 }, data))) : vue.renderSlot(_ctx.$slots, "dateCell", vue.normalizeProps(vue.mergeProps({ key: 1 }, data)))
                ])
              } : void 0
            ]), 1032, ["date", "selected-day", "onPick"])
          ], 2)) : (vue.openBlock(), vue.createElementBlock("div", {
            key: 1,
            class: vue.normalizeClass(vue.unref(ns).e("body"))
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(validatedRange), (range_, index) => {
              return vue.openBlock(), vue.createBlock(DateTable$1, {
                key: index,
                date: range_[0],
                "selected-day": vue.unref(realSelectedDay),
                range: range_,
                "hide-header": index !== 0,
                onPick: vue.unref(pickDay)
              }, vue.createSlots({ _: 2 }, [
                _ctx.$slots["date-cell"] || _ctx.$slots.dateCell ? {
                  name: "date-cell",
                  fn: vue.withCtx((data) => [
                    _ctx.$slots["date-cell"] ? vue.renderSlot(_ctx.$slots, "date-cell", vue.normalizeProps(vue.mergeProps({ key: 0 }, data))) : vue.renderSlot(_ctx.$slots, "dateCell", vue.normalizeProps(vue.mergeProps({ key: 1 }, data)))
                  ])
                } : void 0
              ]), 1032, ["date", "selected-day", "range", "hide-header", "onPick"]);
            }), 128))
          ], 2))
        ], 2);
      };
    }
  });
  var Calendar = /* @__PURE__ */ _export_sfc(_sfc_main$1R, [["__file", "calendar.vue"]]);

  const ElCalendar = withInstall(Calendar);

  const cardProps = buildProps({
    header: {
      type: String,
      default: ""
    },
    footer: {
      type: String,
      default: ""
    },
    bodyStyle: {
      type: definePropType([String, Object, Array]),
      default: ""
    },
    bodyClass: String,
    shadow: {
      type: String,
      values: ["always", "hover", "never"],
      default: "always"
    }
  });

  const __default__$1e = vue.defineComponent({
    name: "ElCard"
  });
  const _sfc_main$1Q = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1e,
    props: cardProps,
    setup(__props) {
      const ns = useNamespace("card");
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass([vue.unref(ns).b(), vue.unref(ns).is(`${_ctx.shadow}-shadow`)])
        }, [
          _ctx.$slots.header || _ctx.header ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(vue.unref(ns).e("header"))
          }, [
            vue.renderSlot(_ctx.$slots, "header", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.header), 1)
            ])
          ], 2)) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("div", {
            class: vue.normalizeClass([vue.unref(ns).e("body"), _ctx.bodyClass]),
            style: vue.normalizeStyle(_ctx.bodyStyle)
          }, [
            vue.renderSlot(_ctx.$slots, "default")
          ], 6),
          _ctx.$slots.footer || _ctx.footer ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 1,
            class: vue.normalizeClass(vue.unref(ns).e("footer"))
          }, [
            vue.renderSlot(_ctx.$slots, "footer", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.footer), 1)
            ])
          ], 2)) : vue.createCommentVNode("v-if", true)
        ], 2);
      };
    }
  });
  var Card = /* @__PURE__ */ _export_sfc(_sfc_main$1Q, [["__file", "card.vue"]]);

  const ElCard = withInstall(Card);

  const carouselProps = buildProps({
    initialIndex: {
      type: Number,
      default: 0
    },
    height: {
      type: String,
      default: ""
    },
    trigger: {
      type: String,
      values: ["hover", "click"],
      default: "hover"
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3e3
    },
    indicatorPosition: {
      type: String,
      values: ["", "none", "outside"],
      default: ""
    },
    arrow: {
      type: String,
      values: ["always", "hover", "never"],
      default: "hover"
    },
    type: {
      type: String,
      values: ["", "card"],
      default: ""
    },
    loop: {
      type: Boolean,
      default: true
    },
    direction: {
      type: String,
      values: ["horizontal", "vertical"],
      default: "horizontal"
    },
    pauseOnHover: {
      type: Boolean,
      default: true
    }
  });
  const carouselEmits = {
    change: (current, prev) => [current, prev].every(isNumber)
  };

  const carouselContextKey = Symbol("carouselContextKey");

  const THROTTLE_TIME = 300;
  const useCarousel = (props, emit, componentName) => {
    const {
      children: items,
      addChild: addItem,
      removeChild: removeItem
    } = useOrderedChildren(vue.getCurrentInstance(), "ElCarouselItem");
    const slots = vue.useSlots();
    const activeIndex = vue.ref(-1);
    const timer = vue.ref(null);
    const hover = vue.ref(false);
    const root = vue.ref();
    const containerHeight = vue.ref(0);
    const isItemsTwoLength = vue.ref(true);
    const arrowDisplay = vue.computed(() => props.arrow !== "never" && !vue.unref(isVertical));
    const hasLabel = vue.computed(() => {
      return items.value.some((item) => item.props.label.toString().length > 0);
    });
    const isCardType = vue.computed(() => props.type === "card");
    const isVertical = vue.computed(() => props.direction === "vertical");
    const containerStyle = vue.computed(() => {
      if (props.height !== "auto") {
        return {
          height: props.height
        };
      }
      return {
        height: `${containerHeight.value}px`,
        overflow: "hidden"
      };
    });
    const throttledArrowClick = throttle((index) => {
      setActiveItem(index);
    }, THROTTLE_TIME, { trailing: true });
    const throttledIndicatorHover = throttle((index) => {
      handleIndicatorHover(index);
    }, THROTTLE_TIME);
    const isTwoLengthShow = (index) => {
      if (!isItemsTwoLength.value)
        return true;
      return activeIndex.value <= 1 ? index <= 1 : index > 1;
    };
    function pauseTimer() {
      if (timer.value) {
        clearInterval(timer.value);
        timer.value = null;
      }
    }
    function startTimer() {
      if (props.interval <= 0 || !props.autoplay || timer.value)
        return;
      timer.value = setInterval(() => playSlides(), props.interval);
    }
    const playSlides = () => {
      if (activeIndex.value < items.value.length - 1) {
        activeIndex.value = activeIndex.value + 1;
      } else if (props.loop) {
        activeIndex.value = 0;
      }
    };
    function setActiveItem(index) {
      if (isString$1(index)) {
        const filteredItems = items.value.filter((item) => item.props.name === index);
        if (filteredItems.length > 0) {
          index = items.value.indexOf(filteredItems[0]);
        }
      }
      index = Number(index);
      if (Number.isNaN(index) || index !== Math.floor(index)) {
        return;
      }
      const itemCount = items.value.length;
      const oldIndex = activeIndex.value;
      if (index < 0) {
        activeIndex.value = props.loop ? itemCount - 1 : 0;
      } else if (index >= itemCount) {
        activeIndex.value = props.loop ? 0 : itemCount - 1;
      } else {
        activeIndex.value = index;
      }
      if (oldIndex === activeIndex.value) {
        resetItemPosition(oldIndex);
      }
      resetTimer();
    }
    function resetItemPosition(oldIndex) {
      items.value.forEach((item, index) => {
        item.translateItem(index, activeIndex.value, oldIndex);
      });
    }
    function itemInStage(item, index) {
      var _a, _b, _c, _d;
      const _items = vue.unref(items);
      const itemCount = _items.length;
      if (itemCount === 0 || !item.states.inStage)
        return false;
      const nextItemIndex = index + 1;
      const prevItemIndex = index - 1;
      const lastItemIndex = itemCount - 1;
      const isLastItemActive = _items[lastItemIndex].states.active;
      const isFirstItemActive = _items[0].states.active;
      const isNextItemActive = (_b = (_a = _items[nextItemIndex]) == null ? void 0 : _a.states) == null ? void 0 : _b.active;
      const isPrevItemActive = (_d = (_c = _items[prevItemIndex]) == null ? void 0 : _c.states) == null ? void 0 : _d.active;
      if (index === lastItemIndex && isFirstItemActive || isNextItemActive) {
        return "left";
      } else if (index === 0 && isLastItemActive || isPrevItemActive) {
        return "right";
      }
      return false;
    }
    function handleMouseEnter() {
      hover.value = true;
      if (props.pauseOnHover) {
        pauseTimer();
      }
    }
    function handleMouseLeave() {
      hover.value = false;
      startTimer();
    }
    function handleButtonEnter(arrow) {
      if (vue.unref(isVertical))
        return;
      items.value.forEach((item, index) => {
        if (arrow === itemInStage(item, index)) {
          item.states.hover = true;
        }
      });
    }
    function handleButtonLeave() {
      if (vue.unref(isVertical))
        return;
      items.value.forEach((item) => {
        item.states.hover = false;
      });
    }
    function handleIndicatorClick(index) {
      activeIndex.value = index;
    }
    function handleIndicatorHover(index) {
      if (props.trigger === "hover" && index !== activeIndex.value) {
        activeIndex.value = index;
      }
    }
    function prev() {
      setActiveItem(activeIndex.value - 1);
    }
    function next() {
      setActiveItem(activeIndex.value + 1);
    }
    function resetTimer() {
      pauseTimer();
      if (!props.pauseOnHover)
        startTimer();
    }
    function setContainerHeight(height) {
      if (props.height !== "auto")
        return;
      containerHeight.value = height;
    }
    function PlaceholderItem() {
      var _a;
      const defaultSlots = (_a = slots.default) == null ? void 0 : _a.call(slots);
      if (!defaultSlots)
        return null;
      const flatSlots = flattedChildren(defaultSlots);
      const carouselItemsName = "ElCarouselItem";
      const normalizeSlots = flatSlots.filter((slot) => {
        return vue.isVNode(slot) && slot.type.name === carouselItemsName;
      });
      if ((normalizeSlots == null ? void 0 : normalizeSlots.length) === 2 && props.loop && !isCardType.value) {
        isItemsTwoLength.value = true;
        return normalizeSlots;
      }
      isItemsTwoLength.value = false;
      return null;
    }
    vue.watch(() => activeIndex.value, (current, prev2) => {
      resetItemPosition(prev2);
      if (isItemsTwoLength.value) {
        current = current % 2;
        prev2 = prev2 % 2;
      }
      if (prev2 > -1) {
        emit("change", current, prev2);
      }
    });
    vue.watch(() => props.autoplay, (autoplay) => {
      autoplay ? startTimer() : pauseTimer();
    });
    vue.watch(() => props.loop, () => {
      setActiveItem(activeIndex.value);
    });
    vue.watch(() => props.interval, () => {
      resetTimer();
    });
    const resizeObserver = vue.shallowRef();
    vue.onMounted(() => {
      vue.watch(() => items.value, () => {
        if (items.value.length > 0)
          setActiveItem(props.initialIndex);
      }, {
        immediate: true
      });
      resizeObserver.value = useResizeObserver(root.value, () => {
        resetItemPosition();
      });
      startTimer();
    });
    vue.onBeforeUnmount(() => {
      pauseTimer();
      if (root.value && resizeObserver.value)
        resizeObserver.value.stop();
    });
    vue.provide(carouselContextKey, {
      root,
      isCardType,
      isVertical,
      items,
      loop: props.loop,
      addItem,
      removeItem,
      setActiveItem,
      setContainerHeight
    });
    return {
      root,
      activeIndex,
      arrowDisplay,
      hasLabel,
      hover,
      isCardType,
      items,
      isVertical,
      containerStyle,
      isItemsTwoLength,
      handleButtonEnter,
      handleButtonLeave,
      handleIndicatorClick,
      handleMouseEnter,
      handleMouseLeave,
      setActiveItem,
      prev,
      next,
      PlaceholderItem,
      isTwoLengthShow,
      throttledArrowClick,
      throttledIndicatorHover
    };
  };

  const _hoisted_1$V = ["onMouseenter", "onClick"];
  const _hoisted_2$B = { key: 0 };
  const COMPONENT_NAME$f = "ElCarousel";
  const __default__$1d = vue.defineComponent({
    name: COMPONENT_NAME$f
  });
  const _sfc_main$1P = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1d,
    props: carouselProps,
    emits: carouselEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const {
        root,
        activeIndex,
        arrowDisplay,
        hasLabel,
        hover,
        isCardType,
        items,
        isVertical,
        containerStyle,
        handleButtonEnter,
        handleButtonLeave,
        handleIndicatorClick,
        handleMouseEnter,
        handleMouseLeave,
        setActiveItem,
        prev,
        next,
        PlaceholderItem,
        isTwoLengthShow,
        throttledArrowClick,
        throttledIndicatorHover
      } = useCarousel(props, emit);
      const ns = useNamespace("carousel");
      const carouselClasses = vue.computed(() => {
        const classes = [ns.b(), ns.m(props.direction)];
        if (vue.unref(isCardType)) {
          classes.push(ns.m("card"));
        }
        return classes;
      });
      const indicatorsClasses = vue.computed(() => {
        const classes = [ns.e("indicators"), ns.em("indicators", props.direction)];
        if (vue.unref(hasLabel)) {
          classes.push(ns.em("indicators", "labels"));
        }
        if (props.indicatorPosition === "outside") {
          classes.push(ns.em("indicators", "outside"));
        }
        if (vue.unref(isVertical)) {
          classes.push(ns.em("indicators", "right"));
        }
        return classes;
      });
      expose({
        setActiveItem,
        prev,
        next
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "root",
          ref: root,
          class: vue.normalizeClass(vue.unref(carouselClasses)),
          onMouseenter: _cache[6] || (_cache[6] = vue.withModifiers((...args) => vue.unref(handleMouseEnter) && vue.unref(handleMouseEnter)(...args), ["stop"])),
          onMouseleave: _cache[7] || (_cache[7] = vue.withModifiers((...args) => vue.unref(handleMouseLeave) && vue.unref(handleMouseLeave)(...args), ["stop"]))
        }, [
          vue.createElementVNode("div", {
            class: vue.normalizeClass(vue.unref(ns).e("container")),
            style: vue.normalizeStyle(vue.unref(containerStyle))
          }, [
            vue.unref(arrowDisplay) ? (vue.openBlock(), vue.createBlock(vue.Transition, {
              key: 0,
              name: "carousel-arrow-left",
              persisted: ""
            }, {
              default: vue.withCtx(() => [
                vue.withDirectives(vue.createElementVNode("button", {
                  type: "button",
                  class: vue.normalizeClass([vue.unref(ns).e("arrow"), vue.unref(ns).em("arrow", "left")]),
                  onMouseenter: _cache[0] || (_cache[0] = ($event) => vue.unref(handleButtonEnter)("left")),
                  onMouseleave: _cache[1] || (_cache[1] = (...args) => vue.unref(handleButtonLeave) && vue.unref(handleButtonLeave)(...args)),
                  onClick: _cache[2] || (_cache[2] = vue.withModifiers(($event) => vue.unref(throttledArrowClick)(vue.unref(activeIndex) - 1), ["stop"]))
                }, [
                  vue.createVNode(vue.unref(ElIcon), null, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(arrow_left_default))
                    ]),
                    _: 1
                  })
                ], 34), [
                  [
                    vue.vShow,
                    (_ctx.arrow === "always" || vue.unref(hover)) && (props.loop || vue.unref(activeIndex) > 0)
                  ]
                ])
              ]),
              _: 1
            })) : vue.createCommentVNode("v-if", true),
            vue.unref(arrowDisplay) ? (vue.openBlock(), vue.createBlock(vue.Transition, {
              key: 1,
              name: "carousel-arrow-right",
              persisted: ""
            }, {
              default: vue.withCtx(() => [
                vue.withDirectives(vue.createElementVNode("button", {
                  type: "button",
                  class: vue.normalizeClass([vue.unref(ns).e("arrow"), vue.unref(ns).em("arrow", "right")]),
                  onMouseenter: _cache[3] || (_cache[3] = ($event) => vue.unref(handleButtonEnter)("right")),
                  onMouseleave: _cache[4] || (_cache[4] = (...args) => vue.unref(handleButtonLeave) && vue.unref(handleButtonLeave)(...args)),
                  onClick: _cache[5] || (_cache[5] = vue.withModifiers(($event) => vue.unref(throttledArrowClick)(vue.unref(activeIndex) + 1), ["stop"]))
                }, [
                  vue.createVNode(vue.unref(ElIcon), null, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(arrow_right_default))
                    ]),
                    _: 1
                  })
                ], 34), [
                  [
                    vue.vShow,
                    (_ctx.arrow === "always" || vue.unref(hover)) && (props.loop || vue.unref(activeIndex) < vue.unref(items).length - 1)
                  ]
                ])
              ]),
              _: 1
            })) : vue.createCommentVNode("v-if", true),
            vue.createVNode(vue.unref(PlaceholderItem)),
            vue.renderSlot(_ctx.$slots, "default")
          ], 6),
          _ctx.indicatorPosition !== "none" ? (vue.openBlock(), vue.createElementBlock("ul", {
            key: 0,
            class: vue.normalizeClass(vue.unref(indicatorsClasses))
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(items), (item, index) => {
              return vue.withDirectives((vue.openBlock(), vue.createElementBlock("li", {
                key: index,
                class: vue.normalizeClass([
                  vue.unref(ns).e("indicator"),
                  vue.unref(ns).em("indicator", _ctx.direction),
                  vue.unref(ns).is("active", index === vue.unref(activeIndex))
                ]),
                onMouseenter: ($event) => vue.unref(throttledIndicatorHover)(index),
                onClick: vue.withModifiers(($event) => vue.unref(handleIndicatorClick)(index), ["stop"])
              }, [
                vue.createElementVNode("button", {
                  class: vue.normalizeClass(vue.unref(ns).e("button"))
                }, [
                  vue.unref(hasLabel) ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2$B, vue.toDisplayString(item.props.label), 1)) : vue.createCommentVNode("v-if", true)
                ], 2)
              ], 42, _hoisted_1$V)), [
                [vue.vShow, vue.unref(isTwoLengthShow)(index)]
              ]);
            }), 128))
          ], 2)) : vue.createCommentVNode("v-if", true)
        ], 34);
      };
    }
  });
  var Carousel = /* @__PURE__ */ _export_sfc(_sfc_main$1P, [["__file", "carousel.vue"]]);

  const carouselItemProps = buildProps({
    name: { type: String, default: "" },
    label: {
      type: [String, Number],
      default: ""
    }
  });

  const useCarouselItem = (props, componentName) => {
    const carouselContext = vue.inject(carouselContextKey);
    const instance = vue.getCurrentInstance();
    const CARD_SCALE = 0.83;
    const carouselItemRef = vue.ref();
    const hover = vue.ref(false);
    const translate = vue.ref(0);
    const scale = vue.ref(1);
    const active = vue.ref(false);
    const ready = vue.ref(false);
    const inStage = vue.ref(false);
    const animating = vue.ref(false);
    const { isCardType, isVertical } = carouselContext;
    function processIndex(index, activeIndex, length) {
      const lastItemIndex = length - 1;
      const prevItemIndex = activeIndex - 1;
      const nextItemIndex = activeIndex + 1;
      const halfItemIndex = length / 2;
      if (activeIndex === 0 && index === lastItemIndex) {
        return -1;
      } else if (activeIndex === lastItemIndex && index === 0) {
        return length;
      } else if (index < prevItemIndex && activeIndex - index >= halfItemIndex) {
        return length + 1;
      } else if (index > nextItemIndex && index - activeIndex >= halfItemIndex) {
        return -2;
      }
      return index;
    }
    function calcCardTranslate(index, activeIndex) {
      var _a, _b;
      const parentWidth = vue.unref(isVertical) ? ((_a = carouselContext.root.value) == null ? void 0 : _a.offsetHeight) || 0 : ((_b = carouselContext.root.value) == null ? void 0 : _b.offsetWidth) || 0;
      if (inStage.value) {
        return parentWidth * ((2 - CARD_SCALE) * (index - activeIndex) + 1) / 4;
      } else if (index < activeIndex) {
        return -(1 + CARD_SCALE) * parentWidth / 4;
      } else {
        return (3 + CARD_SCALE) * parentWidth / 4;
      }
    }
    function calcTranslate(index, activeIndex, isVertical2) {
      const rootEl = carouselContext.root.value;
      if (!rootEl)
        return 0;
      const distance = (isVertical2 ? rootEl.offsetHeight : rootEl.offsetWidth) || 0;
      return distance * (index - activeIndex);
    }
    const translateItem = (index, activeIndex, oldIndex) => {
      var _a;
      const _isCardType = vue.unref(isCardType);
      const carouselItemLength = (_a = carouselContext.items.value.length) != null ? _a : Number.NaN;
      const isActive = index === activeIndex;
      if (!_isCardType && !isUndefined(oldIndex)) {
        animating.value = isActive || index === oldIndex;
      }
      if (!isActive && carouselItemLength > 2 && carouselContext.loop) {
        index = processIndex(index, activeIndex, carouselItemLength);
      }
      const _isVertical = vue.unref(isVertical);
      active.value = isActive;
      if (_isCardType) {
        inStage.value = Math.round(Math.abs(index - activeIndex)) <= 1;
        translate.value = calcCardTranslate(index, activeIndex);
        scale.value = vue.unref(active) ? 1 : CARD_SCALE;
      } else {
        translate.value = calcTranslate(index, activeIndex, _isVertical);
      }
      ready.value = true;
      if (isActive && carouselItemRef.value) {
        carouselContext.setContainerHeight(carouselItemRef.value.offsetHeight);
      }
    };
    function handleItemClick() {
      if (carouselContext && vue.unref(isCardType)) {
        const index = carouselContext.items.value.findIndex(({ uid }) => uid === instance.uid);
        carouselContext.setActiveItem(index);
      }
    }
    vue.onMounted(() => {
      carouselContext.addItem({
        props,
        states: vue.reactive({
          hover,
          translate,
          scale,
          active,
          ready,
          inStage,
          animating
        }),
        uid: instance.uid,
        translateItem
      });
    });
    vue.onUnmounted(() => {
      carouselContext.removeItem(instance.uid);
    });
    return {
      carouselItemRef,
      active,
      animating,
      hover,
      inStage,
      isVertical,
      translate,
      isCardType,
      scale,
      ready,
      handleItemClick
    };
  };

  const __default__$1c = vue.defineComponent({
    name: "ElCarouselItem"
  });
  const _sfc_main$1O = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1c,
    props: carouselItemProps,
    setup(__props) {
      const props = __props;
      const ns = useNamespace("carousel");
      const {
        carouselItemRef,
        active,
        animating,
        hover,
        inStage,
        isVertical,
        translate,
        isCardType,
        scale,
        ready,
        handleItemClick
      } = useCarouselItem(props);
      const itemStyle = vue.computed(() => {
        const translateType = `translate${vue.unref(isVertical) ? "Y" : "X"}`;
        const _translate = `${translateType}(${vue.unref(translate)}px)`;
        const _scale = `scale(${vue.unref(scale)})`;
        const transform = [_translate, _scale].join(" ");
        return {
          transform
        };
      });
      return (_ctx, _cache) => {
        return vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
          ref_key: "carouselItemRef",
          ref: carouselItemRef,
          class: vue.normalizeClass([
            vue.unref(ns).e("item"),
            vue.unref(ns).is("active", vue.unref(active)),
            vue.unref(ns).is("in-stage", vue.unref(inStage)),
            vue.unref(ns).is("hover", vue.unref(hover)),
            vue.unref(ns).is("animating", vue.unref(animating)),
            {
              [vue.unref(ns).em("item", "card")]: vue.unref(isCardType),
              [vue.unref(ns).em("item", "card-vertical")]: vue.unref(isCardType) && vue.unref(isVertical)
            }
          ]),
          style: vue.normalizeStyle(vue.unref(itemStyle)),
          onClick: _cache[0] || (_cache[0] = (...args) => vue.unref(handleItemClick) && vue.unref(handleItemClick)(...args))
        }, [
          vue.unref(isCardType) ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(vue.unref(ns).e("mask"))
          }, null, 2)), [
            [vue.vShow, !vue.unref(active)]
          ]) : vue.createCommentVNode("v-if", true),
          vue.renderSlot(_ctx.$slots, "default")
        ], 6)), [
          [vue.vShow, vue.unref(ready)]
        ]);
      };
    }
  });
  var CarouselItem = /* @__PURE__ */ _export_sfc(_sfc_main$1O, [["__file", "carousel-item.vue"]]);

  const ElCarousel = withInstall(Carousel, {
    CarouselItem
  });
  const ElCarouselItem = withNoopInstall(CarouselItem);

  const checkboxProps = {
    modelValue: {
      type: [Number, String, Boolean],
      default: void 0
    },
    label: {
      type: [String, Boolean, Number, Object],
      default: void 0
    },
    indeterminate: Boolean,
    disabled: Boolean,
    checked: Boolean,
    name: {
      type: String,
      default: void 0
    },
    trueLabel: {
      type: [String, Number],
      default: void 0
    },
    falseLabel: {
      type: [String, Number],
      default: void 0
    },
    id: {
      type: String,
      default: void 0
    },
    controls: {
      type: String,
      default: void 0
    },
    border: Boolean,
    size: useSizeProp,
    tabindex: [String, Number],
    validateEvent: {
      type: Boolean,
      default: true
    }
  };
  const checkboxEmits = {
    [UPDATE_MODEL_EVENT]: (val) => isString$1(val) || isNumber(val) || isBoolean(val),
    change: (val) => isString$1(val) || isNumber(val) || isBoolean(val)
  };

  const checkboxGroupContextKey = Symbol("checkboxGroupContextKey");

  const useCheckboxDisabled = ({
    model,
    isChecked
  }) => {
    const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
    const isLimitDisabled = vue.computed(() => {
      var _a, _b;
      const max = (_a = checkboxGroup == null ? void 0 : checkboxGroup.max) == null ? void 0 : _a.value;
      const min = (_b = checkboxGroup == null ? void 0 : checkboxGroup.min) == null ? void 0 : _b.value;
      return !isUndefined(max) && model.value.length >= max && !isChecked.value || !isUndefined(min) && model.value.length <= min && isChecked.value;
    });
    const isDisabled = useFormDisabled(vue.computed(() => (checkboxGroup == null ? void 0 : checkboxGroup.disabled.value) || isLimitDisabled.value));
    return {
      isDisabled,
      isLimitDisabled
    };
  };

  const useCheckboxEvent = (props, {
    model,
    isLimitExceeded,
    hasOwnLabel,
    isDisabled,
    isLabeledByFormItem
  }) => {
    const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
    const { formItem } = useFormItem();
    const { emit } = vue.getCurrentInstance();
    function getLabeledValue(value) {
      var _a, _b;
      return value === props.trueLabel || value === true ? (_a = props.trueLabel) != null ? _a : true : (_b = props.falseLabel) != null ? _b : false;
    }
    function emitChangeEvent(checked, e) {
      emit("change", getLabeledValue(checked), e);
    }
    function handleChange(e) {
      if (isLimitExceeded.value)
        return;
      const target = e.target;
      emit("change", getLabeledValue(target.checked), e);
    }
    async function onClickRoot(e) {
      if (isLimitExceeded.value)
        return;
      if (!hasOwnLabel.value && !isDisabled.value && isLabeledByFormItem.value) {
        const eventTargets = e.composedPath();
        const hasLabel = eventTargets.some((item) => item.tagName === "LABEL");
        if (!hasLabel) {
          model.value = getLabeledValue([false, props.falseLabel].includes(model.value));
          await vue.nextTick();
          emitChangeEvent(model.value, e);
        }
      }
    }
    const validateEvent = vue.computed(() => (checkboxGroup == null ? void 0 : checkboxGroup.validateEvent) || props.validateEvent);
    vue.watch(() => props.modelValue, () => {
      if (validateEvent.value) {
        formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn());
      }
    });
    return {
      handleChange,
      onClickRoot
    };
  };

  const useCheckboxModel = (props) => {
    const selfModel = vue.ref(false);
    const { emit } = vue.getCurrentInstance();
    const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
    const isGroup = vue.computed(() => isUndefined(checkboxGroup) === false);
    const isLimitExceeded = vue.ref(false);
    const model = vue.computed({
      get() {
        var _a, _b;
        return isGroup.value ? (_a = checkboxGroup == null ? void 0 : checkboxGroup.modelValue) == null ? void 0 : _a.value : (_b = props.modelValue) != null ? _b : selfModel.value;
      },
      set(val) {
        var _a, _b;
        if (isGroup.value && isArray$1(val)) {
          isLimitExceeded.value = ((_a = checkboxGroup == null ? void 0 : checkboxGroup.max) == null ? void 0 : _a.value) !== void 0 && val.length > (checkboxGroup == null ? void 0 : checkboxGroup.max.value);
          isLimitExceeded.value === false && ((_b = checkboxGroup == null ? void 0 : checkboxGroup.changeEvent) == null ? void 0 : _b.call(checkboxGroup, val));
        } else {
          emit(UPDATE_MODEL_EVENT, val);
          selfModel.value = val;
        }
      }
    });
    return {
      model,
      isGroup,
      isLimitExceeded
    };
  };

  const useCheckboxStatus = (props, slots, { model }) => {
    const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
    const isFocused = vue.ref(false);
    const isChecked = vue.computed(() => {
      const value = model.value;
      if (isBoolean(value)) {
        return value;
      } else if (isArray$1(value)) {
        if (isObject$1(props.label)) {
          return value.map(vue.toRaw).some((o) => isEqual$1(o, props.label));
        } else {
          return value.map(vue.toRaw).includes(props.label);
        }
      } else if (value !== null && value !== void 0) {
        return value === props.trueLabel;
      } else {
        return !!value;
      }
    });
    const checkboxButtonSize = useFormSize(vue.computed(() => {
      var _a;
      return (_a = checkboxGroup == null ? void 0 : checkboxGroup.size) == null ? void 0 : _a.value;
    }), {
      prop: true
    });
    const checkboxSize = useFormSize(vue.computed(() => {
      var _a;
      return (_a = checkboxGroup == null ? void 0 : checkboxGroup.size) == null ? void 0 : _a.value;
    }));
    const hasOwnLabel = vue.computed(() => {
      return !!slots.default || !isNil(props.label);
    });
    return {
      checkboxButtonSize,
      isChecked,
      isFocused,
      checkboxSize,
      hasOwnLabel
    };
  };

  const setStoreValue = (props, { model }) => {
    function addToStore() {
      if (isArray$1(model.value) && !model.value.includes(props.label)) {
        model.value.push(props.label);
      } else {
        model.value = props.trueLabel || true;
      }
    }
    props.checked && addToStore();
  };
  const useCheckbox = (props, slots) => {
    const { formItem: elFormItem } = useFormItem();
    const { model, isGroup, isLimitExceeded } = useCheckboxModel(props);
    const {
      isFocused,
      isChecked,
      checkboxButtonSize,
      checkboxSize,
      hasOwnLabel
    } = useCheckboxStatus(props, slots, { model });
    const { isDisabled } = useCheckboxDisabled({ model, isChecked });
    const { inputId, isLabeledByFormItem } = useFormItemInputId(props, {
      formItemContext: elFormItem,
      disableIdGeneration: hasOwnLabel,
      disableIdManagement: isGroup
    });
    const { handleChange, onClickRoot } = useCheckboxEvent(props, {
      model,
      isLimitExceeded,
      hasOwnLabel,
      isDisabled,
      isLabeledByFormItem
    });
    setStoreValue(props, { model });
    return {
      inputId,
      isLabeledByFormItem,
      isChecked,
      isDisabled,
      isFocused,
      checkboxButtonSize,
      checkboxSize,
      hasOwnLabel,
      model,
      handleChange,
      onClickRoot
    };
  };

  const _hoisted_1$U = ["id", "indeterminate", "name", "tabindex", "disabled", "true-value", "false-value"];
  const _hoisted_2$A = ["id", "indeterminate", "disabled", "value", "name", "tabindex"];
  const __default__$1b = vue.defineComponent({
    name: "ElCheckbox"
  });
  const _sfc_main$1N = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1b,
    props: checkboxProps,
    emits: checkboxEmits,
    setup(__props) {
      const props = __props;
      const slots = vue.useSlots();
      const {
        inputId,
        isLabeledByFormItem,
        isChecked,
        isDisabled,
        isFocused,
        checkboxSize,
        hasOwnLabel,
        model,
        handleChange,
        onClickRoot
      } = useCheckbox(props, slots);
      const ns = useNamespace("checkbox");
      const compKls = vue.computed(() => {
        return [
          ns.b(),
          ns.m(checkboxSize.value),
          ns.is("disabled", isDisabled.value),
          ns.is("bordered", props.border),
          ns.is("checked", isChecked.value)
        ];
      });
      const spanKls = vue.computed(() => {
        return [
          ns.e("input"),
          ns.is("disabled", isDisabled.value),
          ns.is("checked", isChecked.value),
          ns.is("indeterminate", props.indeterminate),
          ns.is("focus", isFocused.value)
        ];
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(!vue.unref(hasOwnLabel) && vue.unref(isLabeledByFormItem) ? "span" : "label"), {
          class: vue.normalizeClass(vue.unref(compKls)),
          "aria-controls": _ctx.indeterminate ? _ctx.controls : null,
          onClick: vue.unref(onClickRoot)
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("span", {
              class: vue.normalizeClass(vue.unref(spanKls))
            }, [
              _ctx.trueLabel || _ctx.falseLabel ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                key: 0,
                id: vue.unref(inputId),
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(model) ? model.value = $event : null),
                class: vue.normalizeClass(vue.unref(ns).e("original")),
                type: "checkbox",
                indeterminate: _ctx.indeterminate,
                name: _ctx.name,
                tabindex: _ctx.tabindex,
                disabled: vue.unref(isDisabled),
                "true-value": _ctx.trueLabel,
                "false-value": _ctx.falseLabel,
                onChange: _cache[1] || (_cache[1] = (...args) => vue.unref(handleChange) && vue.unref(handleChange)(...args)),
                onFocus: _cache[2] || (_cache[2] = ($event) => isFocused.value = true),
                onBlur: _cache[3] || (_cache[3] = ($event) => isFocused.value = false),
                onClick: _cache[4] || (_cache[4] = vue.withModifiers(() => {
                }, ["stop"]))
              }, null, 42, _hoisted_1$U)), [
                [vue.vModelCheckbox, vue.unref(model)]
              ]) : vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                key: 1,
                id: vue.unref(inputId),
                "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.isRef(model) ? model.value = $event : null),
                class: vue.normalizeClass(vue.unref(ns).e("original")),
                type: "checkbox",
                indeterminate: _ctx.indeterminate,
                disabled: vue.unref(isDisabled),
                value: _ctx.label,
                name: _ctx.name,
                tabindex: _ctx.tabindex,
                onChange: _cache[6] || (_cache[6] = (...args) => vue.unref(handleChange) && vue.unref(handleChange)(...args)),
                onFocus: _cache[7] || (_cache[7] = ($event) => isFocused.value = true),
                onBlur: _cache[8] || (_cache[8] = ($event) => isFocused.value = false),
                onClick: _cache[9] || (_cache[9] = vue.withModifiers(() => {
                }, ["stop"]))
              }, null, 42, _hoisted_2$A)), [
                [vue.vModelCheckbox, vue.unref(model)]
              ]),
              vue.createElementVNode("span", {
                class: vue.normalizeClass(vue.unref(ns).e("inner"))
              }, null, 2)
            ], 2),
            vue.unref(hasOwnLabel) ? (vue.openBlock(), vue.createElementBlock("span", {
              key: 0,
              class: vue.normalizeClass(vue.unref(ns).e("label"))
            }, [
              vue.renderSlot(_ctx.$slots, "default"),
              !_ctx.$slots.default ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
                vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
              ], 64)) : vue.createCommentVNode("v-if", true)
            ], 2)) : vue.createCommentVNode("v-if", true)
          ]),
          _: 3
        }, 8, ["class", "aria-controls", "onClick"]);
      };
    }
  });
  var Checkbox = /* @__PURE__ */ _export_sfc(_sfc_main$1N, [["__file", "checkbox.vue"]]);

  const _hoisted_1$T = ["name", "tabindex", "disabled", "true-value", "false-value"];
  const _hoisted_2$z = ["name", "tabindex", "disabled", "value"];
  const __default__$1a = vue.defineComponent({
    name: "ElCheckboxButton"
  });
  const _sfc_main$1M = /* @__PURE__ */ vue.defineComponent({
    ...__default__$1a,
    props: checkboxProps,
    emits: checkboxEmits,
    setup(__props) {
      const props = __props;
      const slots = vue.useSlots();
      const {
        isFocused,
        isChecked,
        isDisabled,
        checkboxButtonSize,
        model,
        handleChange
      } = useCheckbox(props, slots);
      const checkboxGroup = vue.inject(checkboxGroupContextKey, void 0);
      const ns = useNamespace("checkbox");
      const activeStyle = vue.computed(() => {
        var _a, _b, _c, _d;
        const fillValue = (_b = (_a = checkboxGroup == null ? void 0 : checkboxGroup.fill) == null ? void 0 : _a.value) != null ? _b : "";
        return {
          backgroundColor: fillValue,
          borderColor: fillValue,
          color: (_d = (_c = checkboxGroup == null ? void 0 : checkboxGroup.textColor) == null ? void 0 : _c.value) != null ? _d : "",
          boxShadow: fillValue ? `-1px 0 0 0 ${fillValue}` : void 0
        };
      });
      const labelKls = vue.computed(() => {
        return [
          ns.b("button"),
          ns.bm("button", checkboxButtonSize.value),
          ns.is("disabled", isDisabled.value),
          ns.is("checked", isChecked.value),
          ns.is("focus", isFocused.value)
        ];
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("label", {
          class: vue.normalizeClass(vue.unref(labelKls))
        }, [
          _ctx.trueLabel || _ctx.falseLabel ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
            key: 0,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(model) ? model.value = $event : null),
            class: vue.normalizeClass(vue.unref(ns).be("button", "original")),
            type: "checkbox",
            name: _ctx.name,
            tabindex: _ctx.tabindex,
            disabled: vue.unref(isDisabled),
            "true-value": _ctx.trueLabel,
            "false-value": _ctx.falseLabel,
            onChange: _cache[1] || (_cache[1] = (...args) => vue.unref(handleChange) && vue.unref(handleChange)(...args)),
            onFocus: _cache[2] || (_cache[2] = ($event) => isFocused.value = true),
            onBlur: _cache[3] || (_cache[3] = ($event) => isFocused.value = false),
            onClick: _cache[4] || (_cache[4] = vue.withModifiers(() => {
            }, ["stop"]))
          }, null, 42, _hoisted_1$T)), [
            [vue.vModelCheckbox, vue.unref(model)]
          ]) : vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
            key: 1,
            "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => vue.isRef(model) ? model.value = $event : null),
            class: vue.normalizeClass(vue.unref(ns).be("button", "original")),
            type: "checkbox",
            name: _ctx.name,
            tabindex: _ctx.tabindex,
            disabled: vue.unref(isDisabled),
            value: _ctx.label,
            onChange: _cache[6] || (_cache[6] = (...args) => vue.unref(handleChange) && vue.unref(handleChange)(...args)),
            onFocus: _cache[7] || (_cache[7] = ($event) => isFocused.value = true),
            onBlur: _cache[8] || (_cache[8] = ($event) => isFocused.value = false),
            onClick: _cache[9] || (_cache[9] = vue.withModifiers(() => {
            }, ["stop"]))
          }, null, 42, _hoisted_2$z)), [
            [vue.vModelCheckbox, vue.unref(model)]
          ]),
          _ctx.$slots.default || _ctx.label ? (vue.openBlock(), vue.createElementBlock("span", {
            key: 2,
            class: vue.normalizeClass(vue.unref(ns).be("button", "inner")),
            style: vue.normalizeStyle(vue.unref(isChecked) ? vue.unref(activeStyle) : void 0)
          }, [
            vue.renderSlot(_ctx.$slots, "default", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
            ])
          ], 6)) : vue.createCommentVNode("v-if", true)
        ], 2);
      };
    }
  });
  var CheckboxButton = /* @__PURE__ */ _export_sfc(_sfc_main$1M, [["__file", "checkbox-button.vue"]]);

  const checkboxGroupProps = buildProps({
    modelValue: {
      type: definePropType(Array),
      default: () => []
    },
    disabled: Boolean,
    min: Number,
    max: Number,
    size: useSizeProp,
    label: String,
    fill: String,
    textColor: String,
    tag: {
      type: String,
      default: "div"
    },
    validateEvent: {
      type: Boolean,
      default: true
    }
  });
  const checkboxGroupEmits = {
    [UPDATE_MODEL_EVENT]: (val) => isArray$1(val),
    change: (val) => isArray$1(val)
  };

  const __default__$19 = vue.defineComponent({
    name: "ElCheckboxGroup"
  });
  const _sfc_main$1L = /* @__PURE__ */ vue.defineComponent({
    ...__default__$19,
    props: checkboxGroupProps,
    emits: checkboxGroupEmits,
    setup(__props, { emit }) {
      const props = __props;
      const ns = useNamespace("checkbox");
      const { formItem } = useFormItem();
      const { inputId: groupId, isLabeledByFormItem } = useFormItemInputId(props, {
        formItemContext: formItem
      });
      const changeEvent = async (value) => {
        emit(UPDATE_MODEL_EVENT, value);
        await vue.nextTick();
        emit("change", value);
      };
      const modelValue = vue.computed({
        get() {
          return props.modelValue;
        },
        set(val) {
          changeEvent(val);
        }
      });
      vue.provide(checkboxGroupContextKey, {
        ...pick(vue.toRefs(props), [
          "size",
          "min",
          "max",
          "disabled",
          "validateEvent",
          "fill",
          "textColor"
        ]),
        modelValue,
        changeEvent
      });
      vue.watch(() => props.modelValue, () => {
        if (props.validateEvent) {
          formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn());
        }
      });
      return (_ctx, _cache) => {
        var _a;
        return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.tag), {
          id: vue.unref(groupId),
          class: vue.normalizeClass(vue.unref(ns).b("group")),
          role: "group",
          "aria-label": !vue.unref(isLabeledByFormItem) ? _ctx.label || "checkbox-group" : void 0,
          "aria-labelledby": vue.unref(isLabeledByFormItem) ? (_a = vue.unref(formItem)) == null ? void 0 : _a.labelId : void 0
        }, {
          default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "default")
          ]),
          _: 3
        }, 8, ["id", "class", "aria-label", "aria-labelledby"]);
      };
    }
  });
  var CheckboxGroup = /* @__PURE__ */ _export_sfc(_sfc_main$1L, [["__file", "checkbox-group.vue"]]);

  const ElCheckbox = withInstall(Checkbox, {
    CheckboxButton,
    CheckboxGroup
  });
  const ElCheckboxButton = withNoopInstall(CheckboxButton);
  const ElCheckboxGroup$1 = withNoopInstall(CheckboxGroup);

  const radioPropsBase = buildProps({
    size: useSizeProp,
    disabled: Boolean,
    label: {
      type: [String, Number, Boolean],
      default: ""
    }
  });
  const radioProps = buildProps({
    ...radioPropsBase,
    modelValue: {
      type: [String, Number, Boolean],
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    border: Boolean
  });
  const radioEmits = {
    [UPDATE_MODEL_EVENT]: (val) => isString$1(val) || isNumber(val) || isBoolean(val),
    [CHANGE_EVENT]: (val) => isString$1(val) || isNumber(val) || isBoolean(val)
  };

  const radioGroupKey = Symbol("radioGroupKey");

  const useRadio = (props, emit) => {
    const radioRef = vue.ref();
    const radioGroup = vue.inject(radioGroupKey, void 0);
    const isGroup = vue.computed(() => !!radioGroup);
    const modelValue = vue.computed({
      get() {
        return isGroup.value ? radioGroup.modelValue : props.modelValue;
      },
      set(val) {
        if (isGroup.value) {
          radioGroup.changeEvent(val);
        } else {
          emit && emit(UPDATE_MODEL_EVENT, val);
        }
        radioRef.value.checked = props.modelValue === props.label;
      }
    });
    const size = useFormSize(vue.computed(() => radioGroup == null ? void 0 : radioGroup.size));
    const disabled = useFormDisabled(vue.computed(() => radioGroup == null ? void 0 : radioGroup.disabled));
    const focus = vue.ref(false);
    const tabIndex = vue.computed(() => {
      return disabled.value || isGroup.value && modelValue.value !== props.label ? -1 : 0;
    });
    return {
      radioRef,
      isGroup,
      radioGroup,
      focus,
      size,
      disabled,
      tabIndex,
      modelValue
    };
  };

  const _hoisted_1$S = ["value", "name", "disabled"];
  const __default__$18 = vue.defineComponent({
    name: "ElRadio"
  });
  const _sfc_main$1K = /* @__PURE__ */ vue.defineComponent({
    ...__default__$18,
    props: radioProps,
    emits: radioEmits,
    setup(__props, { emit }) {
      const props = __props;
      const ns = useNamespace("radio");
      const { radioRef, radioGroup, focus, size, disabled, modelValue } = useRadio(props, emit);
      function handleChange() {
        vue.nextTick(() => emit("change", modelValue.value));
      }
      return (_ctx, _cache) => {
        var _a;
        return vue.openBlock(), vue.createElementBlock("label", {
          class: vue.normalizeClass([
            vue.unref(ns).b(),
            vue.unref(ns).is("disabled", vue.unref(disabled)),
            vue.unref(ns).is("focus", vue.unref(focus)),
            vue.unref(ns).is("bordered", _ctx.border),
            vue.unref(ns).is("checked", vue.unref(modelValue) === _ctx.label),
            vue.unref(ns).m(vue.unref(size))
          ])
        }, [
          vue.createElementVNode("span", {
            class: vue.normalizeClass([
              vue.unref(ns).e("input"),
              vue.unref(ns).is("disabled", vue.unref(disabled)),
              vue.unref(ns).is("checked", vue.unref(modelValue) === _ctx.label)
            ])
          }, [
            vue.withDirectives(vue.createElementVNode("input", {
              ref_key: "radioRef",
              ref: radioRef,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(modelValue) ? modelValue.value = $event : null),
              class: vue.normalizeClass(vue.unref(ns).e("original")),
              value: _ctx.label,
              name: _ctx.name || ((_a = vue.unref(radioGroup)) == null ? void 0 : _a.name),
              disabled: vue.unref(disabled),
              type: "radio",
              onFocus: _cache[1] || (_cache[1] = ($event) => focus.value = true),
              onBlur: _cache[2] || (_cache[2] = ($event) => focus.value = false),
              onChange: handleChange,
              onClick: _cache[3] || (_cache[3] = vue.withModifiers(() => {
              }, ["stop"]))
            }, null, 42, _hoisted_1$S), [
              [vue.vModelRadio, vue.unref(modelValue)]
            ]),
            vue.createElementVNode("span", {
              class: vue.normalizeClass(vue.unref(ns).e("inner"))
            }, null, 2)
          ], 2),
          vue.createElementVNode("span", {
            class: vue.normalizeClass(vue.unref(ns).e("label")),
            onKeydown: _cache[4] || (_cache[4] = vue.withModifiers(() => {
            }, ["stop"]))
          }, [
            vue.renderSlot(_ctx.$slots, "default", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
            ])
          ], 34)
        ], 2);
      };
    }
  });
  var Radio = /* @__PURE__ */ _export_sfc(_sfc_main$1K, [["__file", "radio.vue"]]);

  const radioButtonProps = buildProps({
    ...radioPropsBase,
    name: {
      type: String,
      default: ""
    }
  });

  const _hoisted_1$R = ["value", "name", "disabled"];
  const __default__$17 = vue.defineComponent({
    name: "ElRadioButton"
  });
  const _sfc_main$1J = /* @__PURE__ */ vue.defineComponent({
    ...__default__$17,
    props: radioButtonProps,
    setup(__props) {
      const props = __props;
      const ns = useNamespace("radio");
      const { radioRef, focus, size, disabled, modelValue, radioGroup } = useRadio(props);
      const activeStyle = vue.computed(() => {
        return {
          backgroundColor: (radioGroup == null ? void 0 : radioGroup.fill) || "",
          borderColor: (radioGroup == null ? void 0 : radioGroup.fill) || "",
          boxShadow: (radioGroup == null ? void 0 : radioGroup.fill) ? `-1px 0 0 0 ${radioGroup.fill}` : "",
          color: (radioGroup == null ? void 0 : radioGroup.textColor) || ""
        };
      });
      return (_ctx, _cache) => {
        var _a;
        return vue.openBlock(), vue.createElementBlock("label", {
          class: vue.normalizeClass([
            vue.unref(ns).b("button"),
            vue.unref(ns).is("active", vue.unref(modelValue) === _ctx.label),
            vue.unref(ns).is("disabled", vue.unref(disabled)),
            vue.unref(ns).is("focus", vue.unref(focus)),
            vue.unref(ns).bm("button", vue.unref(size))
          ])
        }, [
          vue.withDirectives(vue.createElementVNode("input", {
            ref_key: "radioRef",
            ref: radioRef,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(modelValue) ? modelValue.value = $event : null),
            class: vue.normalizeClass(vue.unref(ns).be("button", "original-radio")),
            value: _ctx.label,
            type: "radio",
            name: _ctx.name || ((_a = vue.unref(radioGroup)) == null ? void 0 : _a.name),
            disabled: vue.unref(disabled),
            onFocus: _cache[1] || (_cache[1] = ($event) => focus.value = true),
            onBlur: _cache[2] || (_cache[2] = ($event) => focus.value = false),
            onClick: _cache[3] || (_cache[3] = vue.withModifiers(() => {
            }, ["stop"]))
          }, null, 42, _hoisted_1$R), [
            [vue.vModelRadio, vue.unref(modelValue)]
          ]),
          vue.createElementVNode("span", {
            class: vue.normalizeClass(vue.unref(ns).be("button", "inner")),
            style: vue.normalizeStyle(vue.unref(modelValue) === _ctx.label ? vue.unref(activeStyle) : {}),
            onKeydown: _cache[4] || (_cache[4] = vue.withModifiers(() => {
            }, ["stop"]))
          }, [
            vue.renderSlot(_ctx.$slots, "default", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.label), 1)
            ])
          ], 38)
        ], 2);
      };
    }
  });
  var RadioButton = /* @__PURE__ */ _export_sfc(_sfc_main$1J, [["__file", "radio-button.vue"]]);

  const radioGroupProps = buildProps({
    id: {
      type: String,
      default: void 0
    },
    size: useSizeProp,
    disabled: Boolean,
    modelValue: {
      type: [String, Number, Boolean],
      default: ""
    },
    fill: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: void 0
    },
    textColor: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: void 0
    },
    validateEvent: {
      type: Boolean,
      default: true
    }
  });
  const radioGroupEmits = radioEmits;

  const _hoisted_1$Q = ["id", "aria-label", "aria-labelledby"];
  const __default__$16 = vue.defineComponent({
    name: "ElRadioGroup"
  });
  const _sfc_main$1I = /* @__PURE__ */ vue.defineComponent({
    ...__default__$16,
    props: radioGroupProps,
    emits: radioGroupEmits,
    setup(__props, { emit }) {
      const props = __props;
      const ns = useNamespace("radio");
      const radioId = useId();
      const radioGroupRef = vue.ref();
      const { formItem } = useFormItem();
      const { inputId: groupId, isLabeledByFormItem } = useFormItemInputId(props, {
        formItemContext: formItem
      });
      const changeEvent = (value) => {
        emit(UPDATE_MODEL_EVENT, value);
        vue.nextTick(() => emit("change", value));
      };
      vue.onMounted(() => {
        const radios = radioGroupRef.value.querySelectorAll("[type=radio]");
        const firstLabel = radios[0];
        if (!Array.from(radios).some((radio) => radio.checked) && firstLabel) {
          firstLabel.tabIndex = 0;
        }
      });
      const name = vue.computed(() => {
        return props.name || radioId.value;
      });
      vue.provide(radioGroupKey, vue.reactive({
        ...vue.toRefs(props),
        changeEvent,
        name
      }));
      vue.watch(() => props.modelValue, () => {
        if (props.validateEvent) {
          formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn());
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          id: vue.unref(groupId),
          ref_key: "radioGroupRef",
          ref: radioGroupRef,
          class: vue.normalizeClass(vue.unref(ns).b("group")),
          role: "radiogroup",
          "aria-label": !vue.unref(isLabeledByFormItem) ? _ctx.label || "radio-group" : void 0,
          "aria-labelledby": vue.unref(isLabeledByFormItem) ? vue.unref(formItem).labelId : void 0
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 10, _hoisted_1$Q);
      };
    }
  });
  var RadioGroup = /* @__PURE__ */ _export_sfc(_sfc_main$1I, [["__file", "radio-group.vue"]]);

  const ElRadio = withInstall(Radio, {
    RadioButton,
    RadioGroup
  });
  const ElRadioGroup = withNoopInstall(RadioGroup);
  const ElRadioButton = withNoopInstall(RadioButton);

  var NodeContent$1 = vue.defineComponent({
    name: "NodeContent",
    setup() {
      const ns = useNamespace("cascader-node");
      return {
        ns
      };
    },
    render() {
      const { ns } = this;
      const { node, panel } = this.$parent;
      const { data, label } = node;
      const { renderLabelFn } = panel;
      return vue.h("span", { class: ns.e("label") }, renderLabelFn ? renderLabelFn({ node, data }) : label);
    }
  });

  const CASCADER_PANEL_INJECTION_KEY = Symbol();

  const _sfc_main$1H = vue.defineComponent({
    name: "ElCascaderNode",
    components: {
      ElCheckbox,
      ElRadio,
      NodeContent: NodeContent$1,
      ElIcon,
      Check: check_default,
      Loading: loading_default,
      ArrowRight: arrow_right_default
    },
    props: {
      node: {
        type: Object,
        required: true
      },
      menuId: String
    },
    emits: ["expand"],
    setup(props, { emit }) {
      const panel = vue.inject(CASCADER_PANEL_INJECTION_KEY);
      const ns = useNamespace("cascader-node");
      const isHoverMenu = vue.computed(() => panel.isHoverMenu);
      const multiple = vue.computed(() => panel.config.multiple);
      const checkStrictly = vue.computed(() => panel.config.checkStrictly);
      const checkedNodeId = vue.computed(() => {
        var _a;
        return (_a = panel.checkedNodes[0]) == null ? void 0 : _a.uid;
      });
      const isDisabled = vue.computed(() => props.node.isDisabled);
      const isLeaf = vue.computed(() => props.node.isLeaf);
      const expandable = vue.computed(() => checkStrictly.value && !isLeaf.value || !isDisabled.value);
      const inExpandingPath = vue.computed(() => isInPath(panel.expandingNode));
      const inCheckedPath = vue.computed(() => checkStrictly.value && panel.checkedNodes.some(isInPath));
      const isInPath = (node) => {
        var _a;
        const { level, uid } = props.node;
        return ((_a = node == null ? void 0 : node.pathNodes[level - 1]) == null ? void 0 : _a.uid) === uid;
      };
      const doExpand = () => {
        if (inExpandingPath.value)
          return;
        panel.expandNode(props.node);
      };
      const doCheck = (checked) => {
        const { node } = props;
        if (checked === node.checked)
          return;
        panel.handleCheckChange(node, checked);
      };
      const doLoad = () => {
        panel.lazyLoad(props.node, () => {
          if (!isLeaf.value)
            doExpand();
        });
      };
      const handleHoverExpand = (e) => {
        if (!isHoverMenu.value)
          return;
        handleExpand();
        !isLeaf.value && emit("expand", e);
      };
      const handleExpand = () => {
        const { node } = props;
        if (!expandable.value || node.loading)
          return;
        node.loaded ? doExpand() : doLoad();
      };
      const handleClick = () => {
        if (isHoverMenu.value && !isLeaf.value)
          return;
        if (isLeaf.value && !isDisabled.value && !checkStrictly.value && !multiple.value) {
          handleCheck(true);
        } else {
          handleExpand();
        }
      };
      const handleSelectCheck = (checked) => {
        if (checkStrictly.value) {
          doCheck(checked);
          if (props.node.loaded) {
            doExpand();
          }
        } else {
          handleCheck(checked);
        }
      };
      const handleCheck = (checked) => {
        if (!props.node.loaded) {
          doLoad();
        } else {
          doCheck(checked);
          !checkStrictly.value && doExpand();
        }
      };
      return {
        panel,
        isHoverMenu,
        multiple,
        checkStrictly,
        checkedNodeId,
        isDisabled,
        isLeaf,
        expandable,
        inExpandingPath,
        inCheckedPath,
        ns,
        handleHoverExpand,
        handleExpand,
        handleClick,
        handleCheck,
        handleSelectCheck
      };
    }
  });
  const _hoisted_1$P = ["id", "aria-haspopup", "aria-owns", "aria-expanded", "tabindex"];
  const _hoisted_2$y = /* @__PURE__ */ vue.createElementVNode("span", null, null, -1);
  function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_el_checkbox = vue.resolveComponent("el-checkbox");
    const _component_el_radio = vue.resolveComponent("el-radio");
    const _component_check = vue.resolveComponent("check");
    const _component_el_icon = vue.resolveComponent("el-icon");
    const _component_node_content = vue.resolveComponent("node-content");
    const _component_loading = vue.resolveComponent("loading");
    const _component_arrow_right = vue.resolveComponent("arrow-right");
    return vue.openBlock(), vue.createElementBlock("li", {
      id: `${_ctx.menuId}-${_ctx.node.uid}`,
      role: "menuitem",
      "aria-haspopup": !_ctx.isLeaf,
      "aria-owns": _ctx.isLeaf ? null : _ctx.menuId,
      "aria-expanded": _ctx.inExpandingPath,
      tabindex: _ctx.expandable ? -1 : void 0,
      class: vue.normalizeClass([
        _ctx.ns.b(),
        _ctx.ns.is("selectable", _ctx.checkStrictly),
        _ctx.ns.is("active", _ctx.node.checked),
        _ctx.ns.is("disabled", !_ctx.expandable),
        _ctx.inExpandingPath && "in-active-path",
        _ctx.inCheckedPath && "in-checked-path"
      ]),
      onMouseenter: _cache[2] || (_cache[2] = (...args) => _ctx.handleHoverExpand && _ctx.handleHoverExpand(...args)),
      onFocus: _cache[3] || (_cache[3] = (...args) => _ctx.handleHoverExpand && _ctx.handleHoverExpand(...args)),
      onClick: _cache[4] || (_cache[4] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
    }, [
      vue.createCommentVNode(" prefix "),
      _ctx.multiple ? (vue.openBlock(), vue.createBlock(_component_el_checkbox, {
        key: 0,
        "model-value": _ctx.node.checked,
        indeterminate: _ctx.node.indeterminate,
        disabled: _ctx.isDisabled,
        onClick: _cache[0] || (_cache[0] = vue.withModifiers(() => {
        }, ["stop"])),
        "onUpdate:modelValue": _ctx.handleSelectCheck
      }, null, 8, ["model-value", "indeterminate", "disabled", "onUpdate:modelValue"])) : _ctx.checkStrictly ? (vue.openBlock(), vue.createBlock(_component_el_radio, {
        key: 1,
        "model-value": _ctx.checkedNodeId,
        label: _ctx.node.uid,
        disabled: _ctx.isDisabled,
        "onUpdate:modelValue": _ctx.handleSelectCheck,
        onClick: _cache[1] || (_cache[1] = vue.withModifiers(() => {
        }, ["stop"]))
      }, {
        default: vue.withCtx(() => [
          vue.createCommentVNode("\n        Add an empty element to avoid render label,\n        do not use empty fragment here for https://github.com/vuejs/vue-next/pull/2485\n      "),
          _hoisted_2$y
        ]),
        _: 1
      }, 8, ["model-value", "label", "disabled", "onUpdate:modelValue"])) : _ctx.isLeaf && _ctx.node.checked ? (vue.openBlock(), vue.createBlock(_component_el_icon, {
        key: 2,
        class: vue.normalizeClass(_ctx.ns.e("prefix"))
      }, {
        default: vue.withCtx(() => [
          vue.createVNode(_component_check)
        ]),
        _: 1
      }, 8, ["class"])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" content "),
      vue.createVNode(_component_node_content),
      vue.createCommentVNode(" postfix "),
      !_ctx.isLeaf ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 3 }, [
        _ctx.node.loading ? (vue.openBlock(), vue.createBlock(_component_el_icon, {
          key: 0,
          class: vue.normalizeClass([_ctx.ns.is("loading"), _ctx.ns.e("postfix")])
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_loading)
          ]),
          _: 1
        }, 8, ["class"])) : (vue.openBlock(), vue.createBlock(_component_el_icon, {
          key: 1,
          class: vue.normalizeClass(["arrow-right", _ctx.ns.e("postfix")])
        }, {
          default: vue.withCtx(() => [
            vue.createVNode(_component_arrow_right)
          ]),
          _: 1
        }, 8, ["class"]))
      ], 64)) : vue.createCommentVNode("v-if", true)
    ], 42, _hoisted_1$P);
  }
  var ElCascaderNode = /* @__PURE__ */ _export_sfc(_sfc_main$1H, [["render", _sfc_render$u], ["__file", "node.vue"]]);

  const _sfc_main$1G = vue.defineComponent({
    name: "ElCascaderMenu",
    components: {
      Loading: loading_default,
      ElIcon,
      ElScrollbar,
      ElCascaderNode
    },
    props: {
      nodes: {
        type: Array,
        required: true
      },
      index: {
        type: Number,
        required: true
      }
    },
    setup(props) {
      const instance = vue.getCurrentInstance();
      const ns = useNamespace("cascader-menu");
      const { t } = useLocale();
      const id = generateId();
      let activeNode = null;
      let hoverTimer = null;
      const panel = vue.inject(CASCADER_PANEL_INJECTION_KEY);
      const hoverZone = vue.ref(null);
      const isEmpty = vue.computed(() => !props.nodes.length);
      const isLoading = vue.computed(() => !panel.initialLoaded);
      const menuId = vue.computed(() => `cascader-menu-${id}-${props.index}`);
      const handleExpand = (e) => {
        activeNode = e.target;
      };
      const handleMouseMove = (e) => {
        if (!panel.isHoverMenu || !activeNode || !hoverZone.value)
          return;
        if (activeNode.contains(e.target)) {
          clearHoverTimer();
          const el = instance.vnode.el;
          const { left } = el.getBoundingClientRect();
          const { offsetWidth, offsetHeight } = el;
          const startX = e.clientX - left;
          const top = activeNode.offsetTop;
          const bottom = top + activeNode.offsetHeight;
          hoverZone.value.innerHTML = `
          <path style="pointer-events: auto;" fill="transparent" d="M${startX} ${top} L${offsetWidth} 0 V${top} Z" />
          <path style="pointer-events: auto;" fill="transparent" d="M${startX} ${bottom} L${offsetWidth} ${offsetHeight} V${bottom} Z" />
        `;
        } else if (!hoverTimer) {
          hoverTimer = window.setTimeout(clearHoverZone, panel.config.hoverThreshold);
        }
      };
      const clearHoverTimer = () => {
        if (!hoverTimer)
          return;
        clearTimeout(hoverTimer);
        hoverTimer = null;
      };
      const clearHoverZone = () => {
        if (!hoverZone.value)
          return;
        hoverZone.value.innerHTML = "";
        clearHoverTimer();
      };
      return {
        ns,
        panel,
        hoverZone,
        isEmpty,
        isLoading,
        menuId,
        t,
        handleExpand,
        handleMouseMove,
        clearHoverZone
      };
    }
  });
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_el_cascader_node = vue.resolveComponent("el-cascader-node");
    const _component_loading = vue.resolveComponent("loading");
    const _component_el_icon = vue.resolveComponent("el-icon");
    const _component_el_scrollbar = vue.resolveComponent("el-scrollbar");
    return vue.openBlock(), vue.createBlock(_component_el_scrollbar, {
      key: _ctx.menuId,
      tag: "ul",
      role: "menu",
      class: vue.normalizeClass(_ctx.ns.b()),
      "wrap-class": _ctx.ns.e("wrap"),
      "view-class": [_ctx.ns.e("list"), _ctx.ns.is("empty", _ctx.isEmpty)],
      onMousemove: _ctx.handleMouseMove,
      onMouseleave: _ctx.clearHoverZone
    }, {
      default: vue.withCtx(() => {
        var _a;
        return [
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.nodes, (node) => {
            return vue.openBlock(), vue.createBlock(_component_el_cascader_node, {
              key: node.uid,
              node,
              "menu-id": _ctx.menuId,
              onExpand: _ctx.handleExpand
            }, null, 8, ["node", "menu-id", "onExpand"]);
          }), 128)),
          _ctx.isLoading ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 0,
            class: vue.normalizeClass(_ctx.ns.e("empty-text"))
          }, [
            vue.createVNode(_component_el_icon, {
              size: "14",
              class: vue.normalizeClass(_ctx.ns.is("loading"))
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_loading)
              ]),
              _: 1
            }, 8, ["class"]),
            vue.createTextVNode(" " + vue.toDisplayString(_ctx.t("el.cascader.loading")), 1)
          ], 2)) : _ctx.isEmpty ? (vue.openBlock(), vue.createElementBlock("div", {
            key: 1,
            class: vue.normalizeClass(_ctx.ns.e("empty-text"))
          }, vue.toDisplayString(_ctx.t("el.cascader.noData")), 3)) : ((_a = _ctx.panel) == null ? void 0 : _a.isHoverMenu) ? (vue.openBlock(), vue.createElementBlock("svg", {
            key: 2,
            ref: "hoverZone",
            class: vue.normalizeClass(_ctx.ns.e("hover-zone"))
          }, null, 2)) : vue.createCommentVNode("v-if", true)
        ];
      }),
      _: 1
    }, 8, ["class", "wrap-class", "view-class", "onMousemove", "onMouseleave"]);
  }
  var ElCascaderMenu = /* @__PURE__ */ _export_sfc(_sfc_main$1G, [["render", _sfc_render$t], ["__file", "menu.vue"]]);

  let uid = 0;
  const calculatePathNodes = (node) => {
    const nodes = [node];
    let { parent } = node;
    while (parent) {
      nodes.unshift(parent);
      parent = parent.parent;
    }
    return nodes;
  };
  class Node$2 {
    constructor(data, config, parent, root = false) {
      this.data = data;
      this.config = config;
      this.parent = parent;
      this.root = root;
      this.uid = uid++;
      this.checked = false;
      this.indeterminate = false;
      this.loading = false;
      const { value: valueKey, label: labelKey, children: childrenKey } = config;
      const childrenData = data[childrenKey];
      const pathNodes = calculatePathNodes(this);
      this.level = root ? 0 : parent ? parent.level + 1 : 1;
      this.value = data[valueKey];
      this.label = data[labelKey];
      this.pathNodes = pathNodes;
      this.pathValues = pathNodes.map((node) => node.value);
      this.pathLabels = pathNodes.map((node) => node.label);
      this.childrenData = childrenData;
      this.children = (childrenData || []).map((child) => new Node$2(child, config, this));
      this.loaded = !config.lazy || this.isLeaf || !isEmpty(childrenData);
    }
    get isDisabled() {
      const { data, parent, config } = this;
      const { disabled, checkStrictly } = config;
      const isDisabled = isFunction$1(disabled) ? disabled(data, this) : !!data[disabled];
      return isDisabled || !checkStrictly && (parent == null ? void 0 : parent.isDisabled);
    }
    get isLeaf() {
      const { data, config, childrenData, loaded } = this;
      const { lazy, leaf } = config;
      const isLeaf = isFunction$1(leaf) ? leaf(data, this) : data[leaf];
      return isUndefined(isLeaf) ? lazy && !loaded ? false : !(Array.isArray(childrenData) && childrenData.length) : !!isLeaf;
    }
    get valueByOption() {
      return this.config.emitPath ? this.pathValues : this.value;
    }
    appendChild(childData) {
      const { childrenData, children } = this;
      const node = new Node$2(childData, this.config, this);
      if (Array.isArray(childrenData)) {
        childrenData.push(childData);
      } else {
        this.childrenData = [childData];
      }
      children.push(node);
      return node;
    }
    calcText(allLevels, separator) {
      const text = allLevels ? this.pathLabels.join(separator) : this.label;
      this.text = text;
      return text;
    }
    broadcast(event, ...args) {
      const handlerName = `onParent${capitalize(event)}`;
      this.children.forEach((child) => {
        if (child) {
          child.broadcast(event, ...args);
          child[handlerName] && child[handlerName](...args);
        }
      });
    }
    emit(event, ...args) {
      const { parent } = this;
      const handlerName = `onChild${capitalize(event)}`;
      if (parent) {
        parent[handlerName] && parent[handlerName](...args);
        parent.emit(event, ...args);
      }
    }
    onParentCheck(checked) {
      if (!this.isDisabled) {
        this.setCheckState(checked);
      }
    }
    onChildCheck() {
      const { children } = this;
      const validChildren = children.filter((child) => !child.isDisabled);
      const checked = validChildren.length ? validChildren.every((child) => child.checked) : false;
      this.setCheckState(checked);
    }
    setCheckState(checked) {
      const totalNum = this.children.length;
      const checkedNum = this.children.reduce((c, p) => {
        const num = p.checked ? 1 : p.indeterminate ? 0.5 : 0;
        return c + num;
      }, 0);
      this.checked = this.loaded && this.children.filter((child) => !child.isDisabled).every((child) => child.loaded && child.checked) && checked;
      this.indeterminate = this.loaded && checkedNum !== totalNum && checkedNum > 0;
    }
    doCheck(checked) {
      if (this.checked === checked)
        return;
      const { checkStrictly, multiple } = this.config;
      if (checkStrictly || !multiple) {
        this.checked = checked;
      } else {
        this.broadcast("check", checked);
        this.setCheckState(checked);
        this.emit("check");
      }
    }
  }
  var Node$3 = Node$2;

  const flatNodes = (nodes, leafOnly) => {
    return nodes.reduce((res, node) => {
      if (node.isLeaf) {
        res.push(node);
      } else {
        !leafOnly && res.push(node);
        res = res.concat(flatNodes(node.children, leafOnly));
      }
      return res;
    }, []);
  };
  class Store {
    constructor(data, config) {
      this.config = config;
      const nodes = (data || []).map((nodeData) => new Node$3(nodeData, this.config));
      this.nodes = nodes;
      this.allNodes = flatNodes(nodes, false);
      this.leafNodes = flatNodes(nodes, true);
    }
    getNodes() {
      return this.nodes;
    }
    getFlattedNodes(leafOnly) {
      return leafOnly ? this.leafNodes : this.allNodes;
    }
    appendNode(nodeData, parentNode) {
      const node = parentNode ? parentNode.appendChild(nodeData) : new Node$3(nodeData, this.config);
      if (!parentNode)
        this.nodes.push(node);
      this.allNodes.push(node);
      node.isLeaf && this.leafNodes.push(node);
    }
    appendNodes(nodeDataList, parentNode) {
      nodeDataList.forEach((nodeData) => this.appendNode(nodeData, parentNode));
    }
    getNodeByValue(value, leafOnly = false) {
      if (!value && value !== 0)
        return null;
      const node = this.getFlattedNodes(leafOnly).find((node2) => isEqual$1(node2.value, value) || isEqual$1(node2.pathValues, value));
      return node || null;
    }
    getSameNode(node) {
      if (!node)
        return null;
      const node_ = this.getFlattedNodes(false).find(({ value, level }) => isEqual$1(node.value, value) && node.level === level);
      return node_ || null;
    }
  }

  const CommonProps = buildProps({
    modelValue: {
      type: definePropType([Number, String, Array])
    },
    options: {
      type: definePropType(Array),
      default: () => []
    },
    props: {
      type: definePropType(Object),
      default: () => ({})
    }
  });
  const DefaultProps = {
    expandTrigger: "click",
    multiple: false,
    checkStrictly: false,
    emitPath: true,
    lazy: false,
    lazyLoad: NOOP,
    value: "value",
    label: "label",
    children: "children",
    leaf: "leaf",
    disabled: "disabled",
    hoverThreshold: 500
  };
  const useCascaderConfig = (props) => {
    return vue.computed(() => ({
      ...DefaultProps,
      ...props.props
    }));
  };

  const getMenuIndex = (el) => {
    if (!el)
      return 0;
    const pieces = el.id.split("-");
    return Number(pieces[pieces.length - 2]);
  };
  const checkNode = (el) => {
    if (!el)
      return;
    const input = el.querySelector("input");
    if (input) {
      input.click();
    } else if (isLeaf(el)) {
      el.click();
    }
  };
  const sortByOriginalOrder = (oldNodes, newNodes) => {
    const newNodesCopy = newNodes.slice(0);
    const newIds = newNodesCopy.map((node) => node.uid);
    const res = oldNodes.reduce((acc, item) => {
      const index = newIds.indexOf(item.uid);
      if (index > -1) {
        acc.push(item);
        newNodesCopy.splice(index, 1);
        newIds.splice(index, 1);
      }
      return acc;
    }, []);
    res.push(...newNodesCopy);
    return res;
  };

  const _sfc_main$1F = vue.defineComponent({
    name: "ElCascaderPanel",
    components: {
      ElCascaderMenu
    },
    props: {
      ...CommonProps,
      border: {
        type: Boolean,
        default: true
      },
      renderLabel: Function
    },
    emits: [UPDATE_MODEL_EVENT, CHANGE_EVENT, "close", "expand-change"],
    setup(props, { emit, slots }) {
      let manualChecked = false;
      const ns = useNamespace("cascader");
      const config = useCascaderConfig(props);
      let store = null;
      const initialLoaded = vue.ref(true);
      const menuList = vue.ref([]);
      const checkedValue = vue.ref(null);
      const menus = vue.ref([]);
      const expandingNode = vue.ref(null);
      const checkedNodes = vue.ref([]);
      const isHoverMenu = vue.computed(() => config.value.expandTrigger === "hover");
      const renderLabelFn = vue.computed(() => props.renderLabel || slots.default);
      const initStore = () => {
        const { options } = props;
        const cfg = config.value;
        manualChecked = false;
        store = new Store(options, cfg);
        menus.value = [store.getNodes()];
        if (cfg.lazy && isEmpty(props.options)) {
          initialLoaded.value = false;
          lazyLoad(void 0, (list) => {
            if (list) {
              store = new Store(list, cfg);
              menus.value = [store.getNodes()];
            }
            initialLoaded.value = true;
            syncCheckedValue(false, true);
          });
        } else {
          syncCheckedValue(false, true);
        }
      };
      const lazyLoad = (node, cb) => {
        const cfg = config.value;
        node = node || new Node$3({}, cfg, void 0, true);
        node.loading = true;
        const resolve = (dataList) => {
          const _node = node;
          const parent = _node.root ? null : _node;
          dataList && (store == null ? void 0 : store.appendNodes(dataList, parent));
          _node.loading = false;
          _node.loaded = true;
          _node.childrenData = _node.childrenData || [];
          cb && cb(dataList);
        };
        cfg.lazyLoad(node, resolve);
      };
      const expandNode = (node, silent) => {
        var _a;
        const { level } = node;
        const newMenus = menus.value.slice(0, level);
        let newExpandingNode;
        if (node.isLeaf) {
          newExpandingNode = node.pathNodes[level - 2];
        } else {
          newExpandingNode = node;
          newMenus.push(node.children);
        }
        if (((_a = expandingNode.value) == null ? void 0 : _a.uid) !== (newExpandingNode == null ? void 0 : newExpandingNode.uid)) {
          expandingNode.value = node;
          menus.value = newMenus;
          !silent && emit("expand-change", (node == null ? void 0 : node.pathValues) || []);
        }
      };
      const handleCheckChange = (node, checked, emitClose = true) => {
        const { checkStrictly, multiple } = config.value;
        const oldNode = checkedNodes.value[0];
        manualChecked = true;
        !multiple && (oldNode == null ? void 0 : oldNode.doCheck(false));
        node.doCheck(checked);
        calculateCheckedValue();
        emitClose && !multiple && !checkStrictly && emit("close");
        !emitClose && !multiple && !checkStrictly && expandParentNode(node);
      };
      const expandParentNode = (node) => {
        if (!node)
          return;
        node = node.parent;
        expandParentNode(node);
        node && expandNode(node);
      };
      const getFlattedNodes = (leafOnly) => {
        return store == null ? void 0 : store.getFlattedNodes(leafOnly);
      };
      const getCheckedNodes = (leafOnly) => {
        var _a;
        return (_a = getFlattedNodes(leafOnly)) == null ? void 0 : _a.filter((node) => node.checked !== false);
      };
      const clearCheckedNodes = () => {
        checkedNodes.value.forEach((node) => node.doCheck(false));
        calculateCheckedValue();
        menus.value = menus.value.slice(0, 1);
        expandingNode.value = null;
        emit("expand-change", []);
      };
      const calculateCheckedValue = () => {
        var _a;
        const { checkStrictly, multiple } = config.value;
        const oldNodes = checkedNodes.value;
        const newNodes = getCheckedNodes(!checkStrictly);
        const nodes = sortByOriginalOrder(oldNodes, newNodes);
        const values = nodes.map((node) => node.valueByOption);
        checkedNodes.value = nodes;
        checkedValue.value = multiple ? values : (_a = values[0]) != null ? _a : null;
      };
      const syncCheckedValue = (loaded = false, forced = false) => {
        const { modelValue } = props;
        const { lazy, multiple, checkStrictly } = config.value;
        const leafOnly = !checkStrictly;
        if (!initialLoaded.value || manualChecked || !forced && isEqual$1(modelValue, checkedValue.value))
          return;
        if (lazy && !loaded) {
          const values = unique(flattenDeep(castArray(modelValue)));
          const nodes = values.map((val) => store == null ? void 0 : store.getNodeByValue(val)).filter((node) => !!node && !node.loaded && !node.loading);
          if (nodes.length) {
            nodes.forEach((node) => {
              lazyLoad(node, () => syncCheckedValue(false, forced));
            });
          } else {
            syncCheckedValue(true, forced);
          }
        } else {
          const values = multiple ? castArray(modelValue) : [modelValue];
          const nodes = unique(values.map((val) => store == null ? void 0 : store.getNodeByValue(val, leafOnly)));
          syncMenuState(nodes, forced);
          checkedValue.value = cloneDeep(modelValue);
        }
      };
      const syncMenuState = (newCheckedNodes, reserveExpandingState = true) => {
        const { checkStrictly } = config.value;
        const oldNodes = checkedNodes.value;
        const newNodes = newCheckedNodes.filter((node) => !!node && (checkStrictly || node.isLeaf));
        const oldExpandingNode = store == null ? void 0 : store.getSameNode(expandingNode.value);
        const newExpandingNode = reserveExpandingState && oldExpandingNode || newNodes[0];
        if (newExpandingNode) {
          newExpandingNode.pathNodes.forEach((node) => expandNode(node, true));
        } else {
          expandingNode.value = null;
        }
        oldNodes.forEach((node) => node.doCheck(false));
        if (props.props.multiple) {
          vue.reactive(newNodes).forEach((node) => node.doCheck(true));
        } else {
          newNodes.forEach((node) => node.doCheck(true));
        }
        checkedNodes.value = newNodes;
        vue.nextTick(scrollToExpandingNode);
      };
      const scrollToExpandingNode = () => {
        if (!isClient)
          return;
        menuList.value.forEach((menu) => {
          const menuElement = menu == null ? void 0 : menu.$el;
          if (menuElement) {
            const container = menuElement.querySelector(`.${ns.namespace.value}-scrollbar__wrap`);
            const activeNode = menuElement.querySelector(`.${ns.b("node")}.${ns.is("active")}`) || menuElement.querySelector(`.${ns.b("node")}.in-active-path`);
            scrollIntoView(container, activeNode);
          }
        });
      };
      const handleKeyDown = (e) => {
        const target = e.target;
        const { code } = e;
        switch (code) {
          case EVENT_CODE.up:
          case EVENT_CODE.down: {
            e.preventDefault();
            const distance = code === EVENT_CODE.up ? -1 : 1;
            focusNode(getSibling(target, distance, `.${ns.b("node")}[tabindex="-1"]`));
            break;
          }
          case EVENT_CODE.left: {
            e.preventDefault();
            const preMenu = menuList.value[getMenuIndex(target) - 1];
            const expandedNode = preMenu == null ? void 0 : preMenu.$el.querySelector(`.${ns.b("node")}[aria-expanded="true"]`);
            focusNode(expandedNode);
            break;
          }
          case EVENT_CODE.right: {
            e.preventDefault();
            const nextMenu = menuList.value[getMenuIndex(target) + 1];
            const firstNode = nextMenu == null ? void 0 : nextMenu.$el.querySelector(`.${ns.b("node")}[tabindex="-1"]`);
            focusNode(firstNode);
            break;
          }
          case EVENT_CODE.enter:
            checkNode(target);
            break;
        }
      };
      vue.provide(CASCADER_PANEL_INJECTION_KEY, vue.reactive({
        config,
        expandingNode,
        checkedNodes,
        isHoverMenu,
        initialLoaded,
        renderLabelFn,
        lazyLoad,
        expandNode,
        handleCheckChange
      }));
      vue.watch([config, () => props.options], initStore, {
        deep: true,
        immediate: true
      });
      vue.watch(() => props.modelValue, () => {
        manualChecked = false;
        syncCheckedValue();
      }, {
        deep: true
      });
      vue.watch(() => checkedValue.value, (val) => {
        if (!isEqual$1(val, props.modelValue)) {
          emit(UPDATE_MODEL_EVENT, val);
          emit(CHANGE_EVENT, val);
        }
      });
      vue.onBeforeUpdate(() => menuList.value = []);
      vue.onMounted(() => !isEmpty(props.modelValue) && syncCheckedValue());
      return {
        ns,
        menuList,
        menus,
        checkedNodes,
        handleKeyDown,
        handleCheckChange,
        getFlattedNodes,
        getCheckedNodes,
        clearCheckedNodes,
        calculateCheckedValue,
        scrollToExpandingNode
      };
    }
  });
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_el_cascader_menu = vue.resolveComponent("el-cascader-menu");
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass([_ctx.ns.b("panel"), _ctx.ns.is("bordered", _ctx.border)]),
      onKeydown: _cache[0] || (_cache[0] = (...args) => _ctx.handleKeyDown && _ctx.handleKeyDown(...args))
    }, [
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.menus, (menu, index) => {
        return vue.openBlock(), vue.createBlock(_component_el_cascader_menu, {
          key: index,
          ref_for: true,
          ref: (item) => _ctx.menuList[index] = item,
          index,
          nodes: [...menu]
        }, null, 8, ["index", "nodes"]);
      }), 128))
    ], 34);
  }
  var CascaderPanel = /* @__PURE__ */ _export_sfc(_sfc_main$1F, [["render", _sfc_render$s], ["__file", "index.vue"]]);

  CascaderPanel.install = (app) => {
    app.component(CascaderPanel.name, CascaderPanel);
  };
  const _CascaderPanel = CascaderPanel;
  const ElCascaderPanel = _CascaderPanel;

  const tagProps = buildProps({
    type: {
      type: String,
      values: ["success", "info", "warning", "danger", ""],
      default: ""
    },
    closable: Boolean,
    disableTransitions: Boolean,
    hit: Boolean,
    color: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      values: componentSizes,
      default: ""
    },
    effect: {
      type: String,
      values: ["dark", "light", "plain"],
      default: "light"
    },
    round: Boolean
  });
  const tagEmits = {
    close: (evt) => evt instanceof MouseEvent,
    click: (evt) => evt instanceof MouseEvent
  };

  const __default__$15 = vue.defineComponent({
    name: "ElTag"
  });
  const _sfc_main$1E = /* @__PURE__ */ vue.defineComponent({
    ...__default__$15,
    props: tagProps,
    emits: tagEmits,
    setup(__props, { emit }) {
      const props = __props;
      const tagSize = useFormSize();
      const ns = useNamespace("tag");
      const containerKls = vue.computed(() => {
        const { type, hit, effect, closable, round } = props;
        return [
          ns.b(),
          ns.is("closable", closable),
          ns.m(type),
          ns.m(tagSize.value),
          ns.m(effect),
          ns.is("hit", hit),
          ns.is("round", round)
        ];
      });
      const handleClose = (event) => {
        emit("close", event);
      };
      const handleClick = (event) => {
        emit("click", event);
      };
      return (_ctx, _cache) => {
        return _ctx.disableTransitions ? (vue.openBlock(), vue.createElementBlock("span", {
          key: 0,
          class: vue.normalizeClass(vue.unref(containerKls)),
          style: vue.normalizeStyle({ backgroundColor: _ctx.color }),
          onClick: handleClick
        }, [
          vue.createElementVNode("span", {
            class: vue.normalizeClass(vue.unref(ns).e("content"))
          }, [
            vue.renderSlot(_ctx.$slots, "default")
          ], 2),
          _ctx.closable ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
            key: 0,
            class: vue.normalizeClass(vue.unref(ns).e("close")),
            onClick: vue.withModifiers(handleClose, ["stop"])
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(vue.unref(close_default))
            ]),
            _: 1
          }, 8, ["class", "onClick"])) : vue.createCommentVNode("v-if", true)
        ], 6)) : (vue.openBlock(), vue.createBlock(vue.Transition, {
          key: 1,
          name: `${vue.unref(ns).namespace.value}-zoom-in-center`,
          appear: ""
        }, {
          default: vue.withCtx(() => [
            vue.createElementVNode("span", {
              class: vue.normalizeClass(vue.unref(containerKls)),
              style: vue.normalizeStyle({ backgroundColor: _ctx.color }),
              onClick: handleClick
            }, [
              vue.createElementVNode("span", {
                class: vue.normalizeClass(vue.unref(ns).e("content"))
              }, [
                vue.renderSlot(_ctx.$slots, "default")
              ], 2),
              _ctx.closable ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                key: 0,
                class: vue.normalizeClass(vue.unref(ns).e("close")),
                onClick: vue.withModifiers(handleClose, ["stop"])
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(vue.unref(close_default))
                ]),
                _: 1
              }, 8, ["class", "onClick"])) : vue.createCommentVNode("v-if", true)
            ], 6)
          ]),
          _: 3
        }, 8, ["name"]));
      };
    }
  });
  var Tag = /* @__PURE__ */ _export_sfc(_sfc_main$1E, [["__file", "tag.vue"]]);

  const ElTag = withInstall(Tag);

  const cascaderProps = buildProps({
    ...CommonProps,
    size: useSizeProp,
    placeholder: String,
    disabled: Boolean,
    clearable: Boolean,
    filterable: Boolean,
    filterMethod: {
      type: definePropType(Function),
      default: (node, keyword) => node.text.includes(keyword)
    },
    separator: {
      type: String,
      default: " / "
    },
    showAllLevels: {
      type: Boolean,
      default: true
    },
    collapseTags: Boolean,
    maxCollapseTags: {
      type: Number,
      default: 1
    },
    collapseTagsTooltip: {
      type: Boolean,
      default: false
    },
    debounce: {
      type: Number,
      default: 300
    },
    beforeFilter: {
      type: definePropType(Function),
      default: () => true
    },
    popperClass: {
      type: String,
      default: ""
    },
    teleported: useTooltipContentProps.teleported,
    tagType: { ...tagProps.type, default: "info" },
    validateEvent: {
      type: Boolean,
      default: true
    }
  });
  const cascaderEmits = {
    [UPDATE_MODEL_EVENT]: (val) => !!val || val === null,
    [CHANGE_EVENT]: (val) => !!val || val === null,
    focus: (evt) => evt instanceof FocusEvent,
    blur: (evt) => evt instanceof FocusEvent,
    visibleChange: (val) => isBoolean(val),
    expandChange: (val) => !!val,
    removeTag: (val) => !!val
  };

  const _hoisted_1$O = { key: 0 };
  const _hoisted_2$x = ["placeholder", "onKeydown"];
  const _hoisted_3$i = ["onClick"];
  const COMPONENT_NAME$e = "ElCascader";
  const __default__$14 = vue.defineComponent({
    name: COMPONENT_NAME$e
  });
  const _sfc_main$1D = /* @__PURE__ */ vue.defineComponent({
    ...__default__$14,
    props: cascaderProps,
    emits: cascaderEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const popperOptions = {
        modifiers: [
          {
            name: "arrowPosition",
            enabled: true,
            phase: "main",
            fn: ({ state }) => {
              const { modifiersData, placement } = state;
              if (["right", "left", "bottom", "top"].includes(placement))
                return;
              modifiersData.arrow.x = 35;
            },
            requires: ["arrow"]
          }
        ]
      };
      const attrs = vue.useAttrs();
      let inputInitialHeight = 0;
      let pressDeleteCount = 0;
      const nsCascader = useNamespace("cascader");
      const nsInput = useNamespace("input");
      const { t } = useLocale();
      const { form, formItem } = useFormItem();
      const tooltipRef = vue.ref(null);
      const input = vue.ref(null);
      const tagWrapper = vue.ref(null);
      const cascaderPanelRef = vue.ref(null);
      const suggestionPanel = vue.ref(null);
      const popperVisible = vue.ref(false);
      const inputHover = vue.ref(false);
      const filtering = vue.ref(false);
      const filterFocus = vue.ref(false);
      const inputValue = vue.ref("");
      const searchInputValue = vue.ref("");
      const presentTags = vue.ref([]);
      const allPresentTags = vue.ref([]);
      const suggestions = vue.ref([]);
      const isOnComposition = vue.ref(false);
      const cascaderStyle = vue.computed(() => {
        return attrs.style;
      });
      const isDisabled = vue.computed(() => props.disabled || (form == null ? void 0 : form.disabled));
      const inputPlaceholder = vue.computed(() => props.placeholder || t("el.cascader.placeholder"));
      const currentPlaceholder = vue.computed(() => searchInputValue.value || presentTags.value.length > 0 || isOnComposition.value ? "" : inputPlaceholder.value);
      const realSize = useFormSize();
      const tagSize = vue.computed(() => ["small"].includes(realSize.value) ? "small" : "default");
      const multiple = vue.computed(() => !!props.props.multiple);
      const readonly = vue.computed(() => !props.filterable || multiple.value);
      const searchKeyword = vue.computed(() => multiple.value ? searchInputValue.value : inputValue.value);
      const checkedNodes = vue.computed(() => {
        var _a;
        return ((_a = cascaderPanelRef.value) == null ? void 0 : _a.checkedNodes) || [];
      });
      const clearBtnVisible = vue.computed(() => {
        if (!props.clearable || isDisabled.value || filtering.value || !inputHover.value)
          return false;
        return !!checkedNodes.value.length;
      });
      const presentText = vue.computed(() => {
        const { showAllLevels, separator } = props;
        const nodes = checkedNodes.value;
        return nodes.length ? multiple.value ? "" : nodes[0].calcText(showAllLevels, separator) : "";
      });
      const checkedValue = vue.computed({
        get() {
          return cloneDeep(props.modelValue);
        },
        set(val) {
          emit(UPDATE_MODEL_EVENT, val);
          emit(CHANGE_EVENT, val);
          if (props.validateEvent) {
            formItem == null ? void 0 : formItem.validate("change").catch((err) => debugWarn());
          }
        }
      });
      const cascaderKls = vue.computed(() => {
        return [
          nsCascader.b(),
          nsCascader.m(realSize.value),
          nsCascader.is("disabled", isDisabled.value),
          attrs.class
        ];
      });
      const cascaderIconKls = vue.computed(() => {
        return [
          nsInput.e("icon"),
          "icon-arrow-down",
          nsCascader.is("reverse", popperVisible.value)
        ];
      });
      const inputClass = vue.computed(() => {
        return nsCascader.is("focus", popperVisible.value || filterFocus.value);
      });
      const contentRef = vue.computed(() => {
        var _a, _b;
        return (_b = (_a = tooltipRef.value) == null ? void 0 : _a.popperRef) == null ? void 0 : _b.contentRef;
      });
      const togglePopperVisible = (visible) => {
        var _a, _b, _c;
        if (isDisabled.value)
          return;
        visible = visible != null ? visible : !popperVisible.value;
        if (visible !== popperVisible.value) {
          popperVisible.value = visible;
          (_b = (_a = input.value) == null ? void 0 : _a.input) == null ? void 0 : _b.setAttribute("aria-expanded", `${visible}`);
          if (visible) {
            updatePopperPosition();
            vue.nextTick((_c = cascaderPanelRef.value) == null ? void 0 : _c.scrollToExpandingNode);
          } else if (props.filterable) {
            syncPresentTextValue();
          }
          emit("visibleChange", visible);
        }
      };
      const updatePopperPosition = () => {
        vue.nextTick(() => {
          var _a;
          (_a = tooltipRef.value) == null ? void 0 : _a.updatePopper();
        });
      };
      const hideSuggestionPanel = () => {
        filtering.value = false;
      };
      const genTag = (node) => {
        const { showAllLevels, separator } = props;
        return {
          node,
          key: node.uid,
          text: node.calcText(showAllLevels, separator),
          hitState: false,
          closable: !isDisabled.value && !node.isDisabled,
          isCollapseTag: false
        };
      };
      const deleteTag = (tag) => {
        var _a;
        const node = tag.node;
        node.doCheck(false);
        (_a = cascaderPanelRef.value) == null ? void 0 : _a.calculateCheckedValue();
        emit("removeTag", node.valueByOption);
      };
      const calculatePresentTags = () => {
        if (!multiple.value)
          return;
        const nodes = checkedNodes.value;
        const tags = [];
        const allTags = [];
        nodes.forEach((node) => allTags.push(genTag(node)));
        allPresentTags.value = allTags;
        if (nodes.length) {
          nodes.slice(0, props.maxCollapseTags).forEach((node) => tags.push(genTag(node)));
          const rest = nodes.slice(props.maxCollapseTags);
          const restCount = rest.length;
          if (restCount) {
            if (props.collapseTags) {
              tags.push({
                key: -1,
                text: `+ ${restCount}`,
                closable: false,
                isCollapseTag: true
              });
            } else {
              rest.forEach((node) => tags.push(genTag(node)));
            }
          }
        }
        presentTags.value = tags;
      };
      const calculateSuggestions = () => {
        var _a, _b;
        const { filterMethod, showAllLevels, separator } = props;
        const res = (_b = (_a = cascaderPanelRef.value) == null ? void 0 : _a.getFlattedNodes(!props.props.checkStrictly)) == null ? void 0 : _b.filter((node) => {
          if (node.isDisabled)
            return false;
          node.calcText(showAllLevels, separator);
          return filterMethod(node, searchKeyword.value);
        });
        if (multiple.value) {
          presentTags.value.forEach((tag) => {
            tag.hitState = false;
          });
          allPresentTags.value.forEach((tag) => {
            tag.hitState = false;
          });
        }
        filtering.value = true;
        suggestions.value = res;
        updatePopperPosition();
      };
      const focusFirstNode = () => {
        var _a;
        let firstNode;
        if (filtering.value && suggestionPanel.value) {
          firstNode = suggestionPanel.value.$el.querySelector(`.${nsCascader.e("suggestion-item")}`);
        } else {
          firstNode = (_a = cascaderPanelRef.value) == null ? void 0 : _a.$el.querySelector(`.${nsCascader.b("node")}[tabindex="-1"]`);
        }
        if (firstNode) {
          firstNode.focus();
          !filtering.value && firstNode.click();
        }
      };
      const updateStyle = () => {
        var _a, _b;
        const inputInner = (_a = input.value) == null ? void 0 : _a.input;
        const tagWrapperEl = tagWrapper.value;
        const suggestionPanelEl = (_b = suggestionPanel.value) == null ? void 0 : _b.$el;
        if (!isClient || !inputInner)
          return;
        if (suggestionPanelEl) {
          const suggestionList = suggestionPanelEl.querySelector(`.${nsCascader.e("suggestion-list")}`);
          suggestionList.style.minWidth = `${inputInner.offsetWidth}px`;
        }
        if (tagWrapperEl) {
          const { offsetHeight } = tagWrapperEl;
          const height = presentTags.value.length > 0 ? `${Math.max(offsetHeight + 6, inputInitialHeight)}px` : `${inputInitialHeight}px`;
          inputInner.style.height = height;
          updatePopperPosition();
        }
      };
      const getCheckedNodes = (leafOnly) => {
        var _a;
        return (_a = cascaderPanelRef.value) == null ? void 0 : _a.getCheckedNodes(leafOnly);
      };
      const handleExpandChange = (value) => {
        updatePopperPosition();
        emit("expandChange", value);
      };
      const handleComposition = (event) => {
        var _a;
        const text = (_a = event.target) == null ? void 0 : _a.value;
        if (event.type === "compositionend") {
          isOnComposition.value = false;
          vue.nextTick(() => handleInput(text));
        } else {
          const lastCharacter = text[text.length - 1] || "";
          isOnComposition.value = !isKorean(lastCharacter);
        }
      };
      const handleKeyDown = (e) => {
        if (isOnComposition.value)
          return;
        switch (e.code) {
          case EVENT_CODE.enter:
            togglePopperVisible();
            break;
          case EVENT_CODE.down:
            togglePopperVisible(true);
            vue.nextTick(focusFirstNode);
            e.preventDefault();
            break;
          case EVENT_CODE.esc:
            if (popperVisible.value === true) {
              e.preventDefault();
              e.stopPropagation();
              togglePopperVisible(false);
            }
            break;
          case EVENT_CODE.tab:
            togglePopperVisible(false);
            break;
        }
      };
      const handleClear = () => {
        var _a;
        (_a = cascaderPanelRef.value) == null ? void 0 : _a.clearCheckedNodes();
        if (!popperVisible.value && props.filterable) {
          syncPresentTextValue();
        }
        togglePopperVisible(false);
      };
      const syncPresentTextValue = () => {
        const { value } = presentText;
        inputValue.value = value;
        searchInputValue.value = value;
      };
      const handleSuggestionClick = (node) => {
        var _a, _b;
        const { checked } = node;
        if (multiple.value) {
          (_a = cascaderPanelRef.value) == null ? void 0 : _a.handleCheckChange(node, !checked, false);
        } else {
          !checked && ((_b = cascaderPanelRef.value) == null ? void 0 : _b.handleCheckChange(node, true, false));
          togglePopperVisible(false);
        }
      };
      const handleSuggestionKeyDown = (e) => {
        const target = e.target;
        const { code } = e;
        switch (code) {
          case EVENT_CODE.up:
          case EVENT_CODE.down: {
            const distance = code === EVENT_CODE.up ? -1 : 1;
            focusNode(getSibling(target, distance, `.${nsCascader.e("suggestion-item")}[tabindex="-1"]`));
            break;
          }
          case EVENT_CODE.enter:
            target.click();
            break;
        }
      };
      const handleDelete = () => {
        const tags = presentTags.value;
        const lastTag = tags[tags.length - 1];
        pressDeleteCount = searchInputValue.value ? 0 : pressDeleteCount + 1;
        if (!lastTag || !pressDeleteCount || props.collapseTags && tags.length > 1)
          return;
        if (lastTag.hitState) {
          deleteTag(lastTag);
        } else {
          lastTag.hitState = true;
        }
      };
      const handleFocus = (e) => {
        const el = e.target;
        const name = nsCascader.e("search-input");
        if (el.className === name) {
          filterFocus.value = true;
        }
        emit("focus", e);
      };
      const handleBlur = (e) => {
        filterFocus.value = false;
        emit("blur", e);
      };
      const handleFilter = debounce(() => {
        const { value } = searchKeyword;
        if (!value)
          return;
        const passed = props.beforeFilter(value);
        if (isPromise(passed)) {
          passed.then(calculateSuggestions).catch(() => {
          });
        } else if (passed !== false) {
          calculateSuggestions();
        } else {
          hideSuggestionPanel();
        }
      }, props.debounce);
      const handleInput = (val, e) => {
        !popperVisible.value && togglePopperVisible(true);
        if (e == null ? void 0 : e.isComposing)
          return;
        val ? handleFilter() : hideSuggestionPanel();
      };
      const getInputInnerHeight = (inputInner) => Number.parseFloat(useCssVar(nsInput.cssVarName("input-height"), inputInner).value) - 2;
      vue.watch(filtering, updatePopperPosition);
      vue.watch([checkedNodes, isDisabled], calculatePresentTags);
      vue.watch(presentTags, () => {
        vue.nextTick(() => updateStyle());
      });
      vue.watch(realSize, async () => {
        await vue.nextTick();
        const inputInner = input.value.input;
        inputInitialHeight = getInputInnerHeight(inputInner) || inputInitialHeight;
        updateStyle();
      });
      vue.watch(presentText, syncPresentTextValue, { immediate: true });
      vue.onMounted(() => {
        const inputInner = input.value.input;
        const inputInnerHeight = getInputInnerHeight(inputInner);
        inputInitialHeight = inputInner.offsetHeight || inputInnerHeight;
        useResizeObserver(inputInner, updateStyle);
      });
      expose({
        getCheckedNodes,
        cascaderPanelRef,
        togglePopperVisible,
        contentRef
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.unref(ElTooltip), {
          ref_key: "tooltipRef",
          ref: tooltipRef,
          visible: popperVisible.value,
          teleported: _ctx.teleported,
          "popper-class": [vue.unref(nsCascader).e("dropdown"), _ctx.popperClass],
          "popper-options": popperOptions,
          "fallback-placements": [
            "bottom-start",
            "bottom",
            "top-start",
            "top",
            "right",
            "left"
          ],
          "stop-popper-mouse-event": false,
          "gpu-acceleration": false,
          placement: "bottom-start",
          transition: `${vue.unref(nsCascader).namespace.value}-zoom-in-top`,
          effect: "light",
          pure: "",
          persistent: "",
          onHide: hideSuggestionPanel
        }, {
          default: vue.withCtx(() => [
            vue.withDirectives((vue.openBlock(), vue.createElementBlock("div", {
              class: vue.normalizeClass(vue.unref(cascaderKls)),
              style: vue.normalizeStyle(vue.unref(cascaderStyle)),
              onClick: _cache[5] || (_cache[5] = () => togglePopperVisible(vue.unref(readonly) ? void 0 : true)),
              onKeydown: handleKeyDown,
              onMouseenter: _cache[6] || (_cache[6] = ($event) => inputHover.value = true),
              onMouseleave: _cache[7] || (_cache[7] = ($event) => inputHover.value = false)
            }, [
              vue.createVNode(vue.unref(ElInput), {
                ref_key: "input",
                ref: input,
                modelValue: inputValue.value,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => inputValue.value = $event),
                placeholder: vue.unref(currentPlaceholder),
                readonly: vue.unref(readonly),
                disabled: vue.unref(isDisabled),
                "validate-event": false,
                size: vue.unref(realSize),
                class: vue.normalizeClass(vue.unref(inputClass)),
                tabindex: vue.unref(multiple) && _ctx.filterable && !vue.unref(isDisabled) ? -1 : void 0,
                onCompositionstart: handleComposition,
                onCompositionupdate: handleComposition,
                onCompositionend: handleComposition,
                onFocus: handleFocus,
                onBlur: handleBlur,
                onInput: handleInput
              }, {
                suffix: vue.withCtx(() => [
                  vue.unref(clearBtnVisible) ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: "clear",
                    class: vue.normalizeClass([vue.unref(nsInput).e("icon"), "icon-circle-close"]),
                    onClick: vue.withModifiers(handleClear, ["stop"])
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(circle_close_default))
                    ]),
                    _: 1
                  }, 8, ["class", "onClick"])) : (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), {
                    key: "arrow-down",
                    class: vue.normalizeClass(vue.unref(cascaderIconKls)),
                    onClick: _cache[0] || (_cache[0] = vue.withModifiers(($event) => togglePopperVisible(), ["stop"]))
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(vue.unref(arrow_down_default))
                    ]),
                    _: 1
                  }, 8, ["class"]))
                ]),
                _: 1
              }, 8, ["modelValue", "placeholder", "readonly", "disabled", "size", "class", "tabindex"]),
              vue.unref(multiple) ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                ref_key: "tagWrapper",
                ref: tagWrapper,
                class: vue.normalizeClass(vue.unref(nsCascader).e("tags"))
              }, [
                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(presentTags.value, (tag) => {
                  return vue.openBlock(), vue.createBlock(vue.unref(ElTag), {
                    key: tag.key,
                    type: _ctx.tagType,
                    size: vue.unref(tagSize),
                    hit: tag.hitState,
                    closable: tag.closable,
                    "disable-transitions": "",
                    onClose: ($event) => deleteTag(tag)
                  }, {
                    default: vue.withCtx(() => [
                      tag.isCollapseTag === false ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_1$O, vue.toDisplayString(tag.text), 1)) : (vue.openBlock(), vue.createBlock(vue.unref(ElTooltip), {
                        key: 1,
                        disabled: popperVisible.value || !_ctx.collapseTagsTooltip,
                        "fallback-placements": ["bottom", "top", "right", "left"],
                        placement: "bottom",
                        effect: "light"
                      }, {
                        default: vue.withCtx(() => [
                          vue.createElementVNode("span", null, vue.toDisplayString(tag.text), 1)
                        ]),
                        content: vue.withCtx(() => [
                          vue.createElementVNode("div", {
                            class: vue.normalizeClass(vue.unref(nsCascader).e("collapse-tags"))
                          }, [
                            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(allPresentTags.value.slice(_ctx.maxCollapseTags), (tag2, idx) => {
                              return vue.openBlock(), vue.createElementBlock("div", {
                                key: idx,
                                class: vue.normalizeClass(vue.unref(nsCascader).e("collapse-tag"))
                              }, [
                                (vue.openBlock(), vue.createBlock(vue.unref(ElTag), {
                                  key: tag2.key,
                                  class: "in-tooltip",
                                  type: _ctx.tagType,
                                  size: vue.unref(tagSize),
                                  hit: tag2.hitState,
                                  closable: tag2.closable,
                                  "disable-transitions": "",
                                  onClose: ($event) => deleteTag(tag2)
                                }, {
                                  default: vue.withCtx(() => [
                                    vue.createElementVNode("span", null, vue.toDisplayString(tag2.text), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["type", "size", "hit", "closable", "onClose"]))
                              ], 2);
                            }), 128))
                          ], 2)
                        ]),
                        _: 2
                      }, 1032, ["disabled"]))
                    ]),
                    _: 2
                  }, 1032, ["type", "size", "hit", "closable", "onClose"]);
                }), 128)),
                _ctx.filterable && !vue.unref(isDisabled) ? vue.withDirectives((vue.openBlock(), vue.createElementBlock("input", {
                  key: 0,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => searchInputValue.value = $event),
                  type: "text",
                  class: vue.normalizeClass(vue.unref(nsCascader).e("search-input")),
                  placeholder: vue.unref(presentText) ? "" : vue.unref(inputPlaceholder),
                  onInput: _cache[3] || (_cache[3] = (e) => handleInput(searchInputValue.value, e)),
                  onClick: _cache[4] || (_cache[4] = vue.withModifiers(($event) => togglePopperVisible(true), ["stop"])),
                  onKeydown: vue.withKeys(handleDelete, ["delete"]),
                  onCompositionstart: handleComposition,
                  onCompositionupdate: handleComposition,
                  onCompositionend: handleComposition,
                  onFocus: handleFocus,
                  onBlur: handleBlur
                }, null, 42, _hoisted_2$x)), [
                  [vue.vModelText, searchInputValue.value]
                ]) : vue.createCommentVNode("v-if", true)
              ], 2)) : vue.createCommentVNode("v-if", true)
            ], 38)), [
              [vue.unref(ClickOutside), () => togglePopperVisible(false), vue.unref(contentRef)]
            ])
          ]),
          content: vue.withCtx(() => [
            vue.withDirectives(vue.createVNode(vue.unref(_CascaderPanel), {
              ref_key: "cascaderPanelRef",
              ref: cascaderPanelRef,
              modelValue: vue.unref(checkedValue),
              "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => vue.isRef(checkedValue) ? checkedValue.value = $event : null),
              options: _ctx.options,
              props: props.props,
              border: false,
              "render-label": _ctx.$slots.default,
              onExpandChange: handleExpandChange,
              onClose: _cache[9] || (_cache[9] = ($event) => _ctx.$nextTick(() => togglePopperVisible(false)))
            }, null, 8, ["modelValue", "options", "props", "render-label"]), [
              [vue.vShow, !filtering.value]
            ]),
            _ctx.filterable ? vue.withDirectives((vue.openBlock(), vue.createBlock(vue.unref(ElScrollbar), {
              key: 0,
              ref_key: "suggestionPanel",
              ref: suggestionPanel,
              tag: "ul",
              class: vue.normalizeClass(vue.unref(nsCascader).e("suggestion-panel")),
              "view-class": vue.unref(nsCascader).e("suggestion-list"),
              onKeydown: handleSuggestionKeyDown
            }, {
              default: vue.withCtx(() => [
                suggestions.value.length ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(suggestions.value, (item) => {
                  return vue.openBlock(), vue.createElementBlock("li", {
                    key: item.uid,
                    class: vue.normalizeClass([
                      vue.unref(nsCascader).e("suggestion-item"),
                      vue.unref(nsCascader).is("checked", item.checked)
                    ]),
                    tabindex: -1,
                    onClick: ($event) => handleSuggestionClick(item)
                  }, [
                    vue.createElementVNode("span", null, vue.toDisplayString(item.text), 1),
                    item.checked ? (vue.openBlock(), vue.createBlock(vue.unref(ElIcon), { key: 0 }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(vue.unref(check_default))
                      ]),
                      _: 1
                    })) : vue.createCommentVNode("v-if", true)
                  ], 10, _hoisted_3$i);
                }), 128)) : vue.renderSlot(_ctx.$slots, "empty", { key: 1 }, () => [
                  vue.createElementVNode("li", {
                    class: vue.normalizeClass(vue.unref(nsCascader).e("empty-text"))
                  }, vue.toDisplayString(vue.unref(t)("el.cascader.noMatch")), 3)
                ])
              ]),
              _: 3
            }, 8, ["class", "view-class"])), [
              [vue.vShow, filtering.value]
            ]) : vue.createCommentVNode("v-if", true)
          ]),
          _: 3
        }, 8, ["visible", "teleported", "popper-class", "transition"]);
      };
    }
  });
  var Cascader = /* @__PURE__ */ _export_sfc(_sfc_main$1D, [["__file", "cascader.vue"]]);

  Cascader.install = (app) => {
    app.component(Cascader.name, Cascader);
  };
  const _Cascader = Cascader;
  const ElCascader = _Cascader;

  const checkTagProps = buildProps({
    checked: {
      type: Boolean,
      default: false
    }
  });
  const checkTagEmits = {
    "update:checked": (value) => isBoolean(value),
    [CHANGE_EVENT]: (value) => isBoolean(value)
  };

  const __default__$13 = vue.defineComponent({
    name: "ElCheckTag"
  });
  const _sfc_main$1C = /* @__PURE__ */ vue.defineComponent({
    ...__default__$13,
    props: checkTagProps,
    emits: checkTagEmits,
    setup(__props, { emit }) {
      const props = __props;
      const ns = useNamespace("check-tag");
      const containerKls = vue.computed(() => [ns.b(), ns.is("checked", props.checked)]);
      const handleChange = () => {
        const checked = !props.checked;
        emit(CHANGE_EVENT, checked);
        emit("update:checked", checked);
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("span", {
          class: vue.normalizeClass(vue.unref(containerKls)),
          onClick: handleChange
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 2);
      };
    }
  });
  var CheckTag = /* @__PURE__ */ _export_sfc(_sfc_main$1C, [["__file", "check-tag.vue"]]);

  const ElCheckTag = withInstall(CheckTag);

  const rowContextKey = Symbol("rowContextKey");

  const RowJustify = [
    "start",
    "center",
    "end",
    "space-around",
    "space-between",
    "space-evenly"
  ];
  const RowAlign = ["top", "middle", "bottom"];
  const rowProps = buildProps({
    tag: {
      type: String,
      default: "div"
    },
    gutter: {
      type: Number,
      default: 0
    },
    justify: {
      type: String,
      values: RowJustify,
      default: "start"
    },
    align: {
      type: String,
      values: RowAlign
    }
  });

  const __default__$12 = vue.defineComponent({
    name: "ElRow"
  });
  const _sfc_main$1B = /* @__PURE__ */ vue.defineComponent({
    ...__default__$12,
    props: rowProps,
    setup(__props) {
      const props = __props;
      const ns = useNamespace("row");
      const gutter = vue.computed(() => props.gutter);
      vue.provide(rowContextKey, {
        gutter
      });
      const style = vue.computed(() => {
        const styles = {};
        if (!props.gutter) {
          return styles;
        }
        styles.marginRight = styles.marginLeft = `-${props.gutter / 2}px`;
        return styles;
      });
      const rowKls = vue.computed(() => [
        ns.b(),
        ns.is(`justify-${props.justify}`, props.justify !== "start"),
        ns.is(`align-${props.align}`, !!props.align)
      ]);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.tag), {
          class: vue.normalizeClass(vue.unref(rowKls)),
          style: vue.normalizeStyle(vue.unref(style))
        }, {
          default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "default")
          ]),
          _: 3
        }, 8, ["class", "style"]);
      };
    }
  });
  var Row$1 = /* @__PURE__ */ _export_sfc(_sfc_main$1B, [["__file", "row.vue"]]);

  const ElRow = withInstall(Row$1);

  const colProps = buildProps({
    tag: {
      type: String,
      default: "div"
    },
    span: {
      type: Number,
      default: 24
    },
    offset: {
      type: Number,
      default: 0
    },
    pull: {
      type: Number,
      default: 0
    },
    push: {
      type: Number,
      default: 0
    },
    xs: {
      type: definePropType([Number, Object]),
      default: () => mutable({})
    },
    sm: {
      type: definePropType([Number, Object]),
      default: () => mutable({})
    },
    md: {
      type: definePropType([Number, Object]),
      default: () => mutable({})
    },
    lg: {
      type: definePropType([Number, Object]),
      default: () => mutable({})
    },
    xl: {
      type: definePropType([Number, Object]),
      default: () => mutable({})
    }
  });

  const __default__$11 = vue.defineComponent({
    name: "ElCol"
  });
  const _sfc_main$1A = /* @__PURE__ */ vue.defineComponent({
    ...__default__$11,
    props: colProps,
    setup(__props) {
      const props = __props;
      const { gutter } = vue.inject(rowContextKey, { gutter: vue.computed(() => 0) });
      const ns = useNamespace("col");
      const style = vue.computed(() => {
        const styles = {};
        if (gutter.value) {
          styles.paddingLeft = styles.paddingRight = `${gutter.value / 2}px`;
        }
        return styles;
      });
      const colKls = vue.computed(() => {
        const classes = [];
        const pos = ["span", "offset", "pull", "push"];
        pos.forEach((prop) => {
          const size = props[prop];
          if (isNumber(size)) {
            if (prop === "span")
              classes.push(ns.b(`${props[prop]}`));
            else if (size > 0)
              classes.push(ns.b(`${prop}-${props[prop]}`));
          }
        });
        const sizes = ["xs", "sm", "md", "lg", "xl"];
        sizes.forEach((size) => {
          if (isNumber(props[size])) {
            classes.push(ns.b(`${size}-${props[size]}`));
          } else if (isObject$1(props[size])) {
            Object.entries(props[size]).forEach(([prop, sizeProp]) => {
              classes.push(prop !== "span" ? ns.b(`${size}-${prop}-${sizeProp}`) : ns.b(`${size}-${sizeProp}`));
            });
          }
        });
        if (gutter.value) {
          classes.push(ns.is("guttered"));
        }
        return [ns.b(), classes];
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(_ctx.tag), {
          class: vue.normalizeClass(vue.unref(colKls)),
          style: vue.normalizeStyle(vue.unref(style))
        }, {
          default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "default")
          ]),
          _: 3
        }, 8, ["class", "style"]);
      };
    }
  });
  var Col = /* @__PURE__ */ _export_sfc(_sfc_main$1A, [["__file", "col.vue"]]);

  const ElCol = withInstall(Col);

  const emitChangeFn = (value) => typeof isNumber(value);
  const collapseProps = buildProps({
    accordion: Boolean,
    modelValue: {
      type: definePropType([Array, String, Number]),
      default: () => mutable([])
    }
  });
  const collapseEmits = {
    [UPDATE_MODEL_EVENT]: emitChangeFn,
    [CHANGE_EVENT]: emitChangeFn
  };

  const collapseContextKey = Symbol("collapseContextKey");

  const useCollapse = (props, emit) => {
    const activeNames = vue.ref(castArray$1(props.modelValue));
    const setActiveNames = (_activeNames) => {
      activeNames.value = _activeNames;
      const value = props.accordion ? activeNames.value[0] : activeNames.value;
      emit(UPDATE_MODEL_EVENT, value);
      emit(CHANGE_EVENT, value);
    };
    const handleItemClick = (name) => {
      if (props.accordion) {
        setActiveNames([activeNames.value[0] === name ? "" : name]);
      } else {
        const _activeNames = [...activeNames.value];
        const index = _activeNames.indexOf(name);
        if (index > -1) {
          _activeNames.splice(index, 1);
        } else {
          _activeNames.push(name);
        }
        setActiveNames(_activeNames);
      }
    };
    vue.watch(() => props.modelValue, () => activeNames.value = castArray$1(props.modelValue), { deep: true });
    vue.provide(collapseContextKey, {
      activeNames,
      handleItemClick
    });
    return {
      activeNames,
      setActiveNames
    };
  };
  const useCollapseDOM = () => {
    const ns = useNamespace("collapse");
    const rootKls = vue.computed(() => ns.b());
    return {
      rootKls
    };
  };

  const __default__$10 = vue.defineComponent({
    name: "ElCollapse"
  });
  const _sfc_main$1z = /* @__PURE__ */ vue.defineComponent({
    ...__default__$10,
    props: collapseProps,
    emits: collapseEmits,
    setup(__props, { expose, emit }) {
      const props = __props;
      const { activeNames, setActiveNames } = useCollapse(props, emit);
      const { rootKls } = useCollapseDOM();
      expose({
        activeNames,
        setActiveNames
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(vue.unref(rootKls))
        }, [
          vue.renderSlot(_ctx.$slots, "default")
        ], 2);
      };
    }
  });
  var Collapse = /* @__PURE__ */ _export_sfc(_sfc_main$1z, [["__file", "collapse.vue"]]);

  const __default__$$ = vue.defineComponent({
    name: "ElCollapseTransition"
  });
  const _sfc_main$1y = /* @__PURE__ */ vue.defineComponent({
    ...__default__$$,
    setup(__props) {
      const ns = useNamespace("collapse-transition");
      const reset = (el) => {
        el.style.maxHeight = "";
        el.style.overflow = el.dataset.oldOverflow;
        el.style.paddingTop = el.dataset.oldPaddingTop;
        el.style.paddingBottom = el.dataset.oldPaddingBottom;
      };
      const on = {
        beforeEnter(el) {
          if (!el.dataset)
            el.dataset = {};
          el.dataset.oldPaddingTop = el.style.paddingTop;
          el.dataset.oldPaddingBottom = el.style.paddingBottom;
          if (el.style.height)
            el.dataset.elExistsHeight = el.style.height;
          el.style.maxHeight = 0;
          el.style.paddingTop = 0;
          el.style.paddingBottom = 0;
        },
        enter(el) {
          requestAnimationFrame(() => {
            el.dataset.oldOverflow = el.style.overflow;
            if (el.dataset.elExistsHeight) {
              el.style.maxHeight = el.dataset.elExistsHeight;
            } else if (el.scrollHeight !== 0) {
              el.style.maxHeight = `${el.scrollHeight}px`;
            } else {
              el.style.maxHeight = 0;
            }
            el.style.paddingTop = el.dataset.oldPaddingTop;
            el.style.paddingBottom = el.dataset.oldPaddingBottom;
            el.style.overflow = "hidden";
          });
        },
        afterEnter(el) {
          el.style.maxHeight = "";
          el.style.overflow = el.dataset.oldOverflow;
        },
        enterCancelled(el) {
          reset(el);
        },
        beforeLeave(el) {
          if (!el.dataset)
            el.dataset = {};
          el.dataset.oldPaddingTop = el.style.paddingTop;
          el.dataset.oldPaddingBottom = el.style.paddingBottom;
          el.dataset.oldOverflow = el.style.overflow;
          el.style.maxHeight = `${el.scrollHeight}px`;
          el.style.overflow = "hidden";
        },
        leave(el) {
          if (el.scrollHeight !== 0) {
            el.style.maxHeight = 0;
            el.style.paddingTop = 0;
            el.style.paddingBottom = 0;
          }
        },
        afterLeave(el) {
          reset(el);
        },
        leaveCancelled(el) {
          reset(el);
        }
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(vue.Transition, vue.mergeProps({
          name: vue.unref(ns).b()
        }, vue.toHandlers(on)), {
          default: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "default")
          ]),
          _: 3
        }, 16, ["name"]);
      };
    }
  });
  var CollapseTransition = /* @__PURE__ */ _export_sfc(_sfc_main$1y, [["__file", "collapse-transition.vue"]]);

  CollapseTransition.install = (app) => {
    app.component(CollapseTransition.name, CollapseTransition);
  };
  const _CollapseTransition = CollapseTransition;
  const ElCollapseTransition = _CollapseTransition;

  const collapseItemProps = buildProps({
    title: {
      type: String,
      default: ""
    },
    name: {
      type: definePropType([String, Number]),
      default: () => generateId()
    },
    disabled: Boolean
  });

  const useCollapseItem = (props) => {
    const collapse = vue.inject(collapseContextKey);
    const focusing = vue.ref(false);
    const isClick = vue.ref(false);
    const id = vue.ref(generateId());
    const isActive = vue.computed(() => collapse == null ? void 0 : collapse.activeNames.value.includes(props.name));
    const handleFocus = () => {
      setTimeout(() => {
        if (!isClick.value) {
          focusing.value = true;
        } else {
          isClick.value = false;
        }
      }, 50);
    };
    const handleHeaderClick = () => {
      if (props.disabled)
        return;
      collapse == null ? void 0 : collapse.handleItemClick(props.name);
      focusing.value = false;
      isClick.value = true;
    };
    const handleEnterClick = () => {
      collapse == null ? void 0 : collapse.handleItemClick(props.name);
    };
    return {
      focusing,
      id,
      isActive,
      handleFocus,
      handleHeaderClick,
      handleEnterClick
    };
  };
  const useCollapseItemDOM = (props, { focusing, isActive, id }) => {
    const ns = useNamespace("collapse");
    const rootKls = vue.computed(() => [
      ns.b("item"),
      ns.is("active", vue.unref(isActive)),
      ns.is("disabled", props.disabled)
    ]);
    const headKls = vue.computed(() => [
      ns.be("item", "header"),
      ns.is("active", vue.unref(isActive)),
      { focusing: vue.unref(focusing) && !props.disabled }
    ]);
    const arrowKls = vue.computed(() => [
      ns.be("item", "arrow"),
      ns.is("active", vue.unref(isActive))
    ]);
    const itemWrapperKls = vue.computed(() => ns.be("item", "wrap"));
    const itemContentKls = vue.computed(() => ns.be("item", "content"));
    const scopedContentId = vue.computed(() => ns.b(`content-${vue.unref(id)}`));
    const scopedHeadId = vue.computed(() => ns.b(`head-${vue.unref(id)}`));
    return {
      arrowKls,
      headKls,
      rootKls,
      itemWrapperKls,
      itemContentKls,
      scopedContentId,
      scopedHeadId
    };
  };

  const _hoisted_1$N = ["id", "aria-expanded", "aria-controls", "aria-describedby", "tabindex"];
  const _hoisted_2$w = ["id", "aria-hidden", "aria-labelledby"];
  const __default__$_ = vue.defineComponent({
    name: "ElCollapseItem"
  });
  const _sfc_main$1x = /* @__PURE__ */ vue.defineComponent({
    ...__default__$_,
    props: collapseItemProps,
    setup(__props, { expose }) {
      const props = __props;
      const {
        focusing,
        id,
        isActive,
        handleFocus,
        handleHeaderClick,
        handleEnterClick
      } = useCollapseItem(props);
      const {
        arrowKls,
        headKls,
        rootKls,
        itemWrapperKls,
        itemContentKls,
        scopedContentId,
        scopedHeadId
      } = useCollapseItemDOM(props, { focusing, isActive, id });
      expose({
        isActive
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(vue.unref(rootKls))
        }, [
          vue.createElementVNode("button", {
            id: vue.unref(scopedHeadId),
            class: vue.normalizeClass(vue.unref(headKls)),
            "aria-expanded": vue.unref(isActive),
            "aria-controls": vue.unref(scopedContentId),
            "aria-describedby": vue.unref(scopedContentId),
            tabindex: _ctx.disabled ? -1 : 0,
            type: "button",
            onClick: _cache[0] || (_cache[0] = (...args) => vue.unref(handleHeaderClick) && vue.unref(handleHeaderClick)(...args)),
            onKeydown: _cache[1] || (_cache[1] = vue.withKeys(vue.withModifiers((...args) => vue.unref(handleEnterClick) && vue.unref(handleEnterClick)(...args), ["stop", "prevent"]), ["space", "enter"])),
            onFocus: _cache[2] || (_cache[2] = (...args) => vue.unref(handleFocus) && vue.unref(handleFocus)(...args)),
            onBlur: _cache[3] || (_cache[3] = ($event) => focusing.value = false)
          }, [
            vue.renderSlot(_ctx.$slots, "title", {}, () => [
              vue.createTextVNode(vue.toDisplayString(_ctx.title), 1)
            ]),
            vue.createVNode(vue.unref(ElIcon), {
              class: vue.normalizeClass(vue.unref(arrowKls))
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(vue.unref(arrow_right_default))
              ]),
              _: 1
            }, 8, ["class"])
          ], 42, _hoisted_1$N),
          vue.createVNode(vue.unref(_CollapseTransition), null, {
            default: vue.withCtx(() => [
              vue.withDirectives(vue.createElementVNode("div", {
                id: vue.unref(scopedContentId),
                role: "region",
                class: vue.normalizeClass(vue.unref(itemWrapperKls)),
                "aria-hidden": !vue.unref(isActive),
                "aria-labelledby": vue.unref(scopedHeadId)
              }, [
                vue.createElementVNode("div", {
                  class: vue.normalizeClass(vue.unref(itemContentKls))
                }, [
                  vue.renderSlot(_ctx.$slots, "default")
                ], 2)
              ], 10, _hoisted_2$w), [
                [vue.vShow, vue.unref(isActive)]
              ])
            ]),
            _: 3
          })
        ], 2);
      };
    }
  });
  var CollapseItem = /* @__PURE__ */ _export_sfc(_sfc_main$1x, [["__file", "collapse-item.vue"]]);

  const ElCollapse = withInstall(Collapse, {
    CollapseItem
  });
  const ElCollapseItem = withNoopInstall(CollapseItem);

  const alphaSliderProps = buildProps({
    color: {
      type: definePropType(Object),
      required: true
    },
    vertical: {
      type: Boolean,
      default: false
    }
  });

  let isDragging = false;
  function draggable(element, options) {
    if (!isClient)
      return;
    const moveFn = function(event) {
      var _a;
      (_a = options.drag) == null ? void 0 : _a.call(options, event);
    };
    const upFn = function(event) {
      var _a;
      document.removeEventListener("mousemove", moveFn);
      document.removeEventListener("mouseup", upFn);
      document.removeEventListener("touchmove", moveFn);
      document.removeEventListener("touchend", upFn);
      document.onselectstart = null;
      document.ondragstart = null;
      isDragging = false;
      (_a = options.end) == null ? void 0 : _a.call(options, event);
    };
    const downFn = function(event) {
      var _a;
      if (isDragging)
        return;
      event.preventDefault();
      document.onselectstart = () => false;
      document.ondragstart = () => false;
      document.addEventListener("mousemove", moveFn);
      document.addEventListener("mouseup", upFn);
      document.addEventListener("touchmove", moveFn);
      document.addEventListener("touchend", upFn);
      isDragging = true;
      (_a = options.start) == null ? void 0 : _a.call(options, event);
    };
    element.addEventListener("mousedown", downFn);
    element.addEventListener("touchstart", downFn);
  }

  const useAlphaSlider = (props) => {
    const instance = vue.getCurrentInstance();
    const thumb = vue.shallowRef();
    const bar = vue.shallowRef();
    function handleClick(event) {
      const target = event.target;
      if (target !== thumb.value) {
        handleDrag(event);
      }
    }
    function handleDrag(event) {
      if (!bar.value || !thumb.value)
        return;
      const el = instance.vnode.el;
      const rect = el.getBoundingClientRect();
      const { clientX, clientY } = getClientXY(event);
      if (!props.vertical) {
        let left = clientX - rect.left;
        left = Math.max(thumb.value.offsetWidth / 2, left);
        left = Math.min(left, rect.width - thumb.value.offsetWidth / 2);
        props.color.set("alpha", Math.round((left - thumb.value.offsetWidth / 2) / (rect.width - thumb.value.offsetWidth) * 100));
      } else {
        let top = clientY - rect.top;
        top = Math.max(thumb.value.offsetHeight / 2, top);
        top = Math.min(top, rect.height - thumb.value.offsetHeight / 2);
        props.color.set("alpha", Math.round((top - thumb.value.offsetHeight / 2) / (rect.height - thumb.value.offsetHeight) * 100));
      }
    }
    return {
      thumb,
      bar,
      handleDrag,
      handleClick
    };
  };
  const useAlphaSliderDOM = (props, {
    bar,
    thumb,
    handleDrag
  }) => {
    const instance = vue.getCurrentInstance();
    const ns = useNamespace("color-alpha-slider");
    const thumbLeft = vue.ref(0);
    const thumbTop = vue.ref(0);
    const background = vue.ref();
    function getThumbLeft() {
      if (!thumb.value)
        return 0;
      if (props.vertical)
        return 0;
      const el = instance.vnode.el;
      const alpha = props.color.get("alpha");
      if (!el)
        return 0;
      return Math.round(alpha * (el.offsetWidth - thumb.value.offsetWidth / 2) / 100);
    }
    function getThumbTop() {
      if (!thumb.value)
        return 0;
      const el = instance.vnode.el;
      if (!props.vertical)
        return 0;
      const alpha = props.color.get("alpha");
      if (!el)
        return 0;
      return Math.round(alpha * (el.offsetHeight - thumb.value.offsetHeight / 2) / 100);
    }
    function getBackground() {
      if (props.color && props.color.value) {
        const { r, g, b } = props.color.toRgb();
        return `linear-gradient(to right, rgba(${r}, ${g}, ${b}, 0) 0%, rgba(${r}, ${g}, ${b}, 1) 100%)`;
      }
      return "";
    }
    function update() {
      thumbLeft.value = getThumbLeft();
      thumbTop.value = getThumbTop();
      background.value = getBackground();
    }
    vue.onMounted(() => {
      if (!bar.value || !thumb.value)
        return;
      const dragConfig = {
        drag: (event) => {
          handleDrag(event);
        },
        end: (event) => {
          handleDrag(event);
        }
      };
      draggable(bar.value, dragConfig);
      draggable(thumb.value, dragConfig);
      update();
    });
    vue.watch(() => props.color.get("alpha"), () => update());
    vue.watch(() => props.color.value, () => update());
    const rootKls = vue.computed(() => [ns.b(), ns.is("vertical", props.vertical)]);
    const barKls = vue.computed(() => ns.e("bar"));
    const thumbKls = vue.computed(() => ns.e("thumb"));
    const barStyle = vue.computed(() => ({ background: background.value }));
    const thumbStyle = vue.computed(() => ({
      left: addUnit(thumbLeft.value),
      top: addUnit(thumbTop.value)
    }));
    return { rootKls, barKls, barStyle, thumbKls, thumbStyle, update };
  };

  const COMPONENT_NAME$d = "ElColorAlphaSlider";
  const __default__$Z = vue.defineComponent({
    name: COMPONENT_NAME$d
  });
  const _sfc_main$1w = /* @__PURE__ */ vue.defineComponent({
    ...__default__$Z,
    props: alphaSliderProps,
    setup(__props, { expose }) {
      const props = __props;
      const { bar, thumb, handleDrag, handleClick } = useAlphaSlider(props);
      const { rootKls, barKls, barStyle, thumbKls, thumbStyle, update } = useAlphaSliderDOM(props, {
        bar,
        thumb,
        handleDrag
      });
      expose({
        update,
        bar,
        thumb
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: vue.normalizeClass(vue.unref(rootKls))
        }, [
          vue.createElementVNode("div", {
            ref_key: "bar",
            ref: bar,
            class: vue.normalizeClass(vue.unref(barKls)),
            style: vue.normalizeStyle(vue.unref(barStyle)),
            onClick: _cache[0] || (_cache[0] = (...args) => vue.unref(handleClick) && vue.unref(handleClick)(...args))
          }, null, 6),
          vue.createElementVNode("div", {
            ref_key: "thumb",
            ref: thumb,
            class: vue.normalizeClass(vue.unref(thumbKls)),
            style: vue.normalizeStyle(vue.unref(thumbStyle))
          }, null, 6)
        ], 2);
      };
    }
  });
  var AlphaSlider = /* @__PURE__ */ _export_sfc(_sfc_main$1w, [["__file", "alpha-slider.vue"]]);

  const _sfc_main$1v = vue.defineComponent({
    name: "ElColorHueSlider",
    props: {
      color: {
        type: Object,
        required: true
      },
      vertical: Boolean
    },
    setup(props) {
      const ns = useNamespace("color-hue-slider");
      const instance = vue.getCurrentInstance();
      const thumb = vue.ref();
      const bar = vue.ref();
      const thumbLeft = vue.ref(0);
      const thumbTop = vue.ref(0);
      const hueValue = vue.computed(() => {
        return props.color.get("hue");
      });
      vue.watch(() => hueValue.value, () => {
        update();
      });
      function handleClick(event) {
        const target = event.target;
        if (target !== thumb.value) {
          handleDrag(event);
        }
      }
      function handleDrag(event) {
        if (!bar.value || !thumb.value)
          return;
        const el = instance.vnode.el;
        const rect = el.getBoundingClientRect();
        const { clientX, clientY } = getClientXY(event);
        let hue;
        if (!props.vertical) {
          let left = clientX - rect.left;
          left = Math.min(left, rect.width - thumb.value.offsetWidth / 2);
          left = Math.max(thumb.value.offsetWidth / 2, left);
          hue = Math.round((left - thumb.value.offsetWidth / 2) / (rect.width - thumb.value.offsetWidth) * 360);
        } else {
          let top = clientY - rect.top;
          top = Math.min(top, rect.height - thumb.value.offsetHeight / 2);
          top = Math.max(thumb.value.offsetHeight / 2, top);
          hue = Math.round((top - thumb.value.offsetHeight / 2) / (rect.height - thumb.value.offsetHeight) * 360);
        }
        props.color.set("hue", hue);
      }
      function getThumbLeft() {
        if (!thumb.value)
          return 0;
        const el = instance.vnode.el;
        if (props.vertical)
          return 0;
        const hue = props.color.get("hue");
        if (!el)
          return 0;
        return Math.round(hue * (el.offsetWidth - thumb.value.offsetWidth / 2) / 360);
      }
      function getThumbTop() {
        if (!thumb.value)
          return 0;
        const el = instance.vnode.el;
        if (!props.vertical)
          return 0;
        const hue = props.color.get("hue");
        if (!el)
          return 0;
        return Math.round(hue * (el.offsetHeight - thumb.value.offsetHeight / 2) / 360);
      }
      function update() {
        thumbLeft.value = getThumbLeft();
        thumbTop.value = getThumbTop();
      }
      vue.onMounted(() => {
        if (!bar.value || !thumb.value)
          return;
        const dragConfig = {
          drag: (event) => {
            handleDrag(event);
          },
          end: (event) => {
            handleDrag(event);
          }
        };
        draggable(bar.value, dragConfig);
        draggable(thumb.value, dragConfig);
        update();
      });
      return {
        bar,
        thumb,
        thumbLeft,
        thumbTop,
        hueValue,
        handleClick,
        update,
        ns
      };
    }
  });
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass([_ctx.ns.b(), _ctx.ns.is("vertical", _ctx.vertical)])
    }, [
      vue.createElementVNode("div", {
        ref: "bar",
        class: vue.normalizeClass(_ctx.ns.e("bar")),
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.handleClick && _ctx.handleClick(...args))
      }, null, 2),
      vue.createElementVNode("div", {
        ref: "thumb",
        class: vue.normalizeClass(_ctx.ns.e("thumb")),
        style: vue.normalizeStyle({
          left: _ctx.thumbLeft + "px",
          top: _ctx.thumbTop + "px"
        })
      }, null, 6)
    ], 2);
  }
  var HueSlider = /* @__PURE__ */ _export_sfc(_sfc_main$1v, [["render", _sfc_render$r], ["__file", "hue-slider.vue"]]);

  const colorPickerProps = buildProps({
    modelValue: String,
    id: String,
    showAlpha: Boolean,
    colorFormat: String,
    disabled: Boolean,
    size: useSizeProp,
    popperClass: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: void 0
    },
    tabindex: {
      type: [String, Number],
      default: 0
    },
    predefine: {
      type: definePropType(Array)
    },
    validateEvent: {
      type: Boolean,
      default: true
    }
  });
  const colorPickerEmits = {
    [UPDATE_MODEL_EVENT]: (val) => isString$1(val) || isNil(val),
    [CHANGE_EVENT]: (val) => isString$1(val) || isNil(val),
    activeChange: (val) => isString$1(val) || isNil(val),
    focus: (event) => event instanceof FocusEvent,
    blur: (event) => event instanceof FocusEvent
  };
  const colorPickerContextKey = Symbol("colorPickerContextKey");

  const hsv2hsl = function(hue, sat, val) {
    return [
      hue,
      sat * val / ((hue = (2 - sat) * val) < 1 ? hue : 2 - hue) || 0,
      hue / 2
    ];
  };
  const isOnePointZero = function(n) {
    return typeof n === "string" && n.includes(".") && Number.parseFloat(n) === 1;
  };
  const isPercentage = function(n) {
    return typeof n === "string" && n.includes("%");
  };
  const bound01 = function(value, max) {
    if (isOnePointZero(value))
      value = "100%";
    const processPercent = isPercentage(value);
    value = Math.min(max, Math.max(0, Number.parseFloat(`${value}`)));
    if (processPercent) {
      value = Number.parseInt(`${value * max}`, 10) / 100;
    }
    if (Math.abs(value - max) < 1e-6) {
      return 1;
    }
    return value % max / Number.parseFloat(max);
  };
  const INT_HEX_MAP = {
    10: "A",
    11: "B",
    12: "C",
    13: "D",
    14: "E",
    15: "F"
  };
  const hexOne = (value) => {
    value = Math.min(Math.round(value), 255);
    const high = Math.floor(value / 16);
    const low = value % 16;
    return `${INT_HEX_MAP[high] || high}${INT_HEX_MAP[low] || low}`;
  };
  const toHex = function({ r, g, b }) {
    if (Number.isNaN(+r) || Number.isNaN(+g) || Number.isNaN(+b))
      return "";
    return `#${hexOne(r)}${hexOne(g)}${hexOne(b)}`;
  };
  const HEX_INT_MAP = {
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15
  };
  const parseHexChannel = function(hex) {
    if (hex.length === 2) {
      return (HEX_INT_MAP[hex[0].toUpperCase()] || +hex[0]) * 16 + (HEX_INT_MAP[hex[1].toUpperCase()] || +hex[1]);
    }
    return HEX_INT_MAP[hex[1].toUpperCase()] || +hex[1];
  };
  const hsl2hsv = function(hue, sat, light) {
    sat = sat / 100;
    light = light / 100;
    let smin = sat;
    const lmin = Math.max(light, 0.01);
    light *= 2;
    sat *= light <= 1 ? light : 2 - light;
    smin *= lmin <= 1 ? lmin : 2 - lmin;
    const v = (light + sat) / 2;
    const sv = light === 0 ? 2 * smin / (lmin + smin) : 2 * sat / (light + sat);
    return {
      h: hue,
      s: sv * 100,
      v: v * 100
    };
  };
  const rgb2hsv = (r, g, b) => {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h;
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r: {
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        }
        case g: {
          h = (b - r) / d + 2;
          break;
        }
        case b: {
          h = (r - g) / d + 4;
          break;
        }
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, v: v * 100 };
  };
  const hsv2rgb = function(h, s, v) {
    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);
    const i = Math.floor(h);
    const f = h - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    const mod = i % 6;
    const r = [v, q, p, p, t, v][mod];
    const g = [t, v, v, q, p, p][mod];
    const b = [p, p, t, v, v, q][mod];
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };
  class Color {
    constructor(options = {}) {
      this._hue = 0;
      this._saturation = 100;
      this._value = 100;
      this._alpha = 100;
      this.enableAlpha = false;
      this.format = "hex";
      this.value = "";
      for (const option in options) {
        if (hasOwn(options, option)) {
          this[option] = options[option];
        }
      }
      if (options.value) {
        this.fromString(options.value);
      } else {
        this.doOnChange();
      }
    }
    set(prop, value) {
      if (arguments.length === 1 && typeof prop === "object") {
        for (const p in prop) {
          if (hasOwn(prop, p)) {
            this.set(p, prop[p]);
          }
        }
        return;
      }
      this[`_${prop}`] = value;
      this.doOnChange();
    }
    get(prop) {
      if (prop === "alpha") {
        return Math.floor(this[`_${prop}`]);
      }
      return this[`_${prop}`];
    }
    toRgb() {
      return hsv2rgb(this._hue, this._saturation, this._value);
    }
    fromString(value) {
      if (!value) {
        this._hue = 0;
        this._saturation = 100;
        this._value = 100;
        this.doOnChange();
        return;
      }
      const fromHSV = (h, s, v) => {
        this._hue = Math.max(0, Math.min(360, h));
        this._saturation = Math.max(0, Math.min(100, s));
        this._value = Math.max(0, Math.min(100, v));
        this.doOnChange();
      };
      if (value.includes("hsl")) {
        const parts = value.replace(/hsla|hsl|\(|\)/gm, "").split(/\s|,/g).filter((val) => val !== "").map((val, index) => index > 2 ? Number.parseFloat(val) : Number.parseInt(val, 10));
        if (parts.length === 4) {
          this._alpha = Number.parseFloat(parts[3]) * 100;
        } else if (parts.length === 3) {
          this._alpha = 100;
        }
        if (parts.length >= 3) {
          const { h, s, v } = hsl2hsv(parts[0], parts[1], parts[2]);
          fromHSV(h, s, v);
        }
      } else if (value.includes("hsv")) {
        const parts = value.replace(/hsva|hsv|\(|\)/gm, "").split(/\s|,/g).filter((val) => val !== "").map((val, index) => index > 2 ? Number.parseFloat(val) : Number.parseInt(val, 10));
        if (parts.length === 4) {
          this._alpha = Number.parseFloat(parts[3]) * 100;
        } else if (parts.length === 3) {
          this._alpha = 100;
        }
        if (parts.length >= 3) {
          fromHSV(parts[0], parts[1], parts[2]);
        }
      } else if (value.includes("rgb")) {
        const parts = value.replace(/rgba|rgb|\(|\)/gm, "").split(/\s|,/g).filter((val) => val !== "").map((val, index) => index > 2 ? Number.parseFloat(val) : Number.parseInt(val, 10));
        if (parts.length === 4) {
          this._alpha = Number.parseFloat(parts[3]) * 100;
        } else if (parts.length === 3) {
          this._alpha = 100;
        }
        if (parts.length >= 3) {
          const { h, s, v } = rgb2hsv(parts[0], parts[1], parts[2]);
          fromHSV(h, s, v);
        }
      } else if (value.includes("#")) {
        const hex = value.replace("#", "").trim();
        if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{8}$/.test(hex))
          return;
        let r, g, b;
        if (hex.length === 3) {
          r = parseHexChannel(hex[0] + hex[0]);
          g = parseHexChannel(hex[1] + hex[1]);
          b = parseHexChannel(hex[2] + hex[2]);
        } else if (hex.length === 6 || hex.length === 8) {
          r = parseHexChannel(hex.slice(0, 2));
          g = parseHexChannel(hex.slice(2, 4));
          b = parseHexChannel(hex.slice(4, 6));
        }
        if (hex.length === 8) {
          this._alpha = parseHexChannel(hex.slice(6)) / 255 * 100;
        } else if (hex.length === 3 || hex.length === 6) {
          this._alpha = 100;
        }
        const { h, s, v } = rgb2hsv(r, g, b);
        fromHSV(h, s, v);
      }
    }
    compare(color) {
      return Math.abs(color._hue - this._hue) < 2 && Math.abs(color._saturation - this._saturation) < 1 && Math.abs(color._value - this._value) < 1 && Math.abs(color._alpha - this._alpha) < 1;
    }
    doOnChange() {
      const { _hue, _saturation, _value, _alpha, format } = this;
      if (this.enableAlpha) {
        switch (format) {
          case "hsl": {
            const hsl = hsv2hsl(_hue, _saturation / 100, _value / 100);
            this.value = `hsla(${_hue}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%, ${this.get("alpha") / 100})`;
            break;
          }
          case "hsv": {
            this.value = `hsva(${_hue}, ${Math.round(_saturation)}%, ${Math.round(_value)}%, ${this.get("alpha") / 100})`;
            break;
          }
          case "hex": {
            this.value = `${toHex(hsv2rgb(_hue, _saturation, _value))}${hexOne(_alpha * 255 / 100)}`;
            break;
          }
          default: {
            const { r, g, b } = hsv2rgb(_hue, _saturation, _value);
            this.value = `rgba(${r}, ${g}, ${b}, ${this.get("alpha") / 100})`;
          }
        }
      } else {
        switch (format) {
          case "hsl": {
            const hsl = hsv2hsl(_hue, _saturation / 100, _value / 100);
            this.value = `hsl(${_hue}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%)`;
            break;
          }
          case "hsv": {
            this.value = `hsv(${_hue}, ${Math.round(_saturation)}%, ${Math.round(_value)}%)`;
            break;
          }
          case "rgb": {
            const { r, g, b } = hsv2rgb(_hue, _saturation, _value);
            this.value = `rgb(${r}, ${g}, ${b})`;
            break;
          }
          default: {
            this.value = toHex(hsv2rgb(_hue, _saturation, _value));
          }
        }
      }
    }
  }

  const _sfc_main$1u = vue.defineComponent({
    props: {
      colors: {
        type: Array,
        required: true
      },
      color: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      const ns = useNamespace("color-predefine");
      const { currentColor } = vue.inject(colorPickerContextKey);
      const rgbaColors = vue.ref(parseColors(props.colors, props.color));
      vue.watch(() => currentColor.value, (val) => {
        const color = new Color();
        color.fromString(val);
        rgbaColors.value.forEach((item) => {
          item.selected = color.compare(item);
        });
      });
      vue.watchEffect(() => {
        rgbaColors.value = parseColors(props.colors, props.color);
      });
      function handleSelect(index) {
        props.color.fromString(props.colors[index]);
      }
      function parseColors(colors, color) {
        return colors.map((value) => {
          const c = new Color();
          c.enableAlpha = true;
          c.format = "rgba";
          c.fromString(value);
          c.selected = c.value === color.value;
          return c;
        });
      }
      return {
        rgbaColors,
        handleSelect,
        ns
      };
    }
  });
  const _hoisted_1$M = ["onClick"];
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", {
      class: vue.normalizeClass(_ctx.ns.b())
    }, [
      vue.createElementVNode("div", {
        class: vue.normalizeClass(_ctx.ns.e("colors"))
      }, [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.rgbaColors, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("div", {
            key: _ctx.colors[index],
            class: vue.normalizeClass([
              _ctx.ns.e("color-selector"),
              _ctx.ns.is("alpha", item._alpha < 100),
              { selected: item.selected }
            ]),
            onClick: ($event) => _ctx.handleSelect(index)
          }, [
            vue.createElementVNode("div", {
              style: vue.normalizeStyle({ backgroundColor: item.value })
            }, null, 4)
          ], 10, _hoisted_1$M);
        }), 128))
      ], 2)
    ], 2);
  }
  var Predefine = /* @__PURE__ */ _export_sfc(_sfc_main$1u, [["render", _sfc_render$q], ["__file", "predefine.vue"]]);

  const _sfc_main$1t = vue.defineComponent({
    name: "ElSlPanel",
    props: {
      color: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      const ns = useNamespace("color-svpanel");
      const instance = vue.getCurrentInstance();
      const cursorTop = vue.ref(0);
      const cursorLeft = vue.ref(0);
      const background = vue.ref("hsl(0, 100%, 50%)");
      const colorValue = vue.computed(() => {
        const hue = props.color.get("hue");
        const value = props.color.get("value");
        return { hue, value };
      });
      function update() {
        const saturation = props.color.get("saturation");
        const value = props.color.get("value");
        const 