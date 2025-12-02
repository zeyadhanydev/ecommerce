import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone } from 'lucide-react';
import drinksData from "../data/drinks_menu.json";


interface Drink {
id: number;
name: string;
description: string;
category: string;
price: number;
currency: string;
image: string;
available: boolean;
rating: number;
}

const drinks: Drink[] = drinksData as Drink[]; 

const Footer = () => {

const ALL_DRINK_CATEGORIES = Array.from(new Set(drinks.map((d) => d.category)));
const collections = ALL_DRINK_CATEGORIES; 
 

const customerServices = [
 { name: "About our teas", path: "/collections" }, 
 { name: "Ordering and payment", path: "/cart" },
 { name: "Delivery", path: "/checkout/delivery" },
 { name: "Profile", path: "/account" }, 
 { name: "Terms & Conditions", path: "/contact" }, 
];

return <footer className="bg-brand-gray-light font-body">
 <div className="container mx-auto px-6 py-16"> 
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"> 
  
  {/* 1. Collections */}
  <div className="lg:border-r lg:border-brand-gray/50 lg:pr-10"> 
  <h3 className="font-heading text-xl font-bold uppercase text-brand-black mb-6">Collections</h3> 
  <ul className="space-y-3">
   {collections.map(item => (
   <li key={item}>
    <Link 
    to={`/collections?category=${encodeURIComponent(item)}`} 
    className="text-sm text-brand-black/80 hover:text-brand-primary transition-colors hover:font-medium" 
    >
    {item}
    </Link>
   </li>
   ))}
  </ul>
  </div>

  {/* 2. Customer Service */}
  <div className="lg:border-r lg:border-brand-gray/50 lg:pr-10"> 
  <h3 className="font-heading text-xl font-bold uppercase text-brand-black mb-6">More Options</h3>
  <ul className="space-y-3">
   {/* customerServices */}
   {customerServices.map(item => (
    <li key={item.name}>
     <Link 
      to={item.path} 
      className="text-sm text-brand-black/80 hover:text-brand-primary transition-colors hover:font-medium"
     >
      {item.name}
     </Link>
    </li>
   ))}
  </ul>
  </div>

  {/* 3. Contact us */}
  <div>
  <h3 className="font-heading text-xl font-bold uppercase text-brand-black mb-6">Contact us</h3>
  <ul className="space-y-5 text-sm text-brand-black/80"> 
   <li className="flex items-start gap-3">
    <MapPin className="h-5 w-5 flex-shrink-0 mt-1 text-brand-primary" /> 
    <span>3 Falahi, Falahi St, Pasdaran Ave, Shiraz, Fars Province, Iran</span>
   </li>
   <li className="flex items-center gap-3">
    <Mail className="h-5 w-5 flex-shrink-0 text-brand-primary" /> 
    <a href="mailto:amoopur@gmail.com" className="hover:text-brand-black transition-colors">amoopur@gmail.com</a>
   </li>
   <li className="flex items-center gap-3">
    <Phone className="h-5 w-5 flex-shrink-0 text-brand-primary" /> 
    <a href="tel:+989173038406" className="hover:text-brand-black transition-colors">+98 9173038406</a>
   </li>
  </ul>
  </div>
 </div>
 <div className="mt-16 border-t border-brand-gray/50 pt-8 text-center text-xs text-brand-black/60"> 
 <p>&copy; {new Date().getFullYear()} Caffinity. All Rights Reserved.</p>
 </div>
 </div>
</footer>
;
};

export default Footer;