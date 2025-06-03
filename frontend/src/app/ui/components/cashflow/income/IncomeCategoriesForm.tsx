"use client"

import React from "react"
import Form from "next/form";
import { CashFlowCategory } from "@/app/lib/models/CashFlow/CashFlowCategory";

interface IncomeCategoriesFormProps {
  handleSubmit: (formData: FormData) => void;
  editingIncomeCategory: CashFlowCategory | null;
  onNameChange: (name: string) => void;
  onReset: () => void;
  message: string;
}

export default function IncomeCategoriesForm(props: IncomeCategoriesFormProps) {

  return (
    <Form action={props.handleSubmit} className="space-y-4 flex flex-col justify-center w-xs">
      <h2 className="text-lg text-center">
        {props.editingIncomeCategory?.id ? "Edit Income Category" : "New Income Category"}
      </h2>
      <label htmlFor="Name" className="label">
        Name
      </label>
      <input
        id="Id"
        name="Id"
        readOnly
        type="text"
        value={props.editingIncomeCategory?.id ?? ''}
        hidden={true}
      />
      <input
        id="Name"
        name="Name"
        type="text"
        required
        value={props.editingIncomeCategory?.name ?? ""}
        onChange={(e) => props.onNameChange(e.target.value)}
        className="input w-full"
      />
      <div className="flex justify-center">
        <button
          type="submit"
          className="m-1 btn btn-primary min-w-25"
        >
          {props.editingIncomeCategory?.id ? "Update" : "Create"}
        </button>
        <button
          type="reset"
          onClick={props.onReset}
          hidden={props.editingIncomeCategory == null || props.editingIncomeCategory.name == ""}
          className="m-1 btn btn-secondary min-w-25"
        >
          Reset
        </button>
      </div>
      {props.message && (
        <p className="alert alert-error alert-soft">{props.message}</p>
      )}
    </Form>
  )
}
