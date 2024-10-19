const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto max-w-7xl p-6">
      <h1 className="mb-4 text-3xl font-bold">Privacy Policy</h1>
      <p className="mb-4">
        At JSR TRADERS, we value your privacy and are committed to protecting
        your personal information. This Privacy Policy outlines how we collect,
        use, and share your information when you use our app, CHIN Tapak.
      </p>

      <h2 className="mb-2 text-2xl font-bold">Information We Collect</h2>
      <p className="mb-4">
        We collect the following personal information from our users:
      </p>
      <ul className="mb-4 list-inside list-disc">
        <li>Name</li>
        <li>Email Address</li>
        <li>Phone Number</li>
        <li>Shipping Address</li>
      </ul>

      <h2 className="mb-2 text-2xl font-bold">How We Use Your Information</h2>
      <p className="mb-4">We use your information to:</p>
      <ul className="mb-4 list-inside list-disc">
        <li>Process and fulfill your orders.</li>
        <li>Communicate with you regarding your orders.</li>
        <li>Improve our services and customer experience.</li>
      </ul>

      <h2 className="mb-2 text-2xl font-bold">Cookies</h2>
      <p className="mb-4">
        We use cookies for authentication purposes only. Cookies are small files
        stored on your device that help us recognize you and enhance your
        experience on our app.
      </p>

      <h2 className="mb-2 text-2xl font-bold">Data Deletion</h2>
      <p className="mb-4">
        You can request the deletion of your personal data by sending an email
        to{" "}
        <a href="mailto:connect@jsrtraders.co.in" className="text-blue-500">
          connect@jsrtraders.co.in
        </a>
        .
      </p>

      <h2 className="mb-2 text-2xl font-bold">
        Changes to This Privacy Policy
      </h2>
      <p className="mb-4">
        We may update this Privacy Policy from time to time. We will notify you
        of any changes by posting the new policy on this page.
      </p>

      <p>
        If you have any questions about this Privacy Policy, please contact us
        at{" "}
        <a href="mailto:connect@jsrtraders.co.in" className="text-blue-500">
          connect@jsrtraders.co.in
        </a>
        .
      </p>
    </div>
  );
};

export default PrivacyPolicy;
