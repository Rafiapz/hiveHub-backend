import { getTokenPayloads } from "../../../_lib/jwt";
import { IPostDependencies } from "../../../application/interface/posts/IDependencies";
import { Request, Response } from 'express'
import { PostEntity } from "../../../domain/entities";
import { ObjectId } from "mongoose";

export const editPostController = (dependencies: IPostDependencies) => {

    const { postUseCases: { updatePostUseCase } } = dependencies

    return async (req: Request, res: Response) => {

        try {

            const token: string | undefined = req.cookies.userToken
            if (token) {
                const decoded = getTokenPayloads(token)
                let path = `${process?.env.BACK_END_URL}/api/image/posts/${req?.file?.filename}`


                if (decoded && typeof req?.query?.postId === 'string') {
                    let mediaType = req?.params?.type
                    const formData = req?.body

                    let media
                    if (formData?.media) {
                        media = JSON.parse(formData?.media)
                        path = media.url
                        mediaType = media.type
                    }

                    const postIdString: string = req?.query?.postId
                    const postId: ObjectId = Object(postIdString)
                    const data: PostEntity = {
                        _id: postId,
                        userId: decoded.id,
                        media: { path: path, type: mediaType },
                        content: formData?.content
                    }


                    const updatedPost = await updatePostUseCase(dependencies).execute(data)

                    if (updatedPost) {
                        res.json({ status: 'ok', postData: updatedPost, message: 'Your post has been successfully updated!' })
                    } else {
                        throw new Error('Failed to update post')
                    }

                } else {
                    throw new Error('Something went wrong')
                }

            } else {
                throw new Error('Please login and try again')
            }


        } catch (error: any) {
            console.log(error);
            res.json({ status: 'failed', message: error.message }).status(400)

        }
    }
}