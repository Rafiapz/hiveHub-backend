import { User } from '../../models'
import { UserEntity } from '../../../../domain/entities'

export const updateUserById = async (id: any, data: any): Promise<UserEntity | null> => {

    try {

        const user = await User.findOneAndUpdate({ _id: id }, data)

        return user

    } catch (error: any) {
        throw new Error(error.message)
    }
}