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
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: "contact@medknight.in",
          subject: "New Contact Form Submission",
          formData
        }),
      });

      if (response.ok) {
        setSubmitStatus({ success: true, message: "Your message has been sent successfully!" });
        // Reset form after successful submission
        setFormData({
          fullName: "",
          email: "",
          organization: "",
          message: ""
        });
      } else {
        setSubmitStatus({ success: false, message: "Failed to send message. Please try again later." });
      }
    } catch (error) {
      setSubmitStatus({ success: false, message: "An error occurred. Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

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
              diagnostics. Let's discuss how our AI-powered teleradiology
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
        <form onSubmit={handleSubmit} className="flex flex-col bg-stone-100 p-3 gap-4 rounded-lg">
          {submitStatus && (
            <div className={`p-3 rounded ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {submitStatus.message}
            </div>
          )}
          <div>
            <Label htmlFor="fullName" className="text-stone-600 font-bold">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter Your Name"
              className="bg-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-stone-600 font-bold">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
              className="bg-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="organization" className="text-stone-600 font-bold">Organization</Label>
            <Input
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Enter Your Organization"
              className="bg-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="message" className="text-stone-600 font-bold">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type Your Message"
              className="bg-white h-24 resize-none"
              required
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-purple-400 h-10 font-bold hover:bg-purple-500 disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Getintouch;