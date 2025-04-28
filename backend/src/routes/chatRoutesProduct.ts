import express, { Request, Response } from 'express';
import axios from 'axios';

const app = express();
const port = 8001;  // or whatever port you're using

// Middleware to parse JSON request body
app.use(express.json());

// API route to handle chat requests
app.post('/chat', async (req: Request, res: Response) => {
  const { message } = req.body;  // Extract message from the frontend request

  try {
    // Send request to OpenRouter API
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'deepseek/deepseek-r1:free',
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, // Use your OpenRouter API key
          'Content-Type': 'application/json'
        }
      }
    );
    // Send OpenRouter API response back to frontend
    res.json(response.data);
  } catch (error) {
    // Error handling
    console.error('Error in chat route:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the backend server
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
