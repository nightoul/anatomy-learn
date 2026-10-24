import { muscles } from './muscles.js'

// Every image in src/assets/movements, keyed by file name.
const imageFiles = import.meta.glob('../assets/movements/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
})
const imageUrls = Object.fromEntries(
  Object.entries(imageFiles).map(([path, url]) => [path.split('/').pop(), url]),
)

// Muscles are referenced by their id in muscles.js. A role can be an empty list
// when it doesn't make sense for the movement (e.g. no stabilizers).
const movementData = [
  // Hip
  {
    id: 'hip-flexion',
    image: 'HipFlexion.png',
    name: 'hip flexion',
    czechName: ['flexe kyčle', 'flexe v kyčli'],
    agonists: ['iliacus', 'psoas-major'],
    synergists: ['rectus-femoris', 'tensor-fasciae-latae', 'sartorius', 'pectineus', 'adductor-longus', 'adductor-brevis'],
    antagonists: ['gluteus-maximus', 'biceps-femoris', 'semitendinosus', 'semimembranosus', 'adductor-magnus'],
    stabilizers: ['transversus-abdominis', 'rectus-abdominis', 'obliquus-externus-abdominis', 'obliquus-internus-abdominis'],
  },
  {
    id: 'hip-extension',
    image: 'HipExtension.png',
    name: 'hip extension',
    czechName: ['extenze kyčle', 'extenze v kyčli'],
    agonists: ['gluteus-maximus'],
    synergists: ['biceps-femoris', 'semitendinosus', 'semimembranosus', 'adductor-magnus'],
    antagonists: ['iliacus', 'psoas-major', 'rectus-femoris'],
    stabilizers: ['transversus-abdominis', 'deep-spinal-stabilizers'],
  },
  {
    id: 'hip-abduction',
    image: 'HipAbduction.png',
    name: 'hip abduction',
    czechName: ['abdukce kyčle', 'abdukce v kyčli'],
    agonists: ['gluteus-medius'],
    synergists: ['gluteus-minimus', 'tensor-fasciae-latae', 'gluteus-maximus'],
    antagonists: ['adductor-longus', 'adductor-brevis', 'adductor-magnus', 'pectineus', 'gracilis'],
    stabilizers: ['quadratus-lumborum', 'obliquus-externus-abdominis', 'obliquus-internus-abdominis'],
  },
  {
    id: 'hip-adduction',
    image: 'HipAdduction.png',
    name: 'hip adduction',
    czechName: ['addukce kyčle', 'addukce v kyčli'],
    agonists: ['adductor-longus', 'adductor-brevis', 'adductor-magnus'],
    synergists: ['pectineus', 'gracilis'],
    antagonists: ['gluteus-medius', 'gluteus-minimus', 'tensor-fasciae-latae'],
    stabilizers: [],
  },

  // Knee
  {
    id: 'knee-extension',
    image: 'KneeExtension.png',
    name: 'knee extension',
    czechName: ['extenze kolena', 'extenze v koleni'],
    agonists: ['rectus-femoris', 'vastus-medialis', 'vastus-lateralis', 'vastus-intermedius'],
    synergists: [],
    antagonists: ['biceps-femoris', 'semitendinosus', 'semimembranosus'],
    stabilizers: [],
  },
  {
    id: 'knee-flexion',
    image: 'KneeFlexion.png',
    name: 'knee flexion',
    czechName: ['flexe kolena', 'flexe v koleni'],
    agonists: ['biceps-femoris', 'semitendinosus', 'semimembranosus'],
    synergists: ['gracilis', 'sartorius'],
    antagonists: ['rectus-femoris', 'vastus-medialis', 'vastus-lateralis', 'vastus-intermedius'],
    stabilizers: [],
  },

  // Shoulder
  {
    id: 'shoulder-flexion',
    image: 'ShoulderFlexion.png',
    name: 'shoulder flexion',
    czechName: ['flexe ramene', 'flexe v rameni'],
    agonists: ['deltoideus', 'pectoralis-major'],
    synergists: ['serratus-anterior', 'trapezius-upper', 'trapezius-lower'],
    antagonists: ['latissimus-dorsi', 'teres-major'],
    stabilizers: ['supraspinatus', 'infraspinatus', 'teres-minor', 'subscapularis'],
  },
  {
    id: 'shoulder-abduction',
    image: 'ShoulderAbduction.png',
    name: 'shoulder abduction',
    czechName: ['abdukce ramene', 'abdukce v rameni'],
    agonists: ['deltoideus', 'supraspinatus'],
    synergists: ['serratus-anterior', 'trapezius-upper', 'trapezius-lower'],
    antagonists: ['latissimus-dorsi', 'teres-major', 'pectoralis-major'],
    stabilizers: ['infraspinatus', 'teres-minor', 'subscapularis'],
  },

  // Scapula
  {
    id: 'scapular-retraction',
    image: 'ScapularRetraction.png',
    name: 'scapular retraction',
    czechName: ['retrakce lopatky', 'addukce lopatky'],
    agonists: ['rhomboideus-major', 'rhomboideus-minor', 'trapezius-middle'],
    synergists: ['trapezius-upper', 'trapezius-lower'],
    antagonists: ['serratus-anterior', 'pectoralis-minor'],
    stabilizers: [],
  },
  {
    id: 'scapular-protraction',
    image: 'ScapularProtraction.png',
    name: 'scapular protraction',
    czechName: ['protrakce lopatky', 'abdukce lopatky'],
    agonists: ['serratus-anterior'],
    synergists: ['pectoralis-minor', 'pectoralis-major'],
    antagonists: ['rhomboideus-major', 'rhomboideus-minor', 'trapezius-middle'],
    stabilizers: [],
  },

  // Trunk
  {
    id: 'trunk-flexion',
    image: 'TrunkFlexion.png',
    name: 'trunk flexion',
    czechName: ['flexe trupu'],
    agonists: ['rectus-abdominis'],
    synergists: ['obliquus-externus-abdominis', 'obliquus-internus-abdominis'],
    antagonists: ['erector-spinae-lumbar', 'erector-spinae-thoracic', 'deep-spinal-stabilizers'],
    stabilizers: ['transversus-abdominis'],
  },

  // Neck
  {
    id: 'neck-flexion',
    image: 'NeckFlexion.png',
    name: 'neck flexion',
    czechName: ['flexe krku', 'flexe krční páteře'],
    agonists: ['sternocleidomastoideus', 'longus-colli', 'longus-capitis'],
    synergists: ['scalenus-anterior', 'rectus-capitis-anterior'],
    antagonists: ['splenius-capitis', 'splenius-cervicis', 'semispinalis-capitis', 'semispinalis-cervicis', 'trapezius-upper', 'suboccipital-group'],
    stabilizers: [],
  },
  {
    id: 'neck-extension',
    image: 'NeckExtension.png',
    name: 'neck extension',
    czechName: ['extenze krku', 'extenze krční páteře'],
    agonists: ['splenius-capitis', 'splenius-cervicis', 'semispinalis-capitis', 'semispinalis-cervicis'],
    synergists: ['trapezius-upper', 'levator-scapulae', 'erector-spinae-cervical', 'suboccipital-group'],
    antagonists: ['sternocleidomastoideus', 'longus-colli', 'longus-capitis'],
    stabilizers: [],
  },
]

export const ROLES = ['agonists', 'synergists', 'antagonists', 'stabilizers']

// Catch typos in muscle ids as soon as the file is loaded.
const muscleIds = new Set(muscles.map((m) => m.id))
for (const movement of movementData) {
  for (const role of ROLES) {
    for (const id of movement[role]) {
      if (!muscleIds.has(id)) throw new Error(`movements.js: unknown muscle "${id}" in ${movement.id}.${role}`)
    }
  }
}

export const movements = movementData.map((movement) => ({
  ...movement,
  image: imageUrls[movement.image] ?? null,
}))
