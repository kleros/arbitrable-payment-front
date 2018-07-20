/**
 * redirect to a URL or endpoint
 * E.g. - redirect('/evidences/new')
 * @param url
 * @history this.props.history
 * @param args
 */

export const redirect = (url, history, ...args) => () => {
  if (!args || args.length === 0) history.push(url)
  else {
    const allArgs = args.reduce((acc, arg) => `${acc}/${arg}`)
    history.push(`${url}/${allArgs}`)
  }
}

export const shortAddress = address =>
  `${address.substr(0, address.length - 36)}...${address.substr(37)}`

export const createMetaEvidence = (
  partyAAddress,
  partyBAddress,
  title,
  description,
  fileURI,
  fileHash
) => (
  {
    category: 'Escrow Contract',
    title,
    description,
    fileURI,
    fileHash,
    question: 'Which party abided by terms of the contract?',
    rulingOptions: {
      titles: ['Vote for Party A', 'Vote for Party B'],
      descriptions: ['Select to return funds to Party A', 'Select to release funds to Party B']
    },
    aliases: {
      [partyAAddress]: 'Party A',
      [partyBAddress]: 'Party B'
    }
  }
)
