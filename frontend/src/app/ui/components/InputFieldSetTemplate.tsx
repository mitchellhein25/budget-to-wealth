import React from 'react'

type InputFieldSetTemplateProps = {
  label: string,
  inputChild: React.ReactElement,
  isRequired: boolean
}

export default function InputFieldSetTemplate(props: InputFieldSetTemplateProps) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">props.label</legend>
      {props.inputChild}
      {props.isRequired && <p className="label">Required</p>}
    </fieldset>
  )
}
