/**
 * redirect to a URL or endpoint
 * E.g. - redirect('/evidences/new')
 * @param url
 * @history this.props.history
 * @param args
 */

export const redirect = (url, history, ...args) => {
  if (!args || args.length === 0) history.push(url)
  else {
    const allArgs = args.reduce((acc, arg) => `${acc}/${arg}`)
    history.push(`${url}/${allArgs}`)
  }
}
