import { User } from '../../models'
import { UserEntity } from '../../../../domain/entities'

export const create = async (data: UserEntity): Promise<UserEntity | null> => {

    try {

        // Check if a user with this email already exists
        const existingUser = await User.findOne({ email: data.email })

        if (existingUser) {
            // If already verified, reject duplicate registration
            if (existingUser.isVerified) {
                throw new Error('Email is already registered. Please login.')
            }

            // If user exists but is not verified (e.g. failed or abandoned verification previously),
            // update the unverified record with new signup details & fresh OTP
            const updatedUser = await User.findOneAndUpdate(
                { email: data.email, isVerified: false },
                { $set: data },
                { new: true }
            )

            return updatedUser
        }

        const newUser = await User.create(data)

        return newUser

    } catch (error: any) {
        if (error.code === 11000) {
            throw new Error('Email is already registered. Please login.')
        }
        throw new Error(error.message || 'User creation failed')
    }
}