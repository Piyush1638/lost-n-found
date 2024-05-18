import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { db } from "@/firebaseConfig";
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useState } from "react";

const Message2 = ({
  itemId,
  category,
  userId,
}: {
  itemId: string;
  category: string;
  userId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string>("");

  const [message, setMessage] = useState<string>("");
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const sendMessage = async () => {
    try {
      setLoading(true);
  
      // Check if a document already exists for the user
      const querySnapshot = await getDocs(collection(db, category, itemId, "permissions"));
      const existingDoc = querySnapshot.docs.find(doc => doc.data().userId === userId);
  
      if (existingDoc) {
        // Update existing document
        const docRef = doc(db, category, itemId, "permissions", existingDoc.id);
        await updateDoc(docRef, { message: message, timestamp: new Date() });
      } else {
        // Create a new document
        const messageData = {
          message: message,
          userId: userId,
          timestamp: new Date(),
        };
        await addDoc(collection(db, category, itemId, "permissions"), messageData);
      }
  
      // Clear the message input after sending
      setMessage("");
  
      // Provide feedback to the user that the message was sent successfully
      setNotification("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      setNotification("Error sending message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Popover>
      <PopoverTrigger className="p-3 bg-purple-500 text-white rounded-lg my-4 cursor-pointer fixed bottom-10 right-10">
        Is this yours?
      </PopoverTrigger>
      <PopoverContent>
        <div className="min-h-96">
          <h3>Type a message</h3>
          <textarea
            onChange={onChange}
            name="message"
            id="message"
            className="border outline-none border-purple-600 rounded-md h-40 p-4 w-full mt-4"
            placeholder="Send a message to the lister"
          />
          <p className="text-xs">This message will send to the lister.</p>
          <p className="text-xs font-semibold">Only the lister&apos;s permission will get you the contacts.</p>

          <div className="flex items-center gap-4">
            <button
              onClick={sendMessage}
              className="bg-purple-600 px-3 py-2 rounded-lg text-white my-4"
            >
              Send
            </button>
            {loading && (
              <div className="h-[40px] w-[40px] border-b border-purple-600 animate-spin rounded-full" />
            )}
          </div>

          {loading ? (
            <p>Sending message...</p>
          ) : (
            <p className="text-green-600 text-xs">{notification}</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Message2;
