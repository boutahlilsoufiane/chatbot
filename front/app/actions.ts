import axios from "./axios"

export async function getAnswer(prevState: unknown, queryData: FormData) {
    await axios.post("/get-answer", {
        question : queryData.get("question")
    })

    return null
}