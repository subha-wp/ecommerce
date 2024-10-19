const CancellationPolicy = () => {
  return (
    <div className="container mx-auto max-w-7xl p-6">
      <h1 className="mb-4 text-3xl font-bold">Cancellation Policy</h1>
      <p className="mb-4">
        At JSR TRADERS, we understand that sometimes you may need to cancel an
        order. Please read our cancellation policy below.
      </p>

      <h2 className="mb-2 text-2xl font-bold">Cancellation Window</h2>
      <p className="mb-4">
        You can cancel your order within 24 hours of placing it, provided the
        order has not yet been shipped.
      </p>

      <h2 className="mb-2 text-2xl font-bold">How to Cancel</h2>
      <p className="mb-4">
        To initiate a cancellation, please contact us at{" "}
        <a href="mailto:connect@jsrtraders.co.in" className="text-blue-500">
          connect@jsrtraders.co.in
        </a>{" "}
        with your order details.
      </p>

      <h2 className="mb-2 text-2xl font-bold">Cancellation Fees</h2>
      <p className="mb-4">
        There are no cancellation fees, provided the cancellation request is
        made within the specified window.
      </p>

      <h2 className="mb-2 text-2xl font-bold">Refund for Canceled Orders</h2>
      <p className="mb-4">
        If your order is canceled successfully, a full refund will be processed
        to your original payment method.
      </p>

      <p>
        For any questions regarding our Cancellation Policy, please contact us
        at{" "}
        <a href="mailto:connect@jsrtraders.co.in" className="text-blue-500">
          connect@jsrtraders.co.in
        </a>
        .
      </p>
    </div>
  );
};

export default CancellationPolicy;
