import React from 'react';
import Form from 'next/form';

type FormTemplateProps = {
  handleSubmit: (formData: FormData) => void;
  formHeader: string;
  errorMessage: string;
  infoMessage: string;
  inputs: React.ReactElement
  buttons: React.ReactElement
  formId: string
}

export default function FormTemplate(props: FormTemplateProps) {
  return (
    <Form 
      action={props.handleSubmit} 
      className="space-y-4 flex flex-col justify-center w-xs" 
      id={props.formId}
    >
      <h2 className="text-lg text-center">
        {props.formHeader}
      </h2>
        {props.inputs}
      <div className="flex justify-center">
        {props.buttons}
      </div>
      {props.errorMessage && (
        <p className="alert alert-error alert-soft">{props.errorMessage}</p>
      )}
      {props.infoMessage && (
        <p className="alert alert-info alert-soft">{props.infoMessage}</p>
      )}
    </Form>
  );
}
