import { generateOtp } from "../../../_lib/otp";
import { IDependencies } from "../../../application/interface/user/IDependencies";
import { Request, Response } from 'express'

export const updateOtpController = (dependencies: IDependencies) => {

    const { useCases: { updateOneUserUseCase } } = dependencies

    return async (req: Request, res: Response) => {

        try {

            const email: string | undefined = req.query.email as string | undefined

            if (!email) {
                throw new Error('Email is required to resend OTP')
            }

            const otpDetails = generateOtp(email)

            await updateOneUserUseCase(dependencies).execute({ email: email }, { otp: otpDetails })

            res.status(200).json({ status: 'ok', message: 'Successfully resent OTP' })
        } catch (error: any) {
            res.status(400).json({ status: 'failed', message: error.message })
        }
    }
}