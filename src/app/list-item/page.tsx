"use client"
import React, { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { db } from "@/firebaseConfig";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useRouter } from "next/navigation";

interface FormData {
  itemName: string;
  description: string;
  category: string;
  date: string;
  place: string;
  city: string;
  state: string;
  lostOrFound: string;
  image: FileList | null; // Assuming image will be a FileList or null
}

const Page = () => {
  const router = useRouter();
  const [popUp, setPopUp] = useState("hidden");
  const [uploadingStatus, setUploadingStatus] = useState("Uploading...");
  const { isLoaded, isSignedIn, user } = useUser();

  // Ensure that all hooks are called unconditionally
  const [formData, setFormData] = useState<FormData>({
    itemName: "",
    description: "",
    category: "",
    date: "",
    place: "",
    city: "",
    state: "",
    lostOrFound: "",
    image: null,
  });

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  const { username, id } = user;
  const {
    itemName,
    description,
    category,
    date,
    place,
    city,
    state,
    lostOrFound,
    image,
  } = formData;

  const isFormValid = () => {
    return (
      itemName !== "" &&
      description !== "" &&
      category !== "" &&
      date !== "" &&
      place !== "" &&
      city !== "" &&
      state !== "" &&
      lostOrFound !== ""
    );
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    let newValue: string | FileList | null = value;

    // Check if the element is a file input and assign the files property
    if (id === "image" && e.target.type === "file") {
      const fileInput = e.target as HTMLInputElement;
      newValue = fileInput.files;
    }

    setFormData((prevState) => ({
      ...prevState,
      [id]: newValue,
    }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);

    try {
      setPopUp("flex");
      console.log("Uploading......");
      const storage = getStorage();
      const file = image && image[0]; // Get the first image file
      if (!file) {
        throw new Error("No image selected");
      }

      // Upload image to Firebase Storage
      const fileName = `${id}-${file.name}`;
      const storageRef = ref(storage, `images/${id}/` + fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Wait for image upload to complete
      await uploadTask;

      // Get download URL of the uploaded image
      const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

      // Add imageUrl to form data
      const formDataWithImage = {
        itemName: formData.itemName,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        place: formData.place,
        city: formData.city,
        state: formData.state,
        lostOrFound: formData.lostOrFound,
        imageUrl: imageUrl,
        userId: id,
        userName: username,
        userImg: imageUrl,
        timestamp: serverTimestamp(),
      };

      // Save form data to Firestore
      const docRef = await addDoc(
        collection(db, `${formData.lostOrFound}`),
        formDataWithImage
      );

      console.log("Form data saved successfully:", formDataWithImage);
      setUploadingStatus("Uploaded successfully");
      setUploadingStatus("Uploaded Successfully");
      setPopUp("hidden");
      router.push(`${formData.lostOrFound}/${docRef.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen">
      <div
        className={`h-screen w-screen bg-black opacity-45 fixed top-0 ${popUp} items-center justify-center`}
      >
        <div className="min-w-[400px] min-h-[150px] bg-white flex flex-col items-center gap-2 py-3 rounded-3xl">
          <p className="font-semibold">{uploadingStatus}</p>
          <div className="h-[100px] w-[100px] bg border-b-4 border-purple-600 animate-spin rounded-full" />
        </div>
      </div>
      <div className="w-full laptop:px-10 laptop:py-19 tablet:p-12 p-4 py-5">
        <div className="mb-12">
          <h3 className="font-poppins font-medium tablet:text-2xl text-xl inline-block border-b border-gray-500">
            Lost & Found
          </h3>
        </div>
        <form
          className="flex laptop:flex-row flex-col justify-center gap-8"
          onSubmit={onSubmit}
        >
          <div className="flex flex-col laptop:w-1/2 w-full">
            <div className="border border-gray-600 rounded-2xl p-8 gap-6 flex flex-col">
              <h3 className="mb-3 font-medium text-xl">Items Description</h3>
              {/* Item Name */}
              <div className="w-full grid items-center gap-1.5">
                <Label htmlFor="email">Item Name</Label>
                <Input
                  type="text"
                  id="itemName"
                  placeholder="Water Bottle"
                  value={itemName}
                  onChange={onChangeHandler}
                  required
                />
              </div>

              {/* Item Category */}
              <div>
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={onChangeHandler}
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option disabled selected hidden>
                    Select Category
                  </option>
                  <option value="electronic">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="jewelry">Jewellry</option>
                  <option value="keys">Keys</option>
                  <option value="id-cards">Id-Card</option>
                  <option value="documents">Documents</option>
                  <option value="wallets">Wallets</option>
                  <option value="others">Others</option>
                </select>
              </div>

              {/* Description About item */}
              <div className="grid w-full gap-1.5">
                <Label htmlFor="message">Description about the item*</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={onChangeHandler}
                  placeholder="A Milton water bottle with a scratch on the cap."
                  required
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              {/* Address */}
              <div className="grid w-full gap-1.5">
                <Label htmlFor="address">Where did you find or lost it?</Label>
                <Textarea
                  id="place"
                  value={place}
                  onChange={onChangeHandler}
                  placeholder="Describe where did you exactly lost or found it."
                  required
                />
                <Input
                  type="text"
                  id="city"
                  placeholder="City"
                  value={city}
                  onChange={onChangeHandler}
                  required
                />
                <Input
                  type="text"
                  id="state"
                  placeholder="State"
                  value={state}
                  onChange={onChangeHandler}
                  required
                />
              </div>

              {/* Items Lost or found */}
              <div>
                <label htmlFor="category">Item lost or found?</label>
                <select
                  id="lostOrFound"
                  value={lostOrFound}
                  onChange={onChangeHandler}
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option disabled selected hidden>
                    Select Category
                  </option>
                  <option value="lost">Lost</option>
                  <option value="found">Found</option>
                </select>
              </div>

              {/* Date you found on */}
              <div className="flex flex-col">
                <label>Item found or lost date?</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={date}
                  onChange={onChangeHandler}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* image & Submit button */}
          <div className="laptop:w-1/2 w-full flex flex-col gap-5">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-96 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    .jpg, .png, .jpeg
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Maximum 1 images can be selected
                  </p>
                  {image && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {image.length} images selected
                    </p>
                  )}
                </div>
                <input
                  id="image"
                  type="file"
                  className="hidden"
                  accept=".jpg, .png, .jpeg"
                  onChange={onChangeHandler}
                  required
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={!isFormValid()}
              className="w-full px-4 py-3 disabled:bg-purple-300 bg-purple-500 text-white rounded-xl "
            >
              List Item
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Page;
