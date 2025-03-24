import { useState, useEffect, useRef } from "react";
import axios from "axios";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchCount = useRef(0);
  const renderCount = useRef(0);

  useEffect(() => {
    console.log("Component mounted");
    let isMounted = true;

    const fetchTestimonials = async () => {
      fetchCount.current += 1;
      console.log(`Fetch attempt #${fetchCount.current}`);

      try {
        const response = await axios.get(
          "http://localhost:8080/api/feedback/v1/getAlls"
        );

        if (!isMounted) return;
        
        console.log("Raw response data:", response.data);
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid response format");
        }

        // Filter out items without _id
        const validItems = response.data.filter(item => item && item._id);
        console.log("Valid items count:", validItems.length);
        
        // Use Set to track processed IDs
        const processedIds = new Set();
        const uniqueTestimonials = [];
        
        for (const item of validItems) {
          if (!processedIds.has(item._id)) {
            processedIds.add(item._id);
            uniqueTestimonials.push(item);
          }
        }
        
        console.log("Final unique testimonials count:", uniqueTestimonials.length);

        setTestimonials(uniqueTestimonials);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        if (isMounted) {
          setError(err.message || "Failed to fetch testimonials");
          setLoading(false);
        }
      }
    };

    fetchTestimonials();

    return () => {
      console.log("Component cleanup");
      isMounted = false;
    };
  }, []);

  // Debug render count
  renderCount.current += 1;
  console.log(`Render #${renderCount.current}, testimonials length: ${testimonials.length}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (testimonials.length === 0) return <div>No testimonials available</div>;

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
          {/* <p className="mt-2 text-gray-500">Total reviews: {testimonials.length}</p> */}
        </div>
        
        {/* Grid layout instead of slider */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-aos="zoom-in">
          {testimonials.map((data) => (
            <div className="my-2" key={data._id}>
              <div className="flex flex-col gap-4 shadow-lg py-8 px-6 rounded-xl dark:bg-gray-800 bg-primary/10 relative h-full">
                <div className="mb-4">
                  <img
                    className="rounded-full h-24 w-24"
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    alt="user-profile"
                  />
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="space-y-3">
                    <h1 className="text-xl font-bold text-black/80 dark:text-light">
                      {data.userId && data.userId.username ? data.userId.username : "Anonymous User"}
                    </h1>
                    <p className="text-xs text-gray-500">{data.feedback}</p>
                  </div>
                </div>
                <p className="text-black/20 text-9xl font-serif absolute top-0 right-0">
                  ,,
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;