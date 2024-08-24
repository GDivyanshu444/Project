import { useState } from "react";
const App = () => {

  const [image, setImage] = useState(null);
  const [value, setValue] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const surpriseOption = [
    'does this image has cat?',
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
        {response && <p className="">{response}</p>}
      </section>

    </div>
  );
}

export default App;
