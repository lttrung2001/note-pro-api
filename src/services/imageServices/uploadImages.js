import { firebaseApp } from "../../configs/firebaseConfig";
import { getDownloadURL, ref, uploadBytes, getStorage } from "firebase/storage";
import { Image } from "../../models/models";
const uploadImages = async (uid, noteId, images) => {
  try {
    const uploadPromises = await upload(uid, noteId, images);
    const results = await Promise.all(uploadPromises);
    const getImageUrlPromises = results.map(async (result) => {
      return await convertResultToImage(uid, result)
    });

    const data = await Promise.all(getImageUrlPromises);
    return data;
  } catch (error) {
    console.error(`Upload images error: ${error}`);
    throw new Error("Upload images failed.");
  }
};

const upload = async (uid, noteId, images) => {
  const storage = getStorage(firebaseApp);
  const promises = [];
  [].concat(images).forEach((image) => {
    const imageUrl = `images/${uid}/${noteId}/${Date.now().toString()}-${
      image.name
    }`;
    promises.push(
      uploadBytes(ref(storage, imageUrl), image.data, {
        contentType: "image",
      })
    );
  });
  return promises;
};

const convertResultToImage = async (uid, uploadResult) => {
  return new Image(
    null,
    uploadResult.ref.name,
    await getDownloadURL(uploadResult.ref),
    Date.parse(uploadResult.metadata.updated),
    uid
  );
};

module.exports = uploadImages;
