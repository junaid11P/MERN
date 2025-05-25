import React, { useEffect, useState, useRef } from 'react';

const Home = () => {
  const [textScale, setTextScale] = useState(0.3);
  const [textVisible, setTextVisible] = useState(true);
  const [imgScale, setImgScale] = useState(2);
  const [captionVisible, setCaptionVisible] = useState(false);
  const [secondTextScale, setSecondTextScale] = useState(0.5);
  const [secondImgScale, setSecondImgScale] = useState(1.5);
  const [secondCaptionVisible, setSecondCaptionVisible] = useState(false);
  const [showSecondText, setShowSecondText] = useState(true);

  const imgRef1 = useRef();
  const captionRef1 = useRef();
  const imgRef2 = useRef();
  const captionRef2 = useRef();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;

      // Welcome Text Animation
      const imgRect1 = imgRef1.current?.getBoundingClientRect();
      const scaleRange = 500;
      const newTextScale = scrollTop < scaleRange
        ? 0.3 + (scrollTop / scaleRange) * (5 - 0.3)
        : 5;
      setTextScale(newTextScale);
      setTextVisible(imgRect1?.top > 300);

      // First Image Zoom Out
      const imgVisible = Math.min(Math.max(windowHeight - imgRect1?.top, 0), windowHeight);
      const newImgScale = 1 + ((windowHeight - imgVisible) / windowHeight);
      setImgScale(Math.min(Math.max(newImgScale, 1), 2));

      // First Caption
      const captionTop = captionRef1.current?.getBoundingClientRect().top || 0;
      setCaptionVisible(captionTop < windowHeight * 0.8);

      // Second Text Zoom In
      const newSecondTextScale = scrollTop < 1800
        ? 0.8 + (scrollTop - 1600) / 600
        : 2;
      setSecondTextScale(Math.min(Math.max(newSecondTextScale, 0.4), 2));

      // Second Image Zoom Out
      const imgRect2 = imgRef2.current?.getBoundingClientRect();
      const secondImgVisible = Math.min(Math.max(windowHeight - imgRect2?.top, 0), windowHeight);
      const newSecondImgScale = 1 + ((windowHeight - secondImgVisible) / windowHeight);
      setSecondImgScale(Math.min(Math.max(newSecondImgScale, 1), 1.5));

      // Hide second text when image2 is more than halfway into view
      if (imgRect2?.top < windowHeight * 0.8) {
        setShowSecondText(false);
      } else {
        setShowSecondText(true);
      }

      // Second Caption
      const captionTop2 = captionRef2.current?.getBoundingClientRect().top || 0;
      setSecondCaptionVisible(captionTop2 < windowHeight * 1.0);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '300vh', position: 'relative', paddingBottom: '5%' }}>
      {/* Welcome Text */}
      <h1
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${textScale})`,
          transformOrigin: 'center center',
          transition: 'opacity 0.8s ease',
          opacity: textVisible ? 1 : 0,
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 999,
          color: '#000',
        }}
      >
        Welcome to Sports
      </h1>

      {/* Image 1 */}
      <div className="d-flex justify-content-center" style={{ marginTop: '100vh', zIndex: 10 }}>
        <img
          ref={imgRef1}
          src="/home1.jpg"
          alt="Sports Accessories"
          style={{
            maxWidth: '120%',
            height: 'auto',
            transform: `scale(${imgScale})`,
            transition: 'transform 0.2s ease-out',
          }}
        />
      </div>

      {/* Caption 1 */}
      <div
        ref={captionRef1}
        style={{
          opacity: captionVisible ? 1 : 0,
          transform: `translateY(${captionVisible ? '0px' : '40px'})`,
          transition: 'all 1s ease',
          textAlign: 'center',
          marginTop: '40px',
        }}
      >
        <h2>Unlock Your Potential with Premium Sports Accessories</h2>
        <p className="text-muted">
          From smart wearables to performance gear, find the tools that push you further and faster.
        </p>
      </div>

      {/* Text 2 */}
      <h2
        style={{
          position: 'fixed',
          top: '70%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${secondTextScale})`,
          transformOrigin: 'center center',
          transition: 'opacity 1s ease',
          opacity: showSecondText && secondTextScale > 1.5 ? 1 : 0,
          fontWeight: 600,
          color: '#111',
          zIndex: 998,
          pointerEvents: 'none',
        }}
      >
        Shop Smarter. Play Harder.
      </h2>

      {/* Image 2 */}
      <div className="d-flex justify-content-center" style={{ marginTop: '60vh', zIndex: 10 }}>
        <img
          ref={imgRef2}
          src="/home2.jpg"
          alt="More Accessories"
          style={{
            maxWidth: '90%',
            height: 'auto',
            transform: `scale(${secondImgScale})`,
            transition: 'transform 0.2s ease-out',
          }}
        />
      </div>

      {/* Final Caption */}
      <div
        ref={captionRef2}
        style={{
          opacity: secondCaptionVisible ? 1 : 0,
          transform: `translateY(${secondCaptionVisible ? '0px' : '40px'})`,
          transition: 'all 1s ease',
          textAlign: 'center',
          marginTop: '40px',
          fontSize: '1rem',
          color: '#333',
        }}
      >
        <p>Trusted by Athletes, Loved by All</p>
      </div>
    </div>
  );
};

export default Home;
