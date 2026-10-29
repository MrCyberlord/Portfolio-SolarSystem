import assert from 'node:assert/strict'
import test from 'node:test'
import { Euler, MathUtils, PerspectiveCamera, Vector3 } from 'three'
import { planets, orbitalPosition, SUN_RADIUS, SYSTEM_SCALE, ORBIT_SPEED_MULTIPLIER } from '../src/scene/solarConfig.ts'
import { compositions, sceneQuality } from '../src/scene/config.ts'
import { createPlanetTexture } from '../src/scene/planetTextures.ts'

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

test('camera budgets contain every orbit and keep the Sun in the intended reading-free zone', () => {
  for (const [width, height, mobile] of [[360, 290, true], [390, 310, true], [768, 1024, false], [1024, 768, false], [1280, 800, false], [1920, 1080, false]]) {
    for (const [viewIndex, view] of compositions.entries()) {
      const aspect = width / height, tan = Math.tan(43 * Math.PI / 360)
      const distance = Math.max(view.distance * (mobile ? 1.1 : 1), 3.85 / (tan * aspect * (mobile ? 0.9 : 0.6)))
      const elevation = view.elevation * distance / view.distance
      const offset = mobile ? 0 : Math.hypot(distance, elevation) * tan * aspect * 0.36
      const camera = new PerspectiveCamera(43, aspect, 0.1, 90)
      camera.position.set(-offset + (mobile ? 0 : 0.5), elevation, distance)
      camera.lookAt(-offset, view.targetY, 0); camera.updateMatrixWorld()
      const homeWeight = viewIndex === 0 ? (mobile ? 1 : MathUtils.smoothstep(aspect, 1.25, 1.65)) : 0
      const origin = compositions[0]
      const originDistance = Math.max(origin.distance * (mobile ? 1.1 : 1), 3.85 / (tan * aspect * (mobile ? 0.9 : 0.6)))
      const originElevation = origin.elevation * originDistance / origin.distance
      const room = mobile ? 1 : MathUtils.smoothstep(aspect, 1.25, 1.65)
      const homeScale = viewIndex === 0 ? 1 + (mobile ? 0.15 : 0.17) * homeWeight : (1 + (mobile ? 0.15 : 0.17) * room) * 0.86 * Math.hypot(distance, elevation) / Math.hypot(originDistance, originElevation)
      const shift = !mobile ? Math.hypot(distance, elevation) * tan * aspect * 2 * (viewIndex === 0 ? 0.02 * homeWeight : 0.06) : 0
      const sun = new Vector3(shift, 0, 0).project(camera)
      assert.ok(mobile ? Math.abs(sun.x) < 0.01 : sun.x > 0.25 && sun.x < 0.6)
      for (const planet of planets) for (let i = 0; i < 100; i++) {
        const position = new Vector3(...orbitalPosition(planet.orbit + planet.radius * (planet.name === 'Saturn' ? 1.95 : 1), i * Math.PI * 2 / 100))
        position.applyEuler(new Euler(planet.inclination, 0, 0)).multiplyScalar(SYSTEM_SCALE * homeScale)
        position.applyEuler(new Euler(view.tilt, view.turn, 0)).add(new Vector3(shift, 0, 0)).project(camera)
        assert.ok(Math.abs(position.x) < 1 && Math.abs(position.y) < 1, `${width}x${height}: ${planet.name} must fit`)
        if (viewIndex > 0 && !mobile) {
          const inset = width >= 1100 ? 0.07 : 0.05
          const contentRight = inset + (1 - inset) * 0.48
          assert.ok(position.x > contentRight * 2 - 1, `${width}x${height}: ${planet.name} must clear the wider content column`)
        }
      }
    }
  }
})
