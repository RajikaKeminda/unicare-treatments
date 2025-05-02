import axios from "axios";

const getPresignedUrl = async (file: File) => {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/media/upload-url`, {
            fileName: file.name,
            fileType: file.type,
        });
        return {
            presignedUrl: response.data.data.presignedUrl,
            key: response.data.data.key,
        };
    } catch (error) {
        console.error('Error getting presigned URL:', error);
        throw error;
    }
};

const uploadToS3 = async (file: File) => {
    try {
        const { presignedUrl, key } = await getPresignedUrl(file);
        await axios.put(presignedUrl, file, {
            headers: {
                'Content-Type': file.type,
            },
        });
        return key;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
};

export {
    uploadToS3,
    getPresignedUrl
}