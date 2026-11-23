import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Field,
  FieldGroup,
} from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login, verifyTwoFactorOtp } from "@/State/Auth/Action";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const SigninForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [twoFactorSession, setTwoFactorSession] = useState(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setError("");
    setIsSubmitting(true);
    const result = await dispatch(login({data, navigate}));
    if (result?.twoFactorRequired) {
      setTwoFactorSession(result.session);
    } else if (result?.error) {
      setError(result.error);
    }
    setIsSubmitting(false);
  };

  const onVerifyOtp = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    const result = await dispatch(verifyTwoFactorOtp({
      session: twoFactorSession,
      otp,
      navigate,
    }));
    if (result?.error) {
      setError(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      {twoFactorSession ? (
        <form onSubmit={onVerifyOtp} className="space-y-6">
          <h1 className="text-xl font-bold text-center">Two-factor verification</h1>
          <p className="text-center text-sm text-white/80">
            Enter the 6-digit code sent to your email address.
          </p>
          <InputOTP
            value={otp}
            onChange={setOtp}
            maxLength={6}
            containerClassName="w-full justify-center"
            aria-label="Two-factor authentication code"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
          <Button
            type="submit"
            disabled={otp.length !== 6 || isSubmitting}
            className="w-full bg-[#A000C8] py-5 text-white hover:bg-[#8700A8]"
          >
            Verify and sign in
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setTwoFactorSession(null);
              setOtp("");
              setError("");
            }}
          >
            Back to sign in
          </Button>
        </form>
      ) : (
        <>
          <h1 className="text-xl font-bold text-center pb-3">Login</h1>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup>
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
            {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#A000C8] py-5 text-white hover:bg-[#8700A8]"
            >
              Submit
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default SigninForm;