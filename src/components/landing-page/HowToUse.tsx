import React from "react";
import { IoSearch } from "react-icons/io5";
import { AiOutlineMessage } from "react-icons/ai";
import { IoAdd } from "react-icons/io5";

const HowToUse = () => {
  return (
    <div className="w-full my-8 grid tablet:grid-cols-3 laptop:grid-cols-5 grid-cols-2 gap-3">
      <Features
        icon={<IoSearch className="text-4xl text-purple-600" />}
        heading="Search for lost items"
        subHeading="If you lost an item, enter keywords in the search barto find it."
      />
      <Features
        icon={<AiOutlineMessage className="text-4xl text-purple-600" />}
        heading="Ask about lost items"
        subHeading="If you have questions about a lost item, you can ask here."
      />
      <Features
        icon={<IoAdd className="text-4xl text-purple-600" />}
        heading="Post about found item"
        subHeading="If you found an item, you can post a photo and description here."
      />
      <Features
        icon={<IoAdd className="text-4xl text-purple-600" />}
        heading="Report a found item"
        subHeading="If you found a lost item, you can report it here."
      />
      <Features
        icon={<AiOutlineMessage className="text-4xl text-purple-600" />}
        heading="Answer questions about find items"
        subHeading="If you have questions about a found item, you can ask here."
      />
      <Features
        icon={<IoSearch className="text-4xl text-purple-600" />}
        heading="Find a found item"
        subHeading="If you lost an item, you can find it here."
      />
    </div>
  );
};

export default HowToUse;

const Features = ({
  icon,
  heading,
  subHeading,
}: {
  icon: any;
  heading: string;
  subHeading: string;
}) => (
  <div className="bg-white px-4 py-3 max-w-[250px] rounded-2xl border border-gray-600 flex flex-col gap-3">
    {icon}
    <h4 className="font-poppins font-semibold">{heading}</h4>
    <p className="font-poppins text-gray-500">{subHeading}</p>
  </div>
);
