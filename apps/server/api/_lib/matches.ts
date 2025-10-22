import { randomUUID } from 'crypto'
import type { Match } from './types'

// seed는 모듈 로드 시 한 번만 구성
const seed: Match[] = [
  { id: randomUUID(), event: 'BlackCombat 41', red: 'Kim A',  blue: 'Park B', status: 'scheduled' },
  { id: randomUUID(), event: 'BlackCombat 41', red: 'Lee C',  blue: 'Choi D', status: 'changed'   },
  { id: randomUUID(), event: 'BlackCombat 42', red: 'Jung E', blue: 'Han F',  status: 'scheduled' }
]

// 서버리스 콜드스타트마다 초기화되는 인메모리 스토어
let memory: Match[] = [...seed]

export const Matches = {
  list(): Match[] {
    return memory
  },
  create(input: Omit<Match, 'id'>): Match {
    const created: Match = { id: randomUUID(), ...input }
    memory = [created, ...memory]
    return created
  }
}