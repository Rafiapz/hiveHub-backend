import { Posts } from '../../models'
import { PostEntity } from '../../../../domain/entities'

export const create = async (data: PostEntity): Promise<PostEntity | null> => {

    try {

        const newPost = await Posts.create(data)

        return newPost

    } catch (error: any) {
        throw new Error(error.message)
    }
}