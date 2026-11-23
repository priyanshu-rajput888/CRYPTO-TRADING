import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { paymentHandler } from '@/State/Wallet/Action';
import React from 'react'
import { useDispatch } from 'react-redux';

const TopupForm = () => {
    const [amount, setAmount] = React.useState('')
    const [paymentMethod, setPaymentMethod] = React.useState('RAZORPAY')
    const dispatch = useDispatch()

    const handlePaymentMethodChange = (value) => {
        setPaymentMethod(value)
    }
    const handleChange = (e) => {
        setAmount(e.target.value)
    }

    const handleSubmit = () => {
        console.log(amount, paymentMethod);
        dispatch(paymentHandler({jwt:localStorage.getItem("jwt"),
          paymentMethod,
          amount
        }))
    }

  return (
    <div className="w-full min-w-0 pt-10 space-y-5">
      <div>
        <h1 className="pb-1">Enter Amount</h1>
        <Input
          onChange={handleChange}
          value={amount}
          className="py-7 text-lg"
          placeholder="$9999"
        />
      </div>

      <div>
        <h1 className="pb-1">Select payment method</h1>
        <RadioGroup
          onValueChange={(value) => handlePaymentMethodChange(value)}
          className="grid w-full min-w-0 grid-cols-1 gap-2"
          defaultValue="RAZORPAY"
        >
          <div className="flex w-full min-w-0 items-center gap-2 rounded-md border p-3">
            <RadioGroupItem className="h-9 w-9" value="RAZORPAY" id="r1" />

            <Label htmlFor="r1" className="min-w-0 flex-1">
              <div className="flex h-9 min-w-0 w-full items-center justify-center rounded-md bg-white px-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Razorpay_logo.svg/960px-Razorpay_logo.svg.png"
                  alt="Razorpay"
                  className="block h-8 max-w-full object-contain"
                />
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
      <Button onClick={handleSubmit} className="w-full min-w-0 py-7">Submit</Button>
    </div>
  );
}

export default TopupForm
