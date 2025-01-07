const ContactUs = () => {
  return (
    <div className="container mx-auto max-w-7xl p-6">
      <h1 className="mb-4 text-3xl font-bold">Contact Us</h1>
      <p className="mb-6">
        We would love to hear from you! If you have any questions, comments, or
        feedback, please feel free to reach out using the contact information
        below or fill out the form.
      </p>

      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold">Get in Touch</h2>
        <p className="mb-2">
          <strong>Email:</strong>{" "}
          <a href="mailto:connect@jsrtraders.co.in" className="text-blue-500">
            connect@zaptray.com
          </a>
        </p>
        <p className="mb-2">
          <strong>Phone:</strong> +91-8927203711
        </p>
        <p className="mb-2">
          <strong>Address:</strong>
          <span className="block">
            JSR TRADERS,
            <br />
            West Bengal
            <br />
            INDIA - 743351
          </span>
        </p>
      </div>
    </div>
  );
};

export default ContactUs;
