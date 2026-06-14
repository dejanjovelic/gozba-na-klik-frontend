import React from "react";
import { uploadImageToCloudinary } from "../../services/UploadImageService";

export async function ImageUploader(
    e,
    directoryName,
    entityAtribute,
    setEntity,
    updateEntityInDb,
    setErrorMessage,
    setShowError
) {

    const file = e.target.files[0];
    if (!file) return;

    try {
        const claudinaryData = await uploadImageToCloudinary(file, directoryName);
        if (!claudinaryData?.secure_url) {
            throw new Error("Cloudinary didn't returned secure_url.")
        }
        // setting new image on frontend
        setEntity((prev) => ({
            ...prev,
            [entityAtribute]: claudinaryData.secure_url
        }))

        //saving entity image in database
        await updateEntityInDb({ [entityAtribute]: claudinaryData.secure_url });

    } catch (error) {
        setErrorMessage("Image failed to upload");
        setShowError(true);
    }
}

