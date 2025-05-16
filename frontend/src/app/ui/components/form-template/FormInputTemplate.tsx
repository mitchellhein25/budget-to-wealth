import React from 'react'

export type FormInputTemplateProps = {
  labelString: string;
  type: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function FormInputTemplate(formInputTemplateProps: FormInputTemplateProps) {
  return (
    <>
      <label htmlFor={formInputTemplateProps.labelString} className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
        {formInputTemplateProps.labelString}
      </label>
      <input
        id={formInputTemplateProps.labelString}
        name={formInputTemplateProps.labelString}
        type={formInputTemplateProps.type}
        required
        value={formInputTemplateProps.value}
        onChange={(e) => formInputTemplateProps.setValue(e.target.value)}
        className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      />
    </>
  )
}
