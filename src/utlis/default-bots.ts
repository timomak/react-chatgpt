import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/index.mjs";

const translatorBotTool: Array<Assistant.CodeInterpreter | Assistant.Retrieval | Assistant.Function> = [{
    type: 'function',
    function: 
        {
            "name": "get_stock_price",
            "description": "Get the current stock price",
            "parameters": {
                "type": "object",
                "properties": {
                    "symbol": {
                        "type": "string",
                        "description": "The stock symbol"
                    }
                },
                "required": [
                    "symbol"
                ]
            }
        }
}]

export   const translatorBot: OpenAI.Beta.Assistant = {
    id: '',
    description: '',
    name: '',
    instructions: '',
    created_at: 0,
    file_ids: [],
    metadata: undefined,
    model: '',
    object: 'assistant',
    tools: translatorBotTool,
}