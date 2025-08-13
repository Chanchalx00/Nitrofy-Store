import {Suspense} from 'react';
import {Await, NavLink, Form} from 'react-router';

import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapIcon,
  Phone,
} from 'lucide-react';

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-brand-navy text-white">
            {/* Newsletter Signup Section */}
            <div className="border-b border-white/10">
              <div className="container mx-auto px-4 py-12">
                <div className="max-w-xl mx-auto text-center">
                  <h2 className="font-playfair text-2xl mb-4">
                    Join the Shop Circle
                  </h2>
                  <p className="font-source text-sm text-gray-300 mb-6">
                    Subscribe to receive updates on new collections,products and
                    exclusive offers.
                  </p>
                  <Form className="flex gap-4">
                    <input
                      type="email"
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-gray-400 font-source"
                      placeholder="Your email address"
                      required
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-brand-gold hover:bg-brand-goldDark transition-colors duration-300 rounded-sm font-source text-sm font-medium "
                    >
                      Subscribe
                    </button>
                  </Form>
                </div>
              </div>
            </div>
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {/*Brand column */}
                <div className="space-y-6">
                  <h3 className="font-playfair text-2xl">NITROFY</h3>
                  <p className="font-source text-sm text-gray-300 leading-relaxed">
                    Nitrofy fuels your shopping with speed, style, and
                    unbeatable deals — delivering what you love, faster than
                    ever.
                  </p>
                  <div className="flex space-x-4">
                    <a
                      href="#"
                      className="text-white/80 hover:text-brand-gold transition-colors duration-300 "
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="text-white/80 hover:text-brand-gold transition-colors duration-300 "
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="text-white/80 hover:text-brand-gold transition-colors duration-300 "
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                {/* Contact column*/}
                <div className="space-y-6">
                  <h4 className="font-playfair text-lg">Contact</h4>
                  <ul className="space-y-4 font-source text-sm text-gray-400">
                    <li className="flex items-start space-x-3">
                      <MapIcon className="w-5 h-5 text-brand-gold flex-shrink-0" />
                      <span>
                        123 Artisan May
                        <br /> Luxury District, IN 10001
                      </span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-brand-gold flex-shrink-0" />
                      <span>+1 (888) 123-4567</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-brand-gold flex-shrink-0" />
                      <span>chanchal@gmail.com</span>
                    </li>
                  </ul>
                </div>

                {/* Quick Links Column*/}
                <div className="space-y-6">
                  <h4 className="font-playfair text-lg">Quick Links</h4>
                  <ul className="space-y-4 font-source text-sm">
                    <li className="flex items-start space-x-3">
                      <NavLink
                        to="/collections/all"
                        className="text-gray-300 hover:text-brand-gold transition-colors duration-300"
                      >
                        Products
                      </NavLink>
                    </li>
                    <li className="flex items-start space-x-3">
                      <NavLink
                        to="/collections/all"
                        className="text-gray-300 hover:text-brand-gold transition-colors duration-300"
                      >
                        Our Collections
                      </NavLink>
                    </li>
                    <li className="flex items-start space-x-3">
                      <NavLink
                        to="/collections/all"
                        className="text-gray-300 hover:text-brand-gold transition-colors duration-300"
                      >
                        Care Guide
                      </NavLink>
                    </li>
                    <li className="flex items-start space-x-3">
                      <NavLink
                        to="/pages/about-us"
                        className="text-gray-300 hover:text-brand-gold transition-colors duration-300"
                      >
                        About Us
                      </NavLink>
                    </li>
                  </ul>
                </div>

                {/* Policies Column*/}
                <div className="space-y-6">
                  <h4 className="font-playfair text-lg">Policies</h4>
                  <FooterMenu
                    menu={footer?.menu}
                    primaryDomainUrl={header.shop.primaryDomain.url}
                    publicStoreDomain={publicStoreDomain}
                  />
                </div>
              </div>
            </div>
            {/* Copyright Bar */}
            <div className="border-t border-white/10">
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-0 md:space-y-0">
                  <p className="font-source text-sm text-gray-400">
                    © {new Date().getFullYear()} NITROFY. All rights reserved.
                  </p>
                  <p className="font-source text -sm text-gray-400">
                    Shpping in India
                  </p>
                </div>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

/**
 * @param {{
 *   menu: FooterQuery['menu'];
 *   primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
 *   publicStoreDomain: string;
 * }}
 */
function FooterMenu({menu, primaryDomainUrl, publicStoreDomain}) {
  return (
    <nav className="space-y-3 font-source text-sm " role="navigation">
      {menu?.items.map((item) => {
        if (!item.url) {
          return null;
        }
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl) //store domains
            ? new URL(item.url).pathname
            : item.url;

        return (
          <NavLink
            className={({isActive}) =>
              `block text-gray-300 hover:text-brand-gold transition-colors duration-300 ${isActive?'text-brand-gold':''}`
            }
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}



/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
