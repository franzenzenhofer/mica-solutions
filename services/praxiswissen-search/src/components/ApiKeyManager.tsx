import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApiKeyStore } from '../stores/apiKeyStore';

export function ApiKeyManager() {
  const { apiKey, setApiKey, isValidating, validateApiKey } = useApiKeyStore();
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if API key exists in localStorage
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      validateApiKey(storedKey);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!inputKey.startsWith('AIzaSy')) {
      setError('Invalid API key format. Gemini API keys start with "AIzaSy"');
      return;
    }

    try {
      const isValid = await validateApiKey(inputKey);
      if (isValid) {
        setApiKey(inputKey);
        localStorage.setItem('gemini_api_key', inputKey);
        setInputKey('');
      } else {
        setError('Invalid API key. Please check your key and try again.');
      }
    } catch (err) {
      setError('Failed to validate API key. Please try again.');
    }
  };

  const handleRemoveKey = () => {
    setApiKey('');
    localStorage.removeItem('gemini_api_key');
    setInputKey('');
  };

  if (apiKey) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 border border-green-200 rounded-lg p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-green-800">
              Gemini API Key Configured
            </h3>
            <p className="text-xs text-green-600 mt-1">
              {showKey 
                ? apiKey 
                : `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`
              }
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowKey(!showKey)}
              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
            <button
              onClick={handleRemoveKey}
              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
    >
      <h3 className="text-sm font-semibold text-yellow-800 mb-2">
        API Key Required
      </h3>
      <p className="text-xs text-yellow-700 mb-3">
        To use the AI features, please provide your Google Gemini API key.
        Get one free at{' '}
        <a
          href="https://makersuite.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold"
        >
          Google AI Studio
        </a>
      </p>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <input
            type={showKey ? 'text' : 'password'}
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Enter your Gemini API key (starts with AIzaSy...)"
            className="w-full px-3 py-2 text-sm border border-yellow-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </div>

        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isValidating || !inputKey}
            className="px-4 py-2 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isValidating ? 'Validating...' : 'Save API Key'}
          </button>
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="px-4 py-2 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
          >
            {showKey ? 'Hide' : 'Show'}
          </button>
        </div>
      </form>

      <div className="mt-4 p-3 bg-white rounded text-xs text-gray-600">
        <p className="font-semibold mb-1">Free Tier Limits:</p>
        <ul className="space-y-1 ml-4">
          <li>• 60 requests per minute</li>
          <li>• 1.5 million tokens per minute</li>
          <li>• 100% free for testing</li>
          <li>• Your key is stored locally and never sent to our servers</li>
        </ul>
      </div>
    </motion.div>
  );
}