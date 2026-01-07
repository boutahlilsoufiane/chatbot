"use client"

//TODO
//Add fetch data skeleton

import { useActionState, useEffect, useState } from "react"
import axios from "./axios"
import { getAnswer } from "./actions";


interface History {
  _id: string;
  message: string;
  sender: string;
  date: Date;
}

export default function Home() {

  const [messages, setMessage] = useState<History[]>([])
  const [isFetchFailed, setIsFetchFailed] = useState(false)
  const [state, formAction, isPending] = useActionState(getAnswer, null);

  useEffect(() => {
    fetchHistory()
  }, [])

  useEffect(() => {
    if (state?.data) {
      fetchHistory()
    }
  }, [state?.data])


  const fetchHistory = () => {
    axios.get('/history')
      .then(function (response) {
        setIsFetchFailed(false)
        setMessage(response.data)
      })
      .catch(function (error) {
        setIsFetchFailed(true)
      })
  }

  return (

    <div className="flex justify-center  items-center mt-5">
      <div id="chat-content" className="w-full max-w-md bg-white rounded-xl shadow-lg">
        <div className="divide-y divide-white">
          <div className="flex flex-col ml-5 my-auto p-5">
            <div className="font-medium text-lg">Support team</div>
            <div className="text-green-600 text-sm">Active now</div>
          </div>

          {isFetchFailed ? <div className="text-[red] p-5">Couldn't fetch history.</div> : <div className="bg-[#F7F7F7] p-5 space-y-3 shadow-inner">
            {messages?.map(({ sender, message, _id }) => {
              if (sender === "bot") {
                return <div className="flex justify-end" key={_id}>
                  <div className="bg-[#333333] px-3 py-2 text-white rounded-2xl rounded-br-none shadow-md">{message}</div>
                </div>
              } else {
                return <div className="flex justify-start" key={_id}>
                  <div className="bg-white px-3 py-2 text-gray-700 rounded-2xl rounded-bl-none shadow-md">{message}</div>
                </div>
              }
            })}
          </div>}

          <form action={formAction}>
            <div className="p-5">
              <div className="flex w-full">

                <input name="question" className="w-full outline-none border border-gray-200 px-3 py-1.5 rounded-l-md" placeholder="Type message here..." />
                <button  disabled={isPending} type="submit" className="bg-[#333333] px-2.5 rounded-r-md">
                  {
                    isPending ? <svg
                      className="animate-spin w-6 h-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                      : <svg className="w-6 h-6" fill="#FFFFFF" version="1.1" id="Layer_1" viewBox="796 707.122 200 200" >
                        <path d="M798.671,800.534c-1.559,0.651-2.6,2.148-2.667,3.837s0.849,3.264,2.351,4.039l49.397,25.494l10.707,58.754  c0.312,1.707,1.608,3.066,3.3,3.457s3.453-0.262,4.481-1.66l27.193-36.976l65.524,33.817c1.226,0.633,2.679,0.646,3.916,0.037  c1.237-0.61,2.112-1.771,2.358-3.128L996,718.017L798.671,800.534z M869.045,844.893l-21.294-10.99l112.881-81.413L869.045,844.893z  " />
                      </svg>
                  }
                </button>
              </div>
              {state?.error && !isPending && <div className="text-[red] text-sm mt-1">{state.error}</div>}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
