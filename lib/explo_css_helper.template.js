class ExploCSSHelper {

  /* API Methods */

  // Typically initialized like this:
  //
  //    const explo_css_helper = new ExploCSSHelper(ExploCSSDefinitions.json())
  //
  constructor(definitions = {classes: {}, styles: {}}) { 
    this.definitions = definitions
  }

  // Run this on document load to inject all style + class replacements with:
  //
  //     css_helper = new ExploCSSHelper
  //     window.onload = () => css_helper.injectStyles()
  //
  inject() {
    this.injectClasses()
    this.replaceClasses()
    this.injectStyles()
  }
 
  // Add your own classes and styles! 
  // Send a "type" of either "class" or "style"
  //
  // Example:
  //
  //     css_helper.register('class', 'gross', 'x-bg-yellow x-green')
  //
  register(type, key, val) {
    const style_type = type == "class" ? "classes" : "styles"
    this.definitions[style_type][key] = val
  }

  /* Internal implementation */
  
  // Monitors for `x-class` attributes and injects the appropriate CSS  
  injectClasses() {
    document.querySelectorAll('div[x-class]').forEach(div => {
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

  // Monitors for `x-class-replace` attributes and injects the appropriate
  // CSS  
  replaceClasses() {
    document.querySelectorAll('div[x-class-replace]').forEach(div => {
      const x_class_replace = div.attributes['x-class-replace'].value
      const combos = x_class_replace.split(/,\s*/)
      combos.forEach(combo => {
        const [key, val] = combo.split(/\s*->\s*/)
        const key_regexp = new RegExp(key)
        div.className = div.className.replace(key_regexp, val)
      })
    })
  }

  // Monitors for `x-class` attributes and injects the appropriate CSS  
  injectStyles() {
    document.querySelectorAll('div[x-style]').forEach(div => {
      const x_style = div.attributes['x-style'].value
      if (x_style && this.definitions.styles[x_style]) {
        this.definitions.styles[x_style].split(/;\s*/).forEach(key_val => {
          const [key, value] = key_val.split(/:\s*/)
          div.style[key] = value
        })
      }
    })
  }
}
