import { storage } from "../../configs/firestoreConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Image } from "../../models/models";
import { ServiceResult } from "../../models/serviceResult";
import { StatusCodes } from "http-status-codes";
const uploadImages = async (uid, noteId, images) => {
  if (!(uid && noteId && images)) {
    return new ServiceResult(
      StatusCodes.BAD_REQUEST,
      "At least 1 image required."
    );
  }
  try {
    const uploadImagesPromises = [];
    const imageUrl = null;
    for (const image of [].concat(images)) {
      imageUrl = `images/${uid}/${noteId}/${Date.now().toString()}-${
        image.name
      }`;
      uploadImagesPromises.push(
        uploadBytes(ref(storage, imageUrl), image.data, {
          contentType: "image",
        })
      );
    }
    const imagesPromises = (await Promise.all(uploadImagesPromises)).map(
      async function (uploadResult) {
        return new Image(
          null,
          uploadResult.ref.name,
          await getDownloadURL(uploadResult.ref),
          Date.parse(uploadResult.metadata.timeCreated),
          uid
        );
      }
    );
    const images = await Promise.all(imagesPromises);
    return new ServiceResult(
      StatusCodes.OK,
      "Upload images successfully.",
      images
    );
  } catch (error) {
    throw new Error("Upload images failed.");
  }
};

module.exports = uploadImages;
