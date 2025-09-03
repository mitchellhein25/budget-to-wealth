import Form from 'next/form';
import { MessageState, messageTypeIsError, messageTypeIsInfo } from '@/app/lib/utils';

export type FormTemplateProps = {
  formId: string;
  formHeader: string;
  inputs: React.ReactNode;
  buttons: React.ReactNode;
  message: MessageState;
  handleSubmit: (formData: FormData) => void;
}

export function FormTemplate(props: FormTemplateProps) {
  return (
    <div className="card bg-base-100 shadow-sm w-full max-w-md">
      <div className="card-body p-3 sm:p-6">
        <h2 className="card-title text-lg mb-6 text-center">
          {props.formHeader}
        </h2>
        <Form 
          action={props.handleSubmit} 
          className="space-y-3 sm:space-y-4" 
          id={props.formId}
        >
          <div className="space-y-3 sm:space-y-4">
            {props.inputs}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            {props.buttons}
          </div>
          {messageTypeIsError(props.message) && (
            <div className="alert alert-error">
              <span>{props.message.text}</span>
            </div>
          )}
          {messageTypeIsInfo(props.message) && (
            <div className="alert alert-info">
              <span>{props.message.text}</span>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}
