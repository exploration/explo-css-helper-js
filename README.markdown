# EXPLO CSS Helper (JavaScript Edition)

This module allows us to simplify our [Tachyons-based CSS approach](https://styleguide.lab.explo.org/) by storing the common CSS class combinations that we use across apps.

For example, it's nicer to read:

```html
<div x-class="btn">A Button</div>
```

...than it is to read (and write!):

```html
<div class="dib pv2 ph5 ba br1 x-b--orange x-bg-orange hover-bg-white white x-hover-orange lh-copy tc f6 pointer">A Button</div>
```

It's not only nicer to read, it's much easier to see the intent of the code. You can tell that we wanted a button. Why not just use a `button` CSS class and call it day, you ask? Because we often want to combine styles and even modify the existing component, with as little effort as possible! Read on, intrepid coder...

# Setup
Typically you'll include `dist/explo_css_helper.js` in your `<HEAD>`:

```html
<script src="explo_css_helper.js"></script>
# or, the CDN version:
<script src="//cdn.lab.explo.org/js/explo_css_helper.js"></script>
```

...and then invoke it like this at the bottom of your BODY:

```html
  <script>
      // It's best to run this right at the end of the body, for speedy rendering
      const explo_css_helper = new ExploCSSHelper(ExploCSSDefinitions.json())
      explo_css_helper.start()
  </script>
</body>
```

**NOTE** that if you're using Rails and/or Turbolinks, you'll want to use a different CSS helper invocation. Include the following somewhere in your javascript assets:

```javascript
document.addEventListener("turbolinks:load", function(event) {
  if (!event.data.timing.visitStart) {
    // Initial page load sets a global helper
    window.explo_css_helper = new ExploCSSHelper(ExploCSSDefinitions.json())
    explo_css_helper.register("class", "courses-h1", "mt2 mb1 f3 f2-ns fw7 x-tahoma")
  }
  explo_css_helper.start()
})
```

# Usage

## Basic Usage

Once you're all set up + injecting CSS magic, usage is like this:

```html
<!-- to make, for example some "lead copy" -->
<div x-class="lead">My Lead Copy...</div>
```

When the page gets viewed, your `div` will now contain CSS classes like `measure-wide lh-copy f5 fw7`. Handy!

You can also mix + match `x-class` tags with regular classes:

```html
<div x-class="lead" class="x-bg-palered">Lead copy with pale red background</div>
```

...or even combine two different `x-class`es in one:

```html
<div x-class="lead link">A link, which is also lead copy</div>
```

The same thing works for styles. This will interpolate bare CSS style attributes on a node, instead of the higher-level CSS classes:

```html
<select x-style-"select">...select field options etc.</select>
```

## Register Your Own Classes or Styles

If you have your own "components" that aren't part of the standard set, you can register those in the same JavaScript area where you run `inject()`:

```javascript
explo_css_helper.register('class', 'h1-orange', 'mt5 mb1 f2 f1-ns fw7 x-tahoma x-orange')
explo_css_helper.register('style', 'purple-text', 'color: purple;')
// put ^^ these before...
explo_css_helper.start()
```

Once you've registered a class or style, it becomes available in the same way as the standard set:

```html
<h1 x-class="h1-orange">My Orange H1</h1>
```

## Replacing Class Defaults

_Occasionally_, (and we _do_ mean occasionally!), you'll want to only slightly modify an existing class attribute. Say you want the `h1` `x-class`, but in this _one case_, you just need less top-padding. You've inspected the element, and seen this is the class list:

```css
mt5 mb1 f2 f1-ns fw7 x-tahoma
```

...so you just want to replace that `mt5` with, say, `mt4`. Easy enough:

```html
<h1 x-class="h1" x-class-replace="mt5 -> mt4">Slightly More Compact H1</h1>
```

If you need to combine multiple replacements, you can comma-separate them:

```html
<h1 x-class="h1" x-class-replace="mt5 -> mt4, f2 -> f3>H1 With Smaller Font on Mobile</h1>
```

The replace syntax will read whatever is to the left of the `->` as a regular expression, so you can even do things like:

```html
<h1 x-class="h1" x-class-replace="m\w* -> ma4">Replace any margin with 'ma4'</h1>
```

If you find yourself using this feature a lot, you probably want to register your own components and use those.

# Development

Run `bin/setup` to install all necessary packages for linting, testing, etc.

The main JS file is in `lib/explo_css_helper.template.js`. Run `bin/build` to ensure that it's compiled with the latest styles. The output will go into `dist/explo_css_helper.js`. Run `bin/watch` to run a "server" which will keep an eye on the template file for changes + compile automatically.

To view the 'test suite', use `bin/test_server`, which hosts `test/index.html` by default. To [lint](https://eslint.org/) the JavaScript code, run `bin/lint`.

Run `bin/minify` to generate a minified version of the code.

To fetch the [latest styles](https://bitbucket.org/snippets/explo/EM6eA/explo-css-styles-classes), run `bin/fetch`.
