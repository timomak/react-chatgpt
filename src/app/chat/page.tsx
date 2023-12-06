import CustomChatScreen from "@/components/custom-chat-screen/custom-chat-screen";

export default function Page() {
    return (
        <CustomChatScreen model={'gpt-4'} instructionsPrompt={"You are a helpful assistant."} />
    )
}