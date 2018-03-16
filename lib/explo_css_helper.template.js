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
 
  // Add your own classes and styles! 
  // Send a "type" of either "class" or "style"
  //
  // Example:
  //
  //     css_helper.register('class', 'gross', 'x-bg-yellow x-green')
  //
  register(type, key, val) {
    const style_type = type == 'class' ? 'classes' : 'styles'
    this.definitions[style_type][key] = val
  }

  /* Internal implementation */

  injectAll(element = document.body) {
    this.injectClasses(element)
    this.replaceClasses(element)
    this.injectStyles(element)
  }
  
  // Monitors for `x-class` attributes and injects the appropriate CSS  
  injectClasses(element) {
    this.searchZone(element, 'x-class').forEach(div => {
      const x_classes = div.attributes['x-class'].value.split(' ')
      if (x_classes) {
        x_classes.forEach(x_class => {
          if (x_class && this.definitions.classes[x_class]) {
            this.definitions.classes[x_class].split(' ')
              .forEach(class_name => div.classList.add(class_name))
          }
        })
      }
    })
  }

  // Monitors for `x-style` attributes and injects the appropriate styles  
  injectStyles(element) {
    this.searchZone(element, 'x-style').forEach(div => {
      const x_style = div.attributes['x-style'].value
      if (x_style && this.definitions.styles[x_style]) {
        this.definitions.styles[x_style].split(/;\s*/).forEach(key_val => {
          const [key, value] = key_val.split(/:\s*/)
          div.style[key] = value
        })
      }
    })
  }

  // Monitors for `x-class-replace` attributes and injects the appropriate CSS  
  replaceClasses(element) {
    this.searchZone(element, 'x-class-replace').forEach(div => {
      const x_class_replace = div.attributes['x-class-replace'].value
      const combos = x_class_replace.split(/,\s*/)
      combos.forEach(combo => {
        const [key, val] = combo.split(/\s*->\s*/)
        const key_regexp = new RegExp(key)
        div.className = div.className.replace(key_regexp, val)
      })
    })
  }

  // Keep an eye on the page for sweet AJAX / dynamic calls + make sure that
  // any new elements get their classes + styles updated too!
  observe() {
    const config = { attributes: true, childList: true }
    const callback = (mutations_list) => {
      for (var mutation of mutations_list) {
        this.injectAll(mutation.target)
      }
    }

    this.observer = new MutationObserver(callback)
    this.observer.observe(document.body, config)
  }

  stopObserving() {
    this.observer.disconnect()
  }

  // Returns an array of the element and its children, that match the attr
  searchZone(el, attr) {
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
}
