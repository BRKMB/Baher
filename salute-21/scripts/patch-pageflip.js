/**
 * Patches page-flip for correct reverse turns on portrait/mobile.
 *
 * Goals:
 * 1) Back peels from the LEFT (not the same as next/from the right).
 * 2) The page revealed under the peel is the previous page — same page that
 *    lands after the turn completes.
 *
 * Approach:
 * - Shift portrait BACK coordinates onto the visible page (library otherwise
 *   peels into the off-screen left half).
 * - Rewrite portrait BACK leaves: peel the CURRENT page away (temp copy) and
 *   draw the PREVIOUS page as the underlay (bottom). Keep BACK direction so
 *   the curl comes from the left.
 * - Always draw the bottom page in portrait BACK (stock skips it).
 *
 * Also: landscape soft BACK hides the current left page so it does not jump
 * when the previous spread settles.
 *
 * Soft density is required for the realistic paper-curl animation.
 * Safe to re-run; no-ops if already patched.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const files = [
  'node_modules/page-flip/dist/js/page-flip.module.js',
  'node_modules/page-flip/dist/js/page-flip.browser.js',
]

function applyOnce(source, oldStr, newStr) {
  if (source.includes(newStr)) return { source, changed: false }
  if (!source.includes(oldStr)) return { source, changed: false }
  return { source: source.split(oldStr).join(newStr), changed: true }
}

let changed = 0
for (const rel of files) {
  const file = path.join(root, rel)
  if (!fs.existsSync(file)) continue
  let source = fs.readFileSync(file, 'utf8')
  let next = source

  // Portrait BACK: map geometry onto the visible page (peel from the left)
  {
    const r = applyOnce(
      next,
      'convertToPage(t,e){e||(e=this.direction);const i=this.getRect();return{x:0===e?t.x-i.left-i.width/2:i.width/2-t.x+i.left,y:t.y-i.top}}',
      'convertToPage(t,e){e||(e=this.direction);const i=this.getRect();let s;return s=0===e?t.x-i.left-i.width/2:"portrait"===this.orientation?i.width/2-(t.x-i.pageWidth)+i.left:i.width/2-t.x+i.left,{x:s,y:t.y-i.top}}',
    )
    next = r.source
    if (r.changed) changed += 1
  }
  {
    const r = applyOnce(
      next,
      'convertToGlobal(t,e){if(e||(e=this.direction),null==t)return null;const i=this.getRect();return{x:0===e?t.x+i.left+i.width/2:i.width/2-t.x+i.left,y:t.y+i.top}}',
      'convertToGlobal(t,e){if(e||(e=this.direction),null==t)return null;const i=this.getRect();let s;return s=0===e?t.x+i.left+i.width/2:"portrait"===this.orientation?i.width/2-t.x+i.left+i.pageWidth:i.width/2-t.x+i.left,{x:s,y:t.y+i.top}}',
    )
    next = r.source
    if (r.changed) changed += 1
  }

  // Portrait-safe flipPrev: hit the left edge of the visible page → BACK
  {
    const r = applyOnce(
      next,
      'flipPrev(t){this.flip({x:10,y:"top"===t?1:this.render.getRect().height-2})}',
      'flipPrev(t){const e=this.render.getRect(),i="portrait"===this.render.getOrientation()?e.left+e.pageWidth+12:e.left+12;this.flip({x:i,y:"top"===t?e.top+1:e.top+e.height-2})}',
    )
    next = r.source
    if (r.changed) changed += 1
  }

  // Always draw bottom page — needed so portrait BACK can reveal the previous page
  {
    const r = applyOnce(
      next,
      'drawBottomPage(){if(null===this.bottomPage)return;const t=null!=this.flippingPage?this.flippingPage.getDrawingDensity():null;"portrait"===this.orientation&&1===this.direction||(this.bottomPage.getElement().style.zIndex=(this.getSettings().startZIndex+3).toString(10),this.bottomPage.draw(t))}',
      'drawBottomPage(){if(null===this.bottomPage)return;const t=null!=this.flippingPage?this.flippingPage.getDrawingDensity():null;this.bottomPage.getElement().style.zIndex=(this.getSettings().startZIndex+3).toString(10),this.bottomPage.draw(t)}',
    )
    next = r.source
    if (r.changed) changed += 1
  }

  // Landscape soft BACK: do not keep drawing the current left page
  {
    const r = applyOnce(
      next,
      'drawLeftPage(){"portrait"!==this.orientation&&null!==this.leftPage&&(1===this.direction&&null!==this.flippingPage&&"hard"===this.flippingPage.getDrawingDensity()?(this.leftPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10),this.leftPage.setHardDrawingAngle(180+this.flippingPage.getHardAngle()),this.leftPage.draw(this.flippingPage.getDrawingDensity())):this.leftPage.simpleDraw(0))}',
      'drawLeftPage(){if("portrait"===this.orientation||null===this.leftPage)return;if(1===this.direction&&null!==this.flippingPage){if("hard"===this.flippingPage.getDrawingDensity()){this.leftPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10),this.leftPage.setHardDrawingAngle(180+this.flippingPage.getHardAngle()),this.leftPage.draw(this.flippingPage.getDrawingDensity())}return}this.leftPage.simpleDraw(0)}',
    )
    next = r.source
    if (r.changed) changed += 1
  }

  // Detect Flip + FlipCalculation class letters from this build
  const flipClass = (next.match(
    /class ([a-z])\{constructor\(t,e\)\{this\.flippingPage=null,this\.bottomPage=null,this\.calc=null,this\.state="read"/,
  ) || [])[1]
  const calcClass = (next.match(
    /class ([a-z])\{constructor\(t,e,i,s\)\{this\.direction=t,this\.corner=e/,
  ) || [])[1]

  if (flipClass && calcClass) {
    // Track portraitReverse on Flip controller
    {
      const r = applyOnce(
        next,
        `class ${flipClass}{constructor(t,e){this.flippingPage=null,this.bottomPage=null,this.calc=null,this.state="read",this.render=t,this.app=e}`,
        `class ${flipClass}{constructor(t,e){this.flippingPage=null,this.bottomPage=null,this.calc=null,this.state="read",this.portraitReverse=!1,this.render=t,this.app=e}`,
      )
      next = r.source
      if (r.changed) changed += 1
    }

    // Replace old reverse-as-forward hooks with left-peel reverse hooks
    {
      const r = applyOnce(
        next,
        'fold(t){if(this.setState("user_fold"),null===this.calc){if(!this.start(t))return;this.applyPortraitReverseAsForward()}this.do(this.render.convertToPage(t))}',
        'fold(t){if(this.setState("user_fold"),null===this.calc){if(!this.start(t))return;this.applyPortraitReverseFromLeft()}this.do(this.render.convertToPage(t))}',
      )
      next = r.source
      if (r.changed) changed += 1
    }
    {
      const r = applyOnce(
        next,
        'fold(t){this.setState("user_fold"),null===this.calc&&this.start(t),this.do(this.render.convertToPage(t))}',
        'fold(t){if(this.setState("user_fold"),null===this.calc){if(!this.start(t))return;this.applyPortraitReverseFromLeft()}this.do(this.render.convertToPage(t))}',
      )
      next = r.source
      if (r.changed) changed += 1
    }
    {
      const r = applyOnce(
        next,
        'if(null!==this.calc&&this.render.finishAnimation(),!this.start(t))return;this.applyPortraitReverseAsForward();const e=this.getBoundsRect();this.setState("flipping");',
        'if(null!==this.calc&&this.render.finishAnimation(),!this.start(t))return;this.applyPortraitReverseFromLeft();const e=this.getBoundsRect();this.setState("flipping");',
      )
      next = r.source
      if (r.changed) changed += 1
    }
    {
      const r = applyOnce(
        next,
        'if(null!==this.calc&&this.render.finishAnimation(),!this.start(t))return;const e=this.getBoundsRect();this.setState("flipping");',
        'if(null!==this.calc&&this.render.finishAnimation(),!this.start(t))return;this.applyPortraitReverseFromLeft();const e=this.getBoundsRect();this.setState("flipping");',
      )
      next = r.source
      if (r.changed) changed += 1
    }

    // Completion: portraitReverse must go to previous page
    {
      const r = applyOnce(
        next,
        'i&&(1===this.calc.getDirection()?this.app.turnToPrevPage():this.app.turnToNextPage())',
        'i&&(this.portraitReverse||1===this.calc.getDirection()?this.app.turnToPrevPage():this.app.turnToNextPage())',
      )
      next = r.source
      if (r.changed) changed += 1
    }

    // reset portraitReverse flag
    {
      const r = applyOnce(
        next,
        'reset(){this.calc=null,this.flippingPage=null,this.bottomPage=null}',
        'reset(){this.calc=null,this.flippingPage=null,this.bottomPage=null,this.portraitReverse=!1}',
      )
      next = r.source
      if (r.changed) changed += 1
    }

    // Strip old reverse-as-forward helper if present
    if (next.includes('applyPortraitReverseAsForward(){')) {
      next = next.replace(/applyPortraitReverseAsForward\(\)\{[^}]+\}/, '')
      changed += 1
    }

    // Inject left-peel reverse helper after flipPrev (once)
    const flipPrevPatched =
      'flipPrev(t){const e=this.render.getRect(),i="portrait"===this.render.getOrientation()?e.left+e.pageWidth+12:e.left+12;this.flip({x:i,y:"top"===t?e.top+1:e.top+e.height-2})}'
    // Peel CURRENT page with BACK direction (from the left); reveal PREVIOUS underneath.
    const helper = `applyPortraitReverseFromLeft(){if(null===this.calc||"portrait"!==this.render.getOrientation()||1!==this.calc.getDirection())return;const t=this.app.getPageCollection().getCurrentSpreadIndex();if(t<1)return;const e=this.app.getPageCollection().getPages(),i=this.calc.getCorner(),s=this.getBoundsRect();this.flippingPage=e[t].newTemporaryCopy(),this.bottomPage=e[t-1],this.portraitReverse=!0,this.render.setDirection(1),this.calc=new ${calcClass}(1,i,s.pageWidth.toString(10),s.height.toString(10)),this.render.setBottomPage(this.bottomPage),this.render.setFlippingPage(this.flippingPage)}`

    if (!next.includes('applyPortraitReverseFromLeft(){')) {
      if (next.includes(flipPrevPatched)) {
        next = next.replace(flipPrevPatched, `${flipPrevPatched}${helper}`)
        changed += 1
      }
    }
  }

  if (next !== source) fs.writeFileSync(file, next)
}

console.log(`[patch-pageflip] applied ${changed} replacement(s)`)
