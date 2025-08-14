import Navbar from '../components/Navbar'; // Update the import path as needed
import OpVid from '../components/OpVid'; // Update the import path as needed
import OpPara from '../components/OpPara'; // Update the import path as needed
import { useLocation } from 'react-router-dom';
function Output() {

const location = useLocation()

const data = location.state?.data 
const params = location.state?.data.inputParameters
console.log("data:" + data)
console.log("params:" + params)
  return (
    <div>
      <Navbar />
      <div className="flex">
        <div className="relative bg-light w-3/4">
          <OpVid videoPath={`/api/output/${data.filename}`} />
          {/* <div className="absolute top-0 right-0 mt-4 mr-4">
            <button
              className="bg-default text-white py-2 px-4 rounded-full hover:bg-darker"
              onClick={handleDownload}
            >
              <FontAwesomeIcon icon={faDownload} />
            </button>
          </div> */}
        </div>
        <OpPara parameters={params} />
      </div>
    </div>
  );
}

export default Output;
