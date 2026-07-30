/**
 * Patches page-flip so reverse page turns animate correctly in portrait/mobile.
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
  {
    old: 'if("portrait"===this.render.getOrientation())return 0===t?this.pages[e+1]:this.pages[e-1];',
    new: 'if("portrait"===this.render.getOrientation())return 0===t?this.pages[e+1]:this.pages[e];',
  },
  {
    old: 'if("portrait"===this.render.getOrientation())return 0===t?this.pages[e].newTemporaryCopy():this.pages[e-1];',
    new: 'if("portrait"===this.render.getOrientation())return 0===t?this.pages[e].newTemporaryCopy():this.pages[e-1].newTemporaryCopy();',
  },
  {
    old: 'flipPrev(t){this.flip({x:10,y:"top"===t?1:this.render.getRect().height-2})}',
    new: 'flipPrev(t){const e=this.render.getRect(),i="portrait"===this.render.getOrientation()?e.left+e.pageWidth+12:e.left+12;this.flip({x:i,y:"top"===t?e.top+1:e.top+e.height-2})}',
  },
]

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
  if (next !== source) fs.writeFileSync(file, next)
}

console.log(`[patch-pageflip] applied ${changed} replacement(s)`)
