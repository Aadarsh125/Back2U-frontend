import { useState } from "react";
import logo from "../assets/logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function Navbar() {
  const [active, setActive] = useState(false);
  const [cls, setCls] = useState("inactive");

  function openNav() {
    setActive(true);
    setCls("active");
  }
  function closeNav() {
    setActive(false);
    setCls("inactive");
  }

  // Check if user has any posts
  const myPostIds = JSON.parse(localStorage.getItem("myPostIds") || "[]");
  const hasPosts = myPostIds.length > 0;

  return (
    <nav>
      <a href="/"><img src={logo} alt="" /></a>
      <ul className={cls}>
        <li><a href="/">Home</a></li>
        <li><a href="/find">Find item</a></li>
        <li><a href="/post">Post item</a></li>
        <li><a href="/#about">About us</a></li>
        {/* Show My Posts only if user has posted something */}
        {hasPosts && (
          <li><a href="/myposts">My Posts</a></li>
        )}
      </ul>
      {active ? (
        <button className="menu-container" onClick={closeNav}>
          <CloseIcon className="menu close" />
        </button>
      ) : (
        <button className="menu-container" onClick={openNav}>
          <MenuIcon className="menu" />
        </button>
      )}
    </nav>
  );
}

export default Navbar;