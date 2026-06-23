import potrace from 'potrace'
import { writeFileSync } from 'fs'

// 把纯黑白 logo 位图矢量描摹成 SVG path
potrace.trace(
  'public/logo-gh.png',
  { color: '#1c1c1a', background: 'transparent', turdSize: 3, threshold: 170, optTolerance: 0.4 },
  (err, svg) => {
    if (err) {
      console.error('ERR', err)
      process.exit(1)
    }
    writeFileSync('public/logo-gh.svg', svg)
    console.log('OK len=' + svg.length)
  },
)
