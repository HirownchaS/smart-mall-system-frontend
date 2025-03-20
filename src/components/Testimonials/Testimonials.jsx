import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import axios from "axios";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchCount = useRef(0);
  const renderCount = useRef(0);

  useEffect(() => {
    console.log('Component mounted');
    let isMounted = true;
    
    const fetchTestimonials = async () => {
      fetchCount.current += 1;
      console.log(`Fetch attempt #${fetchCount.current}`);
      
      try {
        const response = await axios.get(
          "http://localhost:8080/api/feedback/v1/getAlls"
        );
        
        console.log("Raw data length:", response.data.length);
        console.log("Raw IDs:", response.data.map(item => item._id));
        
        if (isMounted) {
          // Create a Map to deduplicate based on _id
          const uniqueMap = new Map();
          response.data.forEach(item => {
            if (!uniqueMap.has(item._id)) {
              uniqueMap.set(item._id, item);
            }
          });
          
          const uniqueTestimonials = Array.from(uniqueMap.values());
          console.log("Unique testimonials length:", uniqueTestimonials.length);
          console.log("Unique IDs:", uniqueTestimonials.map(item => item._id));
          
          setTestimonials(uniqueTestimonials);
          setLoading(false);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchTestimonials();

    return () => {
      console.log('Component cleanup');
      isMounted = false;
    };
  }, []); // Empty dependency array

  // Debug render count
  renderCount.current += 1;
  console.log(`Render #${renderCount.current}`);

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Debug final testimonials before render
  console.log("Rendering testimonials length:", testimonials.length);

  return (
    <div className="py-10 mb-10">
      <div className="container">
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p data-aos="fade-up" className="text-sm text-primary">
            What our customers are saying
          </p>
          <h1 data-aos="fade-up" className="text-3xl font-bold">
            Reviews
          </h1>
        </div>
        <div data-aos="zoom-in">
          <Slider {...settings}>
            {testimonials.map((data, index) => {
              console.log(`Rendering testimonial ${index}:`, data._id);
              return (
                <div className="my-6" key={data._id}>
                  <div className="flex flex-col gap-4 shadow-lg py-8 px-6 mx-4 rounded-xl dark:bg-gray-800 bg-primary/10 relative">
                    <div className="mb-4">
                      <img
                        src={data.userId.profile_picture}
                        alt=""
                        className="rounded-full w-20 h-20"
                      />
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="space-y-3">
                        <h1 className="text-xl font-bold text-black/80 dark:text-light">
                          {data.userId.username}
                        </h1>
                        <p className="text-xs text-gray-500">{data.feedback}</p>
                      </div>
                    </div>
                    <p className="text-black/20 text-9xl font-serif absolute top-0 right-0">
                      ,,
                    </p>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;