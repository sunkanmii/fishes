import logo from './logo.svg';
import './App.css';
/* 
* Create your config data and import firebaseConfig here
*/
import { firebaseConfig } from "./firebase";
import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";

function App() {
  const [realFishes, setRealFishes] = useState([]);
  const [aiFishes, setAIFishes] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        initializeApp(firebaseConfig); // Initialize Firebase app
        const storage = getStorage(); // Get Storage instance

        // Fetch data for each type and set state
        await fetchImageData(storage, 'ai-fishes/');
        await fetchImageData(storage, '/');

        // Set loading to false after all data is fetched
        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [dataFetched]);

  const fetchImageData = async (storage, path) => {
    try {
      const storageRef = ref(storage, path);
      const result = await listAll(storageRef);
      const urlPromises = result.items.map((imageRef) => getDownloadURL(imageRef));
      const urls = await Promise.all(urlPromises);

      // Set state based on path
      switch (path) {
        case '/':
          setRealFishes(urls);
          break;
        case 'ai-fishes/':
          setAIFishes(urls);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  return (
    <div className="App">
      {
        realFishes.length > 0 ?
          realFishes.map((ele, index) => {
            return (
              <div key={index}>
                <p>Fish #{index+1}</p>
                <img 
                style={{width: "50vw", height: "auto", }} src={ele} alt="" />
              </div>
            )
          }) :
          <p>Loading...</p>
      }
      <h2 style={{width: "100vw"}}>AI FISH</h2>
      {
        aiFishes.map((ele, index) => {
          return (
            <div key={index}>
              <img style={{width: "50vw", height: "auto", }} src={ele} alt=""/>
            </div>
            )
        })
        
      }
    </div>
  );
}

export default App;
