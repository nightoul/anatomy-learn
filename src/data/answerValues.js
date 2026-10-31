// Fixed answer values for region, depth, palpable and jandaType. Each is a list
// of accepted answers; the first one is shown once the question is solved.

export const CORE = ['core']
export const SPINE = ['spine']
export const THORACIC_WALL = ['thoracic wall']
export const SHOULDER_GIRDLE = ['shoulder girdle']
export const SHOULDER_JOINT = ['shoulder joint']
export const NECK = ['neck']
export const HIPS = ['hips']
export const LEGS = ['legs']
export const REGIONS = [CORE, SPINE, THORACIC_WALL, SHOULDER_GIRDLE, SHOULDER_JOINT, NECK, HIPS, LEGS]

export const SUPERFICIAL = ['superficial', 's']
export const INTERMEDIATE = ['intermediate', 'im']
export const DEEP = ['deep', 'd']
export const DEPTHS = [SUPERFICIAL, INTERMEDIATE, DEEP]

export const PALPABLE = ['yes', 'y']
export const NOT_PALPABLE = ['no', 'n']
export const PALPABILITY = [PALPABLE, NOT_PALPABLE]

export const TIGHTNESS_PRONE = ['tightness-prone', 'tightness prone', 'tightness', 'tight']
export const WEAKNESS_PRONE = ['weakness-prone', 'weakness prone', 'weakness', 'weak']
export const JANDA_TYPES = [TIGHTNESS_PRONE, WEAKNESS_PRONE]

// How the agonists work in a movement situation (movements.js).
export const CONCENTRIC = ['concentric', 'c']
export const ECCENTRIC = ['eccentric', 'e']
export const ISOMETRIC = ['isometric', 'i']
export const CONTRACTIONS = [CONCENTRIC, ECCENTRIC, ISOMETRIC]

// The plane the movement happens in.
export const SAGITTAL = ['sagittal', 's']
export const FRONTAL = ['frontal', 'coronal', 'f']
export const TRANSVERSE = ['transverse', 'horizontal', 't']
export const PLANES = [SAGITTAL, FRONTAL, TRANSVERSE]

// Open chain: the end of the limb (or body part) moves freely.
// Closed chain: the end is fixed (e.g. foot on the floor) and the body moves.
export const OPEN_CHAIN = ['open', 'open chain', 'o']
export const CLOSED_CHAIN = ['closed', 'closed chain', 'c']
export const CHAINS = [OPEN_CHAIN, CLOSED_CHAIN]

export const BILATERAL = ['bilateral', 'bi', 'b']
export const UNILATERAL = ['unilateral', 'uni', 'u']
export const SIDES = [BILATERAL, UNILATERAL]

// Against: lifting a body part (or holding it up). With: gravity does the
// movement and the muscles brake it. Neutral: horizontal, gravity doesn't matter.
export const AGAINST_GRAVITY = ['against gravity', 'against', 'a']
export const WITH_GRAVITY = ['with gravity', 'with', 'w']
export const GRAVITY_NEUTRAL = ['gravity-neutral', 'gravity neutral', 'neutral', 'n']
export const GRAVITY_RELATIONS = [AGAINST_GRAVITY, WITH_GRAVITY, GRAVITY_NEUTRAL]
