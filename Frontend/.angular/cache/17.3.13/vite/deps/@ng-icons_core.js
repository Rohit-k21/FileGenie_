import {
  isPlatformServer
} from "./chunk-RU5QBMYY.js";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostAttributeToken,
  Inject,
  InjectionToken,
  Injector,
  InputFlags,
  NgModule,
  PLATFORM_ID,
  Renderer2,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  runInInjectionContext,
  setClassMetadata,
  ɵɵStandaloneFeature,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵhostProperty,
  ɵɵinject,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵstyleProp
} from "./chunk-2DXLVW4Q.js";
import "./chunk-LFVCTHGI.js";
import {
  isObservable
} from "./chunk-4RMHXXWK.js";
import "./chunk-AJN3JCM6.js";
import {
  __async,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// node_modules/@ng-icons/core/fesm2022/ng-icons-core.mjs
var _c0 = ["*"];
var NgGlyphConfigToken = new InjectionToken("Ng Glyph Config");
var defaultConfig = {
  size: "1em",
  opticalSize: 20,
  weight: 400,
  grade: 0,
  fill: false
};
function provideNgGlyphsConfig(config) {
  return {
    provide: NgGlyphConfigToken,
    useValue: __spreadValues(__spreadValues({}, defaultConfig), config)
  };
}
function injectNgGlyphsConfig() {
  return inject(NgGlyphConfigToken, {
    optional: true
  }) ?? defaultConfig;
}
var NgGlyphsToken = new InjectionToken("NgGlyphsToken");
function provideNgGlyphs(...glyphsets) {
  if (!glyphsets.length) {
    throw new Error("Please provide at least one glyphset.");
  }
  const defaultGlyphset = glyphsets[0].name;
  return [{
    provide: NgGlyphsToken,
    useValue: {
      defaultGlyphset,
      glyphsets
    }
  }];
}
function injectNgGlyphs() {
  const glyphs = inject(NgGlyphsToken, {
    optional: true
  });
  if (!glyphs) {
    throw new Error("Please provide the glyphs using the provideNgGlyphs() function.");
  }
  return glyphs;
}
function coerceCssPixelValue(value) {
  return value == null ? "" : /^\d+$/.test(value) ? `${value}px` : value;
}
var NgGlyph = class _NgGlyph {
  constructor() {
    this.glyphsets = injectNgGlyphs();
    this.config = injectNgGlyphsConfig();
    this.name = input.required();
    this.glyphset = input(this.glyphsets.defaultGlyphset);
    this.opticalSize = input(this.config.opticalSize, {
      transform: numberAttribute
    });
    this.weight = input(this.config.weight, {
      transform: numberAttribute
    });
    this.grade = input(this.config.grade, {
      transform: numberAttribute
    });
    this.fill = input(this.config.fill, {
      transform: booleanAttribute
    });
    this.size = input(this.config.size, {
      transform: coerceCssPixelValue
    });
    this.color = input(this.config.color);
    this.glyphsetClass = computed(() => {
      const glyphset = this.glyphsets.glyphsets.find((glyphset2) => glyphset2.name === this.glyphset());
      if (!glyphset) {
        throw new Error(`The glyphset "${this.glyphset()}" does not exist. Please provide a valid glyphset.`);
      }
      return glyphset.baseClass;
    });
    this.fontVariationSettings = computed(() => {
      return `'FILL' ${this.fill() ? 1 : 0}, 'wght' ${this.weight()}, 'GRAD' ${this.grade()}, 'opsz' ${this.opticalSize()}`;
    });
  }
  static {
    this.ɵfac = function NgGlyph_Factory(t) {
      return new (t || _NgGlyph)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _NgGlyph,
      selectors: [["ng-glyph"]],
      hostVars: 9,
      hostBindings: function NgGlyph_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵhostProperty("textContent", ctx.name());
          ɵɵclassMap(ctx.glyphsetClass());
          ɵɵstyleProp("--ng-glyph__size", ctx.size())("color", ctx.color())("font-variation-settings", ctx.fontVariationSettings());
        }
      },
      inputs: {
        name: [InputFlags.SignalBased, "name"],
        glyphset: [InputFlags.SignalBased, "glyphset"],
        opticalSize: [InputFlags.SignalBased, "opticalSize"],
        weight: [InputFlags.SignalBased, "weight"],
        grade: [InputFlags.SignalBased, "grade"],
        fill: [InputFlags.SignalBased, "fill"],
        size: [InputFlags.SignalBased, "size"],
        color: [InputFlags.SignalBased, "color"]
      },
      standalone: true,
      features: [ɵɵStandaloneFeature],
      decls: 0,
      vars: 0,
      template: function NgGlyph_Template(rf, ctx) {
      },
      styles: ["[_nghost-%COMP%]{display:inline-block;width:var(--ng-glyph__size);height:var(--ng-glyph__size);font-size:var(--ng-glyph__size);overflow:hidden}"],
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgGlyph, [{
    type: Component,
    args: [{
      selector: "ng-glyph",
      standalone: true,
      template: ``,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "[class]": "glyphsetClass()",
        "[textContent]": "name()",
        "[style.--ng-glyph__size]": "size()",
        "[style.color]": "color()",
        "[style.font-variation-settings]": "fontVariationSettings()"
      },
      styles: [":host{display:inline-block;width:var(--ng-glyph__size);height:var(--ng-glyph__size);font-size:var(--ng-glyph__size);overflow:hidden}\n"]
    }]
  }], null, null);
})();
function createFeature(kind, providers) {
  return {
    ɵkind: kind,
    ɵproviders: providers
  };
}
var NgIconPreProcessorToken = new InjectionToken("Ng Icon Pre Processor");
var NgIconPostProcessorToken = new InjectionToken("Ng Icon Post Processor");
function injectNgIconPreProcessor() {
  return inject(NgIconPreProcessorToken, {
    optional: true
  }) ?? ((icon) => icon);
}
function injectNgIconPostProcessor() {
  return inject(NgIconPostProcessorToken, {
    optional: true
  }) ?? (() => {
  });
}
function preprocessIcon(icon) {
  return icon.replace(/style\s*=/g, "data-style=");
}
function postprocessIcon(element) {
  const elements = element.querySelectorAll("[data-style]");
  for (const element2 of Array.from(elements)) {
    const styles = element2.getAttribute("data-style");
    styles?.split(";").forEach((style) => {
      const [property, value] = style.split(":");
      element2.style[property.trim()] = value.trim();
    });
    element2.removeAttribute("data-style");
  }
}
function withContentSecurityPolicy() {
  return createFeature(0, [{
    provide: NgIconPreProcessorToken,
    useValue: preprocessIcon
  }, {
    provide: NgIconPostProcessorToken,
    useValue: postprocessIcon
  }]);
}
var LoggerToken = new InjectionToken("Ng Icon Logger");
var DefaultLogger = class {
  log(message) {
    console.log(message);
  }
  warn(message) {
    console.warn(message);
  }
  error(message) {
    console.error(message);
  }
};
var ExceptionLogger = class {
  log(message) {
    console.log(message);
  }
  warn(message) {
    throw new Error(message);
  }
  error(message) {
    throw new Error(message);
  }
};
function injectLogger() {
  return inject(LoggerToken, {
    optional: true
  }) ?? new DefaultLogger();
}
function withExceptionLogger() {
  return createFeature(1, [{
    provide: LoggerToken,
    useClass: ExceptionLogger
  }]);
}
var NgIconConfigToken = new InjectionToken("Ng Icon Config");
function provideNgIconsConfig(config, ...features) {
  return [{
    provide: NgIconConfigToken,
    useValue: config
  }, features.map((feature) => feature.ɵproviders)];
}
function injectNgIconConfig() {
  return inject(NgIconConfigToken, {
    optional: true
  }) ?? {};
}
var NgIconLoaderToken = new InjectionToken("Ng Icon Loader Token");
function loaderFeature(kind, providers) {
  return {
    kind,
    providers
  };
}
var NgIconCacheToken = new InjectionToken("Ng Icon Cache Token");
function withCaching() {
  return loaderFeature(0, [{
    provide: NgIconCacheToken,
    useValue: /* @__PURE__ */ new Map()
  }]);
}
function provideNgIconLoader(loader, ...features) {
  return [{
    provide: NgIconLoaderToken,
    useValue: loader
  }, features.map((feature) => feature.providers)];
}
function injectNgIconLoader() {
  return inject(NgIconLoaderToken, {
    optional: true
  });
}
function injectNgIconLoaderCache() {
  return inject(NgIconCacheToken, {
    optional: true
  });
}
function provideIcons(icons) {
  return [{
    provide: NgIconsToken,
    useFactory: (parentIcons = inject(NgIconsToken, {
      optional: true,
      skipSelf: true
    })) => __spreadValues(__spreadValues({}, parentIcons?.reduce((acc, icons2) => __spreadValues(__spreadValues({}, acc), icons2), {})), icons),
    multi: true
  }];
}
var NgIconsToken = new InjectionToken("Icons Token");
function injectNgIcons() {
  return inject(NgIconsToken, {
    optional: true
  }) ?? [];
}
function coerceLoaderResult(result) {
  if (typeof result === "string") {
    return Promise.resolve(result);
  }
  if (isObservable(result)) {
    return result.toPromise();
  }
  return result;
}
function toPropertyName(str) {
  return str.replace(/([^a-zA-Z0-9])+(.)?/g, (_, __, chr) => chr ? chr.toUpperCase() : "").replace(/[^a-zA-Z\d]/g, "").replace(/^([A-Z])/, (m) => m.toLowerCase());
}
var uniqueId = 0;
var NgIcon = class _NgIcon {
  constructor() {
    this.config = injectNgIconConfig();
    this.icons = injectNgIcons();
    this.loader = injectNgIconLoader();
    this.cache = injectNgIconLoaderCache();
    this.preProcessor = injectNgIconPreProcessor();
    this.postProcessor = injectNgIconPostProcessor();
    this.injector = inject(Injector);
    this.renderer = inject(Renderer2);
    this.platform = inject(PLATFORM_ID);
    this.elementRef = inject(ElementRef);
    this.uniqueId = uniqueId++;
    this.logger = injectLogger();
    this.name = input();
    this.svg = input();
    this.size = input(this.config.size, {
      transform: coerceCssPixelValue
    });
    this.strokeWidth = input(this.config.strokeWidth);
    this.color = input(this.config.color);
    effect(() => this.updateIcon());
    const ariaHidden = inject(new HostAttributeToken("aria-hidden"), {
      optional: true
    });
    if (!ariaHidden) {
      this.elementRef.nativeElement.setAttribute("aria-hidden", "true");
    }
  }
  ngOnDestroy() {
    this.svgElement = void 0;
  }
  updateIcon() {
    return __async(this, null, function* () {
      const name = this.name();
      const svg = this.svg();
      if (svg !== void 0) {
        this.setSvg(svg);
        return;
      }
      if (name === void 0) {
        return;
      }
      const propertyName = toPropertyName(name);
      for (const icons of [...this.icons].reverse()) {
        if (icons[propertyName]) {
          this.setSvg(icons[propertyName]);
          return;
        }
      }
      if (this.loader) {
        const result = yield this.requestIconFromLoader(name);
        if (result !== null) {
          this.setSvg(result);
          return;
        }
      }
      this.logger.warn(`No icon named ${name} was found. You may need to import it using the withIcons function.`);
    });
  }
  setSvg(svg) {
    if (isPlatformServer(this.platform)) {
      this.elementRef.nativeElement.innerHTML = svg;
      this.elementRef.nativeElement.setAttribute("data-ng-icon-ssr", "");
      return;
    }
    if (this.elementRef.nativeElement.hasAttribute("data-ng-icon-ssr")) {
      this.elementRef.nativeElement.removeAttribute("data-ng-icon-ssr");
      this.svgElement = this.elementRef.nativeElement.querySelector("svg") ?? void 0;
      if (this.elementRef.nativeElement.innerHTML === svg) {
        return;
      }
    }
    if (this.svgElement) {
      this.renderer.removeChild(this.elementRef.nativeElement, this.svgElement);
    }
    if (svg === "") {
      return;
    }
    const template = this.renderer.createElement("template");
    svg = this.replaceIds(svg);
    this.renderer.setProperty(template, "innerHTML", this.preProcessor(svg));
    this.svgElement = template.content.firstElementChild;
    this.postProcessor(this.svgElement);
    this.renderer.appendChild(this.elementRef.nativeElement, this.svgElement);
  }
  replaceIds(svg) {
    if (!svg.includes("ID_PLACEHOLDER_")) {
      return svg;
    }
    const regex = /ID_PLACEHOLDER_(\d+)/g;
    const idMap = /* @__PURE__ */ new Map();
    const matches = new Set(svg.match(regex));
    if (matches === null) {
      return svg;
    }
    for (const match of matches) {
      const id = match.replace("ID_PLACEHOLDER_", "");
      const placeholder = `ng-icon-${this.uniqueId}-${idMap.size}`;
      idMap.set(id, placeholder);
      svg = svg.replace(new RegExp(match, "g"), placeholder);
    }
    return svg;
  }
  /**
   * Request the icon from the loader.
   * @param name The name of the icon to load.
   * @returns The SVG content for a given icon name.
   */
  requestIconFromLoader(name) {
    return new Promise((resolve) => {
      runInInjectionContext(this.injector, () => __async(this, null, function* () {
        if (this.cache) {
          const cachedResult = this.cache.get(name);
          if (typeof cachedResult === "string") {
            resolve(cachedResult);
            return;
          }
          if (cachedResult instanceof Promise) {
            const result2 = yield cachedResult;
            resolve(result2);
            return;
          }
        }
        const promise = coerceLoaderResult(this.loader(name));
        this.cache?.set(name, promise);
        const result = yield promise;
        this.cache?.set(name, result);
        resolve(result);
      }));
    });
  }
  static {
    this.ɵfac = function NgIcon_Factory(t) {
      return new (t || _NgIcon)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _NgIcon,
      selectors: [["ng-icon"]],
      hostAttrs: ["role", "img"],
      hostVars: 6,
      hostBindings: function NgIcon_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵstyleProp("--ng-icon__stroke-width", ctx.strokeWidth())("--ng-icon__size", ctx.size())("--ng-icon__color", ctx.color());
        }
      },
      inputs: {
        name: [InputFlags.SignalBased, "name"],
        svg: [InputFlags.SignalBased, "svg"],
        size: [InputFlags.SignalBased, "size"],
        strokeWidth: [InputFlags.SignalBased, "strokeWidth"],
        color: [InputFlags.SignalBased, "color"]
      },
      standalone: true,
      features: [ɵɵStandaloneFeature],
      decls: 0,
      vars: 0,
      template: function NgIcon_Template(rf, ctx) {
      },
      styles: ["[_nghost-%COMP%]{display:inline-block;width:var(--ng-icon__size, 1em);height:var(--ng-icon__size, 1em);line-height:initial;vertical-align:initial;overflow:hidden}[_nghost-%COMP%]     svg{width:inherit;height:inherit;vertical-align:inherit}@layer ng-icon{[_nghost-%COMP%]{color:var(--ng-icon__color, currentColor)}}"],
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgIcon, [{
    type: Component,
    args: [{
      selector: "ng-icon",
      template: "",
      standalone: true,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        role: "img",
        "[style.--ng-icon__stroke-width]": "strokeWidth()",
        "[style.--ng-icon__size]": "size()",
        "[style.--ng-icon__color]": "color()"
      },
      styles: [":host{display:inline-block;width:var(--ng-icon__size, 1em);height:var(--ng-icon__size, 1em);line-height:initial;vertical-align:initial;overflow:hidden}:host ::ng-deep svg{width:inherit;height:inherit;vertical-align:inherit}@layer ng-icon{:host{color:var(--ng-icon__color, currentColor)}}\n"]
    }]
  }], () => [], null);
})();
var NgIconsModule = class _NgIconsModule {
  constructor(icons) {
    if (Object.keys(icons).length === 0) {
      throw new Error("No icons have been provided. Ensure to include some icons by importing them using NgIconsModule.withIcons({ ... }).");
    }
  }
  /**
   * Define the icons that will be included in the application. This allows unused icons to
   * be tree-shaken away to reduce bundle size
   * @param icons The object containing the required icons
   */
  static withIcons(icons) {
    return {
      ngModule: _NgIconsModule,
      providers: provideIcons(icons)
    };
  }
  static {
    this.ɵfac = function NgIconsModule_Factory(t) {
      return new (t || _NgIconsModule)(ɵɵinject(NgIconsToken));
    };
  }
  static {
    this.ɵmod = ɵɵdefineNgModule({
      type: _NgIconsModule,
      imports: [NgIcon],
      exports: [NgIcon]
    });
  }
  static {
    this.ɵinj = ɵɵdefineInjector({});
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgIconsModule, [{
    type: NgModule,
    args: [{
      imports: [NgIcon],
      exports: [NgIcon]
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [NgIconsToken]
    }]
  }], null);
})();
var NG_ICON_DIRECTIVES = [NgIcon];
var NgIconStack = class _NgIconStack {
  constructor() {
    this.size = input.required();
  }
  static {
    this.ɵfac = function NgIconStack_Factory(t) {
      return new (t || _NgIconStack)();
    };
  }
  static {
    this.ɵcmp = ɵɵdefineComponent({
      type: _NgIconStack,
      selectors: [["ng-icon-stack"]],
      hostVars: 2,
      hostBindings: function NgIconStack_HostBindings(rf, ctx) {
        if (rf & 2) {
          ɵɵstyleProp("--ng-icon__size", ctx.size());
        }
      },
      inputs: {
        size: [InputFlags.SignalBased, "size"]
      },
      standalone: true,
      features: [ɵɵStandaloneFeature],
      ngContentSelectors: _c0,
      decls: 1,
      vars: 0,
      template: function NgIconStack_Template(rf, ctx) {
        if (rf & 1) {
          ɵɵprojectionDef();
          ɵɵprojection(0);
        }
      },
      styles: ["[_nghost-%COMP%]{display:inline-flex;justify-content:center;align-items:center;position:relative;width:var(--ng-icon__size);height:var(--ng-icon__size)}[_nghost-%COMP%]     ng-icon{position:absolute}"],
      changeDetection: 0
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgIconStack, [{
    type: Component,
    args: [{
      selector: "ng-icon-stack",
      standalone: true,
      template: "<ng-content />",
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "[style.--ng-icon__size]": "size()"
      },
      styles: [":host{display:inline-flex;justify-content:center;align-items:center;position:relative;width:var(--ng-icon__size);height:var(--ng-icon__size)}:host ::ng-deep ng-icon{position:absolute}\n"]
    }]
  }], null, null);
})();
export {
  NG_ICON_DIRECTIVES,
  NgGlyph,
  NgGlyphConfigToken,
  NgIcon,
  NgIconCacheToken,
  NgIcon as NgIconComponent,
  NgIconConfigToken,
  NgIconLoaderToken,
  NgIconStack,
  NgIconsModule,
  NgIconsToken,
  injectNgGlyphsConfig,
  injectNgIconConfig,
  injectNgIconLoader,
  injectNgIconLoaderCache,
  injectNgIcons,
  provideIcons,
  provideNgGlyphs,
  provideNgGlyphsConfig,
  provideNgIconLoader,
  provideNgIconsConfig,
  withCaching,
  withContentSecurityPolicy,
  withExceptionLogger
};
//# sourceMappingURL=@ng-icons_core.js.map
