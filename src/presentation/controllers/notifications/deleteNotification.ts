import { INotificationsDependencies } from "../../../application/interface/notifications/IDependencies";
import { Request, Response } from 'express'
import cron from 'node-cron'
import Notifications from "../../../infrastructure/database/models/notifications";
import { NotificationsEntity } from "../../../domain/entities/notificationsEntity";

export const deleteNotificationController = (dependencies: INotificationsDependencies) => {

    const { notificationsUseCases: { deleteNotificationUseCase } } = dependencies

    return async (req: Request, res: Response) => {

        try {

            const id = req?.query?.id

            const result = await deleteNotificationUseCase(dependencies).execute(id)

            if (result?.deletedCount === 1) {
                res.status(200).json({ status: 'ok' })
            } else {
                throw new Error('Failed to delete')
            }


        } catch (error: any) {
            console.log(error);

            res.status(error?.status || 500).json({ status: 'failed', message: error?.message })
        }
    }
}



const task = cron.schedule('0 */10 * * *', async () => {

    try {

        let sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 1);

        const notifications = await Notifications.find({
            createdAt: { $lt: sevenDaysAgo }
        })


        notifications.forEach(async (ob: any) => {
            await Notifications.deleteOne({ _id: ob?._id })

        })


    } catch (error) {
        console.log(error);

    }

});


task.start();