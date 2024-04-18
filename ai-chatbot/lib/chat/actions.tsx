import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  render,
  createStreamableValue
} from 'ai/rsc'
//import OpenAI from 'openai'

import { spawn } from 'child_process'

import {
  spinner,
  BotCard,
  BotMessage,
  SystemMessage,
  Stock,
  Purchase
} from '@/components/stocks'

import { z } from 'zod'
import { EventsSkeleton } from '@/components/stocks/events-skeleton'
import { Events } from '@/components/stocks/events'
import { StocksSkeleton } from '@/components/stocks/stocks-skeleton'
import { Stocks } from '@/components/stocks/stocks'
import { StockSkeleton } from '@/components/stocks/stock-skeleton'
import { Button } from '@/components/ui/button'
import {
  formatNumber,
  runAsyncFnWithoutBlocking,
  sleep,
  nanoid
} from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { Chat } from '@/lib/types'
import { auth } from '@/auth'
import {parseData} from "./steam"

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || ''
// })

async function confirmPurchase(symbol: string, price: number, amount: number) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const purchasing = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2">
        Purchasing {amount} ${symbol}...
      </p>
    </div>
  )

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    await sleep(1000)

    purchasing.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        {spinner}
        <p className="mb-2">
          Purchasing {amount} ${symbol}... working on it...
        </p>
      </div>
    )

    await sleep(1000)

    purchasing.done(
      <div>
        <p className="mb-2">
          You have successfully purchased {amount} ${symbol}. Total cost:{' '}
          {formatNumber(amount * price)}
        </p>
      </div>
    )

    systemMessage.done(
      <SystemMessage>
        You have purchased {amount} shares of {symbol} at ${price}. Total cost ={' '}
        {formatNumber(amount * price)}.
      </SystemMessage>
    )

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages.slice(0, -1),
        {
          id: nanoid(),
          role: 'function',
          name: 'showStockPurchase',
          content: JSON.stringify({
            symbol,
            price,
            defaultAmount: amount,
            status: 'completed'
          })
        },
        {
          id: nanoid(),
          role: 'system',
          content: `[User has purchased ${amount} shares of ${symbol} at ${price}. Total cost = ${
            amount * price
          }]`
        }
      ]
    })
  })

  return {
    purchasingUI: purchasing.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value
    }
  }
}

async function executePythonScript(args: string[]): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', args);

    const output: string[] = [];

    // Handle stdout
    pythonProcess.stdout.on('data', (data) => {
      output.push(data.toString());
    });

    // Handle stderr
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error from Python script: ${data}`);
      reject(data.toString());
    });

    // Handle process exit
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(`Python script exited with non-zero exit code: ${code}`);
      }
    });
  });
}

async function generateParams(list: string[]) {
  const output = [];
  output.push(list.map((value, index) => `id${index + 1}=${value}`).join('&'));
  for (let i = 0; i < 8; i++) {
    const removedElement = list.shift();
    if (typeof removedElement === 'string') {
      list.push(removedElement);
    }
    output.push(list.map((value, index) => `id${index + 1}=${value}`).join('&'));
  }
  return output;
}

async function submitUserMessage(content: string) {
  'use server'
  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })
  const appIds: string[] = [];
  try {
    const rawOutput = await executePythonScript(['../python/hybrid_recommender.py', content]);
    // Clean up the string and parse it as JSON
    const cleanedOutput = rawOutput[0].replace(/\n/g, ''); // Remove newline characters
    const appIdsAsInt = JSON.parse(cleanedOutput); // Parse JSON string to array
    appIds.length = 0; // Clear existing contents of appIds array
    appIds.push(...appIdsAsInt.map((id: number) => id.toString())); // Update appIds array with string values

    // Do something with the appIds array here
  } catch (error) {
    console.error('Error executing Python script:', error);
    // Handle error here
  }
  
  //console.log(appIds)
  // Define an async function to fetch data for each appId
  async function fetchDataForAppIds(appIds:string[]) {
  const fetchedData = [];
  //console.log(appIds)
  // Iterate over each appId and fetch data
  for (const appId of appIds) {
    try {
      const data = await parseData(appId);
      fetchedData.push(data);
    } catch (error) {
      console.error(`Error fetching data for appId ${appId}:`, error);
    }
  }

  return fetchedData;
}

try {
  // Fetch data for all appIds
  const fetchedData = await fetchDataForAppIds(appIds);
  //console.log(fetchedData)

  const urlParams = await generateParams(appIds)
  // Construct URLs using the app IDs
  const urls = urlParams.map((appId, index) => `http://localhost:3002/recommand?${appId}`);
    
  // Construct buttons using the URLs and fetched data
  const buttons = fetchedData.map((data, index) => ({
    id: nanoid(),
    text: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{fontSize:"18px"}}>TOP {`${index+1}`}</h3>
        <img src={data?.image} alt={`Game Image`} style={{ width: 'auto', height: '100px', marginBottom: '5px' }} />
        <span style={{ textAlign: 'center', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis'}}>{`${data?.title ?? 'Unknown'}`}</span>
        <p>Price: {`${data?.offer ?? 'Unknown'}`}</p>
      </div>
    ), // Assuming 'title' is the property for game name
    url: urls[index]
  }));



  // Update AI state with "complete" message
  aiState.done({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'assistant',
        content: 'complete'
      }
    ]
  })

  return {
    id: nanoid(),
    display: (
      <div>
        <BotMessage content={'Below is the recommended game:'} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {/* Map over buttons and create anchor elements */}
          {buttons.map(button => (
            <a key={button.id} href={button.url} target="_blank" rel="noopener noreferrer" style={{ width: '200px', height: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none' }}>
              {/* Render button */}
              <Button style={{ width: '100%', height:'auto' }}>{button.text}</Button>
            </a>
          ))}
        </div>
      </div>
    )
  }} catch(error) {
    console.error('Error processing data:', error);
    // Handle error if necessary
  }
}

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    confirmPurchase
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  unstable_onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState()

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  unstable_onSetAIState: async ({ state, done }) => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const userId = session.user.id as string
      const path = `/chat/${chatId}`
      const title = messages[0].content.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      }

      await saveChat(chat)
    } else {
      return
    }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'function' ? (
          message.name === 'listStocks' ? (
            <BotCard>
              <Stocks props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'showStockPrice' ? (
            <BotCard>
              <Stock props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'showStockPurchase' ? (
            <BotCard>
              <Purchase props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'getEvents' ? (
            <BotCard>
              <Events props={JSON.parse(message.content)} />
            </BotCard>
          ) : null
        ) : message.role === 'user' ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        )
    }))
}
