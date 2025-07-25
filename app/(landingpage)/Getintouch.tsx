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
      <div className="relative z-10 pt-10 pb-6 flex flex-col justify-center items-center gap-4">
        <h2 className="sm:pt-6 md:pt-8 text-2xl sm:text-3xl md:text-4xl font-bold text-stone-100 text-center bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
          Contact Us
        </h2>
      </div>
      <div className="grid lg:grid-cols-2 md:grid-cols-2 lg:mx-24 bg-stone-100 py-6 px-4 sm:px-6 md:px-8 lg:px-12 gap-4 backdrop:blur-lg z-0 rounded-lg bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl">
        <div className="flex flex-col px-2 sm:px-4 pb-4 pt-4 gap-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-100 mb-4">
            Get in Touch
          </h2>
          <div>
            <h3 className="py-2 text-stone-100 text-sm sm:text-base">
              Ready to Revolutionize Your Radiology Workflow?
            </h3>
            <h3 className="py-2 text-stone-100 text-sm sm:text-base">
              Partner with MedKnight for faster, smarter, and more accurate
              diagnostics. Let's discuss how our AI-powered teleradiology
              solutions can transform your patient care.
            </h3>
          </div>

          <div className="flex flex-row gap-3 sm:gap-4 items-center pt-4">
            <div className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-lg text-stone-700 font-bold hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/20 rounded-full transition-all duration-300 transform hover:scale-105 flex-shrink-0">
              <FaPhoneAlt className="h-5 w-5 sm:h-6 sm:w-6 text-stone-100" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-stone-200 text-xs sm:text-sm">
                Phone Support
              </h2>
              <h2 className="text-stone-200 text-xs sm:text-sm">
                24/7 Available
              </h2>
              <h2 className="text-purple-400 text-xs sm:text-sm break-words">
                <span className="block sm:inline">+91 6205400732</span>
                <span className="hidden sm:inline">, </span>
                <span className="block sm:inline">+91 8789573665</span>
              </h2>
            </div>
          </div>

          <div className="flex flex-row gap-3 sm:gap-4 items-center">
            <div className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-lg text-stone-700 font-bold hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/20 rounded-full transition-all duration-300 transform hover:scale-105 flex-shrink-0">
              <MdOutlineMailOutline className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-stone-100" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-stone-200 text-xs sm:text-sm">Email</h2>
              <h2 className="text-stone-200 text-xs sm:text-sm">
                Get in Touch
              </h2>
              <h2 className="text-purple-400 text-xs sm:text-sm break-words">
                contact@medknight.in
              </h2>
            </div>
          </div>

          <div className="pt-4">
            <h2 className="text-stone-100 text-sm sm:text-base">
              Contact us today for a free pilot consultation tailored to your
              needs.
            </h2>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col bg-stone-100 pt-4 sm:pt-6 pb-3 sm:pb-4 px-3 sm:px-6 gap-3 sm:gap-4 backdrop:blur-lg z-0 rounded-lg bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl max-w-full"
        >
          {submitStatus && (
            <div
              className={`p-2 sm:p-3 rounded text-xs sm:text-sm ${
                submitStatus.success
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {submitStatus.message}
            </div>
          )}

          <div className="space-y-1 sm:space-y-2">
            <Label
              htmlFor="fullName"
              className="text-stone-100 font-bold text-xs sm:text-sm md:text-base block"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter Your Name"
              className="text-stone-800 bg-slate-100 text-xs sm:text-sm md:text-base h-9 sm:h-10 px-3"
              required
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label
              htmlFor="email"
              className="text-stone-100 font-bold text-xs sm:text-sm md:text-base block"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
              className="text-stone-800 bg-slate-100 text-xs sm:text-sm md:text-base h-9 sm:h-10 px-3"
              required
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label
              htmlFor="organization"
              className="text-stone-100 font-bold text-xs sm:text-sm md:text-base block"
            >
              Organization
            </Label>
            <Input
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Enter Your Organization"
              className="text-stone-800 bg-slate-100 text-xs sm:text-sm md:text-base h-9 sm:h-10 px-3"
              required
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label
              htmlFor="message"
              className="text-stone-100 font-bold text-xs sm:text-sm md:text-base block"
            >
              Message
            </Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type Your Message"
              className="border h-16 sm:h-20 md:h-24 resize-none text-stone-800 bg-slate-100 text-xs sm:text-sm md:text-base px-3 py-2"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-sm sm:text-base md:text-lg h-10 sm:h-12 md:h-[50px] text-stone-100 font-bold hover:from-purple-600 hover:to-indigo-700 shadow-lg shadow-purple-500/20 px-6 sm:px-8 md:px-10 rounded-full transition-all duration-300 transform hover:scale-105 mt-1 sm:mt-2"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Getintouch;
