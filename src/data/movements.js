import {
  AGAINST_GRAVITY,
  BILATERAL,
  CHAINS,
  CONCENTRIC,
  CONTRACTIONS,
  FRONTAL,
  GRAVITY_RELATIONS,
  OPEN_CHAIN,
  PLANES,
  SAGITTAL,
  SIDES,
  UNILATERAL,
} from './answerValues.js'
import { byFileName, reportDataError } from './dataHelpers.js'
import { muscles } from './muscles.js'

// Every image in src/assets/movements, keyed by file name.
const imageUrls = byFileName(
  import.meta.glob('../assets/movements/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' }),
)

// Each entry is one concrete situation shown in one picture — the same joint
// movement in a different position is a separate entry, because the muscles
// doing the work can differ (e.g. gravity can take over and the "antagonist"
// then brakes the movement).
//
// - movement:    the joint action, linking situations of the same movement
// - principle:   the one thing this item teaches
// - contraction: how the agonists work — concentric (shorten and lift),
//                eccentric (lengthen and brake) or isometric (hold)
// - plane, chain, sides, gravity: see answerValues.js
// - agonists:    the muscles mainly doing the movement as it actually happens
// - synergists:  help the agonists
// - antagonists: work against the movement and have to relax and lengthen
// - stabilizers: hold other parts steady so the movement can happen
// - notes:       anything worth knowing, e.g. typical compensations
//
// Muscles are referenced by their id in muscles.js; a role can be an empty list.
// The main and secondary regions are worked out from the muscles (see below).
const movementData = [
  {
    id: 'crunch',
    image: 'Crunch.png',
    name: ['crunch', 'curl-up'],
    czechName: ['zkracovačky', 'zkracovačka'],
    position: 'lying on the back, knees bent, feet on the floor; lifting the head and shoulders',
    movement: 'trunk flexion',
    principle: 'A muscle that shortens to lift a body part against gravity is the agonist (concentric work).',
    contraction: CONCENTRIC,
    plane: SAGITTAL,
    chain: OPEN_CHAIN,
    sides: BILATERAL,
    gravity: AGAINST_GRAVITY,
    agonists: ['rectus-abdominis'],
    synergists: ['obliquus-externus-abdominis', 'obliquus-internus-abdominis'],
    antagonists: ['erector-spinae-lumbar', 'erector-spinae-thoracic'],
    stabilizers: ['transversus-abdominis', 'diaphragm', 'pelvic-floor', 'longus-colli', 'longus-capitis'],
    notes:
      'The lifting phase. The deep neck flexors hold the head in line with the trunk; ' +
      'when they are weak, the SCM takes over and the chin pokes forward. If the feet are ' +
      'held down, the hip flexors (iliacus, psoas) join in and pull the lower back into an arch.',
  },
  {
    id: 'arm-raise-sideways',
    image: 'ArmRaiseSideways.png',
    name: ['raising the arm sideways', 'arm abduction', 'shoulder abduction'],
    czechName: ['upažení', 'abdukce paže', 'abdukce v rameni'],
    position: 'standing, the arm hanging by the side; raising it sideways to shoulder height',
    movement: 'shoulder abduction',
    principle:
      'Raising the arm needs two teams: muscles at the shoulder joint lift the arm, while ' +
      'shoulder-blade muscles rotate the scapula upward and the rotator cuff keeps the joint centred.',
    contraction: CONCENTRIC,
    plane: FRONTAL,
    chain: OPEN_CHAIN,
    sides: UNILATERAL,
    gravity: AGAINST_GRAVITY,
    agonists: ['deltoideus', 'supraspinatus'],
    synergists: ['trapezius-upper', 'trapezius-lower', 'serratus-anterior'],
    antagonists: ['latissimus-dorsi', 'teres-major', 'pectoralis-major', 'rhomboidei'],
    stabilizers: [
      'infraspinatus',
      'teres-minor',
      'subscapularis',
      'transversus-abdominis',
      'deep-spinal-stabilizers-lumbar',
    ],
    notes:
      'Up to shoulder height. From about 30° on, the scapula rotates upward along with the arm ' +
      '(scapulohumeral rhythm, roughly 1° of scapula for every 2° of arm), driven by the upper and ' +
      'lower trapezius together with serratus anterior. The rotator cuff pulls the head of the ' +
      'humerus down into the socket so the deltoid lifts the arm instead of jamming it upward. ' +
      'The rhomboids are antagonists of the scapula part: they rotate it downward. Even before ' +
      'the arm starts to move, transversus abdominis and the lumbar multifidus switch on to ' +
      'stabilize the trunk against the shift of weight (Hodges & Richardson) — strongest in a ' +
      'fast raise, quieter in a slow one. Typical compensation: shrugging — the upper trapezius ' +
      'and levator scapulae lift the whole shoulder.',
  },
]

// OLD FORMAT (one entry per joint movement, without position or contraction).
// Kept for reference while the movements are rewritten into the new format above.
//   // Hip
//   {
//     id: 'hip-flexion',
//     image: 'HipFlexion.png',
//     name: 'hip flexion',
//     czechName: ['flexe kyčle', 'flexe v kyčli'],
//     agonists: ['iliacus', 'psoas-major'],
//     synergists: ['rectus-femoris', 'tensor-fasciae-latae', 'sartorius', 'pectineus', 'adductor-longus', 'adductor-brevis'],
//     antagonists: ['gluteus-maximus', 'biceps-femoris', 'semitendinosus', 'semimembranosus', 'adductor-magnus'],
//     stabilizers: ['transversus-abdominis', 'rectus-abdominis', 'obliquus-externus-abdominis', 'obliquus-internus-abdominis'],
//   },
//   {
//     id: 'hip-extension',
//     image: 'HipExtension.png',
//     name: 'hip extension',
//     czechName: ['extenze kyčle', 'extenze v kyčli'],
//     agonists: ['gluteus-maximus'],
//     synergists: ['biceps-femoris', 'semitendinosus', 'semimembranosus', 'adductor-magnus'],
//     antagonists: ['iliacus', 'psoas-major', 'rectus-femoris'],
//     stabilizers: ['transversus-abdominis', 'deep-spinal-stabilizers-lumbar'],
//   },
//   {
//     id: 'hip-abduction',
//     image: 'HipAbduction.png',
//     name: 'hip abduction',
//     czechName: ['abdukce kyčle', 'abdukce v kyčli'],
//     agonists: ['gluteus-medius'],
//     synergists: ['gluteus-minimus', 'tensor-fasciae-latae', 'gluteus-maximus'],
//     antagonists: ['adductor-longus', 'adductor-brevis', 'adductor-magnus', 'pectineus', 'gracilis'],
//     stabilizers: ['quadratus-lumborum', 'obliquus-externus-abdominis', 'obliquus-internus-abdominis'],
//   },
//   {
//     id: 'hip-adduction',
//     image: 'HipAdduction.png',
//     name: 'hip adduction',
//     czechName: ['addukce kyčle', 'addukce v kyčli'],
//     agonists: ['adductor-longus', 'adductor-brevis', 'adductor-magnus'],
//     synergists: ['pectineus', 'gracilis'],
//     antagonists: ['gluteus-medius', 'gluteus-minimus', 'tensor-fasciae-latae'],
//     stabilizers: [],
//   },
//
//   // Knee
//   {
//     id: 'knee-extension',
//     image: 'KneeExtension.png',
//     name: 'knee extension',
//     czechName: ['extenze kolena', 'extenze v koleni'],
//     agonists: ['rectus-femoris', 'vastus-medialis', 'vastus-lateralis', 'vastus-intermedius'],
//     synergists: [],
//     antagonists: ['biceps-femoris', 'semitendinosus', 'semimembranosus'],
//     stabilizers: [],
//   },
//   {
//     id: 'knee-flexion',
//     image: 'KneeFlexion.png',
//     name: 'knee flexion',
//     czechName: ['flexe kolena', 'flexe v koleni'],
//     agonists: ['biceps-femoris', 'semitendinosus', 'semimembranosus'],
//     synergists: ['gracilis', 'sartorius'],
//     antagonists: ['rectus-femoris', 'vastus-medialis', 'vastus-lateralis', 'vastus-intermedius'],
//     stabilizers: [],
//   },
//
//   // Shoulder
//   {
//     id: 'shoulder-flexion',
//     image: 'ShoulderFlexion.png',
//     name: 'shoulder flexion',
//     czechName: ['flexe ramene', 'flexe v rameni'],
//     agonists: ['deltoideus', 'pectoralis-major'],
//     synergists: ['serratus-anterior', 'trapezius-upper', 'trapezius-lower'],
//     antagonists: ['latissimus-dorsi', 'teres-major'],
//     stabilizers: ['supraspinatus', 'infraspinatus', 'teres-minor', 'subscapularis'],
//   },
//   {
//     id: 'shoulder-abduction',
//     image: 'ShoulderAbduction.png',
//     name: 'shoulder abduction',
//     czechName: ['abdukce ramene', 'abdukce v rameni'],
//     agonists: ['deltoideus', 'supraspinatus'],
//     synergists: ['serratus-anterior', 'trapezius-upper', 'trapezius-lower'],
//     antagonists: ['latissimus-dorsi', 'teres-major', 'pectoralis-major'],
//     stabilizers: ['infraspinatus', 'teres-minor', 'subscapularis'],
//   },
//
//   // Scapula
//   {
//     id: 'scapular-retraction',
//     image: 'ScapularRetraction.png',
//     name: 'scapular retraction',
//     czechName: ['retrakce lopatky', 'addukce lopatky'],
//     agonists: ['rhomboideus-major', 'rhomboideus-minor', 'trapezius-middle'],
//     synergists: ['trapezius-upper', 'trapezius-lower'],
//     antagonists: ['serratus-anterior', 'pectoralis-minor'],
//     stabilizers: [],
//   },
//   {
//     id: 'scapular-protraction',
//     image: 'ScapularProtraction.png',
//     name: 'scapular protraction',
//     czechName: ['protrakce lopatky', 'abdukce lopatky'],
//     agonists: ['serratus-anterior'],
//     synergists: ['pectoralis-minor', 'pectoralis-major'],
//     antagonists: ['rhomboideus-major', 'rhomboideus-minor', 'trapezius-middle'],
//     stabilizers: [],
//   },
//
//   // Trunk
//   {
//     id: 'trunk-flexion',
//     image: 'TrunkFlexion.png',
//     name: 'trunk flexion',
//     czechName: ['flexe trupu'],
//     agonists: ['rectus-abdominis'],
//     synergists: ['obliquus-externus-abdominis', 'obliquus-internus-abdominis'],
//     antagonists: ['erector-spinae-lumbar', 'erector-spinae-thoracic', 'deep-spinal-stabilizers-lumbar', 'deep-spinal-stabilizers-thoracic'],
//     stabilizers: ['transversus-abdominis'],
//   },
//
//   // Neck
//   {
//     id: 'neck-flexion',
//     image: 'NeckFlexion.png',
//     name: 'neck flexion',
//     czechName: ['flexe krku', 'flexe krční páteře'],
//     agonists: ['sternocleidomastoideus', 'longus-colli', 'longus-capitis'],
//     synergists: ['scalenus-anterior', 'rectus-capitis-anterior'],
//     antagonists: ['splenius-capitis', 'splenius-cervicis', 'semispinalis-capitis', 'deep-spinal-stabilizers-cervical', 'trapezius-upper', 'suboccipital-group'],
//     stabilizers: [],
//   },
//   {
//     id: 'neck-extension',
//     image: 'NeckExtension.png',
//     name: 'neck extension',
//     czechName: ['extenze krku', 'extenze krční páteře'],
//     agonists: ['splenius-capitis', 'splenius-cervicis', 'semispinalis-capitis', 'deep-spinal-stabilizers-cervical'],
//     synergists: ['trapezius-upper', 'levator-scapulae', 'erector-spinae-cervical', 'suboccipital-group'],
//     antagonists: ['sternocleidomastoideus', 'longus-colli', 'longus-capitis'],
//     stabilizers: [],
//   },

export const ROLES = ['agonists', 'synergists', 'antagonists', 'stabilizers']

// Catch typos in the data as soon as the file is loaded.
const allowed = {
  contraction: CONTRACTIONS,
  plane: PLANES,
  chain: CHAINS,
  sides: SIDES,
  gravity: GRAVITY_RELATIONS,
}
const muscleIds = new Set(muscles.map((m) => m.id))
for (const movement of movementData) {
  for (const [key, values] of Object.entries(allowed)) {
    if (!values.includes(movement[key])) {
      reportDataError(`movements.js: "${movement.id}" has an unknown ${key}: ${JSON.stringify(movement[key])}`)
    }
  }
  const seen = new Set()
  for (const role of ROLES) {
    for (const id of movement[role]) {
      if (!muscleIds.has(id)) reportDataError(`movements.js: unknown muscle "${id}" in ${movement.id}.${role}`)
      if (seen.has(id)) reportDataError(`movements.js: "${id}" has two roles in ${movement.id}`)
      seen.add(id)
    }
  }
}

// Main regions: where the agonists are. Secondary regions: where all the other
// muscles of the movement are, apart from the main ones. Both are lists of the
// region values from answerValues.js, in the order the muscles appear.
const regionOf = Object.fromEntries(muscles.map((m) => [m.id, m.region]))
const uniqueRegions = (ids) => [...new Set(ids.map((id) => regionOf[id]))]

export const movements = movementData.map((movement) => {
  const mainRegions = uniqueRegions(movement.agonists)
  const otherIds = ROLES.filter((role) => role !== 'agonists').flatMap((role) => movement[role])
  const secondaryRegions = uniqueRegions(otherIds).filter((region) => !mainRegions.includes(region))
  return {
    ...movement,
    image: imageUrls[movement.image] ?? null,
    imageFile: movement.image,
    mainRegions,
    secondaryRegions,
  }
})
