/**
 * Patches page-flip for correct reverse turns on portrait/mobile.
 *
 * Problem: native BACK geometry mirrors into the off-screen left half, so
 * reverse looks broken / wrong. A previous approach rewrote BACK as FORWARD,
 * which made reverse animate from the RIGHT (same as next) — wrong UX.
 *
 * Fix: keep BACK direction, but shift portrait BACK coordinates by one page
 * width so the reverse peel lands on the visible page and comes from the LEFT.
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

const replacements = [
  // Portrait-safe flipPrev: hit the left edge of the visible page → BACK
  {
    old: 'flipPrev(t){this.flip({x:10,y:"top"===t?1:this.render.getRect().height-2})}',
    new: 'flipPrev(t){const e=this.render.getRect(),i="portrait"===this.render.getOrientation()?e.left+e.pageWidth+12:e.left+12;this.flip({x:i,y:"top"===t?e.top+1:e.top+e.height-2})}',
  },
  // Portrait BACK: map onto the visible page (shift by pageWidth) so reverse
  // peels from the LEFT across the screen instead of into the off-screen half.
  {
    old: 'convertToPage(t,e){e||(e=this.direction);const i=this.getRect();return{x:0===e?t.x-i.left-i.width/2:i.width/2-t.x+i.left,y:t.y-i.top}}',
    new: 'convertToPage(t,e){e||(e=this.direction);const i=this.getRect();let s;return s=0===e?t.x-i.left-i.width/2:"portrait"===this.orientation?i.width/2-(t.x-i.pageWidth)+i.left:i.width/2-t.x+i.left,{x:s,y:t.y-i.top}}',
  },
  {
    old: 'convertToGlobal(t,e){if(e||(e=this.direction),null==t)return null;const i=this.getRect();return{x:0===e?t.x+i.left+i.width/2:i.width/2-t.x+i.left,y:t.y+i.top}}',
    new: 'convertToGlobal(t,e){if(e||(e=this.direction),null==t)return null;const i=this.getRect();let s;return s=0===e?t.x+i.left+i.width/2:"portrait"===this.orientation?i.width/2-t.x+i.left+i.pageWidth:i.width/2-t.x+i.left,{x:s,y:t.y+i.top}}',
  },
  // Soft-page BACK in portrait: use a temp copy so the real previous page
  // isn't fighting the underlay while it peels in from the left.
  {
    old: 'if("portrait"===this.render.getOrientation())return 0===t?this.pages[e].newTemporaryCopy():this.pages[e-1];',
    new: 'if("portrait"===this.render.getOrientation())return 0===t?this.pages[e].newTemporaryCopy():this.pages[e-1].newTemporaryCopy();',
  },
]

let changed = 0
for (const rel of files) {
  const file = path.join(root, rel)
  if (!fs.existsSync(file)) continue
  let source = fs.readFileSync(file, 'utf8')
  let next = source

  // Strip legacy "reverse-as-forward" patch if present from older installs
  const legacyStrips = [
    {
      old: 'fold(t){if(this.setState("user_fold"),null===this.calc){if(!this.start(t))return;this.applyPortraitReverseAsForward()}this.do(this.render.convertToPage(t))}',
      new: 'fold(t){this.setState("user_fold"),null===this.calc&&this.start(t),this.do(this.render.convertToPage(t))}',
    },
    {
      old: 'if(null!==this.calc&&this.render.finishAnimation(),!this.start(t))return;this.applyPortraitReverseAsForward();const e=this.getBoundsRect();this.setState("flipping");',
      new: 'if(null!==this.calc&&this.render.finishAnimation(),!this.start(t))return;const e=this.getBoundsRect();this.setState("flipping");',
    },
    {
      old: 'i&&(this.portraitReverse||1===this.calc.getDirection()?this.app.turnToPrevPage():this.app.turnToNextPage())',
      new: 'i&&(1===this.calc.getDirection()?this.app.turnToPrevPage():this.app.turnToNextPage())',
    },
    {
      old: 'this.portraitReverse=!1,this.render=t,this.app=e}',
      new: 'this.render=t,this.app=e}',
    },
    {
      old: 'reset(){this.calc=null,this.flippingPage=null,this.bottomPage=null,this.portraitReverse=!1}',
      new: 'reset(){this.calc=null,this.flippingPage=null,this.bottomPage=null}',
    },
  ]
  for (const { old, new: neu } of legacyStrips) {
    if (next.includes(old)) {
      next = next.split(old).join(neu)
      changed += 1
    }
  }
  // Remove injected helper method if present
  const helper = /applyPortraitReverseAsForward\(\)\{[^}]+\}/
  if (helper.test(next)) {
    next = next.replace(helper, '')
    changed += 1
  }

  // Strip hard-page underside patches from a later experiment that broke the
  // soft paper-curl animation (always-clone temp leaf + portrait drawRightPage).
  const hardStrips = [
    {
      old: 'drawRightPage(){null!==this.rightPage&&("portrait"===this.orientation||0!==this.direction||null===this.flippingPage||"hard"!==this.flippingPage.getDrawingDensity()?this.rightPage.simpleDraw(1):(this.rightPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10),this.rightPage.setHardDrawingAngle(180+this.flippingPage.getHardAngle()),this.rightPage.draw(this.flippingPage.getDrawingDensity())))}',
      new: 'drawRightPage(){null!==this.rightPage&&(0===this.direction&&null!==this.flippingPage&&"hard"===this.flippingPage.getDrawingDensity()?(this.rightPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10),this.rightPage.setHardDrawingAngle(180+this.flippingPage.getHardAngle()),this.rightPage.draw(this.flippingPage.getDrawingDensity())):this.rightPage.simpleDraw(1))}',
    },
  ]
  for (const { old, new: neu } of hardStrips) {
    if (next.includes(old)) {
      next = next.split(old).join(neu)
      changed += 1
    }
  }

  // Restore stock newTemporaryCopy if the "always clone hard" patch is present
  const alwaysClone =
    /newTemporaryCopy\(\)\{return null===this\.temporaryCopy&&\(this\.copiedElement=this\.element\.cloneNode\(!0\),this\.copiedElement\.classList\.add\("--temporary"\),this\.element\.parentElement\.appendChild\(this\.copiedElement\),this\.temporaryCopy=new ([A-Za-z])\(this\.render,this\.copiedElement,this\.nowDrawingDensity\)\),this\.getTemporaryCopy\(\)\}/
  if (alwaysClone.test(next)) {
    next = next.replace(
      alwaysClone,
      'newTemporaryCopy(){return"hard"===this.nowDrawingDensity?this:(null===this.temporaryCopy&&(this.copiedElement=this.element.cloneNode(!0),this.element.parentElement.appendChild(this.copiedElement),this.temporaryCopy=new $1(this.render,this.copiedElement,this.nowDrawingDensity)),this.getTemporaryCopy())}',
    )
    changed += 1
  }

  for (const { old, new: neu } of replacements) {
    if (next.includes(neu)) continue
    if (next.includes(old)) {
      next = next.split(old).join(neu)
      changed += 1
    }
  }

  if (next !== source) fs.writeFileSync(file, next)
}

console.log(`[patch-pageflip] applied ${changed} replacement(s)`)
