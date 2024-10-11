import { GoogleGenerativeAI } from '@google/generative-ai';

// Sleep function to add delays
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Extract key points from a message
export const extractKeyPoints = async (apiKey, message) => {
  try {
    await sleep(1000);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Extract key points from the following message:\n\n"${message}"\n\nKey Points:`;

    const result = await model.generateContent(prompt);
    const keyPoints = result.response.text();

    return keyPoints;
  } catch (error) {
    console.error('Error extracting key points:', error);
    return '';
  }
};

// Decide whether to perform a web search, generate a response, or open a link
export const decideAction = async (apiKey, message, conversationContext) => {
  try {
    await sleep(1000);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Based on the user's message and conversation context, decide whether to proceed with a web search, generate a response using internal knowledge, or open a link (if the user asks you to visit a website).

User's message: "${message}"
Conversation context: ${conversationContext.join('\n')}

Options:
1. web_search
2. generate
3. openlink

Respond with the option number (1, 2, or 3) indicating your decision.
If you choose option 3 (openlink), also provide the URL extracted from the user's message.

Format:
Decision: [1/2/3]
URL: [The URL if decision is "3", otherwise leave blank]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    const decisionMatch = responseText.match(/Decision:\s*(1|2|3)/i);
    const urlMatch = responseText.match(/URL:\s*(.*)/i);

    let decision = 'generate'; // default action
    let url = '';

    if (decisionMatch) {
      const decisionNum = decisionMatch[1];
      if (decisionNum === '1') {
        decision = 'web_search';
      } else if (decisionNum === '2') {
        decision = 'generate';
      } else if (decisionNum === '3') {
        decision = 'openlink';
        if (urlMatch) {
          url = urlMatch[1].trim();
        }
      }
    }

    console.log('Decision:', decision, 'URL:', url);
    return { action: decision, url };
  } catch (error) {
    console.error('Error deciding action:', error);
    return { action: 'generate', url: '' };
  }
};

// Generate a search query
export const generateSearchQuery = async (apiKey, message, conversationContext) => {
  try {
    await sleep(1000);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Generate a search query based on the user's message and context to find relevant information on the web.

User's message: "${message}"
User's context: ${conversationContext.join('\n')}

Search Query:`;

    const result = await model.generateContent(prompt);
    const searchQuery = result.response.text().trim();

    console.log('Search query:', searchQuery);

    return searchQuery;
  } catch (error) {
    console.error('Error generating search query:', error);
    return '';
  }
};

// Perform web search and fetch content from each link
export const performWebSearchProcess = async (apiKey, message, conversationContext) => {
  try {
    const searchDetails = await performWebSearch(
      apiKey,
      message,
      conversationContext
    );

    let additionalContext = `\nWeb Search Results:\n${searchDetails}`;

    // Extract URLs from search results
    const urls = extractUrlsFromSearchResults(searchDetails);

    // Fetch content from each URL
    for (const url of urls) {
      const linkContent = await fetchLinkContent(url);
      additionalContext += `\nContent from ${url}:\n${linkContent}`;
    }

    return additionalContext;
  } catch (error) {
    console.error('Error in web search process:', error);
    return '';
  }
};

// Perform web search
export const performWebSearch = async (apiKey, message, conversationContext) => {
  const webQuery = await generateSearchQuery(apiKey, message, conversationContext);

  try {
    const response = await fetch(
      `https://websearch.arman-dogru.workers.dev/?query=${encodeURIComponent(
        webQuery
      )}`
    );
    const searchResults = await response.json();
    console.log('Search query:', webQuery);

    let searchDetails = 'Searched web:\n';
    searchResults.forEach((result, index) => {
      searchDetails += `Result ${index + 1}:\nTitle: ${result.title}\nSnippet: ${result.snippet}\nLink: ${result.link}\n\n`;
    });

    console.log('Searched web')

    return searchDetails;
  } catch (error) {
    console.error('Error performing web search:', error);
    return '';
  }
};

// Extract URLs from search results text
export const extractUrlsFromSearchResults = (searchDetails) => {
  const urlRegex = /Link:\s*(.*)/g;
  let urls = [];
  let match;
  while ((match = urlRegex.exec(searchDetails)) !== null) {
    urls.push(match[1].trim());
  }
  return urls;
};

// Fetch content from a URL
export const fetchLinkContent = async (url) => {
  try {
    console.log('Fetching link content:', url);
    const response = await fetch(
      `https://openlink.arman-dogru.workers.dev/?url=${encodeURIComponent(url)}`
    );
    const content = await response.text();

    return content;
  } catch (error) {
    console.error('Error fetching link content:', error);
    return '';
  }
};

// Generate AI response
export const generateAIResponse = async (apiKey, context, message) => {
  try {
    await sleep(1000);
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const aiPrompt = `You are an AI assistant that provides detailed and helpful answers to the user's questions, using the conversation context and any relevant web search results or content fetched from links.

Conversation context:
${context}

User's message: "${message}"

Based on the above, provide a detailed and informative answer to the user's question, incorporating any relevant information from the web search results or link content.

**Your response should be formatted in markdown, using appropriate headings, lists, code blocks, bold and italic text where necessary. Ensure that the markdown syntax is correct, with proper line breaks and spacing.**

Your response should be clear, concise, and directly answer the user's question.`;

    const result = await model.generateContent(aiPrompt);

    return result.response.text();
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};
