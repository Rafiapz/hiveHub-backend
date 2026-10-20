import { IStoryDependencies } from "../../../application/interface/story/IDependencies";
import { Request, Response } from 'express'
import { StoryEntity } from "../../../domain/entities/storyEntity";
import { uploadToCloudinary } from "../../../_lib/cloudinary";


export const createStoryController = (dependencies: IStoryDependencies) => {

    const { storyUseCases: { createStoryUseCase } } = dependencies

    return async (req: Request, res: Response) => {

        try {

            if (!req?.file?.buffer) {
                throw new Error('No media file provided')
            }

            const { url } = await uploadToCloudinary(
                req.file.buffer,
                req.file.mimetype,
                "hivehub/stories"
            )

            const data: StoryEntity = {
                userId: req?.body?.userId,
                media: [url],
                description: req?.body?.description
            }

            const story = await createStoryUseCase(dependencies).execute(data)

            if (!story) {
                throw new Error('Failed to Post story')
            } else {
                res.status(200).json({ status: 'ok', data: story, message: 'Successfully posted your story' })
            }


        } catch (error: any) {
            res.status(error.status || 500).json({ status: 'failed', message: error.message })
        }
    }
}