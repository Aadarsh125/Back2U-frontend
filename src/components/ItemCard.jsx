import { useState, useEffect } from "react";
import noImage from "../assets/no-image.png";

export default function Itemcard(props) {
  const [image, setImage] = useState(noImage);

  useEffect(() => {
    if (!props.image) {
      setImage(noImage);
      return;
    }
    // Cloudinary images are full URLs, use directly
    if (props.image.startsWith("http")) {
      setImage(props.image);
    } else {
      setImage(noImage);
    }
  }, [props.image]);

  return (
    <a href={"/find/details/" + props.id} data-aos="fade-up">
      <div className="card">
        <div className="card-img">
          <img src={image} alt="" />
        </div>
        <div className="card-desc">
          <h2>{props.title}</h2>
          <p>{props.description}</p>
        </div>
      </div>
    </a>
  );
}