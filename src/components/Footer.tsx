import Image from "next/image";
import Link from "next/link";
import visa from "@/assets/gateway/visa.webp";
import mastercard from "@/assets/gateway/Master-Card.webp";
import upi from "@/assets/gateway/UPI.webp";
import rupay from "@/assets/gateway/rupay_payment_card.webp";
import googlePlayIcon from "@/assets/google-play-badge.png";

const Footer = () => {
  return (
    <footer className="bg-black p-4 text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company Information */}
          <div>
            <h3 className="mb-4 text-lg font-bold">About JSR TRADERS</h3>
            <p>
              Established in 2020, JSR TRADERS is a growing wholesale
              distributor based in West Bengal, India. We are committed to
              providing quality products at competitive prices.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Contact Us</h3>
            <p className="mb-2">Email: connect@zaptray.com</p>
            <p className="mb-2">Phone: +91-8927203711</p>
            <p>
              Address: JSR TRADERS,
              <br />
              West Bengal, India - 743351
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold">Important Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-and-conditions">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/return-refund-policy">Return & Refund Policy</Link>
              </li>
              <li>
                <Link href="/shipping-policy">Shipping Policy</Link>
              </li>
              <li>
                <Link href="/cancellation-policy">Cancellation Policy</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods & App Download */}
        <div className="mt-8 border-t border-gray-700 pt-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image
                src={visa}
                width={35}
                height={35}
                alt="Visa"
                className="rounded-sm"
              />
              <Image
                src={mastercard}
                width={35}
                height={35}
                alt="Mastercard"
                className="rounded-sm"
              />
              <Image
                src={rupay}
                width={35}
                height={35}
                alt="RuPay"
                className="rounded-sm"
              />
              <Image
                src={upi}
                width={30}
                height={30}
                alt="UPI"
                className="rounded-sm"
              />
            </div>
            <Link href="https://play.google.com/store/apps/details?id=com.devcodersubha.zaptray">
              <Image
                src={googlePlayIcon}
                width={120}
                height={35}
                alt="Download on Google Play"
              />
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 border-t border-gray-700 pt-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} JSR TRADERS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
