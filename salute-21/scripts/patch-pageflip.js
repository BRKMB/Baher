/**
 * Patches page-flip for mobile/portrait menu flips.
 *
 * 1) Reverse turns: shift BACK coordinates onto the visible page so the peel
 *    comes from the LEFT (not the off-screen half / not like forward).
 * 2) Double-sided feel: always clone the flipping page (even for hard density)
 *    and keep the static page simple in portrait, so the underside of the flip
 *    reveals the next page instead of a mirrored copy of the current one.
 *
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

function applyRegexOnce(source, pattern, replacer) {
  if (!pattern.test(source)) return { source, changed: false }
  // reset lastIndex after test
  pattern.lastIndex = 0
  const next = source.replace(pattern, replacer)
  return { source: next, changed: next !== source }
}

let changed = 0
for (const rel of files) {
  const file = path.join(root, rel)
  if (!fs.existsSync(file)) continue
  let source = fs.readFileSync(file, 'utf8')
  let next = source

  // Strip legacy "reverse-as-forward" patch if present from older installs
  const legacyStrips = [
    [
      'fold(t){if(this.setState("user_fold"),null===this.calc){if(!this.start(t))return;this.applyPortraitReverseAsForward()}this.do(this.render.convertToPage(t))}',
      'fold(t){this.setState("user_fold"),null===this.calc&&this.start(t),this.do(this.render.convertToPage(t))}',
    ],
    [
      'if(null!==this.calc&&this.render.finishAnimation(),!this.start(t))return;this.applyPortraitReverseAsForward();const e=this.getBoundsRect();this.setState("flipping");',
      'if(null!==this.calc&&this.render.finishAnimation(),!this.start(t))return;const e=this.getBoundsRect();this.setState("flipping");',
    ],
    [
      'i&&(this.portraitReverse||1===this.calc.getDirection()?this.app.turnToPrevPage():this.app.turnToNextPage())',
      'i&&(1===this.calc.getDirection()?this.app.turnToPrevPage():this.app.turnToNextPage())',
    ],
    ['this.portraitReverse=!1,this.render=t,this.app=e}', 'this.render=t,this.app=e}'],
    [
      'reset(){this.calc=null,this.flippingPage=null,this.bottomPage=null,this.portraitReverse=!1}',
      'reset(){this.calc=null,this.flippingPage=null,this.bottomPage=null}',
    ],
  ]
  for (const [oldStr, newStr] of legacyStrips) {
    const r = applyOnce(next, oldStr, newStr)
    next = r.source
    if (r.changed) changed += 1
  }
  if (/applyPortraitReverseAsForward\(\)\{[^}]+\}/.test(next)) {
    next = next.replace(/applyPortraitReverseAsForward\(\)\{[^}]+\}/, '')
    changed += 1
  }

  const replacements = [
    [
      'flipPrev(t){this.flip({x:10,y:"top"===t?1:this.render.getRect().height-2})}',
      'flipPrev(t){const e=this.render.getRect(),i="portrait"===this.render.getOrientation()?e.left+e.pageWidth+12:e.left+12;this.flip({x:i,y:"top"===t?e.top+1:e.top+e.height-2})}',
    ],
    [
      'convertToPage(t,e){e||(e=this.direction);const i=this.getRect();return{x:0===e?t.x-i.left-i.width/2:i.width/2-t.x+i.left,y:t.y-i.top}}',
      'convertToPage(t,e){e||(e=this.direction);const i=this.getRect();let s;return s=0===e?t.x-i.left-i.width/2:"portrait"===this.orientation?i.width/2-(t.x-i.pageWidth)+i.left:i.width/2-t.x+i.left,{x:s,y:t.y-i.top}}',
    ],
    [
      'convertToGlobal(t,e){if(e||(e=this.direction),null==t)return null;const i=this.getRect();return{x:0===e?t.x+i.left+i.width/2:i.width/2-t.x+i.left,y:t.y+i.top}}',
      'convertToGlobal(t,e){if(e||(e=this.direction),null==t)return null;const i=this.getRect();let s;return s=0===e?t.x+i.left+i.width/2:"portrait"===this.orientation?i.width/2-t.x+i.left+i.pageWidth:i.width/2-t.x+i.left,{x:s,y:t.y+i.top}}',
    ],
    [
      'drawRightPage(){null!==this.rightPage&&(0===this.direction&&null!==this.flippingPage&&"hard"===this.flippingPage.getDrawingDensity()?(this.rightPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10),this.rightPage.setHardDrawingAngle(180+this.flippingPage.getHardAngle()),this.rightPage.draw(this.flippingPage.getDrawingDensity())):this.rightPage.simpleDraw(1))}',
      'drawRightPage(){null!==this.rightPage&&("portrait"===this.orientation||0!==this.direction||null===this.flippingPage||"hard"!==this.flippingPage.getDrawingDensity()?this.rightPage.simpleDraw(1):(this.rightPage.getElement().style.zIndex=(this.getSettings().startZIndex+5).toString(10),this.rightPage.setHardDrawingAngle(180+this.flippingPage.getHardAngle()),this.rightPage.draw(this.flippingPage.getDrawingDensity())))}',
    ],
    [
      'if("portrait"===this.render.getOrientation())return 0===t?this.pages[e].newTemporaryCopy():this.pages[e-1];',
      'if("portrait"===this.render.getOrientation())return 0===t?this.pages[e].newTemporaryCopy():this.pages[e-1].newTemporaryCopy();',
    ],
  ]

  for (const [oldStr, newStr] of replacements) {
    const r = applyOnce(next, oldStr, newStr)
    next = r.source
    if (r.changed) changed += 1
  }

  // Always clone temporary leaf — class name differs (module: h, browser: r)
  const temp = applyRegexOnce(
    next,
    /newTemporaryCopy\(\)\{return"hard"===this\.nowDrawingDensity\?this:\(null===this\.temporaryCopy&&\(this\.copiedElement=this\.element\.cloneNode\(!0\),this\.element\.parentElement\.appendChild\(this\.copiedElement\),this\.temporaryCopy=new ([A-Za-z])\(this\.render,this\.copiedElement,this\.nowDrawingDensity\)\),this\.getTemporaryCopy\(\)\}/,
    'newTemporaryCopy(){return null===this.temporaryCopy&&(this.copiedElement=this.element.cloneNode(!0),this.copiedElement.classList.add("--temporary"),this.element.parentElement.appendChild(this.copiedElement),this.temporaryCopy=new $1(this.render,this.copiedElement,this.nowDrawingDensity)),this.getTemporaryCopy()}',
  )
  next = temp.source
  if (temp.changed) changed += 1

  if (next !== source) fs.writeFileSync(file, next)
}

console.log(`[patch-pageflip] applied ${changed} replacement(s)`)
