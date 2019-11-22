/**
 * Click on things
 */
// Number of frames mouse has been downed
let mouseDowned = 0
// Max number of frames to keep down
let maxMouseDownedFrames = 5
let mouseUp = false
let thresholdMet = false
// For some reason the linter isn't caching this
// eslint-disable-next-line no-unused-vars
let mouseDrag = false

window.Handsfree.use('head.click', ({ head, config }) => {
  thresholdMet = false

  Object.keys(config.plugin.click.morphs).forEach((key) => {
    const morph = config.plugin.click.morphs[key]
    if (head.morphs[key] >= morph) thresholdMet = true
  })

  if (thresholdMet) {
    mouseDowned++
    document.body.classList.add('handsfree-clicked')
  } else {
    mouseUp = mouseDowned
    mouseDowned = 0
    mouseDrag = false
    document.body.classList.remove('handsfree-clicked')
  }

  // Set the state
  if (mouseDowned > 0 && mouseDowned < maxMouseDownedFrames)
    head.pointer.state = 'mouseDown'
  else if (mouseDowned > maxMouseDownedFrames) head.pointer.state = 'mouseDrag'
  else if (mouseUp) head.pointer.state = 'mouseUp'
  else ''

  // Actually click something (or focus it)
  if (head.pointer.state === 'mouseDown') {
    const $el = document.elementFromPoint(head.pointer.x, head.pointer.y)
    if ($el) {
      $el.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          clientX: head.pointer.x,
          clientY: head.pointer.y
        })
      )

      // Focus
      if (['INPUT', 'TEXTAREA', 'BUTTON', 'A'].includes($el.nodeName))
        $el.focus()
    }
  }
})