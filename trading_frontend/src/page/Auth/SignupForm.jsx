import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { DialogClose } from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { register } from "@/State/Auth/Action";


const SignupForm = () => {
  const dispatch = useDispatch()
  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    dispatch(register(data))
    console.log(data);
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-center pb-3">Create New Account</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <Field>

            <Input
              id="fullName"
              className="w-full border border-gray-700 p-5 text-white placeholder:text-white/70"
              placeholder="Enter Full Name"
              {...form.register("fullName")}
            />
          </Field>

          <Field>

            <Input
              id="email"
              className="w-full border border-gray-700 p-5 text-white placeholder:text-white/70"
              placeholder="Enter your email"
              {...form.register("email")}
            />
          </Field>

          <Field>
            <PasswordInput
              id="password"
              className="w-full border border-gray-700 p-5 text-white placeholder:text-white/70"
              placeholder="Enter your password"
              autoComplete="off"
              spellCheck={false}
              {...form.register("password")}
            />
          </Field>

        </FieldGroup>

        
          <Button
            type="submit"
            className="w-full bg-[#A000C8] py-5 text-white hover:bg-[#8700A8]"
          >
            Submit
          </Button>
        
      </form>
    </div>
  );
};

export default SignupForm;