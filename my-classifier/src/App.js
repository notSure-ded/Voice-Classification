import React, { useState } from 'react';
import './App.css'; // Import the new CSS file

// Main App Component
export default function App() {
    // State to hold the selected audio file
    const [selectedFile, setSelectedFile] = useState(null);
    // State to store the prediction result from the backend
    const [prediction, setPrediction] = useState(null);
    // State to manage the loading status during API calls
    const [isLoading, setIsLoading] = useState(false);
    // State to store any errors that occur
    const [error, setError] = useState(null);
    // State to store the name of the selected file for display
    const [fileName, setFileName] = useState('');

    // --- Event Handlers ---

    /**
     * Handles the change event of the file input.
     * It updates the state with the selected file and its name.
     * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event.
     */
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFileName(file.name);
            // Reset previous results when a new file is selected
            setPrediction(null);
            setError(null);
        }
    };

    /**
     * Handles the prediction logic when the "Predict" button is clicked.
     * It sends the audio file to the Flask backend.
     */
    const handlePredict = async () => {
        // Ensure a file is selected before proceeding
        if (!selectedFile) {
            setError("Please select an audio file first.");
            return;
        }

        // Reset states and start loading
        setIsLoading(true);
        setError(null);
        setPrediction(null);

        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('audio', selectedFile);

        try {
            // IMPORTANT: Replace with your actual backend URL
            const backendUrl = 'http://127.0.0.1:5000/predict';

            const response = await fetch(backendUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                // Handle non-2xx HTTP responses
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setPrediction(result);

        } catch (err) {
            // Handle network errors or errors from the backend
            console.error("Prediction failed:", err);
            setError(err.message || "An unexpected error occurred. Check the console and make sure your backend server is running.");
        } finally {
            // Stop loading regardless of the outcome
            setIsLoading(false);
        }
    };

    // --- Render Logic ---

    // Determine the class for the prediction result based on its value
    const resultClassName = prediction ?
        (prediction.Random_Forest === 'AI' ? 'prediction-result-ai' : 'prediction-result-human') :
        '';

    return (
        <div className="app-container">
            <div className="content-wrapper">
                <div className="card">
                    {/* Header */}
                    <div className="header">
                        <h1>AI Voice Detector</h1>
                        <p>Upload an audio file to determine if it's AI or Human.</p>
                    </div>

                    {/* File Upload Section */}
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

                    {/* Predict Button */}
                    <div className="predict-button-wrapper">
                        <button
                            onClick={handlePredict}
                            disabled={isLoading || !selectedFile}
                            className="predict-button"
                        >
                            {isLoading ? 'Analyzing...' : 'Predict'}
                        </button>
                    </div>

                    {/* Results Section */}
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
