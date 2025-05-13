import React from 'react';
import Form from 'next/form';
import FormInputTemplate, { FormInputTemplateProps } from './FormInputTemplate';

type FormTemplateProps = {
  title: string;
  buttonText: string;
  inputFields: FormInputTemplateProps[];
  formMessage: string | null,
  handleSubmit: (formData: FormData) => Promise<void>;
}

export default function FormTemplate(formTemplateProps: FormTemplateProps) {
  return (
    <Form
      action={formTemplateProps.handleSubmit}
      className="p-6 rounded-xl bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-700 space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">{formTemplateProps.title}</h2>
      {formTemplateProps.inputFields.map((props, index) => (
        <div key={index}>
          <FormInputTemplate 
            labelString={props.labelString}
            type={props.type}
            value={props.value}
            setValue={props.setValue}
          />
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        {formTemplateProps.buttonText}
      </button>
      {formTemplateProps.formMessage && (
        <p className="text-sm text-gray-800 dark:text-gray-200 mt-2">{formTemplateProps.formMessage}</p>
      )}
    </Form>
  );
}
