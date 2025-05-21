import React from "react";
import { BiSolidQuoteLeft } from "react-icons/bi";
import { MdOutlineStarPurple500 } from "react-icons/md";

function Testimonials() {
  return (
    <div id="testimonials" className="bg-white lg:px-44 lg:-ml-4">
      <div className="p-14 flex flex-col justify-center items-center gap-4">
        <h2 className="text-center pt-8 text-4xl font-bold text-stone-800">
          What Our Partners Say
        </h2>
        <h3 className="text-center text-xl font-light text-stone-500 lg:max-w-3xl">
          Trusted by leading hospitals, diagnostic centers, and healthcare
          networks
        </h3>
      </div>
      <div className="max-lg:mx-4 lg:mx-14 flex flex-col pb-14">
        <div className="flex flex-col gap-4 shadow-2xl lg:p-10 max-lg:p-6 rounded-lg">
          <BiSolidQuoteLeft className="text-purple-400 text-6xl" />
          <h2 className="text-stone-600 text-lg">
            “MedKnight has transformed our radiology operations. Their
            lightning-fast reporting, especially during night hours and
            emergencies, has elevated our standard of care.”
          </h2>
          <h2 className="text-xl font-bold">Dr. Sarah Chen</h2>
          <div className="-mt-4 flex flex-row justify-between items-center">
            <h2 className="text-sm text-stone-500">
              Chief of Radiology, Metro Healthcare
            </h2>
            <div className="flex flex-row">
              <MdOutlineStarPurple500 className="text-yellow-400" />
              <MdOutlineStarPurple500 className="text-yellow-400" />
              <MdOutlineStarPurple500 className="text-yellow-400" />
              <MdOutlineStarPurple500 className="text-yellow-400" />
              <MdOutlineStarPurple500 className="text-yellow-400" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 shadow-2xl lg:p-10 max-lg:p-6 rounded-lg">
          <BiSolidQuoteLeft className="text-purple-400 text-6xl" />
          <h2 className="text-stone-600 text-lg">
            “The precision of MedKnight's reports and their seamless integration
            with our workflow have been a game changer. Their AI-enhanced
            platform is truly ahead of its time.”
          </h2>
          <h2 className="text-xl font-bold">Dr. Robert Thompson</h2>
          <div className="-mt-4 flex flex-row justify-between items-center">
            <h2 className="text-sm text-stone-500">
              Medical Director, Central Hospital
            </h2>
            <div className="flex flex-row">
              <MdOutlineStarPurple500 className="text-yellow-400" />
              <MdOutlineStarPurple500 className="text-yellow-400" />
              <MdOutlineStarPurple500 className="text-yellow-400" />
              <MdOutlineStarPurple500 className="text-yellow-400" />
              <MdOutlineStarPurple500 className="text-yellow-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
