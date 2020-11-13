
  /**
 * 链接正则
 * @param {*} link
 */
export function isLink(link) {
    return /http(|s):\/\/.*$/.test(link)
  }