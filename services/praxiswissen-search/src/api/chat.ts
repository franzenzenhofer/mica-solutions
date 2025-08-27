import axios from 'axios';
import { ChatRequest, ChatResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function sendMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await axios.post<ChatResponse>(
    `${API_URL}/chat`,
    request,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  
  return response.data;
}

export async function getConversationHistory(conversationId: string) {
  const response = await axios.get(
    `${API_URL}/conversations/${conversationId}`
  );
  
  return response.data;
}

export async function searchKnowledge(query: string, limit = 5) {
  const response = await axios.get(
    `${API_URL}/knowledge/search`,
    {
      params: { query, limit },
    }
  );
  
  return response.data;
}

export async function submitFeedback(messageId: string, feedback: 'positive' | 'negative', comment?: string) {
  const response = await axios.post(
    `${API_URL}/feedback`,
    {
      messageId,
      feedback,
      comment,
    }
  );
  
  return response.data;
}