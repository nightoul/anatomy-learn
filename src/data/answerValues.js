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
