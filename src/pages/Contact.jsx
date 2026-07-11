import { Canvas } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";

import { Alert, Loader } from "../components";
import {
  CONTACT_TO_EMAIL,
  FORMCARRY_ENDPOINT,
  SITE_LINKEDIN_URL,
} from "../config/site";
import useAlert from "../hooks/useAlert";
import { Fox } from "../models";
import { submitContactForm } from "../utils/contactEmail";

const SUCCESS_RESET_DELAY_MS = 3000;

const Contact = () => {
  const formRef = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const { alert, showAlert, hideAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState("idle");

  const handleChange = ({ target: { name, value } }) => {
    setForm({ ...form, [name]: value });
  };

  const handleFocus = () => setCurrentAnimation("walk");
  const handleBlur = () => setCurrentAnimation("idle");

  const resetFormAfterSuccess = () => {
    hideAlert();
    setCurrentAnimation("idle");
    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setCurrentAnimation("hit");

    try {
      await submitContactForm(form, FORMCARRY_ENDPOINT);
      setLoading(false);
      showAlert({
        show: true,
        text: "Thank you for your message 😃",
        type: "success",
      });

      window.setTimeout(resetFormAfterSuccess, SUCCESS_RESET_DELAY_MS);
    } catch (error) {
      setLoading(false);
      setCurrentAnimation("idle");
      showAlert({
        show: true,
        text: error.message || "I didn't receive your message 😢",
        type: "danger",
      });
    }
  };

  return (
    <section className="relative flex lg:flex-row flex-col max-container">
      {alert.show && <Alert {...alert} />}

      <div className="flex-1 min-w-[50%] flex flex-col">
        <h1 className="head-text">Get in Touch</h1>
        <p className="mt-3 text-slate-500" data-testid="contact-email">
          Email:{" "}
          <a
            className="text-blue-500 font-medium"
            href={`mailto:${CONTACT_TO_EMAIL}`}
          >
            {CONTACT_TO_EMAIL}
          </a>
        </p>
        <p className="mt-1 text-slate-500" data-testid="contact-linkedin">
          LinkedIn:{" "}
          <a
            className="text-blue-500 font-medium"
            href={SITE_LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            gunjanbandekar1320
          </a>
        </p>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-7 mt-14"
          data-testid="contact-form"
        >
          <label className="text-black-500 font-semibold">
            Full Name
            <input
              type="text"
              name="name"
              className="input"
              placeholder="Your first and last name"
              required
              value={form.name}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label className="text-black-500 font-semibold">
            Your Email Address
            <input
              type="email"
              name="email"
              className="input"
              placeholder="john@doe.com"
              required
              value={form.email}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label className="text-black-500 font-semibold">
            Your Message
            <textarea
              name="message"
              rows="4"
              className="textarea"
              placeholder="Enter your message..."
              required
              value={form.message}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="btn"
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>

      <div className="lg:w-1/2 w-full lg:h-auto md:h-[550px] h-[350px]">
        <Canvas
          camera={{
            position: [0, 0, 5],
            fov: 75,
            near: 0.1,
            far: 1000,
          }}
        >
          <directionalLight position={[0, 0, 1]} intensity={2.5} />
          <ambientLight intensity={1} />
          <pointLight position={[5, 10, 0]} intensity={2} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={2}
          />

          <Suspense fallback={<Loader />}>
            <Fox
              currentAnimation={currentAnimation}
              position={[0.5, 0.35, 0]}
              rotation={[12.629, -0.6, 0]}
              scale={[0.5, 0.5, 0.5]}
            />
          </Suspense>
        </Canvas>
      </div>
    </section>
  );
};

export default Contact;
