/**
 * Patches page-flip so reverse page turns in portrait/mobile use the same
 * peel animation as forward (library BACK geometry flips into the off-screen
 * left half, which looks broken on single-page mobile).
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

const replacements = [
  // Revert earlier mistaken bottom-page patch (BACK → current) if present
  {
    old: 'if("portrait"===this.render.getOrientation())return 0===t?this.pages[e+1]:this.pages[e];',
    new: 'if("portrait"===this.render.getOrientation())return 0===t?this.pages[e+1]:this.pages[e-1];',
  },
  // Revert earlier mistaken flipping-page temp-copy on BACK if present
  {
    old: 'if("portrait"===this.render.getOrientation())return 0===t?this.pages[e].newTemporaryCopy():this.pages[e-1].newTemporaryCopy();',
    new: 'if("portrait"===this.render.getOrientation())return 0===t?this.pages[e].newTemporaryCopy():this.pages[e-1];',
  },
  // Portrait-safe flipPrev touch point (left edge of visible page)
  {
    old: 'flipPrev(t){this.flip({x:10,y:"top"===t?1:this.render.getRect().height-2})}',
    new: 'flipPrev(t){const e=this.render.getRect(),i="portrait"===this.render.getOrientation()?e.left+e.pageWidth+12:e.left+12;this.flip({x:i,y:"top"===t?e.top+1:e.top+e.height-2})}',
  },
  // Track portraitReverse on Flip controller (module: class o, browser: class g)
  {
    old: 'class o{constructor(t,e){this.flippingPage=null,this.bottomPage=null,this.calc=null,this.state="read",this.render=t,this.app=e}',
    new: 'class o{constructor(t,e){this.flippingPage=null,this.bottomPage=null,this.calc=null,this.state="read",this.portraitReverse=!1,this.render=t,this.app=e}',
  },
  {
    old: 'class g{constructor(t,e){this.flippingPage=null,this.bottomPage=null,this.calc=null,this.state="read",this.render=t,this.app=e}',
    new: 'class g{constructor(t,e){this.flippingPage=null,this.bottomPage=null,this.calc=null,this.state="read",this.portraitReverse=!1,this.render=t,this.app=e}',
  },
  // fold(): apply portrait reverse rewrite after start
  {
    old: 'fold(t){this.setState("user_fold"),null===this.calc&&this.start(t),this.do(this.render.convertToPage(t))}',
    new: 'fold(t){if(this.setState("user_fold"),null===this.calc){if(!this.start(t))return;this.applyPortraitReverseAsForward()}this.do(this.render.convertToPage(t))}',
  },
  // flip(): apply portrait reverse rewrite before animating
  {
    old: 'if(null!==this.calc&&this.render.finishAnimation(),!this.start(t))return;const e=this.getBoundsRect();this.setState("flipping");',
    new: 'if(null!==this.calc&&this.render.finishAnimation(),!this.start(t))return;this.applyPortraitReverseAsForward();const e=this.getBoundsRect();this.setState("flipping");',
  },
  // Completion: portraitReverse must go to previous page
  {
    old: 'i&&(1===this.calc.getDirection()?this.app.turnToPrevPage():this.app.turnToNextPage())',
    new: 'i&&(this.portraitReverse||1===this.calc.getDirection()?this.app.turnToPrevPage():this.app.turnToNextPage())',
  },
  // reset portraitReverse flag
  {
    old: 'reset(){this.calc=null,this.flippingPage=null,this.bottomPage=null}',
    new: 'reset(){this.calc=null,this.flippingPage=null,this.bottomPage=null,this.portraitReverse=!1}',
  },
]

/** Injected once: rewrite portrait BACK as FORWARD peel revealing previous page */
const METHOD_MARKER = 'applyPortraitReverseAsForward()'
const METHOD_INJECT_AFTER =
  'flipPrev(t){const e=this.render.getRect(),i="portrait"===this.render.getOrientation()?e.left+e.pageWidth+12:e.left+12;this.flip({x:i,y:"top"===t?e.top+1:e.top+e.height-2})}'
const METHOD_BODY =
  'applyPortraitReverseAsForward(){if(null===this.calc||"portrait"!==this.render.getOrientation()||1!==this.calc.getDirection())return;const t=this.app.getPageCollection().getCurrentSpreadIndex();if(t<1)return;const e=this.app.getPageCollection().getPages(),i=this.calc.getCorner(),s=this.getBoundsRect();this.flippingPage=e[t].newTemporaryCopy(),this.bottomPage=e[t-1],this.portraitReverse=!0,this.render.setDirection(0),this.calc=new a(0,i,s.pageWidth.toString(10),s.height.toString(10)),this.render.setBottomPage(this.bottomPage),this.render.setFlippingPage(this.flippingPage)}'

let changed = 0
for (const rel of files) {
  const file = path.join(root, rel)
  if (!fs.existsSync(file)) continue
  let source = fs.readFileSync(file, 'utf8')
  let next = source

  for (const { old, new: neu } of replacements) {
    if (next.includes(neu)) continue
    if (next.includes(old)) {
      next = next.split(old).join(neu)
      changed += 1
    }
  }

  // Inject helper method after flipPrev (once)
  if (!next.includes('applyPortraitReverseAsForward(){')) {
    if (next.includes(METHOD_INJECT_AFTER)) {
      next = next.replace(METHOD_INJECT_AFTER, `${METHOD_INJECT_AFTER}${METHOD_BODY}`)
      changed += 1
    }
  }

  // browser build may use different FlipCalculation global name — skip inject if FlipCalculation ctor isn't `a`
  if (rel.includes('browser') && next.includes(METHOD_BODY) && !next.includes('new a(0,i,s.pageWidth')) {
    // no-op; module build is what Vite bundles
  }

  if (next !== source) fs.writeFileSync(file, next)
}

console.log(`[patch-pageflip] applied ${changed} replacement(s)`)
