'use client';

import { FirebaseApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Firestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface DocumentUploadData {
  title: string;
  categoryId: string;
  file: File;
}

/**
 * Uploads a file to Firebase Storage and creates a corresponding document record in Firestore.
 * @param app - The FirebaseApp instance.
 * @param firestore - The Firestore instance.
 * @param userId - The ID of the user uploading the document.
 * @param data - The document data including the file.
 * @returns A promise that resolves when the process is complete.
 */
export async function uploadDocumentAndCreateRecord(
  app: FirebaseApp,
  firestore: Firestore,
  userId: string,
  data: DocumentUploadData
): Promise<void> {
  if (!userId) {
    throw new Error('User must be authenticated to upload documents.');
  }
  if (!data.file) {
    throw new Error('A file must be provided for upload.');
  }

  const storage = getStorage(app);
  
  // Create a unique file path
  const filePath = `documents/${userId}/${Date.now()}_${data.file.name}`;
  const storageRef = ref(storage, filePath);

  // Upload the file
  const uploadResult = await uploadBytes(storageRef, data.file);
  
  // Get the public download URL
  const downloadURL = await getDownloadURL(uploadResult.ref);

  // Create the document record in Firestore
  const documentsCollection = collection(firestore, 'documents');
  await addDoc(documentsCollection, {
    title: data.title,
    categoryId: data.categoryId,
    fileUrl: downloadURL,
    uploadedByUserId: userId,
    uploadDate: serverTimestamp(),
    version: 1,
  });
}
