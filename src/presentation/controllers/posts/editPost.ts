import { getTokenPayloads } from "../../../_lib/jwt";
import { IPostDependencies } from "../../../application/interface/posts/IDependencies";
import { Request, Response } from 'express'
import { PostEntity } from "../../../domain/entities";
import { ObjectId } from "mongoose";
import { uploadToCloudinary } from "../../../_lib/cloudinary";

export const editPostController = (dependencies: IPostDependencies) => {

    const { postUseCases: { updatePostUseCase } } = dependencies

    return async (req: Request, res: Response) => {

        try {

            const token: string | undefined = req.cookies.userToken
            if (token) {
                const decoded = getTokenPayloads(token)

                if (decoded && typeof req?.query?.postId === 'string') {
                    let mediaType = req?.params?.type
                    const formData = req?.body

                    let mediaPath: string | undefined
                    if (formData?.media) {
                        // Client sent existing media metadata (no new upload)
                        const existingMedia = JSON.parse(formData?.media)
                        mediaPath = existingMedia.url
                        mediaType = existingMedia.type
                    } else if (req?.file?.buffer) {
                        // New file uploaded — push to Cloudinary
                        const { url } = await uploadToCloudinary(
                            req.file.buffer,
                            req.file.mimetype,
                            "hivehub/posts"
                        )
                        mediaPath = url
                    }

                    const postIdString: string = req?.query?.postId
                    const postId: ObjectId = Object(postIdString)
                    const data: PostEntity = {
                        _id: postId,
                        userId: decoded.id,
                        media: mediaPath ? { path: mediaPath, type: mediaType } : undefined,
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
            res.json({ status: 'failed', message: error.message }).status(400)

        }
    }
}