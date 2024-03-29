# Dark Mode Toggle
A simple toggle button, which can be used in any context. It's built as WebComponent and available as [npm package](https://www.npmjs.com/package/@h0rn0chse/dark-mode-toggle).

The animation data is from [cawfree/react-dark-mode-toggle](https://github.com/cawfree/react-dark-mode-toggle), which only supports react. This project shall allow the usage of the nice animations in non-react enviroments. It also supports a very basic implementation for changing dark/ light themes.

<br>

<img src="./assets/screenshot.png" title="Screenshot" />

## Usage
Please checkout the [demo](https://h0rn0chse.github.io/dark-mode-toggle). You can add the resources either locally, via a CDN or as [npm package](https://www.npmjs.com/package/@h0rn0chse/dark-mode-toggle):
```html
<!-- @h0rn0chse/dark-mode-toggle dependency -->
<script src="https://unpkg.com/lottie-web@5.7/build/player/lottie.min.js"></script>

<script src="https://unpkg.com/@h0rn0chse/dark-mode-toggle@2/dist/bundle.min.js"></script>

<!--The css is only required when the button is NOT used as WebComponent-->
<link rel="stylesheet" href="https://unpkg.com/@h0rn0chse/dark-mode-toggle@2/dist/bundle.min.css">
```

You can either add a Button as WebComponent
```html
<dark-mode-toggle
    id="toggle"
    width="320"
/>
```
or via a scrict dynamically:
```javascript
const { Button, ThemeHandler } = globalThis.darkModeToggle;

const button = new Button(document.querySelector("#container"), { width: 320 });
```

# Documentation

## new Button(container, options)
Creates a new Button and places it into the provided container.
### option.width (default: 320)
The width of the button in pixels. Be aware that `options.height` will be preferred over `options.width` to keep the button`s aspect ratio.

### option.height
The height of the button in pixels. Be aware that `options.height` will be preferred over `options.width` to keep the button`s aspect ratio.

### option.useThemeHandler (default: true)
A boolean wether to use the themeHandler and its logic. Be aware that once a button was created using the themeHandler it's not possible to remove the themeHandler.

### option.theme
A enum which can be either `dark` or `light`. Defines the initial state of the button. You might use this option when you are using your own theme handler.

### Button.setWidth(width)
Sets the width of the button. The `width` is required to be provided as number (of pixels). Keeps the aspect ratio of the button.

### Button.setHeight(height)
Sets the height of the button. The `height` is required to be provided as number (of pixels). Keeps the aspect ratio of the button.

### Button.setTheme(theme, skipAnimation=false)
Sets the theme of the button by toggling the button to the desired state. Valid values for `theme` are `dark` and `light`. You can skip the animation by setting `skipAnimation` to `true`.

## Button Events
Please look for [Events](#events) on details how to register and deregister to events.

### click
Gets emitted once the button was clicked. Provides the upcoming theme via the eventData as parameter `theme`.

### animationStart
Gets emitted once the button starts an animation. This might also abort the previous animation. Provides the upcoming theme via the eventData as parameter `theme`.

### animationComplete
Gets emitted once the button completes an animation. This will not be called on aborted animations. Provides the final theme via the eventData as parameter `theme`.

## ThemeHandler
Handles the `dark` and `light` theming. The application is required to load both themes as separate css files. These css nodes are required to have the `id="dark"` and `"light"`. The ThemeHandler swaps those files according to the current theme.

### ThemeHandler.setTheme(theme)
Sets the current Theme which can be either `dark` or `light`.

### ThemeHandler.getTheme()
Returns the current Theme which is either `dark` or `light`.

## ThemeHandler Events
Please look for [Events](#events) on details how to register and deregister to events.

### themeChanged
Gets emitted once the theme was changed either via system preferences, via setTheme or via the ToggleButton. Provides the new theme via the eventData as parameter `theme`. Be aware that the theme was not loaded yet.

### themeLoaded
Gets emitted once the loading of the theme was completed. Provides the new theme via the eventData as parameter `theme`.

## Events
The `ThemeHandler` and the `Button` implement Events via the EventProvider. These events aren't native and get called synchronously after the event was emitted. Therefore it's also necessary to remove the handlers again to avoid memory leaks.

### EventProvider.on(name, callback, [scope])
Subscribes to an event. Please be aware that a handler cannot be subscribed multiple times for the same scope.
### EventProvider.once(name, callback, [scope])
Subscribes once to an event. Please be aware that a handler which was already attached to an event via `EventProvider.on` cannot be attached via `EventProvider.once`.

### EventProvider.off(name, callback, [scope])
Removes the subscription to an event. This method also works for handlers attached via `EventProvider.once` and which were not triggered yet.

## WebComponent

The WebComponent accepts all the options the [Button](#new-buttoncontainer-options) provides. It also provides the API of the [EventProivder](#events) and the [Button](#new-buttoncontainer-options). The WebComponent reacts dynamically on `width`, `height` and `theme`. Simliar to the options you cannot simultaneously set `width` and `height`.

## Libraries
 * AnimationData [cawfree/react-dark-mode-toggle](https://github.com/cawfree/react-dark-mode-toggle)
 * Player [LottieFiles/lottie-web](https://github.com/LottieFiles/lottie-web)
 * Feather Icons [github.com/feathericons/feather](https://github.com/feathericons/feather)
 * Github Corners [github.com/YuskaWu/github-corner-element](https://github.com/YuskaWu/github-corner-element)
