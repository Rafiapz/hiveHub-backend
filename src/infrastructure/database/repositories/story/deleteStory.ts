import Story from "../../models/storyModel"

export const deleteStory = async (data: any) => {

    try {

        const result = await Story.findOneAndUpdate({ _id: data?.storyId }, { $pull: { media: data?.image } }, { new: true })

        const length = result?.media?.length

        if (length !== undefined && length <= 0) {
            const deleted = await Story.deleteOne({ _id: data?.storyId })
        }
        return result

    } catch (error: any) {
        throw new Error(error)
    }
}