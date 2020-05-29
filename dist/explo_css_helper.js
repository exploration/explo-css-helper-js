class ExploCSSHelper {

  /* API Methods */

  // Typically initialized like this:
  //
  //    const explo_css_helper = new ExploCSSHelper(ExploCSSDefinitions.json())
  //
  // However, you can pass in any JSON that conforms to:
  //   {classes: {}, styles: {}}
  //
  constructor(definitions = {classes: {}, styles: {}}) { 
    this.definitions = definitions
  }

  // Run this on document load to inject all style + class replacements:
  //
  //     css_helper = new ExploCSSHelper
  //     window.onload = () => css_helper.start()
  //
  start() {
    // inject styles + classes in every element that exists already
    this.injectAll(document.body)
    // observe elements for changes + run injectAll() on them when they change
    this.observe()
  }

  restart() {
    this.stopObserving()
    this.start()
  }
 
  // Add your own classes and styles! 
  // Send a "type" of either "class" or "style"
  //
  // Example:
  //
  //     css_helper.register('class', 'gross', 'x-bg-yellow x-green')
  //     css_helper.register('style', 'nasty', 'background: yellow')
  //
  register(type, key, val) {
    const style_type = type == 'class' ? 'classes' : 'styles'
    this.definitions[style_type][key] = val
  }

  /* Internal implementation */

  // Returns an array of the element and its children, that match the attr
  elementAndChildren(el, attr) {
    const all_elements = Array.from(el.getElementsByTagName('*'))
    all_elements.push(el)
    const toAttrMatch = (acc, child) => {
      if (child.attributes.hasOwnProperty(attr)) {
        acc.push(child)
        return acc
      } else {
        return acc
      }
    }

    return all_elements.reduce(toAttrMatch, [])
  }

  injectAll(element = document.body) {
    this.injectClasses(element)
    this.replaceClasses(element)
    this.injectStyles(element)
  }
  
  // Monitors for `x-class` attributes and injects the appropriate CSS  
  injectClasses(element) {
    const applyClasses = function(x_class) {
      const [div, definitions] = this
      if (x_class && definitions.classes[x_class]) {
        definitions.classes[x_class].split(' ')
          .forEach(class_name => div.classList.add(class_name))
      }
    }

    this.elementAndChildren(element, 'x-class').forEach(div => {
      const x_classes = div.attributes['x-class'].value.split(' ')
      // passing a custom variable to the function as its "this"
      if (x_classes) { x_classes.forEach(applyClasses, [div, this.definitions]) }
    })
  }

  // Monitors for `x-style` attributes and injects the appropriate styles  
  injectStyles(element) {
    const applyStyles = function(pairs) {
      const [key, value] = pairs.split(/:\s*/)
      // note that "this" here refers to a 'div', NOT the class object
      this.style[key] = value
    }

    const getAndApplyStyles = div => {
      const x_style = div.attributes['x-style'].value
      const style_mappings = this.definitions.styles[x_style]
      if (x_style && style_mappings) {
        // passing the div to the function as its "this"
        style_mappings.split(/;\s*/).forEach(applyStyles, div)
      }
    }

    this.elementAndChildren(element, 'x-style').forEach(getAndApplyStyles)
  }

  // Keep an eye on the page for sweet AJAX / dynamic calls + make sure that
  // any new elements get their classes + styles updated too!
  observe() {
    const config = { attributes: true, childList: true, characterData: true }
    const callback = (mutations_list) => {
      for (var mutation of mutations_list) {
        this.injectAll(mutation.target)
      }
    }

    this.observer = new MutationObserver(callback)
    this.observer.observe(document.body, config)
  }

  // Monitors for `x-class-replace` attributes and injects the appropriate CSS  
  replaceClasses(element) {
    this.elementAndChildren(element, 'x-class-replace').forEach(div => {
      const x_class_replace = div.attributes['x-class-replace'].value
      const combos = x_class_replace.split(/,\s*/)
      combos.forEach(combo => {
        const [key, val] = combo.split(/\s*->\s*/)
        const key_regexp = new RegExp(key)
        div.className = div.className.replace(key_regexp, val)
      })
    })
  }

  stopObserving() {
    this.observer.disconnect()
  }
}

class ExploCSSDefinitions {
  static json() {
    return {
  "classes": {
    "btn": "dib pv2 ph4 ph5-ns ba br1 x-b--orange x-bg-orange hover-bg-white white x-hover-orange lh-copy tc ttu no-underline x-oswald f5 f4-ns pointer",
    "btn-white": "dib pv2 ph4 ph5-ns ba br1 x-b--blue bg-white x-hover-bg-lightblue x-blue hover-white lh-copy tc ttu no-underline x-oswald f5 f4-ns pointer",
    "btn-l": "dib pv2 ph5 ph6-ns ba br1 x-b--orange x-bg-orange hover-bg-white white x-hover-orange lh-copy tc ttu no-underline x-oswald f4 f3-ns pointer",
    "btn-l-white": "dib pv2 ph5 ph6-ns ba br1 x-b--blue bg-white x-hover-bg-lightblue x-blue hover-white lh-copy tc ttu no-underline x-oswald f4 f3-ns pointer",
    "btn-s": "dib pv1 ph4 ph5-ns ba br1 x-b--orange x-bg-orange hover-bg-white white x-hover-orange lh-copy tc ttu no-underline x-oswald f6 f5-ns pointer",
    "btn-s-white": "dib pv1 ph4 ph5-ns ba br1 x-b--blue bg-white x-hover-bg-lightblue x-blue hover-white lh-copy tc ttu no-underline x-oswald f6 f5-ns pointer",
    "body": "w-100 x-tahoma f5 fw5 x-blue",
    "fieldset": "mt3 pv3 ph0 bn",
    "flash-alert": "pa3 ba bw0 br1 x-bg-palered x-red",
    "flash-notice": "pa3 ba bw0 br1 x-bg-aquablue white",
    "form": "w5 pa3 br1 bn x-bg-lightbrown",
    "form-wide": "w6 pa3 br1 bn x-bg-lightbrown",
    "h1": "mt5 mb1 f2 f1-ns fw7 x-tahoma",
    "h2": "mt4 mb1 f3 f2-ns fw7 x-tahoma x-orange",
    "h3": "mt3 mb1 f4 f3-ns fw7 x-tahoma",
    "h4": "mt2 mb1 f5 f4-ns fw7 x-tahoma",
    "headline": "mt5 mb1 f2 f1-ns x-impact",
    "input-error-label": "mt1 pa2 br1 bn x-bg-palered f6 lh-copy x-red",
    "input-text": "input-reset w-100 pa2 ba br1 x-b--blue x-focus-b-orange x-on x-bg-palegray hover-bg-white lh-copy",
    "input-text-narrow": "input-reset db w-100 w5-ns pa2 ba br1 x-b--blue x-focus-b-orange x-on x-bg-palegray hover-bg-white lh-copy",
    "label": "db mb1 f6 x-lightblue",
    "lead": "measure-wide lh-copy f5 fw7",
    "legend": "tc fw7",
    "link": "link x-orange x-hover-lightorange pointer",
    "p": "measure-wide lh-copy f5 fw5",
    "p-s": "measure-wide lh-copy f6 fw4",
    "select": "input-reset w-100 pa2 ba br1 x-b--blue x-focus-b-orange x-on x-bg-palegray hover-bg-white lh-copy pointer",
    "select-narrow": "input-reset w-100 w5-ns pa2 ba br1 x-b--blue x-focus-b-orange x-on x-bg-palegray hover-bg-white lh-copy pointer",
    "textarea": "input-reset w-100 h4 pa2 ba br1 x-b--blue x-focus-b-orange x-on x-bg-palegray hover-bg-white lh-copy"
  },
  "styles": {
    "select": "appearance: none; background:transparent; background: url(https://cdn.lab.explo.org/images/input_select_arrow.svg) 96% / 15% no-repeat #FFF;"
  }
}
  }
}
