import { web3, STORE_AWS_PROVIDER } from '../../bootstrap/dapp-api'
import statusHelper from '../../utils/api-status-helper'
import Archon from '@kleros/archon'

const storeApi = {

  postFile(file, extension = 'json') {
    const ArchonInstance = new Archon(web3.currentProvider)
    const fileHash = ArchonInstance.utils.multihashFile(
      file,
      0x1B // keccak-256
    );
    return fetch(STORE_AWS_PROVIDER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payload: {
          fileName: `${fileHash}.${extension}`,
          base64EncodedData: btoa(file)
        }
      })
    })
      .then(statusHelper)
      .then(response => response.json())
      .catch(err => err)
      .then(data => data)
  }
}

export default storeApi
