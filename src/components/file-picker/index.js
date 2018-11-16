import React from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'

import Button from '../button'

import './file-picker.css'

const FilePicker = ({
  input: { value, onChange },
  message,
  buttonMessage,
  imageFilePreviewURL,
  ...rest
}) => (
  <Dropzone className="FilePicker" onDropAccepted={onChange} {...rest}>
    <small>{value ? value[0].name : message}</small>
    <Button type="ternary" size="small">
      {buttonMessage}
    </Button>
    {imageFilePreviewURL && (
      <div
        className="FilePicker-filePreview"
        style={{ backgroundImage: `url(${imageFilePreviewURL})` }}
      />
    )}
  </Dropzone>
)

FilePicker.propTypes = {
  // Redux Form
  input: PropTypes.shape({
    value: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.shape({}).isRequired),
      PropTypes.string,
      PropTypes.number
    ]),
    onChange: PropTypes.func
  }).isRequired,

  // React Dropzone
  ...Dropzone.propTypes,

  // State
  message: PropTypes.node,
  buttonMessage: PropTypes.node,
  imageFilePreviewURL: PropTypes.string
}

FilePicker.defaultProps = {
  // State
  message: 'Drag agreement here or',
  buttonMessage: 'Browse Agreement',
  imageFilePreviewURL: null
}

export default FilePicker
