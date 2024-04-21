"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";
import { collection, deleteDoc, doc, getDocs, query, where,} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import ItemSkeleton from "@/components/skeletons/ItemSkeleton";
import Loading from "@/components/Loading";
import DeleteAlertDialog from "@/components/shadcn/DeleteAlertDialog";

interface Listing {
  id: string;
  [key: string]: string; // Other properties of listing are of type string
}

interface Params {
  userid: string;
}

const Profile: React.FC<{ params: Params }> = ({ params }) => {
  const userId = params.userid;
  const { isLoaded, isSignedIn, user } = useUser();

  const [lostListings, setLostListings] = useState<Listing[]>([]);
  const [foundListings, setFoundListings] = useState<Listing[]>([]);
  const [lostOrFound, setLostOrFound] = useState<"lost" | "found">("lost");
  const [listingsChanged, setListingsChanged] = useState(false); // State to track changes in listings data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchUserListings = async () => {
      try {
        const q = query(
          collection(db, lostOrFound),
          where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        const listings: Listing[] = [];
        querySnapshot.forEach((doc) => {
          listings.push({ id: doc.id, ...doc.data() } as Listing);
        });

        if (lostOrFound === "lost") {
          setLostListings(listings);
        } else {
          setFoundListings(listings);
        }
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching user listings:", error);
        setLoading(false);
      }
    };

    fetchUserListings();
  }, [lostOrFound, userId, listingsChanged]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }
  const { imageUrl, fullName, emailAddresses, username, id } = user;

  const handleDelete = async (listingId: string) => {
    try {
      await deleteDoc(doc(db, lostOrFound, listingId));
      setListingsChanged((prev) => !prev); // Toggle listingsChanged state to trigger useEffect
      alert("Listing deleted successfully");
    } catch (error: any) {
      console.error("Error deleting listing:", error);
    }
  };

  return (
    <main className="min-h-screen">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full laptop:px-10 laptop:py-19 tablet:p-12 p-4 py-5">
          <div className="flex laptop:flex-row flex-col gap-3">
            <div className="laptop:w-2/5 w-full flex flex-col gap-2">
              <div className="px-3 py-4 bg-white shadow-lg shadow-gray-300 border border-gray-600 rounded-xl flex flex-col items-center justify-center gap-3">
                <Image
                  src={imageUrl}
                  alt="profile"
                  height={200}
                  width={200}
                  className="rounded-full object-contain"
                />
                <h3 className="text-black tablet:text-lg text-base font-semibold">
                  {fullName}
                </h3>
              </div>
              <div className="px-3 py-4 bg-white shadow-lg shadow-gray-300 border border-gray-600 rounded-xl flex flex-col items-center justify-center gap-3">
                <h3 className="font-poppins">User Platform Details</h3>
                <div className="flex w-full items-center gap-3">
                  <Label htmlFor="username">Username</Label>
                  <p>{username}</p>
                </div>
                <div className="flex w-full items-center gap-3">
                  <Label htmlFor="email">Email</Label>
                  <p id="email">{emailAddresses[0].emailAddress}</p>
                </div>
                <div className="flex w-full items-center gap-3">
                  <Label htmlFor="id">UserId</Label>
                  <p id="id">{id}</p>
                </div>
              </div>

              <div className="px-3 py-4 bg-white shadow-lg shadow-gray-300 rounded-xl flex flex-col items-center justify-center gap-3">
                <div className="flex items-center gap-3 w-full">
                  <button
                    className={`px-3 py-2 font-poppins text-base border border-gray-500 rounded-md w-1/2 ${
                      lostOrFound === "lost" ? "bg-purple-600 text-white" : ""
                    }`}
                    onClick={() => setLostOrFound("lost")}
                  >
                    Lost
                  </button>
                  <button
                    className={`px-3 py-2 font-poppins text-base border border-gray-500 rounded-md w-1/2 ${
                      lostOrFound === "found" ? "bg-purple-600 text-white" : ""
                    }`}
                    onClick={() => setLostOrFound("found")}
                  >
                    Found
                  </button>
                </div>
              </div>
            </div>

            <div className="laptop:w-3/5 w-full flex flex-col gap-2">
              {/* Render lost or found listings based on lostOrFound state */}
              {loading ? (
                <ItemSkeleton value={10} />
              ) : (
                <div className="grid laptop:grid-cols-2 grid-cols-1 gap-3">
                  {(lostOrFound === "lost" ? lostListings : foundListings).map((listing) => (
                    <div
                      key={listing.id}
                      className="w-full cursor-pointer shadow-md p-3 rounded-3xl flex flex-row items-center justify-between"
                    >
                      <Link
                        href={`/${listing.lostOrFound}/${listing.id}`}
                        className="w-full flex items-center justify-center"
                      >
                        <Image
                          src={listing.imageUrl}
                          alt="item"
                          height={100}
                          width={100}
                          className="object-cover aspect-square rounded-tl-3xl rounded-bl-3xl"
                        />
                        <div className="w-full">
                          <div className="p-4">
                            <h1 className="text-lg font-semibold">
                              {listing.itemName}
                            </h1>
                            <p className="text-sm text-muted-foreground">
                              {listing.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                      {user.id === listing.userId && (
                        <div className="flex items-center justify-center p-3">
                          <DeleteAlertDialog
                            listingId={listing.id}
                            handleDelete={handleDelete}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Profile;
