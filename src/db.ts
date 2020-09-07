import _db from 'quick.db'

export class DB {
  db: typeof _db
  constructor() {
    this.db = _db
    const entries = this.db.all()
    entries.forEach(entry => {
      this.db.delete(entry.ID)
    })
  }

  set = (key: string, value: any) => {
    this.db.set(key, value)
  }

  get = (key: string): any => {
    return this.db.get(key)
  }

  has = (key: string) => {
    return this.db.has(key)
  }

  delete = (key: string) => {
    this.db.delete(key)
  }
}