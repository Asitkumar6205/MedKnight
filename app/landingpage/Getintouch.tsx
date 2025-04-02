import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";

function Getintouch() {
  return (
    <div id="getintouch" className="bg-white  max-sm:p-4 max-md:p-7 md:p-7 lg:p-14">
      <div className="grid lg:grid-cols-2 md:grid-cols-2  ">
        <div className="flex flex-col p-4 gap-4">
          <h2 className="text-4xl font-bold text-stone-800">Get in Touch</h2>
          <h3 className="text-lg py-4">
            Ready to transform your radiology services? Contact us for a
            personalized consultation.
          </h3>
          <div className="flex flex-row gap-4 items-center">
            <FaPhoneAlt className="h-16 w-16 p-5 text-stone-100 bg-teal-500 rounded-lg" />
            <div>
              <h2 className="">Phone Support</h2>
              <h2 className="">24/7 Available</h2>
              <h2 className="text-teal-500">+91 62054-XXXXX</h2>
            </div>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <MdOutlineMailOutline className="h-16 w-16 p-4 text-stone-100 bg-teal-500 rounded-lg" />
            <div>
              <h2>Email</h2>
              <h2>Get in Touch</h2>
              <h2 className="text-teal-500">contact@medknight.com</h2>
            </div>
          </div>
          <div></div>
        </div>
        <div className="flex flex-col bg-stone-100 p-8 gap-4 rounded-lg">
          <div>
            <Label className="text-stone-600 font-bold">Full Name</Label>
            <Input
              placeholder="Enter Your Name"
              className="bg-white"
              required
            />
          </div>
          <div>
            <Label className="text-stone-600 font-bold">Email</Label>
            <Input
              type="email"
              placeholder="Enter Your Email"
              className="bg-white"
              required
            />
          </div>
          <div>
            <Label className="text-stone-600 font-bold">Organization</Label>
            <Input
              placeholder="Enter Your Organization"
              className="bg-white"
              required
            />
          </div>
          <div>
            <Label className="text-stone-600 font-bold">Message</Label>
            <Textarea
              placeholder="Type Your Message"
              className="bg-white h-24 resize-none"
              required
            />
          </div>
          <Button className="bg-teal-500 h-[40px] min-sm:pl-9 min-sm:pr-9 font-bold hover:bg-teal-600">
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Getintouch;
