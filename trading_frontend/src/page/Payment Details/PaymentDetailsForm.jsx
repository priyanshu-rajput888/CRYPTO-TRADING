import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addPaymentDetails } from "@/State/Withdrawal/Action";

const PaymentDetailsForm = () => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector(store => store.withdrawal);
  const form = useForm({
    defaultValues: {
      accountHolderName: "",
      ifsc: "",
      accountNumber: "",
      confirmAccountNumber: "",
      bankName: "",
    },
  });

  const onSubmit = async (data) => {
    const paymentDetails = { ...data };
    delete paymentDetails.confirmAccountNumber;

    try {
      await dispatch(addPaymentDetails({
        paymentDetails,
        jwt:localStorage.getItem("jwt")
      }));
    } catch {
      // The request error is displayed from Redux state below.
    }
  };

  return (
    <div className="px-10 py-2">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="accountHolderName">
              Account Holder Name
            </FieldLabel>

            <Input
              id="accountHolderName"
              className="border w-full border-gray-700 p-5"
              placeholder="Account holder name"
              {...form.register("accountHolderName", { required: "Enter the account holder name." })}
            />
            {form.formState.errors.accountHolderName && <p className="text-sm text-red-500">{form.formState.errors.accountHolderName.message}</p>}
          </Field>

          <Field>
            <FieldLabel htmlFor="ifsc">IFSC Code</FieldLabel>

            <Input
              id="ifsc"
              className="border w-full border-gray-700 p-5"
              placeholder="IFSC code"
              {...form.register("ifsc", { required: "Enter the IFSC code." })}
            />
            {form.formState.errors.ifsc && <p className="text-sm text-red-500">{form.formState.errors.ifsc.message}</p>}
          </Field>

          <Field>
            <FieldLabel htmlFor="accountNumber">Account Number</FieldLabel>

            <Input
              id="accountNumber"
              type="text"
              className="border w-full min-w-0 border-gray-700 p-5 font-mono text-sm whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ fontFamily: "monospace", whiteSpace: "nowrap" }}
              placeholder="**********6597"
              autoComplete="off"
              spellCheck={false}
              {...form.register("accountNumber", {
                required: "Enter the account number.",
                validate: value => /^\d+$/.test(value) || "Enter a valid account number."
              })}
            />
            {form.formState.errors.accountNumber && <p className="text-sm text-red-500">{form.formState.errors.accountNumber.message}</p>}
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmAccountNumber">
              Confirm Account Number
            </FieldLabel>

            <Input
              id="confirmAccountNumber"
              className="border w-full border-gray-700 p-5"
              placeholder="Confirm Account Number"
              autoComplete="off"
              {...form.register("confirmAccountNumber", {
                required: "Confirm the account number.",
                validate: value => value === form.getValues("accountNumber") || "Account numbers do not match."
              })}
            />
            {form.formState.errors.confirmAccountNumber && <p className="text-sm text-red-500">{form.formState.errors.confirmAccountNumber.message}</p>}
          </Field>

          <Field>
            <FieldLabel htmlFor="bankName">Bank Name</FieldLabel>

            <Input
              id="bankName"
              className="border w-full border-gray-700 p-5"
              placeholder="Yes Bank"
              {...form.register("bankName", { required: "Enter the bank name." })}
            />
            {form.formState.errors.bankName && <p className="text-sm text-red-500">{form.formState.errors.bankName.message}</p>}
          </Field>
        </FieldGroup>

        {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full py-5">
          {loading ? "Saving..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default PaymentDetailsForm;