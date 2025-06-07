import React from 'react'

type InputFieldSetTemplateProps = {
  label: string,
  inputChild: React.ReactElement,
  isRequired: boolean
}

export default function InputFieldSetTemplate(props: InputFieldSetTemplateProps) {
  return (
    <fieldset className="fieldset mb-2">
      <legend className="fieldset-legend text-sm m-0 p-0">{props.label}</legend>
      {props.inputChild}
      {props.isRequired && <p className="label">Required</p>}
    </fieldset>
  )
}
