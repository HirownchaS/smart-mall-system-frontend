const Navbar = () => {
    const navLink = "hover:bg-slate-300 m-4";
  return (
    <div className="w-full fixed left-0 bottom-0 bg-gray-400">
        <div className="flex justify-around align-middle">
            <a href="#" className={navLink}>Home</a>
            <a href="#" className={navLink}>Explore</a>
            <a href="#" className={navLink}>Settings</a>
        </div>        
    </div>
  )
}

export default Navbar