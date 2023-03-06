import { firebaseApp } from '../../configs/firebaseConfig';
import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";
import { Image } from "../../models/models";
import { StatusCodes } from "http-status-codes";
const uploadImages = async (uid, noteId, images) => {
  if (!(uid && noteId && images)) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "At least 1 image required."
    }
  }
  try {
    const storage = getStorage(firebaseApp);
    const uploadImagePromises = [];
    images.forEach((image) => {
      const imageUrl = `images/${uid}/${noteId}/${Date.now().toString()}-${
        image.name
      }`;
      uploadImagePromises.push(
        uploadBytes(ref(storage, imageUrl), image.data, {
          contentType: "image",
        })
      );
    })
    const getImageUrlPromises = (await Promise.all(uploadImagePromises)).map(
      async (uploadResult) => {
        return new Image(
          null,
          uploadResult.ref.name,
          await getDownloadURL(uploadResult.ref),
          Date.parse(uploadResult.metadata.timeCreated),
          uid
        );
      }
    );
    const data = await Promise.all(getImageUrlPromises);
    return {
      code: StatusCodes.OK,
      message: "Upload images successfully.",
      data: data
    }
  } catch (error) {
    console.error(`Upload images error: ${error.stack}`)
    throw new Error("Upload images failed.");
  }
};

module.exports = uploadImages;
