import { useState } from "react";
const App = () => {

  const [image, setImage] = useState(null);
  const [value, setValue] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const surpriseOption = [
    "What is the main object in this image?",
    "Are there any noticeable emotions or actions taking place in this image?",
    "What natural elements can you spot here?",
    "Does this image seem to be taken indoors or outdoors?",
    "What colors dominate this image?",
    "Can you identify any specific location or landmark in this image?",
    "Is there any text visible in this image? What does it say?",
    "What type of weather is depicted in this image?",
    "Do you think this image is from a city or rural area?",
    "What kind of mood does this image convey?",
    "Can you spot any vehicles or transportation methods in this image?",
    "Does this image show any signs of a celebration or event?",
    "Does this image contain any food? Can you identify it?",
    "What historical period could this image be from?",
    "Do you think this image was captured recently or is it old?",
    "Is there any art or decoration visible in this image?",
    "What kind of clothing is being worn in this image?",
    "Can you guess the location of this image based on visual clues?"
  ]

  const surprise = async () => {
    const randomVal = surpriseOption[Math.floor(Math.random() * surpriseOption.length)]
    setValue(randomVal)
  }

  const uploadImage = async (e) => {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    setImage(e.target.files[0])
    try {
      const options = {
        method: 'POST',
        body: formData
      }
      const res = await fetch('http://localhost:8000/upload', options)
      const data = await res.json()
      console.log(data);
    } catch (error) {
      console.error(error);
      setError("Something didn't work please try again.")
    }
  }

  const analyzeImage = async () => {
    if (!image) {
      setError("Error! Must have an existing image!")
      return
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          message: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const res = await fetch('http://localhost:8000/gemini', options)
      const data = await res.text()
      setResponse(data)
    } catch (error) {
      console.error(error);
      setError("Something didn't work! Please try aain.")
    }
  }


  const clear = async () => {
    setImage(null)
    setValue("")
    setResponse("")
    setError("")
  }

  return (
    <div className="app">
      <section className="search-section">
        <div className="image-container" title="click on upload an image>>">
          {image && <img className="image" src={URL.createObjectURL(image)} alt="" />}
        </div>
        {!response &&
          <p className="extra-info">
            <span className="upload">
              <label htmlFor="image">upload an image </label>
              <input onChange={uploadImage} id="image" type="file" accept="image/*" hidden />
            </span>
            to ask question about.
          </p>
        }


        <p className="">What do you want to know about the image?
          <button className="surprise" onClick={surprise} disabled={response}>Surprise me</button>
        </p>
        <div className="input-container">
          <input
            className=""
            value={value}
            placeholder="What is in the image..."
            onChange={e => setValue(e.target.value)}
          />
          {(!response && !error) && <button className="" onClick={analyzeImage}>Ask me</button>}
          {(response || error) && <button className="" onClick={clear}>Clear</button>}
        </div>
        {error && <p className="">{error}</p>}
        {response && <p className="answer">{response}</p>}
      </section>

    </div>
  );
}

export default App;
