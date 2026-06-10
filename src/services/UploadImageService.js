import claudinaryConfig from "../config/cloudinaryConfig.js";

const RESOURCE = "v1_1/dsgans7nh/image/upload";
export async function uploadImageToCloudinary(file, directoryName) {
    try {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "unsigned_react_upload");
        data.append("cloud_name", "dsgans7nh");
        data.append("folder", directoryName);
    
        const response = await claudinaryConfig.post(`${RESOURCE}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error occured while uploading image on Cloudinary: `, error)
        throw error;
    }
}