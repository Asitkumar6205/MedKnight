import React from "react";
import { BiSolidQuoteLeft } from "react-icons/bi";
import { MdOutlineStarPurple500 } from "react-icons/md";

function Testimonials() {
  return (
    <div id="testimonials" className="bg-white">
      <div className="p-14 flex flex-col justify-center items-center gap-4">
        <h2 className="text-center pt-8 text-4xl font-bold text-stone-800">
          What Our Clients Say
        </h2>
        <h3 className="text-center text-xl font-light text-stone-500 lg:max-w-3xl">
          Trusted by leading healthcare providers worldwide
        </h3>
      </div>
      <div className="max-lg:mx-4 lg:mx-14 flex flex-col pb-14">
        <div className="flex flex-col gap-4 shadow-2xl lg:p-10 max-lg:p-6 rounded-lg">
          <BiSolidQuoteLeft className="text-teal-500 text-6xl"/>
          <h2 className="text-stone-600 text-lg">
            "MedKnight has revolutionized our radiology workflow. Their quick
            turnaround times and accurate reporting have significantly improved
            our patient care delivery."
          </h2>
          <h2 className="text-xl font-bold">Dr. Sarah Chen</h2>
          <div className="-mt-4 flex flex-row justify-between items-center">
            <h2 className="text-sm text-stone-500">Chief of Radiology, Metro Healthcare</h2>
            <div className="flex flex-row">
            <MdOutlineStarPurple500 className="text-yellow-400"/>
            <MdOutlineStarPurple500 className="text-yellow-400"/>
            <MdOutlineStarPurple500 className="text-yellow-400"/>
            <MdOutlineStarPurple500 className="text-yellow-400"/>
            <MdOutlineStarPurple500 className="text-yellow-400"/>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 shadow-2xl lg:p-10 max-lg:p-6 rounded-lg">
          <BiSolidQuoteLeft className="text-teal-500 text-6xl"/>
          <h2 className="text-stone-600 text-lg">
          "The quality of reporting and the sophisticated technology platform have made MedKnight an invaluable partner in our diagnostic services."
          </h2>
          <h2 className="text-xl font-bold">Dr. Robert Thompson</h2>
          <div className="-mt-4 flex flex-row justify-between items-center">
            <h2 className="text-sm text-stone-500">Medical Director, Central Hospital</h2>
            <div className="flex flex-row">
            <MdOutlineStarPurple500 className="text-yellow-400"/>
            <MdOutlineStarPurple500 className="text-yellow-400"/>
            <MdOutlineStarPurple500 className="text-yellow-400"/>
            <MdOutlineStarPurple500 className="text-yellow-400"/>
            <MdOutlineStarPurple500 className="text-yellow-400"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
