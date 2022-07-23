// eslint-disable-next-line no-undef
const qs = require('qs')


export const getQueryString = (location, key) => {
  return qs.parse(location.search.replace('?', ''))[key]
}