import axios from "./axios"

export async function getAnswer(prevState, queryData) {
    await axios.post("/get-answer", {
        question : queryData.get("question")
    })

    return null
}