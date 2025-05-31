import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.scss';

const Footer: React.FC = () => {
    return (
        <div>
            <footer className="footer">


                <div className='rel-form'>

                    <p>STAY UPTO DATE ABOUT OUR LATEST OFFERS</p>
                    <div className="form-group">
                        <input type="email" name="" id="" placeholder='Enter your email address' />
                        <button type='submit'>Subscribe to Newsletter</button>
                    </div>



                </div>
                <div className='footer-container'>
                    <div className="left">
                        <div className="footer-section">
                            <h3>SHOP.CO</h3>

                            <p>We have clothes that suits your style and which you’re proud to wear. From women to men.</p>
                            <div className="social-media">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="footer-section">
                            <h3>Company</h3>
                            <ul>
                                <li>About Us</li>
                                <li>Careers</li>
                                <li>Contact Us</li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h3>Help</h3>
                            <ul>
                                <li>Support</li>
                                <li>FAQs</li>
                                <li>Terms of Service</li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h3>FAQ</h3>
                            <ul>
                                <li>Support</li>
                                <li>FAQs</li>
                                <li>Terms of Service</li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h3>Resources</h3>
                            <ul>
                                <li>Blog</li>
                                <li>Guides</li>
                                <li>Community</li>
                            </ul>
                        </div>

                    </div>

                </div>
                <div className='lower'>

                    <p>&copy; 2023 Company Name. All rights reserved.</p>
                    <img src="pay.png" alt="" />
                </div>
            </footer>
        </div>
    );
};

export default Footer;
