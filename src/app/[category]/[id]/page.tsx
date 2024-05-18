"use client";
import Loading from "@/components/Loading";
import Message2 from "@/components/shadcn/Message2";
import { Label } from "@/components/ui/label";
import { db } from "@/firebaseConfig";
import { useUser } from "@clerk/nextjs";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const ItemPage = ({ params }: any) => {
  const { isLoaded, isSignedIn, user } = useUser();

  // Move the hooks above the conditional return
  const [item, setItem] = useState<any>({});
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [Id, setId] = useState<string>("");
 
  const itemId = params.id;
  const category = params.category;


  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    setId(user.id);

    const fetchItemAndMessages = async () => {
      try {
        setLoading(true);

        // Fetch item details
        const itemRef = doc(db, category, itemId);
        const itemSnapshot = await getDoc(itemRef);
        if (itemSnapshot.exists()) {
          const itemData = itemSnapshot.data();
          setItem(itemData);
        } else {
          console.error("Item not found.");
        }

        // Fetch messages
        const messagesRef = collection(db, category, itemId, "permissions");
        const messagesSnapshot = await getDocs(messagesRef);
        const messagesData = messagesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching item and messages:", error);
        setLoading(false);
      }
    };

    fetchItemAndMessages();
  }, [itemId, category, isLoaded, isSignedIn, user]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }



  const allowPermission = async ({ messageId }: { messageId: string }) => {
    try {
      const messageRef = doc(db, category, itemId, "permissions", messageId);

      await updateDoc(messageRef, { permissionAllowed: true });

      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === messageId
            ? { ...message, permissionAllowed: true }
            : message
        )
      );

      console.log("Permission allowed successfully!");
    } catch (error) {
      console.error("Error allowing permission:", error);
    }
  };

  return (
    <main className="min-h-screen">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full laptop:px-10 laptop:py-19 tablet:p-12 p-4 py-5">
          <div className="flex laptop:flex-row flex-col gap-3">
            <div className="laptop:w-1/2 w-full px-3 py-4 bg-white shadow-lg shadow-gray-300 border border-gray-600 rounded-xl flex flex-col items-center justify-center gap-3">
              <Image
                src={item.imageUrl}
                alt="profile"
                height={600}
                width={400}
                className="aspect-[3/2]"
              />
              <h3 className="text-black tablet:text-lg text-base font-semibold">
                {item.itemName}
              </h3>
              <p>{item.description}</p>
            </div>
            <div className="laptop:w-1/2 w-full px-3 py-4 bg-white shadow-lg shadow-gray-300 border border-gray-600 rounded-xl flex flex-col items-start gap-3">
              <h3 className="font-poppins text-xl font-medium my-6">
                Item Details
              </h3>
              <DetailRow label={`${category} At`} value={item.place} />
              <DetailRow
                label="Lister Id"
                value={item.userId}
                imgSrc={item.userImg}
              />
              <DetailRow label={`${category} by`} value={item.userName} />
              <DetailRow label="Category" value={item.category} />
              <DetailRow label={`${category} Date`} value={item.date} />
              <DetailRow
                label="City & State"
                value={`${item.city}, ${item.state}`}
              />
              {messages.map(
                (message, index) =>
                  message.userId === Id &&
                  message.permissionAllowed && (
                    <div key={index}>
                      <h3 className="font-poppins text-xl font-medium my-6">
                        Contact Details
                      </h3>
                      <DetailRow label="Email" value={item.email} />
                      <DetailRow label="Phone" value={item.phoneNumber} />
                    </div>
                  )
              )}
              <Message2 itemId={itemId} category={category} userId={Id} />
            </div>
          </div>

          {item.userId === Id && (
            <div className="my-6 ">
              <h3 className="my-4 font-poppins text-xl font-medium">
                Permissions Requests
              </h3>
              <div className="flex flex-col gap-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex flex-col gap-4 border border-gray-500 rounded-xl p-3"
                  >
                    <div>
                      <p>{message.message}</p>
                      <p>
                        {new Date(
                          message.timestamp.seconds * 1000
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h5 className="text-sm font-semibold">
                        Allow Permissions
                      </h5>
                      <button
                        onClick={() =>
                          allowPermission({ messageId: message.id })
                        }
                        className="bg-purple-600 w-fit text-white px-3 py-2 rounded-lg cursor-pointer"
                      >
                        {message.permissionAllowed ? "Allowed" : "Allow"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

const DetailRow = ({
  label,
  value,
  imgSrc,
}: {
  label: string;
  value: string;
  imgSrc?: string;
}) => (
  <div className="flex w-full tablet:flex-row flex-col tablet:items-center tablet:gap-3 gap-1">
    <Label
      className="text-gray-600 text-xs tablet:text-base text-nowrap"
      htmlFor={label}
    >
      {label}
    </Label>
    {imgSrc ? (
      <div className="flex items-center gap-2">
        <p id={label} className="text-sm font-semibold font-poppins">
          {value}
        </p>
        <Image
          src={imgSrc}
          alt="user-image"
          height={50}
          width={50}
          className="rounded-full h-5 w-5 tablet:h-12 tablet:w-12"
        />
      </div>
    ) : (
      <p
        className="font-poppins font-semibold text-sm tablet:text-base"
        id={label}
      >
        {value}
      </p>
    )}
  </div>
);

export default ItemPage;
