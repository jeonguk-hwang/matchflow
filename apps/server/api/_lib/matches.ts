import { nanoid } from 'nanoid'
import type { Match } from './types'

const seed: Match[] = [
  { id: nanoid(8), event: 'BlackCombat 41', red: 'Kim A',   blue: 'Park B', status: 'scheduled' },
  { id: nanoid(8), event: 'BlackCombat 41', red: 'Lee C',   blue: 'Choi D', status: 'changed'   },
  { id: nanoid(8), event: 'BlackCombat 42', red: 'Jung E',  blue: 'Han F',  status: 'scheduled' }
]

let memory: Match[] = [...seed]

export const Matches = {
  list(): Match[] {
    return memory
  },
  create(input: Omit<Match, 'id'>): Match {
    const created: Match = { id: nanoid(8), ...input }
    memory = [created, ...memory]
    return created
  }
}