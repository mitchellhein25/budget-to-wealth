import React from 'react'
import FormTemplate from '../../FormTemplate';
import UpdateCreateButton from '../../buttons/UpdateCreateButton';
import ResetButton from '../../buttons/ResetButton';
import { CashFlowEntry } from '@/app/lib/models/CashFlow/CashFlowEntry';

interface IncomesFormProps {
  handleSubmit: (formData: FormData) => void;
  editingIncomeEntry: CashFlowEntry | null;
  onIncomeEntryChange: (incomeEntry: CashFlowEntry) => void;
  onReset: () => void;
  infoMessage: string;
  errorMessage: string;
}

export default function IncomesForm(props : IncomesFormProps) {

  const formHeader: string = props.editingIncomeEntry?.id ? "Edit Income Entry" : "New Income Entry";

  const inputs: React.ReactElement = <></>;

    const buttons: React.ReactElement = (
      <>
        <UpdateCreateButton isUpdateState={props.editingIncomeEntry?.id != null} />
        <ResetButton 
          onClick={props.onReset}
          isHidden={true}
        />
      </>
    )

  return (
    <FormTemplate
      handleSubmit={props.handleSubmit}
      formHeader={formHeader}
      inputs={inputs}
      buttons={buttons}
      infoMessage={props.infoMessage}
      errorMessage={props.errorMessage}
    />
  )
}
