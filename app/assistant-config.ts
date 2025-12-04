export let assistantId = "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"; // set your assistant ID here

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
}
