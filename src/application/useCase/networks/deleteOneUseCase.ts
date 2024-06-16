import { INetworkDependencies } from "../../interface/network/IDependencies";

export const deleteOneUseCase = (dependencies: INetworkDependencies) => {

    const { networkRepositories: { deleteOne } } = dependencies

    return {

        execute: async (id: any) => {

            try {

                return await deleteOne(id)

            } catch (error: any) {
                throw new Error(error)
            }
        }
    }
}