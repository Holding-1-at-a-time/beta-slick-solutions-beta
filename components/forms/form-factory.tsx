"use client"

import type { ReactNode } from "react"
import VehicleForm, { type VehicleFormProps } from "./vehicle-form"
import AssessmentForm, { type AssessmentFormProps } from "./assessment-form"
import PaymentForm, { type PaymentFormProps } from "./payment-form"
import SignaturePad, { type SignaturePadProps } from "./signature-pad"
import MediaUploader, { type MediaUploaderProps } from "./media-uploader"

export type FormType = "vehicle" | "assessment" | "payment" | "signature" | "media"

type FormProps =
  | ({ type: "vehicle" } & VehicleFormProps)
  | ({ type: "assessment" } & AssessmentFormProps)
  | ({ type: "payment" } & PaymentFormProps)
  | ({ type: "signature" } & SignaturePadProps)
  | ({ type: "media" } & MediaUploaderProps)

interface FormFactoryProps {
  formProps: FormProps
  wrapper?: (children: ReactNode) => ReactNode
}

export function FormFactory({ formProps, wrapper }: FormFactoryProps) {
  let formComponent: ReactNode

  switch (formProps.type) {
    case "vehicle":
      formComponent = <VehicleForm {...formProps} />
      break
    case "assessment":
      formComponent = <AssessmentForm {...formProps} />
      break
    case "payment":
      formComponent = <PaymentForm {...formProps} />
      break
    case "signature":
      formComponent = <SignaturePad {...formProps} />
      break
    case "media":
      formComponent = <MediaUploader {...formProps} />
      break
  }

  if (wrapper) {
    return wrapper(formComponent)
  }

  return formComponent
}
