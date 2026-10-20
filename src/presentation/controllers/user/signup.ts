import { Request, Response, NextFunction } from 'express'
import { IDependencies } from '../../../application/interface/user/IDependencies'
import { passwordHashing } from '../../../_lib/bcrypt'
import { generateOtp } from '../../../_lib/otp'

export const signupController = (dependencies: IDependencies) => {

    const { useCases: { createUserUseCase, findOneUserUseCase } } = dependencies

    return async (req: Request, res: Response) => {

        try {

            const { email, password, fullName } = req.body

            if (!email || !password || !fullName) {
                throw new Error('Please fill in all required fields')
            }

            // Check if user already exists
            const existingUser = await findOneUserUseCase(dependencies).execute({ email })

            if (existingUser && existingUser.isVerified) {
                throw new Error('Email is already registered. Please login.')
            }

            let data = { ...req.body }
            data.isActive = true
            data.role = 'user'
            data.isVerified = false
            data.password = await passwordHashing(data.password)
            data.createdAt = Date.now()
            data.otp = generateOtp(data.email)
            data.profilePhoto = `${process?.env.BACK_END_URL}/api/image/user/no-profile.webp`
            data.coverPhoto = `${process?.env.BACK_END_URL}/api/image/user/no-coverphoto.jpg`

            const user = await createUserUseCase(dependencies).execute(data)

            if (user) {
                res.status(200).json({ status: 'ok', message: 'Verification OTP sent to your email' })
            } else {
                throw new Error('Failed to create account')
            }

        } catch (error: any) {
            res.status(400).json({ status: 'failed', message: error.message })
        }
    }
}
