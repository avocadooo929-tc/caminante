// 生成 PWA 图标（无第三方依赖，纯 Node：手写 PNG 编码 + 包豪斯几何图形）
// 用法：node scripts/generate-icons.mjs
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public')

// ---- CRC32 ----
const crcTable = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([len, typeBuf, data, crc])
}

function encodePNG(size, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  const stride = size * 4 + 1
  const raw = Buffer.alloc(stride * size)
  for (let y = 0; y < size; y++) {
    raw[y * stride] = 0 // filter: none
    rgba.copy(raw, y * stride + 1, y * size * 4, (y + 1) * size * 4)
  }
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ---- 包豪斯标记：黑底 + 黄圆 + 红菱形 + 蓝小圆 ----
function render(size) {
  const px = Buffer.alloc(size * size * 4)
  const c = size / 2
  const rYellow = (150 / 512) * size
  const half = (100 / 512) * size // 菱形的 L1 半径
  const rBlue = (52 / 512) * size

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - c
      const dy = y - c
      let r = 0x14, g = 0x14, b = 0x14 // #141414 黑
      const dist = Math.hypot(dx, dy)
      if (dist <= rYellow) { r = 0xf2; g = 0xc1; b = 0x4e } // 黄
      if (Math.abs(dx) + Math.abs(dy) <= half) { r = 0xe6; g = 0x39; b = 0x46 } // 红
      if (dist <= rBlue) { r = 0x2a; g = 0x9d; b = 0x8f } // 蓝
      const i = (y * size + x) * 4
      px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = 0xff
    }
  }
  return px
}

mkdirSync(OUT_DIR, { recursive: true })

const targets = [
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'icon-maskable-512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
]

for (const t of targets) {
  writeFileSync(join(OUT_DIR, t.file), encodePNG(t.size, render(t.size)))
  console.log('✓', t.file, `${t.size}x${t.size}`)
}
