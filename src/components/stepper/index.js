import React from 'react'
import PropTypes from 'prop-types'
import stylePropType from 'react-style-proptype'

/**
 * Creates a stepper.
 * @param {array} steps - Names of different steps.
 * @param {number} activeStep - Index of the active step.
 * @param {string} className - Classname of the component.
 * @param {string} styleComponent - Style of the component.
 * @param {string} styleStep - Style of the step box.
 * @param {string} styleLine - Style of the line between step boxes.
 * @param {string} styleActive - Active style step.
 * @returns {ReactElement} - Stepper generated
 */
const Stepper = ({
  steps,
  activeStep,
  className,
  styleComponent,
  styleStep,
  styleLine,
  styleActive
}) => {
  const stepsLines = steps.reduce((r, a) => r.concat(a, false), [])
  stepsLines.pop()

  return (
    <div style={styleComponent} className={`Stepper ${className}`}>
      {stepsLines.map(
        (step, i) =>
          i % 2 ? (
            <div
              key={i}
              style={{
                ...styleLine,
                ...(++activeStep >= i ? styleActive : {})
              }}
            />
          ) : (
            <div
              key={i}
              style={{
                ...styleStep,
                ...(activeStep >= i ? styleActive : {})
              }}
            >
              {step}
            </div>
          )
      )}
    </div>
  )
}

Stepper.propTypes = {
  // State
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeStep: PropTypes.number.isRequired,

  // Modifiers
  className: PropTypes.string,
  styleComponent: stylePropType,
  styleStep: stylePropType,
  styleLine: stylePropType,
  styleActive: stylePropType
}

Stepper.defaultProps = {
  // Modifiers
  className: '',
  styleComponent: {
    display: 'flex',
    justifyContent: 'space-around',
    flexFlow: 'row wrap',
    margin: '10px 20px',
    alignItems: 'center'
  },
  styleStep: {
    background: '#6e6e6e',
    color: '#fff',
    flexShrink: 1,
    padding: '10px 14px',
    borderRadius: '7px'
  },
  styleLine: {
    height: '2px',
    background: '#6e6e6e',
    flexGrow: 1
  },
  styleActive: {
    background: '#4f96ff'
  }
}

export default Stepper
