const ShippingPolicy = () => {
  return (
    <div className="container mx-auto max-w-7xl p-6">
      <h1 className="mb-4 text-3xl font-bold">Shipping Policy</h1>
      <p className="mb-4">
        At JSR TRADERS, we aim to deliver your orders promptly. Below are the
        details of our shipping policy.
      </p>

      <h2 className="mb-2 text-2xl font-bold">Shipping Methods</h2>
      <p className="mb-4">
        We offer standard and express shipping options. You can choose your
        preferred method at checkout.
      </p>

      <h2 className="mb-2 text-2xl font-bold">Shipping Rates</h2>
      <p className="mb-4">
        Shipping rates vary based on the selected shipping method and your
        location. Please check the rates at checkout.
      </p>

      <h2 className="mb-2 text-2xl font-bold">Estimated Delivery Times</h2>
      <p className="mb-4">
        Estimated delivery times are provided at checkout. Please note that
        these times may vary based on external factors.
      </p>

      <h2 className="mb-2 text-2xl font-bold">International Shipping</h2>
      <p className="mb-4">
        We do offer international shipping. Additional fees and customs duties
        may apply.
      </p>

      <h2 className="mb-2 text-2xl font-bold">Lost or Damaged Items</h2>
      <p className="mb-4">
        If your item is lost or damaged during shipping, please contact us
        immediately at{" "}
        <a href="mailto:connect@zaptray.com" className="text-blue-500">
          connect@zaptray.com
        </a>{" "}
        for assistance.
      </p>

      <p>
        If you have any questions about our shipping policy, feel free to reach
        out to us.
      </p>
    </div>
  );
};

export default ShippingPolicy;
