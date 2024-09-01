import { Link } from 'react-router-dom'
import HamburgerIcon from 'src/icons/HamburgerIcon';

function Navbar() {
  return (
    <nav className="bg-[#f8f9fa] shadow-md py-4 px-6">
      <div className="flex items-center justify-between">
        <Link className="text-xl font-semibold text-gray-900" to="/">ClinicOs System</Link>
        <button className="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none">
          <HamburgerIcon />
        </button>
      </div>
    </nav>
  );
}

export default Navbar