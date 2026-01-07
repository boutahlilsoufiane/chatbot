import axios from "./axios"

export async function getAnswer(prevState: unknown, queryData: FormData) {
    const question = queryData.get("question")

    if (!question) return {
        error: "field is required"
    }

    try {
    const res = await axios.post("/get-answer", { question })
    return { data: res.data }
  } catch {
    return { error: "Something is wrong, try again!" }
  }

}