import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";

interface FormData {
  fullName: string;
  email: string;
  organization: string;
  message: string;
}

interface SubmitStatus {
  success: boolean;
  message: string;
}

function Getintouch(): React.ReactElement {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    organization: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "contact@medknight.in",
          subject: "New Contact Form Submission",
          formData,
        }),
      });

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "Your message has been sent successfully!",
        });
        // Reset form after successful submission
        setFormData({
          fullName: "",
          email: "",
          organization: "",
          message: "",
        });
      } else {
        setSubmitStatus({
          success: false,
          message: "Failed to send message. Please try again later.",
        });
      }

      // Set a timeout to clear the status message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: "An error occurred. Please try again later.",
      });

      // Also set timeout for error messages
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="getintouch"
      className="max-sm:p-4 max-md:p-7 md:p-7 lg:p-12 lg:my-20 max-lg:my-14 max-sm:my-4 sm:my-6"
    >
      <div className="grid lg:grid-cols-2 md:grid-cols-2 lg:mx-24  bg-stone-100 py-6 px-12 gap-4 backdrop:blur-lg z-0 rounded-lg bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
        <div className="flex flex-col pl-0 pb-4 pt-4 pr-4 gap-4">
          <h2 className="text-4xl font-bold text-stone-100 mb-4">Get in Touch</h2>
          <div>
            <h3 className="py-2 text-stone-100">
              Ready to Revolutionize Your Radiology Workflow?
            </h3>
            <h3 className="py-2 text-stone-100">
              Partner with MedKnight for faster, smarter, and more accurate
              diagnostics. Let's discuss how our AI-powered teleradiology
              solutions can transform your patient care.
            </h3>
          </div>

          <div className="flex flex-row gap-4 items-center pt-4">
            <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-lg text-stone-700 font-bold hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/20 rounded-full transition-all duration-300 transform hover:scale-105">
              <FaPhoneAlt className="h-6 w-6 text-stone-100" />
            </div>
            <div>
              <h2 className="text-stone-200 text-sm">Phone Support</h2>
              <h2 className="text-stone-200 text-sm">24/7 Available</h2>
              <h2 className="text-purple-400">
                +91 6205400732, +91 8789573665
              </h2>
            </div>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-lg text-stone-700 font-bold hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/20 rounded-full transition-all duration-300 transform hover:scale-105">
              <MdOutlineMailOutline className="h-8 w-8 text-stone-100" />
            </div>
            <div>
              <h2 className="text-stone-200 text-sm">Email</h2>
              <h2 className="text-stone-200 text-sm">Get in Touch</h2>
              <h2 className="text-purple-400">contact@medknight.in</h2>
            </div>
          </div>
          <div className="pt-4">
            <h2 className="text-stone-100">
              Contact us today for a free pilot consultation tailored to your
              needs.
            </h2>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col bg-stone-100 pt-8 pb-4 px-6 gap-4 backdrop:blur-lg z-0 rounded-lg bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl"
        >
          {submitStatus && (
            <div
              className={`p-3 rounded ${
                submitStatus.success
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {submitStatus.message}
            </div>
          )}
          <div>
            <Label htmlFor="fullName" className="text-stone-100 font-bold">
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter Your Name"
              className="text-stone-800 bg-slate-100"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-stone-100 font-bold">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
              className="text-stone-800 bg-slate-100"
              required
            />
          </div>
          <div>
            <Label htmlFor="organization" className="text-stone-100 font-bold">
              Organization
            </Label>
            <Input
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Enter Your Organization"
              className="text-stone-800 bg-slate-100"
              required
            />
          </div>
          <div>
            <Label htmlFor="message" className="text-stone-100 font-bold">
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type Your Message"
              className="border h-24 resize-none text-stone-800 bg-slate-100"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-lg h-[50px] text-stone-100 font-bold hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/20 px-10 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Getintouch;
