import { INetworkDependencies } from "../../../application/interface/network/IDependencies";
import { Request, Response } from 'express'
import { NetworksEntity } from "../../../domain/entities";
import { INotificationsDependencies } from "../../../application/interface/notifications/IDependencies";
import { NotificationsEntity } from "../../../domain/entities/notificationsEntity";

export const coneectionRequestController = (dependencies: INetworkDependencies, notificationDependencies: INotificationsDependencies) => {

    const { networkUseCases: { connectionRequestUseCase } } = dependencies

    const { notificationsUseCases: { createNotificationUseCase } } = notificationDependencies

    return async (req: Request, res: Response) => {

        try {


            const user = req?.user
            const sourceUserId = (user as any)?.id;
            const targetUserId: any = req?.query?.target

            const data: NetworksEntity = {
                sourceUserId: sourceUserId,
                targetUserId: targetUserId,
                status: 'following'
            }

            const createdData = await connectionRequestUseCase(dependencies).execute(data)

            if (createdData) {

                const data: NotificationsEntity = {
                    actionBy: sourceUserId,
                    actionOn: targetUserId,
                    type: 'started_following',
                    message: 'Started following you'
                }

                await createNotificationUseCase(notificationDependencies).execute(data)
                res.status(200).json({ status: 'ok', message: `You are now following ${createdData?.targetUserId?.fullName}`, data: { createdData } })
            } else {
                throw new Error('Unable to make request')
            }

        } catch (error: any) {
            res.status(error.status || 500).json({ status: 'ok', message: error.message })
        }
    }
}   