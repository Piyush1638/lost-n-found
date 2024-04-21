import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer";
  import { Button } from "../ui/button";
  import { useEffect, useRef, useState } from "react";
  import { Input } from "../ui/input";
  import { Textarea } from "../ui/textarea";
  import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
  import { db } from "@/firebaseConfig";
  import { useUser } from "@clerk/nextjs";
  
  const Message = ({
    itemId,
    category,
  }: {
    itemId: string;
    category: string;
  }) => {
    const { isLoaded, isSignedIn, user } = useUser();
    if (!isLoaded || !isSignedIn) {
      return null;
    }
    const { id } = user;
  
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<any[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const messageCollectionRef = collection(db, category, itemId, "messages");
  
      const unsubscribe = onSnapshot(messageCollectionRef, (snapshot) => {
        const messagesData: any[] = [];
        snapshot.forEach((doc) => {
          messagesData.push({ id: doc.id, ...doc.data() });
        });
        setMessages(messagesData);
        scrollToBottom();
      });
  
      return () => unsubscribe();
    }, [itemId, category]);
  
    const onChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(e.target.value);
    };
  
    const handleClick = async (e: React.MouseEvent) => {
      e.preventDefault();
      if (!message.trim()) {
        return;
      }
  
      try {
        const messageRef = await addDoc(
          collection(db, category, itemId, "messages"),
          {
            text: message,
            senderId: user.id,
            timestamp: new Date().toISOString(),
          }
        );
        console.log("Message added with ID: ", messageRef.id);
        setMessage("");
      } catch (error: any) {
        console.error("Error adding message: ", error);
      }
    };
  
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
  
    return (
      <Drawer>
        <DrawerTrigger className="p-3 bg-purple-500 text-white rounded-lg my-4 cursor-pointer">
          Is it yours? Message Lister
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Message lister</DrawerTitle>
            <DrawerDescription>
              If you are the lister of this item, please ask questions about the item
              before handing it over.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <div className="latpop:min-h-[500px] min-h-[200px]"></div>
            <div className="w-full p-4 overflow-y-auto">
              <div className="flex flex-col gap-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={
                      msg.senderId === id ? "text-right" : "text-left"
                    }
                  >
                    <div>{msg.text}</div>
                    <div className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Textarea
                value={message}
                onChange={onChangeHandler}
                placeholder="Write your message to the lister."
              />
              <Button onClick={handleClick}>Send</Button>
            </div>
            <DrawerClose>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  };
  
  export default Message;
  