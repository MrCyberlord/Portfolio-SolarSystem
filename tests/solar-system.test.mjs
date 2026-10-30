import assert from 'node:assert/strict'
import test from 'node:test'
import { Euler, MathUtils, PerspectiveCamera, Vector3 } from 'three'
import { planets, orbitalPosition, SUN_RADIUS, SYSTEM_SCALE, ORBIT_SPEED_MULTIPLIER } from '../src/scene/solarConfig.ts'
import { compositions, sceneQuality } from '../src/scene/config.ts'
import { createPlanetTexture } from '../src/scene/planetTextures.ts'
import { horizontalAnchor } from '../src/scene/horizontalAnchor.ts'

test('all eight planets have independent speeds and nonintersecting radial envelopes', () => {
  assert.equal(ORBIT_SPEED_MULTIPLIER, 1.1)
  assert.deepEqual(planets.map((planet) => planet.name), ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'])
  assert.equal(new Set(planets.map((planet) => planet.speed)).size, 8)
  let previousOuter = SUN_RADIUS
  for (const planet of planets) {
    const envelope = planet.radius * (planet.name === 'Saturn' ? 1.95 : 1)
    assert.ok(planet.orbit - envelope > previousOuter + 0.1, `${planet.name} must clear the previous body including rings`)
    previousOuter = planet.orbit + envelope
    for (let i = 0; i < 100; i++) {
      const position = new Vector3(...orbitalPosition(planet.orbit, planet.phase + i * planet.speed))
      position.applyEuler(new Euler(planet.inclination, 0, 0))
      assert.ok(Math.abs(position.length() - planet.orbit) < 1e-9)
    }
  }
})

test('mobile and desktop textures are bounded, opaque, and seamless at longitude wrap', () => {
  for (const { textureWidth } of Object.values(sceneQuality)) {
    for (const planet of planets) {
      const texture = createPlanetTexture(planet.name, textureWidth)
      const { data, width, height } = texture.image
      assert.equal(data.length, width * height * 4)
      for (let row = 0; row < height; row++) {
        const first = row * width * 4, last = first + (width - 1) * 4
        for (let channel = 0; channel < 4; channel++) assert.equal(data[first + channel], data[last + channel], `${planet.name} seam`)
      }
      assert.ok(data.every((value, index) => index % 4 !== 3 || value === 255))
      texture.dispose()
    }
  }
})

test('the Sun stays horizontally anchored across every section and the Home/Projects boundary', () => {
  const samples = [...Array.from({ length: 81 }, (_, i) => i / 20), 0.9999, 1.0001, 1.005, 1.01, 1.1, 1.1999]
  for (const [width, height, mobile] of [[360, 290, true], [390, 310, true], [768, 1024, false], [1024, 768, false], [1280, 800, false], [1440, 900, false], [1920, 1080, false]]) {
    for (const progress of samples) {
      const index = Math.min(4, Math.floor(progress))
      const a = compositions[index], b = compositions[Math.min(4, index + 1)]
      const t = MathUtils.smoothstep(progress - index, 0, 1)
      const mix = (key) => MathUtils.lerp(a[key], b[key], t)
      const aspect = width / height, tan = Math.tan(43 * Math.PI / 360)
      const distance = Math.max(mix('distance') * (mobile ? 1.1 : 1), 3.85 / (tan * aspect * (mobile ? 0.9 : 0.6)))
      const elevation = mix('elevation') * distance / mix('distance')
      const offset = mobile ? 0 : Math.hypot(distance, elevation) * tan * aspect * 0.36
      const camera = new PerspectiveCamera(43, aspect, 0.1, 90)
      camera.position.set(-offset + (mobile ? 0 : 0.5), elevation, distance)
      camera.lookAt(-offset, mix('targetY'), 0); camera.updateMatrixWorld()
      const room = mobile ? 1 : MathUtils.smoothstep(aspect, 1.25, 1.65)
      const origin = compositions[0]
      const originDistance = Math.max(origin.distance * (mobile ? 1.1 : 1), 3.85 / (tan * aspect * (mobile ? 0.9 : 0.6)))
      const originElevation = origin.elevation * originDistance / origin.distance
      const homeScale = 1 + (mobile ? 0.15 : 0.17) * (index === 0 ? (1 - t) * room : 0)
      const contentScale = (1 + (mobile ? 0.15 : 0.17) * room) * 0.86 * Math.hypot(distance, elevation) / Math.hypot(originDistance, originElevation)
      const scale = MathUtils.lerp(homeScale, contentScale, MathUtils.smoothstep(progress, 1, 1.2))
      const target = mobile ? 0 : 0.42
      const shift = horizontalAnchor(camera, target)
      const sun = new Vector3(shift, 0, 0).project(camera)
      assert.ok(Math.abs(sun.x - target) < 1e-10, `${width}px at ${progress}: Sun must not drift`)
      for (const planet of planets) for (let i = 0; i < 40; i++) {
        const position = new Vector3(...orbitalPosition(planet.orbit + planet.radius * (planet.name === 'Saturn' ? 1.95 : 1), i * Math.PI * 2 / 40))
        position.applyEuler(new Euler(planet.inclination, 0, 0)).multiplyScalar(SYSTEM_SCALE * scale)
        position.applyEuler(new Euler(mix('tilt'), mix('turn'), 0)).add(new Vector3(shift, 0, 0)).project(camera)
        assert.ok(Math.abs(position.x) < 1 && Math.abs(position.y) < 1, `${width}x${height} at ${progress}: ${planet.name} must fit`)
        if (progress >= 1.2 && !mobile) {
          const gutter = Math.max(24, Math.min(width * 0.04, 64))
          const page = Math.min(width, 1440), gap = width >= 1100 ? 48 : 40
          const column = Math.min(544, (page - 2 * gutter - gap) / 2.3)
          const contentRight = ((width - page) / 2 + gutter + column) / width
          assert.ok(position.x > contentRight * 2 - 1, `${width}px: ${planet.name} must clear the shared content grid`)
        }
      }
    }
  }
})
