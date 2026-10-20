import { genereateToken } from "../../../_lib/jwt";
import { IDependencies } from "../../../application/interface/user/IDependencies";
import { Request, Response, NextFunction } from 'express'

export const verifyController = (dependencies: IDependencies) => {

    const { useCases: { verifyUserUseCase } } = dependencies

    return async (req: Request, res: Response, next: NextFunction) => {

        try {

            const data = req.body
            if (!data.email || !data.otp) {
                throw new Error('Verification failed. Email and OTP are required.')
            }

            const user = await verifyUserUseCase(dependencies).execute(data)

            if (user) {
                const token = genereateToken({ id: user?._id, email: user?.email })
                res.cookie('userToken', token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, sameSite: "none", secure: true })

                res.status(200).json({ status: 'ok', message: "You have successfully verified your account", userData: user })
            } else {
                throw new Error('Verification failed')
            }

        } catch (error: any) {
            res.status(400).json({ status: 'failed', message: error.message })
        }

    }
}