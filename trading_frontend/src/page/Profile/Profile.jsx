import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useDispatch, useSelector } from "react-redux";
import { GET_USER_SUCCESS } from "@/State/Auth/ActionType";
import api from "@/config/Api";

const profileFields = [
  { name: "fullName", label: "Full Name", type: "text" },
  { name: "dateOfBirth", label: "Date of Birth", type: "date" },
  { name: "nationality", label: "Nationality", type: "text" },
  { name: "address", label: "Address", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "postcode", label: "Postcode", type: "text" },
  { name: "country", label: "Country", type: "text" },
];

const Profile = () => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState(() => ({
    email: auth.user?.email ?? null,
    fullName: auth.user?.fullName ?? null,
    dateOfBirth: null,
    nationality: null,
    address: null,
    city: null,
    postcode: null,
    country: null,
  }));
  const [draftProfile, setDraftProfile] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [verificationMode, setVerificationMode] = useState(null);
  const [otp, setOtp] = useState("");
  const [twoFactorError, setTwoFactorError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const isTwoFactorEnabled = Boolean(
    auth.user?.twoFactorAuth?.enable ?? auth.user?.twoFactorAuth?.isEnable
  );

  const startEditing = () => {
    setDraftProfile(profile);
    setIsEditing(true);
  };

  const saveChanges = () => {
    setProfile(draftProfile);
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const startTwoFactorFlow = async (mode) => {
    setTwoFactorError("");
    setIsSendingOtp(true);
    try {
      const jwt = auth.jwt || localStorage.getItem("jwt");
      await api.post(
        "/api/users/verification/EMAIL/send-otp",
        null,
        {headers: {Authorization: `Bearer ${jwt}`}}
      );
      setOtp("");
      setVerificationMode(mode);
    } catch (error) {
      setTwoFactorError(
        error.response?.data?.message ??
        error.response?.data?.detail ??
        error.message
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyTwoFactorChange = async (event) => {
    event.preventDefault();
    setTwoFactorError("");
    setIsVerifying(true);
    try {
      const jwt = auth.jwt || localStorage.getItem("jwt");
      const endpoint = verificationMode === "enable"
        ? "/api/users/enable-two-factor/verify-otp"
        : "/api/users/disable-two-factor/verify-otp";
      const response = await api.patch(
        endpoint,
        {otp},
        {headers: {Authorization: `Bearer ${jwt}`}}
      );
      dispatch({type: GET_USER_SUCCESS, payload: response.data});
      setVerificationMode(null);
      setOtp("");
    } catch (error) {
      setTwoFactorError(
        error.response?.data?.message ??
        error.response?.data?.detail ??
        error.message
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const renderField = ({ name, label, type }) => (
    <div className="flex items-center" key={name}>
      <label className="w-36 shrink-0" htmlFor={`profile-${name}`}>
        {label} :
      </label>
      {isEditing ? (
        <Input
          id={`profile-${name}`}
          type={type}
          value={draftProfile[name] ?? ""}
          onChange={event =>
            setDraftProfile(current => ({
              ...current,
              [name]: event.target.value || null,
            }))
          }
          aria-label={label}
        />
      ) : (
        <p className="text-gray-500">{profile[name] || "Not provided"}</p>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center mb-5">
      <div className="pt-10 w-full lg:w-[60%]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-9">
            <CardTitle>Your Information</CardTitle>
            {isEditing ? (
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={cancelEditing}>
                  Cancel
                </Button>
                <Button type="button" onClick={saveChanges}>
                  Save
                </Button>
              </div>
            ) : (
              <Button type="button" onClick={startEditing}>
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="lg:flex gap-32">
              <div className="space-y-7">
                <div className="flex items-center">
                  <p className="w-36 shrink-0">Email :</p>
                  <p className="text-gray-500">{profile.email || "Not provided"}</p>
                </div>
                {profileFields.slice(0, 3).map(renderField)}
              </div>

              <div className="space-y-7">
                {profileFields.slice(3).map(renderField)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <CardTitle>Two-factor authentication</CardTitle>
                <span
                  role="status"
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    isTwoFactorEnabled
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {isTwoFactorEnabled ? "Enabled" : "Not enabled"}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {isTwoFactorEnabled
                  ? `Enabled. Sign-in codes are sent to ${auth.user?.email ?? "your email"}.`
                  : "Add a one-time email code to your password when signing in."}
              </p>
            </div>
            <Button
              type="button"
              variant={isTwoFactorEnabled ? "outline" : "default"}
              disabled={isSendingOtp || !auth.user?.email}
              onClick={() => startTwoFactorFlow(isTwoFactorEnabled ? "disable" : "enable")}
            >
              {isSendingOtp
                ? "Sending code..."
                : isTwoFactorEnabled
                  ? "Turn off"
                  : "Set up"}
            </Button>
          </CardHeader>
          {twoFactorError && !verificationMode && (
            <CardContent>
              <p className="text-sm text-red-600" role="alert">{twoFactorError}</p>
            </CardContent>
          )}
        </Card>
      </div>

      <Dialog
        open={verificationMode !== null}
        onOpenChange={(open) => {
          if (!open) {
            setVerificationMode(null);
            setOtp("");
            setTwoFactorError("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {verificationMode === "enable" ? "Set up two-factor authentication" : "Turn off two-factor authentication"}
            </DialogTitle>
            <DialogDescription>
              Enter the 6-digit code sent to {auth.user?.email}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={verifyTwoFactorChange} className="space-y-5">
            <InputOTP
              value={otp}
              onChange={setOtp}
              maxLength={6}
              containerClassName="w-full justify-center"
              aria-label="Email verification code"
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
            {twoFactorError && <p className="text-sm text-red-600" role="alert">{twoFactorError}</p>}
            <DialogFooter>
              <Button type="submit" disabled={otp.length !== 6 || isVerifying}>
                {isVerifying ? "Verifying..." : "Confirm"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
