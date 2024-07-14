import crypto from 'node:crypto'
import appConstants from '../appConstants'

export const removeFalsy = (object: Record<string, any>) => {
  const newObject: Record<string, any> = {}
  Object.keys(object).forEach((key) => {
    if (object[key]) {
      newObject[key] = object[key]
    }
  })
  return newObject
}

