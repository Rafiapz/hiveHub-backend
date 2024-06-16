import { IPostDependencies } from "../../../application/interface/posts/IDependencies";
import { Request, Response, NextFunction } from 'express'
import { PostEntity } from "../../../domain/entities";
import { getTokenPayloads, verifyToken } from "../../../_lib/jwt";
import { User } from "../../../infrastructure/database/models";
import Notifications from "../../../infrastructure/database/models/notifications";
import { NotificationsEntity } from "../../../domain/entities/notificationsEntity";

export const createPostController = (dependencies: IPostDependencies) => {

    const { postUseCases: { createPostUseCase } } = dependencies

    return async (req: Request, res: Response) => {

        try {


            const token: string | undefined = req.cookies.userToken
            if (token) {
                const decoded = verifyToken(token)
                const path = `${process?.env.BACK_END_URL}/api/image/posts/${req?.file?.filename}`

                if (decoded) {
                    const mediaType = req.params.type

                    const data: PostEntity = {
                        userId: decoded.id,
                        media: mediaType ? { type: mediaType, path: path } : undefined,
                        content: req?.body?.content,
                        likes: 0,
                        comments: 0,
                        shares: 0
                    }

                    const post = await createPostUseCase(dependencies).execute(data)

                    if (post) {

                        const postedUser = await User.findOne({ _id: decoded?.id })
                        if (postedUser?.premium) {
                            const allUserIds = await User.find({ _id: { $ne: postedUser?._id } }, { _id: 1 })

                            allUserIds?.forEach(async (id: any) => {
                                const data: NotificationsEntity = {
                                    actionBy: postedUser?._id,
                                    message: 'Posted new post',
                                    type: 'post',
                                    actionOn: id,
                                    read: false
                                }
                                await Notifications.create(data)
                            })
                        }

                        res.json({ status: 'ok', postData: post, message: 'Your post has been successfully submitted!' })
                    } else {
                        throw new Error('Failed to create post')
                    }
                }

            } else {
                throw new Error('Something went wrong')
            }


        } catch (error: any) {
            console.log(error);
            res.json({ status: 'failed', message: error.message }).status(500)
            //send proper error message
        }
    }
}