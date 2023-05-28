// from https://garlandtools.cn/db/doc/browse/chs/2/instance.json
import instancesJson from '~/assets/data/instance.json'

export type Instance = typeof instances.browse[number]

const instances = readonly(instancesJson)

function sortInstances(a: Instance, b: Instance) {
  let test = b.min_lvl - a.min_lvl
  if (test !== 0)
    return test

  if (a.max_lvl && b.max_lvl)
    test = b.max_lvl - a.max_lvl
  if (test !== 0)
    return test

  if (a.min_ilvl && b.min_ilvl)
    test = b.min_ilvl - a.min_ilvl
  if (test !== 0)
    return test

  if (a.max_ilvl && b.max_ilvl)
    test = b.max_ilvl - a.max_ilvl

  return test
}

export function useInstanceContent() {
  const types = new Set(instances.browse.map(it => it.t))
  const source = instances.browse.slice().reverse() // so new content first
  return {
    dungeons: source.filter(it => it.t === '迷宫挑战').sort(sortInstances),
    trials: source.filter(it => it.t === '讨伐歼灭战').sort(sortInstances),
    raids: source.filter(it => it.t === '大型任务').sort(sortInstances),
    treasures: source.filter(it => it.t === '寻宝').sort(sortInstances),
    variants: source.filter(it => it.t === '特殊迷宫探索').sort(sortInstances),
    types,
  }
}
