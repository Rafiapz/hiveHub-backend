import { Request, Response } from 'express'
import { IPostDependencies } from '../../../application/interface/posts/IDependencies'
import { PostEntity } from '../../../domain/entities'

export const repostController = (dependencies: IPostDependencies) => {

    const { postUseCases: { findOneAndUpdateUseCase, createPostUseCase, updatePostUseCase } } = dependencies

    return async (req: Request, res: Response) => {

        try {

            const postId = req?.body?.postId

            const originalPost = await findOneAndUpdateUseCase(dependencies).execute(postId)

            if (!originalPost) {
                throw new Error('Unable to repost the post')
            }

            const data: PostEntity = {
                userId: req?.body?.userId,
                content: originalPost?.content,
                media: originalPost?.media,
                likes: originalPost?.likes || 0,
                comments: originalPost?.comments || 0,
                shares: originalPost?.shares || 1
            }

            const newPost = await createPostUseCase(dependencies).execute(data)

            if (!newPost) {
                throw new Error('Unable to repost the post')
            }

            res.status(200).json({
                status: 'ok',
                data: newPost,
                originalPost: originalPost,
                updatedShares: originalPost?.shares || 1
            })

        } catch (error: any) {
            res.status(error?.status || 500).json({ status: 'failed', message: error?.message })
        }
    }
}
