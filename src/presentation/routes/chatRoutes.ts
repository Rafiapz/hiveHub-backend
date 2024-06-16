
import { Router } from 'express'

import { currentUser } from '../middlewares/currentUser'
import { INetworkDependencies } from '../../application/interface/network/IDependencies'
import { IChatsDependencies } from '../../application/interface/chats/IDependencies'
import { controllers } from '../controllers/chats'
import { uploadSingleFile } from '../../_lib/multer'
import { fetchPeerId } from '../../_boot/socket'



export const chatRoutes = (dependencies: IChatsDependencies) => {

    const { createConvesation, createChat, fetchConversations, fetchChats, onlineUsers } = controllers(dependencies)

    const router = Router()

    router.route('/create-conversation').post(currentUser, createConvesation)

    router.route('/fetch-conversations/:userId').get(currentUser, fetchConversations)

    router.route('/create-message/:type').post(currentUser, uploadSingleFile, createChat)

    router.route('/fetch-messages/:id').get(currentUser, fetchChats)

    router.route('/fetch-online-users').get(currentUser, onlineUsers)

    router.route('/send-video/:type').post(createChat)

    router.route('/fetch-peerId/:id').get(fetchPeerId)




    return router
}