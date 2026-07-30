/**
 * Patches page-flip for correct reverse turns on portrait/mobile.
 *
 * Problem: native portrait BACK peels the previous page with mirrored soft
 * geometry, so the page you see mid-flip does not match the page that lands
 * after the turn completes.
 *
 * Fix: rewrite portrait BACK as a forward peel of the CURRENT page that
 * reveals the PREVIOUS page underneath (bottom page). Completion still goes
 * to the previous page via portraitReverse. Mid-flip and final page match.
 *
 * Also: landscape soft BACK hides the current left page so it does not jump
 * to a different left page when the spread settles.
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

  // --- Strip coordinate-shift BACK patches (caused mid/end page mismatch) ---
  {
    const r = applyOnce(
      next,
      'convertToPage(t,e){e||(e=this.direction);const i=this.getRect();let s;return s=0===e?t.x-i.left-i.width/2:"portrait"===this.orientation?i.width/2-(t.x-i.pageWidth)+i.left:i.width/2-t.x+i.left,{x:s,y:t.y-i.top}}',
      'convertToPage(t,e){e||(e=this.direction);const i=this.getRect();return{x:0===e?t.x-i.left-i.width/2:i.width/2-t.x+i.left,y:t.y-i.top}}',
    )
    next = r.source
    if (r.changed) changed += 1
  }
  {
    const r = applyOnce(
      next,
      'convertToGlobal(t,e){if(e||(e=this.direction),null==t)return null;const i=this.getRect();let s;return s=0===e?t.x+i.left+i.width/2:"portrait"===this.orientation?i.width/2-t.x+i.left+i.pageWidth:i.width/2-t.x+i.left,{x:s,y:t.y+i.top}}',
      'convertToGlobal(t,e){if(e||(e=this.direction),null==t)return null;const i=this.getRect();return{x:0===e?t.x+i.left+i.width/2:i.width/2-t.x+i.left,y:t.y+i.top}}',
    )
    next = r.source
    if (r.changed) changed += 1
  }
  // Stock BACK flipping page (no forced temp copy) — reverse-as-forward handles portrait
  {
    const r = applyOnce(
      next,
      'if("portrait"===this.render.getOrientation())return 0===t?this.pages[e].newTemporaryCopy():this.pages[e-1].newTemporaryCopy();',
      'if("portrait"===this.render.getOrientation())return 0===t?this.pages[e].newTemporaryCopy():this.pages[e-1];',
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

  // Landscape soft BACK: do not keep drawing the current left page (it jumps
  // to a different page when the previous spread settles).
  {
    const r = applyOnce(
      next,
      'drawLeftPage(){"portrait"!==this.orientation&&null!==this.leftPage&&(1===this.direction&&null!==this.flippingPage&&"hard"===this.flippingPage.getDrawingDensity()?(this.leftPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10),this.leftPage.setHardDrawingAngle(180+this.flippingPage.getHardAngle()),this.leftPage.draw(this.flippingPage.getDrawingDensity())):this.leftPage.simpleDraw(0))}',
      'drawLeftPage(){if("portrait"===this.orientation||null===this.leftPage)return;if(1===this.direction&&null!==this.flippingPage){if("hard"===this.flippingPage.getDrawingDensity()){this.leftPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10),this.leftPage.setHardDrawingAngle(180+this.flippingPage.getHardAngle()),this.leftPage.draw(this.flippingPage.getDrawingDensity())}return}this.leftPage.simpleDraw(0)}',
    )
    next = r.source
    if (r.changed) changed += 1
  }

  // --- Portrait reverse-as-forward ---
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

    // fold(): apply rewrite after start
    {
      const r = applyOnce(
        next,
        'fold(t){this.setState("user_fold"),null===this.calc&&this.start(t),this.do(this.render.convertToPage(t))}',
        'fold(t){if(this.setState("user_fold"),null===this.calc){if(!this.start(t))return;this.applyPortraitReverseAsForward()}this.do(this.render.convertToPage(t))}',
      )
      next = r.source
      if (r.changed) changed += 1
    }

    // flip(): apply rewrite before animating
    {
      const r = applyOnce(
        next,
        'if(null!==this.calc&&this.render.finishAnimation(),!this.start(t))return;const e=this.getBoundsRect();this.setState("flipping");',
        'if(null!==this.calc&&this.render.finishAnimation(),!this.start(t))return;this.applyPortraitReverseAsForward();const e=this.getBoundsRect();this.setState("flipping");',
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

    // Inject helper once after flipPrev
    const flipPrevPatched =
      'flipPrev(t){const e=this.render.getRect(),i="portrait"===this.render.getOrientation()?e.left+e.pageWidth+12:e.left+12;this.flip({x:i,y:"top"===t?e.top+1:e.top+e.height-2})}'
    const helper = `applyPortraitReverseAsForward(){if(null===this.calc||"portrait"!==this.render.getOrientation()||1!==this.calc.getDirection())return;const t=this.app.getPageCollection().getCurrentSpreadIndex();if(t<1)return;const e=this.app.getPageCollection().getPages(),i=this.calc.getCorner(),s=this.getBoundsRect();this.flippingPage=e[t].newTemporaryCopy(),this.bottomPage=e[t-1],this.portraitReverse=!0,this.render.setDirection(0),this.calc=new ${calcClass}(0,i,s.pageWidth.toString(10),s.height.toString(10)),this.render.setBottomPage(this.bottomPage),this.render.setFlippingPage(this.flippingPage)}`

    if (!next.includes('applyPortraitReverseAsForward(){')) {
      if (next.includes(flipPrevPatched)) {
        next = next.replace(flipPrevPatched, `${flipPrevPatched}${helper}`)
        changed += 1
      }
    }
  }

  if (next !== source) fs.writeFileSync(file, next)
}

console.log(`[patch-pageflip] applied ${changed} replacement(s)`)
