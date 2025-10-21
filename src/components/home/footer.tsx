import { Clock, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="screen py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-bold mb-2 text-white">SBORR</h2>
          <p className="text-sm text-white/80 mb-6 max-w-md">
            Committed to transparency, accountability, and public service.
            Access legislative documents, stay informed about municipal
            governance, and engage with your local government.
          </p>

          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-white/90" />
              <span>Municipal Hall, Barangay Centro, Municipality</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-white/90" />
              <span>091223244121</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-white/90" />
              <span>sborr.montalban@gmail.com</span>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-white/90" />
              <span>Mon-Fri: 8:00 AM - 5:00 PM</span>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold mb-4 text-white">Sangguniang Bayan</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <a href="#" className="hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Councilors
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-white">
                Legislatives
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-white">Resources</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <a href="#" className="hover:text-white">
                Public Documents
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Ordinances
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Resolutions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Archives
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-white">Connect</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <a href="#" className="hover:text-white">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Email Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="screen flex flex-col md:flex-row justify-between items-center text-xs text-white/70 py-4">
          <p>© 2024 Sangguniang Bayan. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
