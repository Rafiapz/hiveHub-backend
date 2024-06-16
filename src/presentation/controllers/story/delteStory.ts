import { IStoryDependencies } from "../../../application/interface/story/IDependencies";
import { Request, Response } from 'express'

export const deleteStoryController = (dependencies: IStoryDependencies) => {

    const { storyUseCases: { deleteStoryUseCase } } = dependencies

    return async (req: Request, res: Response) => {

        try {

            const storyId = req?.body?.storyId

            const image = req?.body?.image
            const data = {
                storyId,
                image
            }

            const result = await deleteStoryUseCase(dependencies).execute(data)

            res.status(200).json({ status: 'ok' })


        } catch (error: any) {
            console.log(error);

            res.status(error.status || 500).json({ status: 'failed', message: error.message })
        }
    }
}