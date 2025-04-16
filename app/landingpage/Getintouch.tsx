import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";

function Getintouch() {
  return (
    <div
      id="getintouch"
      className="bg-stone-100 max-sm:p-4 max-md:p-7 md:p-7 lg:p-14"
    >
      <div className="grid lg:grid-cols-2 md:grid-cols-2 lg:mx-40">
        <div className="flex flex-col pl-0 pb-4 pt-4 pr-4 gap-4">
          <h2 className="text-4xl font-bold text-stone-800">Get in Touch</h2>
          <div>
            <h3 className="py-2 text-stone-700">
              Ready to Revolutionize Your Radiology Workflow?
            </h3>
            <h3 className="py-2 text-stone-700">
              Partner with MedKnight for faster, smarter, and more accurate
              diagnostics. Let’s discuss how our AI-powered teleradiology
              solutions can transform your patient care.
            </h3>
          </div>

          <div className="flex flex-row gap-4 items-center">
            <FaPhoneAlt className="h-16 w-16 p-5 text-stone-100 bg-purple-400 rounded-lg" />
            <div>
              <h2 className="text-stone-700">Phone Support</h2>
              <h2 className="text-stone-700">24/7 Available</h2>
              <h2 className="text-purple-800">
                +91 62054-XXXXX, +91 87847-XXXXX
              </h2>
            </div>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <MdOutlineMailOutline className="h-16 w-16 p-4 text-stone-100 bg-purple-400 rounded-lg" />
            <div>
              <h2 className="text-stone-700">Email</h2>
              <h2 className="text-stone-700">Get in Touch</h2>
              <h2 className="text-purple-800">contact@medknight.in</h2>
            </div>
          </div>
          <div>
            <h2 className="text-stone-700">
              Contact us today for a free pilot consultation tailored to your
              needs.
            </h2>
          </div>
        </div>
        <div className="flex flex-col bg-stone-100 p-3 gap-4 rounded-lg">
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
          <Button className="bg-purple-400 h-[40px] min-sm:pl-9 min-sm:pr-9 font-bold hover:bg-teal-600">
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Getintouch;
