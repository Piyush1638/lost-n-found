"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/components/Loading";
import { IoSearchOutline } from "react-icons/io5";

interface Item {
  id: string;
  itemName: string;
  category: string;
  date: string;
  lostOrFound: string;
  imageUrl: string;
  description: string;
}

const Page = () => {
  const [itemFoundOrLost, setItemFoundOrLost] = useState("lost");
  const [category, setCategory] = useState("All");
  const [activeButton, setActiveButton] = useState("All");
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const handleClick = (buttonName: string) => {
    setActiveButton(buttonName);
    setCategory(buttonName);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        if (itemFoundOrLost) {
          const lostOrFoundSnapshot = await getDocs(
            collection(db, itemFoundOrLost)
          );
          const items: Item[] = lostOrFoundSnapshot.docs.map((doc) => ({
            id: doc.id,
            itemName: doc.data().itemName,
            category: doc.data().category,
            date: doc.data().date,
            lostOrFound: doc.data().lostOrFound,
            imageUrl: doc.data().imageUrl,
            description: doc.data().description,
          }));

          setAllItems(items);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        setLoading(false);
      }
    };

    fetchAllItems();
  }, [itemFoundOrLost]);

  return (
    <main className="min-h-screen">
      <div className="w-full flex flex-col gap-3 laptop:px-10 laptop:py-19 tablet:p-12 p-4 py-5">
        <div className="w-full flex laptop:items-center laptop:flex-row flex-col justify-center gap-3">
          <div className="laptop:w-1/2 flex items-center justify-center gap-2 w-full border border-gray-500 rounded-3xl">
            <select
              id="category"
              value={itemFoundOrLost}
              onChange={(e) => setItemFoundOrLost(e.target.value)}
              required
              className="w-fit rounded-tl-3xl rounded-bl-3xl border border-input bg-background px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-r border-gray-600"
            >
              <option disabled selected hidden>
                Select Category
              </option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
            <input
              type="text"
              placeholder="Search Item"
              className="w-full rounded-tr-3xl bg-transparent rounded-br-3xl h-full py-3 outline-none"
              onChange={handleSearch}
            />
            <IoSearchOutline className="text-3xl mx-3 cursor-pointer" />
          </div>
        </div>

        <div className="w-full laptop:flex hidden items-center justify-evenly gap-4 border border-gray-600 rounded-3xl">
          {[
            "All",
            "Electronics",
            "Clothing",
            "Jewellery",
            "Keys",
            "Id-Card",
            "Documents",
            "Wallets",
            "Others",
          ].map((categoryName) => (
            <button
              key={categoryName}
              className={`rounded-3xl px-3 py-2 ${
                activeButton === categoryName && "bg-purple-600 text-white"
              }`}
              onClick={() => handleClick(categoryName)}
            >
              {categoryName}
            </button>
          ))}
        </div>

        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full laptop:hidden block rounded-3xl border border-input bg-background px-3 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-r border-gray-600"
        >
          {[
            "All",
            "Electronics",
            "Clothing",
            "Jewellery",
            "Keys",
            "Id-Card",
            "Documents",
            "Wallets",
            "Others",
          ].map((categoryName) => (
            <option key={categoryName} value={categoryName}>
              {categoryName}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="grid tablet:grid-cols-4 grid-cols-1 gap-4 px-6">
          {allItems
            .filter(
              (item) =>
                (category === "All" || item.category === category) &&
                (searchQuery === "" ||
                  item.itemName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()))
            )
            .map((item: Item) => (
              <Link
                key={item.id}
                href={`/${item.lostOrFound}/${item.id}`}
                className="w-full cursor-pointer shadow-xl rounded-3xl flex flex-row items-center"
              >
                <Image
                  src={item.imageUrl}
                  alt="item"
                  height={100}
                  width={100}
                  className="object-cover aspect-square rounded-tl-3xl rounded-bl-3xl"
                />
                <div className="w-full">
                  <div className="p-4">
                    <h1 className="text-lg font-semibold">{item.itemName}</h1>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          {allItems && allItems.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-2xl font-semibold">No items found</h1>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default Page;
