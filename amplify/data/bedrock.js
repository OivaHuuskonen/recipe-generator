export function request(ctx) {
  const { ingredients = [] } = ctx.args;
  
  // Varmistetaan että ingredients on array
  const ingredientList = Array.isArray(ingredients) ? ingredients : [ingredients];
  
  console.log('Sending request with ingredients:', ingredientList);
  
  return {
      resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
      method: "POST",
      params: {
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              anthropic_version: "bedrock-2023-05-31",
              max_tokens: 1000,
              messages: [
                  {
                      role: "user",
                      content: `Create a recipe using these ingredients: ${ingredientList.join(", ")}`
                  }
              ]
          })
      }
  };
}

export function response(ctx) {
  console.log('Raw response from Bedrock:', ctx.result);
  
  try {
      if (!ctx.result || !ctx.result.body) {
          console.error('No response body from Bedrock');
          return {
              body: "Error: No response from recipe generator",
              error: "Empty response"
          };
      }

      const parsedBody = JSON.parse(ctx.result.body);
      console.log('Parsed response:', parsedBody);

      // Claude 3 vastausformaatti
      if (parsedBody.messages && parsedBody.messages[0]) {
          return {
              body: parsedBody.messages[0].content,
              error: null
          };
      }

      // Vaihtoehtoinen formaatti
      if (parsedBody.content) {
          return {
              body: parsedBody.content,
              error: null
          };
      }

      console.error('Unexpected response format:', parsedBody);
      return {
          body: "Error: Unexpected response format from recipe generator",
          error: "Invalid format"
      };
  } catch (error) {
      console.error('Error processing response:', error);
      return {
          body: "Error: Could not process recipe generator response",
          error: error.message
      };
  }
}







/*export function request(ctx) {
  const { ingredients = [] } = ctx.args;

  // Construct the prompt with the provided ingredients
  const prompt = `Would you suggest me a recipe idea using these ingredients: ${ingredients.join(", ")}.`;

  return {
    resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: prompt
          },
        ],
      }),
    },
  };
}

export function response(ctx) {
  try {
      // Parse the response body
      const parsedBody = JSON.parse(ctx.result.body);
      
      // Claude 3 vastaus formaatti on hieman erilainen
      const responseText = parsedBody.messages?.[0]?.content?.[0]?.text 
          || parsedBody.content?.[0]?.text 
          || parsedBody.completion 
          || "No recipe generated";
      
      return {
          body: responseText,
          error: null
      };
  } catch (error) {
      console.error('Error processing Bedrock response:', error);
      return {
          body: null,
          error: error.message
      };
  }
}


export function request(ctx) {
    const { ingredients = [] } = ctx.args;
  
    // Construct the prompt with the provided ingredients
    const prompt = `Would you suggest me a recipe idea using these ingredients: ${ingredients.join(", ")}.`;
  
    // Return the request configuration
    return {
      resourcePath: `/model/anthropic.claude-3-sonnet-20240229-v1:0/invoke`,
      method: "POST",
      params: {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `\n\nHuman: ${prompt}\n\nAssistant:`,
                },
              ],
            },
          ],
        }),
      },
    };
  }
  
  export function response(ctx) {
    // Parse the response body
    const parsedBody = JSON.parse(ctx.result.body);
    // Extract the text content from the response
    const res = {
      body: parsedBody.content[0].text,
    };
    // Return the response
    return res;
  }*/