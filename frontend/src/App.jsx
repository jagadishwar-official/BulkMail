
import { useState } from "react"
import axios from "axios"
import * as XLSX from "xlsx"

function App() {

  const [msg, setmsg] = useState("")
  const [status, setstatus] = useState(false)
  const [emailList, setEmailList] = useState([])

  function handlemsg(evt) {
    setmsg(evt.target.value)
  }

  function handlefile(event) {
    const file = event.target.files[0]
    console.log(file)

    const reader = new FileReader()

    reader.onload = function (event) {
      const data = event.target.result
      const workbook = XLSX.read(data, { type: "binary" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: "A" })
      const totalemail = emailList.map(function (item) {
        return item.A
      })
      console.log(totalemail)
      setEmailList(totalemail)
    }

    reader.readAsBinaryString(file)
  }


function send() {
  setstatus(true)

  axios.post(`${import.meta.env.VITE_API_URL}/sendemail`, { msg: msg, emailList: emailList })
    .then(function (data) {
if (data.data.success === true) {
  alert("Email Sent Successfully")
}
else {
  alert("Failed")
}
    })
    .catch(function (error) {
      console.log("Email error:", error)
      alert("Failed to send emails. Check the backend terminal.")
    })
    .finally(function () {
      setstatus(false)
    })
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200 text-slate-800">

      <div className="border-b border-blue-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <h1 className="text-2xl font-bold text-blue-950">Bulk<span className="text-blue-600">Mail</span></h1>
          <p className="text-lg font-medium text-blue-700 ">Bulk Email Sender</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-8 pt-12 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">Simple Email Automation</p>
        <h2 className="text-3xl font-bold leading-tight text-blue-950 sm:text-5xl">Send Multiple <span className="text-blue-600">Emails at Once</span></h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Write your message, upload an Excel file with email addresses, and reach your audience quickly and easily.</p>
      </div>


      <div className="mx-auto max-w-4xl px-4 pb-12">
        <div className="rounded-3xl border border-white bg-white/95 p-5 shadow-2xl shadow-blue-900/10 sm:p-8">

          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-blue-950">Email Details</h3>
              <p className="mt-1 text-sm text-slate-500">Prepare your message and recipient list.</p>
            </div>
            <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700">Excel Upload</span>
          </div>

          <label className="mb-2 block text-sm font-semibold text-blue-950">Email Message</label>
          <textarea onChange={handlemsg} value={msg} className="h-40 w-full resize-y rounded-xl border border-blue-200 bg-blue-50/30 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" placeholder="Enter the email text ...."></textarea>

          <div className="mt-6">

            <h3 className="mb-2 text-sm font-semibold text-blue-950">Upload Email List</h3>
            <p className="mb-3 text-sm text-slate-500">Select an Excel file containing email addresses in column A.</p>

            <div className="rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 px-5 py-8 text-center hover:border-blue-500">
             
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                ✉️
              </div>

              <p className="font-medium text-blue-950">Upload your Excel file</p>
              <p className="mt-1 text-sm text-slate-500">Choose a file from your computer</p>
              <input type="file" onChange={handlefile} accept=".xlsx,.xls" className="mx-auto mt-5  block w-full max-w-sm cursor-pointer rounded-lg border border-blue-200 bg-white text-sm text-slate-600 file:mr-4 file:cursor-pointer file:border-0 file:bg-blue-600 file:px-4 file:py-3 file:text-white hover:file:bg-blue-700" />
              <p className="mt-3 text-xs text-slate-500">Excel files only (.xlsx, .xls)</p>
            </div>
          </div>


          <div className="mt-5 flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4">
            
            <div>
              <p className="font-semibold text-blue-950">Total Emails in the file</p>
              <p className="mt-1 text-sm text-slate-500">Recipients loaded from your Excel file</p>
            </div>

            <span className="text-3xl font-bold tabular-nums text-blue-600">{emailList.length}</span>
          </div>

          <button onClick={send} className="mt-5 w-full rounded-4xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue transition hover:bg-blue-700 ">{status ? "Sending..." : "Send Emails"}</button>
          <p className="mt-3 text-center text-md text-slate-500">Please check your message and recipient list before sending.</p>

        </div>
      </div>


      <footer className="border-t border-blue-200 bg-white px-5 py-6">

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <h1 className="text-2xl font-bold text-blue-950">Bulk<span className="text-blue-600">Mail</span></h1>
          <p className="text-md text-slate-500">Send emails easily, all in one place.</p>
          <p className="text-md text-slate-500">© 2026 BulkMail</p>
        </div>

      </footer>

    </div>
  )
}

export default App
