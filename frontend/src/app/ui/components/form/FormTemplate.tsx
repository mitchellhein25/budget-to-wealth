import Form from 'next/form';

export type FormTemplateProps = {
  formId: string;
  formHeader: string;
  inputs: React.ReactNode;
  buttons: React.ReactNode;
  errorMessage?: string;
  infoMessage?: string;
  handleSubmit: (formData: FormData) => void;
}

export default function FormTemplate(props: FormTemplateProps) {
  return (
    <div className="card bg-base-100 shadow-sm w-full max-w-md">
      <div className="card-body p-6">
        <h2 className="card-title text-lg mb-6 text-center">
          {props.formHeader}
        </h2>
        <Form 
          action={props.handleSubmit} 
          className="space-y-4" 
          id={props.formId}
        >
          <div className="space-y-4">
            {props.inputs}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            {props.buttons}
          </div>
          {props.errorMessage && (
            <div className="alert alert-error">
              <span>{props.errorMessage}</span>
            </div>
          )}
          {props.infoMessage && (
            <div className="alert alert-info">
              <span>{props.infoMessage}</span>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}
