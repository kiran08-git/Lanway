import { supabase } from './supabase';

const STORAGE_KEYS = {
  CONVERSATIONS_PREFIX: 'careerai_conversations_',
  MESSAGES_PREFIX: 'careerai_messages_',
  USAGE_PREFIX: 'careerai_chat_usage_',
};

export const DEFAULT_CHAT_LIMIT = 15;

/**
 * Get current chat usage and quota status for a user.
 */
export function getChatUsage(userId = 'guest', customLimit = DEFAULT_CHAT_LIMIT) {
  const localKey = `${STORAGE_KEYS.USAGE_PREFIX}${userId}`;
  const todayStr = new Date().toISOString().split('T')[0];

  try {
    const raw = localStorage.getItem(localKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Auto-reset if it's a new day
      if (parsed.date === todayStr) {
        const count = typeof parsed.count === 'number' ? parsed.count : 0;
        const limit = customLimit || DEFAULT_CHAT_LIMIT;
        return {
          count,
          limit,
          remaining: Math.max(0, limit - count),
          isLimitReached: count >= limit,
          date: todayStr,
        };
      }
    }
  } catch (e) {
    console.warn('[ChatService] Error reading chat usage:', e);
  }

  // Initial fresh usage state
  return {
    count: 0,
    limit: customLimit || DEFAULT_CHAT_LIMIT,
    remaining: customLimit || DEFAULT_CHAT_LIMIT,
    isLimitReached: false,
    date: todayStr,
  };
}

/**
 * Increment chat count after a successful prompt.
 */
export function incrementChatUsage(userId = 'guest', customLimit = DEFAULT_CHAT_LIMIT) {
  const localKey = `${STORAGE_KEYS.USAGE_PREFIX}${userId}`;
  const current = getChatUsage(userId, customLimit);
  const nextCount = current.count + 1;
  const nextState = {
    count: nextCount,
    limit: current.limit,
    remaining: Math.max(0, current.limit - nextCount),
    isLimitReached: nextCount >= current.limit,
    date: current.date,
  };

  try {
    localStorage.setItem(localKey, JSON.stringify(nextState));
  } catch (e) {
    console.warn('[ChatService] Error writing chat usage:', e);
  }

  return nextState;
}

/**
 * Reset chat usage (e.g. for testing or plan upgrade).
 */
export function resetChatUsage(userId = 'guest', customLimit = DEFAULT_CHAT_LIMIT) {
  const localKey = `${STORAGE_KEYS.USAGE_PREFIX}${userId}`;
  const todayStr = new Date().toISOString().split('T')[0];
  const resetState = {
    count: 0,
    limit: customLimit || DEFAULT_CHAT_LIMIT,
    remaining: customLimit || DEFAULT_CHAT_LIMIT,
    isLimitReached: false,
    date: todayStr,
  };

  try {
    localStorage.setItem(localKey, JSON.stringify(resetState));
  } catch (e) {
    console.warn('[ChatService] Error resetting chat usage:', e);
  }

  return resetState;
}

/**
 * Fetch all conversation threads for a user.
 */
export async function getConversations(userId) {
  if (!userId) return [];

  const localKey = `${STORAGE_KEYS.CONVERSATIONS_PREFIX}${userId}`;

  try {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      localStorage.setItem(localKey, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('[ChatService] Error loading conversations from Supabase:', err);
  }

  // Fallback to localStorage cache
  try {
    const cached = localStorage.getItem(localKey);
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
}

/**
 * Create a new conversation thread.
 */
export async function createConversation(userId, title = 'New Conversation') {
  const localKey = `${STORAGE_KEYS.CONVERSATIONS_PREFIX}${userId}`;
  const newConvo = {
    id: `convo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    user_id: userId,
    title,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (userId) {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: userId,
          title,
        })
        .select()
        .single();

      if (!error && data) {
        // Update local cache
        const convos = await getConversations(userId);
        const updated = [data, ...convos.filter((c) => c.id !== data.id)];
        localStorage.setItem(localKey, JSON.stringify(updated));
        return data;
      }
    } catch (err) {
      console.warn('[ChatService] Note on Supabase conversation creation:', err);
    }
  }

  // Fallback local persistence
  try {
    const cached = localStorage.getItem(localKey);
    const convos = cached ? JSON.parse(cached) : [];
    convos.unshift(newConvo);
    localStorage.setItem(localKey, JSON.stringify(convos));
  } catch (e) {
    console.warn('[ChatService] Local storage error:', e);
  }

  return newConvo;
}

/**
 * Load all messages for a specific conversation.
 */
export async function getMessages(conversationId) {
  if (!conversationId) return [];

  const localKey = `${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`;

  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (!error && data && data.length > 0) {
      localStorage.setItem(localKey, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn('[ChatService] Error loading messages from Supabase:', err);
  }

  // Fallback to local storage
  try {
    const cached = localStorage.getItem(localKey);
    return cached ? JSON.parse(cached) : [];
  } catch {
    return [];
  }
}

/**
 * Send a message to /api/chat and persist both user and assistant turns.
 */
export async function sendChatMessage({
  conversationId,
  message,
  history = [],
  context = {},
  userId,
  token,
}) {
  if (!message || !message.trim()) {
    throw new Error('Please enter a valid message.');
  }

  const userMsg = {
    id: `msg-user-${Date.now()}`,
    conversation_id: conversationId,
    user_id: userId,
    role: 'user',
    message: message.trim(),
    created_at: new Date().toISOString(),
  };

  // 1. Save user message locally immediately for snappy responsiveness
  const localMsgKey = `${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`;
  try {
    const existing = localStorage.getItem(localMsgKey);
    const msgs = existing ? JSON.parse(existing) : [];
    msgs.push(userMsg);
    localStorage.setItem(localMsgKey, JSON.stringify(msgs));
  } catch (e) {
    console.warn('[ChatService] Cache save error:', e);
  }

  // 2. Call the server-side AI chat endpoint
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      conversationId,
      message: message.trim(),
      history,
      context,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `AI Chat service error (${response.status})`);
  }

  const result = await response.json();
  if (!result.success || !result.reply) {
    throw new Error(result.error || 'No response returned from AI service.');
  }

  const assistantMsg = {
    id: `msg-ai-${Date.now()}`,
    conversation_id: conversationId,
    user_id: userId,
    role: 'assistant',
    message: result.reply,
    created_at: result.timestamp || new Date().toISOString(),
  };

  // 3. Update local cache with assistant reply
  try {
    const existing = localStorage.getItem(localMsgKey);
    const msgs = existing ? JSON.parse(existing) : [];
    msgs.push(assistantMsg);
    localStorage.setItem(localMsgKey, JSON.stringify(msgs));
  } catch (e) {
    console.warn('[ChatService] Cache save error:', e);
  }

  // 4. Persist to Supabase if authenticated
  if (userId && conversationId && !conversationId.startsWith('convo-')) {
    try {
      // Insert user message
      await supabase.from('chat_messages').insert({
        conversation_id: conversationId,
        user_id: userId,
        role: 'user',
        message: message.trim(),
      });

      // Insert assistant message
      await supabase.from('chat_messages').insert({
        conversation_id: conversationId,
        user_id: userId,
        role: 'assistant',
        message: result.reply,
      });

      // Update conversation updated_at and generate smart title if it is default
      const { data: currentConvo } = await supabase
        .from('chat_conversations')
        .select('title')
        .eq('id', conversationId)
        .single();

      const updates = { updated_at: new Date().toISOString() };
      if (!currentConvo?.title || currentConvo.title === 'New Conversation') {
        const smartTitle = message.length > 38 ? message.substring(0, 35) + '...' : message;
        updates.title = smartTitle;
      }

      await supabase
        .from('chat_conversations')
        .update(updates)
        .eq('id', conversationId);
    } catch (dbErr) {
      console.warn('[ChatService] Supabase persistence note:', dbErr);
    }
  }

  return {
    userMessage: userMsg,
    assistantMessage: assistantMsg,
    reply: result.reply,
    model: result.model,
  };
}

/**
 * Delete a conversation and all its messages.
 */
export async function deleteConversation(conversationId, userId) {
  if (!conversationId) return;

  const localKey = `${STORAGE_KEYS.CONVERSATIONS_PREFIX}${userId}`;
  const localMsgKey = `${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`;

  // Remove messages cache
  try {
    localStorage.removeItem(localMsgKey);
    const cached = localStorage.getItem(localKey);
    if (cached) {
      const convos = JSON.parse(cached);
      const filtered = convos.filter((c) => c.id !== conversationId);
      localStorage.setItem(localKey, JSON.stringify(filtered));
    }
  } catch (e) {
    console.warn('[ChatService] Local delete error:', e);
  }

  // Remove from Supabase
  if (userId && !conversationId.startsWith('convo-')) {
    try {
      await supabase.from('chat_conversations').delete().eq('id', conversationId);
    } catch (err) {
      console.warn('[ChatService] Supabase conversation delete error:', err);
    }
  }
}
