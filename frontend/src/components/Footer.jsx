import React from 'react';

const Footer = () => {
    return (
        <footer className=" border-t border-gray-200 bg-white">
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        {/* <div className="w-6 h-6 bg-primary rounded"></div> */}
                        <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                            <span className="text-sm font-bold text-white">C</span>
                        </div>
                        <span className="font-bold text-gray-900">CodeCraft</span>
                    </div>

                    <div className="text-sm text-gray-500 text-center">
                        <p>Copyright © {new Date().getFullYear()} - All rights reserved by CodeCraft</p>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-500">
                        <a href="#" className="hover:text-gray-700 transition-colors">Privacy</a>
                        <span>•</span>
                        <a href="#" className="hover:text-gray-700 transition-colors">Terms</a>
                        <span>•</span>
                        <a href="#" className="hover:text-gray-700 transition-colors">Contact</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;