// components/Footer.js
import Image from "next/image";
import Link from "next/link";
import visa from "@/assets/gateway/visa.webp";
import mastercard from "@/assets/gateway/Master-Card.webp";
import upi from "@/assets/gateway/UPI.webp";
import rupay from "@/assets/gateway/rupay_payment_card.webp";

const Footer = () => {
  return (
    <footer className="bg-black p-4 text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="items-center justify-between md:flex">
          <ul className="md:flex md:space-x-4">
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
          <div className="flex items-center gap-1 pt-2">
            <Image
              src={visa}
              width={35}
              height={35}
              alt="payment"
              className="rounded-sm"
            />
            <Image
              src={mastercard}
              width={35}
              height={35}
              alt="payment"
              className="rounded-sm"
            />
            <Image
              src={rupay}
              width={35}
              height={35}
              alt="payment"
              className="rounded-sm"
            />
            <Image
              src={upi}
              width={30}
              height={30}
              alt="payment"
              className="rounded-sm"
            />
          </div>
        </div>
        <div className="mt-4 border-t border-gray-700 pt-4 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} CHIN Tapak by JSR TRADERS. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
