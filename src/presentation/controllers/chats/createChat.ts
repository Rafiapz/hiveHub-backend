import { IChatsDependencies } from "../../../application/interface/chats/IDependencies";
import { Request, Response } from 'express'
import { ChatsEntity } from "../../../domain/entities/chatsEntity";
import { uploadToCloudinary } from "../../../_lib/cloudinary";

export const createChatController = (dependencies: IChatsDependencies) => {

    const { chatsUseCases: { createChatUseCase } } = dependencies

    return async (req: Request, res: Response) => {

        try {

            const params = req?.params?.type

            let data: ChatsEntity = {
                message: req?.body?.message,
                senderId: req?.body?.senderId,
                conversationId: req?.body?.conversationId,
            }

            if (req?.file?.buffer && params === 'image') {
                const { url } = await uploadToCloudinary(
                    req.file.buffer,
                    req.file.mimetype,
                    "hivehub/chats"
                )
                data.image = url
            }

            if (params === 'video' && req?.file?.buffer) {
                const { url } = await uploadToCloudinary(
                    req.file.buffer,
                    req.file.mimetype,
                    "hivehub/chats"
                )
                data.video = url
            }

            const result = await createChatUseCase(dependencies).execute(data)

            res.status(200).json({ status: 'ok', data: result })

        } catch (error: any) {
            res.json({ status: 'failed', message: error.message })
        }
    }
}