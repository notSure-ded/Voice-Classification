import React, { useState } from 'react';
import './App.css'; 


export default function App() {

    const [selectedFile, setSelectedFile] = useState(null);
 
    const [prediction, setPrediction] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState(null);
 
    const [fileName, setFileName] = useState('');

  
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
    
            setPrediction(null);
            setError(null);
        }
    };


    const handlePredict = async () => {
       
        if (!selectedFile) {
            setError("Please select an audio file first.");
            return;
        }

       
        setIsLoading(true);
        setError(null);
        setPrediction(null);

       
        const formData = new FormData();
        formData.append('audio', selectedFile);

        try {
            
            const backendUrl = 'http://127.0.0.1:5000/predict';

            const response = await fetch(backendUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
             
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setPrediction(result);

        } catch (err) {
           
            console.error("Prediction failed:", err);
            setError(err.message || "An unexpected error occurred. Check the console and make sure your backend server is running.");
        } finally {
           
            setIsLoading(false);
        }
    };

  
    const resultClassName = prediction ?
        (prediction.Random_Forest === 'AI' ? 'prediction-result-ai' : 'prediction-result-human') :
        '';

    return (
        <div className="app-container">
            <div className="content-wrapper">
                <div className="card">
                 
                    <div className="header">
                        <h1>AI Voice Detector</h1>
                        <p>Upload an audio file to determine if it's AI or Human.</p>
                    </div>

                   
                    <div className="file-upload-section">
                        <label htmlFor="audio-upload" className="file-upload-label">
                            <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                            <span className="upload-text">Click to upload</span>
                            <span className="upload-hint">WAV, MP3, or other audio formats</span>
                        </label>
                        <input
                            id="audio-upload"
                            type="file"
                            accept="audio/*"
                            onChange={handleFileChange}
                            className="file-input"
                        />
                        {fileName && (
                            <p className="file-name">
                                Selected: <span>{fileName}</span>
                            </p>
                        )}
                    </div>

                  
                    <div className="predict-button-wrapper">
                        <button
                            onClick={handlePredict}
                            disabled={isLoading || !selectedFile}
                            className="predict-button"
                        >
                            {isLoading ? 'Analyzing...' : 'Predict'}
                        </button>
                    </div>

                  
                    <div className="results-section">
                        {error && (
                            <div className="error-box">
                                <p className="error-title">Error</p>
                                <p>{error}</p>
                            </div>
                        )}
                        {prediction && (
                            <div className="prediction-box">
                                <h2 className="prediction-title">Prediction Result</h2>
                                <p className={`prediction-result ${resultClassName}`}>
                                    {prediction.Random_Forest}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <footer className="footer">
                    <p>Connect this frontend to your Python backend server.</p>
                </footer>
            </div>
        </div>
    );
}
