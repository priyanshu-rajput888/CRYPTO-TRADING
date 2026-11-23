import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { resetPassword, sendResetPasswordOtp } from "@/State/Auth/Action";

const ForgotPasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [session, setSession] = useState(null);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendCode = async (event) => {
    if (event) event.preventDefault();
    setError("");
    setIsSubmitting(true);
    const result = await dispatch(sendResetPasswordOtp(email.trim()));
    if (result.session) {
      setSession(result.session);
      setOtp("");
      setStep("verify");
    } else {
      setError(result.error || "Could not send a reset code.");
    }
    setIsSubmitting(false);
  };

  const submitReset = async (event) => {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const result = await dispatch(resetPassword({id: session, otp, password}));
    if (result.success) {
      setStep("complete");
    } else {
      setError(result.error || "Could not reset your password.");
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <h1 className="pb-3 text-center text-xl font-bold">Forgot Password</h1>

      {step === "email" && (
        <form onSubmit={sendCode} className="space-y-6">
          <p className="text-center text-sm text-white/80">
            Enter your account email and we’ll send you a password reset code.
          </p>
          <Input
            id="reset-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={event => setEmail(event.target.value)}
            className="w-full border border-gray-700 p-5 text-white placeholder:text-white/70"
            placeholder="Enter your email"
          />
          {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
          <Button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className="w-full bg-[#A000C8] py-5 text-white hover:bg-[#8700A8]"
          >
            {isSubmitting ? "Sending code..." : "Send reset code"}
          </Button>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={submitReset} className="space-y-5">
          <p className="text-center text-sm text-white/80">
            Enter the code sent to {email}.
          </p>
          <InputOTP
            value={otp}
            onChange={setOtp}
            maxLength={6}
            containerClassName="w-full justify-center"
            aria-label="Password reset code"
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
          <PasswordInput
            id="new-password"
            autoComplete="new-password"
            required
            value={password}
            onChange={event => setPassword(event.target.value)}
            className="w-full border border-gray-700 p-5 text-white placeholder:text-white/70"
            placeholder="New password"
          />
          <PasswordInput
            id="confirm-password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={event => setConfirmPassword(event.target.value)}
            className="w-full border border-gray-700 p-5 text-white placeholder:text-white/70"
            placeholder="Confirm new password"
          />
          {error && <p className="text-sm text-red-400" role="alert">{error}</p>}
          <Button
            type="submit"
            disabled={isSubmitting || otp.length !== 6 || !password || !confirmPassword}
            className="w-full bg-[#A000C8] py-5 text-white hover:bg-[#8700A8]"
          >
            {isSubmitting ? "Updating password..." : "Reset password"}
          </Button>
          <div className="flex justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => {
                setError("");
                setStep("email");
              }}
            >
              Change email
            </Button>
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={sendCode}>
              Resend code
            </Button>
          </div>
        </form>
      )}

      {step === "complete" && (
        <div className="space-y-5 text-center">
          <p className="text-green-400" role="status">
            Your password has been updated. You can now sign in with your new password.
          </p>
          <Button
            type="button"
            onClick={() => navigate("/signin")}
            className="w-full bg-[#A000C8] py-5 text-white hover:bg-[#8700A8]"
          >
            Back to sign in
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
