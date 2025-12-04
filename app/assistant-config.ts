export let assistantId = "asst_g86wiKMJ071Jjxka9iIXUfq2"; // set your assistant ID here

if (assistantId === "") {
  assistantId = process.env.OPENAI_ASSISTANT_ID;
}
