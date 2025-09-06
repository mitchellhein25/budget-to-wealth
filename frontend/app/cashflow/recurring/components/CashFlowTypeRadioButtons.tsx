import React from 'react'
import { EXPENSE_ITEM_NAME, EXPENSE_ITEM_NAME_PLURAL, INCOME_ITEM_NAME } from '../../components/constants'
import { CashFlowType } from '../..';

type CashFlowTypeRadioButtonsProps = {
  selectedType: CashFlowType;
  setSelectedType: (type: CashFlowType) => void;
}

export function CashFlowTypeRadioButtons({selectedType, setSelectedType}: CashFlowTypeRadioButtonsProps) {
  return (
    <div>
      <div className="flex justify-center">
				<div className="form-control pt-4">
					<label className="label cursor-pointer gap-4">
						<span className="label-text font-medium">Show:</span>
						<div className="flex gap-4">
							<label className="label cursor-pointer gap-2">
								<input
									type="radio"
									name="cashflow-type"
									className="radio radio-primary"
									checked={selectedType === INCOME_ITEM_NAME}
									onChange={() => setSelectedType(INCOME_ITEM_NAME)}
								/>
								<span className="label-text">{INCOME_ITEM_NAME}</span>
							</label>
							<label className="label cursor-pointer gap-2">
								<input
									type="radio"
									name="cashflow-type"
									className="radio radio-primary"
									checked={selectedType === EXPENSE_ITEM_NAME}
									onChange={() => setSelectedType(EXPENSE_ITEM_NAME)}
								/>
								<span className="label-text">{EXPENSE_ITEM_NAME_PLURAL}</span>
							</label>
						</div>
					</label>
				</div>
			</div>
    </div>
  )
}
