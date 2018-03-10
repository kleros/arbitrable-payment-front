import React from 'react'
import PropTypes from 'prop-types'

const TextareaInput = ({
  input: { value, type, onChange },
  meta: { valid, touched, error },
  placeholder,
  rows,
  cols,
  ...rest
}) => (
  <div className="TextareaInput" {...rest}>
    <textarea
      rows={rows}
      cols={cols}
      className="input"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...rest}
    >
      {value}
    </textarea>
    {/* T O D O: Display meta data */}
    {console.log(`valid: ${valid}`, `touched: ${touched}`, `error: ${error}`)}
  </div>
)

TextareaInput.defaultProps = {
  rows: 7,
  cols: 50
}

TextareaInput.propTypes = {
  // Redux Form
  input: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func
  }).isRequired,
  meta: PropTypes.shape({
    valid: PropTypes.bool,
    touched: PropTypes.bool,
    error: PropTypes.string
  }).isRequired,
  // State
  placeholder: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
  rows: PropTypes.number,
  cols: PropTypes.number
}

export default TextareaInput
